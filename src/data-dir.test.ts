import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { dataDir, PerPluginStore } from '@n24q02m/hull/storage'
import { afterEach, describe, expect, it } from 'vitest'
import { STORE_PLUGIN } from './credential-state.js'
import {
  applyDataDirOverride,
  DATA_DIR_ENV,
  DATA_DIR_NAME,
  DataDirEscapeError,
  resolveBaseDir,
  resolveDataDir
} from './data-dir.js'

// Platform-neutral absolute home: `resolve` makes it absolute on Windows too.
const HOME = resolve('/', 'home', 'user')

afterEach(() => {
  // `applyDataDirOverride` moves hull's process-wide home; put it back.
  applyDataDirOverride({})
})

describe('resolveDataDir', () => {
  it('names the directory hull uses for STORE_PLUGIN', () => {
    expect(DATA_DIR_NAME).toBe(`.${STORE_PLUGIN}`)
  })

  it('resolves the default data dir under the home directory', () => {
    expect(resolveBaseDir({}, HOME)).toBe(HOME)
    expect(resolveDataDir({}, HOME)).toBe(join(HOME, DATA_DIR_NAME))
  })

  it('honors an absolute DATA_DIR override', () => {
    const override = resolve('/', 'srv', 'notion')
    expect(resolveDataDir({ [DATA_DIR_ENV]: override }, HOME)).toBe(join(override, DATA_DIR_NAME))
  })

  it('resolves a relative DATA_DIR override inside the base dir', () => {
    expect(resolveBaseDir({ [DATA_DIR_ENV]: 'state/notion' }, HOME)).toBe(join(HOME, 'state', 'notion'))
    expect(resolveDataDir({ [DATA_DIR_ENV]: './state/../state/notion' }, HOME)).toBe(
      join(HOME, 'state', 'notion', DATA_DIR_NAME)
    )
  })

  it('rejects a relative DATA_DIR override that escapes the base dir', () => {
    // Native separators, so the traversal is real on POSIX and on Windows; a
    // backslash path is only a traversal where the platform treats it as one.
    const hostile = ['..', '../..', '../../etc', 'state/../../..', join('..', '..', 'windows')]
    if (process.platform === 'win32') hostile.push('..\\..\\windows')

    for (const value of hostile) {
      expect(() => resolveDataDir({ [DATA_DIR_ENV]: value }, HOME), value).toThrow(DataDirEscapeError)
    }
  })

  it('rejects a DATA_DIR override containing a NUL byte', () => {
    expect(() => resolveDataDir({ [DATA_DIR_ENV]: `${HOME}\0evil` }, HOME)).toThrow(DataDirEscapeError)
  })

  it('falls back to the default when DATA_DIR is empty or whitespace', () => {
    expect(resolveDataDir({ [DATA_DIR_ENV]: '' }, HOME)).toBe(join(HOME, DATA_DIR_NAME))
    expect(resolveDataDir({ [DATA_DIR_ENV]: '   ' }, HOME)).toBe(join(HOME, DATA_DIR_NAME))
    expect(resolveDataDir({ [DATA_DIR_ENV]: undefined }, HOME)).toBe(join(HOME, DATA_DIR_NAME))
  })
})

describe('applyDataDirOverride', () => {
  it('moves hull’s per-plugin store under the override', () => {
    const override = resolve('/', 'srv', 'notion')

    expect(applyDataDirOverride({ [DATA_DIR_ENV]: override })).toBe(override)
    expect(dataDir(STORE_PLUGIN)).toBe(join(override, DATA_DIR_NAME))
  })

  it('writes the credential store under the override', async () => {
    const base = mkdtempSync(join(tmpdir(), 'data-dir-store-'))
    try {
      applyDataDirOverride({ [DATA_DIR_ENV]: base })

      await new PerPluginStore(STORE_PLUGIN).save({ NOTION_TOKEN: 'ntn_test' })

      expect(existsSync(join(base, DATA_DIR_NAME, 'config.json'))).toBe(true)
      expect(await new PerPluginStore(STORE_PLUGIN).load()).toEqual({ NOTION_TOKEN: 'ntn_test' })
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })

  it('leaves hull alone when DATA_DIR is unset', () => {
    const before = dataDir(STORE_PLUGIN)
    expect(applyDataDirOverride({})).toBeNull()
    expect(dataDir(STORE_PLUGIN)).toBe(before)
  })
})
