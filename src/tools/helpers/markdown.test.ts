import { describe, expect, it } from 'vitest'
import type { NotionBlock, RichText } from './markdown'
import { blocksToMarkdown, extractPlainText, markdownToBlocks, parseRichText } from './markdown'

// ============================================================
// Helpers
// ============================================================

function plainRichText(content: string): RichText {
  return {
    type: 'text',
    text: { content, link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default'
    }
  }
}

function getRichTextContent(block: NotionBlock): string {
  const key = block.type
  const richText: RichText[] = block[key]?.rich_text ?? []
  return richText.map((rt: RichText) => rt.text.content).join('')
}

// ============================================================
// markdownToBlocks
// ============================================================

describe('markdownToBlocks', () => {
  describe('empty input', () => {
    it('should return empty array for empty string', () => {
      expect(markdownToBlocks('')).toEqual([])
    })

    it('should return empty array for whitespace-only input', () => {
      expect(markdownToBlocks('   \n  \n  ')).toEqual([])
    })
  })

  describe('headings', () => {
    it('should parse heading level 1', () => {
      const blocks = markdownToBlocks('# Hello')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('heading_1')
      expect(getRichTextContent(blocks[0])).toBe('Hello')
    })

    it('should parse heading level 2', () => {
      const blocks = markdownToBlocks('## World')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('heading_2')
      expect(getRichTextContent(blocks[0])).toBe('World')
    })

    it('should parse heading level 3', () => {
      const blocks = markdownToBlocks('### Subtitle')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('heading_3')
      expect(getRichTextContent(blocks[0])).toBe('Subtitle')
    })

    it('should set color to default', () => {
      const blocks = markdownToBlocks('# Title')
      expect(blocks[0].heading_1.color).toBe('default')
    })
  })

  describe('paragraphs', () => {
    it('should parse plain text as paragraph', () => {
      const blocks = markdownToBlocks('Hello world')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('paragraph')
      expect(getRichTextContent(blocks[0])).toBe('Hello world')
    })

    it('should skip empty lines between paragraphs', () => {
      const blocks = markdownToBlocks('First\n\nSecond')
      expect(blocks).toHaveLength(2)
      expect(blocks[0].type).toBe('paragraph')
      expect(blocks[1].type).toBe('paragraph')
      expect(getRichTextContent(blocks[0])).toBe('First')
      expect(getRichTextContent(blocks[1])).toBe('Second')
    })
  })

  describe('bulleted lists', () => {
    it('should parse dash-prefixed items', () => {
      const blocks = markdownToBlocks('- First\n- Second')
      expect(blocks).toHaveLength(2)
      expect(blocks[0].type).toBe('bulleted_list_item')
      expect(blocks[1].type).toBe('bulleted_list_item')
      expect(getRichTextContent(blocks[0])).toBe('First')
      expect(getRichTextContent(blocks[1])).toBe('Second')
    })
    it('should parse indented bulleted items', () => {
      const blocks = markdownToBlocks('  - First\n    - Second')
      expect(blocks).toHaveLength(2)
      expect(blocks[0].type).toBe('bulleted_list_item')
      expect(blocks[1].type).toBe('bulleted_list_item')
      expect(getRichTextContent(blocks[0])).toBe('First')
      expect(getRichTextContent(blocks[1])).toBe('Second')
    })

    it('should parse asterisk-prefixed items', () => {
      const blocks = markdownToBlocks('* Item A\n* Item B')
      expect(blocks).toHaveLength(2)
      expect(blocks[0].type).toBe('bulleted_list_item')
      expect(getRichTextContent(blocks[0])).toBe('Item A')
    })
  })

  describe('numbered lists', () => {
    it('should parse numbered items', () => {
      const blocks = markdownToBlocks('1. First\n2. Second\n3. Third')
      expect(blocks).toHaveLength(3)
      for (const block of blocks) {
        expect(block.type).toBe('numbered_list_item')
      }
      expect(getRichTextContent(blocks[0])).toBe('First')
      expect(getRichTextContent(blocks[2])).toBe('Third')
    })
    it('should parse indented numbered items', () => {
      const blocks = markdownToBlocks('  1. One\n    2. Two')
      expect(blocks).toHaveLength(2)
      expect(blocks[0].type).toBe('numbered_list_item')
      expect(blocks[1].type).toBe('numbered_list_item')
    })
  })

  describe('todo / checkbox', () => {
    it('should parse unchecked todo item', () => {
      const blocks = markdownToBlocks('- [ ] Buy milk')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('to_do')
      expect(blocks[0].to_do.checked).toBe(false)
      expect(getRichTextContent(blocks[0])).toBe('Buy milk')
    })

    it('should parse checked todo item with lowercase x', () => {
      const blocks = markdownToBlocks('- [x] Done task')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].to_do.checked).toBe(true)
      expect(getRichTextContent(blocks[0])).toBe('Done task')
    })

    it('should parse checked todo item with uppercase X', () => {
      const blocks = markdownToBlocks('- [X] Also done')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].to_do.checked).toBe(true)
    })

    it('should handle mixed checked and unchecked items', () => {
      const blocks = markdownToBlocks('- [ ] Pending\n- [x] Complete')
      expect(blocks).toHaveLength(2)
      expect(blocks[0].to_do.checked).toBe(false)
      expect(blocks[1].to_do.checked).toBe(true)
    })
    it('should parse todo item with plus bullet', () => {
      const blocks = markdownToBlocks('+ [ ] Plus todo')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('to_do')
      expect(blocks[0].to_do.checked).toBe(false)
      expect(getRichTextContent(blocks[0])).toBe('Plus todo')
    })

    it('should parse indented todo item', () => {
      const blocks = markdownToBlocks('  - [ ] Indented')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('to_do')
      expect(getRichTextContent(blocks[0])).toBe('Indented')
    })

    it('should parse todo item without text', () => {
      const blocks = markdownToBlocks('- [ ]')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('to_do')
      expect(getRichTextContent(blocks[0])).toBe('')
    })

    it('should parse todo item with asterisk bullet', () => {
      const blocks = markdownToBlocks('* [x] Asterisk')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('to_do')
      expect(blocks[0].to_do.checked).toBe(true)
      expect(getRichTextContent(blocks[0])).toBe('Asterisk')
    })
  })

  describe('code blocks', () => {
    it('should parse code block with language', () => {
      const blocks = markdownToBlocks('```typescript\nconst x = 1\n```')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('code')
      expect(blocks[0].code.language).toBe('typescript')
      expect(blocks[0].code.rich_text[0].text.content).toBe('const x = 1')
    })

    it('should parse code block without language as plain text', () => {
      const blocks = markdownToBlocks('```\nhello\n```')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].code.language).toBe('plain text')
    })

    it('should preserve multi-line code content', () => {
      const code = '```js\nline1\nline2\nline3\n```'
      const blocks = markdownToBlocks(code)
      expect(blocks[0].code.rich_text[0].text.content).toBe('line1\nline2\nline3')
    })
  })

  describe('quotes', () => {
    it('should parse blockquote', () => {
      const blocks = markdownToBlocks('> This is a quote')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('quote')
      expect(getRichTextContent(blocks[0])).toBe('This is a quote')
    })
  })

  describe('dividers', () => {
    it('should parse triple dash divider', () => {
      const blocks = markdownToBlocks('---')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('divider')
      expect(blocks[0].divider).toEqual({})
    })

    it('should parse triple asterisk divider', () => {
      const blocks = markdownToBlocks('***')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('divider')
    })

    it('should parse longer dash dividers', () => {
      const blocks = markdownToBlocks('-----')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('divider')
    })
  })

  describe('callouts', () => {
    it('should parse NOTE callout', () => {
      const blocks = markdownToBlocks('> [!NOTE] This is a note')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('callout')
      expect(getRichTextContent(blocks[0])).toBe('This is a note')
      expect(blocks[0].callout.color).toBe('blue_background')
    })

    it('should parse TIP callout', () => {
      const blocks = markdownToBlocks('> [!TIP] Helpful tip')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].callout.color).toBe('green_background')
    })

    it('should parse WARNING callout', () => {
      const blocks = markdownToBlocks('> [!WARNING] Be careful')
      expect(blocks[0].callout.color).toBe('yellow_background')
    })

    it('should parse IMPORTANT callout', () => {
      const blocks = markdownToBlocks('> [!IMPORTANT] Critical info')
      expect(blocks[0].callout.color).toBe('purple_background')
    })

    it('should parse CAUTION callout', () => {
      const blocks = markdownToBlocks('> [!CAUTION] Danger zone')
      expect(blocks[0].callout.color).toBe('red_background')
    })

    it('should parse INFO callout', () => {
      const blocks = markdownToBlocks('> [!INFO] Information')
      expect(blocks[0].callout.color).toBe('blue_background')
    })

    it('should parse SUCCESS callout', () => {
      const blocks = markdownToBlocks('> [!SUCCESS] All passed')
      expect(blocks[0].callout.color).toBe('green_background')
    })

    it('should parse ERROR callout', () => {
      const blocks = markdownToBlocks('> [!ERROR] Something failed')
      expect(blocks[0].callout.color).toBe('red_background')
    })

    it('should have emoji icon', () => {
      const blocks = markdownToBlocks('> [!NOTE] Text')
      expect(blocks[0].callout.icon).toBeDefined()
      expect(blocks[0].callout.icon.type).toBe('emoji')
      expect(blocks[0].callout.icon.emoji).toBeTruthy()
    })

    it('should use correct Unicode emoji for each callout type', () => {
      const cases: [string, string][] = [
        ['NOTE', '\u2139\ufe0f'],
        ['TIP', '\u{1f4a1}'],
        ['IMPORTANT', '\u2757'],
        ['WARNING', '\u26a0\ufe0f'],
        ['CAUTION', '\u{1f6d1}'],
        ['INFO', '\u2139\ufe0f'],
        ['SUCCESS', '\u2705'],
        ['ERROR', '\u274c']
      ]
      for (const [type, expectedEmoji] of cases) {
        const blocks = markdownToBlocks(`> [!${type}] Text`)
        expect(blocks[0].callout.icon.emoji).toBe(expectedEmoji)
      }
    })

    it('should round-trip TIP callout', () => {
      const blocks = markdownToBlocks('> [!TIP] Helpful tip')
      const md = blocksToMarkdown(blocks)
      expect(md).toContain('[!TIP]')
      expect(md).toContain('Helpful tip')
    })

    it('should round-trip CAUTION callout', () => {
      const blocks = markdownToBlocks('> [!CAUTION] Danger zone')
      const md = blocksToMarkdown(blocks)
      expect(md).toContain('[!CAUTION]')
      expect(md).toContain('Danger zone')
    })

    it('should handle multi-line callout with continuation lines', () => {
      const md = '> [!NOTE] First line\n> Second line\n> Third line'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('callout')
      expect(getRichTextContent(blocks[0])).toBe('First line\nSecond line\nThird line')
    })

    it('should handle callout with no inline text', () => {
      const blocks = markdownToBlocks('> [!WARNING]')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('callout')
      expect(getRichTextContent(blocks[0])).toBe('WARNING')
    })

    it('should be case-insensitive for callout type', () => {
      const blocks = markdownToBlocks('> [!note] lowercase')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('callout')
    })
  })

  describe('toggles', () => {
    it('should parse toggle with content', () => {
      const md = '<details>\n<summary>Click me</summary>\n\nHidden content\n</details>'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('toggle')
      expect(getRichTextContent(blocks[0])).toBe('Click me')
      expect(blocks[0].toggle.children).toHaveLength(1)
      expect(blocks[0].toggle.children[0].type).toBe('paragraph')
    })

    it('should parse toggle with empty content', () => {
      const md = '<details>\n<summary>Empty toggle</summary>\n</details>'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].toggle.children).toHaveLength(0)
    })

    it('should parse toggle with nested block content', () => {
      const md = '<details>\n<summary>Details</summary>\n\n# Heading inside\n\n- List item\n</details>'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      const children = blocks[0].toggle.children
      expect(children).toHaveLength(2)
      expect(children[0].type).toBe('heading_1')
      expect(children[1].type).toBe('bulleted_list_item')
    })

    it('should preserve title when summary is inline with details tag', () => {
      const md = '<details><summary>Title</summary>\nContent\n</details>'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('toggle')
      expect(getRichTextContent(blocks[0])).toBe('Title')
      expect(blocks[0].toggle.children).toHaveLength(1)
      expect(blocks[0].toggle.children[0].type).toBe('paragraph')
    })

    it('should parse all-on-one-line toggle', () => {
      const md = '<details><summary>Title</summary>Content here</details>'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('toggle')
      expect(getRichTextContent(blocks[0])).toBe('Title')
      expect(blocks[0].toggle.children).toHaveLength(1)
      expect(blocks[0].toggle.children[0].type).toBe('paragraph')
    })

    it('should parse sequential toggles as siblings', () => {
      const md =
        '<details>\n<summary>First</summary>\n\nContent 1\n</details>\n\n<details>\n<summary>Second</summary>\n\nContent 2\n</details>'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(2)
      expect(blocks[0].type).toBe('toggle')
      expect(getRichTextContent(blocks[0])).toBe('First')
      expect(blocks[0].toggle.children).toHaveLength(1)
      expect(blocks[1].type).toBe('toggle')
      expect(getRichTextContent(blocks[1])).toBe('Second')
      expect(blocks[1].toggle.children).toHaveLength(1)
    })

    it('should parse nested toggles correctly', () => {
      const md =
        '<details>\n<summary>Outer</summary>\n\n<details>\n<summary>Inner</summary>\n\nInner content\n</details>\n\n</details>'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      expect(getRichTextContent(blocks[0])).toBe('Outer')
      const outerChildren = blocks[0].toggle.children
      expect(outerChildren).toHaveLength(1)
      expect(outerChildren[0].type).toBe('toggle')
      expect(getRichTextContent(outerChildren[0])).toBe('Inner')
      expect(outerChildren[0].toggle.children).toHaveLength(1)
    })

    it('should round-trip toggle blocks preserving title and children', () => {
      const md = '<details>\n<summary>Round Trip</summary>\n\nSome content\n</details>'
      const blocks = markdownToBlocks(md)
      const output = blocksToMarkdown(blocks)
      const reparsed = markdownToBlocks(output)
      expect(reparsed).toHaveLength(1)
      expect(reparsed[0].type).toBe('toggle')
      expect(getRichTextContent(reparsed[0])).toBe('Round Trip')
      expect(reparsed[0].toggle.children).toHaveLength(1)
    })
  })

  describe('tables', () => {
    it('should parse table with header separator', () => {
      const md = '| Name | Age |\n| --- | --- |\n| Alice | 30 |'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('table')
      expect(blocks[0].table.has_column_header).toBe(true)
      expect(blocks[0].table.table_width).toBe(2)
      expect(blocks[0].table.children).toHaveLength(2)
    })

    it('should parse table without header separator', () => {
      const md = '| A | B |\n| C | D |'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].table.has_column_header).toBe(false)
      expect(blocks[0].table.children).toHaveLength(2)
    })

    it('should parse table with multiple data rows', () => {
      const md = '| H1 | H2 |\n| --- | --- |\n| r1c1 | r1c2 |\n| r2c1 | r2c2 |'
      const blocks = markdownToBlocks(md)
      // header row + 2 data rows = 3 table_row children
      expect(blocks[0].table.children).toHaveLength(3)
    })

    it('should extract cell text correctly', () => {
      const md = '| Name | Value |\n| --- | --- |\n| key | 42 |'
      const blocks = markdownToBlocks(md)
      const headerCells = blocks[0].table.children[0].table_row.cells
      expect(headerCells[0][0].text.content).toBe('Name')
      expect(headerCells[1][0].text.content).toBe('Value')
      const dataCells = blocks[0].table.children[1].table_row.cells
      expect(dataCells[0][0].text.content).toBe('key')
      expect(dataCells[1][0].text.content).toBe('42')
    })

    it('should parse bold text in table cells', () => {
      const md = '| Header |\n| --- |\n| **bold** |'
      const blocks = markdownToBlocks(md)
      const cell = blocks[0].table.children[1].table_row.cells[0]
      expect(cell).toHaveLength(1)
      expect(cell[0].text.content).toBe('bold')
      expect(cell[0].annotations.bold).toBe(true)
    })

    it('should parse italic text in table cells', () => {
      const md = '| Header |\n| --- |\n| *italic* |'
      const blocks = markdownToBlocks(md)
      const cell = blocks[0].table.children[1].table_row.cells[0]
      expect(cell[0].text.content).toBe('italic')
      expect(cell[0].annotations.italic).toBe(true)
    })

    it('should parse inline code in table cells', () => {
      const md = '| Header |\n| --- |\n| `code` |'
      const blocks = markdownToBlocks(md)
      const cell = blocks[0].table.children[1].table_row.cells[0]
      expect(cell[0].text.content).toBe('code')
      expect(cell[0].annotations.code).toBe(true)
    })

    it('should parse links in table cells', () => {
      const md = '| Header |\n| --- |\n| [click](https://example.com) |'
      const blocks = markdownToBlocks(md)
      const cell = blocks[0].table.children[1].table_row.cells[0]
      expect(cell[0].text.content).toBe('click')
      expect(cell[0].text.link).toEqual({ url: 'https://example.com' })
    })

    it('should parse mixed formatting in table cells', () => {
      const md = '| Header |\n| --- |\n| **bold** and *italic* |'
      const blocks = markdownToBlocks(md)
      const cell = blocks[0].table.children[1].table_row.cells[0]
      // Should have multiple rich text segments
      expect(cell.length).toBeGreaterThan(1)
      const boldSegment = cell.find((rt: any) => rt.annotations?.bold)
      expect(boldSegment).toBeDefined()
      expect(boldSegment.text.content).toBe('bold')
    })

    it('should parse rich text in header cells', () => {
      const md = '| **Bold Header** |\n| --- |\n| data |'
      const blocks = markdownToBlocks(md)
      const headerCell = blocks[0].table.children[0].table_row.cells[0]
      expect(headerCell[0].text.content).toBe('Bold Header')
      expect(headerCell[0].annotations.bold).toBe(true)
    })
  })

  describe('images', () => {
    it('should parse image with alt text', () => {
      const blocks = markdownToBlocks('![A cat](https://example.com/cat.png)')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('image')
      expect(blocks[0].image.external.url).toBe('https://example.com/cat.png')
      expect(blocks[0].image.caption[0].text.content).toBe('A cat')
    })

    it('should parse image without alt text', () => {
      const blocks = markdownToBlocks('![](https://example.com/img.png)')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].image.external.url).toBe('https://example.com/img.png')
      expect(blocks[0].image.caption).toHaveLength(0)
    })
  })

  describe('bookmarks', () => {
    it('should parse bookmark link', () => {
      const blocks = markdownToBlocks('[bookmark](https://example.com)')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('bookmark')
      expect(blocks[0].bookmark.url).toBe('https://example.com')
    })
  })

  describe('embeds', () => {
    it('should parse embed link', () => {
      const blocks = markdownToBlocks('[embed](https://youtube.com/watch?v=abc)')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('embed')
      expect(blocks[0].embed.url).toBe('https://youtube.com/watch?v=abc')
    })
  })

  describe('equations', () => {
    it('should parse single-line equation', () => {
      const blocks = markdownToBlocks('$$E = mc^2$$')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('equation')
      expect(blocks[0].equation.expression).toBe('E = mc^2')
    })

    it('should parse multi-line equation', () => {
      const md = '$$\nx^2 + y^2 = z^2\n$$'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('equation')
      expect(blocks[0].equation.expression).toBe('x^2 + y^2 = z^2')
    })

    it('should preserve newlines in multi-line equations', () => {
      const md = '$$\na = 1\nb = 2\nc = a + b\n$$'
      const blocks = markdownToBlocks(md)
      expect(blocks[0].equation.expression).toBe('a = 1\nb = 2\nc = a + b')
    })
  })

  describe('columns', () => {
    it('should parse column layout', () => {
      const md = ':::columns\n:::column\nLeft content\n:::column\nRight content\n:::end'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('column_list')
      const columns = blocks[0].column_list.children
      expect(columns).toHaveLength(2)
      expect(columns[0].type).toBe('column')
      expect(columns[1].type).toBe('column')
    })

    it('should parse column children as blocks', () => {
      const md = ':::columns\n:::column\n# Left heading\n:::column\n- List item\n:::end'
      const blocks = markdownToBlocks(md)
      const col1Children = blocks[0].column_list.children[0].column.children
      const col2Children = blocks[0].column_list.children[1].column.children
      expect(col1Children[0].type).toBe('heading_1')
      expect(col2Children[0].type).toBe('bulleted_list_item')
    })

    it('should handle columns with multiple blocks per column', () => {
      const md = ':::columns\n:::column\n# Title\nParagraph text\n:::column\n- Item 1\n- Item 2\n:::end'
      const blocks = markdownToBlocks(md)
      const col1Children = blocks[0].column_list.children[0].column.children
      const col2Children = blocks[0].column_list.children[1].column.children
      expect(col1Children).toHaveLength(2)
      expect(col2Children).toHaveLength(2)
    })

    it('should parse callout inside column', () => {
      const md = ':::columns\n:::column\n> [!NOTE]\n> Important info\n:::column\nRight side\n:::end'
      const blocks = markdownToBlocks(md)
      const col1Children = blocks[0].column_list.children[0].column.children
      expect(col1Children[0].type).toBe('callout')
    })

    it('should parse toggle inside column', () => {
      const md =
        ':::columns\n:::column\n<details><summary>Click me</summary>\nHidden content\n</details>\n:::column\nRight side\n:::end'
      const blocks = markdownToBlocks(md)
      const col1Children = blocks[0].column_list.children[0].column.children
      expect(col1Children[0].type).toBe('toggle')
      expect(col1Children[0].toggle.children).toHaveLength(1)
    })

    it('should parse three columns', () => {
      const md = ':::columns\n:::column\nCol 1\n:::column\nCol 2\n:::column\nCol 3\n:::end'
      const blocks = markdownToBlocks(md)
      const columns = blocks[0].column_list.children
      expect(columns).toHaveLength(3)
    })

    it('should handle empty column content', () => {
      const md = ':::columns\n:::column\n:::column\nRight side\n:::end'
      const blocks = markdownToBlocks(md)
      const columns = blocks[0].column_list.children
      expect(columns).toHaveLength(2)
      // Empty column should still exist but with no children
      expect(columns[0].column.children).toHaveLength(0)
    })

    it('should parse width ratio on columns', () => {
      const md = ':::columns\n:::column{width=0.7}\nWide column\n:::column{width=0.3}\nNarrow column\n:::end'
      const blocks = markdownToBlocks(md)
      const columns = blocks[0].column_list.children
      expect(columns[0].column.format?.column_ratio).toBe(0.7)
      expect(columns[1].column.format?.column_ratio).toBe(0.3)
    })

    it('should parse columns without width ratio (default)', () => {
      const md = ':::columns\n:::column\nLeft\n:::column\nRight\n:::end'
      const blocks = markdownToBlocks(md)
      const columns = blocks[0].column_list.children
      expect(columns[0].column.format).toBeUndefined()
      expect(columns[1].column.format).toBeUndefined()
    })
  })

  describe('table of contents', () => {
    it('should parse [toc]', () => {
      const blocks = markdownToBlocks('[toc]')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('table_of_contents')
    })

    it('should parse [TOC] (uppercase)', () => {
      const blocks = markdownToBlocks('[TOC]')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('table_of_contents')
    })
  })

  describe('breadcrumb', () => {
    it('should parse [breadcrumb]', () => {
      const blocks = markdownToBlocks('[breadcrumb]')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('breadcrumb')
    })

    it('should parse [BREADCRUMB] (uppercase)', () => {
      const blocks = markdownToBlocks('[BREADCRUMB]')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('breadcrumb')
    })
  })

  describe('mixed content', () => {
    it('should parse headings + lists + paragraphs together', () => {
      const md = '# Title\n\nSome text\n\n- Item 1\n- Item 2\n\n## Subtitle\n\n1. First\n2. Second'
      const blocks = markdownToBlocks(md)
      expect(blocks[0].type).toBe('heading_1')
      expect(blocks[1].type).toBe('paragraph')
      expect(blocks[2].type).toBe('bulleted_list_item')
      expect(blocks[3].type).toBe('bulleted_list_item')
      expect(blocks[4].type).toBe('heading_2')
      expect(blocks[5].type).toBe('numbered_list_item')
      expect(blocks[6].type).toBe('numbered_list_item')
    })

    it('should flush list items when switching to non-list content', () => {
      const md = '- Item A\n- Item B\nParagraph after list'
      const blocks = markdownToBlocks(md)
      expect(blocks[0].type).toBe('bulleted_list_item')
      expect(blocks[1].type).toBe('bulleted_list_item')
      expect(blocks[2].type).toBe('paragraph')
    })

    it('should flush remaining list items at end of input', () => {
      const md = '- Last item 1\n- Last item 2'
      const blocks = markdownToBlocks(md)
      expect(blocks).toHaveLength(2)
      expect(blocks[0].type).toBe('bulleted_list_item')
      expect(blocks[1].type).toBe('bulleted_list_item')
    })
  })
})

