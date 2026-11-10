/**
 * CLI tool surface: one subcommand per MCP tool, over the same handlers.
 *
 * A tool subcommand parses flags from the tool's own `inputSchema`
 * (`src/tools/definitions.ts`), then calls `invokeTool` -- the function the MCP
 * `CallTool` handler calls -- so `notion pages get --page-id X` and the
 * `pages` tool cannot diverge. Operator commands (`config`, `doctor`, `auth`,
 * ...) stay exactly as `buildCli` layers them.
 *
 * Every tool in `TOOLS` gets a subcommand -- the list is derived, never
 * hand-written, so a tool added to the registry cannot end up MCP-only. The
 * `config` tool is the single name that collides with a hull operator command
 * (`notion config status|delete` manages the credential file), so it is spelled
 * `config-tool`; the collision itself is what `TOOL_COMMAND_NAMES` records and
 * a test pins it.
 *
 * Output convention: human text on stdout by default, JSON on stdout with
 * `--json`. Failures go to stderr with exit code 1 (tool error) or 2 (usage).
 */

import { buildCli, type CliHandler, type ServeFn } from '@n24q02m/hull'
import { resolveCredentialState, STORE_PLUGIN } from './credential-state.js'
import { isJsonObject } from './json-value.js'
import { notionClientForCaller } from './notion-client.js'
import { TOKEN_FREE_TOOLS, TOOLS } from './tools/definitions.js'
import { aiReadableMessage, NotionMCPError } from './tools/helpers/errors.js'
import { invokeTool } from './tools/invoke.js'

const SERVER_NAME = 'notion'

/** Operator commands `buildCli` provides plus the two this server supplies. */
export const BUILTIN_OPERATOR_COMMANDS = ['config', 'doctor', 'logout', 'status', 'token']

/** The operator commands `src/main.ts` adds on top of hull's built-ins. */
export const SERVER_OPERATOR_COMMANDS = ['auth', 'relay']

/**
 * Tool name -> CLI subcommand, for the names a tool cannot spell as itself.
 * `config` is the only collision: hull's operator `config` (credential file)
 * owns the plain word, so the MCP tool is reachable as `config-tool`.
 */
export const TOOL_COMMAND_NAMES: Readonly<Record<string, string>> = { config: 'config-tool' }

interface ToolSchema {
  type?: string
  description?: string
  enum?: string[]
  items?: ToolSchema
  properties?: Record<string, ToolSchema>
  required?: string[]
}

export interface ToolCommandSpec {
  /** MCP tool name, as registered in `TOOLS`. */
  name: string
  /** Primary CLI subcommand; the tool name unless `TOOL_COMMAND_NAMES` overrides it. */
  command: string
  /** Extra subcommand spellings (kebab-case for snake_case tool names). */
  aliases: string[]
  summary: string
  properties: Record<string, ToolSchema>
  required: string[]
  /** Valid values of the `action` property, accepted as a leading positional. */
  actions: string[]
}

/** A usage error: printed to stderr with the tool's usage, exit code 2. */
export class CliUsageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CliUsageError'
  }
}

/** Control flow for `--help`: print the usage, exit 0. */
class HelpRequested extends Error {}

type RawTool = (typeof TOOLS)[number]

function toCommandSpec(tool: RawTool): ToolCommandSpec {
  // The literal array has a per-tool property shape; the CLI only needs the
  // common JSON Schema fragment, which every entry satisfies.
  const schema = tool.inputSchema as unknown as ToolSchema
  const properties = schema.properties ?? {}
  const firstLine = tool.description.split('\n')[0].trim()
  return {
    name: tool.name,
    command: TOOL_COMMAND_NAMES[tool.name] ?? tool.name,
    aliases: tool.name.includes('_') ? [tool.name.replace(/_/g, '-')] : [],
    summary: firstLine.length > 72 ? `${firstLine.slice(0, 69)}...` : firstLine,
    properties,
    required: schema.required ?? [],
    actions: properties.action?.enum ?? []
  }
}

