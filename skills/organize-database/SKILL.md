---

name: organize-database
description: Transform unstructured Notion pages into a well-designed database with proper schema and migration
argument-hint: "[page or workspace area to organize]"
---

# Organize Database

Transform unstructured Notion pages into a well-designed, queryable database.

## Property Type Decision Guide

Choose the right property type -- LLMs frequently pick the wrong one:

| Data pattern                        | Correct type       | Wrong choice (common mistake)          |
| ----------------------------------- | ------------------ | -------------------------------------- |
| Fixed categories (status, priority) | `select`           | `rich_text` (loses filtering)          |
| Multiple tags per item              | `multi_select`     | `select` (only allows one)             |
| References to other DBs             | `relation`         | `rich_text` (breaks linking)           |
| Computed from relations             | `rollup`           | `formula` (can't aggregate across DBs) |
| True/false flags                    | `checkbox`         | `select` with Yes/No (over-engineered) |
| Long-form content                   | Page body (blocks) | `rich_text` property (2000 char limit) |

## Property Format Reference

Every property value MUST use the correct nested format. The Notion API rejects flat values.

```jsonc
// WRONG -- flat values (API will error or silently fail)
{
  "Tags": "engineering",
  "Status": "In Progress",
  "Description": "Some text"
}

// CORRECT -- properly typed nested objects
{
  "Tags": { "multi_select": [{ "name": "engineering" }] },
  "Status": { "select": { "name": "In Progress" } },
  "Description": { "rich_text": [{ "text": { "content": "Some text" } }] },
  "Name": { "title": [{ "text": { "content": "Page title" } }] },
  "Done": { "checkbox": true },
  "Due Date": { "date": { "start": "2026-03-23" } },
  "URL": { "url": "https://example.com" },
  "Count": { "number": 42 },
  "Contact": { "email": "user@example.com" }
}
```

Key gotcha: `rich_text` is an ARRAY of text objects, never a plain string.

## Migration Pattern

1. **Audit existing content** -- find the pages to organize:
   - `pages(action="search", query="<topic>")` to locate scattered pages
   - Read each page's blocks to understand content structure
   - Identify common fields across pages (these become DB properties)

2. **Design schema** -- create the database with identified properties:

   ```
   databases(action="create", parent_id="<parent_page_id>", title="...", properties={
     "Name": { "title": {} },
     "Category": { "select": { "options": [{ "name": "..." }] } },
     "Tags": { "multi_select": { "options": [{ "name": "..." }] } },
     ...
   })
   ```

   - Start with 5-7 properties max. Users can add more later.
   - Always include a `select` for status/category -- it enables Notion's board view.

3. **Bulk-create pages** from existing content:
   - For each source page, extract content and create a new DB entry:
     `pages(action="create", parent_id="<database_id>", properties={...}, content=[...])`
   - Preserve the original content as page body blocks
   - Map existing content to the new properties

4. **Archive old pages** (only after user confirms migration looks correct):
   - `blocks(action="delete", block_id="<old_page_block_id>")` or move to archive page
   - Never delete originals without explicit user confirmation

5. **Verify** the new database:
   - `databases(action="query", database_id="<id>")` to list all entries
   - Present count and sample entries to user

## When to Use

- User has scattered pages about a topic and wants them organized
- Existing flat pages need structure (tags, categories, status tracking)
- Converting a list-style page into a proper database
- Setting up a new organized workspace area
