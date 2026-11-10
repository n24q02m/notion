import { readFileSync } from 'node:fs'
import type { Server } from '@modelcontextprotocol/sdk/server/index.js'
import type { Client } from '@notionhq/client'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'

vi.mock('./tools/composite/pages.js', () => ({ pages: vi.fn() }))
vi.mock('./tools/composite/databases.js', () => ({ databases: vi.fn() }))
vi.mock('./tools/composite/blocks.js', () => ({ blocks: vi.fn() }))
vi.mock('./tools/composite/comments.js', () => ({ commentsManage: vi.fn() }))
vi.mock('./tools/composite/content.js', () => ({ contentConvert: vi.fn() }))
vi.mock('./tools/composite/users.js', () => ({ users: vi.fn() }))
vi.mock('./tools/composite/workspace.js', () => ({ workspace: vi.fn() }))
vi.mock('./tools/composite/file-uploads.js', () => ({ fileUploads: vi.fn() }))
vi.mock('./tools/composite/config.js', () => ({ config: vi.fn() }))

vi.mock('node:fs/promises', () => ({ readFile: vi.fn() }))

vi.mock('./credential-state.js', () => ({
  STORE_PLUGIN: 'notion',
  SETUP_HINT: 'Run "notion auth" on the server to store a Notion integration token.',
  resolveCredentialState: vi.fn(async () => 'configured'),
  getSubjectToken: vi.fn(async () => 'fixture-stored-value')
}))

import { readFile } from 'node:fs/promises'
import {
  BUILTIN_OPERATOR_COMMANDS,
  CliUsageError,
  formatToolResult,
  parseToolArgs,
  printCliHelp,
  runCli,
  runToolCommand,
  SERVER_OPERATOR_COMMANDS,
  TOOL_COMMAND_NAMES,
  TOOL_COMMANDS
} from './cli.js'
import { getSubjectToken, resolveCredentialState } from './credential-state.js'
import { blocks } from './tools/composite/blocks.js'
import { commentsManage } from './tools/composite/comments.js'
import { config } from './tools/composite/config.js'
import { contentConvert } from './tools/composite/content.js'
import { databases } from './tools/composite/databases.js'
import { fileUploads } from './tools/composite/file-uploads.js'
import type { PagesResult } from './tools/composite/pages.js'
import { pages } from './tools/composite/pages.js'
import { users } from './tools/composite/users.js'
import type { WorkspaceResult } from './tools/composite/workspace.js'
import { workspace } from './tools/composite/workspace.js'
import { TOOLS } from './tools/definitions.js'
import { NotionMCPError } from './tools/helpers/errors.js'
import { registerTools } from './tools/registry.js'

// Dispatch tests only care that the handler's return value is what the CLI
// serializes; each composite's own suite covers its result shape.
const STUB_RESULT = { action: 'stub', ok: true }

function findCommand(name: string) {
  const spec = TOOL_COMMANDS.find((command) => command.name === name)
  if (spec === undefined) throw new Error(`no tool command ${name}`)
  return spec
}

function spyConsole() {
  return {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {})
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(resolveCredentialState).mockResolvedValue('configured')
  vi.mocked(getSubjectToken).mockResolvedValue('fixture-stored-value')
})

