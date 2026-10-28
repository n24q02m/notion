/**
 * Config Tool
 * Manage credential state and configuration lifecycle.
 * Does NOT require a Notion client -- works independently.
 */

import {
  type CredentialState,
  getState,
  getSubjectToken,
  resetState,
  resolveCredentialState,
  SETUP_HINT
} from '../../credential-state.js'
import { NotionMCPError, withErrorHandling } from '../helpers/errors.js'

export interface ConfigInput {
  action: 'status' | 'setup_status' | 'setup_start' | 'setup_reset' | 'setup_complete' | 'set' | 'cache_clear'
  force?: boolean
  key?: string
  value?: string
}

/**
 * Credential state for the CURRENT caller. The process-global `getState()`
 * only tracks the default namespace, so multi-user HTTP derives state from
 * the caller's own token instead.
 */
function stateFor(token: string | null): CredentialState {
  return token !== null ? 'configured' : 'awaiting_setup'
}

/**
 * Credential/setup-focused fields shared by `status` (kept for backward
 * compatibility -- it has always returned exactly this shape) and the
 * dedicated `setup_status` action (parity with the credential-state-only
 * action every other server in the stack exposes, e.g. wet/mnemo/telegram
 * `config(action="setup_status")`).
 */
async function buildSetupStatusInfo() {
  const token = await getSubjectToken()
  return {
    state: stateFor(token),
    has_token: token !== null,
    token_source: token ? (process.env.NOTION_TOKEN ? 'environment' : 'config') : null
  }
}

/**
 * Manage server configuration and credential state
 */
export async function config(input: ConfigInput): Promise<any> {
  return withErrorHandling(async () => {
    switch (input.action) {
      case 'status': {
        return { action: 'status', ...(await buildSetupStatusInfo()) }
      }

      case 'setup_status': {
        return { action: 'setup_status', ...(await buildSetupStatusInfo()) }
      }

      case 'setup_start': {
        return {
          action: 'setup_start',
          state: stateFor(await getSubjectToken()),
          message: SETUP_HINT
        }
      }

      case 'setup_reset': {
        if (!input.force) {
          throw new NotionMCPError(
            'setup_reset clears stored credentials and requires confirmation.',
            'VALIDATION_ERROR',
            'Pass force: true to confirm credential reset.'
          )
        }
        await resetState()
        return {
          action: 'setup_reset',
          state: getState(),
          message: 'Credential state reset. Stored token cleared. Use "notion auth" to store a new token.'
        }
      }

      case 'setup_complete': {
        await resolveCredentialState()
        const token = await getSubjectToken()
        const newState = stateFor(token)
        return {
          action: 'setup_complete',
          state: newState,
          has_token: token !== null,
          message:
            newState === 'configured'
              ? 'Credentials verified. Notion tools are ready.'
              : `No credentials found. ${SETUP_HINT}`
        }
      }

      case 'set': {
        return {
          action: 'set',
          ok: false,
          error: 'Notion has no mutable runtime settings. To update your token, use setup_reset then "notion auth".'
        }
      }

      case 'cache_clear': {
        return {
          action: 'cache_clear',
          ok: true,
          cleared: 0,
          message: 'No client-side cache to clear. Notion API responses are not cached.'
        }
      }

      default:
        throw new NotionMCPError(
          `Unsupported action: ${(input as any).action}`,
          'VALIDATION_ERROR',
          'Valid actions: status, setup_status, setup_start, setup_reset, setup_complete, set, cache_clear'
        )
    }
  })()
}
