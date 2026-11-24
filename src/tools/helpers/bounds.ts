/**
 * Response bounds for tool payloads with no natural size limit.
 *
 * Page reads bound their markdown body by default (`DEFAULT_MARKDOWN_MAX_CHARS`
 * = 20,000, raisable via `max_chars` or bypassed via `full: true` / paged via
 * `content_limit`/`content_cursor`). List, query, search, block-tree, and
 * comment reads share the same standardized envelope cap so auto-paginated
 * responses cannot overflow an MCP client's token window.
 *
 * Truncation is never silent and never breaks pagination:
 * - payloads carry structured `_truncation` metadata with true sizes and a hint;
 * - array truncation records `omitted_items: [{ path, returned, total }]`;
 * - cursor fields (`next_cursor` and friends) are never truncated or dropped.
 */

import { isJsonObject } from '../../json-value.js'
import { NotionMCPError } from './errors.js'

export const DEFAULT_MARKDOWN_MAX_CHARS = 20_000
export const MAX_MARKDOWN_MAX_CHARS = 100_000

/** Characters kept by default across bounded responses. */
export const DEFAULT_RESPONSE_CHARS = DEFAULT_MARKDOWN_MAX_CHARS
/** Highest character budget a caller may request with `max_chars`. */
export const MAX_RESPONSE_CHARS = MAX_MARKDOWN_MAX_CHARS
/** Items kept by default from an unbounded listing array. */
export const DEFAULT_RESPONSE_ITEMS = 50
/** `full: true` -- no character and no item budget. */
export const UNBOUNDED = Number.POSITIVE_INFINITY

export const DEFAULT_BOUND_HINT =
  'Pass max_chars (up to 100000), full: true for the complete payload, or narrow with limit/filters/content_limit.'

const CURSOR_KEYS: Readonly<Record<string, true>> = {
  next_cursor: true,
  nextCursor: true,
  content_cursor: true,
  start_cursor: true,
  cursor: true
}

export interface BoundedMarkdown {
  markdown: string
  truncated: boolean
  totalCharacters: number
}

export interface ResponseBudget {
  chars: number
  items: number
}

export interface TruncationList {
  path: string
  returned: number
  total: number
}

export interface TruncationMetadata {
  truncated: true
  total_characters: number
  returned_characters: number
  omitted_items?: TruncationList[]
  note: string
}

/**
 * Bound markdown to a character budget. Truncation is never silent: the kept
 * text ends with a marker naming the true length and how to fetch the rest.
 */
export function boundMarkdown(markdown: string, maxChars: number): BoundedMarkdown {
  const totalCharacters = markdown.length
  if (totalCharacters <= maxChars) {
    return { markdown, truncated: false, totalCharacters }
  }

  const omitted = totalCharacters - maxChars
  return {
    markdown: `${markdown.slice(0, maxChars)}\n\n[Truncated: showing ${maxChars} of ${totalCharacters} characters (${omitted} omitted). Pass a larger max_chars (up to ${MAX_MARKDOWN_MAX_CHARS}) or page blocks with content_limit/content_cursor.]`,
    truncated: true,
    totalCharacters
  }
}

/**
 * Resolve default response character limit from `NOTION_MAX_RESPONSE_CHARS`,
 * falling back to `DEFAULT_RESPONSE_CHARS` (20,000) when unset or invalid.
 */
export function getDefaultResponseChars(env: Record<string, string | undefined> = process.env): number {
  const raw = env.NOTION_MAX_RESPONSE_CHARS?.trim()
  if (!raw || !/^\d+$/.test(raw)) return DEFAULT_RESPONSE_CHARS
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_RESPONSE_CHARS) {
    return DEFAULT_RESPONSE_CHARS
  }
  return parsed
}

export function truncationNote(totalCharacters: number, keptCharacters: number, hint: string): string {
  const omitted = Math.max(totalCharacters - keptCharacters, 0)
  return `[Content truncated: showing ${keptCharacters} of ${totalCharacters} characters (${omitted} omitted). ${hint}]`
}

/**
 * Validate `max_chars` and resolve the response budget.
 * `full: true` removes both char and item caps.
 */
export function resolveResponseBudget(
  input: { max_chars?: unknown; full?: unknown },
  spec: { chars?: number; items?: number } = {},
  env: Record<string, string | undefined> = process.env
): ResponseBudget {
  if (input.full === true) return { chars: UNBOUNDED, items: UNBOUNDED }

  const items = spec.items ?? UNBOUNDED
  const maxChars = input.max_chars
  if (maxChars === undefined) {
    return { chars: spec.chars ?? getDefaultResponseChars(env), items }
  }
  if (typeof maxChars !== 'number' || !Number.isInteger(maxChars) || maxChars < 1 || maxChars > MAX_RESPONSE_CHARS) {
    throw new NotionMCPError(
      `max_chars must be an integer between 1 and ${MAX_RESPONSE_CHARS}`,
      'VALIDATION_ERROR',
      `Provide a max_chars between 1 and ${MAX_RESPONSE_CHARS}`
    )
  }
  return { chars: maxChars, items }
}

