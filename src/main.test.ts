import * as fs from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bootstrap, getTransportMode, isMain, mode, startServer } from './main.js'

const startHttpMock = vi.fn()
const stdioConnectMock = vi.fn().mockResolvedValue(undefined)
const stdioServerCtor = vi.fn()
const stdioTransportCtor = vi.fn()
const registerToolsMock = vi.fn()

vi.mock('./transports/http.js', () => ({
  startHttp: startHttpMock
}))

vi.mock('@modelcontextprotocol/sdk/server/index.js', () => {
  class MockServer {
    constructor(...args: unknown[]) {
      stdioServerCtor(...args)
    }
    connect = stdioConnectMock
  }
  return { Server: MockServer }
})

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => {
  class MockStdioServerTransport {
    constructor(...args: unknown[]) {
      stdioTransportCtor(...args)
    }
  }
  return { StdioServerTransport: MockStdioServerTransport }
})

vi.mock('./notion-client.js', () => ({
  createNotionClient: vi.fn(),
  notionClientForCaller: vi.fn()
}))

vi.mock('./tools/registry.js', () => ({
  registerTools: (...args: unknown[]) => {
    registerToolsMock(...args)
  }
}))

vi.mock('./credential-state.js', () => ({
  DEFAULT_NAMESPACE: 'default',
  STORE_PLUGIN: 'better-notion',
  assertNamespace: vi.fn((ns: string) => ns),
  getState: vi.fn().mockReturnValue('configured'),
  resolveCredentialState: vi.fn().mockResolvedValue('configured'),
  saveNamespaceToken: vi.fn().mockResolvedValue(undefined)
}))

// Mock node:fs to allow spying on realpathSync in ESM
vi.mock('node:fs', async (importOriginal) => {
  const original = await importOriginal<typeof import('node:fs')>()
  return {
    ...original,
    realpathSync: vi.fn(original.realpathSync),
    readFileSync: vi.fn(original.readFileSync)
  }
})

// Mock process.exit to prevent test runner from exiting
const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any)

