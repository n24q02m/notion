# AGENTS.md - notion

MCP Server for Notion API. TypeScript, Node.js >= 24, bun, ESM.

## Build / Lint / Test Commands

```bash
bun install                 # Install dependencies
bun run build               # tsc --build && esbuild CLI bundle
bun run check               # Biome check + tsc --noEmit (CI command)
bun run check:fix           # Auto-fix Biome + type check
bun run test                # vitest --passWithNoTests (NEVER use bare "bun test")
bun run test:watch          # vitest watch
bun run test:coverage       # vitest --coverage
bun run lint                # biome lint src
bun run format              # biome format --write .
bun run type-check          # tsc --noEmit
bun run dev                 # tsx watch dev server

# Run a single test file
bun x vitest run src/tools/helpers/errors.test.ts

# Run a single test by name
bun x vitest run -t "test name pattern"

# Mise shortcuts
mise run setup              # Full dev environment setup
mise run lint               # bun run check
mise run test               # bun run test
mise run fix                # bun run check:fix
```

## Code Style

### Formatting (Biome)

- **Indent**: 2 spaces
- **Line width**: 120
- **Quotes**: Single quotes
- **Semicolons**: As needed (omit when possible)
- **Trailing commas**: None
- **Arrow parens**: Always
- **Bracket spacing**: true
- **Line endings**: LF

### Imports

1. Type imports use `import type` (separate statement)
2. External packages first, then internal imports (relative paths)
3. Node builtins with `node:` prefix (`node:fs`, `node:path`, `node:url`)
4. **Always use `.js` extension** in import paths (ESM requirement)

```typescript
import type { Client } from '@notionhq/client'
import { NotionMCPError, withErrorHandling } from '../helpers/errors.js'
import { blocksToMarkdown, markdownToBlocks } from '../helpers/markdown.js'
```

### TypeScript

- `strict: true`, target: es2021, module: es2022, moduleResolution: Bundler
- `composite: true` for incremental builds
- `isolatedModules: true`, `forceConsistentCasingInFileNames: true`

### Naming Conventions

| Element             | Convention       | Example                              |
| ------------------- | ---------------- | ------------------------------------ |
| Functions/variables | camelCase        | `registerTools`, `notionToken`       |
| Interfaces          | PascalCase       | `PagesInput`, `PaginatedResponse`    |
| Classes             | PascalCase       | `NotionMCPError`                     |
| Constants           | UPPER_SNAKE_CASE | `TOOLS`, `RESOURCES`, `DOCS_DIR`     |
| Files (helpers)     | kebab-case       | `init-server.ts`, `markdown.ts`      |
| Test files          | Co-located       | `errors.test.ts` next to `errors.ts` |

### Error Handling

- Custom `NotionMCPError` class: `message`, `code`, `suggestion`, `details`
- `withErrorHandling()` HOF wrapper for all composite tool functions
- `retryWithBackoff()` for transient failures
- `suggestFixes()` for AI-readable error recovery hints
- Error details sanitized to prevent secret leakage

### Biome Lint Rules

- `noExplicitAny`: **off** (Notion API responses use `any`)
- `noNonNullAssertion`: **off** (`!` assertion allowed)
- `noUnusedVariables`: warn
- `noUnusedImports`: error (via organizeImports)

### Architecture Pattern

- **Composite/Mega Tool**: Each domain (pages, databases, blocks...) is one function
- Input: `{ action, ...params }`, dispatch via `switch(input.action)`
- Every composite tool exports: 1 async function + 1 interface
- Signature: `async function toolName(notion: Client, input: TypedInput): Promise<any>`
- Namespace import for richtext: `import * as RichText from '../helpers/richtext.js'`

### File Organization

```
src/
  init-server.ts              # Entry point — imports main.ts (startServer/getTransportMode)
  main.ts                     # Transport selection; stdio (NOTION_TOKEN) handled directly
  create-server.ts            # Shared MCP Server factory
  auth/                       # Per-JWT-sub Notion access token store (http mode)
    notion-token-store.ts     # In-memory per-sub token map
  transports/
    http.ts                   # Remote mode (Express + OAuth 2.1, multi-user)
  docs/                       # Markdown docs served as MCP resources
  tools/
    registry.ts               # Tool registration + routing
    composite/                # One file per domain (pages, databases, blocks, etc.)
    helpers/                  # errors, markdown, richtext, pagination, properties, security
```

### Documentation

- `/** */` JSDoc on every function, references Notion API endpoint
- File-level block comment describing module purpose
- No `@param`/`@returns` -- rely on TypeScript types

### Commits

Conventional Commits: `type(scope): message`. Enforced via git hooks.

### Pre-commit Hooks

1. `biome check --write` (lint + format)
2. `tsc --noEmit` (type check)
3. `bun run test` (run tests)
