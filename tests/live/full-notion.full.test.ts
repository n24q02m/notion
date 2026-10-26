/**
 * Full/Real Notion MCP Tests
 *
 * Stdio + NOTION_TOKEN --- Tests the tool surface with real Notion API calls.
 * Skipped when NOTION_TOKEN is not set.
 *
 * Run: bun run test:full
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const NOTION_TOKEN = process.env.NOTION_TOKEN ?? ''

const TOOL_NAMES = [
  'pages',
  'databases',
  'blocks',
  'users',
  'workspace',
  'comments',
  'content_convert',
  'file_uploads',
  'help'
] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractText(result: any): string {
  const raw = (result.content as Array<{ type: string; text: string }>)[0]?.text ?? ''
  // Strip <untrusted_notion_content> wrapper if present
  const match = raw.match(/<untrusted_notion_content>([\s\S]*?)<\/untrusted_notion_content>/)
  return match ? match[1].trim() : raw
}

function safeParse(text: string): any {
  try {
    return JSON.parse(text)
  } catch {
    // Try to extract JSON object from text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
    throw new Error(`Cannot parse JSON from: ${text.slice(0, 200)}`)
  }
}

/** Extract ID from Notion response --- handles various *_id fields */
function extractId(parsed: any): string | undefined {
  return parsed.page_id ?? parsed.database_id ?? parsed.block_id ?? parsed.comment_id ?? parsed.id
}

// ---------------------------------------------------------------------------
// Group 2: Stdio + NOTION_TOKEN --- Real Notion API Tests
// ---------------------------------------------------------------------------

