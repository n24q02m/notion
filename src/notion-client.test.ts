import { beforeEach, describe, expect, it, vi } from 'vitest'

const h = vi.hoisted(() => ({
  clientCtor: vi.fn(),
  getSubjectToken: vi.fn()
}))

vi.mock('@notionhq/client', () => ({
  Client: h.clientCtor
}))

vi.mock('./credential-state.js', () => ({
  SETUP_HINT: 'Run "notion auth" on the server to store a Notion integration token.',
  getSubjectToken: h.getSubjectToken
}))

import { createNotionClient, NOTION_VERSION, notionClientForCaller } from './notion-client.js'

describe('notion-client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('pins the Notion API version', () => {
    expect(NOTION_VERSION).toBe('2025-09-03')
  })

  it('createNotionClient passes the token and pinned version to the SDK', () => {
    createNotionClient('fixture-client-value')

    expect(h.clientCtor).toHaveBeenCalledWith({ auth: 'fixture-client-value', notionVersion: NOTION_VERSION })
  })

  it('notionClientForCaller builds a client from the caller token', async () => {
    h.getSubjectToken.mockResolvedValue('fixture-caller-value')

    await notionClientForCaller()

    expect(h.clientCtor).toHaveBeenCalledWith({ auth: 'fixture-caller-value', notionVersion: NOTION_VERSION })
  })

  it('notionClientForCaller throws the setup hint when the caller has no token', async () => {
    h.getSubjectToken.mockResolvedValue(null)

    await expect(notionClientForCaller()).rejects.toThrow('Notion integration token not configured')
    await expect(notionClientForCaller()).rejects.toThrow('notion auth')
    expect(h.clientCtor).not.toHaveBeenCalled()
  })
})