// ============================================================
// blocksToMarkdown
// ============================================================

describe('blocksToMarkdown', () => {
  describe('headings', () => {
    it('should convert heading_1 to # markdown', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: { rich_text: [plainRichText('Title')], color: 'default' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('# Title')
    })

    it('should convert heading_2 to ## markdown', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: { rich_text: [plainRichText('Sub')], color: 'default' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('## Sub')
    })

    it('should convert heading_3 to ### markdown', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'heading_3',
          heading_3: { rich_text: [plainRichText('Deep')], color: 'default' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('### Deep')
    })
  })

  describe('paragraphs', () => {
    it('should convert paragraph to plain text', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: { rich_text: [plainRichText('Hello world')], color: 'default' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('Hello world')
    })
  })

  describe('bulleted lists', () => {
    it('should convert bulleted_list_item to - prefixed line', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: { rich_text: [plainRichText('Item')], color: 'default' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('- Item')
    })
  })

  describe('numbered lists', () => {
    it('should convert numbered_list_item to 1. prefixed line', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: { rich_text: [plainRichText('Step')], color: 'default' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('1. Step')
    })
  })

  describe('todo items', () => {
    it('should convert unchecked to_do to - [ ] format', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'to_do',
          to_do: { rich_text: [plainRichText('Task')], checked: false, color: 'default' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('- [ ] Task')
    })

    it('should convert checked to_do to - [x] format', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'to_do',
          to_do: { rich_text: [plainRichText('Done')], checked: true, color: 'default' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('- [x] Done')
    })
  })

  describe('code blocks', () => {
    it('should convert code block with language', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'code',
          code: { rich_text: [plainRichText('const x = 1')], language: 'javascript' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('```javascript\nconst x = 1\n```')
    })

    it('should convert code block without language', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'code',
          code: { rich_text: [plainRichText('hello')], language: '' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('```\nhello\n```')
    })
  })

  describe('quotes', () => {
    it('should convert quote block to > format', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'quote',
          quote: { rich_text: [plainRichText('Wise words')], color: 'default' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('> Wise words')
    })
  })

  describe('dividers', () => {
    it('should convert divider to ---', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'divider',
          divider: {}
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('---')
    })
  })

  describe('callouts', () => {
    it('should convert callout to > [!TYPE] format', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [plainRichText('Important info')],
            icon: { type: 'emoji', emoji: '\u2757' },
            color: 'purple_background'
          }
        }
      ]
      const md = blocksToMarkdown(blocks)
      expect(md).toMatch(/^> \[!IMPORTANT\] Important info$/)
    })

    it('should default to NOTE for unknown icon', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [plainRichText('Some text')],
            icon: { type: 'emoji', emoji: '\u{1F600}' },
            color: 'gray_background'
          }
        }
      ]
      const md = blocksToMarkdown(blocks)
      expect(md).toContain('[!NOTE]')
    })
  })

  describe('toggles', () => {
    it('should convert toggle to <details> HTML', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'toggle',
          toggle: {
            rich_text: [plainRichText('Toggle title')],
            color: 'default',
            children: [
              {
                object: 'block',
                type: 'paragraph',
                paragraph: { rich_text: [plainRichText('Hidden text')], color: 'default' }
              }
            ]
          }
        }
      ]
      const md = blocksToMarkdown(blocks)
      expect(md).toContain('<details>')
      expect(md).toContain('<summary>Toggle title</summary>')
      expect(md).toContain('Hidden text')
      expect(md).toContain('</details>')
    })

    it('should convert toggle without children', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'toggle',
          toggle: {
            rich_text: [plainRichText('Empty toggle')],
            color: 'default',
            children: []
          }
        }
      ]
      const md = blocksToMarkdown(blocks)
      expect(md).toBe('<details>\n<summary>Empty toggle</summary>\n</details>')
    })
  })

  describe('images', () => {
    it('should convert external image to ![alt](url)', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'image',
          image: {
            type: 'external',
            external: { url: 'https://example.com/img.png' },
            caption: [plainRichText('Alt text')]
          }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('![Alt text](https://example.com/img.png)')
    })

    it('should handle image without caption', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'image',
          image: {
            type: 'external',
            external: { url: 'https://example.com/img.png' },
            caption: []
          }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('![](https://example.com/img.png)')
    })
  })

  describe('bookmarks', () => {
    it('should convert bookmark to [bookmark](url)', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'bookmark',
          bookmark: { url: 'https://example.com', caption: [] }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[bookmark](https://example.com)')
    })
  })

  describe('embeds', () => {
    it('should convert embed to [embed](url)', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'embed',
          embed: { url: 'https://youtube.com/watch?v=abc' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[embed](https://youtube.com/watch?v=abc)')
    })
  })

  describe('equations', () => {
    it('should convert equation to $$expression$$', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'equation',
          equation: { expression: 'E = mc^2' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('$$E = mc^2$$')
    })
  })

  describe('tables', () => {
    it('should convert table with header to pipe-delimited format', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'table',
          table: {
            table_width: 2,
            has_column_header: true,
            has_row_header: false,
            children: [
              {
                object: 'block',
                type: 'table_row',
                table_row: { cells: [[plainRichText('H1')], [plainRichText('H2')]] }
              },
              {
                object: 'block',
                type: 'table_row',
                table_row: { cells: [[plainRichText('A')], [plainRichText('B')]] }
              }
            ]
          }
        }
      ]
      const md = blocksToMarkdown(blocks)
      const lines = md.split('\n')
      expect(lines[0]).toBe('| H1 | H2 |')
      expect(lines[1]).toBe('| --- | --- |')
      expect(lines[2]).toBe('| A | B |')
    })

    it('should convert table without header (no separator row)', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'table',
          table: {
            table_width: 2,
            has_column_header: false,
            has_row_header: false,
            children: [
              {
                object: 'block',
                type: 'table_row',
                table_row: { cells: [[plainRichText('A')], [plainRichText('B')]] }
              },
              {
                object: 'block',
                type: 'table_row',
                table_row: { cells: [[plainRichText('C')], [plainRichText('D')]] }
              }
            ]
          }
        }
      ]
      const md = blocksToMarkdown(blocks)
      const lines = md.split('\n')
      expect(lines).toHaveLength(2)
      expect(lines[0]).toBe('| A | B |')
      expect(lines[1]).toBe('| C | D |')
    })
  })

  describe('column_list', () => {
    it('should convert column_list to :::columns format', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'column_list',
          column_list: {
            children: [
              {
                object: 'block',
                type: 'column',
                column: {
                  children: [
                    {
                      object: 'block',
                      type: 'paragraph',
                      paragraph: { rich_text: [plainRichText('Left')], color: 'default' }
                    }
                  ]
                }
              },
              {
                object: 'block',
                type: 'column',
                column: {
                  children: [
                    {
                      object: 'block',
                      type: 'paragraph',
                      paragraph: { rich_text: [plainRichText('Right')], color: 'default' }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
      const md = blocksToMarkdown(blocks)
      expect(md).toContain(':::columns')
      expect(md).toContain(':::column')
      expect(md).toContain('Left')
      expect(md).toContain('Right')
      expect(md).toContain(':::end')
    })

    it('should emit width ratio on columns', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'column_list',
          column_list: {
            children: [
              {
                object: 'block',
                type: 'column',
                column: {
                  children: [
                    {
                      object: 'block',
                      type: 'paragraph',
                      paragraph: { rich_text: [plainRichText('Wide')], color: 'default' }
                    }
                  ],
                  format: { column_ratio: 0.7 }
                }
              },
              {
                object: 'block',
                type: 'column',
                column: {
                  children: [
                    {
                      object: 'block',
                      type: 'paragraph',
                      paragraph: { rich_text: [plainRichText('Narrow')], color: 'default' }
                    }
                  ],
                  format: { column_ratio: 0.3 }
                }
              }
            ]
          }
        }
      ]
      const md = blocksToMarkdown(blocks)
      expect(md).toContain(':::column{width=0.7}')
      expect(md).toContain(':::column{width=0.3}')
    })

    it('should round-trip columns with width ratios', () => {
      const md = ':::columns\n:::column{width=0.7}\nWide content\n:::column{width=0.3}\nNarrow content\n:::end'
      const blocks = markdownToBlocks(md)
      const result = blocksToMarkdown(blocks)
      expect(result).toContain(':::column{width=0.7}')
      expect(result).toContain(':::column{width=0.3}')
      expect(result).toContain('Wide content')
      expect(result).toContain('Narrow content')
    })

    it('should round-trip columns with callout inside', () => {
      const md = ':::columns\n:::column\n> [!NOTE]\n> Important info\n:::column\nRight side\n:::end'
      const blocks = markdownToBlocks(md)
      const result = blocksToMarkdown(blocks)
      expect(result).toContain(':::columns')
      expect(result).toContain('> [!NOTE]')
      expect(result).toContain('Right side')
      expect(result).toContain(':::end')
    })
  })

  describe('table_of_contents', () => {
    it('should convert table_of_contents to [toc]', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'table_of_contents',
          table_of_contents: { color: 'default' }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[toc]')
    })
  })

  describe('breadcrumb', () => {
    it('should convert breadcrumb to [breadcrumb]', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'breadcrumb',
          breadcrumb: {}
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[breadcrumb]')
    })
  })

  describe('nested children', () => {
    it('should render nested bulleted list items with indentation', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [plainRichText('Parent')],
            color: 'default',
            children: [
              {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: { rich_text: [plainRichText('Child 1')], color: 'default' }
              },
              {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: { rich_text: [plainRichText('Child 2')], color: 'default' }
              }
            ]
          }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('- Parent\n  - Child 1\n  - Child 2')
    })

    it('should render nested numbered list items with indentation', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [plainRichText('Step 1')],
            color: 'default',
            children: [
              {
                object: 'block',
                type: 'numbered_list_item',
                numbered_list_item: { rich_text: [plainRichText('Sub-step')], color: 'default' }
              }
            ]
          }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('1. Step 1\n  1. Sub-step')
    })

    it('should render nested to_do items with indentation', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [plainRichText('Main task')],
            checked: false,
            color: 'default',
            children: [
              {
                object: 'block',
                type: 'to_do',
                to_do: { rich_text: [plainRichText('Sub-task')], checked: true, color: 'default' }
              }
            ]
          }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('- [ ] Main task\n  - [x] Sub-task')
    })

    it('should render quote with nested children', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'quote',
          quote: {
            rich_text: [plainRichText('Quote text')],
            color: 'default',
            children: [
              {
                object: 'block',
                type: 'paragraph',
                paragraph: { rich_text: [plainRichText('Nested paragraph')], color: 'default' }
              }
            ]
          }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('> Quote text\n> Nested paragraph')
    })

    it('should render callout with nested children', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [plainRichText('Important')],
            icon: { type: 'emoji', emoji: '\u2757' },
            color: 'red_background',
            children: [
              {
                object: 'block',
                type: 'paragraph',
                paragraph: { rich_text: [plainRichText('Details here')], color: 'default' }
              }
            ]
          }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('> [!IMPORTANT] Important\n> Details here')
    })

    it('should render heading with nested children', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [plainRichText('Section')],
            color: 'default',
            children: [
              {
                object: 'block',
                type: 'paragraph',
                paragraph: { rich_text: [plainRichText('Content under heading')], color: 'default' }
              }
            ]
          }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('# Section\nContent under heading')
    })

    it('should handle deeply nested bulleted lists', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [plainRichText('Level 1')],
            color: 'default',
            children: [
              {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [plainRichText('Level 2')],
                  color: 'default',
                  children: [
                    {
                      object: 'block',
                      type: 'bulleted_list_item',
                      bulleted_list_item: { rich_text: [plainRichText('Level 3')], color: 'default' }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('- Level 1\n  - Level 2\n    - Level 3')
    })
  })

  describe('media blocks', () => {
    it('should render file block as link', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'file',
          file: { file: { url: 'https://example.com/doc.pdf' }, name: 'document.pdf', caption: [] }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[document.pdf](https://example.com/doc.pdf)')
    })

    it('should render pdf block as link', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'pdf',
          pdf: { external: { url: 'https://example.com/report.pdf' }, caption: [] }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[pdf](https://example.com/report.pdf)')
    })

    it('should render video block as link', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'video',
          video: { external: { url: 'https://youtube.com/watch?v=123' }, caption: [] }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[video](https://youtube.com/watch?v=123)')
    })

    it('should render audio block as link', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'audio',
          audio: { file: { url: 'https://example.com/song.mp3' }, caption: [] }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[audio](https://example.com/song.mp3)')
    })

    it('should use caption as name when name is absent', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'file',
          file: {
            file: { url: 'https://example.com/f.zip' },
            caption: [
              {
                type: 'text',
                text: { content: 'My archive' },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default'
                }
              }
            ]
          }
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[My archive](https://example.com/f.zip)')
    })
  })

  describe('child page and database blocks', () => {
    it('should render child_page as link', () => {
      const blocks: NotionBlock[] = [
        { object: 'block', type: 'child_page', id: 'page-123', child_page: { title: 'My Sub Page' } }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[My Sub Page](page-123)')
    })

    it('should render child_database as link', () => {
      const blocks: NotionBlock[] = [
        { object: 'block', type: 'child_database', id: 'db-456', child_database: { title: 'Tasks DB' } }
      ]
      expect(blocksToMarkdown(blocks)).toBe('[Tasks DB](db-456)')
    })
  })

  describe('unsupported block types', () => {
    it('should skip unknown block types', () => {
      const blocks: NotionBlock[] = [
        {
          object: 'block',
          type: 'unsupported',
          unsupported: {}
        }
      ]
      expect(blocksToMarkdown(blocks)).toBe('')
    })
  })
})

