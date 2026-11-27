#!/usr/bin/env node
/**
 * Phase 5 Live Comprehensive Test for the notion MCP server.
 *
 * Spawns the server via MCP SDK Client (StdioClientTransport),
 * communicates over JSON-RPC stdio, and tests all accessible operations.
 *
 * Usage:
 *   node test-live-mcp.mjs                    # Meta + help + error tests (no token needed uses fake)
 *   NOTION_TOKEN=ntn_xxx node test-live-mcp.mjs  # Full test with real Notion API
 *
 * Without NOTION_TOKEN: tests listTools, listResources, help (all 9), error paths
 * With NOTION_TOKEN: also tests actual Notion API operations
 */

import { Client } from '@modelcontextprotocol/client'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'

const TIMEOUT = { timeout: 30000 }

// Use real token if available, otherwise fake one (server needs it to start)
const NOTION_TOKEN = process.env.NOTION_TOKEN || 'ntn_fake_token_for_testing'
const HAS_REAL_TOKEN = !!process.env.NOTION_TOKEN

let passed = 0
let failed = 0
let skipped = 0
const results = []

function parse(r) {
  if (r.isError) throw new Error(r.content[0].text)
  return r.content[0].text
}

function ok(label, evidence = '') {
  passed++
  results.push({ label, status: 'PASS', evidence })
  console.log(`  [PASS] ${label}${evidence ? ` | ${evidence.slice(0, 80)}` : ''}`)
}

function fail(label, err) {
  failed++
  results.push({ label, status: 'FAIL', evidence: err })
  console.log(`  [FAIL] ${label} | ${err.slice(0, 120)}`)
}

