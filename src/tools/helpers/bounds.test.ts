import { describe, expect, it } from 'vitest'
import {
  boundMarkdown,
  boundResponseValue,
  DEFAULT_BOUND_HINT,
  DEFAULT_RESPONSE_CHARS,
  DEFAULT_RESPONSE_ITEMS,
  getDefaultResponseChars,
  MAX_RESPONSE_CHARS,
  resolveResponseBudget,
  truncationNote,
  UNBOUNDED
} from './bounds.js'

describe('boundMarkdown', () => {
  it('returns short markdown unchanged and truncates oversized markdown with marker', () => {
    expect(boundMarkdown('hello', 10)).toEqual({
      markdown: 'hello',
      truncated: false,
      totalCharacters: 5
    })

    const bounded = boundMarkdown('a'.repeat(50), 20)
    expect(bounded.truncated).toBe(true)
    expect(bounded.totalCharacters).toBe(50)
    expect(bounded.markdown.startsWith('a'.repeat(20))).toBe(true)
    expect(bounded.markdown).toContain('[Truncated: showing 20 of 50 characters (30 omitted).')
  })
})

describe('getDefaultResponseChars', () => {
  it('reads valid NOTION_MAX_RESPONSE_CHARS and falls back cleanly when invalid', () => {
    expect(getDefaultResponseChars({})).toBe(DEFAULT_RESPONSE_CHARS)
    expect(getDefaultResponseChars({ NOTION_MAX_RESPONSE_CHARS: '42000' })).toBe(42_000)
    expect(getDefaultResponseChars({ NOTION_MAX_RESPONSE_CHARS: '100000' })).toBe(MAX_RESPONSE_CHARS)
    expect(getDefaultResponseChars({ NOTION_MAX_RESPONSE_CHARS: '0' })).toBe(DEFAULT_RESPONSE_CHARS)
    expect(getDefaultResponseChars({ NOTION_MAX_RESPONSE_CHARS: '100001' })).toBe(DEFAULT_RESPONSE_CHARS)
    expect(getDefaultResponseChars({ NOTION_MAX_RESPONSE_CHARS: 'abc' })).toBe(DEFAULT_RESPONSE_CHARS)
    expect(getDefaultResponseChars({ NOTION_MAX_RESPONSE_CHARS: '12.5' })).toBe(DEFAULT_RESPONSE_CHARS)
  })
})

describe('resolveResponseBudget', () => {
  it('handles full, default, env override, explicit max_chars, and invalid inputs', () => {
    expect(resolveResponseBudget({})).toEqual({ chars: DEFAULT_RESPONSE_CHARS, items: UNBOUNDED })
    expect(
      resolveResponseBudget({}, { items: DEFAULT_RESPONSE_ITEMS }, { NOTION_MAX_RESPONSE_CHARS: '15000' })
    ).toEqual({
      chars: 15_000,
      items: DEFAULT_RESPONSE_ITEMS
    })
    expect(resolveResponseBudget({ full: true, max_chars: 100 }, { items: 50 })).toEqual({
      chars: UNBOUNDED,
      items: UNBOUNDED
    })
    expect(resolveResponseBudget({ max_chars: 5_000 })).toEqual({ chars: 5_000, items: UNBOUNDED })

    for (const bad of [0, -1, 1.5, MAX_RESPONSE_CHARS + 1, '5000', Number.NaN]) {
      expect(() => resolveResponseBudget({ max_chars: bad })).toThrow(
        `max_chars must be an integer between 1 and ${MAX_RESPONSE_CHARS}`
      )
    }
  })
})

describe('boundResponseValue', () => {
  it('returns payloads within budget unchanged by reference', () => {
    const small = { action: 'query', results: [{ id: '1' }] }
    const res = boundResponseValue(small, resolveResponseBudget({}))
    expect(res.truncated).toBe(false)
    expect(res.value).toBe(small)

    const scalar = boundResponseValue('plain' as unknown, resolveResponseBudget({ max_chars: 1 }))
    expect(scalar).toEqual({ value: 'plain', truncated: false })
  })

  it('caps oversized listing arrays first and records omitted_items + note', () => {
    const payload = {
      action: 'query',
      total: 80,
      next_cursor: 'cursor-keep-me',
      results: Array.from({ length: 80 }, (_, i) => ({ id: `row-${i}`, title: `Row ${i}` }))
    }

    const res = boundResponseValue(
      payload,
      resolveResponseBudget({}, { items: DEFAULT_RESPONSE_ITEMS }),
      DEFAULT_BOUND_HINT
    )
    expect(res.truncated).toBe(true)
    const value = res.value as Record<string, any>
    expect(value.results).toHaveLength(50)
    expect(value.next_cursor).toBe('cursor-keep-me')
    expect(value._truncation).toMatchObject({
      truncated: true,
      omitted_items: [{ path: '$.results', returned: 50, total: 80 }]
    })
    expect(value._truncation.note).toBe(
      truncationNote(value._truncation.total_characters, value._truncation.returned_characters, DEFAULT_BOUND_HINT)
    )
  })

  it('wraps top-level arrays and avoids overwriting existing _truncation keys', () => {
    const arr = Array.from({ length: 5 }, (_, i) => `item-${i}`)
    const wrapped = boundResponseValue(arr, resolveResponseBudget({}, { items: 2 }))
    expect(wrapped.truncated).toBe(true)
    expect(wrapped.value).toMatchObject({
      items: ['item-0', 'item-1'],
      _truncation: {
        truncated: true,
        omitted_items: [{ path: '$', returned: 2, total: 5 }]
      }
    })

    const shadowed = boundResponseValue({ _truncation: 'existing', body: 'x'.repeat(2_000) }, { chars: 500, items: 50 })
    expect(shadowed.truncated).toBe(true)
    expect((shadowed.value as Record<string, any>)._truncation).toBe('existing')
    expect((shadowed.value as Record<string, any>)._response_truncation.truncated).toBe(true)
  })

  it('preserves pagination cursors even under tight budgets and falls back to carryRootObject', () => {
    const longCursor = 'cursor_'.repeat(30)
    const payload = {
      next_cursor: longCursor,
      bigA: 'a'.repeat(500),
      bigB: 'b'.repeat(500)
    }

    const res = boundResponseValue(payload, { chars: 260, items: UNBOUNDED })
    expect(res.truncated).toBe(true)
    const value = res.value as Record<string, any>
    expect(value.next_cursor).toBe(longCursor)
    expect(value._truncation.truncated).toBe(true)
  })

  it('skips shrinking completely when budget is UNBOUNDED', () => {
    const big = { results: Array.from({ length: 120 }, (_, i) => i), text: 'z'.repeat(30_000) }
    const res = boundResponseValue(big, resolveResponseBudget({ full: true }))
    expect(res.truncated).toBe(false)
    expect(res.value).toBe(big)
  })
})
