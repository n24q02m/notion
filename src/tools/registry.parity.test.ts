import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'

vi.mock('./composite/pages.js', () => ({ pages: vi.fn() }))
vi.mock('./composite/databases.js', () => ({ databases: vi.fn() }))
vi.mock('./composite/blocks.js', () => ({ blocks: vi.fn() }))
vi.mock('./composite/comments.js', () => ({ commentsManage: vi.fn() }))
vi.mock('./composite/content.js', () => ({ contentConvert: vi.fn() }))
vi.mock('./composite/users.js', () => ({ users: vi.fn() }))
vi.mock('./composite/workspace.js', () => ({ workspace: vi.fn() }))
vi.mock('./composite/file-uploads.js', () => ({ fileUploads: vi.fn() }))
vi.mock('./composite/config.js', () => ({ config: vi.fn() }))

vi.mock('../credential-state.js', () => ({
  SETUP_HINT: 'Run "notion auth" on the server to store a Notion integration token.',
  getSubjectToken: vi.fn(async () => 'fixture-stored-value')
}))

import { registerTools } from './registry.js'

type Expected = { name: string; inputSchema: unknown; annotations: unknown }

const EXPECTED: Expected[] = JSON.parse(
  readFileSync(new URL('../../tests/fixtures/tools_expected.json', import.meta.url), 'utf8')
)

function captureListTools() {
  const handlers: ((...args: any[]) => any)[] = []
  const server = {
    setRequestHandler: vi.fn((_schema: unknown, handler: (...args: any[]) => any) => {
      handlers.push(handler)
    })
  }
  registerTools(
    server as any,
    vi.fn(() => ({}) as any)
  )
  // Registration order: 0 = ListTools
  return handlers[0]
}

describe('tool surface parity with origin/main (relay removed)', () => {
  it('lists the same tool names in the same order', async () => {
    const result = await captureListTools()()
    expect(result.tools.map((t: { name: string }) => t.name)).toEqual(EXPECTED.map((t) => t.name))
  })

  it('keeps every input schema byte-identical to the baseline', async () => {
    const result = await captureListTools()()
    for (const expected of EXPECTED) {
      const actual = result.tools.find((t: { name: string }) => t.name === expected.name)
      expect(actual, expected.name).toBeDefined()
      expect(actual.inputSchema, expected.name).toEqual(expected.inputSchema)
    }
  })

  it('keeps every annotation identical to the baseline', async () => {
    const result = await captureListTools()()
    for (const expected of EXPECTED) {
      const actual = result.tools.find((t: { name: string }) => t.name === expected.name)
      expect(actual.annotations ?? null, expected.name).toEqual(expected.annotations)
    }
  })

  it('does not expose config__open_relay', async () => {
    const result = await captureListTools()()
    expect(result.tools.map((t: { name: string }) => t.name)).not.toContain('config__open_relay')
  })
})