describe('main.ts', () => {
  const originalEnv = process.env
  const originalArgv = process.argv
  const originalPlatform = process.platform

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv, NODE_ENV: 'test' }
    process.argv = [...originalArgv]
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      configurable: true
    })
  })

  afterEach(() => {
    process.env = originalEnv
    process.argv = originalArgv
    vi.unstubAllEnvs()
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      configurable: true
    })
  })

  describe('getPackageVersion', () => {
    // This is a private function, but startServer calls it.
    it('returns version from package.json', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify({ version: '1.2.3' }))
      await startServer('stdio')
      expect(stdioServerCtor).toHaveBeenCalledWith(expect.objectContaining({ version: '1.2.3' }), expect.any(Object))
    })

    it('returns 0.0.0 if version is missing', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify({}))
      await startServer('stdio')
      expect(stdioServerCtor).toHaveBeenCalledWith(expect.objectContaining({ version: '0.0.0' }), expect.any(Object))
    })

    it('returns 0.0.0 if readFileSync throws', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
        throw new Error('Read error')
      })
      await startServer('stdio')
      expect(stdioServerCtor).toHaveBeenCalledWith(expect.objectContaining({ version: '0.0.0' }), expect.any(Object))
    })

    it('returns 0.0.0 if JSON.parse fails', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      vi.mocked(fs.readFileSync).mockReturnValueOnce('{ invalid }')
      await startServer('stdio')
      expect(stdioServerCtor).toHaveBeenCalledWith(expect.objectContaining({ version: '0.0.0' }), expect.any(Object))
    })
  })

  describe('isMain', () => {
    it('verifies false when fileURLToPath throws (invalid URL)', () => {
      expect(isMain('not-a-url')).toBe(false)
    })
    it('verifies true when process.argv[1] matches the file path', () => {
      const currentDir = dirname(fileURLToPath(import.meta.url))
      const mainPath = join(currentDir, 'main.ts')
      const mainUrl = pathToFileURL(mainPath).href

      process.argv[1] = mainPath
      expect(isMain(mainUrl)).toBe(true)
    })

    it('verifies false when process.argv[1] does not match', () => {
      process.argv[1] = '/some/other/file.js'
      expect(isMain(import.meta.url)).toBe(false)
    })

    it('verifies false when process.argv[1] is undefined', () => {
      process.argv = [process.argv[0]]
      expect(isMain(import.meta.url)).toBe(false)
    })

    it('verifies Windows path normalization', () => {
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true })

      const currentDir = dirname(fileURLToPath(import.meta.url))
      const mainPath = join(currentDir, 'main.ts')
      const mainUrl = pathToFileURL(mainPath).href

      // Mock Windows-style paths
      const winMainPath = 'C:\\project\\src\\main.ts'
      const winEntryPath = 'c:/project/src/main.ts'

      vi.mocked(fs.realpathSync).mockReturnValueOnce(winMainPath).mockReturnValueOnce(winEntryPath)

      process.argv[1] = winEntryPath
      expect(isMain(mainUrl)).toBe(true)
    })

    it('verifies Windows path normalization mismatch', () => {
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true })

      const winMainPath = 'C:\\project\\src\\main.ts'
      const winEntryPath = 'C:\\project\\src\\other.ts'

      vi.mocked(fs.realpathSync).mockReturnValueOnce(winMainPath).mockReturnValueOnce(winEntryPath)

      process.argv[1] = winEntryPath
      expect(isMain(import.meta.url)).toBe(false)
    })

    it('verifies false when realpathSync throws', () => {
      process.argv[1] = 'somefile.ts'
      vi.mocked(fs.realpathSync).mockImplementationOnce(() => {
        throw new Error('Not found')
      })

      expect(isMain(import.meta.url)).toBe(false)
    })

    it('verifies false when second call to realpathSync throws', () => {
      process.argv[1] = 'somefile.ts'
      vi.mocked(fs.realpathSync)
        .mockReturnValueOnce('/path/to/main.ts')
        .mockImplementationOnce(() => {
          throw new Error('Entry not found')
        })

      expect(isMain(import.meta.url)).toBe(false)
    })
  })
  describe('getTransportMode', () => {
    it('verifies default to stdio mode if no config is provided', () => {
      expect(getTransportMode({}, [])).toBe('stdio')
    })

    it('verifies http mode via TRANSPORT_MODE env', () => {
      expect(getTransportMode({ TRANSPORT_MODE: 'http' }, [])).toBe('http')
    })

    it('verifies http mode via MCP_TRANSPORT env', () => {
      expect(getTransportMode({ MCP_TRANSPORT: 'http' }, [])).toBe('http')
    })

    it('verifies http mode via --http flag', () => {
      expect(getTransportMode({}, ['--http'])).toBe('http')
    })

    it('verifies stdio if --http is not an exact match', () => {
      expect(getTransportMode({}, ['--http-proxy'])).toBe('stdio')
    })

    it('verifies current process.env and process.argv if no arguments are provided', () => {
      vi.stubEnv('TRANSPORT_MODE', 'http')
      expect(getTransportMode()).toBe('http')
    })
  })

  describe('startServer', () => {
    it('passes notionClientForCaller to registerTools', async () => {
      const { notionClientForCaller } = await import('./notion-client.js')

      await startServer('stdio')

      expect(registerToolsMock.mock.calls[0][1]).toBe(notionClientForCaller)
    })

    it('exits when no credential is configured in stdio mode', async () => {
      const { getState } = await import('./credential-state.js')
      vi.mocked(getState).mockReturnValueOnce('awaiting_setup')
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
      const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)

      await startServer('stdio')

      expect(exitSpy).toHaveBeenCalledWith(1)
      expect(registerToolsMock).not.toHaveBeenCalled()
      exitSpy.mockRestore()
      stderrSpy.mockRestore()
    })

    it('verifies call to startHttp when mode is http', async () => {
      await startServer('http')
      expect(startHttpMock).toHaveBeenCalled()
    })

    it('verifies direct stdio transport when mode is stdio', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      await startServer('stdio')
      expect(stdioServerCtor).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'notion' }),
        expect.objectContaining({ capabilities: expect.any(Object) })
      )
      expect(stdioTransportCtor).toHaveBeenCalledOnce()
      expect(stdioConnectMock).toHaveBeenCalledOnce()
      expect(registerToolsMock).toHaveBeenCalledOnce()
      expect(startHttpMock).not.toHaveBeenCalled()
    })

    it('verifies direct stdio transport when mode is unknown', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      await startServer('unknown')
      expect(stdioServerCtor).toHaveBeenCalled()
      expect(stdioConnectMock).toHaveBeenCalled()
    })

    it('exits 1 with stderr message when stdio mode is selected without NOTION_TOKEN', async () => {
      delete process.env.NOTION_TOKEN
      const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
      await startServer('stdio')
      expect(exitSpy).toHaveBeenCalledWith(1)
      expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('NOTION_TOKEN'))
      expect(stdioServerCtor).not.toHaveBeenCalled()
      stderrSpy.mockRestore()
    })

    it('verifies error propagation from startHttp', async () => {
      startHttpMock.mockRejectedValueOnce(new Error('HTTP failed'))
      await expect(startServer('http')).rejects.toThrow('HTTP failed')
    })
  })

  describe('bootstrap and exports', () => {
    it('verifies export of selected mode', () => {
      expect(typeof mode).toBe('string')
    })

    it('verifies execution with default mode', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      await bootstrap()
      expect(stdioConnectMock).toHaveBeenCalled()
    })

    it('verifies execution with provided mode', async () => {
      await bootstrap('http')
      expect(startHttpMock).toHaveBeenCalled()
    })

    it('verifies startup errors in bootstrap', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      stdioConnectMock.mockRejectedValueOnce(new Error('Test failure'))

      await bootstrap('stdio')

      expect(consoleSpy).toHaveBeenCalledWith('Failed to start server:', 'Test failure')
      expect(exitSpy).toHaveBeenCalledWith(1)

      consoleSpy.mockRestore()
    })

    it('verifies startup errors with non-Error object in bootstrap', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      stdioConnectMock.mockRejectedValueOnce('String error')

      await bootstrap('stdio')

      expect(consoleSpy).toHaveBeenCalledWith('Failed to start server:', 'String error')
      expect(exitSpy).toHaveBeenCalledWith(1)

      consoleSpy.mockRestore()
    })

    it('verifies fork-bomb protection prevents multiple starts', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // First call should work
      await bootstrap('stdio')
      expect(stdioConnectMock).toHaveBeenCalledTimes(1)

      // Second call should be aborted
      await bootstrap('stdio')
      expect(stdioConnectMock).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Startup aborted'))

      consoleSpy.mockRestore()
      delete process.env.BETTER_NOTION_MCP_BOOTSTRAPPED
    })

    it('verifies fork-bomb protection in startServer directly', async () => {
      process.env.NOTION_TOKEN = 'ntn_test_token'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await startServer('stdio')
      expect(stdioConnectMock).toHaveBeenCalledTimes(1)

      await startServer('stdio')
      expect(stdioConnectMock).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Startup aborted'))

      consoleSpy.mockRestore()
      delete process.env.BETTER_NOTION_MCP_BOOTSTRAPPED
    })

    it('verifies initialization of global mode from environment', async () => {
      vi.stubEnv('TRANSPORT_MODE', 'http')
      vi.resetModules()
      const { mode: newMode } = await import('./main.js')
      expect(newMode).toBe('http')
      delete process.env.BETTER_NOTION_MCP_BOOTSTRAPPED
    })

    it('verifies handle error in getPackageVersion', async () => {
      const readFileSyncSpy = vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('Read failed')
      })
      vi.resetModules()
      const { startServer } = await import('./main.js')
      process.env.NOTION_TOKEN = 'ntn_test_token'
      await startServer('stdio')
      expect(stdioServerCtor).toHaveBeenCalled()
      readFileSyncSpy.mockRestore()
    })

    it('verifies bootstrap is called when isMain is true', async () => {
      vi.stubEnv('NODE_ENV', 'production') // Not "test"
      process.env.NOTION_TOKEN = 'ntn_test_token'

      const currentDir = dirname(fileURLToPath(import.meta.url))
      const mainPath = join(currentDir, 'main.ts')
      process.argv[1] = mainPath

      vi.mocked(fs.realpathSync).mockReturnValue(mainPath)

      vi.resetModules()
      // Use a unique query param to force reload in ESM
      await import(
        `${pathToFileURL(fs.realpathSync(join(dirname(fileURLToPath(import.meta.url)), 'main.ts'))).href}?test=${Date.now()}`
      )

      expect(stdioConnectMock).toHaveBeenCalled()
      delete process.env.BETTER_NOTION_MCP_BOOTSTRAPPED
    })

    it('verifies bootstrap is called when imported as main module', async () => {
      // Setup environment to simulate main entry point
      process.env.NODE_ENV = 'production'
      process.env.NOTION_TOKEN = 'ntn_test_token'

      const currentDir = dirname(fileURLToPath(import.meta.url))
      const mainPath = join(currentDir, 'main.ts')
      process.argv[1] = mainPath

      vi.resetModules()

      // When we import the module, it should execute the if (isMain...) block
      await import('./main.js')

      // bootstrap sets this env var
      expect(process.env.BETTER_NOTION_MCP_BOOTSTRAPPED).toBe('true')
      expect(stdioConnectMock).toHaveBeenCalled()

      delete process.env.BETTER_NOTION_MCP_BOOTSTRAPPED
    })
  })

  describe('CLI wiring (buildCli)', () => {
    const currentDir = dirname(fileURLToPath(import.meta.url))
    const mainPath = join(currentDir, 'main.ts')

    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production')
      process.argv[1] = mainPath
      vi.mocked(fs.realpathSync).mockReturnValue(mainPath)
    })

    afterEach(() => {
      delete process.env.BETTER_NOTION_MCP_BOOTSTRAPPED
    })

    it('prints version and exits 0 without starting the server', async () => {
      process.argv = [process.argv[0], mainPath, '--version']
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ version: '9.9.9' }))
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      vi.resetModules()
      await import(`${pathToFileURL(mainPath).href}?test=${Date.now()}`)
      await vi.waitFor(() => expect(exitSpy).toHaveBeenCalled())

      expect(logSpy).toHaveBeenCalledWith('notion 9.9.9')
      expect(exitSpy).toHaveBeenCalledWith(0)
      expect(stdioConnectMock).not.toHaveBeenCalled()
      logSpy.mockRestore()
    })

    it('routes config status to the built-in handler without starting the server', async () => {
      process.argv = [process.argv[0], mainPath, 'config', 'status']
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      vi.resetModules()
      await import(`${pathToFileURL(mainPath).href}?test=${Date.now()}`)
      await vi.waitFor(() => expect(exitSpy).toHaveBeenCalled())

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('notion:'))
      expect(stdioConnectMock).not.toHaveBeenCalled()
      logSpy.mockRestore()
    })

    it('does not exit right after the stdio transport connects (stays alive until shutdown)', async () => {
      // Regression guard: Server.connect() resolves once the transport
      // starts listening, not once the session ends. If `serve()` returned
      // right there, buildCli's `.then((code) => process.exit(code))` would
      // kill the process immediately after startup instead of keeping the
      // server running.
      process.argv = [process.argv[0], mainPath]
      process.env.NOTION_TOKEN = 'ntn_test_token'

      vi.resetModules()
      await import(`${pathToFileURL(mainPath).href}?test=${Date.now()}`)
      await vi.waitFor(() => expect(stdioConnectMock).toHaveBeenCalled())

      await new Promise((resolve) => setTimeout(resolve, 20))
      expect(exitSpy).not.toHaveBeenCalled()
    })

    it('exits 0 once SIGINT fires after the transport connects', async () => {
      process.argv = [process.argv[0], mainPath]
      process.env.NOTION_TOKEN = 'ntn_test_token'
      let sigintHandler: (() => void) | undefined
      const onceSpy = vi.spyOn(process, 'once').mockImplementation((event, listener) => {
        if (event === 'SIGINT') sigintHandler = listener as () => void
        return process
      })

      vi.resetModules()
      await import(`${pathToFileURL(mainPath).href}?test=${Date.now()}`)
      await vi.waitFor(() => expect(sigintHandler).toBeDefined())
      expect(exitSpy).not.toHaveBeenCalled()

      sigintHandler?.()
      await vi.waitFor(() => expect(exitSpy).toHaveBeenCalled())
      expect(exitSpy).toHaveBeenCalledWith(0)

      onceSpy.mockRestore()
    })
  })
})
