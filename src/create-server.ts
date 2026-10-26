/**
 * Shared MCP Server Factory
 * Creates a configured MCP server instance reusable across transports
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import type { Client } from '@notionhq/client'
import { registerTools } from './tools/registry.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getVersion(): string {
  try {
    const pkgPath = join(__dirname, '..', 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    return pkg.version ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
}

/**
 * Create a configured MCP server with all tools registered
 * @param notionClientFactory - Resolves the calling user's Notion Client per invocation.
 *   Stdio resolves the default namespace; HTTP resolves the authenticated caller.
 */
export function createMCPServer(notionClientFactory: () => Promise<Client>): Server {
  const server = new Server({ name: 'notion', version: getVersion() }, { capabilities: { tools: {}, resources: {} } })
  registerTools(server, notionClientFactory)
  return server
}
