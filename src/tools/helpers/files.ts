/**
 * MCP `io.modelcontextprotocol/files` payload helper with older-client fallback.
 *
 * Uses `buildFilePayload` from `@n24q02m/hull/extensions` when clients advertise
 * the `io.modelcontextprotocol/files` capability, while preserving plain text
 * and `structuredContent` responses for older clients.
 */

import { CLIENT_CAPABILITIES_META_KEY, type Server, type ServerContext } from '@modelcontextprotocol/server'
import { buildFilePayload, FILES_EXTENSION_ID, type FilePayload } from '@n24q02m/hull/extensions'
import { isJsonObject } from '../../json-value.js'

const MAX_ECHO_BINARY_BYTES = 256 * 1024

function hasFilesExtension(capabilities: unknown): boolean {
  if (!isJsonObject(capabilities)) return false
  const extensions = isJsonObject(capabilities.extensions) ? capabilities.extensions : undefined
  if (extensions && FILES_EXTENSION_ID in extensions) return true
  const experimental = isJsonObject(capabilities.experimental) ? capabilities.experimental : undefined
  return Boolean(experimental && FILES_EXTENSION_ID in experimental)
}

/**
 * Determine whether the connected client declared support for `io.modelcontextprotocol/files`
 * via the 2026-07-28 `_meta` capability envelope or 2025 initialize capabilities.
 */
export function clientSupportsFilesExtension(
  ctx?: ServerContext,
  server?: Pick<Server, 'getClientCapabilities'>
): boolean {
  const envelope = ctx?.mcpReq?.envelope
  if (isJsonObject(envelope) && hasFilesExtension(envelope[CLIENT_CAPABILITIES_META_KEY])) {
    return true
  }
  return hasFilesExtension(server?.getClientCapabilities?.())
}

function safeIdSegment(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback
}

/**
 * Build an `io.modelcontextprotocol/files` payload for Notion file/block transfer results.
 * Returns `null` when the tool/action does not produce a file or block transfer payload.
 */
export function buildToolFilePayload(
  toolName: string,
  args: Record<string, unknown>,
  result: unknown
): FilePayload | null {
  if (!isJsonObject(result)) return null
  const action = typeof args.action === 'string' ? args.action : typeof result.action === 'string' ? result.action : ''

  switch (toolName) {
    case 'pages': {
      if (action === 'get' && typeof result.content === 'string') {
        const pageId = safeIdSegment(result.page_id ?? args.page_id, 'page')
        const uri =
          typeof result.url === 'string' && result.url.trim().length > 0
            ? result.url
            : `notion://pages/${encodeURIComponent(pageId)}.md`
        return buildFilePayload(result.content, `${pageId}.md`, {
          mimeType: 'text/markdown',
          uri
        })
      }
      return null
    }

    case 'blocks': {
      const blockId = safeIdSegment(result.block_id ?? args.block_id, 'block')
      if (action === 'children' && typeof result.markdown === 'string') {
        return buildFilePayload(result.markdown, `${blockId}.md`, {
          mimeType: 'text/markdown',
          uri: `notion://blocks/${encodeURIComponent(blockId)}.md`
        })
      }
      if (action === 'get' && result.block !== undefined) {
        return buildFilePayload(JSON.stringify(result.block, null, 2), `${blockId}.json`, {
          mimeType: 'application/json',
          uri: `notion://blocks/${encodeURIComponent(blockId)}.json`
        })
      }
      return null
    }

    case 'content_convert': {
      if (result.direction === 'blocks-to-markdown' && typeof result.markdown === 'string') {
        return buildFilePayload(result.markdown, 'content.md', {
          mimeType: 'text/markdown'
        })
      }
      return null
    }

    case 'file_uploads': {
      const uploadId = safeIdSegment(result.file_upload_id ?? args.file_upload_id, 'upload')
      const uri = `notion://file_uploads/${encodeURIComponent(uploadId)}`
      if (action === 'send' && typeof args.file_content === 'string') {
        const bytes = Buffer.from(args.file_content, 'base64')
        const filename = safeIdSegment(args.filename ?? result.filename, `${uploadId}.bin`)
        const mimeType =
          typeof args.content_type === 'string' && args.content_type.trim().length > 0
            ? args.content_type
            : 'application/octet-stream'
        if (bytes.byteLength <= MAX_ECHO_BINARY_BYTES) {
          return buildFilePayload(bytes, filename, { mimeType, uri })
        }
      }
      if (action === 'retrieve' || action === 'create' || action === 'send') {
        const name = safeIdSegment(result.filename ?? args.filename, `${uploadId}.json`)
        return buildFilePayload(JSON.stringify(result, null, 2), name, {
          mimeType: 'application/json',
          uri
        })
      }
      return null
    }

    default:
      return null
  }
}

/**
 * Attach `io.modelcontextprotocol/files` payload metadata when the client advertised
 * support; older clients receive the base text/structured result unchanged.
 */
export function attachFilesExtensionMeta<T extends Record<string, unknown>>(
  callResult: T,
  filePayload: FilePayload | null,
  supportsFiles: boolean
): T {
  if (!supportsFiles || !filePayload) {
    return callResult
  }
  const existingMeta = isJsonObject(callResult._meta) ? callResult._meta : {}
  return {
    ...callResult,
    _meta: {
      ...existingMeta,
      [FILES_EXTENSION_ID]: [filePayload]
    }
  }
}
