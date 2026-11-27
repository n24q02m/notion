/**
 * End to end: the shipped CLI bundle, run as a real subprocess.
 *
 * The unit suite calls the handlers in-process; this file builds `bin/cli.mjs`
 * with the same script `npm run build` uses and runs it with no Notion token
 * and a temporary `NOTION_DATA_DIR`, so it proves the console entry point --
 * not just the module -- exposes the tools. Every cell here is credential-free:
 * `--help`, `help`, `content_convert`, and the config tool's `status`.
 */

import { execFile } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { Client } from '@modelcontextprotocol/client'
import { SKILLS_EXTENSION_ID, SkillsClient } from '@modelcontextprotocol/client/ext/skills'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'
import { FILES_EXTENSION_ID } from '@n24q02m/hull/extensions'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { TOOL_COMMANDS } from './cli.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CLI = join(ROOT, 'bin', 'cli.mjs')
const run = promisify(execFile)

interface RunResult {
  stdout: string
  stderr: string
  code: number
}

let dataDir: string

async function exec(argv: string[], env: NodeJS.ProcessEnv, cwd = ROOT): Promise<RunResult> {
  try {
    const { stdout, stderr } = await run(process.execPath, argv, { cwd, env })
    return { stdout, stderr, code: 0 }
  } catch (error) {
    // A non-zero exit rejects with the child's output attached; keep it, since
    // the assertions read stderr to explain a failure.
    const failure = error as { code?: number; stdout?: string; stderr?: string }
    return {
      stdout: failure.stdout ?? '',
      stderr: failure.stderr ?? '',
      code: typeof failure.code === 'number' ? failure.code : 1
    }
  }
}

/**
 * Run the bundle with a clean console environment: no token, and a temporary
 * `NOTION_DATA_DIR` so the test can never read or write the caller's store.
 * `NODE_ENV` is overridden because the bundle only starts its CLI when it is
 * not `test`, and vitest sets `NODE_ENV=test` for every child it spawns.
 */
function cli(args: string[]): Promise<RunResult> {
  return exec([CLI, ...args], {
    ...process.env,
    NODE_ENV: 'production',
    NOTION_DATA_DIR: dataDir,
    NOTION_TOKEN: ''
  })
}

beforeAll(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'notion-cli-e2e-'))
  const build = await exec([join(ROOT, 'scripts', 'build-cli.js')], process.env)
  expect(build.code, build.stderr).toBe(0)
}, 180_000)

afterAll(async () => {
  await rm(dataDir, { recursive: true, force: true })
})

describe('the shipped CLI bundle', () => {
  it('lists a command for every registered tool', async () => {
    const { stdout, code } = await cli(['--help'])

    expect(code).toBe(0)
    expect(stdout).toContain('tool commands:')
    for (const spec of TOOL_COMMANDS) {
      expect(stdout, spec.command).toContain(`  ${spec.command}`)
    }
    expect(stdout).toContain('config-tool (MCP tool `config`)')
    expect(stdout).toContain('operator commands:')
  })

  it('documents a tool offline through the help tool', async () => {
    const { stdout, stderr, code } = await cli(['help', 'pages', '--json'])

    expect(code, stderr).toBe(0)
    const result = JSON.parse(stdout) as { tool: string; documentation: string }
    expect(result.tool).toBe('pages')
    expect(result.documentation.startsWith('# Pages Tool')).toBe(true)
  })

  it('converts markdown offline through content_convert', async () => {
    const { stdout, stderr, code } = await cli([
      'content_convert',
      '--direction',
      'markdown-to-blocks',
      '--content',
      '# Title',
      '--json'
    ])

    expect(code, stderr).toBe(0)
    const result = JSON.parse(stdout) as { direction: string; block_count: number; blocks: Array<{ type: string }> }
    expect(result.direction).toBe('markdown-to-blocks')
    expect(result.block_count).toBe(1)
    expect(result.blocks[0].type).toBe('heading_1')
  })

  it('accepts the kebab-case alias of a tool command', async () => {
    const { stdout, code } = await cli([
      'content-convert',
      '--direction',
      'blocks-to-markdown',
      '--content',
      '[{"object":"block","type":"paragraph","paragraph":{"rich_text":[{"type":"text","text":{"content":"hi"}}]}}]',
      '--json'
    ])

    expect(code).toBe(0)
    expect(JSON.parse(stdout) as { direction: string }).toMatchObject({ direction: 'blocks-to-markdown' })
  })

  it('reaches the config tool as config-tool and leaves the operator config command alone', async () => {
    const tool = await cli(['config-tool', 'status', '--json'])
    expect(tool.code, tool.stderr).toBe(0)
    expect(JSON.parse(tool.stdout) as { action: string }).toMatchObject({ action: 'status' })

    const operator = await cli(['config', 'status'])
    expect(operator.code).toBe(0)
    expect(operator.stdout).toContain('not configured')
  })

  it('prints one tool usage for --help without touching credentials', async () => {
    const { stdout, code } = await cli(['pages', '--help'])

    expect(code).toBe(0)
    expect(stdout).toContain('usage: notion pages <action> [flags]')
    expect(stdout).toContain('actions: create, get, get_property, update, move, archive, restore, duplicate')
  })
})