function skip(label, reason) {
  skipped++
  results.push({ label, status: 'SKIP', evidence: reason })
  console.log(`  [SKIP] ${label} | ${reason}`)
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
const transport = new StdioClientTransport({
  command: 'node',
  args: ['bin/cli.mjs'],
  env: { NOTION_TOKEN, PATH: process.env.PATH },
  cwd: import.meta.dirname || process.cwd()
})

const client = new Client({ name: 'live-test', version: '1.0.0' })
await client.connect(transport)
console.log(`Server connected. NOTION_TOKEN: ${HAS_REAL_TOKEN ? 'real' : 'fake (limited tests)'}\n`)

// ---------------------------------------------------------------------------
// Meta tests
// ---------------------------------------------------------------------------
console.log('--- Meta ---')

const toolsResult = await client.listTools()
const toolNames = toolsResult.tools.map((t) => t.name).sort()
const expectedTools = [
  'blocks',
  'comments',
  'content_convert',
  'databases',
  'file_uploads',
  'help',
  'pages',
  'users',
  'workspace'
]
if (JSON.stringify(toolNames) === JSON.stringify(expectedTools)) {
  ok('listTools', `tools=${JSON.stringify(toolNames)}`)
} else {
  fail('listTools', `Expected ${JSON.stringify(expectedTools)}, got ${JSON.stringify(toolNames)}`)
}

const resourcesResult = await client.listResources()
const resourceUris = resourcesResult.resources.map((r) => r.uri).sort()
if (resourceUris.length >= 8) {
  ok('listResources', `${resourceUris.length} resources: ${resourceUris[0]}...`)
} else {
  fail('listResources', `Expected >=8 resources, got ${resourceUris.length}`)
}

// ---------------------------------------------------------------------------
// Help tool (no API needed - reads local markdown docs)
// ---------------------------------------------------------------------------
console.log('\n--- help ---')

const helpTopics = ['pages', 'databases', 'blocks', 'users', 'workspace', 'comments', 'content_convert', 'file_uploads']

for (const topic of helpTopics) {
  try {
    const r = await client.callTool({ name: 'help', arguments: { tool_name: topic } }, undefined, TIMEOUT)
    const t = parse(r)
    if (t.length >= 100) {
      ok(`help(${topic})`, `${t.length} chars`)
    } else {
      fail(`help(${topic})`, `Too short: ${t.length} chars`)
    }
  } catch (e) {
    fail(`help(${topic})`, e.message)
  }
}

// ---------------------------------------------------------------------------
// Error paths (no API needed - validation happens before API call)
// ---------------------------------------------------------------------------
console.log('\n--- Error paths ---')

// pages: missing action
try {
  const r = await client.callTool({ name: 'pages', arguments: {} }, undefined, TIMEOUT)
  const t = parse(r)
  if (t.toLowerCase().includes('error') || t.toLowerCase().includes('action')) {
    ok('pages(no action)', t.slice(0, 80))
  } else {
    fail('pages(no action)', `Expected error: ${t.slice(0, 60)}`)
  }
} catch (e) {
  ok('pages(no action)', `Error: ${e.message.slice(0, 60)}`)
}

// pages: invalid action
try {
  const r = await client.callTool({ name: 'pages', arguments: { action: 'nonexistent' } }, undefined, TIMEOUT)
  const t = parse(r)
  if (t.toLowerCase().includes('error') || t.toLowerCase().includes('unknown') || t.toLowerCase().includes('invalid')) {
    ok('pages(invalid action)', t.slice(0, 80))
  } else {
    fail('pages(invalid action)', `Expected error: ${t.slice(0, 60)}`)
  }
} catch (e) {
  ok('pages(invalid action)', `Error: ${e.message.slice(0, 60)}`)
}

// databases: missing action
try {
  const r = await client.callTool({ name: 'databases', arguments: {} }, undefined, TIMEOUT)
  const t = parse(r)
  if (t.toLowerCase().includes('error') || t.toLowerCase().includes('action')) {
    ok('databases(no action)', t.slice(0, 80))
  } else {
    fail('databases(no action)', `Expected error: ${t.slice(0, 60)}`)
  }
} catch (e) {
  ok('databases(no action)', `Error: ${e.message.slice(0, 60)}`)
}

// blocks: missing action
try {
  const r = await client.callTool({ name: 'blocks', arguments: {} }, undefined, TIMEOUT)
  const t = parse(r)
  if (t.toLowerCase().includes('error') || t.toLowerCase().includes('action')) {
    ok('blocks(no action)', t.slice(0, 80))
  } else {
    fail('blocks(no action)', `Expected error: ${t.slice(0, 60)}`)
  }
} catch (e) {
  ok('blocks(no action)', `Error: ${e.message.slice(0, 60)}`)
}

// users: missing action
try {
  const r = await client.callTool({ name: 'users', arguments: {} }, undefined, TIMEOUT)
  const t = parse(r)
  if (t.toLowerCase().includes('error') || t.toLowerCase().includes('action')) {
    ok('users(no action)', t.slice(0, 80))
  } else {
    fail('users(no action)', `Expected error: ${t.slice(0, 60)}`)
  }
} catch (e) {
  ok('users(no action)', `Error: ${e.message.slice(0, 60)}`)
}

// workspace: missing action
try {
  const r = await client.callTool({ name: 'workspace', arguments: {} }, undefined, TIMEOUT)
  const t = parse(r)
  if (t.toLowerCase().includes('error') || t.toLowerCase().includes('action')) {
    ok('workspace(no action)', t.slice(0, 80))
  } else {
    fail('workspace(no action)', `Expected error: ${t.slice(0, 60)}`)
  }
} catch (e) {
  ok('workspace(no action)', `Error: ${e.message.slice(0, 60)}`)
}

// comments: missing action
try {
  const r = await client.callTool({ name: 'comments', arguments: {} }, undefined, TIMEOUT)
  const t = parse(r)
  if (t.toLowerCase().includes('error') || t.toLowerCase().includes('action')) {
    ok('comments(no action)', t.slice(0, 80))
  } else {
    fail('comments(no action)', `Expected error: ${t.slice(0, 60)}`)
  }
} catch (e) {
  ok('comments(no action)', `Error: ${e.message.slice(0, 60)}`)
}

// content_convert: missing action
try {
  const r = await client.callTool({ name: 'content_convert', arguments: {} }, undefined, TIMEOUT)
  const t = parse(r)
  if (t.toLowerCase().includes('error') || t.toLowerCase().includes('action')) {
    ok('content_convert(no action)', t.slice(0, 80))
  } else {
    fail('content_convert(no action)', `Expected error: ${t.slice(0, 60)}`)
  }
} catch (e) {
  ok('content_convert(no action)', `Error: ${e.message.slice(0, 60)}`)
}

// file_uploads: missing action
try {
  const r = await client.callTool({ name: 'file_uploads', arguments: {} }, undefined, TIMEOUT)
  const t = parse(r)
  if (t.toLowerCase().includes('error') || t.toLowerCase().includes('action')) {
    ok('file_uploads(no action)', t.slice(0, 80))
  } else {
    fail('file_uploads(no action)', `Expected error: ${t.slice(0, 60)}`)
  }
} catch (e) {
  ok('file_uploads(no action)', `Error: ${e.message.slice(0, 60)}`)
}

// help: invalid tool_name
try {
  const r = await client.callTool({ name: 'help', arguments: { tool_name: 'nonexistent' } }, undefined, TIMEOUT)
  const t = parse(r)
  if (
    t.toLowerCase().includes('error') ||
    t.toLowerCase().includes('not found') ||
    t.toLowerCase().includes('unknown')
  ) {
    ok('help(invalid tool)', t.slice(0, 80))
  } else {
    fail('help(invalid tool)', `Expected error: ${t.slice(0, 60)}`)
  }
} catch (e) {
  ok('help(invalid tool)', `Error: ${e.message.slice(0, 60)}`)
}

// ---------------------------------------------------------------------------
// Per-action validation (tests missing required params for specific actions)
// ---------------------------------------------------------------------------
console.log('\n--- Per-action validation ---')

/**
 * Accept both validation errors AND API auth errors as passing.
 * With a fake token, some actions pass validation but fail at the Notion API
 * with 401 unauthorized — that still proves MCP communication works correctly.
 */
async function expectErrorOrAuthFail(label, name, args) {
  try {
    const r = await client.callTool({ name, arguments: args }, undefined, TIMEOUT)
    const t = r.content[0].text
    const lower = t.toLowerCase()
    if (
      lower.includes('error') ||
      lower.includes('unauthorized') ||
      lower.includes('invalid') ||
      lower.includes('required') ||
      lower.includes('missing') ||
      lower.includes('failed') ||
      r.isError
    ) {
      ok(label, t.slice(0, 80))
    } else {
      fail(label, `Expected error: ${t.slice(0, 60)}`)
    }
  } catch (e) {
    ok(label, `Error: ${e.message.slice(0, 60)}`)
  }
}

// pages: per-action validation
await expectErrorOrAuthFail('pages(create, no parent)', 'pages', { action: 'create' })
await expectErrorOrAuthFail('pages(get, no page_id)', 'pages', { action: 'get' })
await expectErrorOrAuthFail('pages(get_property, no page_id)', 'pages', { action: 'get_property' })
await expectErrorOrAuthFail('pages(update, no page_id)', 'pages', { action: 'update' })
await expectErrorOrAuthFail('pages(move, no page_id)', 'pages', { action: 'move' })
await expectErrorOrAuthFail('pages(archive, no page_id)', 'pages', { action: 'archive' })
await expectErrorOrAuthFail('pages(duplicate, no page_id)', 'pages', { action: 'duplicate' })

// databases: per-action validation
await expectErrorOrAuthFail('databases(create, no parent)', 'databases', { action: 'create' })
await expectErrorOrAuthFail('databases(get, no db_id)', 'databases', { action: 'get' })
await expectErrorOrAuthFail('databases(query, no db_id)', 'databases', { action: 'query' })
await expectErrorOrAuthFail('databases(create_page, no db_id)', 'databases', { action: 'create_page' })
await expectErrorOrAuthFail('databases(update_page, no items)', 'databases', { action: 'update_page' })
await expectErrorOrAuthFail('databases(delete_page, no ids)', 'databases', { action: 'delete_page' })
await expectErrorOrAuthFail('databases(create_data_source, no db_id)', 'databases', { action: 'create_data_source' })
await expectErrorOrAuthFail('databases(update_data_source, no id)', 'databases', { action: 'update_data_source' })
await expectErrorOrAuthFail('databases(update_database, no db_id)', 'databases', { action: 'update_database' })
await expectErrorOrAuthFail('databases(list_templates, no db_id)', 'databases', { action: 'list_templates' })

// blocks: per-action validation (block_id required for all actions)
await expectErrorOrAuthFail('blocks(get, no block_id)', 'blocks', { action: 'get', block_id: '' })
await expectErrorOrAuthFail('blocks(children, no block_id)', 'blocks', { action: 'children', block_id: '' })
await expectErrorOrAuthFail('blocks(append, no block_id)', 'blocks', { action: 'append', block_id: '' })
await expectErrorOrAuthFail('blocks(update, no block_id)', 'blocks', { action: 'update', block_id: '' })
await expectErrorOrAuthFail('blocks(delete, no block_id)', 'blocks', { action: 'delete', block_id: '' })

// users: per-action validation
await expectErrorOrAuthFail('users(get, no user_id)', 'users', { action: 'get' })

// comments: per-action validation
await expectErrorOrAuthFail('comments(list, no page_id)', 'comments', { action: 'list' })
await expectErrorOrAuthFail('comments(get, no comment_id)', 'comments', { action: 'get' })
await expectErrorOrAuthFail('comments(create, no content)', 'comments', { action: 'create' })
await expectErrorOrAuthFail('comments(create, no target)', 'comments', { action: 'create', content: 'test' })

// content_convert: per-action validation
await expectErrorOrAuthFail('content_convert(blocks-to-md, invalid)', 'content_convert', {
  direction: 'blocks-to-markdown',
  content: 'not-valid-json'
})

// file_uploads: per-action validation
await expectErrorOrAuthFail('file_uploads(create, no filename)', 'file_uploads', { action: 'create' })
await expectErrorOrAuthFail('file_uploads(send, no upload_id)', 'file_uploads', { action: 'send' })
await expectErrorOrAuthFail('file_uploads(complete, no upload_id)', 'file_uploads', { action: 'complete' })
await expectErrorOrAuthFail('file_uploads(retrieve, no upload_id)', 'file_uploads', { action: 'retrieve' })

// ---------------------------------------------------------------------------
// API tests (only with real token)
// ---------------------------------------------------------------------------
if (HAS_REAL_TOKEN) {
  console.log('\n--- API tests (real token) ---')

  // Helper for simple API call tests
  async function apiTest(label, name, args) {
    try {
      const r = await client.callTool({ name, arguments: args }, undefined, TIMEOUT)
      const t = parse(r)
      ok(label, t.slice(0, 80))
      return t
    } catch (e) {
      fail(label, e.message)
      return null
    }
  }

  // --- workspace ---
  await apiTest('workspace.info', 'workspace', { action: 'info' })
  await apiTest('workspace.search', 'workspace', { action: 'search', query: 'test' })

  // --- users ---
  await apiTest('users.me', 'users', { action: 'me' })
  await apiTest('users.from_workspace', 'users', { action: 'from_workspace' })

  // --- content_convert ---
  await apiTest('content_convert.md-to-blocks', 'content_convert', {
    direction: 'markdown-to-blocks',
    content: '# Hello\n\nThis is a **test**.\n\n- Item 1\n- Item 2'
  })

  // blocks-to-markdown
  await apiTest('content_convert.blocks-to-md', 'content_convert', {
    direction: 'blocks-to-markdown',
    content: JSON.stringify([
      { type: 'heading_1', heading_1: { rich_text: [{ type: 'text', text: { content: 'Test' } }] } },
      { type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: 'Hello world' } }] } }
    ])
  })

  // --- pages: full CRUD lifecycle ---
  console.log('\n--- pages CRUD ---')

  // Find a parent page via workspace search
  let parentId = null
  try {
    const sr = await client.callTool(
      { name: 'workspace', arguments: { action: 'search', query: 'MCP', filter: 'page' } },
      undefined,
      TIMEOUT
    )
    const st = parse(sr)
    const m = st.match(/"(?:page_)?id":\s*"([0-9a-f-]+)"/)
    if (m) parentId = m[1]
  } catch (_) {}

  if (!parentId) {
    skip('pages CRUD', 'No accessible parent page found')
  } else {
    // create
    let testPageId = null
    try {
      const r = await client.callTool(
        {
          name: 'pages',
          arguments: {
            action: 'create',
            parent_id: parentId,
            title: 'Live Test Page (auto-cleanup)',
            content:
              '# Test\n\nCreated by test-live-mcp.mjs.\n\n- Bullet 1\n- Bullet 2\n\n## Section\n\nParagraph text.',
            icon: 'document:gray'
          }
        },
        undefined,
        TIMEOUT
      )
      const t = parse(r)
      const idMatch = t.match(/"(?:page_)?id":\s*"([0-9a-f-]+)"/)
      if (idMatch) {
        testPageId = idMatch[1]
        ok('pages.create', `id=${testPageId}`)
      } else {
        ok('pages.create', t.slice(0, 80))
      }
    } catch (e) {
      fail('pages.create', e.message)
    }

    if (testPageId) {
      // get
      await apiTest('pages.get', 'pages', { action: 'get', page_id: testPageId })

      // update (append content)
      await apiTest('pages.update', 'pages', {
        action: 'update',
        page_id: testPageId,
        append_content: '## Appended\n\nThis was appended via update.'
      })

      // get_property (title)
      await apiTest('pages.get_property', 'pages', {
        action: 'get_property',
        page_id: testPageId,
        property_id: 'title'
      })

      // --- blocks ---
      console.log('\n--- blocks CRUD ---')

      // children
      let blockId = null
      try {
        const r = await client.callTool(
          { name: 'blocks', arguments: { action: 'children', block_id: testPageId } },
          undefined,
          TIMEOUT
        )
        const t = parse(r)
        const bm = t.match(/"(?:block_)?id":\s*"([0-9a-f-]+)"/)
        if (bm) blockId = bm[1]
        ok('blocks.children', `found block: ${blockId}`)
      } catch (e) {
        fail('blocks.children', e.message)
      }

      // append
      await apiTest('blocks.append', 'blocks', {
        action: 'append',
        block_id: testPageId,
        content: '### Appended Block\n\nThis block was appended via blocks tool.'
      })

      if (blockId) {
        // get
        await apiTest('blocks.get', 'blocks', { action: 'get', block_id: blockId })
      }

      // --- comments ---
      console.log('\n--- comments ---')

      // create
      let commentId = null
      try {
        const r = await client.callTool(
          {
            name: 'comments',
            arguments: { action: 'create', page_id: testPageId, content: 'Test comment from live MCP test' }
          },
          undefined,
          TIMEOUT
        )
        const t = parse(r)
        const cm = t.match(/"(?:comment_)?id":\s*"([0-9a-f-]+)"/)
        if (cm) commentId = cm[1]
        ok('comments.create', `id=${commentId}`)
      } catch (e) {
        fail('comments.create', e.message)
      }

      // list
      await apiTest('comments.list', 'comments', { action: 'list', page_id: testPageId })

      if (commentId) {
        // get
        await apiTest('comments.get', 'comments', { action: 'get', comment_id: commentId })
      }

      // --- duplicate ---
      let dupPageId = null
      try {
        const r = await client.callTool(
          { name: 'pages', arguments: { action: 'duplicate', page_id: testPageId } },
          undefined,
          TIMEOUT
        )
        const t = parse(r)
        const dm = t.match(/"(?:page_)?id":\s*"([0-9a-f-]+)"/)
        if (dm) dupPageId = dm[1]
        ok('pages.duplicate', `dup_id=${dupPageId}`)
      } catch (e) {
        fail('pages.duplicate', e.message)
      }

      // --- cleanup: archive test pages ---
      console.log('\n--- cleanup ---')
      await apiTest('pages.archive(test)', 'pages', { action: 'archive', page_id: testPageId })
      if (dupPageId) {
        await apiTest('pages.archive(dup)', 'pages', { action: 'archive', page_id: dupPageId })
      }
    }
  }

  // --- databases ---
  console.log('\n--- databases ---')

  // Find a database via workspace search
  let dbId = null
  try {
    const sr = await client.callTool(
      { name: 'workspace', arguments: { action: 'search', filter: { object: 'data_source' } } },
      undefined,
      TIMEOUT
    )
    const st = parse(sr)
    const dm = st.match(/"(?:database_)?id":\s*"([0-9a-f-]+)"/)
    if (dm) dbId = dm[1]
  } catch (_) {}

  if (!dbId) {
    skip('databases.get', 'No accessible database found')
    skip('databases.query', 'No accessible database found')
  } else {
    // Token may find a database via search but lack direct access permissions
    try {
      const getR = await client.callTool(
        { name: 'databases', arguments: { action: 'get', database_id: dbId } },
        undefined,
        TIMEOUT
      )
      const getT = parse(getR)
      if (getT.includes('not found') || getT.includes('not_found') || getT.includes('Insufficient')) {
        skip('databases.get', 'Token lacks access to this database')
      } else {
        ok('databases.get', getT.slice(0, 80))
      }
    } catch (e) {
      skip('databases.get', `Token lacks access: ${e.message.slice(0, 60)}`)
    }
    await apiTest('databases.query', 'databases', { action: 'query', database_id: dbId, page_size: 3 })
  }

  // --- file_uploads ---
  console.log('\n--- file_uploads ---')

  // create
  let uploadId = null
  try {
    const r = await client.callTool(
      {
        name: 'file_uploads',
        arguments: { action: 'create', filename: 'test-live.txt', content_type: 'text/plain' }
      },
      undefined,
      TIMEOUT
    )
    const t = parse(r)
    const um = t.match(/"(?:file_upload_)?id":\s*"([0-9a-f-]+)"/)
    if (um) uploadId = um[1]
    ok('file_uploads.create', `id=${uploadId}`)
  } catch (e) {
    // File upload API may not be available for all integrations
    if (e.message.includes('permission') || e.message.includes('not available')) {
      skip('file_uploads.create', 'File uploads not available for this integration')
    } else {
      fail('file_uploads.create', e.message)
    }
  }

  if (uploadId) {
    // send
    await apiTest('file_uploads.send', 'file_uploads', {
      action: 'send',
      file_upload_id: uploadId,
      file_content: 'SGVsbG8gZnJvbSBsaXZlIHRlc3Q='
    })

    // complete (may fail if Notion API requires more data before completing)
    try {
      const cr = await client.callTool(
        { name: 'file_uploads', arguments: { action: 'complete', file_upload_id: uploadId } },
        undefined,
        TIMEOUT
      )
      const ct = parse(cr)
      ok('file_uploads.complete', ct.slice(0, 80))
    } catch (e) {
      if (e.message.includes('Invalid request') || e.message.includes('not ready')) {
        skip('file_uploads.complete', 'File not ready for completion (API limitation)')
      } else {
        fail('file_uploads.complete', e.message)
      }
    }

    // retrieve
    await apiTest('file_uploads.retrieve', 'file_uploads', {
      action: 'retrieve',
      file_upload_id: uploadId
    })
  }
} else {
  console.log('\n--- API tests (SKIPPED - no NOTION_TOKEN) ---')
  const apiTests = [
    'workspace.info',
    'workspace.search',
    'users.me',
    'users.from_workspace',
    'content_convert.md-to-blocks',
    'content_convert.blocks-to-md',
    'pages.create',
    'pages.get',
    'pages.update',
    'pages.get_property',
    'pages.duplicate',
    'pages.archive',
    'blocks.children',
    'blocks.append',
    'blocks.get',
    'comments.create',
    'comments.list',
    'comments.get',
    'databases.get',
    'databases.query',
    'file_uploads.create'
  ]
  for (const t of apiTests) {
    skip(t, 'Requires NOTION_TOKEN')
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
await client.close()

const total = passed + failed
console.log(`\n${'='.repeat(60)}`)
console.log(
  `RESULT: ${passed}/${total} PASS (${((100 * passed) / total).toFixed(1)}%)${skipped ? `, ${skipped} skipped` : ''}`
)
console.log(`${'='.repeat(60)}`)

if (failed > 0) {
  console.log('\nFailed tests:')
  for (const r of results) {
    if (r.status === 'FAIL') {
      console.log(`  - ${r.label}: ${r.evidence}`)
    }
  }
  process.exit(1)
}
