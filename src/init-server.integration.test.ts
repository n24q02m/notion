import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// This test verifies the integration between initServer and the actual startServer logic in main.ts
// while mocking the external transports and SDK classes.

const startHttpMock = vi.fn()
const serveStdioMock = vi.fn(() => ({ close: vi.fn().mockResolvedValue(undefined) }))
const attachSkillsProviderMock = vi.fn().mockResolvedValue({ attach: vi.fn() })

vi.mock('./transports/http.js', () => ({
  startHttp: startHttpMock
}))

vi.mock('@modelcontextprotocol/server', () => {
  return {
    McpServer: class {
      server = { setRequestHandler: vi.fn(), getClientCapabilities: vi.fn() }
      registerResource = vi.fn()
    },
    isInputRequiredResult: vi.fn(() => false),
    CLIENT_CAPABILITIES_META_KEY: 'modelcontextprotocol/client-capabilities'
  }
})

vi.mock('@modelcontextprotocol/server/stdio', () => ({
  serveStdio: serveStdioMock
}))

vi.mock('@n24q02m/hull/skills', () => ({
  attachSkillsProvider: attachSkillsProviderMock
}))

vi.mock('./tools/registry.js', () => ({
  registerTools: vi.fn()
}))

vi.mock('./credential-state.js', () => ({
  resolveCredentialState: vi.fn().mockResolvedValue(undefined),
  getState: vi.fn().mockReturnValue('configured'),
  // data-dir.ts derives the store directory name from these slugs.
  STORE_PLUGIN: 'notion',
  LEGACY_STORE_PLUGIN: 'better-notion'
}))

// Mock process.exit to prevent test runner from exiting
vi.spyOn(process, 'exit').mockImplementation((() => {}) as any)

describe('initServer integration', () => {
  const originalEnv = process.env
  const originalArgv = process.argv

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv, NODE_ENV: 'test', NOTION_TOKEN: 'ntn_test' }
    process.argv = [...originalArgv]
    delete process.env.MCP_TRANSPORT
    delete process.env.TRANSPORT_MODE
    delete process.env.BETTER_NOTION_MCP_BOOTSTRAPPED
  })

  afterEach(() => {
    process.env = originalEnv
    process.argv = originalArgv
  })

  it('flows from initServer to startHttp in main.ts when --http is present', async () => {
    process.argv = [process.argv[0], 'main.js', '--http']

    const { initServer } = await import('./init-server.js')
    await initServer()

    expect(startHttpMock).toHaveBeenCalled()
  })

  it('flows from initServer to serveStdio in main.ts by default', async () => {
    const { initServer } = await import('./init-server.js')
    await initServer()

    expect(attachSkillsProviderMock).toHaveBeenCalled()
    expect(serveStdioMock).toHaveBeenCalled()
  })
})
