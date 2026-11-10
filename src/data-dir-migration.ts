/**
 * One-time forward migration of the credential store across the plugin-slug
 * rename (`better-notion` -> `notion`).
 *
 * Every release so far passed `STORE_PLUGIN = 'better-notion'` to hull, so the
 * encrypted blob lives in `~/.better-notion/`. The slug is now the short product
 * name, which means hull reads and writes `~/.notion/`; its own read-only
 * fallbacks still cover `~/.notion-mcp/` and the older
 * `~/.better-notion-mcp/`, but the immediately-previous layout
 * (`~/.better-notion/`) would stop being read and an existing install would look
 * unconfigured.
 *
 * This module copies that layout forward once per process, before the first
 * credential read:
 *
 *  - a blob is only written when the current store still has nothing for that
 *    namespace, so a store already living under the new name always wins and is
 *    never replaced;
 *  - the payload is decrypted and re-encrypted through hull for the new slug.
 *    A plain directory rename would be wrong: hull derives the multi-user
 *    scrypt salt from `<keyPlugin>:<sub>`, so blobs written under
 *    `better-notion:<ns>` would stay undecryptable under `notion:<ns>`
 *    (the default namespace would survive a rename, per-user ones would not);
 *  - every write is read back and compared before the run reports success, and
 *    the legacy directory is only ever read, never modified or removed, so a
 *    failed migration cannot lose data;
 *  - an unreadable legacy directory (bad permissions, a file where the store
 *    directory should be) raises `StoreMigrationError` instead of being treated
 *    as "not configured", which would silently drop the user's token.
 *
 * Per-user namespaces are only migrated while `CREDENTIAL_SECRET` is set,
 * because that is the only process that can decrypt and re-encrypt them. An
 * HTTP deployment migrates its namespaces on its next start; a stdio run leaves
 * them alone and never touches their key material.
 */

import { type Dirent, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { credPath, dataDirCandidates, PerPluginStore } from '@n24q02m/hull/storage'
import { LEGACY_STORE_PLUGIN, STORE_PLUGIN } from './credential-state.js'

/** One namespace copied out of the pre-rename store. */
export interface MigratedBlob {
  /** Legacy directory the payload was read from. */
  source: string
  /** Multi-user namespace; `null` for the default namespace's blob. */
  sub: string | null
}

/** What a migration run did, or deliberately did not do. */
export interface MigrationReport {
  /** Namespaces re-encrypted into the current store by this run. */
  migrated: MigratedBlob[]
  /** Current-store paths left untouched because they already hold that namespace. */
  kept: string[]
  /** Multi-user namespaces deferred to a process that has `CREDENTIAL_SECRET`. */
  deferred: string[]
}

/**
 * A legacy store that cannot be read, or a migrated blob that cannot be written
 * or read back. The message names the paths and never the token value.
 */
export class StoreMigrationError extends Error {
  constructor(
    readonly path: string,
    message: string
  ) {
    super(message)
    this.name = 'StoreMigrationError'
  }
}

// Same alphabet hull accepts for a plugin/namespace path component, so a stray
// directory (`.DS_Store`, an editor swap dir) is never mistaken for a namespace.
const SAFE_SUB = /^[A-Za-z0-9._-]+$/

function errorCode(error: unknown): string {
  return (error as NodeJS.ErrnoException)?.code ?? 'unknown error'
}

/**
 * Whether `dir` exists and can be listed. A directory that exists but cannot be
 * read is reported, not skipped: skipping it would silently look like "no saved
 * token" and invite the user to overwrite state that is still there.
 */
function legacyDirExists(dir: string): boolean {
  try {
    readdirSync(dir)
    return true
  } catch (error) {
    const code = errorCode(error)
    if (code === 'ENOENT') return false
    throw new StoreMigrationError(
      dir,
      `Cannot read the previous credential directory ${dir} (${code}). Fix its permissions or move it aside, then start again: nothing was migrated and no credential was changed.`
    )
  }
}

/** Multi-user namespaces present in one legacy directory. */
function legacySubs(root: string): string[] {
  const subsDir = join(root, 'subs')
  let entries: Dirent[]
  try {
    entries = readdirSync(subsDir, { withFileTypes: true })
  } catch (error) {
    const code = errorCode(error)
    if (code === 'ENOENT') return []
    throw new StoreMigrationError(
      subsDir,
      `Cannot read the previous credential directory ${subsDir} (${code}). Fix its permissions or move it aside, then start again: nothing was migrated and no credential was changed.`
    )
  }
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== '.' && entry.name !== '..' && SAFE_SUB.test(entry.name))
    .map((entry) => entry.name)
}

