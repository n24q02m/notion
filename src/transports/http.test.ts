import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildAuthConfig, startHttp } from './http.js'

const hullMocks = vi.hoisted(() => ({
  runHttpServer: vi.fn(),
  close: vi.fn(),
  createMCPServer: vi.fn()
}))

vi.mock('@n24q02m/hull/transport', () => ({ runHttpServer: hullMocks.runHttpServer }))
vi.mock('../create-server.js', () => ({ createMCPServer: hullMocks.createMCPServer }))
vi.mock('../notion-client.js', () => ({ notionClientForCaller: vi.fn() }))

const HASH_STUB = 'scrypt$stub-hash-for-tests'

describe('buildAuthConfig', () => {
  it('defaults to multi mode with the hull default users file', () => {
    expect(buildAuthConfig({})).toEqual({ mode: 'multi', usersFile: undefined })
  })

  it('passes MCP_USERS_FILE through in multi mode', () => {
    expect(buildAuthConfig({ MCP_AUTH_MODE: 'multi', MCP_USERS_FILE: '/etc/notion/users.toml' })).toEqual({
      mode: 'multi',
      usersFile: '/etc/notion/users.toml'
    })
  })

  it('maps token mode with hash and rpm', () => {
    expect(buildAuthConfig({ MCP_AUTH_MODE: 'token', MCP_AUTH_TOKEN_HASH: HASH_STUB, MCP_RPM: '60' })).toEqual({
      mode: 'token',
      tokenHash: HASH_STUB,
      rpm: 60
    })
  })

  it('leaves rpm null in token mode when MCP_RPM is unset', () => {
    expect(buildAuthConfig({ MCP_AUTH_MODE: 'token', MCP_AUTH_TOKEN_HASH: HASH_STUB })).toEqual({
      mode: 'token',
      tokenHash: HASH_STUB,
      rpm: null
    })
  })

  it('requires MCP_AUTH_TOKEN_HASH in token mode', () => {
    expect(() => buildAuthConfig({ MCP_AUTH_MODE: 'token' })).toThrow(/MCP_AUTH_TOKEN_HASH/)
  })

  it('maps no-auth mode', () => {
    expect(buildAuthConfig({ MCP_AUTH_MODE: 'no-auth' })).toEqual({ mode: 'no-auth' })
  })

  it('rejects an unknown MCP_AUTH_MODE', () => {
    expect(() => buildAuthConfig({ MCP_AUTH_MODE: 'oauth' })).toThrow(/Unknown MCP_AUTH_MODE "oauth"/)
  })
})

describe('startHttp', () => {
  const originalEnv = process.env
  let handlers: Record<string, () => Promise<void>>
  let onceSpy: ReturnType<typeof vi.spyOn>
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.PORT
    delete process.env.HOST
    delete process.env.MCP_AUTH_MODE
    handlers = {}
    onceSpy = vi.spyOn(process, 'once').mockImplementation(((event: string, listener: () => Promise<void>) => {
      handlers[event] = listener
      return process
    }) as never)
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    hullMocks.close.mockResolvedValue(undefined)
    hullMocks.runHttpServer.mockImplementation(async (_factory: unknown, opts: { host: string; port: number }) => ({
      host: opts.host,
      port: opts.port || 41234,
      close: hullMocks.close
    }))
  })

  afterEach(() => {
    process.env = originalEnv
    onceSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('serves on loopback with an auto port in multi mode by default and closes on SIGTERM', async () => {
    const done = startHttp()
    await vi.waitFor(() => expect(handlers.SIGTERM).toBeDefined())

    expect(hullMocks.runHttpServer).toHaveBeenCalledWith(expect.any(Function), {
      serverName: 'notion',
      port: 0,
      host: '127.0.0.1',
      auth: { mode: 'multi', usersFile: undefined }
    })
    expect(errorSpy).toHaveBeenCalledWith('[notion] http mode on 127.0.0.1:41234 (auth=multi)')
    expect(handlers.SIGINT).toBeDefined()

    await handlers.SIGTERM()
    await done
    expect(hullMocks.close).toHaveBeenCalledOnce()
    expect(errorSpy).toHaveBeenCalledWith('[notion] shutting down')
  })

  it('reads PORT, HOST and the auth mode from the environment', async () => {
    process.env.PORT = '8123'
    process.env.HOST = '0.0.0.0'
    process.env.MCP_AUTH_MODE = 'token'
    process.env.MCP_AUTH_TOKEN_HASH = HASH_STUB

    const done = startHttp()
    await vi.waitFor(() => expect(handlers.SIGINT).toBeDefined())

    expect(hullMocks.runHttpServer).toHaveBeenCalledWith(expect.any(Function), {
      serverName: 'notion',
      port: 8123,
      host: '0.0.0.0',
      auth: { mode: 'token', tokenHash: HASH_STUB, rpm: null }
    })

    await handlers.SIGINT()
    await done
  })

  it('builds each session server from the per-caller Notion client', async () => {
    const done = startHttp()
    await vi.waitFor(() => expect(handlers.SIGINT).toBeDefined())
    const { notionClientForCaller } = await import('../notion-client.js')
    hullMocks.createMCPServer.mockReturnValueOnce({ server: 'stub' })

    const factory = hullMocks.runHttpServer.mock.calls[0][0] as () => unknown
    expect(factory()).toEqual({ server: 'stub' })
    expect(hullMocks.createMCPServer).toHaveBeenCalledWith(notionClientForCaller)

    await handlers.SIGINT()
    await done
  })

  it('does not start when the auth environment is invalid', async () => {
    process.env.MCP_AUTH_MODE = 'token'
    delete process.env.MCP_AUTH_TOKEN_HASH

    await expect(startHttp()).rejects.toThrow(/MCP_AUTH_TOKEN_HASH/)
    expect(hullMocks.runHttpServer).not.toHaveBeenCalled()
  })
})