// ============================================================
// parseRichText
// ============================================================

describe('parseRichText', () => {
  it('should parse plain text', () => {
    const result = parseRichText('Hello')
    expect(result).toHaveLength(1)
    expect(result[0].text.content).toBe('Hello')
    expect(result[0].annotations.bold).toBe(false)
    expect(result[0].annotations.italic).toBe(false)
  })

  it('should parse bold text', () => {
    const result = parseRichText('**bold**')
    const boldPart = result.find((rt) => rt.annotations.bold)
    expect(boldPart).toBeDefined()
    expect(boldPart!.text.content).toBe('bold')
  })

  it('should parse italic text', () => {
    const result = parseRichText('*italic*')
    const italicPart = result.find((rt) => rt.annotations.italic)
    expect(italicPart).toBeDefined()
    expect(italicPart!.text.content).toBe('italic')
  })

  it('should parse inline code', () => {
    const result = parseRichText('`code`')
    const codePart = result.find((rt) => rt.annotations.code)
    expect(codePart).toBeDefined()
    expect(codePart!.text.content).toBe('code')
  })

  it('should parse strikethrough text', () => {
    const result = parseRichText('~~deleted~~')
    const strikePart = result.find((rt) => rt.annotations.strikethrough)
    expect(strikePart).toBeDefined()
    expect(strikePart!.text.content).toBe('deleted')
  })

  it('should parse link', () => {
    const result = parseRichText('[click here](https://example.com)')
    const linkPart = result.find((rt) => rt.text.link)
    expect(linkPart).toBeDefined()
    expect(linkPart!.text.content).toBe('click here')
    expect(linkPart!.text.link!.url).toBe('https://example.com')
  })

  it('should parse mixed plain and bold text', () => {
    const result = parseRichText('Hello **world** end')
    expect(result).toHaveLength(3)
    expect(result[0].text.content).toBe('Hello ')
    expect(result[0].annotations.bold).toBe(false)
    expect(result[1].text.content).toBe('world')
    expect(result[1].annotations.bold).toBe(true)
    expect(result[2].text.content).toBe(' end')
    expect(result[2].annotations.bold).toBe(false)
  })

  it('should parse text with multiple formatting types', () => {
    const result = parseRichText('**bold** and *italic*')
    const boldPart = result.find((rt) => rt.annotations.bold)
    const italicPart = result.find((rt) => rt.annotations.italic)
    expect(boldPart).toBeDefined()
    expect(italicPart).toBeDefined()
    expect(boldPart!.text.content).toBe('bold')
    expect(italicPart!.text.content).toBe('italic')
  })

  it('should return rich text with empty content for empty string', () => {
    const result = parseRichText('')
    expect(result).toHaveLength(1)
    expect(result[0].text.content).toBe('')
  })

  it('should set underline to false always', () => {
    const result = parseRichText('text')
    expect(result[0].annotations.underline).toBe(false)
  })

  it('should set color to default', () => {
    const result = parseRichText('text')
    expect(result[0].annotations.color).toBe('default')
  })

  it('should set link to null for non-link text', () => {
    const result = parseRichText('plain')
    expect(result[0].text.link).toBeNull()
  })

  describe('page mentions', () => {
    it('should parse @[Title](page-id) as mention rich text', () => {
      const result = parseRichText('@[My Page](abc123def456)')
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('mention')
      expect((result[0] as any).mention).toEqual({ page: { id: 'abc123def456' } })
      expect(result[0].plain_text).toBe('My Page')
    })

    it('should parse mention with UUID page id', () => {
      const result = parseRichText('@[Test](a1b2c3d4-e5f6-7890-abcd-ef1234567890)')
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('mention')
      expect((result[0] as any).mention).toEqual({ page: { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' } })
    })

    it('should parse mention with Notion URL and extract page id', () => {
      const result = parseRichText('@[My Page](https://www.notion.so/My-Page-abc123def456abc123def456abc123de)')
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('mention')
      expect((result[0] as any).mention).toEqual({ page: { id: 'abc123def456abc123def456abc123de' } })
    })

    it('should parse mention mixed with plain text', () => {
      const result = parseRichText('See @[My Page](abc123) for details')
      expect(result).toHaveLength(3)
      expect(result[0].type).toBe('text')
      expect(result[0].text.content).toBe('See ')
      expect(result[1].type).toBe('mention')
      expect((result[1] as any).mention).toEqual({ page: { id: 'abc123' } })
      expect(result[1].plain_text).toBe('My Page')
      expect(result[2].type).toBe('text')
      expect(result[2].text.content).toBe(' for details')
    })

    it('should not confuse regular links with mentions', () => {
      const result = parseRichText('[click](https://example.com)')
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('text')
      expect(result[0].text.link!.url).toBe('https://example.com')
    })
  })
})

// ============================================================
// richTextToMarkdown (via blocksToMarkdown)
// ============================================================

describe('richTextToMarkdown mention handling', () => {
  it('should serialize page mention to @[Title](id)', () => {
    const blocks: NotionBlock[] = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'mention',
              mention: { page: { id: 'abc123' } },
              plain_text: 'My Page',
              href: 'https://www.notion.so/abc123',
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default'
              }
            }
          ],
          color: 'default'
        }
      }
    ]
    expect(blocksToMarkdown(blocks)).toBe('@[My Page](abc123)')
  })

  it('should serialize mention alongside plain text', () => {
    const blocks: NotionBlock[] = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            plainRichText('See '),
            {
              type: 'mention',
              mention: { page: { id: 'abc123' } },
              plain_text: 'My Page',
              href: 'https://www.notion.so/abc123',
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default'
              }
            },
            plainRichText(' for details')
          ],
          color: 'default'
        }
      }
    ]
    expect(blocksToMarkdown(blocks)).toBe('See @[My Page](abc123) for details')
  })

  it('should not drop mention elements silently', () => {
    const blocks: NotionBlock[] = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'mention',
              mention: { page: { id: 'xyz789' } },
              plain_text: 'Referenced Page',
              href: null,
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default'
              }
            }
          ],
          color: 'default'
        }
      }
    ]
    const result = blocksToMarkdown(blocks)
    expect(result).not.toBe('')
    expect(result).toContain('Referenced Page')
    expect(result).toContain('xyz789')
  })

  it('should handle database mention gracefully', () => {
    const blocks: NotionBlock[] = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'mention',
              mention: { database: { id: 'db123' } },
              plain_text: 'My Database',
              href: 'https://www.notion.so/db123',
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default'
              }
            }
          ],
          color: 'default'
        }
      }
    ]
    const result = blocksToMarkdown(blocks)
    expect(result).toContain('My Database')
  })
})

