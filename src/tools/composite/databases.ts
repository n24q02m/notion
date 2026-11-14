/**
 * Databases Mega Tool - Updated for Notion API 2025-09-03
 * Supports data_sources architecture
 */

import type { Client } from '@notionhq/client'
import { formatCover } from '../helpers/covers.js'
import { NotionMCPError, retryWithBackoff, withErrorHandling } from '../helpers/errors.js'
import { formatIcon } from '../helpers/icons.js'
import { normalizeId } from '../helpers/id.js'
import { autoPaginate, processBatches } from '../helpers/pagination.js'
import { convertToNotionProperties, extractPageProperties } from '../helpers/properties.js'
import * as RichText from '../helpers/richtext.js'

// Cache for data source schema (properties)
export const schemaCache = new Map<string, { properties: any; expiresAt: number }>()
const SCHEMA_CACHE_TTL = 5 * 60 * 1000 // 5 minutes
export const resolutionCache = new Map<string, { databaseId: string; dataSourceId: string; expiresAt: number }>()

/**
 * Get data source properties with caching
 */
async function getDataSourceSchema(notion: Client, dataSourceId: string): Promise<any> {
  const cached = schemaCache.get(dataSourceId)
  if (cached && Date.now() < cached.expiresAt) {
    return cached.properties
  }

  const dataSource: any = await (notion as any).dataSources.retrieve({
    data_source_id: dataSourceId
  })
  const properties = dataSource.properties

  if (properties) {
    schemaCache.set(dataSourceId, {
      properties,
      expiresAt: Date.now() + SCHEMA_CACHE_TTL
    })
  }

  return properties
}

/**
 * Build a filter that searches across all title and rich_text properties
 */
function buildSearchFilter(properties: any, search: string): any | null {
  if (!properties) return null

  const keys = Object.keys(properties)
  const or: any[] = []

  for (let i = 0; i < keys.length; i++) {
    const name = keys[i]
    const type = properties[name].type

    switch (type) {
      case 'title':
      case 'rich_text':
        or.push({
          property: name,
          rich_text: { contains: search }
        })
        break
    }
  }

  return or.length > 0 ? { or } : null
}

/**
 * Get search filter for text properties
 */
async function getSmartSearchFilter(notion: Client, dataSourceId: string, search: string): Promise<any | null> {
  const properties = await getDataSourceSchema(notion, dataSourceId)
  return buildSearchFilter(properties, search)
}

/**
 * Format raw Notion page results into AI-friendly property objects
 */
function formatDatabaseResults(results: any[]): Record<string, any>[] {
  const formattedResults = new Array(results.length)
  for (let i = 0; i < results.length; i++) {
    const page: any = results[i]
    const props = extractPageProperties(page.properties)
    props.page_id = page.id
    props.url = page.url

    formattedResults[i] = props
  }
  return formattedResults
}

export interface DatabasesInput {
  action:
    | 'create'
    | 'get'
    | 'query'
    | 'create_page'
    | 'update_page'
    | 'delete_page'
    | 'create_data_source'
    | 'update_data_source'
    | 'update_database'
    | 'list_templates'

  // Common params
  database_id?: string
  data_source_id?: string

  // Create database params
  parent_id?: string
  title?: string
  description?: string
  properties?: Record<string, any>
  is_inline?: boolean
  icon?: string
  cover?: string

  // Query params
  filters?: any
  sorts?: any[]
  limit?: number
  search?: string

  // Page operations params (create/update/delete database items)
  page_id?: string
  page_ids?: string[]
  page_properties?: Record<string, any>

  // Bulk operations
  pages?: Array<{
    page_id?: string
    properties: Record<string, any>
  }>
}

export interface CreateDatabaseResponse {
  action: 'create'
  database_id: string
  data_source_id?: string
  url: string
  created: boolean
}

export interface GetDatabaseResponse {
  action: 'get'
  database_id: string
  title: string
  description: string
  url: string
  is_inline: boolean
  created_time: string
  last_edited_time: string
  data_source: {
    id: string
    name: string
  } | null
  schema: Record<string, any>
}