/**
 * Tool subcommands: one per registered MCP tool, derived from `TOOLS` so the
 * registry is the only place a tool is declared.
 */
export const TOOL_COMMANDS: ToolCommandSpec[] = TOOLS.map(toCommandSpec)

const COMMANDS = new Map<string, ToolCommandSpec>()
for (const spec of TOOL_COMMANDS) {
  COMMANDS.set(spec.command, spec)
  for (const alias of spec.aliases) COMMANDS.set(alias, spec)
}

function flagFor(property: string): string {
  return `--${property.replace(/_/g, '-')}`
}

function parseJson(flag: string, raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    throw new CliUsageError(`flag '${flag}' expects JSON`)
  }
}

function coerceValue(flag: string, raw: string, schema: ToolSchema): unknown {
  if (schema.type === 'number') {
    const value = Number(raw)
    if (raw.trim() === '' || !Number.isFinite(value)) {
      throw new CliUsageError(`flag '${flag}' expects a number`)
    }
    return value
  }
  if (schema.type === 'array') {
    if (schema.items?.type === 'string') {
      return raw
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    }
    const parsed = parseJson(flag, raw)
    if (!Array.isArray(parsed)) throw new CliUsageError(`flag '${flag}' expects a JSON array`)
    return parsed
  }
  if (schema.type === 'object') {
    const parsed = parseJson(flag, raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new CliUsageError(`flag '${flag}' expects a JSON object`)
    }
    return parsed
  }
  return raw
}

export interface ParsedToolArgs {
  args: Record<string, unknown>
  json: boolean
}

/**
 * The property a bare leading argument fills: the only required one when the
 * tool has no `action` (the `help` tool's `tool_name`). Tools with actions take
 * the action positionally instead.
 */
function positionalProperty(spec: ToolCommandSpec): string | undefined {
  if (spec.properties.action !== undefined) return undefined
  return spec.required.length === 1 ? spec.required[0] : undefined
}

/**
 * Parse a tool subcommand's argv into the tool's own argument object.
 *
 * Flags are the schema's property names in kebab-case (the snake_case spelling
 * is accepted too). A leading positional is accepted when it is one of the
 * tool's `action` values -- or, for a tool without actions, when it is the
 * tool's single required property -- so `notion pages get --page-id X`,
 * `notion pages --action get --page-id X` and `notion help pages` are the same
 * calls as their flag forms.
 */
export function parseToolArgs(argv: string[], spec: ToolCommandSpec): ParsedToolArgs {
  const args: Record<string, unknown> = {}
  const flagToProperty = new Map<string, string>()
  for (const property of Object.keys(spec.properties)) {
    flagToProperty.set(flagFor(property), property)
    flagToProperty.set(`--${property}`, property)
  }

  const positional = positionalProperty(spec)
  let index = 0
  const first = argv[0]
  if (first !== undefined && !first.startsWith('-')) {
    if (spec.actions.includes(first)) {
      args.action = first
      index = 1
    } else if (positional !== undefined) {
      args[positional] = coerceValue(`<${positional}>`, first, spec.properties[positional] ?? {})
      index = 1
    }
  }

  let json = false
  for (; index < argv.length; index++) {
    const token = argv[index]
    if (token === '--json') {
      json = true
      continue
    }
    if (token === '-h' || token === '--help') throw new HelpRequested()
    if (!token.startsWith('--')) {
      throw new CliUsageError(`unexpected argument '${token}'`)
    }

    const equals = token.indexOf('=')
    const flag = equals === -1 ? token : token.slice(0, equals)
    const inline = equals === -1 ? undefined : token.slice(equals + 1)
    const property = flagToProperty.get(flag)
    if (property === undefined) {
      throw new CliUsageError(`unknown flag '${flag}' (see --help for the accepted flags)`)
    }

    const schema = spec.properties[property]
    if (schema.type === 'boolean') {
      args[property] = inline === undefined ? true : inline !== 'false'
      continue
    }

    let raw = inline
    if (raw === undefined) {
      index++
      raw = argv[index]
      if (raw === undefined) throw new CliUsageError(`flag '${flag}' needs a value`)
    }

    const value = coerceValue(flag, raw, schema)
    const existing = args[property]
    args[property] = Array.isArray(existing) && Array.isArray(value) ? [...existing, ...value] : value
  }

  for (const property of spec.required) {
    if (args[property] === undefined) {
      throw new CliUsageError(`missing required ${flagFor(property)}`)
    }
  }

  return { args, json }
}