function childPath(path: string, key: string | number): string {
  return typeof key === 'number' ? `${path}[${key}]` : `${path}.${key}`
}

interface ShrinkResult {
  value: Record<string, unknown> | unknown[]
  lists: TruncationList[]
}

function shrinkValue(
  root: Record<string, unknown> | unknown[],
  caps: { items: number; stringChars: number },
  path = '$'
): ShrinkResult {
  const lists: TruncationList[] = []

  const walk = (node: unknown, at: string): unknown => {
    if (Array.isArray(node)) {
      const kept = caps.items === UNBOUNDED ? node : node.slice(0, caps.items)
      if (kept.length < node.length) lists.push({ path: at, returned: kept.length, total: node.length })
      return kept.map((item, index) => walk(item, childPath(at, index)))
    }
    if (typeof node === 'string') {
      if (caps.stringChars === UNBOUNDED || node.length <= caps.stringChars) return node
      return `${node.slice(0, caps.stringChars)}[+${node.length - caps.stringChars} chars]`
    }
    if (isJsonObject(node)) {
      const out: Record<string, unknown> = {}
      for (const [key, child] of Object.entries(node)) {
        out[key] = CURSOR_KEYS[key] ? child : walk(child, childPath(at, key))
      }
      return out
    }
    return node
  }

  const shrunk = walk(root, path) as Record<string, unknown> | unknown[]
  return { value: shrunk, lists }
}

function serializedSize(value: unknown): number {
  return (JSON.stringify(value) ?? '').length
}

function buildTruncationEntry(
  totalCharacters: number,
  keptCharacters: number,
  lists: TruncationList[],
  hint: string
): TruncationMetadata {
  const entry: TruncationMetadata = {
    truncated: true,
    total_characters: totalCharacters,
    returned_characters: keptCharacters,
    note: truncationNote(totalCharacters, keptCharacters, hint)
  }
  if (lists.length > 0) {
    entry.omitted_items = lists
  }
  return entry
}

function attachTruncation(
  value: Record<string, unknown> | unknown[],
  lists: TruncationList[],
  totalCharacters: number,
  keptCharacters: number,
  hint: string
): Record<string, unknown> {
  const entry = buildTruncationEntry(totalCharacters, keptCharacters, lists, hint)
  if (Array.isArray(value)) {
    return { items: value, _truncation: entry }
  }
  const key = '_truncation' in value ? '_response_truncation' : '_truncation'
  return { ...value, [key]: entry }
}

function carryRootObject(
  value: Record<string, unknown> | unknown[],
  lists: TruncationList[],
  totalCharacters: number,
  hint: string,
  budgetChars: number
): Record<string, unknown> {
  const entries: Array<[string, unknown]> = Array.isArray(value) ? [['items', value]] : Object.entries(value)
  const ordered = [...entries.filter(([key]) => CURSOR_KEYS[key]), ...entries.filter(([key]) => !CURSOR_KEYS[key])]
  const carried: Record<string, unknown> = {}
  for (const [key, entry] of ordered) {
    const trial = { ...carried, [key]: entry }
    const withMeta = attachTruncation(trial, lists, totalCharacters, serializedSize(trial), hint)
    if (serializedSize(withMeta) <= budgetChars || CURSOR_KEYS[key]) {
      carried[key] = entry
    }
  }
  return attachTruncation(carried, lists, totalCharacters, serializedSize(carried), hint)
}

/**
 * Bound any structured tool response to character and array-item budgets.
 * Returns the original reference unchanged when already within budget.
 */
export function boundResponseValue<T>(
  value: T,
  budget: ResponseBudget,
  hint = DEFAULT_BOUND_HINT
): { value: T | Record<string, unknown>; truncated: boolean } {
  if (budget.chars === UNBOUNDED && budget.items === UNBOUNDED) {
    return { value, truncated: false }
  }
  if (!Array.isArray(value) && !isJsonObject(value)) {
    return { value, truncated: false }
  }

  const totalCharacters = serializedSize(value)
  const itemCaps =
    budget.items === UNBOUNDED ? [UNBOUNDED, 1, 0] : [budget.items, Math.max(1, Math.floor(budget.items / 2)), 1, 0]
  const stringCaps = [UNBOUNDED, 4_000, 1_000, 256, 64]

  let tightest = shrinkValue(value, { items: 0, stringChars: 64 })
  for (const itemCap of itemCaps) {
    for (const stringCap of stringCaps) {
      const shrunk = shrinkValue(value, { items: itemCap, stringChars: stringCap })
      const untouched = shrunk.lists.length === 0 && stringCap === UNBOUNDED
      if (untouched) {
        if (totalCharacters <= budget.chars) return { value, truncated: false }
        continue
      }
      tightest = shrunk
      const keptCharacters = serializedSize(shrunk.value)
      const candidate = attachTruncation(shrunk.value, shrunk.lists, totalCharacters, keptCharacters, hint)
      if (serializedSize(candidate) <= budget.chars) {
        return { value: candidate, truncated: true }
      }
    }
  }

  return {
    value: carryRootObject(tightest.value, tightest.lists, totalCharacters, hint, budget.chars),
    truncated: true
  }
}