export interface QueryDatabaseResponse {
  action: 'query'
  database_id: string
  data_source_id: string
  total: number
  results: Record<string, any>[]
}

export interface CreateDatabasePageResponse {
  action: 'create_page'
  database_id: string
  data_source_id: string
  processed: number
  results: {
    page_id: string
    url: string
    created: boolean
  }[]
}

export interface UpdateDatabasePageResponse {
  action: 'update_page'
  processed: number
  results: {
    page_id: string
    updated: boolean
  }[]
}

export interface DeleteDatabasePageResponse {
  action: 'delete_page'
  processed: number
  results: {
    page_id: string
    deleted: boolean
  }[]
}

export interface CreateDataSourceResponse {
  action: 'create_data_source'
  data_source_id: string
  database_id: string
  created: boolean
}

export interface UpdateDataSourceResponse {
  action: 'update_data_source'
  data_source_id: string
  updated: boolean
}

export interface UpdateDatabaseResponse {
  action: 'update_database'
  database_id: string
  updated: boolean
}

export interface ListDataSourceTemplatesResponse {
  action: 'list_templates'
  database_id: string
  data_source_id: string
  total: number
  templates: {
    template_id: string
    title: string
    properties: any
  }[]
}

export type DatabasesResponse =
  | CreateDatabaseResponse
  | GetDatabaseResponse
  | QueryDatabaseResponse
  | CreateDatabasePageResponse
  | UpdateDatabasePageResponse
  | DeleteDatabasePageResponse
  | CreateDataSourceResponse
  | UpdateDataSourceResponse
  | UpdateDatabaseResponse
  | ListDataSourceTemplatesResponse

/**
 * Smart ID resolution: accepts both database container ID and data_source ID
 * Tries database_id first; if NOT_FOUND, tries as data_source_id
 * Returns both IDs for downstream operations
 */
async function resolveDataSourceId(notion: Client, id: string): Promise<{ databaseId: string; dataSourceId: string }> {
  const normalized = normalizeId(id)

  const cached = resolutionCache.get(normalized)
  if (cached && Date.now() < cached.expiresAt) {
    return { databaseId: cached.databaseId, dataSourceId: cached.dataSourceId }
  }

  // Try as database container first
  try {
    const database: any = await notion.databases.retrieve({ database_id: normalized })
    if (database.data_sources?.length > 0) {
      const result = { databaseId: database.id, dataSourceId: database.data_sources[0].id }
      resolutionCache.set(normalized, { ...result, expiresAt: Date.now() + SCHEMA_CACHE_TTL })
      return result
    }
    throw new NotionMCPError(
      'Database has no data sources',
      'VALIDATION_ERROR',
      'This database container has no data sources yet. Use create_data_source to add one.'
    )
  } catch (error: any) {
    if (error instanceof NotionMCPError) throw error

    // If NOT_FOUND, try interpreting as data_source_id
    if (error.code === 'object_not_found') {
      try {
        const ds: any = await (notion as any).dataSources.retrieve({ data_source_id: normalized })
        const result = {
          databaseId: ds.parent?.database_id || normalized,
          dataSourceId: ds.id
        }
        resolutionCache.set(normalized, { ...result, expiresAt: Date.now() + SCHEMA_CACHE_TTL })
        return result
      } catch {
        throw new NotionMCPError(
          `ID "${id}" is not a valid database or data source`,
          'NOT_FOUND',
          'Use the database ID from the Notion URL (e.g., notion.so/<database_id>?...), or a data_source_id from workspace search. Try workspace/search with filter.object="data_source" to find available databases.'
        )
      }
    }
    throw error
  }
}

/**
 * Unified databases tool - handles all database operations
 */
