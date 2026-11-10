import { beforeEach, describe, expect, it, vi } from 'vitest'
import { blocksToMarkdown } from '../helpers/markdown.js'
import {
  type ArchivePageResult,
  type CreatePageResult,
  type DuplicatePageResult,
  type GetPagePropertyResult,
  type GetPageResult,
  type MovePageResult,
  pages,
  type UpdatePageResult
} from './pages'

vi.mock('../helpers/markdown.js', () => ({
  markdownToBlocks: vi.fn((md: string) => {
    if (!md) return []
    return [{ type: 'paragraph', paragraph: { rich_text: [{ text: { content: md } }] } }]
  }),
  blocksToMarkdown: vi.fn((blocks: any[]) => {
    if (!blocks.length) return ''
    return '# Mock markdown'
  })
}))

vi.mock('../helpers/properties.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../helpers/properties.js')>()
  return {
    ...actual,
    convertToNotionProperties: vi.fn().mockImplementation((props) => props)
  }
})

function createMockNotion() {
  return {
    pages: {
      create: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
      move: vi.fn(),
      properties: { retrieve: vi.fn() }
    },
    blocks: {
      retrieve: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      children: {
        list: vi.fn(),
        append: vi.fn()
      }
    }
  }
}

let mockNotion: ReturnType<typeof createMockNotion>

