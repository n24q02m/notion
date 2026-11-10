/**
 * Character budget for markdown returned by page reads. The page markdown is
 * the main read payload, so it is bounded by default: 20,000 characters keeps
 * one read small (about 5k tokens) while still covering most pages whole. The
 * caller can raise the budget up to 100,000, or page blocks with
 * `content_limit`/`content_cursor`, which is the path for larger pages.
 */
export const DEFAULT_MARKDOWN_MAX_CHARS = 20_000
export const MAX_MARKDOWN_MAX_CHARS = 100_000

export interface BoundedMarkdown {
  markdown: string
  truncated: boolean
  totalCharacters: number
}

/**
 * Bound markdown to a character budget. Truncation is never silent: the kept
 * text ends with a marker naming the true length and how to fetch the rest.
 */
export function boundMarkdown(markdown: string, maxChars: number): BoundedMarkdown {
  const totalCharacters = markdown.length
  if (totalCharacters <= maxChars) {
    return { markdown, truncated: false, totalCharacters }
  }

  const omitted = totalCharacters - maxChars
  return {
    markdown: `${markdown.slice(0, maxChars)}\n\n[Truncated: showing ${maxChars} of ${totalCharacters} characters (${omitted} omitted). Pass a larger max_chars (up to ${MAX_MARKDOWN_MAX_CHARS}) or page blocks with content_limit/content_cursor.]`,
    truncated: true,
    totalCharacters
  }
}
