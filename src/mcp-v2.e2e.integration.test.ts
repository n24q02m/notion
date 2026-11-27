import { Client, InMemoryTransport, StreamableHTTPClientTransport } from '@modelcontextprotocol/client'
import { SKILLS_EXTENSION_ID, SkillsClient } from '@modelcontextprotocol/client/ext/skills'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import { FILES_EXTENSION_ID } from '@n24q02m/hull/extensions'
import { runHttpServer } from '@n24q02m/hull/transport'
import type { Client as NotionClient } from '@notionhq/client'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./credential-state.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./credential-state.js')>()
  return {
    ...actual,
    getSubjectToken: vi.fn().mockResolvedValue('ntn_e2e_test_token')
  }
})

import { createMCPServer, loadServerSkillsCatalog } from './create-server.js'

function createMockNotionClient() {
  const pagesRetrieve = vi.fn().mockResolvedValue({
    id: 'page-1',
    url: 'https://notion.so/page-1',
    created_time: '2026-01-01T00:00:00.000Z',
    last_edited_time: '2026-01-02T00:00:00.000Z',
    archived: false,
    icon: null,
    cover: null,
    properties: {
      title: {
        id: 'title',
        type: 'title',
        title: [{ plain_text: 'E2E Test Page' }]
      }
    }
  })

  const blocksChildrenList = vi.fn().mockResolvedValue({
    results: [
      {
        id: 'blk-1',
        type: 'paragraph',
        has_children: false,
        paragraph: { rich_text: [{ plain_text: 'Hello Notion MCP 2026-07-28' }] }
      }
    ],
    next_cursor: null,
    has_more: false
  })

  const pagesUpdate = vi.fn().mockResolvedValue({ id: 'page-1', archived: true })

  const client = {
    pages: {
      retrieve: pagesRetrieve,
      update: pagesUpdate
    },
    blocks: {
      children: {
        list: blocksChildrenList
      }
    }
  } as unknown as NotionClient

  return { client, pagesRetrieve, blocksChildrenList, pagesUpdate }
}