// ============================================================
// extractPlainText
// ============================================================

describe('extractPlainText', () => {
  it('should extract plain text from single rich text element', () => {
    const richText: RichText[] = [plainRichText('Hello')]
    expect(extractPlainText(richText)).toBe('Hello')
  })

  it('should concatenate text from multiple rich text elements', () => {
    const richText: RichText[] = [plainRichText('Hello '), plainRichText('world')]
    expect(extractPlainText(richText)).toBe('Hello world')
  })

  it('should ignore annotations and return raw content', () => {
    const richText: RichText[] = [
      {
        type: 'text',
        text: { content: 'bold text', link: null },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      }
    ]
    expect(extractPlainText(richText)).toBe('bold text')
  })

  it('should return empty string for empty array', () => {
    expect(extractPlainText([])).toBe('')
  })
})

// ============================================================
// Round-trip conversion
// ============================================================

describe('round-trip conversion', () => {
  it('should preserve heading_1 content', () => {
    const md = '# Hello World'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve heading_2 content', () => {
    const md = '## Section'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve heading_3 content', () => {
    const md = '### Subsection'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve paragraph content', () => {
    const md = 'Just a paragraph'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve bulleted list items', () => {
    const md = '- First\n- Second'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should normalize asterisk bullets to dash on round-trip', () => {
    const input = '* Item'
    const output = blocksToMarkdown(markdownToBlocks(input))
    expect(output).toBe('- Item')
  })

  it('should preserve numbered list items (always outputs 1.)', () => {
    const md = '1. First\n1. Second'
    const input = '1. First\n2. Second'
    expect(blocksToMarkdown(markdownToBlocks(input))).toBe(md)
  })

  it('should preserve unchecked todo', () => {
    const md = '- [ ] Task'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve checked todo', () => {
    const md = '- [x] Done'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve code block with language', () => {
    const md = '```python\nprint("hi")\n```'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should convert code block without language to plain text on round-trip', () => {
    const input = '```\ncode\n```'
    const output = blocksToMarkdown(markdownToBlocks(input))
    expect(output).toBe('```plain text\ncode\n```')
  })

  it('should preserve quote', () => {
    const md = '> Quoted text'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should normalize *** divider to --- on round-trip', () => {
    const input = '***'
    const output = blocksToMarkdown(markdownToBlocks(input))
    expect(output).toBe('---')
  })

  it('should preserve --- divider', () => {
    const md = '---'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve single-line equation', () => {
    const md = '$$x^2 + 1$$'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should flatten multi-line equation to single-line on round-trip', () => {
    const input = '$$\na + b\n$$'
    const output = blocksToMarkdown(markdownToBlocks(input))
    expect(output).toBe('$$a + b$$')
  })

  it('should preserve bookmark', () => {
    const md = '[bookmark](https://example.com)'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve embed', () => {
    const md = '[embed](https://youtube.com/watch?v=abc)'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve image with alt text', () => {
    const md = '![photo](https://example.com/img.png)'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve image without alt text', () => {
    const md = '![](https://example.com/img.png)'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should preserve [toc]', () => {
    const md = '[toc]'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should normalize [TOC] to [toc] on round-trip', () => {
    const input = '[TOC]'
    const output = blocksToMarkdown(markdownToBlocks(input))
    expect(output).toBe('[toc]')
  })

  it('should preserve [breadcrumb]', () => {
    const md = '[breadcrumb]'
    expect(blocksToMarkdown(markdownToBlocks(md))).toBe(md)
  })

  it('should normalize [BREADCRUMB] to [breadcrumb] on round-trip', () => {
    const input = '[BREADCRUMB]'
    const output = blocksToMarkdown(markdownToBlocks(input))
    expect(output).toBe('[breadcrumb]')
  })

  it('should preserve table with header through round-trip', () => {
    const md = '| Name | Age |\n| --- | --- |\n| Alice | 30 |'
    const output = blocksToMarkdown(markdownToBlocks(md))
    const lines = output.split('\n')
    expect(lines[0]).toBe('| Name | Age |')
    expect(lines[1]).toBe('| --- | --- |')
    expect(lines[2]).toBe('| Alice | 30 |')
  })

  it('should preserve callout type through round-trip', () => {
    const md = '> [!WARNING] Watch out'
    const output = blocksToMarkdown(markdownToBlocks(md))
    expect(output).toContain('[!WARNING]')
    expect(output).toContain('Watch out')
  })

  it('should preserve toggle through round-trip', () => {
    const md = '<details>\n<summary>FAQ</summary>\n\nAnswer here\n</details>'
    const output = blocksToMarkdown(markdownToBlocks(md))
    expect(output).toContain('<details>')
    expect(output).toContain('<summary>FAQ</summary>')
    expect(output).toContain('Answer here')
    expect(output).toContain('</details>')
  })

  it('should preserve empty input through round-trip', () => {
    expect(blocksToMarkdown(markdownToBlocks(''))).toBe('')
  })

  it('should preserve mixed content structure', () => {
    const md = '# Title\n- Item 1\n- Item 2\n---\n> Quote'
    const blocks = markdownToBlocks(md)
    const output = blocksToMarkdown(blocks)
    expect(output).toContain('# Title')
    expect(output).toContain('- Item 1')
    expect(output).toContain('- Item 2')
    expect(output).toContain('---')
    expect(output).toContain('> Quote')
  })
})

