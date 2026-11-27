/**
 * MCP Elicitation helper for sensitive Notion operations.
 *
 * Uses `elicitWithFallback` from `@n24q02m/hull/extensions` to support:
 * - MCP 2026-07-28 multi-round-trip elicitation (`inputRequired`)
 * - Legacy MCP 2025-11-25 push elicitation (`ctx.mcpReq.elicitInput`)
 * - Headless / non-eliciting clients and CLI calls (default confirmation fallback)
 */

import type { InputRequiredResult, ServerContext } from '@modelcontextprotocol/server'
import { elicitWithFallback } from '@n24q02m/hull/extensions'
import { z } from 'zod'

const ConfirmSchema = z.object({
  confirm: z.boolean().describe('Set to true to proceed with this Notion operation')
})

type ConfirmData = z.infer<typeof ConfirmSchema>

const CONFIRM_REQUESTED_SCHEMA = {
  type: 'object' as const,
  properties: {
    confirm: {
      type: 'boolean' as const,
      title: 'Confirm operation',
      description: 'Confirm proceeding with this sensitive Notion operation',
      default: true
    }
  },
  required: ['confirm']
}

interface SensitiveOperationDescriptor {
  key: string
  message: string
}

export type SensitiveCheckResult =
  | { status: 'proceed'; source: 'not_sensitive' | 'headless' | 'mrtr' | 'legacy' | 'fallback' }
  | { status: 'cancelled'; reason: 'declined' | 'cancelled' }
  | { status: 'input_required'; result: InputRequiredResult }

function describeSensitiveOperation(
  toolName: string,
  args: Record<string, unknown>
): SensitiveOperationDescriptor | null {
  const action = typeof args.action === 'string' ? args.action : ''

  switch (toolName) {
    case 'pages':
      if (action === 'archive') {
        return {
          key: 'confirm_pages_archive',
          message: 'Confirm archiving the specified Notion page(s).'
        }
      }
      if (action === 'update' && (args.archived === true || args.replace === true)) {
        return {
          key: 'confirm_pages_destructive_update',
          message: 'Confirm destructive Notion page update (replacing all content or archiving page).'
        }
      }
      return null

    case 'blocks':
      if (action === 'delete') {
        return {
          key: 'confirm_blocks_delete',
          message: 'Confirm deleting the specified Notion block.'
        }
      }
      return null

    case 'databases':
      if (action === 'delete_page') {
        return {
          key: 'confirm_databases_delete_page',
          message: 'Confirm deleting (archiving) the specified Notion database page(s).'
        }
      }
      return null

    case 'config':
      if (action === 'setup_reset') {
        return {
          key: 'confirm_config_setup_reset',
          message: 'Confirm resetting stored Notion credentials on this server.'
        }
      }
      if (action === 'account_remove') {
        return {
          key: 'confirm_config_account_remove',
          message: 'Confirm removing the specified stored Notion account alias.'
        }
      }
      return null

    default:
      return null
  }
}

/**
 * Prompt for user confirmation on sensitive Notion operations when running inside
 * an MCP request context that supports elicitation, with automatic fallback for
 * CLI invocations and headless/non-eliciting clients.
 */
export async function checkSensitiveOperation(
  toolName: string,
  args: Record<string, unknown>,
  ctx?: ServerContext
): Promise<SensitiveCheckResult> {
  const descriptor = describeSensitiveOperation(toolName, args)
  if (!descriptor) {
    return { status: 'proceed', source: 'not_sensitive' }
  }

  // CLI and direct programmatic calls have no MCP ServerContext; proceed directly.
  if (!ctx?.mcpReq) {
    return { status: 'proceed', source: 'headless' }
  }

  const outcome = await elicitWithFallback<ConfirmData>(ctx, {
    key: descriptor.key,
    message: descriptor.message,
    requestedSchema: CONFIRM_REQUESTED_SCHEMA,
    schema: ConfirmSchema,
    defaultValue: { confirm: true }
  })

  switch (outcome.status) {
    case 'input_required':
      return { status: 'input_required', result: outcome.result }
    case 'declined':
      return { status: 'cancelled', reason: 'declined' }
    case 'cancelled':
      return { status: 'cancelled', reason: 'cancelled' }
    case 'accepted':
      return outcome.data.confirm === false
        ? { status: 'cancelled', reason: 'declined' }
        : { status: 'proceed', source: outcome.source }
    case 'fallback':
      return outcome.data.confirm === false
        ? { status: 'cancelled', reason: 'declined' }
        : { status: 'proceed', source: 'fallback' }
  }
}
