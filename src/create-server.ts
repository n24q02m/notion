/**
 * Shared MCP Server Factory
 * Creates a configured McpServer instance reusable across stdio and HTTP transports.
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { McpServer } from '@modelcontextprotocol/server'
import { attachSkillsProvider, type SkillCatalog } from '@n24q02m/hull/skills'
import type { Client } from '@notionhq/client'
import { registerTools } from './tools/registry.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const normalizedDir = __dirname.replace(/\\/g, '/')

// Works from src/ (vitest/tsx), bin/ (esbuild bundle), and build/src/ (tsc output)
export const PACKAGE_ROOT = normalizedDir.endsWith('/build/src') ? join(__dirname, '..', '..') : join(__dirname, '..')
export const SKILLS_DIR = join(PACKAGE_ROOT, 'skills')

function getVersion(): string {
  try {
    const pkgPath = join(PACKAGE_ROOT, 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    return pkg.version ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
}

export interface CreateMCPServerOptions {
  skillsCatalog?: SkillCatalog
}

/**
 * Create a configured `McpServer` with all tools and resources registered,
 * optionally attaching a preloaded `SkillCatalog`.
 */
export function createMCPServer(
  notionClientFactory: () => Promise<Client>,
  options?: CreateMCPServerOptions
): McpServer {
  const server = new McpServer(
    { name: 'notion', version: getVersion() },
    { capabilities: { tools: {}, resources: {} } }
  )
  registerTools(server, notionClientFactory)
  if (options?.skillsCatalog) {
    options.skillsCatalog.attach(server)
  }
  return server
}

/**
 * Load and validate the bundled `skills/` directory via `attachSkillsProvider`
 * once so multi-session HTTP transports can reuse the catalog synchronously.
 */
export async function loadServerSkillsCatalog(skillsDir: string = SKILLS_DIR): Promise<SkillCatalog> {
  const probe = new McpServer({ name: 'notion', version: '0.0.0' })
  return attachSkillsProvider(probe, skillsDir)
}

/**
 * Create a configured `McpServer` and wire `attachSkillsProvider` (`io.modelcontextprotocol/skills`).
 */
export async function createConfiguredMCPServer(
  notionClientFactory: () => Promise<Client>,
  skillsDir: string = SKILLS_DIR
): Promise<McpServer> {
  const server = createMCPServer(notionClientFactory)
  await attachSkillsProvider(server, skillsDir)
  return server
}
