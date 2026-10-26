/**
 * Unified entry point for the notion MCP server
 *
 * TRANSPORT_MODE selects the transport:
 *   - "stdio" (default): single-user. Token from NOTION_TOKEN env or from
 *     `notion auth`. Uses the MCP SDK StdioServerTransport directly.
 *   - "http": multi-user Streamable HTTP. Auth mode from MCP_AUTH_MODE
 *     (see transports/http.ts).
 */

import { readFileSync, realpathSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { buildCli } from '@n24q02m/hull'
import {
  assertNamespace,
  DEFAULT_NAMESPACE,
  getState,
  resolveCredentialState,
  STORE_PLUGIN,
  saveNamespaceToken
} from './credential-state.js'
import { createNotionClient, notionClientForCaller } from './notion-client.js'
import { registerTools } from './tools/registry.js'

const SERVER_NAME = 'notion'

function getPackageVersion(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    const pkgPath = join(here, '..', 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version?: string }
    return pkg.version ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
}

/**
 * Checks if the current module is the main entry point.
 */
export function isMain(importMetaUrl: string): boolean {
  const entrypoint = process.argv[1]
  if (!entrypoint) return false

  try {
    const mainPath = realpathSync(fileURLToPath(importMetaUrl))
    const entryPath = realpathSync(entrypoint)

    if (process.platform === 'win32') {
      // Normalize slashes and casing for Windows
      const normalize = (p: string) => p.replace(/\\/g, '/').toLowerCase()
      return normalize(mainPath) === normalize(entryPath)
    }

    return mainPath === entryPath
  } catch {
    return false
  }
}

/**
 * Validates and returns the transport mode from the environment.
 */
export function getTransportMode(env: NodeJS.ProcessEnv = process.env, argv: string[] = process.argv): string {
  const isHttp = argv.includes('--http') || env.MCP_TRANSPORT === 'http' || env.TRANSPORT_MODE === 'http'
  return isHttp ? 'http' : 'stdio'
}

/**
 * Dynamically imports and starts the server for the specified mode.
 */
export async function startServer(mode: string): Promise<void> {
  if (process.env.BETTER_NOTION_MCP_BOOTSTRAPPED) {
    console.error(`[${SERVER_NAME}] Startup aborted: server already running in this process tree.`)
    return
  }
  process.env.BETTER_NOTION_MCP_BOOTSTRAPPED = 'true'

  if (mode === 'http') {
    const { startHttp } = await import('./transports/http.js')
    await startHttp()
    return
  }

  // Stdio is single-user. Fail fast when no token is available from the env
  // or from `notion auth`, instead of starting a server that cannot serve tools.
  await resolveCredentialState()
  if (getState() !== 'configured') {
    const msg = `[${SERVER_NAME}] Notion integration token required for stdio mode but not set.

Options:
  1. Set env in plugin config:
     {"command": "npx", "args": [...], "env": {"NOTION_TOKEN": "ntn_..."}}

  2. Store a token once on this machine:
     npx -y @n24q02m/better-notion-mcp auth

Documentation: https://mcp.n24q02m.com/servers/better-notion-mcp/
`
    process.stderr.write(msg)
    process.exit(1)
    return
  }

  const server = new Server(
    { name: SERVER_NAME, version: getPackageVersion() },
    { capabilities: { tools: {}, resources: {} } }
  )

  registerTools(server, notionClientForCaller)

  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error(`[${SERVER_NAME}] Server started in stdio mode (v${getPackageVersion()})`)
}

// Global state for the selected mode
export const mode = getTransportMode()

/**
 * Bootstrap function to start the server with error handling.
 */
export async function bootstrap(selectedMode: string = mode) {
  try {
    await startServer(selectedMode)
  } catch (error) {
    console.error('Failed to start server:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

/**
 * `serve` entry point for `buildCli`.
 *
 * `bootstrap()` resolves as soon as the transport is ready. For stdio,
 * `server.connect` resolves when stdin attaches, not when the session ends,
 * so this keeps the promise pending until SIGINT/SIGTERM. Otherwise buildCli's
 * `.then((code) => process.exit(code))` would kill the process right after
 * startup. HTTP blocks inside `startHttp()` until its own shutdown.
 */
async function serve(): Promise<void> {
  await bootstrap()
  if (mode === 'http') return
  await new Promise<void>((resolve) => {
    const shutdown = () => {
      console.error(`[${SERVER_NAME}] shutting down`)
      resolve()
    }
    process.once('SIGINT', shutdown)
    process.once('SIGTERM', shutdown)
  })
}

function parseUserFlag(argv: string[]): string {
  const idx = argv.indexOf('--user')
  if (idx === -1) return DEFAULT_NAMESPACE
  const value = argv[idx + 1]
  if (!value || value.startsWith('--')) {
    throw new Error('--user requires a namespace value, e.g. --user alice')
  }
  return assertNamespace(value)
}

async function readTokenInteractively(): Promise<string> {
  const fromEnv = process.env.NOTION_TOKEN?.trim()
  if (fromEnv) return fromEnv
  const rl = createInterface({ input: process.stdin, output: process.stderr })
  try {
    return (await rl.question('Notion integration token (ntn_... or secret_...): ')).trim()
  } finally {
    rl.close()
  }
}

/**
 * `notion auth [--user <namespace>]`: store a Notion integration token.
 *
 * The token is read from NOTION_TOKEN or prompted for (never accepted as an
 * argv value, so it stays out of shell history). It is verified with
 * Notion `users.me` before it is saved. Credential values are never printed.
 */
export async function authCommand(argv: string[]): Promise<number> {
  let namespace: string
  try {
    namespace = parseUserFlag(argv)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    return 2
  }

  const token = await readTokenInteractively()
  if (!/^(ntn_|secret_)[A-Za-z0-9]+$/.test(token)) {
    console.error('Token must be a Notion integration token starting with "ntn_" or "secret_".')
    return 2
  }

  try {
    await createNotionClient(token).users.me({})
  } catch {
    console.error('Notion rejected this token (users.me failed). Nothing was saved.')
    return 1
  }

  await saveNamespaceToken(namespace, token)
  console.log(`Saved Notion token for namespace "${namespace}".`)
  return 0
}

// Only execute the CLI if we're the main module and not in a test environment.
if (isMain(import.meta.url) && process.env.NODE_ENV !== 'test') {
  buildCli(SERVER_NAME, {
    serve,
    version: getPackageVersion(),
    pluginName: STORE_PLUGIN,
    extra: { auth: authCommand }
  })(process.argv.slice(2)).then((code) => process.exit(code))
}