describe('MCP 2026-07-28 E2E integration (stdio + Streamable HTTP)', () => {
  let skillsCatalog: Awaited<ReturnType<typeof loadServerSkillsCatalog>>
  let mockNotion: ReturnType<typeof createMockNotionClient>

  beforeAll(async () => {
    skillsCatalog = await loadServerSkillsCatalog()
  })

  beforeEach(() => {
    mockNotion = createMockNotionClient()
  })

  describe('serveStdio with @modelcontextprotocol/client', () => {
    it('serves skills/list, skill://, notion://docs/*, MRTR elicitation, and files payload over 2026-07-28 stdio', async () => {
      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
      const stdioHandle = serveStdio(() => createMCPServer(async () => mockNotion.client, { skillsCatalog }), {
        transport: serverTransport
      })

      let elicitationAction: 'accept' | 'decline' = 'accept'
      const client = new Client(
        { name: 'e2e-stdio-2026', version: '1.0.0' },
        {
          versionNegotiation: { mode: 'auto' },
          capabilities: {
            elicitation: { form: {} },
            extensions: {
              [SKILLS_EXTENSION_ID]: {},
              [FILES_EXTENSION_ID]: {}
            }
          }
        }
      )

      const elicitationMessages: string[] = []
      client.setRequestHandler('elicitation/create', async (request) => {
        elicitationMessages.push(request.params.message)
        return elicitationAction === 'accept' ? { action: 'accept', content: { confirm: true } } : { action: 'decline' }
      })

      try {
        await client.connect(clientTransport)

        const skillsClient = new SkillsClient(client)
        expect(skillsClient.supported).toBe(true)

        const listing = await skillsClient.list()
        const skillNames = listing.skills.map((s) => s.frontmatter.name).sort()
        expect(skillNames).toEqual(['bulk-update', 'organize-database'])

        const firstSkill = listing.skills[0]!
        const loadedSkill = await skillsClient.read(firstSkill)
        expect(loadedSkill.verified).toBe(true)
        expect(loadedSkill.text).toContain(firstSkill.frontmatter.name)

        const resources = await client.listResources()
        expect(resources.resources.some((r) => r.uri === 'notion://docs/pages')).toBe(true)
        const doc = await client.readResource({ uri: 'notion://docs/pages' })
        expect(doc.contents[0]).toMatchObject({ uri: 'notion://docs/pages', mimeType: 'text/markdown' })

        // io.modelcontextprotocol/files payload on pages.get
        const pageResult = await client.callTool({
          name: 'pages',
          arguments: { action: 'get', page_id: 'page-1' }
        })
        const meta = pageResult._meta as Record<string, unknown> | undefined
        const filesMeta = meta?.[FILES_EXTENSION_ID] as Array<Record<string, unknown>> | undefined
        expect(filesMeta).toHaveLength(1)
        expect(filesMeta?.[0]).toMatchObject({
          name: 'page-1.md',
          mimeType: 'text/markdown',
          uri: 'https://notion.so/page-1'
        })

        // Elicitation decline cancels destructive archive before calling Notion API
        elicitationAction = 'decline'
        const declinedResult = await client.callTool({
          name: 'pages',
          arguments: { action: 'archive', page_ids: ['page-1'] }
        })
        expect(declinedResult.structuredContent).toMatchObject({
          action: 'archive',
          cancelled: true,
          status: 'declined'
        })
        expect(mockNotion.pagesUpdate).not.toHaveBeenCalled()

        // Elicitation accept proceeds with Notion API call via MRTR
        elicitationAction = 'accept'
        const acceptedResult = await client.callTool({
          name: 'pages',
          arguments: { action: 'archive', page_ids: ['page-1'] }
        })
        expect(acceptedResult.structuredContent).toMatchObject({
          action: 'archive',
          processed: 1
        })
        expect(mockNotion.pagesUpdate).toHaveBeenCalledOnce()
        expect(elicitationMessages.length).toBeGreaterThanOrEqual(2)
      } finally {
        await client.close()
        await stdioHandle.close()
      }
    })

    it('supports legacy 2025-11-25 client fallback (no files extension, headless elicitation fallback)', async () => {
      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
      const stdioHandle = serveStdio(() => createMCPServer(async () => mockNotion.client, { skillsCatalog }), {
        transport: serverTransport
      })

      const legacyClient = new Client(
        { name: 'e2e-stdio-legacy', version: '1.0.0' },
        { versionNegotiation: { mode: 'legacy' } }
      )

      try {
        await legacyClient.connect(clientTransport)

        const skillsClient = new SkillsClient(legacyClient)
        const listing = await skillsClient.list()
        expect(listing.skills.map((s) => s.frontmatter.name).sort()).toEqual(['bulk-update', 'organize-database'])

        // Older client without files capability gets plain result with no files _meta
        const pageResult = await legacyClient.callTool({
          name: 'pages',
          arguments: { action: 'get', page_id: 'page-1' }
        })
        const meta = pageResult._meta as Record<string, unknown> | undefined
        expect(meta?.[FILES_EXTENSION_ID]).toBeUndefined()
        expect(pageResult.structuredContent).toMatchObject({ action: 'get', page_id: 'page-1' })

        // Non-eliciting client falls back cleanly via elicitWithFallback defaultValue
        const archiveResult = await legacyClient.callTool({
          name: 'pages',
          arguments: { action: 'archive', page_ids: ['page-1'] }
        })
        expect(archiveResult.structuredContent).toMatchObject({ action: 'archive', processed: 1 })
        expect(mockNotion.pagesUpdate).toHaveBeenCalledOnce()
      } finally {
        await legacyClient.close()
        await stdioHandle.close()
      }
    })
  })

  describe('Streamable HTTP with @modelcontextprotocol/client', () => {
    let httpHandle: Awaited<ReturnType<typeof runHttpServer>>
    let endpointUrl: URL

    beforeAll(async () => {
      httpHandle = await runHttpServer(() => createMCPServer(async () => mockNotion.client, { skillsCatalog }), {
        serverName: 'notion',
        host: '127.0.0.1',
        port: 0,
        auth: { mode: 'no-auth' },
        corsAllowOrigins: ['https://claude.ai']
      })
      endpointUrl = new URL(`http://${httpHandle.host}:${httpHandle.port}/mcp`)
    })

    afterAll(async () => {
      await httpHandle.close()
    })

    it('applies MCP 2026-07-28 CORS headers and serves skills, files, and elicitation over HTTP', async () => {
      const preflight = await fetch(endpointUrl, {
        method: 'OPTIONS',
        headers: {
          Origin: 'https://claude.ai',
          'Access-Control-Request-Method': 'POST'
        }
      })
      expect(preflight.headers.get('access-control-allow-origin')).toBe('https://claude.ai')
      expect(preflight.headers.get('access-control-expose-headers')).toContain('Mcp-Session-Id')

      const client = new Client(
        { name: 'e2e-http-2026', version: '1.0.0' },
        {
          versionNegotiation: { mode: 'auto' },
          capabilities: {
            elicitation: { form: {} },
            extensions: {
              [SKILLS_EXTENSION_ID]: {},
              [FILES_EXTENSION_ID]: {}
            }
          }
        }
      )

      let shouldConfirm = true
      client.setRequestHandler('elicitation/create', async () =>
        shouldConfirm ? { action: 'accept', content: { confirm: true } } : { action: 'decline' }
      )

      const transport = new StreamableHTTPClientTransport(endpointUrl)
      try {
        await client.connect(transport)

        const skillsClient = new SkillsClient(client)
        const listing = await skillsClient.list()
        expect(listing.skills.map((s) => s.frontmatter.name).sort()).toEqual(['bulk-update', 'organize-database'])

        const orgSkill = listing.skills.find((s) => s.frontmatter.name === 'organize-database')!
        const readSkill = await skillsClient.read(orgSkill)
        expect(readSkill.verified).toBe(true)
        expect(readSkill.text).toContain('organize-database')

        const pageResult = await client.callTool({
          name: 'pages',
          arguments: { action: 'get', page_id: 'page-1' }
        })
        const meta = pageResult._meta as Record<string, unknown> | undefined
        expect(meta?.[FILES_EXTENSION_ID]).toHaveLength(1)

        shouldConfirm = false
        const declined = await client.callTool({
          name: 'pages',
          arguments: { action: 'archive', page_ids: ['page-1'] }
        })
        expect(declined.structuredContent).toMatchObject({ cancelled: true, status: 'declined' })
        expect(mockNotion.pagesUpdate).not.toHaveBeenCalled()

        shouldConfirm = true
        const accepted = await client.callTool({
          name: 'pages',
          arguments: { action: 'archive', page_ids: ['page-1'] }
        })
        expect(accepted.structuredContent).toMatchObject({ action: 'archive', processed: 1 })
        expect(mockNotion.pagesUpdate).toHaveBeenCalledOnce()
      } finally {
        await client.close()
      }
    })

    it('serves legacy 2025 clients over HTTP with files & elicitation fallback', async () => {
      const legacyClient = new Client(
        { name: 'e2e-http-legacy', version: '1.0.0' },
        { versionNegotiation: { mode: 'legacy' } }
      )
      const transport = new StreamableHTTPClientTransport(endpointUrl)
      try {
        await legacyClient.connect(transport)
        const skillsClient = new SkillsClient(legacyClient)
        const listing = await skillsClient.list()
        expect(listing.skills).toHaveLength(2)

        const convertResult = await legacyClient.callTool({
          name: 'content_convert',
          arguments: {
            direction: 'blocks-to-markdown',
            content: [
              { type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: 'Legacy HTTP' } }] } }
            ]
          }
        })
        const meta = convertResult._meta as Record<string, unknown> | undefined
        expect(meta?.[FILES_EXTENSION_ID]).toBeUndefined()
        expect(convertResult.structuredContent).toMatchObject({
          direction: 'blocks-to-markdown'
        })
      } finally {
        await legacyClient.close()
      }
    })
  })
})