describe('CLI tool subcommands', () => {
  const cases: Array<{ name: string; argv: string[]; handler: Mock; expected: unknown }> = [
    {
      name: 'pages',
      argv: ['get', '--page-id', 'page-1'],
      handler: vi.mocked(pages),
      expected: { action: 'get', page_id: 'page-1' }
    },
    {
      name: 'databases',
      argv: ['query', '--database-id', 'db-1', '--limit', '5'],
      handler: vi.mocked(databases),
      expected: { action: 'query', database_id: 'db-1', limit: 5 }
    },
    {
      name: 'blocks',
      argv: ['append', '--block-id', 'block-1', '--content', '# Title'],
      handler: vi.mocked(blocks),
      expected: { action: 'append', block_id: 'block-1', content: '# Title' }
    },
    { name: 'users', argv: ['me'], handler: vi.mocked(users), expected: { action: 'me' } },
    {
      name: 'workspace',
      argv: ['search', '--query', 'roadmap'],
      handler: vi.mocked(workspace),
      expected: { action: 'search', query: 'roadmap' }
    },
    {
      name: 'comments',
      argv: ['list', '--page-id', 'page-1'],
      handler: vi.mocked(commentsManage),
      expected: { action: 'list', page_id: 'page-1' }
    },
    {
      name: 'content_convert',
      argv: ['--direction', 'markdown-to-blocks', '--content', '# Title'],
      handler: vi.mocked(contentConvert),
      expected: { direction: 'markdown-to-blocks', content: '# Title' }
    },
    {
      name: 'config-tool',
      argv: ['status'],
      handler: vi.mocked(config),
      expected: { action: 'status' }
    },
    {
      name: 'file_uploads',
      argv: ['list', '--limit', '10'],
      handler: vi.mocked(fileUploads),
      expected: { action: 'list', limit: 10 }
    }
  ]

  for (const testCase of cases) {
    it(`runs the ${testCase.name} handler and prints its JSON`, async () => {
      const console = spyConsole()
      testCase.handler.mockResolvedValue(STUB_RESULT)

      const code = await runToolCommand(testCase.name, [...testCase.argv, '--json'])

      expect(code).toBe(0)
      expect(testCase.handler).toHaveBeenCalledTimes(1)
      expect(testCase.handler.mock.calls[0].at(-1)).toEqual(testCase.expected)
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(STUB_RESULT))
      console.log.mockRestore()
      console.error.mockRestore()
    })
  }

  it('serves the help tool from the shipped documentation', async () => {
    const console = spyConsole()
    vi.mocked(readFile).mockResolvedValue('# Pages documentation')

    const code = await runToolCommand('help', ['--tool-name', 'pages', '--json'])

    expect(code).toBe(0)
    expect(vi.mocked(readFile).mock.calls[0][0]).toEqual(expect.stringContaining('pages.md'))
    expect(console.log).toHaveBeenCalledWith(JSON.stringify({ tool: 'pages', documentation: '# Pages documentation' }))
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('accepts the kebab-case alias of a snake_case tool name', async () => {
    const console = spyConsole()
    vi.mocked(contentConvert).mockResolvedValue(STUB_RESULT)

    const code = await runToolCommand('content-convert', ['--direction', 'blocks-to-markdown', '--content', '[]'])

    expect(code).toBe(0)
    expect(contentConvert).toHaveBeenCalledTimes(1)
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('renders human text by default', async () => {
    const console = spyConsole()
    vi.mocked(pages).mockResolvedValue({
      action: 'get',
      page_id: 'page-1',
      url: 'https://notion.so/page-1',
      created_time: '2026-01-01T00:00:00.000Z',
      last_edited_time: '2026-01-02T00:00:00.000Z',
      archived: false,
      icon: null,
      cover: null,
      properties: {},
      content: 'first line\nsecond line',
      block_count: 1,
      content_max_chars: 20000,
      content_char_count: 22
    } satisfies PagesResult)

    const code = await runToolCommand('pages', ['get', '--page-id', 'page-1'])

    expect(code).toBe(0)
    const output = vi.mocked(console.log).mock.calls[0][0] as string
    expect(output.split('\n')[0]).toBe('pages get')
    expect(output).toContain('page_id: page-1')
    expect(output).toContain('content:\n  first line\n  second line')
    expect(output).toContain('properties:\n  {}')
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('leaves the plain `config` spelling to the operator command', async () => {
    expect(TOOL_COMMANDS.find((command) => command.name === 'config')?.command).toBe('config-tool')
    expect(TOOL_COMMANDS.map((command) => command.command)).not.toContain('config')
    expect(config).not.toHaveBeenCalled()
  })
})

describe('CLI failure paths', () => {
  it('exits 1 with the tool error message and no stack trace', async () => {
    const console = spyConsole()
    vi.mocked(pages).mockRejectedValue(new NotionMCPError('Page not found', 'NOT_FOUND', 'Check the page ID'))

    const code = await runToolCommand('pages', ['get', '--page-id', 'missing'])

    expect(code).toBe(1)
    expect(console.log).not.toHaveBeenCalled()
    const message = vi.mocked(console.error).mock.calls[0][0] as string
    expect(message).toContain('Page not found')
    expect(message).toContain('Check the page ID')
    expect(message).not.toContain('at ')
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('wraps a non-Notion error as one stderr line', async () => {
    const console = spyConsole()
    vi.mocked(databases).mockRejectedValue(new Error('socket hang up'))

    const code = await runToolCommand('databases', ['query', '--database-id', 'db-1'])

    expect(code).toBe(1)
    expect(console.error).toHaveBeenCalledWith('notion databases: socket hang up')
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('exits 2 on an unknown flag and prints usage', async () => {
    const console = spyConsole()

    const code = await runToolCommand('pages', ['get', '--nope', 'x'])

    expect(code).toBe(2)
    expect(vi.mocked(console.error).mock.calls[0][0]).toContain("unknown flag '--nope'")
    expect(vi.mocked(console.error).mock.calls.some((call) => String(call[0]).startsWith('usage: notion pages'))).toBe(
      true
    )
    expect(pages).not.toHaveBeenCalled()
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('exits 2 when a required flag is missing', async () => {
    const console = spyConsole()

    const code = await runToolCommand('blocks', ['--block-id', 'block-1'])

    expect(code).toBe(2)
    expect(vi.mocked(console.error).mock.calls[0][0]).toContain('missing required --action')
    expect(blocks).not.toHaveBeenCalled()
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('exits 1 with the setup hint when no credential is stored', async () => {
    const console = spyConsole()
    vi.mocked(getSubjectToken).mockResolvedValue(null)

    const code = await runToolCommand('users', ['me'])

    expect(code).toBe(1)
    expect(resolveCredentialState).toHaveBeenCalledTimes(1)
    const message = vi.mocked(console.error).mock.calls[0][0] as string
    expect(message).toContain('Notion integration token not configured')
    expect(message).toContain('notion auth')
    expect(users).not.toHaveBeenCalled()
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('runs a token-free tool without resolving credentials', async () => {
    const console = spyConsole()
    vi.mocked(contentConvert).mockResolvedValue(STUB_RESULT)
    vi.mocked(getSubjectToken).mockResolvedValue(null)

    const code = await runToolCommand('content_convert', [
      '--direction',
      'markdown-to-blocks',
      '--content',
      '# Title',
      '--json'
    ])

    expect(code).toBe(0)
    expect(resolveCredentialState).not.toHaveBeenCalled()
    expect(contentConvert).toHaveBeenCalledTimes(1)
    console.log.mockRestore()
    console.error.mockRestore()
  })
})

describe('flag parsing', () => {
  it('accepts snake_case flag spellings', () => {
    const { args } = parseToolArgs(['get', '--page_id', 'page-1'], findCommand('pages'))
    expect(args).toEqual({ action: 'get', page_id: 'page-1' })
  })

  it("fills a tool's single required property from a leading positional", () => {
    expect(parseToolArgs(['pages'], findCommand('help'))).toEqual({ args: { tool_name: 'pages' }, json: false })
    expect(parseToolArgs(['--tool-name', 'pages'], findCommand('help')).args).toEqual({ tool_name: 'pages' })
    expect(() => parseToolArgs([], findCommand('help'))).toThrow('missing required --tool-name')
  })

  it('splits a comma list and accumulates repeated flags', () => {
    expect(parseToolArgs(['get', '--page-ids', 'a,b'], findCommand('pages')).args).toEqual({
      action: 'get',
      page_ids: ['a', 'b']
    })
    expect(parseToolArgs(['get', '--page-ids', 'a', '--page-ids', 'b'], findCommand('pages')).args).toEqual({
      action: 'get',
      page_ids: ['a', 'b']
    })
  })

  it('parses JSON objects and arrays', () => {
    expect(parseToolArgs(['update', '--properties', '{"Name":"x"}'], findCommand('pages')).args).toEqual({
      action: 'update',
      properties: { Name: 'x' }
    })
    expect(
      parseToolArgs(
        ['query', '--database-id', 'db', '--sorts', '[{"timestamp":"created_time"}]'],
        findCommand('databases')
      ).args
    ).toEqual({ action: 'query', database_id: 'db', sorts: [{ timestamp: 'created_time' }] })
  })

  it('parses booleans and numbers', () => {
    expect(parseToolArgs(['create', '--is-inline', '--title', 'db'], findCommand('databases')).args).toEqual({
      action: 'create',
      is_inline: true,
      title: 'db'
    })
    expect(parseToolArgs(['create', '--is-inline=false', '--title', 'db'], findCommand('databases')).args).toEqual({
      action: 'create',
      is_inline: false,
      title: 'db'
    })
    expect(parseToolArgs(['query', '--database-id', 'db', '--limit', '25'], findCommand('databases')).args).toEqual({
      action: 'query',
      database_id: 'db',
      limit: 25
    })
  })

  it('strips --json from the tool arguments', () => {
    expect(parseToolArgs(['me', '--json'], findCommand('users'))).toEqual({ args: { action: 'me' }, json: true })
  })

  it('rejects a bad number, bad JSON, and unknown positional', () => {
    expect(() => parseToolArgs(['query', '--database-id', 'db', '--limit', 'many'], findCommand('databases'))).toThrow(
      CliUsageError
    )
    expect(() => parseToolArgs(['update', '--properties', '{oops}'], findCommand('pages'))).toThrow(CliUsageError)
    expect(() => parseToolArgs(['nonsense'], findCommand('pages'))).toThrow(CliUsageError)
  })
})

describe('help output', () => {
  it('lists tool commands and operator commands as separate groups', () => {
    const console = spyConsole()

    printCliHelp(['auth', 'relay'])

    const text = vi
      .mocked(console.log)
      .mock.calls.map((call) => String(call[0]))
      .join('\n')
    const toolIndex = text.indexOf('tool commands:')
    const operatorIndex = text.indexOf('operator commands:')
    expect(toolIndex).toBeGreaterThan(-1)
    expect(operatorIndex).toBeGreaterThan(toolIndex)
    expect(text).toContain('pages')
    expect(text).toContain('content_convert (alias: content-convert)')
    expect(text).toContain('auth, config, doctor, logout, relay, status, token')
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('answers --help through runCli without starting the server', async () => {
    const console = spyConsole()
    const serve = vi.fn()

    const code = await runCli(['--help'], { serve, version: '9.9.9' })

    expect(code).toBe(0)
    expect(serve).not.toHaveBeenCalled()
    expect(
      vi
        .mocked(console.log)
        .mock.calls.map((call) => String(call[0]))
        .join('\n')
    ).toContain('tool commands:')
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('prints a single tool usage with --help and exits 0', async () => {
    const console = spyConsole()

    const code = await runToolCommand('pages', ['--help'])

    expect(code).toBe(0)
    const text = vi
      .mocked(console.log)
      .mock.calls.map((call) => String(call[0]))
      .join('\n')
    expect(text).toContain('usage: notion pages <action> [flags]')
    expect(text).toContain('--page-id <text>')
    expect(text).toContain('actions: create, get, get_property, update, move, archive, restore, duplicate')
    expect(pages).not.toHaveBeenCalled()
    console.log.mockRestore()
    console.error.mockRestore()
  })
})

describe('runCli dispatch', () => {
  const wiring = { serve: () => 0, version: '9.9.9' }

  it('routes a tool subcommand through the built CLI', async () => {
    const console = spyConsole()
    vi.mocked(workspace).mockResolvedValue(STUB_RESULT as unknown as WorkspaceResult)

    const code = await runCli(['workspace', 'search', '--query', 'roadmap', '--json'], wiring)

    expect(code).toBe(0)
    expect(workspace).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith(JSON.stringify(STUB_RESULT))
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('rejects an unknown subcommand with exit 2', async () => {
    const console = spyConsole()

    const code = await runCli(['nope'], wiring)

    expect(code).toBe(2)
    expect(vi.mocked(console.error).mock.calls[0][0]).toContain("unknown subcommand 'nope'")
    console.log.mockRestore()
    console.error.mockRestore()
  })

  it('prints the version from the wiring', async () => {
    const console = spyConsole()

    const code = await runCli(['--version'], wiring)

    expect(code).toBe(0)
    expect(console.log).toHaveBeenCalledWith('notion 9.9.9')
    console.log.mockRestore()
    console.error.mockRestore()
  })
})

type RequestHandler = (request: { params: { name: string; arguments?: Record<string, unknown> } }) => Promise<unknown>

/** The MCP `CallTool` handler `registerTools` installs, over a minimal server double. */
function callToolHandler(): RequestHandler {
  const handlers: RequestHandler[] = []
  const server = { setRequestHandler: (_schema: unknown, handler: RequestHandler) => handlers.push(handler) }
  registerTools(server as unknown as Server, async () => ({}) as unknown as Client)
  // Registration order is ListTools, ListResources, ReadResource, CallTool.
  return handlers[3]
}

describe('handler reuse with the MCP server', () => {
  // One row per registered handler-backed tool: the same call through the MCP
  // tool and through its CLI subcommand must reach the same composite handler
  // with byte-identical input.
  const rows: Array<{ tool: string; argv: string[]; args: Record<string, unknown>; handler: Mock }> = [
    {
      tool: 'pages',
      argv: ['get', '--page-id', 'page-1'],
      args: { action: 'get', page_id: 'page-1' },
      handler: vi.mocked(pages)
    },
    {
      tool: 'databases',
      argv: ['query', '--database-id', 'db-1', '--limit', '5'],
      args: { action: 'query', database_id: 'db-1', limit: 5 },
      handler: vi.mocked(databases)
    },
    {
      tool: 'blocks',
      argv: ['append', '--block-id', 'block-1', '--content', '# Title'],
      args: { action: 'append', block_id: 'block-1', content: '# Title' },
      handler: vi.mocked(blocks)
    },
    { tool: 'users', argv: ['me'], args: { action: 'me' }, handler: vi.mocked(users) },
    {
      tool: 'workspace',
      argv: ['search', '--query', 'roadmap'],
      args: { action: 'search', query: 'roadmap' },
      handler: vi.mocked(workspace)
    },
    {
      tool: 'comments',
      argv: ['list', '--page-id', 'page-1'],
      args: { action: 'list', page_id: 'page-1' },
      handler: vi.mocked(commentsManage)
    },
    {
      tool: 'content_convert',
      argv: ['--direction', 'markdown-to-blocks', '--content', '# Title'],
      args: { direction: 'markdown-to-blocks', content: '# Title' },
      handler: vi.mocked(contentConvert)
    },
    {
      tool: 'config',
      argv: ['status'],
      args: { action: 'status' },
      handler: vi.mocked(config)
    },
    {
      tool: 'file_uploads',
      argv: ['list', '--limit', '10'],
      args: { action: 'list', limit: 10 },
      handler: vi.mocked(fileUploads)
    }
  ]

  for (const row of rows) {
    it(`dispatches ${row.tool} to the same handler from the MCP tool and the CLI`, async () => {
      const callTool = callToolHandler()
      row.handler.mockResolvedValue(STUB_RESULT)
      const console = spyConsole()
      const command = TOOL_COMMANDS.find((spec) => spec.name === row.tool)?.command
      expect(command, row.tool).toBeDefined()

      await callTool({ params: { name: row.tool, arguments: row.args } })
      const code = await runToolCommand(command as string, [...row.argv, '--json'])

      expect(code, row.tool).toBe(0)
      expect(row.handler, row.tool).toHaveBeenCalledTimes(2)
      const [mcpCall, cliCall] = row.handler.mock.calls
      // Composites take (client, input) or (input); the input is the last argument.
      expect(cliCall.at(-1), row.tool).toEqual(mcpCall.at(-1))
      expect(cliCall.at(-1), row.tool).toEqual(row.args)
      console.log.mockRestore()
      console.error.mockRestore()
    })
  }

  it('reads the help documentation through the same path from the MCP tool and the CLI', async () => {
    const callTool = callToolHandler()
    vi.mocked(readFile).mockResolvedValue('# Pages documentation')
    const console = spyConsole()

    const mcpResult = (await callTool({ params: { name: 'help', arguments: { tool_name: 'pages' } } })) as {
      content: Array<{ text: string }>
    }
    const code = await runToolCommand('help', ['pages', '--json'])

    expect(code).toBe(0)
    expect(String(mcpResult.content[0].text)).toContain('# Pages documentation')
    const [mcpRead, cliRead] = vi.mocked(readFile).mock.calls
    expect(cliRead[0]).toEqual(mcpRead[0])
    expect(console.log).toHaveBeenCalledWith(JSON.stringify({ tool: 'pages', documentation: '# Pages documentation' }))
    console.log.mockRestore()
    console.error.mockRestore()
  })
})

describe('CLI parity with the tool registry', () => {
  const fixture: Array<{ name: string }> = JSON.parse(
    readFileSync(new URL('../tests/fixtures/tools_expected.json', import.meta.url), 'utf8')
  )

  it('derives exactly one command per registered tool', () => {
    expect(TOOL_COMMANDS.map((spec) => spec.name)).toEqual(TOOLS.map((tool) => tool.name))
    const commands = TOOL_COMMANDS.map((spec) => spec.command)
    expect(new Set(commands).size).toBe(commands.length)
  })

  it('covers every tool in the published tool-surface fixture', () => {
    const covered = new Set(TOOL_COMMANDS.map((spec) => spec.name))
    expect(fixture.filter((tool) => !covered.has(tool.name)).map((tool) => tool.name)).toEqual([])
    expect(fixture).toHaveLength(TOOLS.length)
  })

  it('keeps every tool spelling clear of the operator commands', () => {
    const operator = new Set([...BUILTIN_OPERATOR_COMMANDS, ...SERVER_OPERATOR_COMMANDS])
    const spellings = TOOL_COMMANDS.flatMap((spec) => [spec.command, ...spec.aliases])
    expect(spellings.filter((spelling) => operator.has(spelling))).toEqual([])
    // The one name that would collide is recorded, not silently dropped.
    expect(TOOL_COMMAND_NAMES).toEqual({ config: 'config-tool' })
  })

  it('dispatches every tool command through the built CLI', async () => {
    for (const spec of TOOL_COMMANDS) {
      const console = spyConsole()
      const code = await runCli([spec.command, '--help'], { serve: () => 0, version: '9.9.9' })
      expect(code, spec.command).toBe(0)
      expect(
        vi
          .mocked(console.log)
          .mock.calls.map((call) => String(call[0]))
          .join('\n'),
        spec.command
      ).toContain(`usage: notion ${spec.command}`)
      console.log.mockRestore()
      console.error.mockRestore()
    }
  })
})

describe('formatToolResult', () => {
  it('emits compact JSON with --json and a readable block otherwise', () => {
    expect(formatToolResult('pages', { action: 'get', id: 'x' }, true)).toBe('{"action":"get","id":"x"}')
    expect(formatToolResult('pages', { action: 'get', id: 'x' }, false)).toBe('pages get\nid: x')
  })
})