export async function databases(notion: Client, input: DatabasesInput): Promise<DatabasesResponse> {
  return withErrorHandling(async () => {
    switch (input.action) {
      case 'create':
        return await createDatabase(notion, input)

      case 'get':
        return await getDatabase(notion, input)

      case 'query':
        return await queryDatabase(notion, input)

      case 'create_page':
        return await createDatabasePages(notion, input)

      case 'update_page':
        return await updateDatabasePages(notion, input)

      case 'delete_page':
        return await deleteDatabasePages(notion, input)

      case 'create_data_source':
        return await createDataSource(notion, input)

      case 'update_data_source':
        return await updateDataSource(notion, input)

      case 'update_database':
        return await updateDatabaseContainer(notion, input)

      case 'list_templates':
        return await listDataSourceTemplates(notion, input)

      default:
        throw new NotionMCPError(
          `Unknown action: ${input.action}`,
          'VALIDATION_ERROR',
          'Supported actions: create, get, query, create_page, update_page, delete_page, create_data_source, update_data_source, update_database, list_templates'
        )
    }
  })()
}

/**
 * Create database with initial data source
 * Maps to: POST /v1/databases (API 2025-09-03)
 */
async function createDatabase(notion: Client, input: DatabasesInput): Promise<CreateDatabaseResponse> {
  if (!input.parent_id || !input.title || !input.properties) {
    throw new NotionMCPError(
      'parent_id, title, and properties required for create action',
      'VALIDATION_ERROR',
      'Provide parent_id, title, and properties'
    )
  }

  // API 2025-09-03: properties go under initial_data_source
  const dbData: any = {
    parent: { type: 'page_id', page_id: input.parent_id },
    title: [RichText.text(input.title)],
    initial_data_source: {
      properties: input.properties
    }
  }

  if (input.description) {
    dbData.description = [RichText.text(input.description)]
  }

  if (input.is_inline !== undefined) {
    dbData.is_inline = input.is_inline
  }

  if (input.icon) {
    dbData.icon = formatIcon(input.icon)
  }

  if (input.cover) {
    dbData.cover = formatCover(input.cover)
  }

  const database: any = await notion.databases.create(dbData)

  return {
    action: 'create',
    database_id: database.id,
    data_source_id: database.data_sources?.[0]?.id,
    url: database.url,
    created: true
  }
}

/**
 * Get database info including all data sources
 * Maps to: GET /v1/databases/{id} (API 2025-09-03)
 */
async function getDatabase(notion: Client, input: DatabasesInput): Promise<GetDatabaseResponse> {
  if (!input.database_id) {
    throw new NotionMCPError('database_id required for get action', 'VALIDATION_ERROR', 'Provide database_id')
  }

  // Get database (contains list of data_sources)
  const database: any = await notion.databases.retrieve({
    database_id: normalizeId(input.database_id)
  })

  // Get detailed schema from first data source
  const schema: any = {}
  let dataSourceInfo: any = null

  if (database.data_sources && database.data_sources.length > 0) {
    const dataSourceId = database.data_sources[0].id
    const properties = await getDataSourceSchema(notion, dataSourceId)

    dataSourceInfo = {
      id: dataSourceId,
      name: database.data_sources[0].name
    }

    // Format properties for AI-friendly output
    if (properties) {
      const keys = Object.keys(properties)
      for (let i = 0; i < keys.length; i++) {
        const name = keys[i]
        const p = properties[name] as any
        const type = p.type

        schema[name] = {
          type,
          id: p.id
        }

        if (type === 'select' && p.select?.options) {
          const opts = p.select.options
          const arr = new Array(opts.length)
          for (let j = 0; j < opts.length; j++) arr[j] = opts[j].name
          schema[name].options = arr
        } else if (type === 'multi_select' && p.multi_select?.options) {
          const opts = p.multi_select.options
          const arr = new Array(opts.length)
          for (let j = 0; j < opts.length; j++) arr[j] = opts[j].name
          schema[name].options = arr
        } else if (type === 'formula' && p.formula) {
          schema[name].expression = p.formula.expression
        }
      }
    }
  }

  return {
    action: 'get',
    database_id: database.id,
    title: database.title?.[0]?.plain_text || 'Untitled',
    description: database.description?.[0]?.plain_text || '',
    url: database.url,
    is_inline: database.is_inline,
    created_time: database.created_time,
    last_edited_time: database.last_edited_time,
    data_source: dataSourceInfo,
    schema
  }
}

