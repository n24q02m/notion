import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type AcceptanceClient,
  assertReadOnlyToolCall,
  runHttpReadOnlyAcceptance,
  runReadOnlyAcceptance
} from '../scripts/provider-readonly-acceptance.js'

const sdkMocks = vi.hoisted(() => ({
  connect: vi.fn(),
  callTool: vi.fn(),
  close: vi.fn(),
  transportArgs: vi.fn()
}))

vi.mock('@modelcontextprotocol/sdk/client/index.js', () => ({
  Client: class {
    async connect(...args: unknown[]) {
      return sdkMocks.connect(...args)
    }

    async callTool(...args: unknown[]) {
      return sdkMocks.callTool(...args)
    }
  }
}))

vi.mock('@modelcontextprotocol/sdk/client/streamableHttp.js', () => ({
  StreamableHTTPClientTransport: class {
    constructor(...args: unknown[]) {
      sdkMocks.transportArgs(...args)
    }

    async close() {
      return sdkMocks.close()
    }
  }
}))

const secretToken = 'secret-bearer-token'
const sensitiveId = 'private-page-id'

function textResult(value: unknown) {
  return {
    content: [{ type: 'text', text: JSON.stringify(value) }]
  }
}

function searchItem(id: string, title: string) {
  return {
    id,
    object: 'page',
    title,
    url: `https://notion.example/${id}`,
    last_edited_time: '2026-08-30T00:00:00.000Z'
  }
}

class FakeClient implements AcceptanceClient {
  readonly calls: Array<{ name: string; arguments?: Record<string, unknown> }> = []

  async callTool(request: { name: string; arguments?: Record<string, unknown> }) {
    this.calls.push(request)

    if (request.name === 'workspace' && request.arguments?.action === 'search') {
      return textResult({
        action: 'search',
        query: 'provider-acceptance',
        total: 2,
        results: [searchItem(sensitiveId, 'Private result'), searchItem('another-private-id', 'Another result')]
      })
    }

    return textResult({ id: sensitiveId, token: secretToken })
  }
}

