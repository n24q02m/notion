/**
 * Pages Mega Tool
 * All page operations in one unified interface
 */

import type { Client, PageObjectResponse } from '@notionhq/client'
import { boundMarkdown, DEFAULT_MARKDOWN_MAX_CHARS, MAX_MARKDOWN_MAX_CHARS } from '../helpers/bounds.js'
import { formatCover } from '../helpers/covers.js'
import { NotionMCPError, retryWithBackoff, withErrorHandling } from '../helpers/errors.js'
import { formatIcon } from '../helpers/icons.js'
import type { NotionBlock } from '../helpers/markdown.js'
import { blocksToMarkdown, markdownToBlocks } from '../helpers/markdown.js'
import { autoPaginate, populateDeepChildren, processBatches } from '../helpers/pagination.js'
import { convertToNotionProperties, extractPageProperties } from '../helpers/properties.js'
import * as RichText from '../helpers/richtext.js'

export interface CreatePageResult {
  action: 'create'
  page_id: string
  url: string
  created: true
}

export interface GetPageResult {
  action: 'get'
  page_id: string
  url: string
  created_time: string
  last_edited_time: string
  archived: boolean
  icon: any
  cover: any
  properties: Record<string, any>
  content: string
  block_count: number
  content_max_chars: number
  content_char_count: number
  content_truncated?: boolean
  content_chars_omitted?: number
  next_cursor?: string | null
}

export interface PagesInput {
  action: 'create' | 'get' | 'get_property' | 'update' | 'move' | 'archive' | 'restore' | 'duplicate'

  // Common params
  page_id?: string
  page_ids?: string[]

  // Create/Update params
  title?: string
  content?: string // Markdown (defaults to append, use replace: true to overwrite)
  append_content?: string
  parent_id?: string
  properties?: Record<string, any>
  icon?: string
  cover?: string

  // get_property params
  property_id?: string

  // get content params
  content_limit?: number
  content_cursor?: string
  max_chars?: number

  // Archive/Restore params
  archived?: boolean
  replace?: boolean
}

export interface GetPagePropertyResult {
  action: 'get_property'
  page_id: string
  property_id: string
  type: string
  value: any
}

/**
 * Get page content as markdown, optionally bounded to one Notion cursor page.
 * Maps to: GET /v1/pages/{id} + GET /v1/blocks/{id}/children
 */
async function getPage(notion: Client, input: PagesInput): Promise<GetPageResult> {
  if (!input.page_id) {
    throw new NotionMCPError('page_id is required for get action', 'VALIDATION_ERROR', 'Provide page_id')
  }

  if (
    input.content_limit !== undefined &&
    (!Number.isInteger(input.content_limit) || input.content_limit < 1 || input.content_limit > 100)
  ) {
    throw new NotionMCPError(
      'content_limit must be an integer between 1 and 100',
      'VALIDATION_ERROR',
      'Provide a content_limit between 1 and 100'
    )
  }

  const maxChars = input.max_chars ?? DEFAULT_MARKDOWN_MAX_CHARS

  if (!Number.isInteger(maxChars) || maxChars < 1 || maxChars > MAX_MARKDOWN_MAX_CHARS) {
    throw new NotionMCPError(
      `max_chars must be an integer between 1 and ${MAX_MARKDOWN_MAX_CHARS}`,
      'VALIDATION_ERROR',
      'Provide a max_chars between 1 and 100000'
    )
  }

  const page = (await notion.pages.retrieve({ page_id: input.page_id })) as PageObjectResponse
  const bounded = input.content_limit !== undefined || input.content_cursor !== undefined
  let blocks: NotionBlock[]
  let nextCursor: string | null = null
  let hasMore = false

  if (bounded) {
    const response = await notion.blocks.children.list({
      block_id: input.page_id,
      start_cursor: input.content_cursor,
      page_size: input.content_limit ?? 100
    })
    blocks = response.results as unknown as NotionBlock[]
    nextCursor = response.next_cursor
    hasMore = response.has_more
  } else {
    blocks = (await autoPaginate((cursor) =>
      notion.blocks.children.list({
        block_id: input.page_id!,
        start_cursor: cursor,
        page_size: 100
      })
    )) as unknown as NotionBlock[]
  }

  // Recursively fetch children for blocks that need them (tables, toggles, columns)
  await populateDeepChildren(notion, blocks as unknown as Parameters<typeof populateDeepChildren>[1])

  const boundedMarkdown = boundMarkdown(blocksToMarkdown(blocks), maxChars)

  const result: GetPageResult = {
    action: 'get',
    page_id: page.id,
    url: page.url,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    archived: page.archived,
    icon: page.icon || null,
    cover: page.cover || null,
    properties: extractPageProperties(page.properties),
    content: boundedMarkdown.markdown,
    block_count: blocks.length,
    content_max_chars: maxChars,
    content_char_count: boundedMarkdown.totalCharacters
  }

  if (boundedMarkdown.truncated) {
    result.content_chars_omitted = boundedMarkdown.totalCharacters - maxChars
  }

  if (bounded) {
    result.content_truncated = hasMore || boundedMarkdown.truncated
    result.next_cursor = nextCursor
  } else if (boundedMarkdown.truncated) {
    result.content_truncated = true
  }

  return result
}