/** First legacy directory holding a blob for `sub`, in the order hull reads them. */
function legacySource(sub: string | null): string | null {
  for (const { dir: root } of dataDirCandidates(LEGACY_STORE_PLUGIN)) {
    const blob = sub === null ? join(root, 'config.json') : join(root, 'subs', sub, 'config.json')
    if (existsSync(blob)) return root
  }
  return null
}

/** Copy one namespace forward, unless the current store already owns it. */
async function migrateBlob(sub: string | null, source: string, report: MigrationReport): Promise<void> {
  const target = credPath(STORE_PLUGIN, sub)
  if (existsSync(target)) {
    report.kept.push(target)
    return
  }
  if (sub !== null && !process.env.CREDENTIAL_SECRET) {
    report.deferred.push(sub)
    return
  }

  let payload: Record<string, unknown> | null
  try {
    payload = await new PerPluginStore(LEGACY_STORE_PLUGIN, sub).load()
  } catch (error) {
    throw new StoreMigrationError(
      source,
      `Cannot read the saved credential in ${source} (${errorCode(error)}). Nothing was migrated and the previous store was left untouched.`
    )
  }
  // Nothing saved for this namespace (or hull already reported it as corrupt).
  if (payload === null) return

  const store = new PerPluginStore(STORE_PLUGIN, sub)
  try {
    await store.save(payload)
  } catch (error) {
    throw new StoreMigrationError(
      target,
      `Cannot write the migrated credential to ${target} (${errorCode(error)}). The previous store in ${source} was left untouched.`
    )
  }

  let readBack: Record<string, unknown> | null = null
  try {
    readBack = await store.load()
  } catch {
    readBack = null
  }
  if (!isDeepStrictEqual(readBack, payload)) {
    throw new StoreMigrationError(
      target,
      `Wrote ${target} but reading it back did not return the migrated credential. The previous store in ${source} was left untouched.`
    )
  }

  report.migrated.push({ source, sub })
}

async function runMigration(): Promise<MigrationReport> {
  const report: MigrationReport = { migrated: [], kept: [], deferred: [] }

  const present = dataDirCandidates(LEGACY_STORE_PLUGIN)
    .map((location) => location.dir)
    .filter((root) => legacyDirExists(root))
  if (present.length === 0) return report

  const subs = new Set<string>()
  for (const root of present) {
    for (const sub of legacySubs(root)) subs.add(sub)
  }

  const single = legacySource(null)
  if (single !== null) await migrateBlob(null, single, report)

  for (const sub of [...subs].sort()) {
    const source = legacySource(sub)
    if (source !== null) await migrateBlob(sub, source, report)
  }

  return report
}

let inFlight: Promise<MigrationReport> | null = null

/**
 * Migrate the pre-rename credential store, at most once per process.
 *
 * Idempotent by construction (the current store wins per namespace), and the
 * single flight also keeps two concurrent startup paths from writing the same
 * blob twice. A failure is returned to every later caller unchanged: the same
 * unreadable directory stays unreadable for the life of the process.
 */
export function migrateLegacyStore(): Promise<MigrationReport> {
  inFlight ??= runMigration()
  return inFlight
}

/** Forget the single-flight result so a test can run the migration again. */
export function resetStoreMigrationForTesting(): void {
  inFlight = null
}