describe('read-only Notion provider acceptance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls only the bounded read-only operations and emits metadata only', async () => {
    const client = new FakeClient()

    const summary = await runReadOnlyAcceptance(client)

    expect(client.calls).toEqual([
      { name: 'workspace', arguments: { action: 'info' } },
      { name: 'users', arguments: { action: 'me' } },
      {
        name: 'workspace',
        arguments: { action: 'search', query: 'provider-acceptance', limit: 3 }
      }
    ])
    expect(summary).toEqual({
      status: 'VERIFIED',
      operations: [
        { operation: 'workspace.info', contentBlocks: 1 },
        { operation: 'users.me', contentBlocks: 1 },
        { operation: 'workspace.search', contentBlocks: 1, resultCount: 2 }
      ]
    })

    const serialized = JSON.stringify(summary)
    expect(serialized).not.toContain(secretToken)
    expect(serialized).not.toContain(sensitiveId)
    expect(serialized).not.toContain('Private result')
  })

  it('rejects mutating or widened calls before transport dispatch', async () => {
    const dispatched: unknown[] = []
    const guardedDispatch = async (request: unknown) => {
      assertReadOnlyToolCall(request)
      dispatched.push(request)
    }

    await expect(guardedDispatch({ name: 'pages', arguments: { action: 'create' } })).rejects.toThrow(
      /not an allowed read-only acceptance call/
    )
    await expect(
      guardedDispatch({
        name: 'workspace',
        arguments: { action: 'search', query: 'provider-acceptance', limit: 4 }
      })
    ).rejects.toThrow(/not an allowed read-only acceptance call/)
    expect(dispatched).toEqual([])

    expect(() =>
      assertReadOnlyToolCall({
        name: 'workspace',
        arguments: { action: 'search', limit: 3, query: 'provider-acceptance' }
      })
    ).not.toThrow()
  })

  it('fails closed on provider errors, malformed results, and unbounded search results', async () => {
    const providerError: AcceptanceClient = {
      async callTool() {
        return { isError: true, content: [{ type: 'text', text: secretToken }] }
      }
    }
    await expect(runReadOnlyAcceptance(providerError)).rejects.toThrow('workspace.info returned an MCP error')
    try {
      await runReadOnlyAcceptance(providerError)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).not.toContain(secretToken)
    }

    const malformed: AcceptanceClient = {
      async callTool(request) {
        if (request.name === 'workspace' && request.arguments?.action === 'search') {
          return { content: [{ type: 'text', text: '{not-json' }] }
        }
        return textResult({})
      }
    }
    await expect(runReadOnlyAcceptance(malformed)).rejects.toThrow('workspace.search returned malformed JSON')

    const tooManyResults: AcceptanceClient = {
      async callTool(request) {
        if (request.name === 'workspace' && request.arguments?.action === 'search') {
          return textResult({
            action: 'search',
            query: 'provider-acceptance',
            total: 4,
            results: [
              searchItem('one', 'One'),
              searchItem('two', 'Two'),
              searchItem('three', 'Three'),
              searchItem('four', 'Four')
            ]
          })
        }
        return textResult({})
      }
    }
    await expect(runReadOnlyAcceptance(tooManyResults)).rejects.toThrow('workspace.search exceeded the result bound')
  })

  it('closes the SDK transport and redacts connection failures', async () => {
    sdkMocks.connect.mockRejectedValueOnce(new Error(`provider leaked ${secretToken}`))

    let failure: unknown
    try {
      await runHttpReadOnlyAcceptance(new URL('https://notion.example/mcp'), secretToken)
    } catch (error) {
      failure = error
    }

    expect(failure).toBeInstanceOf(Error)
    expect((failure as Error).message).toBe('Read-only acceptance transport failed')
    expect((failure as Error).message).not.toContain(secretToken)
    expect(sdkMocks.transportArgs).toHaveBeenCalledWith(expect.any(URL), {
      requestInit: { headers: { authorization: `Bearer ${secretToken}` } }
    })
    expect(sdkMocks.close).toHaveBeenCalledTimes(1)
  })

  it('preserves the primary sanitized failure when transport close also fails', async () => {
    sdkMocks.connect.mockRejectedValueOnce(new Error(`provider leaked ${secretToken}`))
    sdkMocks.close.mockRejectedValueOnce(new Error(`close leaked ${secretToken}`))

    await expect(runHttpReadOnlyAcceptance(new URL('https://notion.example/mcp'), secretToken)).rejects.toThrow(
      'Read-only acceptance transport failed'
    )
  })

  it('reports a sanitized close failure after successful read-only calls', async () => {
    sdkMocks.callTool
      .mockResolvedValueOnce(textResult({}))
      .mockResolvedValueOnce(textResult({}))
      .mockResolvedValueOnce(
        textResult({
          action: 'search',
          query: 'provider-acceptance',
          total: 0,
          results: []
        })
      )
    sdkMocks.close.mockRejectedValueOnce(new Error(`close leaked ${secretToken}`))

    await expect(runHttpReadOnlyAcceptance(new URL('https://notion.example/mcp'), secretToken)).rejects.toThrow(
      'Read-only acceptance transport close failed'
    )
  })
})

function searchClient(searchResult: unknown): AcceptanceClient {
  return {
    async callTool(request) {
      if (request.name === 'workspace' && request.arguments?.action === 'search') return searchResult
      return textResult({})
    }
  }
}

function okSearch(total: number, results: unknown[]) {
  return textResult({ action: 'search', query: 'provider-acceptance', total, results })
}

describe('read-only Notion provider acceptance: fail-closed result checks', () => {
  it.each([
    ['a result with no content blocks', { content: [] }, 'workspace.info returned a malformed MCP result'],
    ['a non-object result', 'oops', 'workspace.info returned a malformed MCP result']
  ])('rejects %s', async (_label, result, message) => {
    await expect(runReadOnlyAcceptance({ callTool: async () => result })).rejects.toThrow(message)
  })

  it('redacts a thrown tool call', async () => {
    const client: AcceptanceClient = {
      async callTool() {
        throw new Error(`leaked ${secretToken}`)
      }
    }
    await expect(runReadOnlyAcceptance(client)).rejects.toThrow(/^workspace\.info call failed$/)
  })

  it.each([
    [
      'two content blocks',
      {
        content: [
          { type: 'text', text: '{}' },
          { type: 'text', text: '{}' }
        ]
      },
      'workspace.search returned a malformed result'
    ],
    [
      'a non-text block',
      { content: [{ type: 'image', data: 'AA==', mimeType: 'image/png' }] },
      'workspace.search returned a malformed result'
    ],
    ['a payload without total', textResult({ results: [] }), 'workspace.search returned a malformed result'],
    [
      'a payload with extra keys',
      textResult({ total: 0, results: [], cursor: 'x' }),
      'workspace.search returned a malformed result'
    ],
    [
      'a total that disagrees with the results',
      okSearch(2, [searchItem('one', 'One')]),
      'workspace.search returned inconsistent result metadata'
    ]
  ])('rejects a search result with %s', async (_label, result, message) => {
    await expect(runReadOnlyAcceptance(searchClient(result))).rejects.toThrow(message)
  })
})

