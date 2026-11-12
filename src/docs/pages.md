# Pages Tool - Full Documentation

## Overview

Page lifecycle: create, get, get_property, update, move, archive, restore, duplicate.

## Important

- **parent_id required** for create (cannot create workspace-level pages)
- Returns **markdown content** for get action
- **get_property** supports paginated properties (relation, rollup, rich_text, people)

## Reading Images & Files in Pages

Pages may contain **image blocks** and **file blocks**. These are returned as markdown with signed URLs:

- **Images**: `![caption](https://prod-files-secure.s3.amazonaws.com/...)` — signed S3 URL, expires in 1 hour
- **Files**: Returned as blocks with download URLs in `blocks/children` response

**To read image content**: Fetch the signed URL directly — multimodal LLMs can view the image. The URL is a standard HTTPS link, no auth needed (signature is embedded).

**To read document content** (PDF, DOCX, etc.): Download the file via the signed URL, then use appropriate tools to parse content (e.g., Read tool for images, WebFetch for downloading).

**Important**: Signed URLs expire after ~1 hour. If you need to access a file later, fetch `blocks/get` again to get a fresh URL.

## Actions

### create

```json
{ "action": "create", "title": "Meeting Notes", "parent_id": "xxx", "content": "# Agenda\n- Item 1" }
```

### get

```json
{ "action": "get", "page_id": "xxx", "content_limit": 20 }
```
Returns all properties including: title, rich_text, select, multi_select, number, checkbox, url, email, phone_number, date, relation, rollup, people, files, formula, created_time, last_edited_time, created_by, last_edited_by, status, unique_id.

The markdown body is bounded to `max_chars` (1–100000, default 20000). A truncated body ends with `[Truncated: showing <limit> of <total> characters (<omitted> omitted). Pass a larger max_chars (up to 100000) or page blocks with content_limit/content_cursor.]`, and the response reports `content_char_count`, `content_max_chars`, `content_truncated`, and `content_chars_omitted`. Use `content_limit` (1–100 blocks) to bound the block read itself; when more blocks remain, `content_truncated` is `true` and `next_cursor` can be passed as `content_cursor` in the next request. Omitting `content_limit` reads every block, still bounded by `max_chars`.

### get_property

Retrieve a single page property item with auto-pagination for large properties.

```json
{ "action": "get_property", "page_id": "xxx", "property_id": "prop_id" }
```
Use this for paginated properties like relation, rollup, rich_text, or people that may exceed inline limits.

### update

```json
{ "action": "update", "page_id": "xxx", "append_content": "\n## New Section" }
```

### move

Move a page to a new parent page.

```json
{ "action": "move", "page_id": "xxx", "parent_id": "new_parent_id" }
```

### archive

```json
{ "action": "archive", "page_ids": ["xxx", "yyy"] }
```

### restore

```json
{ "action": "restore", "page_id": "xxx" }
```

### duplicate

```json
{ "action": "duplicate", "page_id": "xxx" }
```

## Parameters

- `page_id` - Page ID (required for most actions)
- `page_ids` - Multiple page IDs for batch operations
- `title` - Page title
- `content` - Markdown content
- `append_content` - Markdown to append
- `parent_id` - Parent page or database ID
- `properties` - Page properties (for database pages)
- `property_id` - Property ID (required for get_property action)
- `content_limit` - Maximum number of top-level blocks returned by `get` (1–100)
- `content_cursor` - Continuation cursor returned by a bounded `get`
- `max_chars` - Maximum markdown characters returned by `get` (1–100000, default 20000)
- `icon` - Emoji, external URL (`https://...`), or built-in shorthand (`name:color`, e.g. `document:gray`)
- `cover` - External URL (`https://...`) or built-in shorthand (e.g. `gradient_1`, `solid_beige`, `nasa_carina_nebula`)
- `archived` - Archive status (boolean, for update action)