/**
 * Query database (via data source)
 * Maps to: POST /v1/data_sources/{id}/query (API 2025-09-03)
 */
async function queryDatabase(notion: Client, input: DatabasesInput): Promise<QueryDatabaseResponse> {
  if (!input.database_id) {
    throw new NotionMCPError(
      'database_id required for query action',
      'VALIDATION_ERROR',
      'Provide database_id (from Notion URL) or data_source_id (from workspace search). Both formats are accepted.'
    )
  }

  // Smart resolve: accepts both database_id and data_source_id
  const { databaseId, dataSourceId } = await resolveDataSourceId(notion, input.database_id)

  let filter = input.filters

  // Smart search across text properties
  if (input.search && !filter) {
    filter = await getSmartSearchFilter(notion, dataSourceId, input.search)
  }

  const queryParams: any = { data_source_id: dataSourceId }
  if (filter) queryParams.filter = filter
  if (input.sorts) queryParams.sorts = input.sorts

  // Fetch with pagination
  const allResults = await autoPaginate(
    async (cursor, pageSize) => {
      const response: any = await (notion as any).dataSources.query({
        ...queryParams,
        start_cursor: cursor,
        page_size: pageSize
      })
      return {
        results: response.results,
        next_cursor: response.next_cursor,
        has_more: response.has_more
      }
    },
    { limit: input.limit }
  )

  // Format results
  const results = allResults

  const formattedResults = formatDatabaseResults(results)

  return {
    action: 'query',
    database_id: databaseId,
    data_source_id: dataSourceId,
    total: formattedResults.length,
    results: formattedResults
  }
}

/**
 * Create pages in database (via data source)
 * Maps to: Multiple POST /v1/pages with data_source_id parent (API 2025-09-03)
 */
async function createDatabasePages(notion: Client, input: DatabasesInput): Promise<CreateDatabasePageResponse> {
  if (!input.database_id) {
    throw new NotionMCPError(
      'database_id required',
      'VALIDATION_ERROR',
      'Provide database_id (from Notion URL) or data_source_id (from workspace search). Both formats are accepted.'
    )
  }

  // Smart resolve: accepts both database_id and data_source_id
  const { databaseId, dataSourceId } = await resolveDataSourceId(notion, input.database_id)

  // Fetch schema for property type mapping
  const properties = await getDataSourceSchema(notion, dataSourceId)
  const schema: Record<string, string> = {}
  if (properties) {
    const keys = Object.keys(properties)
    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      schema[name] = (properties[name] as any).type
    }
  }

  const items = input.pages || (input.page_properties ? [{ properties: input.page_properties }] : [])

  if (items.length === 0) {
    throw new NotionMCPError('pages or page_properties required', 'VALIDATION_ERROR', 'Provide items to create')
  }

  // Validate all items before processing to avoid partial writes on malformed input
  for (let i = 0; i < items.length; i++) {
    if (!items[i] || items[i].properties === undefined || items[i].properties === null) {
      throw new NotionMCPError(
        `Item at index ${i} in the pages array is missing the "properties" key`,
        'VALIDATION_ERROR',
        'Use format: pages: [{ "properties": { "FieldName": "value" } }] - not flat objects like [{ "FieldName": "value" }]'
      )
    }
  }

  const results = await processBatches(
    items,
    async (item) => {
      const properties = convertToNotionProperties(item.properties, schema)

      const page = await retryWithBackoff(async () =>
        notion.pages.create({
          parent: { type: 'data_source_id', data_source_id: dataSourceId },
          properties
        } as any)
      )

      return {
        page_id: page.id,
        url: (page as any).url,
        created: true
      }
    },
    { batchSize: 5, concurrency: 3 }
  )

  return {
    action: 'create_page',
    database_id: databaseId,
    data_source_id: dataSourceId,
    processed: results.length,
    results
  }
}

