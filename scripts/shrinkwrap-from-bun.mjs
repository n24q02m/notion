#!/usr/bin/env node
// Write npm-shrinkwrap.json for the published tarball from the tested bun.lock tree.
//
// npm ignores bun.lock, so without a shrinkwrap every `npm install -g` of this
// package re-resolves the dependency ranges against today's registry, which is
// not the tree CI tested. This script pins the published tree to bun.lock:
//   1. In a scratch dir, install exactly bun.lock (hoisted, every os/cpu, no
//      lifecycle scripts), so node_modules holds the tested versions.
//   2. Let npm describe that node_modules as a v3 lockfile.
//   3. Fill resolved/integrity from bun.lock and fail on any non-dev package
//      whose name@version or integrity is not in bun.lock.
// Dev-only entries for targets bun never installs (e.g. wasm32 bindings) can
// drift; they are never installed for a consumer, so they are only reported.
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const REGISTRY = 'https://registry.npmjs.org'
const root = resolve(process.argv[2] ?? '.')

function run(cmd, cwd) {
  const res = spawnSync(cmd, { cwd, shell: true, stdio: 'inherit' })
  if (res.status !== 0) throw new Error(`${cmd} exited ${res.status}`)
}

function readBunLock(path) {
  // bun.lock is JSONC with trailing commas.
  const text = readFileSync(path, 'utf8').replace(/,(\s*[}\]])/g, '$1')
  const byKey = new Map()
  for (const entry of Object.values(JSON.parse(text).packages)) {
    const [spec, registry, , integrity] = entry
    const at = spec.lastIndexOf('@')
    const name = spec.slice(0, at)
    const version = spec.slice(at + 1)
    if (registry !== '' || typeof integrity !== 'string') {
      throw new Error(`bun.lock entry ${spec} is not a default-registry tarball`)
    }
    byKey.set(`${name}@${version}`, integrity)
  }
  return byKey
}

function tarballUrl(name, version) {
  const base = name.startsWith('@') ? name.split('/')[1] : name
  return `${REGISTRY}/${name}/-/${base}-${version}.tgz`
}

const bun = readBunLock(join(root, 'bun.lock'))
const scratch = mkdtempSync(join(tmpdir(), 'shrinkwrap-'))
try {
  for (const f of ['package.json', 'bun.lock']) copyFileSync(join(root, f), join(scratch, f))
  run('bun install --frozen-lockfile --ignore-scripts --linker=hoisted --os=* --cpu=*', scratch)
  run('npm install --package-lock-only --ignore-scripts --no-audit --no-fund', scratch)
  const lock = JSON.parse(readFileSync(join(scratch, 'package-lock.json'), 'utf8'))

  const errors = []
  const devDrift = []
  let prod = 0
  for (const [path, meta] of Object.entries(lock.packages)) {
    if (path === '' || meta.link) continue
    const name = path.slice(path.lastIndexOf('node_modules/') + 'node_modules/'.length)
    const key = `${name}@${meta.version}`
    const integrity = bun.get(key)
    if (integrity === undefined || (meta.integrity && meta.integrity !== integrity)) {
      ;(meta.dev ? devDrift : errors).push(key)
      continue
    }
    meta.resolved = tarballUrl(name, meta.version)
    meta.integrity = integrity
    if (!meta.dev) prod += 1
  }
  for (const key of devDrift) console.log(`dev-only entry not in bun.lock (not installed for consumers): ${key}`)
  if (errors.length > 0) {
    throw new Error(`runtime packages not pinned by bun.lock: ${errors.join(', ')}`)
  }
  writeFileSync(join(root, 'npm-shrinkwrap.json'), `${JSON.stringify(lock, null, 2)}\n`)
  console.log(`npm-shrinkwrap.json: ${prod} runtime packages pinned to bun.lock`)
} finally {
  rmSync(scratch, { recursive: true, force: true })
}