export interface UpdatePageResult {
  action: 'update'
  page_id: string
  updated: true
}

export interface MovePageResult {
  action: 'move'
  page_id: string
  new_parent_id: string
  moved: true
}

export interface ArchivePageResult {
  action: 'archive' | 'restore'
  processed: number
  results: Array<{ page_id: string; archived: boolean }>
}

export interface DuplicatePageResult {
  action: 'duplicate'
  processed: number
  results: Array<{ original_id: string; duplicate_id: string; url: string }>
}

export type PagesResult =
  | CreatePageResult
  | GetPageResult
  | GetPagePropertyResult
  | UpdatePageResult
  | MovePageResult
  | ArchivePageResult
  | DuplicatePageResult

/**
 * Unified pages tool - handles all page operations
 */
export async function pages(notion: Client, input: PagesInput): Promise<PagesResult> {
  return withErrorHandling(async () => {
    switch (input.action) {
      case 'create':
        return await createPage(notion, input)

      case 'get':
        return await getPage(notion, input)

      case 'get_property':
        return await getPageProperty(notion, input)

      case 'update':
        return await updatePage(notion, input)

      case 'move':
        return await movePage(notion, input)

      case 'archive':
      case 'restore':
        return await archivePage(notion, input)

      case 'duplicate':
        return await duplicatePage(notion, input)

      default:
        throw new NotionMCPError(
          `Unknown action: ${input.action}`,
          'VALIDATION_ERROR',
          'Supported actions: create, get, get_property, update, move, archive, restore, duplicate'
        )
    }
  })()
}

/**
 * Create page with title and content
 * Maps to: POST /v1/pages + PATCH /v1/blocks/{id}/children
 */
async function createPage(notion: Client, input: PagesInput): Promise<CreatePageResult> {
  if (!input.title) {
    throw new NotionMCPError('title is required for create action', 'VALIDATION_ERROR', 'Provide page title')
  }

  if (!input.parent_id) {
    throw new NotionMCPError(
      'parent_id is required for page creation',
      'VALIDATION_ERROR',
      'Integration tokens cannot create workspace-level pages. Provide parent_id (database or page ID).'
    )
  }

  const normalizedId = input.parent_id.replace(/-/g, '')

  // Auto-detect parent type
  let parent: Record<string, any>
  if (input.properties && Object.keys(input.properties).length > 0) {
    parent = { type: 'database_id', database_id: normalizedId }
  } else {
    parent = { type: 'page_id', page_id: normalizedId }
  }

  // Prepare properties
  let properties: Record<string, any> = {}
  if (parent.database_id) {
    properties = convertToNotionProperties(input.properties || {})
    if (!properties.title && !properties.Name && !properties.Title) {
      properties.Name = { title: [RichText.text(input.title)] }
    }
  } else {
    properties = { title: { title: [RichText.text(input.title)] } }
  }

  const pageData: Record<string, any> = { parent, properties }
  if (input.icon) pageData.icon = formatIcon(input.icon)
  if (input.cover) pageData.cover = formatCover(input.cover)

  const page = (await notion.pages.create(pageData)) as PageObjectResponse

  // Add content if provided
  if (input.content) {
    const blocks = markdownToBlocks(input.content)
    if (blocks.length > 0) {
      await notion.blocks.children.append({
        block_id: page.id,
        children: blocks as any
      })
    }
  }

  return {
    action: 'create',
    page_id: page.id,
    url: page.url,
    created: true
  }
}

/**
 * Retrieve a page property item (supports paginated properties like relation, rollup, rich_text)
 * Maps to: GET /v1/pages/{id}/properties/{property_id}
 */