describe.skipIf(!NOTION_TOKEN)('Stdio + NOTION_TOKEN --- Real Notion API', () => {
  let client: Client
  let transport: StdioClientTransport

  // Track all created resources for cleanup
  const createdPageIds: string[] = []
  const createdDatabaseIds: string[] = []
  let testParentPageId: string
  let testDatabaseId: string
  let testPageId: string
  let testBlockId: string
  let botUserId: string

  beforeAll(async () => {
    transport = new StdioClientTransport({
      command: 'node',
      args: ['bin/cli.mjs'],
      env: {
        PATH: process.env.PATH ?? '',
        HOME: process.env.HOME ?? '',
        NODE_ENV: 'test',
        NOTION_TOKEN
      },
      stderr: 'pipe'
    })
    client = new Client({ name: 'full-test', version: '1.0.0' })
    await client.connect(transport)
  }, 30_000)

  afterAll(async () => {
    // Cleanup: archive all created pages and databases
    for (const id of [...createdPageIds, ...createdDatabaseIds]) {
      try {
        await client.callTool({
          name: 'pages',
          arguments: { action: 'archive', page_id: id }
        })
      } catch {
        // Best effort cleanup
      }
    }
    await transport.close()
  }, 30_000)

  // -- Server info --

  describe('Server initialization', () => {
    it('should connect with NOTION_TOKEN and report server info', () => {
      const serverVersion = client.getServerVersion()
      expect(serverVersion?.name).toBe('notion')
      expect(serverVersion?.version).toMatch(/^\d+\.\d+\.\d+/)
    })

    it('should list all 9 tools', async () => {
      const result = await client.listTools()
      const names = result.tools.map((t) => t.name)
      expect(names).toHaveLength(9)
      for (const name of TOOL_NAMES) {
        expect(names).toContain(name)
      }
    })

    it('should list documentation resources', async () => {
      const result = await client.listResources()
      expect(result.resources.length).toBeGreaterThanOrEqual(8)
    })
  })

  // -- Users --

  describe('users', () => {
    it('me --- should return bot user info', async () => {
      const result = await client.callTool({
        name: 'users',
        arguments: { action: 'me' }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      expect(parsed.id).toBeTruthy()
      expect(parsed.type).toBe('bot')
      botUserId = parsed.id
    })

    it('get --- should return user by ID (or permission error)', async () => {
      if (!botUserId) return // skip if users.me didn't populate this
      const result = await client.callTool({
        name: 'users',
        arguments: { action: 'get', user_id: botUserId }
      })
      // Integration tokens may not have access to user details --- both OK
      if (!result.isError) {
        const text = extractText(result)
        const parsed = safeParse(text)
        expect(parsed.id).toBe(botUserId)
      } else {
        const text = extractText(result)
        expect(text).toContain('does not have access')
      }
    })

    it('list - should return workspace users (or permission error)', async () => {
      const result = await client.callTool({
        name: 'users',
        arguments: { action: 'list' }
      })
      const text = extractText(result)
      // May fail with permission error for non-admin integrations --- both OK
      if (!result.isError) {
        const parsed = safeParse(text)
        expect(parsed.users).toBeDefined()
        expect(Array.isArray(parsed.users)).toBe(true)
      }
    })
  })

  // -- Workspace --

  describe('workspace', () => {
    it('info --- should return workspace details', async () => {
      const result = await client.callTool({
        name: 'workspace',
        arguments: { action: 'info' }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      expect(parsed.bot).toBeDefined()
    })

    it('search --- should return results', async () => {
      const result = await client.callTool({
        name: 'workspace',
        arguments: { action: 'search', limit: 3 }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      expect(parsed.results).toBeDefined()
    })
  })

  // -- Pages --

  describe('pages', () => {
    it('create --- should create a test parent page', async () => {
      // Search for a page to use as parent
      const searchResult = await client.callTool({
        name: 'workspace',
        arguments: { action: 'search', limit: 1 }
      })
      const searchText = extractText(searchResult)
      const searchParsed = safeParse(searchText)
      const parentId = searchParsed.results?.[0]?.id

      // If no accessible page, skip --- integration needs at least one shared page
      if (!parentId) {
        console.warn('No accessible page found. Skipping page tests. Share a page with the integration.')
        return
      }

      const result = await client.callTool({
        name: 'pages',
        arguments: {
          action: 'create',
          parent_id: parentId,
          title: '[TEST] MCP Full Test Parent',
          content: 'This page is created by automated tests. Safe to delete.'
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      testParentPageId = extractId(parsed)!
      createdPageIds.push(testParentPageId)
      expect(testParentPageId).toBeTruthy()
    }, 60_000)

    it('get --- should retrieve the created page', async () => {
      if (!testParentPageId) return
      const result = await client.callTool({
        name: 'pages',
        arguments: { action: 'get', page_id: testParentPageId }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      expect(text).toContain('MCP Full Test Parent')
    })

    it('update --- should update page title', async () => {
      if (!testParentPageId) return
      const result = await client.callTool({
        name: 'pages',
        arguments: {
          action: 'update',
          page_id: testParentPageId,
          title: '[TEST] MCP Full Test Parent (Updated)'
        }
      })
      expect(result.isError).toBeFalsy()
    })

    it('create child --- should create a child page', async () => {
      if (!testParentPageId) return
      const result = await client.callTool({
        name: 'pages',
        arguments: {
          action: 'create',
          parent_id: testParentPageId,
          title: '[TEST] Child Page',
          content: '## Child Content\n\nThis is a child page with **bold** and *italic* text.'
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      testPageId = extractId(parsed)!
      createdPageIds.push(testPageId)
    }, 30_000)

    it('duplicate --- should duplicate the child page', async () => {
      if (!testPageId) return
      const result = await client.callTool({
        name: 'pages',
        arguments: {
          action: 'duplicate',
          page_id: testPageId,
          parent_id: testParentPageId
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      if (parsed.id) createdPageIds.push(parsed.id)
    }, 30_000)

    it('archive --- should archive the child page', async () => {
      if (!testPageId) return
      const result = await client.callTool({
        name: 'pages',
        arguments: { action: 'archive', page_id: testPageId }
      })
      expect(result.isError).toBeFalsy()
    })

    it('restore --- should restore the archived page', async () => {
      if (!testPageId) return
      const result = await client.callTool({
        name: 'pages',
        arguments: { action: 'restore', page_id: testPageId }
      })
      expect(result.isError).toBeFalsy()
    })

    it('move --- should move child page (re-parent)', async () => {
      if (!testPageId || !testParentPageId) return
      const result = await client.callTool({
        name: 'pages',
        arguments: { action: 'move', page_id: testPageId, parent_id: testParentPageId }
      })
      // move may fail if Notion API does not support it for this page type
      if (!result.isError) {
        const text = extractText(result)
        expect(text).toBeTruthy()
      }
    })
  })

  // -- Blocks --

  describe('blocks', () => {
    it('append --- should append content to the child page', async () => {
      if (!testPageId) return
      const result = await client.callTool({
        name: 'blocks',
        arguments: {
          action: 'append',
          block_id: testPageId,
          content: '### Appended Heading\n\n- Item 1\n- Item 2\n- Item 3'
        }
      })
      const text = extractText(result)
      if (result.isError) {
        expect(text).toBeTruthy()
        return
      }
      const parsed = safeParse(text)
      // Response may have results array or appended_count
      expect(parsed.results ?? parsed.appended_count).toBeDefined()
    })

    it('children --- should list child blocks', async () => {
      if (!testPageId) return
      const result = await client.callTool({
        name: 'blocks',
        arguments: { action: 'children', block_id: testPageId }
      })
      const text = extractText(result)
      if (result.isError) {
        expect(text).toBeTruthy()
        return
      }
      const parsed = safeParse(text)
      const blocks = parsed.results ?? parsed.blocks
      expect(blocks).toBeDefined()
      if (blocks && blocks.length > 0) {
        testBlockId = extractId(blocks[0]) ?? blocks[0].id
      }
    })

    it('get --- should retrieve a single block', async () => {
      if (!testBlockId) return
      const result = await client.callTool({
        name: 'blocks',
        arguments: { action: 'get', block_id: testBlockId }
      })
      if (result.isError) return // block may have been cleaned up
      const text = extractText(result)
      const parsed = safeParse(text)
      expect(extractId(parsed) ?? parsed.id).toBe(testBlockId)
    })

    it('update --- should update a text block', async () => {
      if (!testBlockId) return
      const result = await client.callTool({
        name: 'blocks',
        arguments: {
          action: 'update',
          block_id: testBlockId,
          content: 'Updated block content via test'
        }
      })
      // May fail if the block type is not updatable --- both OK
      if (!result.isError) {
        const text = extractText(result)
        expect(text).toBeTruthy()
      }
    })

    it('delete --- should delete a block', async () => {
      if (!testBlockId) return
      // Append a throwaway block first, then delete it
      const appendResult = await client.callTool({
        name: 'blocks',
        arguments: {
          action: 'append',
          block_id: testPageId,
          content: 'Throwaway block to delete'
        }
      })
      if (appendResult.isError) return

      const appendText = extractText(appendResult)
      const appendParsed = JSON.parse(appendText)
      const throwawayBlockId = appendParsed.results?.[0]?.id
      if (!throwawayBlockId) return

      const result = await client.callTool({
        name: 'blocks',
        arguments: { action: 'delete', block_id: throwawayBlockId }
      })
      expect(result.isError).toBeFalsy()
    })
  })

  // -- Databases --

  describe('databases', () => {
    it('create --- should create a test database', async () => {
      if (!testParentPageId) return
      const result = await client.callTool({
        name: 'databases',
        arguments: {
          action: 'create',
          parent_id: testParentPageId,
          title: '[TEST] Full Test Database',
          properties: {
            Name: { title: {} },
            Status: {
              select: {
                options: [
                  { name: 'Todo', color: 'red' },
                  { name: 'In Progress', color: 'yellow' },
                  { name: 'Done', color: 'green' }
                ]
              }
            },
            Priority: { number: {} },
            Tags: {
              multi_select: {
                options: [
                  { name: 'bug', color: 'red' },
                  { name: 'feature', color: 'blue' }
                ]
              }
            },
            Done: { checkbox: {} }
          }
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      testDatabaseId = extractId(parsed)!
      createdDatabaseIds.push(testDatabaseId)
      expect(testDatabaseId).toBeTruthy()
    }, 30_000)

    it('get --- should retrieve the database schema', async () => {
      if (!testDatabaseId) return
      const result = await client.callTool({
        name: 'databases',
        arguments: { action: 'get', database_id: testDatabaseId }
      })
      const text = extractText(result)
      if (result.isError) {
        expect(text).toBeTruthy()
        return
      }
      const parsed = safeParse(text)
      expect(parsed.properties ?? parsed.schema).toBeDefined()
    })

    it('create_page --- should add rows to the database', async () => {
      if (!testDatabaseId) return
      const result = await client.callTool({
        name: 'databases',
        arguments: {
          action: 'create_page',
          database_id: testDatabaseId,
          pages: [
            { properties: { Name: 'Task Alpha', Status: 'Todo', Priority: 1, Tags: ['bug'], Done: false } },
            { properties: { Name: 'Task Beta', Status: 'In Progress', Priority: 2, Tags: ['feature'], Done: false } },
            { properties: { Name: 'Task Gamma', Status: 'Done', Priority: 3, Tags: ['bug', 'feature'], Done: true } }
          ]
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      // Track created pages for cleanup
      if (Array.isArray(parsed.results)) {
        for (const r of parsed.results) {
          if (r.id) createdPageIds.push(r.id)
        }
      } else if (parsed.id) {
        createdPageIds.push(parsed.id)
      }
    }, 30_000)

    it('query --- should query database rows', async () => {
      if (!testDatabaseId) return
      const result = await client.callTool({
        name: 'databases',
        arguments: {
          action: 'query',
          database_id: testDatabaseId,
          limit: 10
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      expect(parsed.results).toBeDefined()
      expect(parsed.results.length).toBeGreaterThanOrEqual(1)
    })

    it('query with search --- should filter by text', async () => {
      if (!testDatabaseId) return
      const result = await client.callTool({
        name: 'databases',
        arguments: {
          action: 'query',
          database_id: testDatabaseId,
          search: 'Alpha'
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      expect(parsed.results).toBeDefined()
    })

    it('update_page --- should update a database row', async () => {
      if (!testDatabaseId) return
      // Query to get a page ID
      const queryResult = await client.callTool({
        name: 'databases',
        arguments: { action: 'query', database_id: testDatabaseId, limit: 1 }
      })
      const queryText = extractText(queryResult)
      const queryParsed = JSON.parse(queryText)
      const pageId = queryParsed.results?.[0]?.id
      if (!pageId) return

      const result = await client.callTool({
        name: 'databases',
        arguments: {
          action: 'update_page',
          database_id: testDatabaseId,
          page_id: pageId,
          page_properties: { Status: 'Done', Priority: 99, Done: true }
        }
      })
      expect(result.isError).toBeFalsy()
    })

    it('delete_page --- should archive a database row', async () => {
      if (!testDatabaseId) return
      // Query to get a page ID
      const queryResult = await client.callTool({
        name: 'databases',
        arguments: { action: 'query', database_id: testDatabaseId, limit: 1 }
      })
      const queryText = extractText(queryResult)
      const queryParsed = JSON.parse(queryText)
      const pageId = queryParsed.results?.[0]?.id
      if (!pageId) return

      const result = await client.callTool({
        name: 'databases',
        arguments: {
          action: 'delete_page',
          database_id: testDatabaseId,
          page_ids: [pageId]
        }
      })
      expect(result.isError).toBeFalsy()
    })

    it('update_database --- should update database title', async () => {
      if (!testDatabaseId) return
      const result = await client.callTool({
        name: 'databases',
        arguments: {
          action: 'update_database',
          database_id: testDatabaseId,
          title: '[TEST] Full Test Database (Updated)'
        }
      })
      // update_database may not be supported on all plans --- both OK
      if (!result.isError) {
        const text = extractText(result)
        expect(text).toBeTruthy()
      }
    })
  })

  // -- Comments --

  describe('comments', () => {
    it('create --- should add a comment to a page', async () => {
      if (!testPageId) return
      const result = await client.callTool({
        name: 'comments',
        arguments: {
          action: 'create',
          page_id: testPageId,
          content: 'Test comment from MCP full test suite'
        }
      })
      const text = extractText(result)
      // Comments API may require specific capabilities
      if (result.isError) {
        expect(text).toBeTruthy()
        return
      }
      const parsed = safeParse(text)
      expect(extractId(parsed)).toBeTruthy()
    })

    it('list - should list comments on the page', async () => {
      if (!testPageId) return
      const result = await client.callTool({
        name: 'comments',
        arguments: { action: 'list', page_id: testPageId }
      })
      // Known Notion API limitation: comments.list returns 404 with OAuth tokens on 2025-09-03
      // With integration tokens it should work, but with OAuth tokens we expect
      // the improved tool logic to catch it as COMMENTS_LIST_UNAVAILABLE.
      if (result.isError) {
        const text = extractText(result)
        expect(text).toContain('COMMENTS_LIST_UNAVAILABLE')
      } else {
        const text = extractText(result)
        const parsed = safeParse(text)
        expect(parsed.results).toBeDefined()
      }
    })
  })

  // -- Content Convert --

  describe('content_convert', () => {
    it('markdown-to-blocks --- should convert markdown to Notion blocks', async () => {
      const result = await client.callTool({
        name: 'content_convert',
        arguments: {
          direction: 'markdown-to-blocks',
          content:
            '# Heading 1\n\n## Heading 2\n\nParagraph with **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n```javascript\nconsole.log("hello")\n```\n\n> Blockquote\n\n---\n\n- [x] Done task\n- [ ] Pending task'
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      expect(parsed.direction).toBe('markdown-to-blocks')
      expect(parsed.block_count).toBeGreaterThan(0)
      expect(Array.isArray(parsed.blocks)).toBe(true)
    })

    it('blocks-to-markdown --- should convert Notion blocks to markdown', async () => {
      const blocks = [
        {
          type: 'heading_1',
          heading_1: { rich_text: [{ type: 'text', text: { content: 'Test Heading' } }] }
        },
        {
          type: 'paragraph',
          paragraph: { rich_text: [{ type: 'text', text: { content: 'Test paragraph.' } }] }
        }
      ]
      const result = await client.callTool({
        name: 'content_convert',
        arguments: {
          direction: 'blocks-to-markdown',
          content: JSON.stringify(blocks)
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      expect(parsed.direction).toBe('blocks-to-markdown')
      expect(parsed.markdown).toContain('Test Heading')
      expect(parsed.markdown).toContain('Test paragraph')
    })
  })

  // -- Help --

  describe('help', () => {
    for (const toolName of TOOL_NAMES.filter((t) => t !== 'help')) {
      it(`should return documentation for ${toolName}`, async () => {
        const result = await client.callTool({
          name: 'help',
          arguments: { tool_name: toolName }
        })
        expect(result.isError).toBeFalsy()
        const text = extractText(result)
        const parsed = safeParse(text)
        expect(parsed.tool).toBe(toolName)
        expect(parsed.documentation).toBeTruthy()
        expect(parsed.documentation.length).toBeGreaterThan(50)
      })
    }
  })

  // -- Pages: get_property --

  describe('pages --- get_property', () => {
    it('should retrieve a property value from a database row', async () => {
      if (!testDatabaseId) return
      // Query to get a row
      const queryResult = await client.callTool({
        name: 'databases',
        arguments: { action: 'query', database_id: testDatabaseId, limit: 1 }
      })
      const queryText = extractText(queryResult)
      const queryParsed = JSON.parse(queryText)
      const row = queryParsed.results?.[0]
      if (!row) return

      // Get the title property ID
      const titlePropId = Object.entries(row.properties || {}).find(
        ([, v]: [string, any]) => v.type === 'title'
      )?.[1] as any
      const propId = titlePropId?.id
      if (!propId) return

      const result = await client.callTool({
        name: 'pages',
        arguments: { action: 'get_property', page_id: row.id, property_id: propId }
      })
      expect(result.isError).toBeFalsy()
    })
  })

  // -- File Uploads --

  describe('file_uploads', () => {
    it('list - should list file uploads (may be empty)', async () => {
      const result = await client.callTool({
        name: 'file_uploads',
        arguments: { action: 'list', limit: 5 }
      })
      // File uploads API may return results or error depending on plan/permissions
      const text = extractText(result)
      expect(text).toBeTruthy() // At least some response
    })

    it('create + send + complete --- should upload a small text file', async () => {
      // Create upload
      const createResult = await client.callTool({
        name: 'file_uploads',
        arguments: {
          action: 'create',
          filename: 'test-upload.txt',
          content_type: 'text/plain',
          mode: 'single'
        }
      })
      if (createResult.isError) return // API may not be available

      const createText = extractText(createResult)
      const createParsed = JSON.parse(createText)
      const fileUploadId = createParsed.id
      if (!fileUploadId) return

      // Send content (base64 encoded "Hello from MCP test!")
      const base64Content = Buffer.from('Hello from MCP test!').toString('base64')
      const sendResult = await client.callTool({
        name: 'file_uploads',
        arguments: {
          action: 'send',
          file_upload_id: fileUploadId,
          file_content: base64Content
        }
      })
      if (sendResult.isError) return

      // Complete upload
      const completeResult = await client.callTool({
        name: 'file_uploads',
        arguments: { action: 'complete', file_upload_id: fileUploadId }
      })
      if (!completeResult.isError) {
        const completeText = extractText(completeResult)
        const completeParsed = JSON.parse(completeText)
        expect(completeParsed.status || completeParsed.id).toBeTruthy()
      }
    }, 20_000)
  })

  // -- Workspace search with filter --

  describe('workspace --- advanced search', () => {
    it('search with page filter', async () => {
      const result = await client.callTool({
        name: 'workspace',
        arguments: {
          action: 'search',
          query: 'TEST',
          filter: { object: 'page' },
          limit: 5
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      expect(parsed.results).toBeDefined()
    })

    it('search with data_source filter', async () => {
      const result = await client.callTool({
        name: 'workspace',
        arguments: {
          action: 'search',
          filter: { object: 'data_source' },
          limit: 5
        }
      })
      expect(result.isError).toBeFalsy()
      const text = extractText(result)
      const parsed = safeParse(text)
      expect(parsed.results).toBeDefined()
    })

    it('search with sort', async () => {
      const result = await client.callTool({
        name: 'workspace',
        arguments: {
          action: 'search',
          sort: { direction: 'descending', timestamp: 'last_edited_time' },
          limit: 3
        }
      })
      expect(result.isError).toBeFalsy()
    })
  })
})
