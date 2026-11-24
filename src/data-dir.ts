/**
 * Data directory for this server, chosen the way the telegram server chooses
 * its own: a single resolver, one base directory, an env override, and a guard
 * that a hostile value cannot walk out of the base.
 *
 * Notion state is hull's per-plugin credential store, so the base is hull's
 * home directory and the store lands in `<base>/.n24q02m/notion/` (`config.json`
 * for the default namespace, `profiles/<profile>/config.json` for named
 * profiles, `subs/<ns>/config.json` for the others). The directory name is
 * `dataDirName(STORE_PLUGIN)` from `@n24q02m/hull/storage`; a test pins the two
 * together. Stores written by earlier releases under `~/.notion/` or
 * `~/.better-notion/` are copied forward once at startup (see
 * src/data-dir-migration.ts).
 *
 * `NOTION_DATA_DIR` replaces the base outright, so a container can mount a
 * single volume: `-e NOTION_DATA_DIR=/data` -> `/data/.n24q02m/notion/config.json`.
 *
 * Guard: a RELATIVE value is resolved against `$HOME` and must stay inside it,
 * so `..`, `../..`, `..\\..` and NUL bytes cannot leave the base. An ABSOLUTE
 * value is an explicit operator choice (a mounted volume) and is normalized and
 * taken as-is. Empty or whitespace-only means "use the default", because plugin
 * manifests set unset env vars to `""`.
 */

import { homedir } from 'node:os'
import { isAbsolute, join, resolve, sep } from 'node:path'
// hull derives the store directory from one process-wide home; it exposes that
// override only under this name (there is no production alias in 0.4.x).
import { dataDirName, setHomeDirForTesting as overrideHullHomeDir } from '@n24q02m/hull/storage'
import { STORE_PLUGIN } from './credential-state.js'
import { type MigrationReport, migrateLegacyStore } from './data-dir-migration.js'

/** Env var that replaces the base directory. */
export const DATA_DIR_ENV = 'NOTION_DATA_DIR'

/** Directory name this server owns under the base (hull's `.n24q02m/<STORE_PLUGIN>`). */
export const DATA_DIR_NAME = dataDirName(STORE_PLUGIN)

/** A `DATA_DIR` value that would leave the base directory. */
export class DataDirEscapeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DataDirEscapeError'
  }
}

/**
 * Absolute base directory this server's state lives under: `NOTION_DATA_DIR`
 * when set, else the home directory.
 */
export function resolveBaseDir(env: NodeJS.ProcessEnv = process.env, home: string = homedir()): string {
  const base = resolve(home)
  const raw = env[DATA_DIR_ENV]?.trim()
  if (!raw) return base

  if (raw.includes('\0')) {
    throw new DataDirEscapeError(`${DATA_DIR_ENV} must not contain a NUL byte`)
  }

  if (isAbsolute(raw)) return resolve(raw)

  const target = resolve(base, raw)
  if (target !== base && !target.startsWith(base + sep)) {
    throw new DataDirEscapeError(
      `${DATA_DIR_ENV}="${raw}" escapes the base directory ${base}; use an absolute path to choose another directory`
    )
  }
  return target
}

/** Absolute directory holding this server's credential store. */
export function resolveDataDir(env: NodeJS.ProcessEnv = process.env, home: string = homedir()): string {
  if (env[DATA_DIR_ENV]?.trim()) {
    return join(resolveBaseDir(env, home), DATA_DIR_NAME)
  }
  const n24Home = env.N24Q02M_HOME?.trim()
  if (n24Home) {
    return join(resolve(n24Home), STORE_PLUGIN)
  }
  const useXdg = env.N24Q02M_USE_XDG?.trim().toLowerCase()
  if (useXdg === '1' || useXdg === 'true' || useXdg === 'yes') {
    const xdg = env.XDG_CONFIG_HOME?.trim() || env.APPDATA?.trim()
    if (xdg) return join(resolve(xdg), 'n24q02m', STORE_PLUGIN)
  }
  return join(resolve(home), DATA_DIR_NAME)
}

/**
 * Point hull's store at `NOTION_DATA_DIR`, once per process, before any
 * credential read or write. Returns the base directory in force, or null when
 * no override is set (nothing is touched, so the default stays dynamic).
 *
 * hull derives the encrypted blob, the machine key that decrypts it, and the
 * legacy fallback directories from ONE home directory (`dataDir()`,
 * `getHomeDir()`). Moving only the blob's base -- the `LocalFsBackend` seam --
 * would leave the key behind, so a blob written under the override could not be
 * decrypted on the next run. The home override is therefore the only correct
 * seam, and it is the same all-or-nothing behaviour as telegram's
 * `TELEGRAM_DATA_DIR`, which also bypasses the legacy directory handling.
 */
export function applyDataDirOverride(env: NodeJS.ProcessEnv = process.env): string | null {
  if (!env[DATA_DIR_ENV]?.trim()) return null
  const base = resolveBaseDir(env)
  overrideHullHomeDir(base)
  return base
}

/**
 * Prepare the store before the first credential read: put `NOTION_DATA_DIR` in
 * force (so hull's home is the base this process writes under) and copy a
 * pre-rename store forward. Both steps are process-wide and idempotent.
 */
export async function prepareDataDir(env: NodeJS.ProcessEnv = process.env): Promise<MigrationReport> {
  applyDataDirOverride(env)
  return migrateLegacyStore()
}