async function getPageProperty(notion: Client, input: PagesInput): Promise<GetPagePropertyResult> {
  if (!input.page_id) {
    throw new NotionMCPError('page_id is required for get_property action', 'VALIDATION_ERROR', 'Provide page_id')
  }

  if (!input.property_id) {
    throw new NotionMCPError(
      'property_id is required for get_property action',
      'VALIDATION_ERROR',
      'Provide property_id (from page properties metadata)'
    )
  }

  // Fetch with auto-pagination for paginated property items
  const allResults = await autoPaginate(async (cursor) => {
    const response: any = await notion.pages.properties.retrieve({
      page_id: input.page_id!,
      property_id: input.property_id!,
      start_cursor: cursor,
      page_size: 100
    } as any)

    // Non-paginated property items return the value directly (no results array)
    if (!response.results) {
      return {
        results: [response],
        next_cursor: null,
        has_more: false
      }
    }

    return {
      results: response.results,
      next_cursor: response.next_cursor,
      has_more: response.has_more
    }
  })

  // Format results based on property type
  const firstResult = allResults[0] as any
  const propertyType = firstResult?.type

  let value: any
  switch (propertyType) {
    case 'title':
    case 'rich_text': {
      const len = allResults.length
      const arr = new Array(len)
      for (let i = 0; i < len; i++) {
        arr[i] = (allResults[i] as any)[propertyType]?.plain_text || ''
      }
      value = arr.join('')
      break
    }
    case 'relation': {
      const relationIds: string[] = []
      for (const item of allResults as any[]) {
        const id = item.relation?.id
        if (id) {
          relationIds.push(id)
        }
      }
      value = relationIds
      break
    }
    case 'rollup':
      value = firstResult.rollup
      break
    case 'people':
      value = allResults.map((item: any) => ({
        id: item.people?.id,
        name: item.people?.name
      }))
      break
    default:
      // For non-paginated types, return the raw value
      value = firstResult?.[propertyType] ?? firstResult
      break
  }

  return {
    action: 'get_property',
    page_id: input.page_id,
    property_id: input.property_id,
    type: propertyType,
    value
  }
}

/**
 * Update page content/properties
 * Maps to: PATCH /v1/pages/{id} + PATCH /v1/blocks/{id}/children
 */
async function updatePage(notion: Client, input: PagesInput): Promise<UpdatePageResult> {
  if (!input.page_id) {
    throw new NotionMCPError('page_id is required for update action', 'VALIDATION_ERROR', 'Provide page_id')
  }

  const updates: Record<string, any> = {}

  // Update metadata
  if (input.icon) updates.icon = formatIcon(input.icon)
  if (input.cover) updates.cover = formatCover(input.cover)
  if (input.archived !== undefined) updates.archived = input.archived

  // Update properties
  if (input.properties || input.title) {
    updates.properties = {}

    if (input.title) {
      updates.properties.title = { title: [RichText.text(input.title)] }
    }

    if (input.properties) {
      const converted = convertToNotionProperties(input.properties)
      updates.properties = { ...updates.properties, ...converted }
    }
  }

  // Update page if we have metadata/property changes
  if (Object.keys(updates).length > 0) {
    await notion.pages.update({
      page_id: input.page_id,
      ...updates
    })
  }

  // Handle content updates
  if (input.content || input.append_content) {
    if (input.content) {
      // Delete existing content only if replace: true is explicitly set
      if (input.replace) {
        // Optimized: Fetch all blocks using autoPaginate, then delete them in batches.
        const existingBlocks = await autoPaginate((cursor) =>
          notion.blocks.children.list({
            block_id: input.page_id!,
            page_size: 100,
            start_cursor: cursor
          })
        )

        if (existingBlocks.length > 0) {
          await processBatches(
            existingBlocks,
            async (block) => {
              await retryWithBackoff(() => notion.blocks.delete({ block_id: block.id }))
            },
            { batchSize: 5, concurrency: 3 }
          )
        }
      }

      const newBlocks = markdownToBlocks(input.content)
      if (newBlocks.length > 0) {
        await notion.blocks.children.append({
          block_id: input.page_id,
          children: newBlocks as any
        })
      }
    } else if (input.append_content) {
      const blocks = markdownToBlocks(input.append_content)
      if (blocks.length > 0) {
        await notion.blocks.children.append({
          block_id: input.page_id,
          children: blocks as any
        })
      }
    }
  }

  return {
    action: 'update',
    page_id: input.page_id,
    updated: true
  }
}

/**
 * Move page to a new parent
 * Maps to: POST /v1/pages/{id}/move
 */
