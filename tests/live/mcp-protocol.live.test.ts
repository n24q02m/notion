/**
 * Live MCP Protocol Tests
 *
 * Spawns the actual MCP server via stdio and communicates using JSON-RPC
 * through the official MCP SDK client. Tests work WITHOUT NOTION_TOKEN
 * to verify plug-and-play UX.
 */

import { Client } from '@modelcontextprotocol/client'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const EXPECTED_TOOLS = [
  'pages',
  'databases',
  'blocks',
  'users',
  'workspace',
  'comments',
  'content_convert',
  'file_uploads',
  'help'
]

// All tools that call notionClientFactory() -- includes content_convert and help
// because the factory is invoked before the switch dispatch
const ALL_TOOL_NAMES = EXPECTED_TOOLS

describe('MCP Protocol - Live Server (no NOTION_TOKEN)', () => {
  let client: Client
  let transport: StdioClientTransport

  beforeAll(async () => {
    transport = new StdioClientTransport({
      command: 'node',
      args: ['bin/cli.mjs'],
      env: {
        PATH: process.env.PATH ?? '',
        HOME: process.env.HOME ?? '',
        NODE_ENV: 'test'
        // Intentionally NO NOTION_TOKEN
      },
      stderr: 'pipe'
    })
    client = new Client({ name: 'live-test', version: '1.0.0' })
    await client.connect(transport)
  }, 15_000)

  afterAll(async () => {
    await transport.close()
  })

  describe('Server initialization', () => {
    it('should connect and report server info', () => {
      const serverVersion = client.getServerVersion()
      expect(serverVersion).toBeDefined()
      expect(serverVersion?.name).toBe('notion')
      expect(serverVersion?.version).toMatch(/^\d+\.\d+\.\d+/)
    })

    it('should report tools capability', () => {
      const caps = client.getServerCapabilities()
      expect(caps).toBeDefined()
      expect(caps?.tools).toBeDefined()
    })

    it('should report resources capability', () => {
      const caps = client.getServerCapabilities()
      expect(caps?.resources).toBeDefined()
    })
  })

  describe('tools/list', () => {
    it('should return all 9 tools', async () => {
      const result = await client.listTools()
      const toolNames = result.tools.map((t) => t.name)
      expect(toolNames).toHaveLength(9)
      for (const name of EXPECTED_TOOLS) {
        expect(toolNames).toContain(name)
      }
    })

    it('should have valid inputSchema for each tool', async () => {
      const result = await client.listTools()
      for (const tool of result.tools) {
        expect(tool.inputSchema).toBeDefined()
        expect(tool.inputSchema.type).toBe('object')
        expect(tool.description).toBeTruthy()
      }
    })

    it('should have annotations on each tool', async () => {
      const result = await client.listTools()
      for (const tool of result.tools) {
        expect(tool.annotations).toBeDefined()
        expect(tool.annotations?.title).toBeTruthy()
      }
    })
  })

  describe('resources/list', () => {
    it('should return documentation resources', async () => {
      const result = await client.listResources()
      expect(result.resources.length).toBeGreaterThanOrEqual(8)
      for (const resource of result.resources) {
        expect(resource.uri).toMatch(/^notion:\/\/docs\//)
        expect(resource.mimeType).toBe('text/markdown')
      }
    })
  })

  describe('All tools return setup hint when NOTION_TOKEN is missing', () => {
    for (const toolName of ALL_TOOL_NAMES) {
      it(`${toolName} should return NOTION_TOKEN setup error`, async () => {
        // Each tool requires specific arguments
        const actionMap: Record<string, Record<string, unknown>> = {
          pages: { action: 'get', page_id: 'fake-id' },
          databases: { action: 'get', database_id: 'fake-id' },
          blocks: { action: 'get', block_id: 'fake-id' },
          users: { action: 'me' },
          workspace: { action: 'info' },
          comments: { action: 'list', page_id: 'fake-id' },
          file_uploads: { action: 'list' },
          content_convert: { direction: 'markdown-to-blocks', content: '# Test' },
          help: { tool_name: 'pages' }
        }

        const result = await client.callTool({
          name: toolName,
          arguments: actionMap[toolName]
        })
        expect(result.isError).toBe(true)
        const text = (result.content as Array<{ type: string; text: string }>)[0]?.text
        expect(text).toBeTruthy()
        expect(text).toContain('NOTION_TOKEN')
        expect(text).toContain('notion.so/my-integrations')
      })
    }
  })

  describe('unknown tool handling', () => {
    it('should return error for unknown tool', async () => {
      const result = await client.callTool({
        name: 'nonexistent_tool',
        arguments: { action: 'test' }
      })
      expect(result.isError).toBe(true)
      const text = (result.content as Array<{ type: string; text: string }>)[0]?.text
      // When no token, the factory throws before reaching tool dispatch,
      // so the error is about NOTION_TOKEN, not UNKNOWN_TOOL
      expect(text).toContain('NOTION_TOKEN')
    })
  })

  describe('no arguments handling', () => {
    it('should return error when no arguments provided', async () => {
      const result = await client.callTool({
        name: 'pages',
        arguments: undefined as any
      })
      expect(result.isError).toBe(true)
      const text = (result.content as Array<{ type: string; text: string }>)[0]?.text
      expect(text).toContain('No arguments provided')
    })
  })

  describe('ping', () => {
    it('should respond to ping', async () => {
      const result = await client.ping()
      expect(result).toBeDefined()
    })
  })
})
