import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PACKAGE = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8')) as {
  main: string
  files: string[]
  scripts: { build: string }
}

// The config `bun run build` hands to `tsc --build`, or tsconfig.json when it
// names none. Its output lands in build/, which package.json ships to npm.
function buildConfigPath(script = PACKAGE.scripts.build): string {
  const match = /\btsc\s+(?:--build|-build|-b)\b(?:\s+--?[\w-]+)*(?:\s+(\S+\.json))?/.exec(script)
  expect(match, `no tsc --build in the build script: ${script}`).not.toBeNull()
  return resolve(ROOT, match?.[1] ?? 'tsconfig.json')
}

// TypeScript 7 ships no JavaScript compiler API, so ask the compiler itself
// which root files the config resolves to.
function compiledFiles(configPath: string): string[] {
  const tsc = resolve(ROOT, 'node_modules/typescript/bin/tsc')
  const shown = execFileSync(process.execPath, [tsc, '--showConfig', '-p', configPath], {
    cwd: ROOT,
    encoding: 'utf8'
  })
  const { files } = JSON.parse(shown) as { files: string[] }
  return files.map((file) => resolve(ROOT, file))
}

describe('build config', () => {
  it.each([
    ['tsc --build tsconfig.build.json && node scripts/build-cli.js', 'tsconfig.build.json'],
    ['tsc -build tsconfig.build.json', 'tsconfig.build.json'],
    ['tsc -b ./tsconfig.build.json', 'tsconfig.build.json'],
    ['tsc --build --verbose tsconfig.build.json', 'tsconfig.build.json'],
    ['tsc --build && node scripts/build-cli.js', 'tsconfig.json']
  ])('reads the build config from `%s`', (script, config) => {
    expect(buildConfigPath(script)).toBe(resolve(ROOT, config))
  })

  it('ships build/ to npm', () => {
    expect(PACKAGE.files).toContain('build/')
  })

  it('compiles no test file into build/', { timeout: 30_000 }, () => {
    const tests = compiledFiles(buildConfigPath()).filter((file) => /\.test\.ts$/.test(file))
    expect(tests).toEqual([])
  })

  it('still compiles the package entry point', { timeout: 30_000 }, () => {
    const entry = resolve(ROOT, PACKAGE.main.replace(/^build\//, '').replace(/\.js$/, '.ts'))
    expect(compiledFiles(buildConfigPath())).toContain(entry)
  })

  it('builds the Docker image with the same build script', () => {
    const dockerfile = readFileSync(resolve(ROOT, 'Dockerfile'), 'utf8')
    expect(dockerfile).toMatch(/^RUN npm run build$/m)
    expect(dockerfile).not.toMatch(/^RUN .*\btsc\b/m)
  })
})
