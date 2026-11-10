# Engineering lessons

These entries were recovered from the working ledgers this repository kept at its root
until 2026-11-11: the notes of a discontinued automated assistant that proposed changes
under two remits -- performance (`bolt.md`) and security (`sentinel.md`). The entries
are kept verbatim, each in the shape it was written. The `**Commit:**` line under a
heading names the commit that landed that entry, so a settled question can be found in
the repository history before the same change is proposed again. A few entries quote the
paths the ledgers occupied before this move; those paths no longer exist.

# Performance (`bolt.md`)

## 2024-06-29 - Precompute array derivations to avoid O(N) penalties

**Commit:** `d6022fc`

**Learning:** In hot paths (like incoming MCP requests in `registry.ts`), repeatedly mapping over static arrays (`RESOURCES`, `TOOLS`) to generate response objects or lookup arrays causes unnecessary O(N) CPU allocations and GC overhead.
**Action:** Always precompute derivations of static lists at the module level (e.g., using `new Map()` for O(1) lookups or caching `.map()` outputs) rather than computing them on-the-fly per request.

## 2024-06-29 - Cache Regex in Hot Paths

**Commit:** `d6022fc`

**Learning:** Instantiating new regex literals within functions on hot paths (e.g., `isValidBase64` processing file buffers) incurs a compilation penalty and GC overhead. Caching the regex object at the module level and using `.test()` proved significantly faster (~2.6ms vs 72ms per 10k iterations on large payloads).
**Action:** Always declare static regexes at the module level rather than redefining them inside utility functions, especially for high-frequency operations.

## 2026-06-30 - Precompute Inline Regex to avoid Regex Compilation Penalties

**Commit:** `2326743`

**Learning:** In hot paths, like string matching using `.match()` in `src/tools/helpers/errors.ts`, `src/tools/helpers/markdown.ts`, and `src/tools/helpers/properties.ts`, re-compiling inline regexes can cause CPU allocations and garbage collection overheads.
**Action:** Always precompute these regex as module-level constants (e.g. `SAFE_STRING_REGEX`) rather than recreating them during runtime to improve speed and performance.

## 2024-07-03 - Array Spread Operator (Spread Syntax) Performance Penalty on V8

**Commit:** `48049b1`

**Learning:** Using the spread operator (`...arr`) to push elements into an array (`allResults.push(...results)`) can cause 'Maximum call stack size exceeded' errors when the spread array is very large. In V8 (used by Node and Bun), it also incurs a performance penalty due to intermediate array allocation overhead compared to a manual `for` loop.
**Action:** For performance-critical code or when dealing with potentially large arrays (like paginated API results), use a manual `for` loop to push elements individually instead of using the spread operator.

## 2024-07-04 - Multiline String Prefixing Performance in V8/Bun

**Commit:** `723c765`

