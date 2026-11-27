import { pathToFileURL } from 'node:url'
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client'
import { z } from 'zod'

const SEARCH_QUERY = 'provider-acceptance'
const SEARCH_LIMIT = 3

export interface AcceptanceClient {
  callTool(request: { name: string; arguments?: Record<string, unknown> }): Promise<unknown>
}

interface ToolCall {
  name: string
  arguments: Record<string, unknown>
}

interface OperationSummary {
  operation: string
  contentBlocks: number
  resultCount?: number
}

export interface ReadOnlyAcceptanceSummary {
  status: 'VERIFIED'
  operations: OperationSummary[]
}

const READ_ONLY_CALLS: ReadonlyArray<{ operation: string; request: ToolCall }> = [
  {
    operation: 'workspace.info',
    request: { name: 'workspace', arguments: { action: 'info' } }
  },
  {
    operation: 'users.me',
    request: { name: 'users', arguments: { action: 'me' } }
  },
  {
    operation: 'workspace.search',
    request: {
      name: 'workspace',
      arguments: { action: 'search', query: SEARCH_QUERY, limit: SEARCH_LIMIT }
    }
  }
]

class AcceptanceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AcceptanceError'
  }
}

const TextContentSchema = z
  .object({
    type: z.literal('text'),
    text: z.string()
  })
  .passthrough()
const ImageContentSchema = z
  .object({
    type: z.literal('image'),
    data: z.string(),
    mimeType: z.string()
  })
  .passthrough()
const AudioContentSchema = z
  .object({
    type: z.literal('audio'),
    data: z.string(),
    mimeType: z.string()
  })
  .passthrough()
const ResourceContentSchema = z
  .object({
    type: z.literal('resource'),
    resource: z.union([
      z.object({ uri: z.string(), text: z.string() }).passthrough(),
      z.object({ uri: z.string(), blob: z.string() }).passthrough()
    ])
  })
  .passthrough()
const ResourceLinkSchema = z
  .object({
    type: z.literal('resource_link'),
    uri: z.string(),
    name: z.string()
  })
  .passthrough()
const ContentBlockSchema = z.discriminatedUnion('type', [
  TextContentSchema,
  ImageContentSchema,
  AudioContentSchema,
  ResourceContentSchema,
  ResourceLinkSchema
])

const CallToolResultSchema = z
  .object({
    isError: z.boolean().optional(),
    content: z.array(ContentBlockSchema).min(1)
  })
  .passthrough()
const SearchPayloadSchema = z
  .object({
    action: z.literal('search').optional(),
    query: z.string().optional(),
    total: z.number().int().nonnegative(),
    results: z.array(z.record(z.string(), z.unknown()))
  })
  .strict()

const ReadOnlyToolCallSchema = z.union([
  z
    .object({
      name: z.literal('workspace'),
      arguments: z.object({ action: z.literal('info') }).strict()
    })
    .strict(),
  z
    .object({
      name: z.literal('users'),
      arguments: z.object({ action: z.literal('me') }).strict()
    })
    .strict(),
  z
    .object({
      name: z.literal('workspace'),
      arguments: z
        .object({
          action: z.literal('search'),
          query: z.literal(SEARCH_QUERY),
          limit: z.literal(SEARCH_LIMIT)
        })
        .strict()
    })
    .strict()
])

export function assertReadOnlyToolCall(request: unknown): asserts request is ToolCall {
  if (!ReadOnlyToolCallSchema.safeParse(request).success) {
    throw new AcceptanceError('Request is not an allowed read-only acceptance call')
  }
}

function readContent(result: unknown, operation: string): z.infer<typeof ContentBlockSchema>[] {
  const parsed = CallToolResultSchema.safeParse(result)
  if (!parsed.success) {
    throw new AcceptanceError(`${operation} returned a malformed MCP result`)
  }
  if (parsed.data.isError === true) {
    throw new AcceptanceError(`${operation} returned an MCP error`)
  }
  return parsed.data.content
}