// ============================================================
// Edge inputs: unsafe URLs, unterminated syntax, sparse blocks
// ============================================================

function contents(richText: RichText[]): string {
  return richText.map((rt) => rt.text.content).join('')
}

describe('markdownToBlocks edge inputs', () => {
  it('keeps an image with an unsafe URL as a paragraph without a link', () => {
    const blocks = markdownToBlocks('![x](javascript:alert)')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].type).toBe('paragraph')
    expect(blocks[0].paragraph.rich_text.every((rt: RichText) => !rt.text.link)).toBe(true)
  })

  it('keeps a bookmark with an unsafe URL as a paragraph without a link', () => {
    const blocks = markdownToBlocks('[bookmark](javascript:alert)')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].type).toBe('paragraph')
    expect(contents(blocks[0].paragraph.rich_text)).toBe('bookmark')
    expect(blocks[0].paragraph.rich_text[0].text.link).toBeNull()
  })

  it('parses a pipe line with no closing pipe as a zero-width table', () => {
    const blocks = markdownToBlocks('|abc')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].type).toBe('table')
    expect(blocks[0].table.table_width).toBe(0)
    expect(blocks[0].table.has_column_header).toBe(false)
    expect(blocks[0].table.children).toHaveLength(1)
  })

  it('pads a data row that is shorter than the header with empty cells', () => {
    const blocks = markdownToBlocks('| a | b |\n| --- | --- |\n| x |')
    const rows = blocks[0].table.children
    expect(rows).toHaveLength(2)
    expect(contents(rows[1].table_row.cells[0])).toBe('x')
    expect(contents(rows[1].table_row.cells[1])).toBe('')
  })

  it('parses a one-line toggle with no content as an empty toggle', () => {
    const blocks = markdownToBlocks('<details><summary>T</summary></details>')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].type).toBe('toggle')
    expect(contents(blocks[0].toggle.rich_text)).toBe('T')
    expect(blocks[0].toggle.children).toEqual([])
  })

  it('keeps content that starts on the summary line and continues below it', () => {
    const blocks = markdownToBlocks('<details><summary>T</summary>first\nsecond\n</details>\nafter')
    expect(blocks.map((b) => b.type)).toEqual(['toggle', 'paragraph'])
    expect(blocks[0].toggle.children.map((b: NotionBlock) => getRichTextContent(b))).toEqual(['first', 'second'])
    expect(getRichTextContent(blocks[1])).toBe('after')
  })

  it('parses a bare <details> on the last line as an untitled empty toggle', () => {
    const blocks = markdownToBlocks('<details>')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].type).toBe('toggle')
    expect(contents(blocks[0].toggle.rich_text)).toBe('')
    expect(blocks[0].toggle.children).toEqual([])
  })

  it('leaves the title empty when the line after <details> has no summary', () => {
    const blocks = markdownToBlocks('<details>\nno summary here\n</details>')
    expect(blocks).toHaveLength(1)
    expect(contents(blocks[0].toggle.rich_text)).toBe('')
    expect(blocks[0].toggle.children.map((b: NotionBlock) => getRichTextContent(b))).toEqual(['no summary here'])
  })

  it('parses :::columns closed right away as a column list with no columns', () => {
    const blocks = markdownToBlocks(':::columns\n:::end')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].column_list.children).toEqual([])
  })

  it('flushes every column when :::end is missing', () => {
    const blocks = markdownToBlocks(':::columns\n:::column\nA\n:::column\nB')
    const columns = blocks[0].column_list.children
    expect(columns).toHaveLength(2)
    expect(getRichTextContent(columns[0].column.children[0])).toBe('A')
    expect(getRichTextContent(columns[1].column.children[0])).toBe('B')
  })

  it('flushes a single unterminated column', () => {
    const blocks = markdownToBlocks(':::columns\n:::column\nA')
    const columns = blocks[0].column_list.children
    expect(columns).toHaveLength(1)
    expect(getRichTextContent(columns[0].column.children[0])).toBe('A')
  })
})