**Learning:** Using regex `.replace(/^/gm, 'prefix')` for multiline string operations (like indenting or adding blockquote markers in markdown rendering) incurs measurable overhead due to RegExp state machine execution. In V8/Bun, using template literals combined with native string search via `.replaceAll('\n', '\nprefix')` (e.g., \`prefix${str.replaceAll('\n', '\nprefix')}\`) is significantly faster.
**Action:** When applying static prefixes to every line of a string on a hot path, prefer string concatenation and `.replaceAll('\n', '\nprefix')` over global regex start-of-line replacements.

## 2024-07-17 - Avoid .map() and intermediate array allocations in Hot Paths

**Commit:** `c9242fb`

**Learning:** In heavily used loops or rendering pipelines (e.g., parsing markdown tables and columns), using array methods like `.map()` and `.push()` can cause unnecessary garbage collection overhead and closure allocations. Specifically, large `.map()` chains or dynamic `.push()` calls create many intermediate arrays that penalize V8 performance.
**Action:** Replace `.map()` and dynamic `.push()` with manual `for` loops over pre-allocated arrays (e.g., `new Array(length)`) to reduce garbage collection pressure and improve CPU efficiency in highly recursive or hot code paths.

## Rejected

Proposals that were reviewed and declined. A closing comment lives on the PR, where it cannot be read again; this section is the part that carries forward. Before proposing an optimization, check that it is not listed here.

**Bar for a performance change in this repo:** a measured number on a realistic payload, or a named hot path. "Expected impact", a complexity argument, or "tests pass" is not a measurement.

- **`+=` instead of a pre-allocated array + `join('')` in `properties.ts` title/rich_text extraction** (PR #1152). Rejected: it reverses `2abf195 (#991)`, which introduced the pre-allocated array on those same lines under the `2024-07-17` entry above. Both directions were argued as faster and neither was measured. Do not flip these lines again without a benchmark that survives noise.
- **Dropping the redundant `.includes('|')` and using `.trimStart()` in `markdown.ts` table parsing** (PRs #1142, #1143, #1144 — one cluster, three PRs). The redundancy is real and the rewrite is behaviour-preserving, but `parseTable` runs once per table during page conversion and the removed check scans a single line. Unmeasured, so closed. `#1142` is the cleanest diff if this is ever revisited.
- **Writing `// ⚡ Bolt: ...` narration into source files** (PR #1143, `markdown.ts:193`). This is a public repository; attribution markers of that form do not belong in shipped code. Keep the rationale in this ledger and in the commit message.
- **Deleting existing entries from this file** (PR #1143 removed 22 lines). This ledger is append-only memory. Removing entries is how settled proposals return.

## 2024-08-28 - In-place Array Truncation

**Commit:** `d8d275b`

**Learning:** Returning `.slice(0, limit)` on large arrays (like paginated results) causes unnecessary intermediate array allocation, which increases GC pressure.
**Action:** When a maximum limit on an array's size is needed, modify the array length in-place (`arr.length = limit`) rather than creating a new array copy using `.slice()`.

# Security (`sentinel.md`)

## 2024-05-18 - Fix Authorization Header Leak

**Commit:** `cbb6e3a`

**Vulnerability:** Authorization headers (like `Authorization` and `authorization`) were leaking within the HTTP error payload objects inside `config.headers`, `request._headers` and `headers` objects when `enhanceError` was called on network errors, as these nested properties were not cleaned by the `stripSensitiveFields` logic.
**Learning:** Generic error serialization can unintentionally capture standard HTTP metadata which usually contains tokens or credentials, leading to unintended leakage when errors are output to clients or logs.
**Prevention:** Always perform an explicit redaction of common auth-related header locations inside error response payloads that come from HTTP client instances before relaying error details outside of their execution context.

## 2024-05-18 - Fix Command Injection on Windows via tryOpenBrowser

**Commit:** `0e09c62`

**Vulnerability:** In `tryOpenBrowser`, using `execFile('cmd', ['/c', 'start', '', url])` to open URLs on Windows was vulnerable to command injection because `cmd.exe` processes shell metacharacters like `&` within its arguments before passing them to the internal `start` command, completely bypassing `execFile`'s usual protections against shell injection.
**Learning:** `child_process.execFile` does not protect against shell injection when the executed binary is itself a shell (like `cmd.exe`). Any arguments passed to it will undergo normal shell parsing rules.
**Prevention:** Avoid spawning shell binaries entirely for generic tasks. To open URLs on Windows securely without invoking `cmd.exe`, use the OS-level file protocol handler directly via `execFile('rundll32', ['url.dll,FileProtocolHandler', url])`.

## 2025-02-27 - Fix Command Injection in OAuth Tests on Windows

**Commit:** `53685e7`

**Vulnerability:** In `tests/test-oauth-mcp.mjs`, the `_openBrowser` function was using `execFile('cmd', ['/c', 'start', url])` to open authorization URLs on Windows. This allowed any unsanitized `url` payload containing shell metacharacters (like `&` or `|`) to bypass protections and trigger arbitrary code execution, as `cmd.exe` parses and executes them before running the internal `start` command.
**Learning:** `child_process.execFile` only guarantees safe parameter passing to the binary being invoked. If the binary is a shell (like `cmd.exe`), it applies its own parsing rules to the passed arguments, re-introducing shell injection risks even when using the ostensibly safe `execFile`.
**Prevention:** When programmatic interaction requires opening URLs on Windows without shell intervention, utilize OS-level file protocol handlers directly via `execFile('rundll32', ['url.dll,FileProtocolHandler', url])` to avoid `cmd.exe` parsing entirely.

## 2025-05-22 - [XPIA Breakout via Malicious Payload Tags]

**Commit:** `ef27267`

**Vulnerability:** The `wrapToolResult` function used `</untrusted_notion_content>` to encapsulate untrusted data returned from Notion to defend against Indirect Prompt Injection (XPIA). However, an attacker could include `</untrusted_notion_content>` in the malicious data payload itself, which would prematurely close the security wrapper and allow subsequent lines to be interpreted as trusted system instructions by the LLM.
**Learning:** Security wrappers like `<untrusted_content>` tags are vulnerable to premature termination if the encapsulated data is not sanitized or escaped. Attackers can control the returned data (e.g., Notion page content) to craft malicious breakout strings.
**Prevention:** Always sanitize the payload data (e.g., using `String.replace`) to escape or replace any strings that match the wrapper's closing tags (case-insensitively) before encapsulating the data.

## 2025-05-28 - XPIA Breakout via Whitespace Padding

**Commit:** `eaf2e09`

**Vulnerability:** Untrusted content tools were protected against XPIA using a closing tag replacement regex (`/<\/untrusted_notion_content>/gi`). However, this regex was strict and failed to match whitespace-padded payloads (e.g., `</untrusted_notion_content >`), allowing an attacker to bypass the sanitization and execute prompt injection.
**Learning:** XML/HTML parsers (including LLMs parsing pseudo-XML tags) often tolerate whitespace before the closing angle bracket. A strict exact-match regex sanitization is insufficient for tag-based wrappers, as attackers can pad their payload to break out of the wrapper while still satisfying parser leniency.
**Prevention:** Always use regex quantifiers for optional whitespace (e.g., `\s*`) when matching or sanitizing closing tags to handle evasion tactics effectively.

## 2026-05-28 - Improve Security Coverage for isSafeWebUrl

**Commit:** `afa24f9`

**Vulnerability:** N/A (Testing Task)
**Learning:** The function isSafeWebUrl provides a stricter validation layer for opening URLs in external browsers compared to isSafeUrl, specifically by enforcing standard web protocols (HTTP/HTTPS) and preventing shell flag injection (URLs starting with dash).
**Prevention:** Ensure all security-critical utility functions have comprehensive unit test coverage, specifically targeting edge cases like protocol obfuscation, shell injection vectors, and malformed URL handling.

## 2025-05-28 - XPIA Breakout via Closing Tag Attributes

**Commit:** `1dc2e1e`

**Vulnerability:** Untrusted content returned from external APIs was wrapped in `<untrusted_notion_content>` tags. The regex used to sanitize payload breakout attempts (`/<\/untrusted_notion_content\s*>/gi`) only matched trailing whitespace. An attacker could bypass this wrapper by injecting arbitrary attributes into the closing tag within their payload (e.g., `</untrusted_notion_content bypass="true">`), prematurely escaping the security boundary.
**Learning:** Security boundaries relying on XML/HTML-style tags must account for the leniency of the underlying parsers (including LLMs). Exact matches or simple whitespace checks fail when attackers exploit syntax flexibility, such as tag attributes, which are normally invalid in closing tags but tolerated by parsers.
**Prevention:** When sanitizing closing tags for prompt injection defense, use a regex that matches any character except the closing angle bracket (e.g., `[^>]*`) to neutralize all variations, padding, and attributes that could be used for evasion.

## 2026-06-10 - Missing tests for normalizeId

**Commit:** `801cf40`

**Vulnerability:** N/A (Testing Task)
**Learning:** `normalizeId` is a stable utility used for ID comparison. Comprehensive testing should verify that it only removes hyphens and does not affect case or other whitespace characters (tabs, newlines), ensuring consistency across the MCP server.
**Prevention:** Always verify that utility functions have tests covering not just the happy path but also the preservation of non-target characters like case and whitespace.

## 2026-06-13 - Prevent greedy regex data loss in XPIA wrapper sanitization

**Commit:** `ac37b92`

**Vulnerability:** The previous `wrapToolResult` regex `/<\/untrusted_notion_content[^>]*>/gi` used a greedy `[^>]*` match to handle malformed tags, which caused severe data loss regressions when applied to JSON payloads containing tags without a closing `>` bracket.
**Learning:** When writing sanitization regular expressions to strip or neutralize HTML/XML-like tags in unparsed JSON payloads, greedy wildcard patterns like `[^>]*` or `.*` must be avoided as they can consume all trailing characters, effectively destroying the JSON structure.
**Prevention:** Match exact tag prefixes instead (e.g., `/<[/]?untrusted_notion_content/gi`) to safely neutralize tags without risking over-consumption.

## 2026-06-21 - Path Traversal via basename('..')

**Commit:** `5200400`

**Vulnerability:** The `ReadResourceRequestSchema` handler relied on `basename(resource.file)` to prevent path traversal when reading files from `DOCS_DIR`. However, `basename('..')` evaluates to `'..'`, meaning `join(DOCS_DIR, basename('..'))` resolved to the parent directory, allowing an attacker to escape the intended directory boundary.
**Learning:** `path.basename` is insufficient on its own for sanitizing file paths to prevent traversal because it passes `'..'` through unmodified.
**Prevention:** To prevent path traversal in Node.js file operations, always explicitly verify that the final joined path falls within the intended base directory using `fullPath.startsWith(BASE_DIR)` after resolving it.

## 2026-06-21 - Adjacent-directory traversal and cross-platform containment in registry.ts

**Commit:** `cd64b4f`

**Vulnerability:** The `startsWith(DOCS_DIR)` containment check in the documentation resource and help-tool handlers had two flaws: (1) without a trailing separator it permitted access to adjacent directories sharing the prefix (e.g. `DOCS_DIR` `/app/docs` matched `/app/docs-hacked/`); (2) string-prefix checks are separator-sensitive, so a naive `startsWith(DOCS_DIR + sep)` fix rejected legitimate reads on Windows where the path separator differs from forward-slash mocks/resolved paths.
**Learning:** String-prefix comparison is the wrong primitive for directory containment. It conflates lexical prefixes with directory boundaries and is inherently OS-separator-sensitive.
**Prevention:** Compute `const rel = relative(DOCS_DIR, fullPath)` and reject when `rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)`. This is separator-agnostic (uses `path` internals), correctly rejects adjacent and parent directories, and passes uniformly across Linux, macOS, and Windows.

## 2025-05-22 - Direct KV Mapping in Cloudflare Worker Proxy

**Commit:** `3606a3c`

**Vulnerability:** Direct path-to-key mapping in a KV outbound handler allowed potentially unauthorized access to the KV namespace from the container.
**Learning:** Even internal interception layers should validate their inputs (like KV keys) against an allowed namespace or prefix, as the "path" part of the URL is often directly derived from untrusted application-level data.
**Prevention:** Enforce strict key prefix validation and reject directory traversal sequences (e.g., `/../`) in any handler that maps URLs to a flat key-value store.

## 2026-07-23 - Improve XPIA Padding Sanitization

**Commit:** `10fe06f`

**Vulnerability:** The previous `wrapToolResult` regex `/<[/]?untrusted_notion_content/gi` failed to sanitize untrusted content when attackers included whitespaces or newlines between the opening bracket and the tag name (e.g. `< / untrusted_notion_content>` or `<\n/untrusted_notion_content>`).
**Learning:** Leniency in XML/HTML parsing (including LLMs parsing tags) allows optional whitespaces/newlines. A strict exact-match or single-character `[/]?` check is insufficient against evasion via padding.
**Prevention:** Always use a regex that matches and neutralizes leading whitespace and slashes (e.g., `/<[\s/]*untrusted_notion_content/gi`) for prompt injection tags defenses to safely handle padding and evasion tactics.

## 2026-07-25 - Anchor XPIA sanitization on the tag name, not on the padding before it

**Commit:** `744640a`

**Vulnerability:** `wrapToolResult` sanitized breakout tags with a regex anchored on `<` that enumerated the padding allowed before the tag name (`/<[\s/]*untrusted_notion_content/gi`). `jsonText` is already-serialized JSON, so anything an attacker types into a Notion page arrives escaped: a newline is the two characters `\` `n`, a quote is `\` `"`, a control character is `\uXXXX`. `[\s/]` matches none of those. Measured against the shipped regex, a page containing a real newline, a tab, a typed backslash-n, a typed quote or a control character (serialized as \u0001) between `<` and `/untrusted_notion_content>` passed through with the closing tag intact.
**Learning:** Widening the character class after `<` cannot terminate this bug class -- six successive regexes each recognized one more padding form and stayed bypassable by the next escape sequence. The escaped-newline case was in fact discovered earlier and then suppressed: `security.test.ts` carried a dead `_maliciousJsonText` binding and a comment reasoning through the bypass, while the code went unfixed. Weakening a test to make a sanitizer look correct hides the vulnerability instead of closing it.
**Action:** Sanitize by rewriting the sentinel name itself -- `jsonText.replace(/untrusted_notion_content/gi, 'redacted_xpia_marker')` in `src/tools/helpers/security.ts`. Once the name cannot survive in the payload, no padding in front of it can reconstruct the envelope. Assert the invariant "the tag name does not occur in the payload region" (see the `it.each` evasion table in `src/tools/helpers/security.test.ts`) rather than asserting a marker shape, so the test cannot pass while an evasion still works. Do not propose further `<`-anchored padding regexes for this wrapper.

## Rejected

Proposals that were reviewed and declined. Closing a PR records the decision where the bot cannot read it; this section is the part that carries forward.

- **A wider padding regex for `wrapToolResult`** (`/<(?:[\s/]|\\[nrtfb]|\\u[0-9a-fA-F]{4})*untrusted_notion_content/gi`, PR #1151). Rejected because it is still bypassable: an attacker who types a literal backslash or a double quote produces `\\n` / `\"` in the serialized payload, neither of which the alternation matches. The bug class is closed by anchoring on the tag name (2026-07-25 entry above), not by extending the alternation again.
- **Relaxing the PR-title Conventional Commits gate for bot-prefixed titles** (`.github/workflows/ci.yml`, proposed alongside PR #1151). Rejected. The gate is red on `🛡️ Sentinel:` / `⚡ Bolt:` / `🎨 Palette:` titles by design: it is the reminder to retype the squash-commit subject as `fix:`/`feat:` so python-semantic-release still parses it. Skipping the job for exactly those titles removes the reminder on the only PRs that need it, and lets a release-invisible commit reach `main`. A security fix must not carry a change that disables the repository's own CI guardrail.

## 2026-09-05 - Path Traversal Prevention False Positives

**Commit:** `941b37e`

**Vulnerability:** Path traversal sanitization using `String.prototype.includes('/..')` is overly broad and causes false positives by blocking legitimate paths/keys that start with `..` (e.g., `better-notion/..legitimate`).
**Learning:** Using simple substring matching for traversal checks (`includes`) can inadvertently block valid inputs.
**Prevention:** When preventing path traversal using string methods, use strict boundary checks such as `includes('/../') || endsWith('/..') || key === '..'` to safely reject traversal attempts without blocking valid paths. Furthermore, to test trailing traversals correctly via `URL` objects, URL-encoded sequences (`%2F..`) should be used in test payloads to bypass client-side normalizations.
