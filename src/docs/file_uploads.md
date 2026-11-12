# File Uploads Tool - Full Documentation

## Overview

Upload, manage, and retrieve files in Notion. Supports single and multi-part upload modes.

## Workflow

1. `create` - Create an upload session (get file_upload_id)
2. `send` - Send file data as base64 (repeat for multi-part)
3. `complete` - Finalize the upload
4. Use the file_upload_id in page/block content to reference the uploaded file

## Actions

### create

Create a file upload session.

```json
{ "action": "create", "filename": "report.pdf", "content_type": "application/pdf" }
```

Multi-part upload (for large files):

```json
{ "action": "create", "filename": "video.mp4", "content_type": "video/mp4", "mode": "multi_part", "number_of_parts": 3 }
```

### send

Send file data (base64-encoded) to an upload session.

```json
{ "action": "send", "file_upload_id": "xxx", "file_content": "<base64-encoded-data>" }
```

For multi-part uploads, specify the part number:

```json
{ "action": "send", "file_upload_id": "xxx", "file_content": "<base64-encoded-data>", "part_number": 1 }
```

### complete

Complete the upload session.

```json
{ "action": "complete", "file_upload_id": "xxx" }
```

### retrieve

Get details about a file upload.

```json
{ "action": "retrieve", "file_upload_id": "xxx" }
```

### list

List all file uploads with optional limit.

```json
{ "action": "list", "limit": 10 }
```

## Parameters

- `file_upload_id` - File upload ID (required for send, complete, retrieve)
- `filename` - File name (required for create)
- `content_type` - MIME type (required for create, e.g., "image/png", "application/pdf")
- `mode` - Upload mode: "single" (default) or "multi_part"
- `number_of_parts` - Number of parts for multi-part uploads
- `part_number` - Part number when sending multi-part data
- `file_content` - Base64-encoded file content (for send)
- `limit` - Max results for list action
