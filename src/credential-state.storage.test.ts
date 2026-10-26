/**
 * Real (unmocked) multi-user credential storage. Uses hull's PerPluginStore
 * against a temp home so the encrypted per-namespace blob is written and read
 * from disk exactly as `notion auth --user` and the HTTP multi mode do.
 */
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setHomeDirForTesting } from '@n24q02m/hull/storage'
import { type AuthContext, localAuthContext, runWithAuthContext } from '@n24q02m/hull/token-auth'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getSubjectToken, STORE_PLUGIN, saveNamespaceToken } from './credential-state.js'

const FIXTURE_MASTER = 'credential-state-storage-fixture-master'
const FIXTURE_ALICE_TOKEN = 'fixture-notion-integration-value-alice'

function callerAs(namespace: string): AuthContext {
  return { uid: namespace, namespace, mode: 'multi', allowedRoots: [], rpm: null, disabled: false, attributes: {} }
}

describe('multi-user credential storage (real PerPluginStore)', () => {
  let home: string
  let previousSecret: string | undefined
  let previousNotionToken: string | undefined

  beforeAll(async () => {
    home = await mkdtemp(join(tmpdir(), 'notion-cred-storage-'))
    setHomeDirForTesting(home)
    previousSecret = process.env.CREDENTIAL_SECRET
    previousNotionToken = process.env.NOTION_TOKEN
    process.env.CREDENTIAL_SECRET = FIXTURE_MASTER
    delete process.env.NOTION_TOKEN
  })

  afterAll(async () => {
    setHomeDirForTesting(null)
    if (previousSecret === undefined) delete process.env.CREDENTIAL_SECRET
    else process.env.CREDENTIAL_SECRET = previousSecret
    if (previousNotionToken === undefined) delete process.env.NOTION_TOKEN
    else process.env.NOTION_TOKEN = previousNotionToken
    await rm(home, { recursive: true, force: true })
  })

  it('writes an encrypted blob under subs/alice and reads it back for alice only', async () => {
    await saveNamespaceToken('alice', FIXTURE_ALICE_TOKEN)

    const aliceFile = join(home, `.${STORE_PLUGIN}`, 'subs', 'alice', 'config.json')
    expect(existsSync(aliceFile)).toBe(true)

    const raw = await readFile(aliceFile, 'utf-8')
    expect(raw).not.toContain(FIXTURE_ALICE_TOKEN)

    const aliceToken = await runWithAuthContext(callerAs('alice'), () => getSubjectToken())
    expect(aliceToken).toBe(FIXTURE_ALICE_TOKEN)
  })

  it('reads null for bob and default, and creates no file for bob', async () => {
    const bobToken = await runWithAuthContext(callerAs('bob'), () => getSubjectToken())
    expect(bobToken).toBeNull()
    expect(existsSync(join(home, `.${STORE_PLUGIN}`, 'subs', 'bob', 'config.json'))).toBe(false)

    const defaultToken = await runWithAuthContext(localAuthContext(), () => getSubjectToken())
    expect(defaultToken).toBeNull()
  })
})
