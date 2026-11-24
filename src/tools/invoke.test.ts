import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./composite/pages.js', () => ({ pages: vi.fn() }))
vi.mock('./composite/databases.js', () => ({ databases: vi.fn() }))
vi.mock('./composite/blocks.js', () => ({ blocks: vi.fn() }))
vi.mock('./composite/comments.js', () => ({ commentsManage: vi.fn() }))
vi.mock('./composite/content.js', () => ({ contentConvert: vi.fn() }))
vi.mock('./composite/users.js', () => ({ users: vi.fn() }))
vi.mock('./composite/workspace.js', () => ({ workspace: vi.fn() }))
vi.mock('./composite/file-uploads.js', () => ({ fileUploads: vi.fn() }))
vi.mock('./composite/config.js', () => ({ config: vi.fn() }))

import { formatToolResult } from '../cli.js'
import { blocks } from './composite/blocks.js'
import { databases } from './composite/databases.js'
import { pages } from './composite/pages.js'
import { workspace } from './composite/workspace.js'
import { invokeTool } from './invoke.js'

const clientFactory = vi.fn(async () => ({}) as any)

describe('invokeTool response truncation contracts', () => {
  const originalEnv = process.env.NOTION_MAX_RESPONSE_CHARS

  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.NOTION_MAX_RESPONSE_CHARS
  })

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NOTION_MAX_RESPONSE_CHARS
    } else {
      process.env.NOTION_MAX_RESPONSE_CHARS = originalEnv
    }
  })

  it('caps oversized databases query results to 50 items by default with _truncation', async () => {
    vi.mocked(databases).mockResolvedValueOnce({
      action: 'query',
      database_id: 'db-1',
      data_source_id: 'ds-1',
      total: 75,
      results: Array.from({ length: 75 }, (_, i) => ({ page_id: `p-${i}`, Name: `Item ${i}` }))
    } as any)

    const result = (await invokeTool('databases', { action: 'query', database_id: 'db-1' }, clientFactory)) as any
    expect(result.results).toHaveLength(50)
    expect(result._truncation).toMatchObject({
      truncated: true,
      omitted_items: [{ path: '$.results', returned: 50, total: 75 }]
    })

    // Same bounded JSON payload flows through CLI --json formatting
    const cliJson = JSON.parse(formatToolResult('databases', result, true))
    expect(cliJson._truncation.truncated).toBe(true)
  })

  it('respects explicit limit and full: true bypass', async () => {
    const items = Array.from({ length: 60 }, (_, i) => ({ id: `id-${i}` }))
    vi.mocked(workspace).mockResolvedValue({ action: 'search', total: 60, results: items } as any)

    const limited = (await invokeTool('workspace', { action: 'search', limit: 60 }, clientFactory)) as any
    expect(limited.results).toHaveLength(60)
    expect(limited._truncation).toBeUndefined()

    const fullRes = (await invokeTool('workspace', { action: 'search', full: true }, clientFactory)) as any
    expect(fullRes.results).toHaveLength(60)
    expect(fullRes._truncation).toBeUndefined()
  })

  it('honors NOTION_MAX_RESPONSE_CHARS when max_chars is omitted', async () => {
    process.env.NOTION_MAX_RESPONSE_CHARS = '800'
    vi.mocked(blocks).mockResolvedValueOnce({
      action: 'children',
      block_id: 'blk-1',
      total_children: 1,
      markdown: 'm'.repeat(2_000),
      blocks: [{ id: 'b-1', paragraph: 'x'.repeat(2_000) }]
    } as any)

    const result = (await invokeTool('blocks', { action: 'children', block_id: 'blk-1' }, clientFactory)) as any
    expect(result._truncation.truncated).toBe(true)
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(800)
  })

  it('validates invalid max_chars up-front across all bounded tools', async () => {
    await expect(invokeTool('databases', { action: 'query', max_chars: 0 }, clientFactory)).rejects.toThrow(
      'max_chars must be an integer between 1 and 100000'
    )
    expect(databases).not.toHaveBeenCalled()
  })

  it('attaches _truncation to pages.get when markdown was truncated without shrinking 20k markdown down to 4k', async () => {
    const content = `${'z'.repeat(20_000)}\n\n[Truncated: showing 20000 of 30000 characters (10000 omitted).]`
    vi.mocked(pages).mockResolvedValueOnce({
      action: 'get',
      page_id: 'p-1',
      url: 'https://notion.so/p-1',
      created_time: '2024-01-01',
      last_edited_time: '2024-01-01',
      archived: false,
      icon: null,
      cover: null,
      properties: {},
      content,
      block_count: 50,
      content_max_chars: 20_000,
      content_char_count: 30_000,
      content_truncated: true,
      content_chars_omitted: 10_000
    } as any)

    const result = (await invokeTool('pages', { action: 'get', page_id: 'p-1' }, clientFactory)) as any
    expect(result.content).toBe(content)
    expect(result.content_truncated).toBe(true)
    expect(result._truncation).toMatchObject({
      truncated: true
    })
  })
})
