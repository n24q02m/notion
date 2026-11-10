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
import { findClosestMatch, NotionMCPError } from './helpers/errors.js'

/**
 * Tool arguments arrive as decoded JSON (MCP `arguments`, or flags parsed by
 * the CLI). Composite handlers validate their own fields and report failures as
 * `NotionMCPError`, so this is the boundary between untyped JSON and a
 * handler's declared input -- not a second validation layer.
 */
function asToolInput<T>(args: Record<string, unknown>): T {
  return args as unknown as T
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
  switch (name) {
    case 'pages':
      return pages(await notionClientFactory(), asToolInput<PagesInput>(args))
    case 'databases':
      return databases(await notionClientFactory(), asToolInput<DatabasesInput>(args))
    case 'blocks':
      return blocks(await notionClientFactory(), asToolInput<BlocksInput>(args))
    case 'users':
      return users(await notionClientFactory(), asToolInput<UsersInput>(args))
    case 'workspace':
      return workspace(await notionClientFactory(), asToolInput<WorkspaceInput>(args))
    case 'comments':
      return commentsManage(await notionClientFactory(), asToolInput<CommentsManageInput>(args))
    case 'content_convert':
      return contentConvert(asToolInput<ContentConvertInput>(args))
    case 'config':
      return config(asToolInput<ConfigInput>(args))
    case 'file_uploads':
      return fileUploads(await notionClientFactory(), asToolInput<FileUploadsInput>(args))
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
