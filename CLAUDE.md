# notion

Ten repo/npm/image: `n24q02m/notion` / `@n24q02m/notion` / `n24q02m/notion` (truoc day la `better-notion-mcp`). CON GIU ten cu co chu dich: registry id `io.github.n24q02m/better-notion-mcp`, bin alias `better-notion-mcp`, storage key `better-notion-mcp` (`SERVER_NAME` trong `src/credential-state.ts`; data dir `~/.better-notion` qua `STORE_PLUGIN`), va skret path `/better-notion-mcp/prod`.

TypeScript MCP Server cho Notion API. 10 registered tools = 8 composite (pages, databases, blocks, users, workspace, comments, content_convert, file_uploads) + 2 infra (config, help), dual-mode stdio/http.
Xem `AGENTS.md` va `README.md` de hieu architecture.

## Cau truc

- `src/init-server.ts` -- Transport selector; delegates to `main.ts`
- `src/main.ts` -- Server entry point: stdio (NOTION_TOKEN required) or http
- `src/credential-state.ts` -- Per-user credential namespace resolution (hull storage)
- `src/create-server.ts` -- MCP server factory (used by http mode)
- `src/tools/registry.ts` -- Tool registration + routing
- `src/tools/composite/` -- 1 file per domain (pages, databases, blocks, comments, users, workspace, content, file-uploads, config)
- `src/tools/helpers/` -- errors, markdown, richtext, pagination, properties, covers, icons, id, security
- `src/transports/http.ts` -- HTTP transport (bearer-token auth: `multi` / `token` / `no-auth`)
- `src/docs/` -- Markdown docs served as MCP resources
- Tests: co-located (`*.test.ts` canh `*.ts`)

## Lenh thuong dung

```bash
bun install                 # Cai dependencies
bun run build               # tsc --build && esbuild CLI bundle
bun run check               # Biome check + tsc --noEmit (CI command)
bun run check:fix           # Auto-fix Biome + type check
bun run test                # vitest (KHONG BAO GIO dung bare "bun test")
bun run test:watch          # vitest watch
bun run test:coverage       # vitest --coverage
bun run lint                # biome lint src
bun run format              # biome format --write .
bun run type-check          # tsc --noEmit
bun run dev                 # tsx watch dev server (stdio)
bun run dev:http            # tsx watch dev server (http mode)

# Test don le
bun x vitest run src/tools/helpers/errors.test.ts
bun x vitest run -t "test name pattern"

# Mise shortcuts
mise run setup              # Full dev env setup
mise run lint               # bun run check
mise run test               # bun run test
mise run fix                # bun run check:fix
```

## Cau hinh

- Node.js >= 24, bun, ESM (`"type": "module"`)
- TypeScript: strict, target es2021, module es2022, moduleResolution Bundler
- Biome: 2 spaces, line width 120, single quotes, semicolons as needed, trailing commas none
- **LUON dung `.js` extension** trong import paths (ESM requirement)

## Env vars

- **stdio mode** (default): `NOTION_TOKEN` (bat buoc; stdio fails fast if unset, see `main.ts:76`)
- **http mode** (opt-in via `--http`, `MCP_TRANSPORT=http`, or `TRANSPORT_MODE=http`): `MCP_AUTH_MODE` (`multi` default | `token` | `no-auth`); `MCP_USERS_FILE` (multi, default `~/.hull/users.toml`); `MCP_AUTH_TOKEN_HASH` (token mode, required); `MCP_RPM` (optional cap, token mode).
- `PORT` (default `0` = OS-assigned random port), `HOST` (optional bind address)
- Secrets: skret SSM namespace `/better-notion-mcp/prod` (region `ap-southeast-1`)

## Release & Deploy

- Conventional Commits. Tag format: `v{version}` (config: `semantic-release.toml`)
- CD: workflow_dispatch, chọn beta/stable; versioning qua `n24q02m/better-semantic-release` và publish-action
- Pipeline: semantic release -> npm publish (`@n24q02m/notion`) -> Docker multi-arch (amd64 + arm64) -> DockerHub + GHCR -> MCP Registry
- OCI VM deploy: Docker Compose + Watchtower. Prod `:latest` 0.125G, Staging `:beta` 0.0625G
- There is no n24q02m-hosted HTTP endpoint and no Cloudflare hosting surface. Supported paths are stdio and self-host http via `docker compose -f docker-compose.http.yml up` (published on loopback `127.0.0.1:8081` only; put your own TLS reverse proxy in front). Releases publish multi-arch images to DockerHub + GHCR.

