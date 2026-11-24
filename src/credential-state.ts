/**
 * Credential state for the notion MCP server.
 *
 * The Notion integration token is stored per namespace, mirroring the
 * telegram layout:
 *  - `default` namespace: `~/.notion/config.json` (stdio, no-auth,
 *    and token-mode HTTP always resolve to this namespace).
 *  - any other namespace (HTTP multi-user): `~/.notion/subs/<ns>/config.json`,
 *    written by `notion auth --user <ns>`.
 *
 * `NOTION_TOKEN` in the environment overrides the `default` namespace only.
 *
 * The store used to live under the `better-notion` slug (`~/.better-notion/`);
 * src/data-dir-migration.ts copies it forward on startup.
 */

import {
  assertValidAccountAlias,
  deleteConfig,
  NamedAccountRegistry,
  PerPluginStore,
  readConfig,
  writeConfig
} from '@n24q02m/hull/storage'
import { currentUser } from '@n24q02m/hull/token-auth'

// Storage key for hull's config helpers. Deliberately NOT renamed: hull derives
// the store directory and legacy env overrides from it, so renaming would
// orphan saved credentials.
const SERVER_NAME = 'better-notion-mcp'
// Plugin slug used for the on-disk store directory (~/.notion/): the short product
// name, so the path matches the server identity.
export const STORE_PLUGIN = 'notion'

// Slug every release up to 0.4.x passed to hull. It is a migration source only: the
// store under ~/.better-notion/ is re-encrypted into STORE_PLUGIN's store at startup.
export const LEGACY_STORE_PLUGIN = 'better-notion'
const CREDENTIAL_KEY = 'NOTION_TOKEN'
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

function registryFor(namespace: string): NamedAccountRegistry {
  const sub = namespace === DEFAULT_NAMESPACE ? null : assertNamespace(namespace)
  return new NamedAccountRegistry(STORE_PLUGIN, sub)
}

async function loadNamespaceToken(namespace: string, account?: string): Promise<string | null> {
  const requestedAccount = account ?? (process.env.NOTION_ACCOUNT?.trim() || undefined)
  if (requestedAccount !== undefined) {
    assertValidAccountAlias(requestedAccount)
    const rec = await registryFor(namespace).getAccount(requestedAccount)
    const token = rec?.[CREDENTIAL_KEY]
    return typeof token === 'string' && token ? token : null
  }
  const activeRec = await registryFor(namespace).getAccount()
  const activeToken = activeRec?.[CREDENTIAL_KEY]
  if (typeof activeToken === 'string' && activeToken) return activeToken
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

/** List named accounts registered for `namespace` (or current caller). */
export async function listAccounts(
  namespace: string = currentUser().namespace
): Promise<{ active: string | null; accounts: string[] }> {
  const registry = registryFor(namespace)
  const [active, accounts] = await Promise.all([registry.getActiveAccount(), registry.listAccounts()])
  return { active, accounts }
}

/** Persist a named-account token for `namespace` and mark it active. */
export async function saveAccountToken(namespace: string, alias: string, token: string): Promise<void> {
  assertValidAccountAlias(alias)
  await registryFor(namespace).putAccount(alias, { [CREDENTIAL_KEY]: token }, { setActive: true })
  if (namespace === DEFAULT_NAMESPACE) {
    _defaultToken = null
    _state = 'configured'
  }
}

/** Switch the active named account for `namespace` (or current caller). */
export async function switchActiveAccount(alias: string, namespace: string = currentUser().namespace): Promise<void> {
  assertValidAccountAlias(alias)
  await registryFor(namespace).setActive(alias)
  if (namespace === DEFAULT_NAMESPACE) {
    _defaultToken = null
    _state = 'configured'
  }
}

/** Remove a named account for `namespace` (or current caller). */
export async function removeAccount(alias: string, namespace: string = currentUser().namespace): Promise<boolean> {
  assertValidAccountAlias(alias)
  const removed = await registryFor(namespace).removeAccount(alias)
  if (removed && namespace === DEFAULT_NAMESPACE) {
    _defaultToken = null
    await resolveCredentialState()
  }
  return removed
}

async function clearNamespaceToken(namespace: string): Promise<void> {
  const registry = registryFor(namespace)
  for (const alias of await registry.listAccounts()) {
    await registry.removeAccount(alias)
  }
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
export async function getSubjectToken(account?: string): Promise<string | null> {
  const requestedAccount = account ?? (process.env.NOTION_ACCOUNT?.trim() || undefined)
  const namespace = currentUser().namespace
  if (requestedAccount !== undefined) {
    return loadNamespaceToken(namespace, requestedAccount)
  }
  const activeRec = await registryFor(namespace).getAccount()
  const activeToken = activeRec?.[CREDENTIAL_KEY]
  if (typeof activeToken === 'string' && activeToken) return activeToken
  if (namespace === DEFAULT_NAMESPACE && _defaultToken) return _defaultToken
  return loadNamespaceToken(namespace)
}

/**
 * Resolve the default-namespace token at startup: env first, then the saved
 * config file. Non-default namespaces are resolved per request.
 *
 * The saved token is read from the same store `notion auth` writes to
 * (STORE_PLUGIN). hull's resolveConfig cannot be used here: it derives the store
 * from SERVER_NAME, which still points at the pre-rename `better-notion` slug.
 */
export async function resolveCredentialState(): Promise<CredentialState> {
  const envToken = process.env.NOTION_TOKEN
  if (envToken) {
    _defaultToken = envToken
    _state = 'configured'
    return _state
  }

  try {
    const savedToken = await loadNamespaceToken(DEFAULT_NAMESPACE)
    if (savedToken) {
      _defaultToken = savedToken
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
