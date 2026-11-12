# Users Tool - Full Documentation

## Overview

User info: list, get, me, from_workspace.

## Important

- `list` and `get` require **Enterprise plan** or explicit `read_user` capability granted by workspace admin. Most integrations will get "Integration does not have ability to..." error.
- Use `me` to get the bot's own info (always works).
- Use `from_workspace` as a reliable fallback — extracts users from created_by/last_edited_by metadata in accessible pages (no special permissions needed).

## Actions

### me

```json
{ "action": "me" }
```
Returns bot/integration info.

### list

```json
{ "action": "list" }
```
Requires user:read permission.

### get

```json
{ "action": "get", "user_id": "xxx" }
```

### from_workspace

```json
{ "action": "from_workspace" }
```
Extracts users from created_by/last_edited_by in accessible pages.

## Parameters

- `user_id` - User ID (for get action)