## Pre-commit hooks

1. `biome check --write` (lint + format)
2. `tsc --noEmit` (type check)
3. `bun run test` (vitest)
4. Commit message: enforce `feat`/`fix` prefix

## Luu y quan trong

- KHONG dung bare `bun test` -- phai dung `bun run test` (de vitest chay dung)
- Composite/Mega Tool pattern: input `{ action, ...params }`, dispatch via `switch(input.action)`
- Moi composite tool export: 1 async function + 1 interface
- Signature: `async function toolName(notion: Client, input: TypedInput): Promise<any>`
- `noExplicitAny`: off (Notion API responses dung `any`)
- Error handling: `NotionMCPError` + `withErrorHandling()` HOF wrapper
- `import type` dung rieng biet cho type imports
- Node builtins phai co `node:` prefix (`node:fs`, `node:path`)
- SDK pin `@modelcontextprotocol/sdk` v1.x -- pinned; a v2 upgrade needs its own review
- Notion API bug (seen with OAuth tokens on API version `2025-09-03`): `comments.list` returned 404. The server now uses integration tokens only; re-check if `comments.list` 404s.

## Modes

Two transports, selected in `init-server.ts:14-15` (delegated to `main.ts`). There is no `MCP_MODE` env var; the old `local-relay` / `remote-oauth` distinction was removed (see `transports/http.ts:4-9`).

- **stdio (default)**: MCP SDK `StdioServerTransport` directly. Single-user; requires `NOTION_TOKEN`. Fails fast with a stderr message if the token is unset (`main.ts:76-91`). No local relay spawn.
- **http (opt-in, self-hosted)**: enabled via `--http`, `MCP_TRANSPORT=http`, or `TRANSPORT_MODE=http`. Served by `src/transports/http.ts`; auth via `MCP_AUTH_MODE` (`multi` default, `token`, `no-auth`). Multi mode resolves each caller to a per-user namespace (`src/credential-state.ts`).

**CLI `auth`** (`notion auth [--user <namespace>]`, `src/main.ts` `authCommand`): stores a Notion integration token via hull `PerPluginStore`. The other subcommands (`config`, `status`, `logout`, `doctor`, `token`) come from hull `buildCli`. stdio reads `NOTION_TOKEN` from the env; http credentials are per-user and set through the `config` tool.

## Config storage path

TS servers store credentials via hull storage under `~/.better-notion/` (`STORE_PLUGIN = 'better-notion'` and `SERVER_NAME = 'better-notion-mcp'` in `src/credential-state.ts`): `config.json` for the default namespace, `subs/<ns>/config.json` per user in HTTP multi mode. `.secret` (0600) is the single-user machine key. When debugging reset state, delete the `config.json` of that namespace.

## E2E

Driven by `mcp-core/scripts/e2e/` (matrix-locked, 15 configs). Run a single config from this repo via `make e2e` (proxy) or directly:

```
cd ../mcp-core && uv run --project scripts/e2e python -m e2e.driver <config-id>
```

Configs for this repo: `notion-paste-token`.

Note: there is no n24q02m-hosted HTTP endpoint; validate HTTP mode against an operator-owned self-hosted deployment.

Tier policy:

- **T0** (precommit + CI on PR / main push) - runs without upstream identity. Skret keys not required.
- **T2 non-interaction** (`make e2e-config CONFIG=<id>` locally) - token from skret AWS SSM `/better-notion-mcp/prod` (`ap-southeast-1`). No user gate.
- **T2 interaction** - not applicable to notion: the only credential is an integration token, so no provider sign-in or user gate. The `mcp-core` matrix still names the removed relay form for this config; that file is outside this repo and needs its own update.

Multi-user HTTP mode (deployment property; not a separate config) requires `MCP_AUTH_MODE=multi` and a users file (`MCP_USERS_FILE`, default `~/.hull/users.toml`).

References: `mcp-core/scripts/e2e/matrix.yaml`, `~/.claude/skills/mcp-dev/references/e2e-full-matrix.md` (harness-readiness gate), `~/.claude/skills/mcp-dev/references/secrets-skret.md` (per-server credential layout), `~/.claude/skills/mcp-dev/references/multi-user-pattern.md` (per-user namespace isolation).