describe('pages', () => {
  beforeEach(() => {
    mockNotion = createMockNotion()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  // ---------------------------------------------------------------------------
  // create
  // ---------------------------------------------------------------------------
  describe('create', () => {
    it('creates page with title and page parent', async () => {
      mockNotion.pages.create.mockResolvedValue({ id: 'page-1', url: 'https://notion.so/page-1' })

      const result = (await pages(mockNotion as any, {
        action: 'create',
        title: 'Test Page',
        parent_id: 'parent-1'
      })) as CreatePageResult

      expect(result).toEqual({
        action: 'create',
        page_id: 'page-1',
        url: 'https://notion.so/page-1',
        created: true
      })
      expect(mockNotion.pages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          parent: { type: 'page_id', page_id: 'parent1' },
          properties: { title: { title: [expect.objectContaining({ type: 'text' })] } }
        })
      )
    })

    it('creates page with database parent when properties provided', async () => {
      mockNotion.pages.create.mockResolvedValue({ id: 'page-2', url: 'https://notion.so/page-2' })

      const result = (await pages(mockNotion as any, {
        action: 'create',
        title: 'DB Page',
        parent_id: 'db-123',
        properties: { Status: { select: { name: 'Active' } } }
      })) as CreatePageResult

      expect(result.page_id).toBe('page-2')
      expect(mockNotion.pages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          parent: { type: 'database_id', database_id: 'db123' }
        })
      )
    })

    it('adds Name property when database parent has no title property', async () => {
      mockNotion.pages.create.mockResolvedValue({ id: 'page-3', url: 'https://notion.so/page-3' })

      await pages(mockNotion as any, {
        action: 'create',
        title: 'Named Page',
        parent_id: 'db-456',
        properties: { Priority: { number: 1 } }
      })

      const callArgs = mockNotion.pages.create.mock.calls[0][0]
      expect(callArgs.properties.Name).toEqual({
        title: [expect.objectContaining({ text: { content: 'Named Page', link: null } })]
      })
    })

    it('creates page with content blocks', async () => {
      mockNotion.pages.create.mockResolvedValue({ id: 'page-4', url: 'https://notion.so/page-4' })
      mockNotion.blocks.children.append.mockResolvedValue({ results: [] })

      await pages(mockNotion as any, {
        action: 'create',
        title: 'Content Page',
        parent_id: 'parent-1',
        content: '# Hello World'
      })

      expect(mockNotion.blocks.children.append).toHaveBeenCalledWith({
        block_id: 'page-4',
        children: expect.any(Array)
      })
    })

    it('creates page with icon and cover', async () => {
      mockNotion.pages.create.mockResolvedValue({ id: 'page-5', url: 'https://notion.so/page-5' })

      await pages(mockNotion as any, {
        action: 'create',
        title: 'Styled Page',
        parent_id: 'parent-1',
        icon: '🚀',
        cover: 'https://example.com/cover.jpg'
      })

      const callArgs = mockNotion.pages.create.mock.calls[0][0]
      expect(callArgs.icon).toEqual({ type: 'emoji', emoji: '🚀' })
      expect(callArgs.cover).toEqual({ type: 'external', external: { url: 'https://example.com/cover.jpg' } })
    })

    it('does not append blocks when content is falsy', async () => {
      mockNotion.pages.create.mockResolvedValue({ id: 'page-6', url: 'https://notion.so/page-6' })

      await pages(mockNotion as any, {
        action: 'create',
        title: 'Empty Content',
        parent_id: 'parent-1',
        content: ''
      })

      expect(mockNotion.blocks.children.append).not.toHaveBeenCalled()
    })

    it('throws without title', async () => {
      await expect(pages(mockNotion as any, { action: 'create', parent_id: 'parent-1' })).rejects.toThrow(
        'title is required'
      )
    })

    it('throws without parent_id', async () => {
      await expect(pages(mockNotion as any, { action: 'create', title: 'No Parent' })).rejects.toThrow(
        'parent_id is required'
      )
    })
  })

  // ---------------------------------------------------------------------------
  // get
  // ---------------------------------------------------------------------------
  describe('get', () => {
    it('returns page with markdown content and properties', async () => {
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'page-1',
        url: 'https://notion.so/page-1',
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-02T00:00:00.000Z',
        archived: false,
        properties: {
          Name: { type: 'title', title: [{ plain_text: 'Test' }] }
        }
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [{ id: 'block-1', type: 'paragraph' }],
        next_cursor: null,
        has_more: false
      })

      const result = (await pages(mockNotion as any, { action: 'get', page_id: 'page-1' })) as GetPageResult

      expect(result).toEqual({
        action: 'get',
        page_id: 'page-1',
        url: 'https://notion.so/page-1',
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-02T00:00:00.000Z',
        archived: false,
        icon: null,
        cover: null,
        properties: { Name: 'Test' },
        content: '# Mock markdown',
        block_count: 1,
        content_max_chars: 20_000,
        content_char_count: 15
      })
    })

    it('bounds markdown by default and reports the true size in the marker', async () => {
      const hugeMarkdown = 'z'.repeat(45_123)
      vi.mocked(blocksToMarkdown).mockReturnValueOnce(hugeMarkdown)
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'page-5',
        url: 'https://notion.so/page-5',
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-02T00:00:00.000Z',
        archived: false,
        properties: {}
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [{ id: 'block-1', type: 'paragraph' }],
        next_cursor: null,
        has_more: false
      })

      const result = (await pages(mockNotion as any, { action: 'get', page_id: 'page-5' })) as GetPageResult

      expect(result.content_max_chars).toBe(20_000)
      expect(result.content_char_count).toBe(45_123)
      expect(result.content_chars_omitted).toBe(25_123)
      expect(result.content_truncated).toBe(true)
      expect(result.content.startsWith('z'.repeat(20_000))).toBe(true)
      expect(result.content).toContain(
        '[Truncated: showing 20000 of 45123 characters (25123 omitted). Pass a larger max_chars (up to 100000) or page blocks with content_limit/content_cursor.]'
      )
    })

    it('honours max_chars and returns small pages whole', async () => {
      const markdown = 'q'.repeat(300)
      vi.mocked(blocksToMarkdown).mockReturnValueOnce(markdown)
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'page-6',
        url: 'https://notion.so/page-6',
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-02T00:00:00.000Z',
        archived: false,
        properties: {}
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [{ id: 'block-1', type: 'paragraph' }],
        next_cursor: null,
        has_more: false
      })

      const result = (await pages(mockNotion as any, {
        action: 'get',
        page_id: 'page-6',
        max_chars: 100
      })) as GetPageResult

      expect(result.content_max_chars).toBe(100)
      expect(result.content_char_count).toBe(300)
      expect(result.content).toContain('[Truncated: showing 100 of 300 characters (200 omitted).')

      vi.mocked(blocksToMarkdown).mockReturnValueOnce('short')
      const small = (await pages(mockNotion as any, {
        action: 'get',
        page_id: 'page-6',
        max_chars: 100
      })) as GetPageResult

      expect(small.content).toBe('short')
      expect(small.content_truncated).toBeUndefined()
      expect(small.content_chars_omitted).toBeUndefined()
    })

    it('rejects max_chars outside the supported range', async () => {
      await expect(pages(mockNotion as any, { action: 'get', page_id: 'page-1', max_chars: 100_001 })).rejects.toThrow(
        'max_chars must be an integer between 1 and 100000'
      )
      expect(mockNotion.pages.retrieve).not.toHaveBeenCalled()
    })

    it('bounds content and exposes the continuation cursor', async () => {
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'page-3',
        url: 'https://notion.so/page-3',
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-02T00:00:00.000Z',
        archived: false,
        properties: {}
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [{ id: 'block-1', type: 'paragraph' }],
        next_cursor: 'cursor-2',
        has_more: true
      })

      const result = (await pages(mockNotion as any, {
        action: 'get',
        page_id: 'page-3',
        content_limit: 1
      })) as GetPageResult

      expect(mockNotion.blocks.children.list).toHaveBeenCalledWith({
        block_id: 'page-3',
        start_cursor: undefined,
        page_size: 1
      })
      expect(result.content_truncated).toBe(true)
      expect(result.next_cursor).toBe('cursor-2')
      expect(result.block_count).toBe(1)
    })

    it('rejects content limits outside the Notion page-size range', async () => {
      await expect(
        pages(mockNotion as any, {
          action: 'get',
          page_id: 'page-1',
          content_limit: 101
        })
      ).rejects.toThrow('content_limit must be an integer between 1 and 100')
      expect(mockNotion.pages.retrieve).not.toHaveBeenCalled()
    })

    it('handles pages with no blocks', async () => {
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'page-2',
        url: 'https://notion.so/page-2',
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-01T00:00:00.000Z',
        archived: false,
        properties: {}
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [],
        next_cursor: null,
        has_more: false
      })

      const result = (await pages(mockNotion as any, { action: 'get', page_id: 'page-2' })) as GetPageResult

      expect(result.block_count).toBe(0)
      expect(result.properties).toEqual({})
    })

    it('extracts all property types correctly', async () => {
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'page-3',
        url: 'https://notion.so/page-3',
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-01T00:00:00.000Z',
        archived: false,
        properties: {
          Name: { type: 'title', title: [{ plain_text: 'Hello' }, { plain_text: ' World' }] },
          Description: { type: 'rich_text', rich_text: [{ plain_text: 'A ' }, { plain_text: 'description' }] },
          Category: { type: 'select', select: { name: 'Engineering' } },
          Tags: { type: 'multi_select', multi_select: [{ name: 'urgent' }, { name: 'bug' }] },
          Count: { type: 'number', number: 42 },
          Done: { type: 'checkbox', checkbox: true },
          Website: { type: 'url', url: 'https://example.com' },
          Email: { type: 'email', email: 'test@example.com' },
          Phone: { type: 'phone_number', phone_number: '+1234567890' },
          DueDate: { type: 'date', date: { start: '2024-01-15', end: '2024-01-20' } },
          DateOnly: { type: 'date', date: { start: '2024-06-01', end: null } },
          Related: { type: 'relation', relation: [{ id: 'rel-1' }, { id: 'rel-2' }] },
          Summary: { type: 'rollup', rollup: { type: 'number', number: 100 } },
          Assignees: { type: 'people', people: [{ name: 'Alice', id: 'u-1' }, { id: 'u-2' }] },
          Attachments: {
            type: 'files',
            files: [
              { name: 'doc.pdf', file: { url: 'https://s3.example.com/doc.pdf' } },
              { name: 'link.txt', external: { url: 'https://example.com/link.txt' } },
              { name: 'bare.txt' }
            ]
          },
          Computed: { type: 'formula', formula: { type: 'string', string: 'computed-value' } },
          Created: { type: 'created_time', created_time: '2024-01-01T00:00:00.000Z' },
          Edited: { type: 'last_edited_time', last_edited_time: '2024-01-02T00:00:00.000Z' },
          CreatedBy: { type: 'created_by', created_by: { name: 'Bob', id: 'u-3' } },
          EditedBy: { type: 'last_edited_by', last_edited_by: { id: 'u-4' } },
          Status: { type: 'status', status: { name: 'In Progress' } },
          TaskID: { type: 'unique_id', unique_id: { prefix: 'TASK', number: 42 } },
          PlainID: { type: 'unique_id', unique_id: { prefix: null, number: 7 } }
        }
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [],
        next_cursor: null,
        has_more: false
      })

      const result = (await pages(mockNotion as any, { action: 'get', page_id: 'page-3' })) as GetPageResult
      const p = result.properties

      expect(p.Name).toBe('Hello World')
      expect(p.Description).toBe('A description')
      expect(p.Category).toBe('Engineering')
      expect(p.Tags).toEqual(['urgent', 'bug'])
      expect(p.Count).toBe(42)
      expect(p.Done).toBe(true)
      expect(p.Website).toBe('https://example.com')
      expect(p.Email).toBe('test@example.com')
      expect(p.Phone).toBe('+1234567890')
      expect(p.DueDate).toBe('2024-01-15 to 2024-01-20')
      expect(p.DateOnly).toBe('2024-06-01')
      expect(p.Related).toEqual(['rel-1', 'rel-2'])
      expect(p.Summary).toEqual({ type: 'number', number: 100 })
      expect(p.Assignees).toEqual(['Alice', 'u-2'])
      expect(p.Attachments).toEqual(['https://s3.example.com/doc.pdf', 'https://example.com/link.txt', 'bare.txt'])
      expect(p.Computed).toBe('computed-value')
      expect(p.Created).toBe('2024-01-01T00:00:00.000Z')
      expect(p.Edited).toBe('2024-01-02T00:00:00.000Z')
      expect(p.CreatedBy).toBe('Bob')
      expect(p.EditedBy).toBe('u-4')
      expect(p.Status).toBe('In Progress')
      expect(p.TaskID).toBe('TASK-42')
      expect(p.PlainID).toBe(7)
    })

    it('auto-paginates blocks across multiple pages', async () => {
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'page-4',
        url: 'https://notion.so/page-4',
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-01T00:00:00.000Z',
        archived: false,
        properties: {}
      })
      mockNotion.blocks.children.list
        .mockResolvedValueOnce({
          results: [{ id: 'b-1', type: 'paragraph' }],
          next_cursor: 'cursor-2',
          has_more: true
        })
        .mockResolvedValueOnce({
          results: [{ id: 'b-2', type: 'paragraph' }],
          next_cursor: null,
          has_more: false
        })

      const result = (await pages(mockNotion as any, { action: 'get', page_id: 'page-4' })) as GetPageResult

      expect(result.block_count).toBe(2)
      expect(mockNotion.blocks.children.list).toHaveBeenCalledTimes(2)
    })

    it('throws without page_id', async () => {
      await expect(pages(mockNotion as any, { action: 'get' })).rejects.toThrow('page_id is required')
    })
  })

  // ---------------------------------------------------------------------------
  // get_property
  // ---------------------------------------------------------------------------
  describe('get_property', () => {
    it('returns paginated title joining text', async () => {
      mockNotion.pages.properties.retrieve.mockResolvedValue({
        results: [
          { type: 'title', title: { plain_text: 'Hello' } },
          { type: 'title', title: { plain_text: ' World' } }
        ],
        next_cursor: null,
        has_more: false
      })

      const result = (await pages(mockNotion as any, {
        action: 'get_property',
        page_id: 'page-1',
        property_id: 'title'
      })) as GetPagePropertyResult

      expect(result).toEqual({
        action: 'get_property',
        page_id: 'page-1',
        property_id: 'title',
        type: 'title',
        value: 'Hello World'
      })
    })

    it('returns paginated rich_text joining text', async () => {
      mockNotion.pages.properties.retrieve.mockResolvedValue({
        results: [
          { type: 'rich_text', rich_text: { plain_text: 'First ' } },
          { type: 'rich_text', rich_text: { plain_text: 'Second' } }
        ],
        next_cursor: null,
        has_more: false
      })

      const result = (await pages(mockNotion as any, {
        action: 'get_property',
        page_id: 'page-1',
        property_id: 'desc'
      })) as GetPagePropertyResult

      expect(result.type).toBe('rich_text')
      expect(result.value).toBe('First Second')
    })

    it('returns relation IDs', async () => {
      mockNotion.pages.properties.retrieve.mockResolvedValue({
        results: [
          { type: 'relation', relation: { id: 'rel-a' } },
          { type: 'relation', relation: { id: 'rel-b' } }
        ],
        next_cursor: null,
        has_more: false
      })

      const result = (await pages(mockNotion as any, {
        action: 'get_property',
        page_id: 'page-1',
        property_id: 'related'
      })) as GetPagePropertyResult

      expect(result.type).toBe('relation')
      expect(result.value).toEqual(['rel-a', 'rel-b'])
    })

    it('returns people with id and name', async () => {
      mockNotion.pages.properties.retrieve.mockResolvedValue({
        results: [
          { type: 'people', people: { id: 'u-1', name: 'Alice' } },
          { type: 'people', people: { id: 'u-2', name: 'Bob' } }
        ],
        next_cursor: null,
        has_more: false
      })

      const result = (await pages(mockNotion as any, {
        action: 'get_property',
        page_id: 'page-1',
        property_id: 'assignees'
      })) as GetPagePropertyResult

      expect(result.type).toBe('people')
      expect(result.value).toEqual([
        { id: 'u-1', name: 'Alice' },
        { id: 'u-2', name: 'Bob' }
      ])
    })

    it('returns rollup value from first result', async () => {
      mockNotion.pages.properties.retrieve.mockResolvedValue({
        results: [{ type: 'rollup', rollup: { type: 'number', number: 99, function: 'sum' } }],
        next_cursor: null,
        has_more: false
      })

      const result = (await pages(mockNotion as any, {
        action: 'get_property',
        page_id: 'page-1',
        property_id: 'total'
      })) as GetPagePropertyResult

      expect(result.type).toBe('rollup')
      expect(result.value).toEqual({ type: 'number', number: 99, function: 'sum' })
    })

    it('returns non-paginated property as raw value', async () => {
      // Non-paginated responses have no results array
      mockNotion.pages.properties.retrieve.mockResolvedValue({
        type: 'number',
        number: 42
      })

      const result = (await pages(mockNotion as any, {
        action: 'get_property',
        page_id: 'page-1',
        property_id: 'count'
      })) as GetPagePropertyResult

      expect(result.type).toBe('number')
      expect(result.value).toBe(42)
    })

    it('auto-paginates across multiple pages', async () => {
      mockNotion.pages.properties.retrieve
        .mockResolvedValueOnce({
          results: [{ type: 'relation', relation: { id: 'r-1' } }],
          next_cursor: 'cursor-2',
          has_more: true
        })
        .mockResolvedValueOnce({
          results: [{ type: 'relation', relation: { id: 'r-2' } }],
          next_cursor: null,
          has_more: false
        })

      const result = (await pages(mockNotion as any, {
        action: 'get_property',
        page_id: 'page-1',
        property_id: 'refs'
      })) as GetPagePropertyResult

      expect(result.value).toEqual(['r-1', 'r-2'])
      expect(mockNotion.pages.properties.retrieve).toHaveBeenCalledTimes(2)
    })

    it('throws without page_id', async () => {
      await expect(pages(mockNotion as any, { action: 'get_property', property_id: 'prop-1' })).rejects.toThrow(
        'page_id is required'
      )
    })

    it('throws without property_id', async () => {
      await expect(pages(mockNotion as any, { action: 'get_property', page_id: 'page-1' })).rejects.toThrow(
        'property_id is required'
      )
    })
  })

  // ---------------------------------------------------------------------------
  // update
  // ---------------------------------------------------------------------------
  describe('update', () => {
    it('updates metadata with icon and cover', async () => {
      mockNotion.pages.update.mockResolvedValue({ id: 'page-1' })

      const result = (await pages(mockNotion as any, {
        action: 'update',
        page_id: 'page-1',
        icon: '📝',
        cover: 'https://example.com/banner.jpg'
      })) as UpdatePageResult

      expect(result).toEqual({ action: 'update', page_id: 'page-1', updated: true })
      expect(mockNotion.pages.update).toHaveBeenCalledWith({
        page_id: 'page-1',
        icon: { type: 'emoji', emoji: '📝' },
        cover: { type: 'external', external: { url: 'https://example.com/banner.jpg' } }
      })
    })

    it('updates archived status', async () => {
      mockNotion.pages.update.mockResolvedValue({ id: 'page-1' })

      await pages(mockNotion as any, {
        action: 'update',
        page_id: 'page-1',
        archived: true
      })

      expect(mockNotion.pages.update).toHaveBeenCalledWith({
        page_id: 'page-1',
        archived: true
      })
    })

    it('updates title property', async () => {
      mockNotion.pages.update.mockResolvedValue({ id: 'page-1' })

      await pages(mockNotion as any, {
        action: 'update',
        page_id: 'page-1',
        title: 'New Title'
      })

      const callArgs = mockNotion.pages.update.mock.calls[0][0]
      expect(callArgs.properties.title).toEqual({
        title: [expect.objectContaining({ text: { content: 'New Title', link: null } })]
      })
    })

    it('updates custom properties via convertToNotionProperties', async () => {
      mockNotion.pages.update.mockResolvedValue({ id: 'page-1' })

      await pages(mockNotion as any, {
        action: 'update',
        page_id: 'page-1',
        properties: { Status: { select: { name: 'Done' } } }
      })

      const callArgs = mockNotion.pages.update.mock.calls[0][0]
      expect(callArgs.properties.Status).toEqual({ select: { name: 'Done' } })
    })

    it('replaces content by deleting old blocks and appending new when replace is true', async () => {
      mockNotion.pages.update.mockResolvedValue({ id: 'page-1' })
      mockNotion.blocks.children.list
        .mockResolvedValueOnce({
          results: [{ id: 'old-block-1' }, { id: 'old-block-2' }],
          next_cursor: 'cursor-2',
          has_more: true
        })
        .mockResolvedValueOnce({
          results: [],
          next_cursor: null,
          has_more: false
        })
      mockNotion.blocks.delete.mockResolvedValue({})
      mockNotion.blocks.children.append.mockResolvedValue({ results: [] })

      await pages(mockNotion as any, {
        action: 'update',
        page_id: 'page-1',
        title: 'Updated',
        content: '# New Content',
        replace: true
      })

      expect(mockNotion.blocks.delete).toHaveBeenCalledWith({ block_id: 'old-block-1' })
      expect(mockNotion.blocks.delete).toHaveBeenCalledWith({ block_id: 'old-block-2' })
      expect(mockNotion.blocks.children.append).toHaveBeenCalledWith({
        block_id: 'page-1',
        children: expect.any(Array)
      })
    })

    it('appends content when content is provided but replace is false/missing', async () => {
      mockNotion.pages.update.mockResolvedValue({ id: 'page-1' })
      mockNotion.blocks.children.append.mockResolvedValue({ results: [] })

      await pages(mockNotion as any, {
        action: 'update',
        page_id: 'page-1',
        content: '# Appended Content'
      })

      expect(mockNotion.blocks.delete).not.toHaveBeenCalled()
      expect(mockNotion.blocks.children.list).not.toHaveBeenCalled()
      expect(mockNotion.blocks.children.append).toHaveBeenCalledWith({
        block_id: 'page-1',
        children: expect.any(Array)
      })
    })

    it('appends content without deleting existing blocks', async () => {
      mockNotion.blocks.children.append.mockResolvedValue({ results: [] })

      await pages(mockNotion as any, {
        action: 'update',
        page_id: 'page-1',
        append_content: '## Appended Section'
      })

      expect(mockNotion.blocks.delete).not.toHaveBeenCalled()
      expect(mockNotion.blocks.children.list).not.toHaveBeenCalled()
      expect(mockNotion.blocks.children.append).toHaveBeenCalledWith({
        block_id: 'page-1',
        children: expect.any(Array)
      })
    })

    it('skips pages.update when only content changes', async () => {
      mockNotion.blocks.children.append.mockResolvedValue({ results: [] })

      await pages(mockNotion as any, {
        action: 'update',
        page_id: 'page-1',
        append_content: 'More text'
      })

      expect(mockNotion.pages.update).not.toHaveBeenCalled()
    })

    it('throws without page_id', async () => {
      await expect(pages(mockNotion as any, { action: 'update', title: 'Oops' })).rejects.toThrow('page_id is required')
    })
  })

  // ---------------------------------------------------------------------------
  // move
  // ---------------------------------------------------------------------------
  describe('move', () => {
    it('moves page to new parent', async () => {
      mockNotion.pages.update.mockResolvedValue({})

      const result = (await pages(mockNotion as any, {
        action: 'move',
        page_id: 'page-1',
        parent_id: 'newparent123'
      })) as MovePageResult

      expect(result).toEqual({
        action: 'move',
        page_id: 'page-1',
        new_parent_id: 'newparent123',
        moved: true
      })
      expect(mockNotion.pages.update).toHaveBeenCalledWith({
        page_id: 'page-1',
        parent: { type: 'page_id', page_id: 'newparent123' }
      })
    })

    it('normalizes parent_id by removing dashes', async () => {
      mockNotion.pages.update.mockResolvedValue({})

      const result = (await pages(mockNotion as any, {
        action: 'move',
        page_id: 'page-1',
        parent_id: 'abc-def-123-456'
      })) as MovePageResult

      expect(result.new_parent_id).toBe('abcdef123456')
      expect(mockNotion.pages.update).toHaveBeenCalledWith({
        page_id: 'page-1',
        parent: { type: 'page_id', page_id: 'abcdef123456' }
      })
    })

    it('throws without page_id', async () => {
      await expect(pages(mockNotion as any, { action: 'move', parent_id: 'target' })).rejects.toThrow(
        'page_id is required'
      )
    })

    it('throws without parent_id', async () => {
      await expect(pages(mockNotion as any, { action: 'move', page_id: 'page-1' })).rejects.toThrow(
        'parent_id is required'
      )
    })
  })

  // ---------------------------------------------------------------------------
  // archive / restore
  // ---------------------------------------------------------------------------
  describe('archive', () => {
    it('archives multiple pages', async () => {
      mockNotion.pages.update.mockResolvedValue({})

      const result = (await pages(mockNotion as any, {
        action: 'archive',
        page_ids: ['page-1', 'page-2', 'page-3']
      })) as ArchivePageResult

      expect(result.action).toBe('archive')
      expect(result.processed).toBe(3)
      expect(result.results).toEqual([
        { page_id: 'page-1', archived: true },
        { page_id: 'page-2', archived: true },
        { page_id: 'page-3', archived: true }
      ])
      expect(mockNotion.pages.update).toHaveBeenCalledTimes(3)
      expect(mockNotion.pages.update).toHaveBeenCalledWith({ page_id: 'page-1', archived: true })
    })

    it('archives single page via page_id', async () => {
      mockNotion.pages.update.mockResolvedValue({})

      const result = (await pages(mockNotion as any, {
        action: 'archive',
        page_id: 'page-solo'
      })) as ArchivePageResult

      expect(result.processed).toBe(1)
      expect(result.results).toEqual([{ page_id: 'page-solo', archived: true }])
    })

    it('throws without page_id or page_ids', async () => {
      await expect(pages(mockNotion as any, { action: 'archive' })).rejects.toThrow('page_id or page_ids required')
    })
  })

  describe('restore', () => {
    it('restores single page', async () => {
      mockNotion.pages.update.mockResolvedValue({})

      const result = (await pages(mockNotion as any, {
        action: 'restore',
        page_id: 'page-archived'
      })) as ArchivePageResult

      expect(result.action).toBe('restore')
      expect(result.processed).toBe(1)
      expect(result.results).toEqual([{ page_id: 'page-archived', archived: false }])
      expect(mockNotion.pages.update).toHaveBeenCalledWith({ page_id: 'page-archived', archived: false })
    })

    it('restores multiple pages via page_ids', async () => {
      mockNotion.pages.update.mockResolvedValue({})

      const result = (await pages(mockNotion as any, {
        action: 'restore',
        page_ids: ['page-a', 'page-b']
      })) as ArchivePageResult

      expect(result.processed).toBe(2)
      for (const r of result.results) {
        expect(r.archived).toBe(false)
      }
    })

    it('throws without page_id or page_ids', async () => {
      await expect(pages(mockNotion as any, { action: 'restore' })).rejects.toThrow('page_id or page_ids required')
    })
  })

  // ---------------------------------------------------------------------------
  // duplicate
  // ---------------------------------------------------------------------------
  describe('duplicate', () => {
    it('duplicates page with content', async () => {
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'orig-1',
        parent: { type: 'page_id', page_id: 'parent-1' },
        properties: { title: { title: [{ plain_text: 'Original' }] } },
        icon: { type: 'emoji', emoji: '📄' },
        cover: null
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [{ id: 'block-1', type: 'paragraph' }],
        next_cursor: null,
        has_more: false
      })
      mockNotion.pages.create.mockResolvedValue({
        id: 'dup-1',
        url: 'https://notion.so/dup-1'
      })
      mockNotion.blocks.children.append.mockResolvedValue({ results: [] })

      const result = (await pages(mockNotion as any, {
        action: 'duplicate',
        page_id: 'orig-1'
      })) as DuplicatePageResult

      expect(result).toEqual({
        action: 'duplicate',
        processed: 1,
        results: [
          {
            original_id: 'orig-1',
            duplicate_id: 'dup-1',
            url: 'https://notion.so/dup-1'
          }
        ]
      })
      expect(mockNotion.pages.create).toHaveBeenCalledWith({
        parent: { type: 'page_id', page_id: 'parent-1' },
        properties: { title: { title: [{ plain_text: 'Original' }] } },
        icon: { type: 'emoji', emoji: '📄' },
        cover: null
      })
      expect(mockNotion.blocks.children.append).toHaveBeenCalledWith({
        block_id: 'dup-1',
        children: [{ type: 'paragraph' }]
      })
    })

    it('skips block append when original has no blocks', async () => {
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'orig-2',
        parent: { type: 'page_id', page_id: 'parent-1' },
        properties: {},
        icon: null,
        cover: null
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [],
        next_cursor: null,
        has_more: false
      })
      mockNotion.pages.create.mockResolvedValue({
        id: 'dup-2',
        url: 'https://notion.so/dup-2'
      })

      await pages(mockNotion as any, { action: 'duplicate', page_id: 'orig-2' })

      expect(mockNotion.blocks.children.append).not.toHaveBeenCalled()
    })

    it('handles data_source_id parent type', async () => {
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'orig-3',
        parent: { type: 'data_source_id', data_source_id: 'ds-1', extra_field: 'ignored' },
        properties: {},
        icon: null,
        cover: null
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [],
        next_cursor: null,
        has_more: false
      })
      mockNotion.pages.create.mockResolvedValue({
        id: 'dup-3',
        url: 'https://notion.so/dup-3'
      })

      await pages(mockNotion as any, { action: 'duplicate', page_id: 'orig-3' })

      expect(mockNotion.pages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          parent: { type: 'data_source_id', data_source_id: 'ds-1' }
        })
      )
    })

    it('handles database_id parent type', async () => {
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'orig-4',
        parent: { type: 'database_id', database_id: 'db-1' },
        properties: {},
        icon: null,
        cover: null
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [],
        next_cursor: null,
        has_more: false
      })
      mockNotion.pages.create.mockResolvedValue({
        id: 'dup-4',
        url: 'https://notion.so/dup-4'
      })

      await pages(mockNotion as any, { action: 'duplicate', page_id: 'orig-4' })

      expect(mockNotion.pages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          parent: { type: 'database_id', database_id: 'db-1' }
        })
      )
    })

    it('duplicates multiple pages via page_ids', async () => {
      mockNotion.pages.retrieve.mockResolvedValue({
        id: 'any',
        parent: { type: 'page_id', page_id: 'p-1' },
        properties: {},
        icon: null,
        cover: null
      })
      mockNotion.blocks.children.list.mockResolvedValue({
        results: [],
        next_cursor: null,
        has_more: false
      })
      mockNotion.pages.create
        .mockResolvedValueOnce({ id: 'dup-a', url: 'https://notion.so/dup-a' })
        .mockResolvedValueOnce({ id: 'dup-b', url: 'https://notion.so/dup-b' })

      const result = (await pages(mockNotion as any, {
        action: 'duplicate',
        page_ids: ['orig-a', 'orig-b']
      })) as DuplicatePageResult

      expect(result.processed).toBe(2)
      expect(result.results).toHaveLength(2)
    })

    it('throws without page_id or page_ids', async () => {
      await expect(pages(mockNotion as any, { action: 'duplicate' })).rejects.toThrow('page_id or page_ids required')
    })
  })

  // ---------------------------------------------------------------------------
  // unknown action
  // ---------------------------------------------------------------------------
  describe('unknown action', () => {
    it('throws on unknown action', async () => {
      await expect(pages(mockNotion as any, { action: 'explode' as any })).rejects.toThrow('Unknown action: explode')
    })
  })
})
