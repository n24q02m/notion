/**
 * Tool invocation: the one dispatch path shared by the MCP server and the CLI.
 *
 * `registerTools` (MCP) and the CLI's tool subcommands both call `invokeTool`,
 * so a CLI subcommand runs exactly the handler its MCP tool runs -- there is no
 * second argument parser and no duplicated switch to drift.
 */

import { readFile } from 'node:fs/promises'
import { basename, isAbsolute, join, relative, sep } from 'node:path'
import type { Client } from '@notionhq/client'
import { isJsonObject } from '../json-value.js'
import { type BlocksInput, blocks } from './composite/blocks.js'
import { type CommentsManageInput, commentsManage } from './composite/comments.js'
import { type ConfigInput, config } from './composite/config.js'
import { type ContentConvertInput, contentConvert } from './composite/content.js'
import { type DatabasesInput, databases } from './composite/databases.js'
import { type FileUploadsInput, fileUploads } from './composite/file-uploads.js'
import { type PagesInput, pages } from './composite/pages.js'
import { type UsersInput, users } from './composite/users.js'
import { type WorkspaceInput, workspace } from './composite/workspace.js'
import {
  ALL_TOOL_NAMES,
  ALL_TOOL_NAMES_STRING,
  DOCS_DIR,
  VALID_HELP_TOOL_NAMES,
  VALID_HELP_TOOLS_STRING
} from './definitions.js'
import {
  boundResponseValue,
  DEFAULT_BOUND_HINT,
  DEFAULT_RESPONSE_ITEMS,
  resolveResponseBudget,
  truncationNote,
  UNBOUNDED
} from './helpers/bounds.js'
import { findClosestMatch, NotionMCPError } from './helpers/errors.js'

const BOUNDED_TOOLS = new Set([
  'pages',
  'databases',
  'blocks',
  'users',
  'workspace',
  'comments',
  'content_convert',
  'file_uploads'
])

const LIST_BOUNDED_ACTIONS = new Set(['query', 'search', 'list', 'children', 'from_workspace', 'list_templates'])

/** Overhead allowance above `budget.chars` when `pages.get` already truncated its markdown body. */
const PAGES_ENVELOPE_ALLOWANCE = 2048

function asToolInput<T>(args: Record<string, unknown>): T {
  return args as unknown as T
}

function finalizeBoundedResult(
  name: string,
  args: Record<string, unknown>,
  raw: unknown,
  budget: ReturnType<typeof resolveResponseBudget>
): unknown {
  if (budget.chars === UNBOUNDED && budget.items === UNBOUNDED) {
    return raw
  }

  // `pages.get` already truncates `content` to `max_chars` with legacy `content_*` fields.
  // When only JSON envelope metadata pushes serialized length slightly past `budget.chars`,
  // attach `_truncation` alongside existing fields instead of re-shrinking `content` to 4k.
  if (name === 'pages' && args.action === 'get' && isJsonObject(raw)) {
    const omitted = raw.content_chars_omitted
    if (raw.content_truncated === true && typeof omitted === 'number' && omitted > 0) {
      const returnedChars = JSON.stringify(raw).length
      if (returnedChars <= budget.chars + PAGES_ENVELOPE_ALLOWANCE) {
        const totalChars = returnedChars + omitted
        return {
          ...raw,
          _truncation: {
            truncated: true as const,
            total_characters: totalChars,
            returned_characters: returnedChars,
            note: truncationNote(totalChars, returnedChars, DEFAULT_BOUND_HINT)
          }
        }
      }
    }
  }

  return boundResponseValue(raw, budget, DEFAULT_BOUND_HINT).value
}

/**
 * Run one tool by name and return its handler result.
 *
 * Throws `NotionMCPError` for an unknown tool, an invalid `help` target, a
 * missing documentation file, and anything a composite handler raises -- the
 * MCP handler turns those into `isError` content, the CLI into exit code 1.
 */
export async function invokeTool(
  name: string,
  args: Record<string, unknown>,
  notionClientFactory: () => Promise<Client>
): Promise<unknown> {
  const isBounded = BOUNDED_TOOLS.has(name)
  const action = typeof args.action === 'string' ? args.action : ''
  const hasExplicitLimit = typeof args.limit === 'number'
  const budget = isBounded
    ? resolveResponseBudget(args, {
        items: !hasExplicitLimit && LIST_BOUNDED_ACTIONS.has(action) ? DEFAULT_RESPONSE_ITEMS : UNBOUNDED
      })
    : undefined

  let raw: unknown
  switch (name) {
    case 'pages':
      raw = await pages(await notionClientFactory(), asToolInput<PagesInput>(args))
      break
    case 'databases':
      raw = await databases(await notionClientFactory(), asToolInput<DatabasesInput>(args))
      break
    case 'blocks':
      raw = await blocks(await notionClientFactory(), asToolInput<BlocksInput>(args))
      break
    case 'users':
      raw = await users(await notionClientFactory(), asToolInput<UsersInput>(args))
      break
    case 'workspace':
      raw = await workspace(await notionClientFactory(), asToolInput<WorkspaceInput>(args))
      break
    case 'comments':
      raw = await commentsManage(await notionClientFactory(), asToolInput<CommentsManageInput>(args))
      break
    case 'content_convert':
      raw = await contentConvert(asToolInput<ContentConvertInput>(args))
      break
    case 'config':
      return config(asToolInput<ConfigInput>(args))
    case 'file_uploads':
      raw = await fileUploads(await notionClientFactory(), asToolInput<FileUploadsInput>(args))
      break
    case 'help': {
      const { tool_name } = asToolInput<{ tool_name: string }>(args)
      return readToolDocumentation(tool_name)
    }
    default: {
      const closest = findClosestMatch(name, ALL_TOOL_NAMES)
      const suggestion = closest ? ` Did you mean '${closest}'?` : ''
      throw new NotionMCPError(
        `Unknown tool: ${name}.${suggestion}`,
        'UNKNOWN_TOOL',
        `Available tools: ${ALL_TOOL_NAMES_STRING}`
      )
    }
  }

  return budget ? finalizeBoundedResult(name, args, raw, budget) : raw
}

/**
 * `help` tool body: the documented reference for one tool, read from the docs
 * directory that ships beside the code (and inside the bundled CLI).
 */
async function readToolDocumentation(toolName: string): Promise<{ tool: string; documentation: string }> {
  // Security: validate tool_name against allowlist to prevent path traversal
  if (!VALID_HELP_TOOL_NAMES.has(toolName)) {
    throw new NotionMCPError(
      `Invalid tool name: ${toolName}`,
      'VALIDATION_ERROR',
      `Valid tools: ${VALID_HELP_TOOLS_STRING}`
    )
  }
  // Security: Use basename() to ensure we only look for files directly inside DOCS_DIR,
  // preventing path traversal even if the allowlist validation is bypassed or modified.
  const docFile = `${basename(toolName)}.md`
  const fullPath = join(DOCS_DIR, docFile)
  const rel = relative(DOCS_DIR, fullPath)
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new NotionMCPError('Path traversal attempt detected', 'SECURITY_ERROR', 'Invalid tool_name')
  }

  try {
    const content = await readFile(fullPath, 'utf-8')
    return { tool: toolName, documentation: content }
  } catch {
    throw new NotionMCPError(`Documentation not found for: ${toolName}`, 'DOC_NOT_FOUND', 'Check tool_name')
  }
}
