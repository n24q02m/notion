# Blocks Tool - Full Documentation

## Overview

Block-level content: get, children, append, update, delete.

## Important

- **Page IDs are valid block IDs** (page is root block)
- Use for **precise edits** within pages
- For full page content, use pages tool instead

## Supported Block Types

The markdown converter supports these Notion block types:

| Block Type        | Markdown Syntax                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Headings (1-3)    | `# H1`, `## H2`, `### H3`                                                                                                                                                                        |
| Paragraph         | Plain text                                                                                                                                                                                       |
| Bulleted list     | `- item` or `* item`                                                                                                                                                                             |
| Numbered list     | `1. item`                                                                                                                                                                                        |
| To-do / Checkbox  | `- [ ] task` or `- [x] done`                                                                                                                                                                     |
| Code block        | ` ```language ` ... ` ``` `                                                                                                                                                                      |
| Quote             | `> text`                                                                                                                                                                                         |
| Divider           | `---` or `***`                                                                                                                                                                                   |
| Callout           | `> [!NOTE] text`, `> [!TIP]`, `> [!WARNING]`, `> [!IMPORTANT]`, `> [!INFO]`, `> [!SUCCESS]`, `> [!ERROR]`. Multi-line: each line must start with `> `. Avoid CAUTION (emoji rejected by Notion). |
| Toggle            | `<details><summary>Title</summary>content</details>`. No nesting (toggle inside toggle fails).                                                                                                   |
| Table             | Pipe-delimited `\| col1 \| col2 \|` with optional header separator                                                                                                                               |
| Image             | `![alt text](url)` — signed S3 URL (1h expiry), fetch to view content                                                                                                                            |
| Bookmark          | `[bookmark](url)`                                                                                                                                                                                |
| Embed             | `[embed](url)`                                                                                                                                                                                   |
| Equation          | `$$expression$$` (inline) or `$$\n...\n$$` (multi-line)                                                                                                                                          |
| Columns           | `:::columns` / `:::column` / `:::end` (optional width: `:::column{width=0.7}`)                                                                                                                   |
| Table of Contents | `[toc]`                                                                                                                                                                                          |
| Breadcrumb        | `[breadcrumb]`                                                                                                                                                                                   |

## Rich Text Formatting

Inline formatting within any text content:

- **Bold**: `**text**`
- _Italic_: `*text*`
- `Code`: `` `text` ``
- ~~Strikethrough~~: `~~text~~`
- Links: `[text](url)`
- Page mentions: `@[Page Title](page-id)` - creates an inline @mention, not a hyperlink

## Layout Guide

### Columns

```
:::columns
:::column
Left content
:::column
Right content
:::end
```

Rules:

- `:::column` implicitly closes the previous column. Do NOT add `:::end` between columns.
- Only ONE `:::end` at the very end closes the entire column_list.
- Set width with `:::column{width=0.7}` (decimal 0-1). Ratios should sum to 1.

### Nesting depth limit

Notion API allows max 2 nesting levels per append call. A column with rich content like callouts or toggles exceeds this (`column_list > column > callout > children` = 4 levels).

**Workaround - append in multiple calls:**

1. Append the column_list with simple placeholder content (e.g. paragraphs):
```
:::columns
:::column{width=0.7}
Placeholder
:::column{width=0.3}
Placeholder
:::end
```

2. Read back the page blocks to get each column's block_id.

3. Replace each column's content individually using `update` or `delete` + `append` on the column block_id. Each call is now only 1 level deep (callout or toggle directly inside column).

## Actions

### get

```json
{ "action": "get", "block_id": "xxx" }
```

### children

```json
{ "action": "children", "block_id": "xxx" }
```
Returns markdown of child blocks.

### append

```json
{ "action": "append", "block_id": "page-id", "content": "## New Section\nParagraph text" }
```

### update

```json
{ "action": "update", "block_id": "block-id", "content": "Updated text" }
```

### delete

```json
{ "action": "delete", "block_id": "block-id" }
```

## Reading Images & Files from Blocks

When `children` or `get` returns image/file blocks:

### Images

- Rendered as `![caption](signed-url)` in markdown output
- The `signed-url` is a direct HTTPS link to the image (no additional auth required)
- **To view image content**: Fetch/read the URL directly — it returns the raw image bytes
- URL format: `https://prod-files-secure.s3.us-west-2.amazonaws.com/...` with embedded AWS signature
- **Expiry**: ~1 hour. Call `blocks/get` again to get a fresh URL if expired

### Files (PDF, DOCX, etc.)

- Appear as `file` type blocks in the raw `blocks` array
- Access via `block.file.file.url` (Notion-hosted) or `block.file.external.url` (external)
- **To read file content**: Download the signed URL, then parse with appropriate tools
- Same 1-hour expiry applies for Notion-hosted files

### Example: Reading an image from a page

1. `blocks/children` with page_id → find image blocks in response
2. Get URL from `![](url)` in markdown or `block.image.file.url` in raw blocks
3. Fetch the URL to view/analyze the image

## Parameters

- `block_id` - Block ID (required)
- `content` - Markdown content (for append/update)
