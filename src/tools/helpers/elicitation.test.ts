import type { ServerContext } from '@modelcontextprotocol/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

const elicitWithFallbackMock = vi.hoisted(() => vi.fn())

vi.mock('@n24q02m/hull/extensions', () => ({
  elicitWithFallback: elicitWithFallbackMock
}))

import { checkSensitiveOperation } from './elicitation.js'

const FAKE_CTX = { mcpReq: { signal: new AbortController().signal } } as unknown as ServerContext

describe('checkSensitiveOperation', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('proceeds immediately for non-sensitive tools and actions', async () => {
    await expect(checkSensitiveOperation('help', { tool: 'pages' })).resolves.toEqual({
      status: 'proceed',
      source: 'not_sensitive'
    })
    await expect(checkSensitiveOperation('pages', { action: 'get', page_id: 'p1' }, FAKE_CTX)).resolves.toEqual({
      status: 'proceed',
      source: 'not_sensitive'
    })
    await expect(checkSensitiveOperation('pages', { action: 'update', page_id: 'p1' }, FAKE_CTX)).resolves.toEqual({
      status: 'proceed',
      source: 'not_sensitive'
    })
    await expect(checkSensitiveOperation('blocks', { action: 'children', block_id: 'b1' }, FAKE_CTX)).resolves.toEqual({
      status: 'proceed',
      source: 'not_sensitive'
    })
    await expect(
      checkSensitiveOperation('databases', { action: 'query', database_id: 'd1' }, FAKE_CTX)
    ).resolves.toEqual({
      status: 'proceed',
      source: 'not_sensitive'
    })
    await expect(checkSensitiveOperation('config', { action: 'setup_status' }, FAKE_CTX)).resolves.toEqual({
      status: 'proceed',
      source: 'not_sensitive'
    })
    await expect(checkSensitiveOperation('pages', { action: 123 }, FAKE_CTX)).resolves.toEqual({
      status: 'proceed',
      source: 'not_sensitive'
    })
    expect(elicitWithFallbackMock).not.toHaveBeenCalled()
  })

  it('proceeds with headless source when called outside MCP request context (CLI)', async () => {
    const result = await checkSensitiveOperation('pages', { action: 'archive', page_ids: ['p1'] })
    expect(result).toEqual({ status: 'proceed', source: 'headless' })
    expect(elicitWithFallbackMock).not.toHaveBeenCalled()
  })

  it.each([
    ['pages', { action: 'archive', page_ids: ['p1'] }, 'confirm_pages_archive'],
    ['pages', { action: 'update', page_id: 'p1', archived: true }, 'confirm_pages_destructive_update'],
    ['pages', { action: 'update', page_id: 'p1', replace: true }, 'confirm_pages_destructive_update'],
    ['blocks', { action: 'delete', block_id: 'b1' }, 'confirm_blocks_delete'],
    ['databases', { action: 'delete_page', database_id: 'd1', page_ids: ['p1'] }, 'confirm_databases_delete_page'],
    ['config', { action: 'setup_reset' }, 'confirm_config_setup_reset'],
    ['config', { action: 'account_remove', name: 'work' }, 'confirm_config_account_remove']
  ])('triggers elicitWithFallback for sensitive %s operation (%s)', async (toolName, args, expectedKey) => {
    elicitWithFallbackMock.mockResolvedValueOnce({
      status: 'accepted',
      source: 'mrtr',
      data: { confirm: true }
    })

    const result = await checkSensitiveOperation(toolName, args, FAKE_CTX)

    expect(result).toEqual({ status: 'proceed', source: 'mrtr' })
    expect(elicitWithFallbackMock).toHaveBeenCalledWith(
      FAKE_CTX,
      expect.objectContaining({
        key: expectedKey,
        defaultValue: { confirm: true }
      })
    )
  })

  it('handles input_required, declined, cancelled, and fallback outcomes accurately', async () => {
    const inputRequiredResult = { _meta: {}, inputRequests: [], requestState: { token: '1' } }
    elicitWithFallbackMock.mockResolvedValueOnce({ status: 'input_required', result: inputRequiredResult })
    await expect(checkSensitiveOperation('blocks', { action: 'delete' }, FAKE_CTX)).resolves.toEqual({
      status: 'input_required',
      result: inputRequiredResult
    })

    elicitWithFallbackMock.mockResolvedValueOnce({ status: 'declined' })
    await expect(checkSensitiveOperation('blocks', { action: 'delete' }, FAKE_CTX)).resolves.toEqual({
      status: 'cancelled',
      reason: 'declined'
    })

    elicitWithFallbackMock.mockResolvedValueOnce({ status: 'cancelled' })
    await expect(checkSensitiveOperation('blocks', { action: 'delete' }, FAKE_CTX)).resolves.toEqual({
      status: 'cancelled',
      reason: 'cancelled'
    })

    elicitWithFallbackMock.mockResolvedValueOnce({
      status: 'accepted',
      source: 'legacy',
      data: { confirm: false }
    })
    await expect(checkSensitiveOperation('blocks', { action: 'delete' }, FAKE_CTX)).resolves.toEqual({
      status: 'cancelled',
      reason: 'declined'
    })

    elicitWithFallbackMock.mockResolvedValueOnce({
      status: 'fallback',
      source: 'fallback',
      data: { confirm: true }
    })
    await expect(checkSensitiveOperation('blocks', { action: 'delete' }, FAKE_CTX)).resolves.toEqual({
      status: 'proceed',
      source: 'fallback'
    })

    elicitWithFallbackMock.mockResolvedValueOnce({
      status: 'fallback',
      source: 'fallback',
      data: { confirm: false }
    })
    await expect(checkSensitiveOperation('blocks', { action: 'delete' }, FAKE_CTX)).resolves.toEqual({
      status: 'cancelled',
      reason: 'declined'
    })
  })
})
