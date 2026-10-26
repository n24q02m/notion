/**
 * Credential state for the notion MCP server.
 *
 * The Notion integration token is stored per namespace, mirroring the
 * telegram layout:
 *  - `default` namespace: `~/.better-notion/config.json` (stdio, no-auth,
 *    and token-mode HTTP always resolve to this namespace).
 *  - any other namespace (HTTP multi-user): `~/.better-notion/subs/<ns>/config.json`,
 *    written by `notion auth --user <ns>`.
 *
 * `NOTION_TOKEN` in the environment overrides the `default` namespace only.
 */

import { deleteConfig, PerPluginStore, readConfig, resolveConfig, writeConfig } from '@n24q02m/hull/storage'
import { currentUser } from '@n24q02m/hull/token-auth'

// Storage key for hull's config helpers. Deliberately NOT renamed: hull derives
// the store directory and legacy env overrides from it, so renaming would
// orphan saved credentials.
const SERVER_NAME = 'better-notion-mcp'
// Plugin slug used for the on-disk store directory (~/.better-notion/).
export const STORE_PLUGIN = 'better-notion'
const CREDENTIAL_KEY = 'NOTION_TOKEN'
const REQUIRED_FIELDS = [CREDENTIAL_KEY]
export const DEFAULT_NAMESPACE = 'default'
const NAMESPACE_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/

export const SETUP_HINT =
  'Run "notion auth" on the server to store a Notion integration token (use --user <namespace> for multi-user HTTP).'

export type CredentialState = 'awaiting_setup' | 'configured'

let _state: CredentialState = 'awaiting_setup'
let _defaultToken: string | null = null

export function getState(): CredentialState {
  return _state
}

export function assertNamespace(namespace: string): string {
  if (!NAMESPACE_RE.test(namespace)) {
    throw new Error(
      `Invalid namespace "${namespace}": use letters, digits, "-" or "_" (max 64 chars, must start with a letter or digit).`
    )
  }
  return namespace
}

async function loadNamespaceToken(namespace: string): Promise<string | null> {
  if (namespace === DEFAULT_NAMESPACE) {
    const cfg = await readConfig(SERVER_NAME, STORE_PLUGIN)
    return cfg?.[CREDENTIAL_KEY] || null
  }
  const payload = await new PerPluginStore(STORE_PLUGIN, assertNamespace(namespace)).load()
  const token = payload?.[CREDENTIAL_KEY]
  return typeof token === 'string' && token ? token : null
}

/** Persist a token for `namespace`. Used by `notion auth`. */
export async function saveNamespaceToken(namespace: string, token: string): Promise<void> {
  if (namespace === DEFAULT_NAMESPACE) {
    await writeConfig(SERVER_NAME, { [CREDENTIAL_KEY]: token }, STORE_PLUGIN)
    return
  }
  await new PerPluginStore(STORE_PLUGIN, assertNamespace(namespace)).save({
    [CREDENTIAL_KEY]: token
  })
}

async function clearNamespaceToken(namespace: string): Promise<void> {
  if (namespace === DEFAULT_NAMESPACE) {
    await deleteConfig(SERVER_NAME, STORE_PLUGIN)
    return
  }
  await new PerPluginStore(STORE_PLUGIN, assertNamespace(namespace)).clear()
}

/**
 * Notion token for the CURRENT caller. The namespace comes from hull's
 * request-scoped identity (`currentUser()`); stdio and single-user HTTP
 * resolve to `default`.
 */
export async function getSubjectToken(): Promise<string | null> {
  const namespace = currentUser().namespace
  if (namespace === DEFAULT_NAMESPACE && _defaultToken) return _defaultToken
  return loadNamespaceToken(namespace)
}

/**
 * Resolve the default-namespace token at startup: env first, then the saved
 * config file. Non-default namespaces are resolved per request.
 */
export async function resolveCredentialState(): Promise<CredentialState> {
  const envToken = process.env.NOTION_TOKEN
  if (envToken) {
    _defaultToken = envToken
    _state = 'configured'
    return _state
  }

  try {
    const result = await resolveConfig(SERVER_NAME, REQUIRED_FIELDS)
    if (result.config?.[CREDENTIAL_KEY]) {
      _defaultToken = result.config[CREDENTIAL_KEY]
      _state = 'configured'
      return _state
    }
  } catch {
    // Config file read failure is non-fatal
  }

  _defaultToken = null
  _state = 'awaiting_setup'
  return _state
}

/** Clear the CURRENT caller's stored token and any cached default token. */
export async function resetState(): Promise<void> {
  const namespace = currentUser().namespace
  if (namespace === DEFAULT_NAMESPACE) {
    _defaultToken = null
    _state = 'awaiting_setup'
  }
  await clearNamespaceToken(namespace)
}
