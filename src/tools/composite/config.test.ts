import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const SETUP_HINT = 'Run "notion auth" on the server to store a Notion integration token.'

vi.mock('../../credential-state.js', () => ({
  SETUP_HINT: 'Run "notion auth" on the server to store a Notion integration token.',
  getState: vi.fn(() => 'awaiting_setup'),
  getSubjectToken: vi.fn(async () => null),
  resetState: vi.fn(async () => undefined),
  resolveCredentialState: vi.fn(async () => 'awaiting_setup')
}))

import { getState, getSubjectToken, resetState, resolveCredentialState } from '../../credential-state.js'
import { config } from './config.js'

describe('config', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getState).mockReturnValue('awaiting_setup')
    vi.mocked(getSubjectToken).mockResolvedValue(null)
    delete process.env.NOTION_TOKEN
  })

  afterEach(() => {
    delete process.env.NOTION_TOKEN
  })

  describe('status action', () => {
    it('should return state when no token configured', async () => {
      const result = await config({ action: 'status' })

      expect(result.action).toBe('status')
      expect(result.state).toBe('awaiting_setup')
      expect(result.has_token).toBe(false)
      expect(result.token_source).toBeNull()
      expect(result).not.toHaveProperty('setup_url')
    })

    it('should return configured state with stored token', async () => {
      vi.mocked(getState).mockReturnValue('configured')
      vi.mocked(getSubjectToken).mockResolvedValue('fixture-stored-value')

      const result = await config({ action: 'status' })

      expect(result.state).toBe('configured')
      expect(result.has_token).toBe(true)
      expect(result.token_source).toBe('config')
    })

    it('should return configured state with environment token', async () => {
      vi.mocked(getState).mockReturnValue('configured')
      vi.mocked(getSubjectToken).mockResolvedValue('fixture-env-value')
      process.env.NOTION_TOKEN = 'fixture-env-value'

      const result = await config({ action: 'status' })

      expect(result.state).toBe('configured')
      expect(result.has_token).toBe(true)
      expect(result.token_source).toBe('environment')
    })
  })

  describe('setup_status action', () => {
    it('should return the same credential fields as status, tagged setup_status', async () => {
      const result = await config({ action: 'setup_status' })

      expect(result.action).toBe('setup_status')
      expect(result.state).toBe('awaiting_setup')
      expect(result.has_token).toBe(false)
      expect(result.token_source).toBeNull()
      expect(result).not.toHaveProperty('setup_url')
    })

    it('should reflect configured state with stored token', async () => {
      vi.mocked(getState).mockReturnValue('configured')
      vi.mocked(getSubjectToken).mockResolvedValue('fixture-stored-value')

      const result = await config({ action: 'setup_status' })

      expect(result.state).toBe('configured')
      expect(result.has_token).toBe(true)
      expect(result.token_source).toBe('config')
    })

    it('should match status fields exactly, minus the action tag', async () => {
      vi.mocked(getState).mockReturnValue('configured')
      vi.mocked(getSubjectToken).mockResolvedValue('fixture-stored-value')

      const statusResult = await config({ action: 'status' })
      const setupStatusResult = await config({ action: 'setup_status' })

      const { action: _a, ...statusFields } = statusResult
      const { action: _b, ...setupStatusFields } = setupStatusResult
      expect(setupStatusFields).toEqual(statusFields)
    })
  })

  describe('setup_start action', () => {
    it('should return the stored-token setup hint without a setup URL', async () => {
      const result = await config({ action: 'setup_start' })

      expect(result.action).toBe('setup_start')
      expect(result.state).toBe('awaiting_setup')
      expect(result.message).toBe(SETUP_HINT)
      expect(result).not.toHaveProperty('setup_url')
    })
  })

  describe('setup_reset action', () => {
    it('should reset state and return confirmation', async () => {
      const result = await config({ action: 'setup_reset' })

      expect(resetState).toHaveBeenCalled()
      expect(result.action).toBe('setup_reset')
      expect(result.state).toBe('awaiting_setup')
      expect(result.message).toContain('Credential state reset')
    })
  })

  describe('setup_complete action', () => {
    it('should re-check credentials and return configured state', async () => {
      vi.mocked(resolveCredentialState).mockResolvedValue('configured')
      vi.mocked(getSubjectToken).mockResolvedValue('fixture-resolved-value')

      const result = await config({ action: 'setup_complete' })

      expect(resolveCredentialState).toHaveBeenCalled()
      expect(result.action).toBe('setup_complete')
      expect(result.state).toBe('configured')
      expect(result.has_token).toBe(true)
      expect(result.message).toContain('Credentials verified')
    })

    it('should return awaiting_setup when no credentials found', async () => {
      vi.mocked(resolveCredentialState).mockResolvedValue('awaiting_setup')
      vi.mocked(getSubjectToken).mockResolvedValue(null)

      const result = await config({ action: 'setup_complete' })

      expect(result.state).toBe('awaiting_setup')
      expect(result.has_token).toBe(false)
      expect(result.message).toContain('No credentials found')
      expect(result.message).toContain(SETUP_HINT)
    })
  })

  describe('set action', () => {
    it('should return error response indicating no mutable runtime settings', async () => {
      const result = await config({ action: 'set' })

      expect(result.action).toBe('set')
      expect(result.ok).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('cache_clear action', () => {
    it('should return ok with cleared count of 0', async () => {
      const result = await config({ action: 'cache_clear' })

      expect(result.action).toBe('cache_clear')
      expect(result.ok).toBe(true)
      expect(result.cleared).toBe(0)
    })
  })

  describe('invalid action', () => {
    it('should throw error for unsupported action', async () => {
      await expect(config({ action: 'invalid' as never })).rejects.toThrow('Unsupported action: invalid')
    })
  })
})