function indent(text: string, width: number): string {
  const pad = ' '.repeat(width)
  return text
    .split('\n')
    .map((line) => (line.length === 0 ? '' : `${pad}${line}`))
    .join('\n')
}

/** Human-readable rendering of a tool result: a header plus one block per field. */
export function formatHuman(name: string, result: unknown): string {
  if (!isJsonObject(result)) {
    return `${name}:\n${indent(JSON.stringify(result, null, 2) ?? String(result), 2)}`
  }
  const action = typeof result.action === 'string' ? ` ${result.action}` : ''
  const lines = [`${name}${action}`]
  for (const [key, value] of Object.entries(result)) {
    if (key === 'action') continue
    if (typeof value === 'string' && value.includes('\n')) {
      lines.push(`${key}:`, indent(value, 2))
    } else if (isJsonObject(value) || Array.isArray(value)) {
      lines.push(`${key}:`, indent(JSON.stringify(value, null, 2), 2))
    } else {
      lines.push(`${key}: ${value === null ? 'null' : String(value)}`)
    }
  }
  return lines.join('\n')
}

/** Machine output is compact JSON; human output is the readable form above. */
export function formatToolResult(name: string, result: unknown, json: boolean): string {
  return json ? JSON.stringify(result) : formatHuman(name, result)
}

function flagValueLabel(schema: ToolSchema): string {
  if (schema.type === 'boolean') return ''
  if (schema.type === 'number') return ' <number>'
  if (schema.type === 'array') return schema.items?.type === 'string' ? ' <a,b>' : ' <json array>'
  if (schema.type === 'object') return ' <json>'
  return ' <text>'
}

export function printToolUsage(spec: ToolCommandSpec, write: (line: string) => void = console.log): void {
  const usage = spec.actions.length > 0 ? `${spec.command} <action>` : spec.command
  write(`usage: ${SERVER_NAME} ${usage} [flags]`)
  write('')
  write(spec.summary)
  if (spec.command !== spec.name) write(`MCP tool: ${spec.name} (the plain name is an operator command)`)
  if (spec.aliases.length > 0) write(`alias: ${spec.aliases.join(', ')}`)
  if (spec.actions.length > 0) {
    write('')
    write(`actions: ${spec.actions.join(', ')}`)
    write('(the action is also accepted as the first positional argument)')
  }
  write('')
  write('flags:')
  const rows = Object.keys(spec.properties).map((property) => {
    const schema = spec.properties[property]
    const required = spec.required.includes(property) ? ' (required)' : ''
    const detail = schema.description ? ` ${schema.description}` : ''
    return [`${flagFor(property)}${flagValueLabel(schema)}`, `${detail.trim()}${required}`.trim()]
  })
  rows.push(['--json', 'Print JSON on stdout instead of human text'])
  const width = Math.min(
    30,
    rows.reduce((max, [flag]) => Math.max(max, flag.length), 0)
  )
  for (const [flag, detail] of rows) {
    write(`  ${flag.padEnd(width)}  ${detail}`.trimEnd())
  }
}

export interface CliWiring {
  /** Starts the MCP server (bare invocation and transport flags). */
  serve: ServeFn
  version: string
  /** Server-specific operator commands (`auth`, `relay`). */
  operator?: Record<string, CliHandler>
}

