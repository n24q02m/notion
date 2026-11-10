import { chmodSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { PerPluginStore, setHomeDirForTesting } from '@n24q02m/hull/storage'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { LEGACY_STORE_PLUGIN, STORE_PLUGIN } from './credential-state.js'
import { migrateLegacyStore, resetStoreMigrationForTesting, StoreMigrationError } from './data-dir-migration.js'

// The two on-disk directories the rename moves state between. Spelled out rather
// than derived, so a silent slug change in either direction fails here.
const OLD_DIR = '.better-notion'
const NEW_DIR = '.notion'

const credential = (token = 'ntn_old-token') => ({ NOTION_TOKEN: token })

describe('migrateLegacyStore', () => {
  let home: string
  let savedCredentialSecret: string | undefined

  beforeEach(() => {
    home = mkdtempSync(join(tmpdir(), 'notion-migration-'))
    // hull resolves every store path from one process-wide home; point it at the
    // temp dir so nothing here can touch the real ~/.notion.
    setHomeDirForTesting(home)
    resetStoreMigrationForTesting()
    savedCredentialSecret = process.env.CREDENTIAL_SECRET
    delete process.env.CREDENTIAL_SECRET
  })

  afterEach(() => {
    resetStoreMigrationForTesting()
    setHomeDirForTesting(null)
    if (savedCredentialSecret === undefined) delete process.env.CREDENTIAL_SECRET
    else process.env.CREDENTIAL_SECRET = savedCredentialSecret
    rmSync(home, { recursive: true, force: true })
  })

  it('pins the slug pair the migration exists for', () => {
    expect(STORE_PLUGIN).toBe('notion')
    expect(LEGACY_STORE_PLUGIN).toBe('better-notion')
    expect(`.${STORE_PLUGIN}`).toBe(NEW_DIR)
    expect(`.${LEGACY_STORE_PLUGIN}`).toBe(OLD_DIR)
  })

  // Branch 1: only the pre-rename store exists -> the token still resolves after the rename.
  it('copies a pre-rename store forward and keeps the token readable', async () => {
    const payload = credential()
    await new PerPluginStore(LEGACY_STORE_PLUGIN).save(payload)
    expect(existsSync(join(home, OLD_DIR, 'config.json'))).toBe(true)
    expect(existsSync(join(home, NEW_DIR))).toBe(false)

    const report = await migrateLegacyStore()

    expect(report.migrated).toEqual([{ source: join(home, OLD_DIR), sub: null }])
    expect(report.kept).toEqual([])
    expect(existsSync(join(home, NEW_DIR, 'config.json'))).toBe(true)
    expect(await new PerPluginStore(STORE_PLUGIN).load()).toEqual(payload)
    // The legacy copy is read-only history: the migration never deletes it.
    expect(await new PerPluginStore(LEGACY_STORE_PLUGIN).load()).toEqual(payload)
  })

  // Branch 1 (multi-user): the blob is re-keyed, not moved -- hull salts the
  // per-user key with the slug, so a plain directory rename would leave it
  // undecryptable.
  it('re-encrypts a per-user namespace under the new slug salt', async () => {
    process.env.CREDENTIAL_SECRET = 'namespace-master-secret'
    const payload = credential('ntn_alice-token')
    await new PerPluginStore(LEGACY_STORE_PLUGIN, 'alice').save(payload)

    const report = await migrateLegacyStore()

    expect(report.migrated).toEqual([{ source: join(home, OLD_DIR), sub: 'alice' }])
    expect(existsSync(join(home, NEW_DIR, 'subs', 'alice', 'config.json'))).toBe(true)
    expect(await new PerPluginStore(STORE_PLUGIN, 'alice').load()).toEqual(payload)
    expect(await new PerPluginStore(LEGACY_STORE_PLUGIN, 'alice').load()).toEqual(payload)
  })

  it('leaves per-user namespaces alone when this process cannot decrypt them', async () => {
    process.env.CREDENTIAL_SECRET = 'namespace-master-secret'
    await new PerPluginStore(LEGACY_STORE_PLUGIN, 'alice').save(credential())
    delete process.env.CREDENTIAL_SECRET

    const report = await migrateLegacyStore()

    expect(report.migrated).toEqual([])
    expect(report.deferred).toEqual(['alice'])
    expect(existsSync(join(home, NEW_DIR, 'subs', 'alice', 'config.json'))).toBe(false)
  })

  // Branch 2: only the post-rename store exists -> untouched.
  it('leaves a current store untouched when there is nothing older', async () => {
    const payload = credential('ntn_current-token')
    await new PerPluginStore(STORE_PLUGIN).save(payload)

    const report = await migrateLegacyStore()

    expect(report.migrated).toEqual([])
    expect(report.kept).toEqual([])
    expect(existsSync(join(home, OLD_DIR))).toBe(false)
    expect(await new PerPluginStore(STORE_PLUGIN).load()).toEqual(payload)
  })

  // Branch 3: both exist -> the current store wins and the old one survives intact.
  it('keeps the current store when a pre-rename store also exists', async () => {
    const current = credential('ntn_current-token')
    const old = credential('ntn_old-token')
    await new PerPluginStore(STORE_PLUGIN).save(current)
    await new PerPluginStore(LEGACY_STORE_PLUGIN).save(old)

    const report = await migrateLegacyStore()

    expect(report.migrated).toEqual([])
    expect(report.kept).toEqual([join(home, NEW_DIR, 'config.json')])
    expect(await new PerPluginStore(STORE_PLUGIN).load()).toEqual(current)
    expect(await new PerPluginStore(LEGACY_STORE_PLUGIN).load()).toEqual(old)
  })

  // Branch 4: an empty old directory is not a migration and must not create the
  // new store (an empty store reported as "configured" is its own bug).
  it('does nothing when the pre-rename directory holds no credential', async () => {
    mkdirSync(join(home, OLD_DIR, 'subs'), { recursive: true })

    const report = await migrateLegacyStore()

    expect(report.migrated).toEqual([])
    expect(report.kept).toEqual([])
    expect(existsSync(join(home, NEW_DIR))).toBe(false)
  })

  // Branch 5a: an unreadable old store is an error, never "not configured".
  it.skipIf(process.platform === 'win32' || process.getuid?.() === 0)(
    'reports an unreadable pre-rename store instead of dropping it',
    async () => {
      const payload = credential()
      await new PerPluginStore(LEGACY_STORE_PLUGIN).save(payload)
      chmodSync(join(home, OLD_DIR), 0o000)
      try {
        const failure = await migrateLegacyStore().catch((error: unknown) => error)

        expect(failure).toBeInstanceOf(StoreMigrationError)
        expect((failure as StoreMigrationError).path).toBe(join(home, OLD_DIR))
        expect((failure as Error).message).toContain(join(home, OLD_DIR))
        expect((failure as Error).message).not.toContain(payload.NOTION_TOKEN)
        expect(existsSync(join(home, NEW_DIR))).toBe(false)
      } finally {
        chmodSync(join(home, OLD_DIR), 0o700)
      }
      // The token is still where it always was: nothing was lost.
      expect(await new PerPluginStore(LEGACY_STORE_PLUGIN).load()).toEqual(payload)
    }
  )

  // Branch 5b (every platform): a file where the store directory belongs is the
  // same class of broken install and gets the same clear failure.
  it('reports a pre-rename store path that is not a directory', async () => {
    writeFileSync(join(home, OLD_DIR), 'not a directory')

    const failure = await migrateLegacyStore().catch((error: unknown) => error)

    expect(failure).toBeInstanceOf(StoreMigrationError)
    expect((failure as StoreMigrationError).path).toBe(join(home, OLD_DIR))
    expect((failure as Error).message).toContain(join(home, OLD_DIR))
    expect(existsSync(join(home, NEW_DIR))).toBe(false)
  })

  it('migrates once per process even when startup paths call it twice', async () => {
    await new PerPluginStore(LEGACY_STORE_PLUGIN).save(credential())

    const [first, second] = await Promise.all([migrateLegacyStore(), migrateLegacyStore()])

    expect(second).toBe(first)
    expect(first.migrated).toHaveLength(1)
  })
})
