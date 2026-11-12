---

name: bulk-update
description: Update properties or content across many pages in a Notion database with dry-run and error recovery
argument-hint: "[database name] [what to change]"
---

# Bulk Update

Update properties or content across many pages in a database safely.

## Pagination (Critical)

Notion returns max 100 results per query. You MUST paginate to process all pages:

```
# First query
databases(action="query", database_id="<id>", filter={...}, page_size=100)
# Response includes: has_more=true, next_cursor="abc123"

# Continue until has_more=false
databases(action="query", database_id="<id>", filter={...}, page_size=100, start_cursor="abc123")
```

Never assume a single query returns all results. Always check `has_more`.

## Dry-Run Mode

Before making any changes, ALWAYS show the user what will change:

1. Query the database with the filter
2. For each matching page, show:
   - Page title (current value)
   - What will change (old value -> new value)
   - Total count of affected pages
3. Ask for explicit confirmation before proceeding

Example dry-run output:

```
Found 23 pages matching filter. Changes:

1. "Project Alpha" -- Status: "Active" -> "Archived"
2. "Project Beta" -- Status: "Active" -> "Archived"
...
(21 more)

Proceed with update? (yes/no)
```

## Update Execution

After user confirms:

1. **Track progress** -- maintain counters:
   - `succeeded`: pages updated successfully
   - `failed`: pages that errored (with page ID and error message)
   - `skipped`: pages already in target state

2. **Update each page**:

   ```
   pages(action="update", page_id="<id>", properties={
     "Status": { "select": { "name": "Archived" } }
   })
   ```

3. **Rate limit awareness**:
   - Notion rate limit: 3 requests/second average
   - For large batches (50+ pages), warn user it may take time
   - If you get 429 errors, pause and retry

4. **Error recovery**:
   - Never stop on first error -- continue processing remaining pages
   - Collect all failures with their page IDs
   - After completion, report: "Updated 20/23 pages. 3 failed: [page IDs + error reasons]"
   - Offer to retry failed pages

## Property Value Format

Remember the nested format (same as organize-database skill):

```jsonc
// Properties must use typed nested objects
{ "Status": { "select": { "name": "Done" } } }
{ "Tags": { "multi_select": [{ "name": "urgent" }, { "name": "review" }] } }
{ "Priority": { "number": 1 } }
{ "Reviewed": { "checkbox": true } }
```

## Common Bulk Operations

- **Change status**: Filter by old status, update to new status
- **Add/remove tags**: Read existing multi_select, merge/filter, write back
- **Set dates**: Update date properties across filtered pages
- **Archive**: Set `archived: true` on pages matching criteria
- **Clear field**: Set property to empty value (e.g., `{ "rich_text": [] }`)

## When to Use

- Renaming a category/tag across all pages
- Bulk-archiving completed or old items
- Adding a new tag to all pages matching a filter
- Resetting or populating a property across many pages
- Mass status transitions (e.g., sprint closeout)