export function printCliHelp(operatorCommands: string[] = []): void {
  console.log(`usage: ${SERVER_NAME} [-h] [--version] [<command> [args]]`)
  console.log('')
  console.log('With no command (or with server flags such as --http) the MCP server starts.')
  console.log('Tool commands run the same handlers without a server; --json prints JSON on stdout.')
  console.log('')
  console.log('tool commands:')
  const labels = TOOL_COMMANDS.map((spec) => {
    const collar = spec.command === spec.name ? '' : ` (MCP tool \`${spec.name}\`)`
    const alias = spec.aliases.length > 0 ? ` (alias: ${spec.aliases.join(', ')})` : ''
    return `${spec.command}${alias}${collar}`
  })
  const width = labels.reduce((max, label) => Math.max(max, label.length), 0)
  for (const [index, spec] of TOOL_COMMANDS.entries()) {
    console.log(`  ${labels[index].padEnd(width)}  ${spec.summary}`)
  }
  console.log('')
  console.log('operator commands:')
  const operators = [...BUILTIN_OPERATOR_COMMANDS, ...SERVER_OPERATOR_COMMANDS, ...operatorCommands]
  console.log(`  ${[...new Set(operators)].sort().join(', ')}`)
  console.log('')
  console.log(`\`${SERVER_NAME} config status\` and \`${SERVER_NAME} config delete --yes\` are the operator`)
  console.log(`credential-file commands; \`${SERVER_NAME} config-tool <action>\` runs the config MCP tool.`)
  console.log(`\`${SERVER_NAME} <tool> --help\` lists a tool's flags.`)
}

/**
 * Parse flags for one tool and run it through the shared invoker.
 *
 * @param name - CLI subcommand or alias (`config-tool` for the config tool)
 * @param argv - arguments after the subcommand name
 */
export async function runToolCommand(name: string, argv: string[]): Promise<number> {
  const spec = COMMANDS.get(name)
  if (spec === undefined) {
    console.error(`${SERVER_NAME}: unknown tool command '${name}'`)
    return 2
  }

  let parsed: ParsedToolArgs
  try {
    parsed = parseToolArgs(argv, spec)
  } catch (error) {
    if (error instanceof HelpRequested) {
      printToolUsage(spec)
      return 0
    }
    if (error instanceof CliUsageError) {
      console.error(`${SERVER_NAME} ${spec.command}: ${error.message}`)
      printToolUsage(spec, (line) => console.error(line))
      return 2
    }
    throw error
  }

  try {
    // Same credential path as the server: env or stored token for the current
    // namespace, resolved once before the per-call factory reads it.
    if (!TOKEN_FREE_TOOLS.has(spec.name)) await resolveCredentialState()
    const result = await invokeTool(spec.name, parsed.args, notionClientForCaller)
    console.log(formatToolResult(spec.name, result, parsed.json))
    return 0
  } catch (error) {
    if (error instanceof NotionMCPError) {
      console.error(aiReadableMessage(error))
      return 1
    }
    console.error(`${SERVER_NAME} ${spec.command}: ${error instanceof Error ? error.message : String(error)}`)
    return 1
  }
}

function toolHandlers(): Record<string, CliHandler> {
  const handlers: Record<string, CliHandler> = {}
  for (const spec of TOOL_COMMANDS) {
    const handler: CliHandler = (argv) => runToolCommand(spec.command, argv)
    handlers[spec.command] = handler
    for (const alias of spec.aliases) handlers[alias] = handler
  }
  return handlers
}

/**
 * Entry point for the `notion` binary.
 *
 * `--help` is answered here rather than by `buildCli` so the tool commands and
 * the operator commands are listed as separate groups.
 */
export function runCli(argv: string[], wiring: CliWiring): Promise<number> {
  if (argv.length > 0 && (argv[0] === '-h' || argv[0] === '--help')) {
    printCliHelp(Object.keys(wiring.operator ?? {}))
    return Promise.resolve(0)
  }
  const cli = buildCli(SERVER_NAME, {
    serve: wiring.serve,
    version: wiring.version,
    pluginName: STORE_PLUGIN,
    extra: { ...toolHandlers(), ...wiring.operator }
  })
  return cli(argv)
}
