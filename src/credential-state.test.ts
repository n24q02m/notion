/**
 * Tests for credential state management.
 *
 * Covers env/config resolution, the awaiting_setup/configured state machine,
 * and per-caller token lookup keyed by hull's request-scoped namespace.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

const h = vi.hoisted(() => ({
  readConfig: vi.fn(),
  writeConfig: vi.fn(),
  deleteConfig: vi.fn(),
  resolveConfig: vi.fn(),
  storeLoad: vi.fn(),
  storeSave: vi.fn(),
  storeClear: vi.fn(),
  currentUser: vi.fn()
}))

vi.mock('@n24q02m/hull/storage', () => ({
  readConfig: h.readConfig,
  writeConfig: h.writeConfig,
  deleteConfig: h.deleteConfig,
  resolveConfig: h.resolveConfig,
  PerPluginStore: class {
    load = h.storeLoad
    save = h.storeSave
    clear = h.storeClear
  }
}))

vi.mock('@n24q02m/hull/token-auth', () => ({
  currentUser: h.currentUser
}))

import {
  assertNamespace,
  getState,
  getSubjectToken,
  resetState,
  resolveCredentialState,
  saveNamespaceToken
} from './credential-state.js'

const SERVER_NAME = 'better-notion-mcp'
const STORE_PLUGIN = 'better-notion'

function asCaller(namespace: string) {
  h.currentUser.mockReturnValue({ uid: 'fixture-uid', namespace, mode: 'stdio' } as never)
}

describe('credential-state', () => {
  beforeEach(async () => {
    vi.resetAllMocks()
    asCaller('default')
    h.readConfig.mockResolvedValue(null)
    h.resolveConfig.mockResolvedValue({ config: null, source: null } as never)
    h.deleteConfig.mockResolvedValue(undefined)
    h.writeConfig.mockResolvedValue(undefined)
    h.storeLoad.mockResolvedValue(null)
    h.storeSave.mockResolvedValue(undefined)
    h.storeClear.mockResolvedValue(undefined)
    delete process.env.NOTION_TOKEN

    await resolveCredentialState()
  })

  describe('resolveCredentialState', () => {
    it('starts awaiting_setup when no env token and no config file', () => {
      expect(getState()).toBe('awaiting_setup')
    })

    it('becomes configured from the NOTION_TOKEN env var', async () => {
      process.env.NOTION_TOKEN = 'fixture-env-value'

      await expect(resolveCredentialState()).resolves.toBe('configured')
      expect(getState()).toBe('configured')
      await expect(getSubjectToken()).resolves.toBe('fixture-env-value')
    })

    it('becomes configured from the saved config file', async () => {
      h.resolveConfig.mockResolvedValue({ config: { NOTION_TOKEN: 'fixture-file-value' }, source: 'config' } as never)

      await expect(resolveCredentialState()).resolves.toBe('configured')
      expect(h.resolveConfig).toHaveBeenCalledWith(SERVER_NAME, ['NOTION_TOKEN'])
      await expect(getSubjectToken()).resolves.toBe('fixture-file-value')
    })

    it('stays awaiting_setup when the config read throws', async () => {
      h.resolveConfig.mockRejectedValue(new Error('fixture read failure'))

      await expect(resolveCredentialState()).resolves.toBe('awaiting_setup')
      await expect(getSubjectToken()).resolves.toBeNull()
    })
  })

  describe('getSubjectToken', () => {
    it('reads the default namespace from the saved config', async () => {
      h.readConfig.mockResolvedValue({ NOTION_TOKEN: 'fixture-saved-value' })

      await expect(getSubjectToken()).resolves.toBe('fixture-saved-value')
      expect(h.readConfig).toHaveBeenCalledWith(SERVER_NAME, STORE_PLUGIN)
    })

    it('reads a non-default namespace from its per-plugin store', async () => {
      asCaller('team-a')
      h.storeLoad.mockResolvedValue({ NOTION_TOKEN: 'fixture-team-value' })

      await expect(getSubjectToken()).resolves.toBe('fixture-team-value')
      expect(h.readConfig).not.toHaveBeenCalled()
    })

    it('returns null for a non-default namespace with no stored token', async () => {
      asCaller('team-a')
      h.storeLoad.mockResolvedValue(null)

      await expect(getSubjectToken()).resolves.toBeNull()
    })

    it('rejects an invalid namespace before touching storage', async () => {
      asCaller('../escape')

      await expect(getSubjectToken()).rejects.toThrow('Invalid namespace')
      expect(h.storeLoad).not.toHaveBeenCalled()
    })
  })

  describe('saveNamespaceToken', () => {
    it('writes the default namespace through writeConfig', async () => {
      await saveNamespaceToken('default', 'fixture-save-value')

      expect(h.writeConfig).toHaveBeenCalledWith(SERVER_NAME, { NOTION_TOKEN: 'fixture-save-value' }, STORE_PLUGIN)
    })

    it('writes a non-default namespace through its per-plugin store', async () => {
      await saveNamespaceToken('team-a', 'fixture-save-value')

      expect(h.storeSave).toHaveBeenCalledWith({ NOTION_TOKEN: 'fixture-save-value' })
      expect(h.writeConfig).not.toHaveBeenCalled()
    })
  })

  describe('resetState', () => {
    it('clears the default token, state, and saved config', async () => {
      process.env.NOTION_TOKEN = 'fixture-env-value'
      await resolveCredentialState()
      expect(getState()).toBe('configured')

      await resetState()

      expect(getState()).toBe('awaiting_setup')
      expect(h.deleteConfig).toHaveBeenCalledWith(SERVER_NAME, STORE_PLUGIN)
      await expect(getSubjectToken()).resolves.toBeNull()
    })

    it('clears only the caller namespace and leaves the default state alone', async () => {
      process.env.NOTION_TOKEN = 'fixture-env-value'
      await resolveCredentialState()
      asCaller('team-a')

      await resetState()

      expect(h.storeClear).toHaveBeenCalled()
      expect(h.deleteConfig).not.toHaveBeenCalled()
      expect(getState()).toBe('configured')
    })
  })

  describe('assertNamespace', () => {
    it('accepts letters, digits, dash, and underscore', () => {
      expect(assertNamespace('team_a-1')).toBe('team_a-1')
    })

    it('rejects names that start with a non-alphanumeric or contain a path separator', () => {
      expect(() => assertNamespace('-leading')).toThrow('Invalid namespace')
      expect(() => assertNamespace('a/b')).toThrow('Invalid namespace')
    })
  })
})
