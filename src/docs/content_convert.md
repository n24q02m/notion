# Content Convert Tool - Full Documentation

## Overview

Convert: markdown-to-blocks, blocks-to-markdown.

## Note

Most tools (pages, blocks) handle markdown automatically. Use this for preview/validation only.

## Supported Markdown Syntax

### Block-level

- `# H1`, `## H2`, `### H3` - Headings
- Plain text - Paragraphs
- `- item` / `* item` - Bulleted lists
- `1. item` - Numbered lists
- `- [ ] task` / `- [x] done` - To-do items
- ` ```lang ``` ` - Code blocks
- `> text` - Blockquotes
- `---` / `***` - Dividers
- `> [!TYPE] text` - Callouts (NOTE, TIP, WARNING, IMPORTANT, CAUTION, INFO, SUCCESS, ERROR)
- `<details><summary>Title</summary>content</details>` - Toggles
- `| col | col |` with `| --- | --- |` - Tables
- `![alt](url)` - Images
- `[bookmark](url)` - Bookmarks
- `[embed](url)` - Embeds
- `$$expr$$` or `$$\n...\n$$` - Equations
- `:::columns` / `:::column` / `:::end` - Column layouts
- `[toc]` - Table of Contents
- `[breadcrumb]` - Breadcrumb

### Inline formatting

- `**bold**` - Bold
- `*italic*` - Italic
- `` `code` `` - Inline code
- `~~strikethrough~~` - Strikethrough
- `[text](url)` - Links

## Actions

### markdown-to-blocks

```json
{ "direction": "markdown-to-blocks", "content": "# Heading\nParagraph\n- List item" }
```

### blocks-to-markdown

```json
{"direction": "blocks-to-markdown", "content": [{"type": "paragraph", "paragraph": {...}}]}
```

## Parameters

- `direction` - "markdown-to-blocks" or "blocks-to-markdown"
- `content` - String (markdown) or array (blocks)
