/**
 * Real hull HTTP server in `multi` mode with a temp users.toml. Two callers
 * (alice, bob) use different bearer tokens; only alice has a stored Notion
 * token. Each caller's `config` tool call must see only its own namespace.
 */
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { setHomeDirForTesting } from '@n24q02m/hull/storage'
import { hashToken } from '@n24q02m/hull/token-auth'
import { type HttpServerHandle, runHttpServer } from '@n24q02m/hull/transport'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMCPServer } from '../create-server.js'
import { saveNamespaceToken } from '../credential-state.js'
import { notionClientForCaller } from '../notion-client.js'

const FIXTURE_MASTER = 'http-multi-integration-fixture-master'
const FIXTURE_NOTION_TOKEN = 'fixture-notion-integration-value-alice'
const ALICE_BEARER = 'fixture-bearer-alice-caller'
const BOB_BEARER = 'fixture-bearer-bob-caller'

interface ConfigStatus {
  state: string
  has_token: boolean
  token_source: string | null
}

async function statusFor(url: URL, bearer: string): Promise<ConfigStatus> {
  const client = new Client({ name: 'notion-multi-test', version: '0.0.0' })
  const transport = new StreamableHTTPClientTransport(url, {
    requestInit: { headers: { Authorization: `Bearer ${bearer}` } }
  })
  await client.connect(transport)
  try {
    const result = await client.callTool({ name: 'config', arguments: { action: 'status' } })
    const text = (result.content as Array<{ type: string; text: string }>)[0]?.text ?? ''
    return JSON.parse(text) as ConfigStatus
  } finally {
    await client.close()
  }
}

describe('HTTP multi-user isolation (real hull server, real storage)', () => {
  let home: string
  let handle: HttpServerHandle
  let previousSecret: string | undefined
  let previousNotionToken: string | undefined

  beforeAll(async () => {
    home = await mkdtemp(join(tmpdir(), 'notion-http-multi-'))
    setHomeDirForTesting(home)
    previousSecret = process.env.CREDENTIAL_SECRET
    previousNotionToken = process.env.NOTION_TOKEN
    process.env.CREDENTIAL_SECRET = FIXTURE_MASTER
    delete process.env.NOTION_TOKEN

    await saveNamespaceToken('alice', FIXTURE_NOTION_TOKEN)

    const usersFile = join(home, 'users.toml')
    await writeFile(
      usersFile,
      [
        '[users.alice]',
        `token_hash = "${await hashToken(ALICE_BEARER)}"`,
        'enabled = true',
        'namespace = "alice"',
        'allowed_roots = []',
        '',
        '[users.bob]',
        `token_hash = "${await hashToken(BOB_BEARER)}"`,
        'enabled = true',
        'namespace = "bob"',
        'allowed_roots = []',
        ''
      ].join('\n')
    )

    handle = await runHttpServer(() => createMCPServer(notionClientForCaller) as unknown as McpServer, {
      serverName: 'notion',
      port: 0,
      host: '127.0.0.1',
      auth: { mode: 'multi', usersFile }
    })
  })

  afterAll(async () => {
    await handle?.close()
    setHomeDirForTesting(null)
    if (previousSecret === undefined) delete process.env.CREDENTIAL_SECRET
    else process.env.CREDENTIAL_SECRET = previousSecret
    if (previousNotionToken === undefined) delete process.env.NOTION_TOKEN
    else process.env.NOTION_TOKEN = previousNotionToken
    await rm(home, { recursive: true, force: true })
  })

  it('alice (stored token) sees a token; bob (no token) does not', async () => {
    const url = new URL(`http://127.0.0.1:${handle.port}/mcp`)

    const alice = await statusFor(url, ALICE_BEARER)
    expect(alice.state).toBe('configured')
    expect(alice.has_token).toBe(true)
    expect(alice.token_source).toBe('config')

    const bob = await statusFor(url, BOB_BEARER)
    expect(bob.has_token).toBe(false)
    expect(bob.token_source).toBeNull()
  })

  it('rejects an unknown bearer before any tool runs', async () => {
    const url = new URL(`http://127.0.0.1:${handle.port}/mcp`)
    await expect(statusFor(url, 'fixture-bearer-unknown-caller')).rejects.toThrow()
  })
})