describe('read-only Notion provider acceptance over HTTP', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('refuses a non-HTTP endpoint before opening a transport', async () => {
    await expect(runHttpReadOnlyAcceptance(new URL('ftp://notion.example/mcp'), secretToken)).rejects.toThrow(
      'Notion MCP endpoint must use HTTP or HTTPS'
    )
    expect(sdkMocks.transportArgs).not.toHaveBeenCalled()
  })

  it.each([[''], ['   ']])('refuses an empty bearer token (%j)', async (token) => {
    await expect(runHttpReadOnlyAcceptance(new URL('https://notion.example/mcp'), token)).rejects.toThrow(
      'Notion MCP bearer token is required'
    )
    expect(sdkMocks.transportArgs).not.toHaveBeenCalled()
  })

  it('returns the summary and closes the transport after the read-only calls', async () => {
    sdkMocks.callTool
      .mockResolvedValueOnce(textResult({}))
      .mockResolvedValueOnce(textResult({}))
      .mockResolvedValueOnce(okSearch(1, [searchItem(sensitiveId, 'Private result')]))

    const summary = await runHttpReadOnlyAcceptance(new URL('http://127.0.0.1:8080/mcp'), secretToken)

    expect(summary.status).toBe('VERIFIED')
    expect(summary.operations.at(-1)).toEqual({ operation: 'workspace.search', contentBlocks: 1, resultCount: 1 })
    expect(sdkMocks.close).toHaveBeenCalledOnce()
  })

  it('passes a sanitized acceptance failure through unchanged', async () => {
    sdkMocks.callTool.mockResolvedValueOnce({ isError: true, content: [{ type: 'text', text: secretToken }] })

    await expect(runHttpReadOnlyAcceptance(new URL('https://notion.example/mcp'), secretToken)).rejects.toThrow(
      'workspace.info returned an MCP error'
    )
    expect(sdkMocks.close).toHaveBeenCalledOnce()
  })
})

describe('provider-readonly-acceptance run as a script', () => {
  const scriptPath = join(import.meta.dirname, '..', 'scripts', 'provider-readonly-acceptance.ts')
  const originalArgv = process.argv
  const originalEnv = process.env
  let logSpy: ReturnType<typeof vi.spyOn>
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    process.argv = [process.argv[0], scriptPath]
    process.env = { ...originalEnv }
    delete process.env.NOTION_MCP_URL
    delete process.env.NOTION_MCP_BEARER_TOKEN
    process.exitCode = undefined
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    process.argv = originalArgv
    process.env = originalEnv
    process.exitCode = undefined
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })

  async function runScript() {
    vi.resetModules()
    await import('../scripts/provider-readonly-acceptance.js')
  }

  it('fails with READ_ONLY_INPUT_MISSING when the endpoint or token is unset', async () => {
    process.env.NOTION_MCP_URL = 'https://notion.example/mcp'

    await runScript()

    expect(errorSpy).toHaveBeenCalledWith(JSON.stringify({ status: 'FAILED', code: 'READ_ONLY_INPUT_MISSING' }))
    expect(process.exitCode).toBe(1)
    expect(sdkMocks.transportArgs).not.toHaveBeenCalled()
  })

  it('prints the summary as JSON on success', async () => {
    process.env.NOTION_MCP_URL = 'https://notion.example/mcp'
    process.env.NOTION_MCP_BEARER_TOKEN = secretToken
    sdkMocks.callTool
      .mockResolvedValueOnce(textResult({}))
      .mockResolvedValueOnce(textResult({}))
      .mockResolvedValueOnce(okSearch(0, []))

    await runScript()

    const printed = JSON.parse(logSpy.mock.calls[0][0] as string)
    expect(printed.status).toBe('VERIFIED')
    expect(process.exitCode).toBeUndefined()
    expect(JSON.stringify(logSpy.mock.calls)).not.toContain(secretToken)
  })

  it('fails with READ_ONLY_ACCEPTANCE_FAILED and no detail when a call fails', async () => {
    process.env.NOTION_MCP_URL = 'https://notion.example/mcp'
    process.env.NOTION_MCP_BEARER_TOKEN = secretToken
    sdkMocks.connect.mockRejectedValueOnce(new Error(`leaked ${secretToken}`))

    await runScript()

    expect(errorSpy).toHaveBeenCalledWith(JSON.stringify({ status: 'FAILED', code: 'READ_ONLY_ACCEPTANCE_FAILED' }))
    expect(process.exitCode).toBe(1)
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain(secretToken)
  })
})