function searchResultCount(content: z.infer<typeof ContentBlockSchema>[]): number {
  if (content.length !== 1) {
    throw new AcceptanceError('workspace.search returned a malformed result')
  }

  const parsedBlock = TextContentSchema.safeParse(content[0])
  if (!parsedBlock.success) {
    throw new AcceptanceError('workspace.search returned a malformed result')
  }

  let payload: unknown
  try {
    payload = JSON.parse(parsedBlock.data.text)
  } catch {
    throw new AcceptanceError('workspace.search returned malformed JSON')
  }

  const parsedPayload = SearchPayloadSchema.safeParse(payload)
  if (!parsedPayload.success) {
    throw new AcceptanceError('workspace.search returned a malformed result')
  }

  const { total, results } = parsedPayload.data
  if (total > SEARCH_LIMIT || results.length > SEARCH_LIMIT) {
    throw new AcceptanceError('workspace.search exceeded the result bound')
  }
  if (total !== results.length) {
    throw new AcceptanceError('workspace.search returned inconsistent result metadata')
  }
  return total
}

export async function runReadOnlyAcceptance(client: AcceptanceClient): Promise<ReadOnlyAcceptanceSummary> {
  const operations: OperationSummary[] = []

  for (const { operation, request } of READ_ONLY_CALLS) {
    assertReadOnlyToolCall(request)
    let result: unknown
    try {
      result = await client.callTool(request)
    } catch {
      throw new AcceptanceError(`${operation} call failed`)
    }
    const content = readContent(result, operation)
    operations.push({
      operation,
      contentBlocks: content.length,
      ...(operation === 'workspace.search' ? { resultCount: searchResultCount(content) } : {})
    })
  }

  return { status: 'VERIFIED', operations }
}

export async function runHttpReadOnlyAcceptance(
  endpoint: URL,
  bearerToken: string
): Promise<ReadOnlyAcceptanceSummary> {
  if (!['http:', 'https:'].includes(endpoint.protocol)) {
    throw new AcceptanceError('Notion MCP endpoint must use HTTP or HTTPS')
  }
  if (typeof bearerToken !== 'string' || bearerToken.trim().length === 0) {
    throw new AcceptanceError('Notion MCP bearer token is required')
  }

  let transport: StreamableHTTPClientTransport | undefined
  let summary: ReadOnlyAcceptanceSummary | undefined
  let failure: AcceptanceError | undefined

  try {
    transport = new StreamableHTTPClientTransport(endpoint, {
      requestInit: { headers: { authorization: `Bearer ${bearerToken}` } }
    })
    const client = new Client({ name: 'notion-readonly-provider-acceptance', version: '1.0.0' })
    await client.connect(transport)
    summary = await runReadOnlyAcceptance(client)
  } catch (error) {
    failure = error instanceof AcceptanceError ? error : new AcceptanceError('Read-only acceptance transport failed')
  }

  if (transport) {
    try {
      await transport.close()
    } catch {
      failure ??= new AcceptanceError('Read-only acceptance transport close failed')
    }
  }

  if (failure) throw failure
  if (!summary) throw new AcceptanceError('Read-only acceptance transport failed')
  return summary
}

async function main(): Promise<void> {
  const endpoint = process.env.NOTION_MCP_URL
  const bearerToken = process.env.NOTION_MCP_BEARER_TOKEN
  if (!endpoint || !bearerToken) {
    console.error(JSON.stringify({ status: 'FAILED', code: 'READ_ONLY_INPUT_MISSING' }))
    process.exitCode = 1
    return
  }

  try {
    console.log(JSON.stringify(await runHttpReadOnlyAcceptance(new URL(endpoint), bearerToken)))
  } catch {
    console.error(JSON.stringify({ status: 'FAILED', code: 'READ_ONLY_ACCEPTANCE_FAILED' }))
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