/**
 * Update pages in database (bulk)
 * Maps to: Multiple PATCH /v1/pages/{id}
 */
async function updateDatabasePages(notion: Client, input: DatabasesInput): Promise<UpdateDatabasePageResponse> {
  const items =
    input.pages ||
    (input.page_id && input.page_properties ? [{ page_id: input.page_id, properties: input.page_properties }] : [])

  if (items.length === 0) {
    throw new NotionMCPError('pages or page_id+page_properties required', 'VALIDATION_ERROR', 'Provide items to update')
  }

  // Validate all items before processing to avoid partial writes on malformed input
  for (let i = 0; i < items.length; i++) {
    if (!items[i] || items[i].properties === undefined || items[i].properties === null) {
      throw new NotionMCPError(
        `Item at index ${i} in the pages array is missing the "properties" key`,
        'VALIDATION_ERROR',
        'Use format: pages: [{ "page_id": "...", "properties": { "FieldName": "value" } }]'
      )
    }
  }

  const results = await processBatches(
    items,
    async (item) => {
      if (!item.page_id) {
        throw new NotionMCPError('page_id required for each item', 'VALIDATION_ERROR', 'Provide page_id')
      }

      const properties = convertToNotionProperties(item.properties)

      await retryWithBackoff(async () =>
        notion.pages.update({
          page_id: item.page_id!,
          properties
        })
      )

      return {
        page_id: item.page_id,
        updated: true
      }
    },
    { batchSize: 5, concurrency: 3 }
  )

  return {
    action: 'update_page',
    processed: results.length,
    results
  }
}

/**
 * Delete pages in database (bulk archive)
 * Maps to: Multiple PATCH /v1/pages/{id} with archived: true
 */
async function deleteDatabasePages(notion: Client, input: DatabasesInput): Promise<DeleteDatabasePageResponse> {
  let pageIds = input.page_ids || (input.page_id ? [input.page_id] : [])
  if (!pageIds || pageIds.length === 0) {
    if (input.pages) {
      pageIds = []
      for (const p of input.pages) {
        if (p.page_id) {
          pageIds.push(p.page_id)
        }
      }
    } else {
      pageIds = []
    }
  }

  if (pageIds.length === 0) {
    throw new NotionMCPError('page_id or page_ids required', 'VALIDATION_ERROR', 'Provide page IDs to delete')
  }

  const results = await processBatches(
    pageIds,
    async (pageId) => {
      await retryWithBackoff(async () =>
        notion.pages.update({
          page_id: pageId,
          archived: true
        })
      )

      return {
        page_id: pageId,
        deleted: true
      }
    },
    { batchSize: 5, concurrency: 3 }
  )

  return {
    action: 'delete_page',
    processed: results.length,
    results
  }
}

/**
 * Create additional data source for existing database
 * Maps to: POST /v1/data_sources (API 2025-09-03)
 */
async function createDataSource(notion: Client, input: DatabasesInput): Promise<CreateDataSourceResponse> {
  if (!input.database_id || !input.title || !input.properties) {
    throw new NotionMCPError(
      'database_id, title, and properties required',
      'VALIDATION_ERROR',
      'Provide database_id, title, and properties for new data source'
    )
  }

  const dataSourceData: any = {
    parent: { type: 'database_id', database_id: input.database_id },
    title: [RichText.text(input.title)],
    properties: input.properties
  }

  if (input.description) {
    dataSourceData.description = [RichText.text(input.description)]
  }

  const dataSource: any = await (notion as any).dataSources.create(dataSourceData)

  return {
    action: 'create_data_source',
    data_source_id: dataSource.id,
    database_id: input.database_id,
    created: true
  }
}

/**
 * Update data source (title, description, properties/schema)
 * Maps to: PATCH /v1/data_sources/{id} (API 2025-09-03)
 */