describe('parseRichText unterminated syntax', () => {
  it.each([
    ['@[open'],
    ['@[title] tail'],
    ['@[title](no-close'],
    ['[open'],
    ['[title] tail'],
    ['[title](no-close'],
    ['a~b'],
    ['a@b']
  ])('keeps %s as literal text', (text) => {
    const richText = parseRichText(text)
    expect(contents(richText)).toBe(text)
    expect(richText.every((rt) => rt.type === 'text' && !rt.text.link)).toBe(true)
  })
})

describe('blocksToMarkdown sparse blocks', () => {
  const block = (type: string, data: Record<string, unknown>): NotionBlock => ({ object: 'block', type, [type]: data })

  it('renders a callout without an icon as a NOTE', () => {
    expect(blocksToMarkdown([block('callout', { rich_text: [plainRichText('c')] })])).toBe('> [!NOTE] c')
  })

  it('renders nothing for a table without rows', () => {
    expect(blocksToMarkdown([block('table', {})])).toBe('')
  })

  it('renders empty rows, with a separator after an empty header row', () => {
    const table = block('table', { has_column_header: true, children: [{ table_row: { cells: [] } }, {}] })
    expect(blocksToMarkdown([table])).toBe('|  |\n|  |\n|  |')
  })

  it('renders a column list without columns and a column without content', () => {
    expect(blocksToMarkdown([block('column_list', {})])).toBe(':::columns\n:::end')
    expect(blocksToMarkdown([block('column_list', { children: [{}] })])).toBe(':::columns\n:::column\n:::end')
  })

  it('renders the children of level 2 and level 3 headings', () => {
    const child = block('paragraph', { rich_text: [plainRichText('c')] })
    expect(blocksToMarkdown([block('heading_2', { rich_text: [plainRichText('H')], children: [child] })])).toBe(
      '## H\nc'
    )
    expect(blocksToMarkdown([block('heading_3', { rich_text: [plainRichText('H')], children: [child] })])).toBe(
      '### H\nc'
    )
  })

  it('renders an image and a file with no URL and no caption', () => {
    expect(blocksToMarkdown([block('image', {})])).toBe('![]()')
    expect(blocksToMarkdown([block('file', {})])).toBe('[file]()')
  })

  it('renders an empty string for a paragraph with no rich text array', () => {
    expect(blocksToMarkdown([block('paragraph', {})])).toBe('')
  })

  it('skips null and text-less entries and renders sparse text and mentions', () => {
    const richText = [
      null,
      { type: 'text' },
      { type: 'text', text: { content: '' } },
      { type: 'text', text: { content: 'plain' } },
      { type: 'mention', mention: { page: { id: 'p1' } }, text: { content: 'From text' } },
      { type: 'mention', mention: { database: { id: 'd1' } } },
      { type: 'mention', mention: { user: { id: 'u1' } }, plain_text: '@Ann' }
    ] as unknown as RichText[]
    expect(blocksToMarkdown([block('paragraph', { rich_text: richText })])).toBe(
      'plain@[From text](p1)@[Untitled](d1)@Ann'
    )
  })

  it('applies every annotation and the link in a fixed order', () => {
    const rt: RichText = {
      type: 'text',
      text: { content: 't', link: { url: 'https://example.com' } },
      annotations: { bold: true, italic: true, strikethrough: true, underline: false, code: true, color: 'default' }
    }
    expect(blocksToMarkdown([block('paragraph', { rich_text: [rt] })])).toBe('[~~`***t***`~~](https://example.com)')
  })
})

describe('extractPlainText sparse input', () => {
  it('returns an empty string for a missing array and for entries with no text', () => {
    expect(extractPlainText(undefined as unknown as RichText[])).toBe('')
    expect(extractPlainText([{ type: 'mention', mention: {} } as unknown as RichText])).toBe('')
  })
})