function mcpEnv(): Record<string, string> {
  const env: Record<string, string> = {}
  for (const [k, v] of Object.entries(process.env)) {
    if (v !== undefined) env[k] = v
  }
  env.NODE_ENV = 'production'
  env.NOTION_DATA_DIR = dataDir
  env.NOTION_TOKEN = 'ntn_e2e_spawn_token'
  return env
}

describe('MCP stdio over the shipped CLI bundle', () => {
  it('connects in 2026-07-28 auto mode and verifies skills, docs, files payload, and elicitation', async () => {
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [CLI],
      env: mcpEnv(),
      stderr: 'pipe'
    })

    const client = new Client(
      { name: 'spawn-e2e-2026', version: '1.0.0' },
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

    let confirmReset = false
    client.setRequestHandler('elicitation/create', async () =>
      confirmReset ? { action: 'accept', content: { confirm: true } } : { action: 'decline' }
    )

    try {
      await client.connect(transport)

      const tools = await client.listTools()
      expect(tools.tools.some((t) => t.name === 'pages')).toBe(true)

      const skillsClient = new SkillsClient(client)
      const listing = await skillsClient.list()
      expect(listing.skills.map((s) => s.frontmatter.name).sort()).toEqual(['bulk-update', 'organize-database'])

      const bulkSkill = listing.skills.find((s) => s.frontmatter.name === 'bulk-update')!
      const loaded = await skillsClient.read(bulkSkill)
      expect(loaded.verified).toBe(true)
      expect(loaded.text).toContain('bulk-update')

      const doc = await client.readResource({ uri: 'notion://docs/pages' })
      expect(doc.contents[0]).toMatchObject({ uri: 'notion://docs/pages', mimeType: 'text/markdown' })

      const converted = await client.callTool({
        name: 'content_convert',
        arguments: {
          direction: 'blocks-to-markdown',
          content: [{ type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: 'Spawn E2E' } }] } }]
        }
      })
      const meta = converted._meta as Record<string, unknown> | undefined
      expect(meta?.[FILES_EXTENSION_ID]).toHaveLength(1)

      confirmReset = false
      const declined = await client.callTool({
        name: 'config',
        arguments: { action: 'setup_reset', force: true }
      })
      expect(declined.structuredContent).toMatchObject({ cancelled: true, status: 'declined' })

      confirmReset = true
      const accepted = await client.callTool({
        name: 'config',
        arguments: { action: 'setup_reset', force: true }
      })
      expect(accepted.structuredContent).toMatchObject({ action: 'setup_reset', state: 'awaiting_setup' })
    } finally {
      await client.close()
    }
  }, 30_000)

  it('connects in legacy 2025 mode and falls back cleanly for files and elicitation', async () => {
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [CLI],
      env: mcpEnv(),
      stderr: 'pipe'
    })

    const legacyClient = new Client(
      { name: 'spawn-e2e-legacy', version: '1.0.0' },
      { versionNegotiation: { mode: 'legacy' } }
    )

    try {
      await legacyClient.connect(transport)
      const status = await legacyClient.callTool({
        name: 'config',
        arguments: { action: 'setup_reset', force: true }
      })
      const meta = status._meta as Record<string, unknown> | undefined
      expect(meta?.[FILES_EXTENSION_ID]).toBeUndefined()
      expect(status.structuredContent).toMatchObject({ action: 'setup_reset', state: 'awaiting_setup' })
    } finally {
      await legacyClient.close()
    }
  }, 30_000)
})