async function updateDataSource(notion: Client, input: DatabasesInput): Promise<UpdateDataSourceResponse> {
  if (!input.data_source_id) {
    throw new NotionMCPError('data_source_id required', 'VALIDATION_ERROR', 'Provide data_source_id')
  }

  const updates: any = {}

  if (input.title) {
    updates.title = [RichText.text(input.title)]
  }

  if (input.description) {
    updates.description = [RichText.text(input.description)]
  }

  if (input.properties) {
    updates.properties = input.properties
  }

  if (Object.keys(updates).length === 0) {
    throw new NotionMCPError(
      'No updates provided',
      'VALIDATION_ERROR',
      'Provide title, description, or properties to update'
    )
  }

  await (notion as any).dataSources.update({
    data_source_id: input.data_source_id,
    ...updates
  })
  // The cached schema predates this update; the next get or query must re-read it.
  // Cache keys are the dashed IDs Notion returns, the caller may pass either form.
  const updatedId = normalizeId(input.data_source_id)
  for (const key of schemaCache.keys()) {
    if (normalizeId(key) === updatedId) schemaCache.delete(key)
  }

  return {
    action: 'update_data_source',
    data_source_id: input.data_source_id,
    updated: true
  }
}

/**
 * Update database container (parent, title, is_inline, icon, cover)
 * Maps to: PATCH /v1/databases/{id} (API 2025-09-03)
 */
async function updateDatabaseContainer(notion: Client, input: DatabasesInput): Promise<UpdateDatabaseResponse> {
  if (!input.database_id) {
    throw new NotionMCPError('database_id required', 'VALIDATION_ERROR', 'Provide database_id')
  }

  const updates: any = {}

  if (input.parent_id) {
    updates.parent = { type: 'page_id', page_id: input.parent_id }
  }

  if (input.title) {
    updates.title = [RichText.text(input.title)]
  }

  if (input.description) {
    updates.description = [RichText.text(input.description)]
  }

  if (input.is_inline !== undefined) {
    updates.is_inline = input.is_inline
  }

  if (input.icon) {
    updates.icon = formatIcon(input.icon)
  }

  if (input.cover) updates.cover = formatCover(input.cover)

  if (Object.keys(updates).length === 0) {
    throw new NotionMCPError(
      'No updates provided',
      'VALIDATION_ERROR',
      'Provide parent_id, title, description, is_inline, icon, or cover'
    )
  }

  await notion.databases.update({
    database_id: normalizeId(input.database_id),
    ...updates
  })

  return {
    action: 'update_database',
    database_id: input.database_id,
    updated: true
  }
}

/**
 * List data source templates
 * Maps to: GET /v1/data_sources/{id}/templates (API 2025-09-03)
 */
async function listDataSourceTemplates(
  notion: Client,
  input: DatabasesInput
): Promise<ListDataSourceTemplatesResponse> {
  if (!input.database_id) {
    throw new NotionMCPError(
      'database_id required for list_templates action',
      'VALIDATION_ERROR',
      'Provide database_id (from Notion URL) or data_source_id. Both formats are accepted.'
    )
  }

  // Smart resolve: accepts both database_id and data_source_id
  const { databaseId, dataSourceId: resolvedDsId } = await resolveDataSourceId(notion, input.database_id)
  const dataSourceId = input.data_source_id || resolvedDsId

  const templates = await autoPaginate(async (cursor) => {
    const response: any = await (notion as any).dataSources.listTemplates({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100
    })
    return {
      results: response.templates || response.results,
      next_cursor: response.next_cursor,
      has_more: response.has_more
    }
  })

  return {
    action: 'list_templates',
    database_id: databaseId,
    data_source_id: dataSourceId,
    total: templates.length,
    templates: templates.map((t: any) => ({
      template_id: t.id,
      title: t.properties?.title?.title?.[0]?.plain_text || t.properties?.Name?.title?.[0]?.plain_text || 'Untitled',
      properties: t.properties
    }))
  }
}
