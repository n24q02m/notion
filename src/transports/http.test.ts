import { describe, expect, it } from 'vitest'
import { buildAuthConfig } from './http.js'

const HASH_STUB = 'scrypt$stub-hash-for-tests'

describe('buildAuthConfig', () => {
  it('defaults to multi mode with the hull default users file', () => {
    expect(buildAuthConfig({})).toEqual({ mode: 'multi', usersFile: undefined })
  })

  it('passes MCP_USERS_FILE through in multi mode', () => {
    expect(buildAuthConfig({ MCP_AUTH_MODE: 'multi', MCP_USERS_FILE: '/etc/notion/users.toml' })).toEqual({
      mode: 'multi',
      usersFile: '/etc/notion/users.toml'
    })
  })

  it('maps token mode with hash and rpm', () => {
    expect(buildAuthConfig({ MCP_AUTH_MODE: 'token', MCP_AUTH_TOKEN_HASH: HASH_STUB, MCP_RPM: '60' })).toEqual({
      mode: 'token',
      tokenHash: HASH_STUB,
      rpm: 60
    })
  })

  it('leaves rpm null in token mode when MCP_RPM is unset', () => {
    expect(buildAuthConfig({ MCP_AUTH_MODE: 'token', MCP_AUTH_TOKEN_HASH: HASH_STUB })).toEqual({
      mode: 'token',
      tokenHash: HASH_STUB,
      rpm: null
    })
  })

  it('requires MCP_AUTH_TOKEN_HASH in token mode', () => {
    expect(() => buildAuthConfig({ MCP_AUTH_MODE: 'token' })).toThrow(/MCP_AUTH_TOKEN_HASH/)
  })

  it('maps no-auth mode', () => {
    expect(buildAuthConfig({ MCP_AUTH_MODE: 'no-auth' })).toEqual({ mode: 'no-auth' })
  })

  it('rejects an unknown MCP_AUTH_MODE', () => {
    expect(() => buildAuthConfig({ MCP_AUTH_MODE: 'oauth' })).toThrow(/Unknown MCP_AUTH_MODE "oauth"/)
  })
})
