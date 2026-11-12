# Comments Tool - Full Documentation

## Overview

Comments: list, get, create.

## Threading

- Use `page_id` for new discussion
- Use `discussion_id` (from list) for replies

## Actions

### list

```json
{ "action": "list", "page_id": "xxx" }
```

### get

Retrieve a single comment by its ID.

```json
{ "action": "get", "comment_id": "xxx" }
```

### create (new discussion)

```json
{ "action": "create", "page_id": "xxx", "content": "Great work!" }
```

### create (reply)

```json
{ "action": "create", "discussion_id": "thread-id", "content": "I agree" }
```

## Parameters

- `page_id` - Page ID
- `comment_id` - Comment ID (for get action)
- `discussion_id` - Discussion ID (for replies)
- `content` - Comment content

## Known Limitations

### comments.list returns 404 (OAuth Bug)

As of 2025-09-03, the Notion API may return a 404 error when attempting to list comments using an OAuth token, even if the page exists and has comments. This is a known issue with the Notion API itself.

**Workarounds:**

1. **Use action: "get"** - If you have a specific `comment_id`, you can still retrieve it directly.
2. **Use action: "create"** - Creating new comments or replying to discussions via `discussion_id` is unaffected and works as expected.
