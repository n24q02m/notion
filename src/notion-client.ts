import { Client } from '@notionhq/client'
import { getSubjectToken, SETUP_HINT } from './credential-state.js'
import { NotionMCPError } from './tools/helpers/errors.js'

/** Notion API version pinned for every client this server creates. */
export const NOTION_VERSION = '2025-09-03'

/** Builds a Notion client for an already-resolved integration token. */
export function createNotionClient(token: string): Client {
  return new Client({ auth: token, notionVersion: NOTION_VERSION })
}

/** Builds a Notion client for the calling user's namespace, or fails with the setup hint. */
export async function notionClientForCaller(): Promise<Client> {
  const token = await getSubjectToken()
  if (!token) {
    throw new NotionMCPError(`Notion integration token not configured. ${SETUP_HINT}`, 'NOT_CONFIGURED')
  }
  return createNotionClient(token)
}