async function movePage(notion: Client, input: PagesInput): Promise<MovePageResult> {
  if (!input.page_id) {
    throw new NotionMCPError('page_id is required for move action', 'VALIDATION_ERROR', 'Provide page_id')
  }

  if (!input.parent_id) {
    throw new NotionMCPError(
      'parent_id is required for move action',
      'VALIDATION_ERROR',
      'Provide parent_id (target page ID to move into)'
    )
  }

  const normalizedParentId = input.parent_id.replace(/-/g, '')

  // SDK types don't include parent in UpdatePageParameters, but the API supports it
  await (notion.pages as any).update({
    page_id: input.page_id,
    parent: { type: 'page_id', page_id: normalizedParentId }
  })

  return {
    action: 'move',
    page_id: input.page_id,
    new_parent_id: normalizedParentId,
    moved: true
  }
}

/**
 * Archive or restore page
 * Maps to: PATCH /v1/pages/{id}
 */
async function archivePage(notion: Client, input: PagesInput): Promise<ArchivePageResult> {
  const pageIds = input.page_ids || (input.page_id ? [input.page_id] : [])

  if (pageIds.length === 0) {
    throw new NotionMCPError('page_id or page_ids required', 'VALIDATION_ERROR', 'Provide at least one page ID')
  }

  const archived = input.action === 'archive'
  const results = await processBatches(
    pageIds,
    async (pageId) => {
      await retryWithBackoff(() =>
        notion.pages.update({
          page_id: pageId,
          archived
        })
      )
      return { page_id: pageId, archived }
    },
    { batchSize: 5, concurrency: 3 }
  )

  return {
    action: input.action as 'archive' | 'restore',
    processed: results.length,
    results
  }
}

/**
 * Duplicate page
 * Maps to: GET /v1/pages/{id} + POST /v1/pages + GET/PATCH /v1/blocks
 */
async function duplicatePage(notion: Client, input: PagesInput): Promise<DuplicatePageResult> {
  const pageIds = input.page_ids || (input.page_id ? [input.page_id] : [])

  if (pageIds.length === 0) {
    throw new NotionMCPError('page_id or page_ids required', 'VALIDATION_ERROR', 'Provide at least one page ID')
  }

  // Process duplicates in batches to improve performance while respecting rate limits
  const results = await processBatches(
    pageIds,
    async (pageId) => {
      // Get original page and content in parallel

      const [originalPage, originalBlocks] = await Promise.all([
        retryWithBackoff(() => notion.pages.retrieve({ page_id: pageId }) as Promise<any>),

        autoPaginate((cursor) =>
          notion.blocks.children.list({
            block_id: pageId,

            start_cursor: cursor,

            page_size: 100
          })
        )
      ])

      // Sanitize parent - API response may include extra fields that
      // the create endpoint rejects (e.g. database_id in data_source parent)
      const rawParent = originalPage.parent
      let parent: any
      if (rawParent.type === 'data_source_id') {
        parent = { type: 'data_source_id', data_source_id: rawParent.data_source_id }
      } else if (rawParent.type === 'database_id') {
        parent = { type: 'database_id', database_id: rawParent.database_id }
      } else if (rawParent.type === 'page_id') {
        parent = { type: 'page_id', page_id: rawParent.page_id }
      } else {
        parent = rawParent
      }

      // Create duplicate
      const duplicatedPage: any = await retryWithBackoff(() =>
        notion.pages.create({
          parent,
          properties: originalPage.properties,
          icon: originalPage.icon,
          cover: originalPage.cover
        })
      )

      // Copy content — strip read-only fields that the create endpoint rejects
      if (originalBlocks.length > 0) {
        const sanitizedBlocks = originalBlocks.map((block: any) => {
          const {
            id,
            parent,
            created_time,
            last_edited_time,
            created_by,
            last_edited_by,
            has_children,
            archived,
            in_trash,
            request_id,
            object,
            ...rest
          } = block
          // Strip null values inside block type data (e.g., paragraph.icon: null)
          // Notion API rejects null where it expects object or undefined
          const blockType = rest.type
          if (blockType && rest[blockType] && typeof rest[blockType] === 'object') {
            for (const key of Object.keys(rest[blockType])) {
              if (rest[blockType][key] === null) {
                delete rest[blockType][key]
              }
            }
          }
          return rest
        })
        await retryWithBackoff(() =>
          notion.blocks.children.append({
            block_id: duplicatedPage.id,
            children: sanitizedBlocks as any
          })
        )
      }

      return {
        original_id: pageId,
        duplicate_id: duplicatedPage.id,
        url: duplicatedPage.url
      }
    },
    { batchSize: 5, concurrency: 3 }
  )

  return {
    action: 'duplicate',
    processed: results.length,
    results
  }
}
