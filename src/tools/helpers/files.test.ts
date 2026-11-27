import { CLIENT_CAPABILITIES_META_KEY, type ServerContext } from '@modelcontextprotocol/server'
import { FILES_EXTENSION_ID } from '@n24q02m/hull/extensions'
import { describe, expect, it } from 'vitest'
import { attachFilesExtensionMeta, buildToolFilePayload, clientSupportsFilesExtension } from './files.js'

describe('clientSupportsFilesExtension', () => {
  it('returns true when client declares files capability in 2026-07-28 envelope metadata', () => {
    const ctx = {
      mcpReq: {
        envelope: {
          [CLIENT_CAPABILITIES_META_KEY]: {
            extensions: { [FILES_EXTENSION_ID]: {} }
          }
        }
      }
    } as unknown as ServerContext
    expect(clientSupportsFilesExtension(ctx)).toBe(true)

    const experimentalCtx = {
      mcpReq: {
        envelope: {
          [CLIENT_CAPABILITIES_META_KEY]: {
            experimental: { [FILES_EXTENSION_ID]: {} }
          }
        }
      }
    } as unknown as ServerContext
    expect(clientSupportsFilesExtension(experimentalCtx)).toBe(true)
  })

  it('falls back to server.getClientCapabilities for 2025 clients', () => {
    expect(
      clientSupportsFilesExtension(undefined, {
        getClientCapabilities: () => ({ extensions: { [FILES_EXTENSION_ID]: {} } })
      })
    ).toBe(true)
    expect(
      clientSupportsFilesExtension(undefined, {
        getClientCapabilities: () => ({ experimental: { [FILES_EXTENSION_ID]: {} } })
      })
    ).toBe(true)
    expect(
      clientSupportsFilesExtension(undefined, {
        getClientCapabilities: () => ({})
      })
    ).toBe(false)
    expect(clientSupportsFilesExtension(undefined, undefined)).toBe(false)
  })
})

describe('buildToolFilePayload', () => {
  it('returns null for non-object results and non-file tools', () => {
    expect(buildToolFilePayload('pages', { action: 'get' }, null)).toBeNull()
    expect(buildToolFilePayload('help', { tool: 'pages' }, { help: true })).toBeNull()
    expect(buildToolFilePayload('pages', { action: 'create' }, { page_id: 'p1' })).toBeNull()
  })

  it('builds markdown payload for pages.get with url or fallback notion URI', () => {
    const withUrl = buildToolFilePayload(
      'pages',
      { action: 'get', page_id: 'page-1' },
      { page_id: 'page-1', url: 'https://notion.so/page-1', content: '# Hello' }
    )
    expect(withUrl).toMatchObject({
      name: 'page-1.md',
      mimeType: 'text/markdown',
      uri: 'https://notion.so/page-1'
    })

    const fallbackUri = buildToolFilePayload(
      'pages',
      { action: 'get' },
      { action: 'get', page_id: 'page-2', content: 'Body' }
    )
    expect(fallbackUri).toMatchObject({
      name: 'page-2.md',
      mimeType: 'text/markdown',
      uri: 'notion://pages/page-2.md'
    })
  })

  it('builds payloads for blocks.children, blocks.get, and content_convert', () => {
    const children = buildToolFilePayload(
      'blocks',
      { action: 'children', block_id: 'blk-1' },
      { block_id: 'blk-1', markdown: '- item' }
    )
    expect(children).toMatchObject({
      name: 'blk-1.md',
      mimeType: 'text/markdown',
      uri: 'notion://blocks/blk-1.md'
    })

    const getBlock = buildToolFilePayload(
      'blocks',
      { action: 'get', block_id: 'blk-2' },
      { block: { id: 'blk-2', type: 'paragraph' } }
    )
    expect(getBlock).toMatchObject({
      name: 'blk-2.json',
      mimeType: 'application/json',
      uri: 'notion://blocks/blk-2.json'
    })

    expect(buildToolFilePayload('blocks', { action: 'delete' }, { deleted: true })).toBeNull()

    const converted = buildToolFilePayload(
      'content_convert',
      { direction: 'blocks-to-markdown' },
      { direction: 'blocks-to-markdown', markdown: '# Title' }
    )
    expect(converted).toMatchObject({
      name: 'content.md',
      mimeType: 'text/markdown'
    })
    expect(buildToolFilePayload('content_convert', { direction: 'markdown-to-blocks' }, { blocks: [] })).toBeNull()
  })

  it('builds binary or JSON payloads for file_uploads', () => {
    const smallBase64 = Buffer.from('hello binary').toString('base64')
    const binary = buildToolFilePayload(
      'file_uploads',
      {
        action: 'send',
        file_upload_id: 'up-1',
        filename: 'hello.txt',
        content_type: 'text/plain',
        file_content: smallBase64
      },
      { file_upload_id: 'up-1', status: 'uploaded' }
    )
    expect(binary).toMatchObject({
      extension: FILES_EXTENSION_ID,
      name: 'hello.txt',
      mimeType: 'text/plain',
      uri: 'notion://file_uploads/up-1',
      blob: smallBase64
    })

    const hugeBase64 = Buffer.alloc(260 * 1024).toString('base64')
    const oversizedFallback = buildToolFilePayload(
      'file_uploads',
      {
        action: 'send',
        file_upload_id: 'up-2',
        file_content: hugeBase64
      },
      { file_upload_id: 'up-2', filename: 'large.bin', status: 'uploaded' }
    )
    expect(oversizedFallback).toMatchObject({
      name: 'large.bin',
      mimeType: 'application/json',
      uri: 'notion://file_uploads/up-2'
    })

    const retrieved = buildToolFilePayload(
      'file_uploads',
      { action: 'retrieve', file_upload_id: 'up-3' },
      { file_upload_id: 'up-3', status: 'pending' }
    )
    expect(retrieved).toMatchObject({
      name: 'up-3.json',
      mimeType: 'application/json',
      uri: 'notion://file_uploads/up-3'
    })

    expect(buildToolFilePayload('file_uploads', { action: 'list' }, { results: [] })).toBeNull()
  })
})

describe('attachFilesExtensionMeta', () => {
  it('returns base result unchanged when unsupported or missing payload', () => {
    const base = { content: [{ type: 'text', text: 'ok' }] }
    expect(attachFilesExtensionMeta(base, null, true)).toBe(base)

    const payload = buildToolFilePayload('pages', { action: 'get', page_id: 'p1' }, { content: '# A' })
    expect(attachFilesExtensionMeta(base, payload, false)).toBe(base)
  })

  it('preserves existing _meta fields and attaches io.modelcontextprotocol/files', () => {
    const base = { _meta: { trace: '1' }, content: [{ type: 'text', text: 'ok' }] }
    const payload = buildToolFilePayload('pages', { action: 'get', page_id: 'p1' }, { content: '# A' })
    const enriched = attachFilesExtensionMeta(base, payload, true)

    expect(enriched._meta).toEqual({
      trace: '1',
      [FILES_EXTENSION_ID]: [payload]
    })
  })
})
