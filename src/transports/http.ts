/**
 * HTTP transport: Streamable HTTP on hull `runHttpServer`.
 *
 * Environment:
 *   PORT                  listen port (default 0 = auto)
 *   HOST                  bind host (default 127.0.0.1)
 *   MCP_AUTH_MODE         multi (default) | token | no-auth
 *   MCP_USERS_FILE        users.toml for multi (default ~/.hull/users.toml)
 *   MCP_AUTH_TOKEN_HASH   scrypt$ hash of the shared token, for token mode
 *                         (mint with `token hash`)
 *   MCP_RPM               optional per-minute cap, token mode
 *
 * Multi mode resolves each caller to a namespace via hull `currentUser()`.
 * The Notion token is then read from that namespace only. `no-auth` refuses
 * non-loopback hosts (enforced by hull).
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { HttpAuthConfig } from '@n24q02m/hull/token-auth'
import { runHttpServer } from '@n24q02m/hull/transport'
import { createMCPServer } from '../create-server.js'
import { notionClientForCaller } from '../notion-client.js'

const SERVER_NAME = 'notion'

/** Maps the MCP_AUTH_* environment to a hull `HttpAuthConfig`. */
export function buildAuthConfig(env: NodeJS.ProcessEnv): HttpAuthConfig {
  const mode = env.MCP_AUTH_MODE ?? 'multi'
  switch (mode) {
    case 'multi':
      return { mode: 'multi', usersFile: env.MCP_USERS_FILE || undefined }
    case 'token': {
      const tokenHash = env.MCP_AUTH_TOKEN_HASH
      if (!tokenHash) {
        throw new Error('MCP_AUTH_MODE=token requires MCP_AUTH_TOKEN_HASH (mint with `token hash`)')
      }
      const rpm = env.MCP_RPM ? Number.parseInt(env.MCP_RPM, 10) : null
      return { mode: 'token', tokenHash, rpm }
    }
    case 'no-auth':
      return { mode: 'no-auth' }
    default:
      throw new Error(`Unknown MCP_AUTH_MODE "${mode}" (expected multi, token, or no-auth)`)
  }
}

export async function startHttp(): Promise<void> {
  const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 0
  const host = process.env.HOST || '127.0.0.1'
  const auth = buildAuthConfig(process.env)

  const handle = await runHttpServer(() => createMCPServer(notionClientForCaller) as unknown as McpServer, {
    serverName: SERVER_NAME,
    port,
    host,
    auth
  })
  console.error(`[notion] http mode on ${handle.host}:${handle.port} (auth=${auth.mode})`)

  await new Promise<void>((resolve) => {
    const shutdown = async () => {
      console.error(`[${SERVER_NAME}] shutting down`)
      await handle.close()
      resolve()
    }
    process.once('SIGINT', shutdown)
    process.once('SIGTERM', shutdown)
  })
}
