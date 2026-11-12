# notion Handover

## Current product

`notion` is a Markdown-first Notion MCP server: pages, databases, blocks, comments, users, workspace search, Markdown/block conversion, and file uploads for AI agents. The published package is `@n24q02m/notion`; the `notion` binary also answers to its legacy name `better-notion-mcp`, and its MCP Registry id is `io.github.n24q02m/notion`.

**Version: 2.42.0** -- the `version` field of `package.json` at the commit that added this handover. `semantic-release.toml` bumps `package.json`, `.claude-plugin/plugin.json`, and `server.json` together on every release, so treat this line as a snapshot and re-read `package.json` before using it as current.

The server is built on hull (`@n24q02m/hull`) for the encrypted per-plugin credential store, the Streamable HTTP transport, bearer auth, and the shared operator CLI; the tool handlers sit on the MCP TypeScript SDK and `@notionhq/client`. There is no browser credential form, OAuth server, daemon bridge, or hosted endpoint.

Two transports: local stdio for one user with a Notion integration token, and self-hosted Streamable HTTP behind bearer auth (one namespace per caller, or one shared token).

The public contract is defined by the repository README, `server.json`, package metadata, and the documented MCP tools and resources. Anything not in those four is internal.

## Current tool inventory

Eight composite Notion tools (39 actions) plus two infrastructure tools (`config`, `help`):

| Tool | Actions |
|---|---|
| `pages` | `create`, `get`, `get_property`, `update`, `move`, `archive`, `restore`, `duplicate` |
| `databases` | `create`, `get`, `query`, `create_page`, `update_page`, `delete_page`, `create_data_source`, `update_data_source`, `update_database`, `list_templates` |
| `blocks` | `get`, `children`, `append`, `update`, `delete` |
| `users` | `list`, `get`, `me`, `from_workspace` |
| `workspace` | `info`, `search` |
| `comments` | `list`, `get`, `create` |
| `content_convert` | `markdown-to-blocks`, `blocks-to-markdown` (selected by the `direction` parameter, not by `action`) |
| `file_uploads` | `create`, `send`, `complete`, `retrieve`, `list` |
| `config` | `status`, `setup_status`, `setup_start`, `setup_reset`, `setup_complete`, `set`, `cache_clear` |
| `help` | returns the full Markdown documentation for one tool via `tool_name` |

`src/tools/definitions.ts` is the single published surface. `src/tools/registry.ts` wires it to the MCP server, `src/tools/invoke.ts` holds the dispatch table, and `src/cli.ts` derives one CLI subcommand per tool from the same definitions. Adding or changing a tool means changing `definitions.ts` plus its handler in `src/tools/composite/`; do not create a parallel flag list, a second tool inventory, or a second dispatch.

MCP resources are the per-tool documentation files served from `src/docs/`: `notion://docs/{pages,databases,blocks,users,workspace,comments,content_convert,file_uploads}`.

### CLI surface

`notion <tool> <action> [--flag <value>]... [--json]` runs the same handler the MCP tool runs. Flags come from the tool's own JSON Schema in kebab-case (`--page-id`), the snake_case spelling is also accepted, arrays take a comma list or a repeated flag, and object/array-of-object flags take JSON. `--json` prints compact JSON on stdout; a tool failure exits 1 with one line on stderr, a usage error exits 2.

Every registered tool therefore has a subcommand; the list is derived from `TOOLS`, never hand-written, so a new tool cannot end up MCP-only. The one name that needs a suffix is `config`, reachable as `notion config-tool <action>`: hull's operator `notion config status` / `notion config delete --yes` own the plain word and manage the stored credential file. `notion --help` lists tool subcommands and operator commands as separate groups.

## Build and verify

- Node.js >= 24.22.2 (see `engines`); Bun for the toolchain.
- Install: `bun install --frozen-lockfile`
- Check (Biome + type check): `bun run check`
- Tests: `bun run test` (vitest); with coverage: `bun run test -- --coverage`
- Build: `bun run build` (produces `build/` and `bin/cli.mjs`)
- Session hook tests: `uv run --with pytest==9.0.3 python -m pytest hooks/tests -q`
- Live tests: `bun run test:full` against `tests/live/vitest.live.config.ts`; these need a real integration token and are excluded from the default run.

CI is the authoritative check: `ci.yml` runs the PR-title conventional-commit gate, the session-hook tests, `bun run check`, the covered test run, and the build on Ubuntu, Windows, and macOS, plus `verify_readme_sync.py` (README, `package.json`, and `server.json` metadata must agree) and dependency review. Local commands are source evidence only; a green local run does not stand in for the exact CI run.

Smoke the surface without touching a Notion workspace: `notion content_convert --direction markdown-to-blocks --content '# Title'` needs no token, `notion help pages` returns the same documentation the MCP resource serves, and `notion config-tool status --json` reports credential state. A representative live check must call a workspace operation such as `notion users me` or a page read; a credential-status answer alone only proves the CLI started.

## Configuration and credentials

| Variable | Required | Default | Meaning |
|---|---|---|---|
| `NOTION_TOKEN` | stdio | -- | Notion integration token (`ntn_...` or legacy `secret_...`) |
| `TRANSPORT_MODE` / `MCP_TRANSPORT` | no | `stdio` | set to `http` for the HTTP transport (or pass `--http`) |
| `MCP_AUTH_MODE` | no (HTTP) | `multi` | `multi`, `token`, or `no-auth` |
| `MCP_USERS_FILE` | no (HTTP `multi`) | `~/.hull/users.toml` | users file hull reads namespaces and tokens from |
| `MCP_AUTH_TOKEN_HASH` | yes (HTTP `token`) | -- | `scrypt$` hash of the shared bearer token, minted with `token hash` |
| `MCP_RPM` | no (HTTP `token`) | -- | optional per-minute request cap |
| `PORT` | no (HTTP) | `0` (OS-assigned) | listen port |
| `HOST` | no (HTTP) | `127.0.0.1` | bind address |
| `NOTION_DATA_DIR` | no | home directory | base directory that holds the credential store |

Credential state is hull's encrypted per-plugin store, keyed by namespace. The default namespace lives in `<base>/.notion/config.json`; HTTP `multi` callers resolve to `<base>/.notion/subs/<namespace>/config.json`. The machine key that decrypts the blob is `<base>/.notion/.secret`, written with mode 0600 on POSIX. A store an earlier release wrote under `<base>/.better-notion/` is copied forward once at startup (`src/data-dir-migration.ts`); there is no second live store.

`notion auth [--user <namespace>]` stores a token. It reads the token from `NOTION_TOKEN` or prompts on stdin -- never from argv, so it stays out of shell history -- verifies it with Notion `users.me` before saving, and prints no credential values. The `relay` subcommand is intentionally a stub that points at `notion auth`; the mcp-core relay flow was removed with the move to hull.

`NOTION_DATA_DIR` replaces the base directory outright, which is how a container mounts one volume (`NOTION_DATA_DIR=/data` puts the store at `/data/.notion/`). A relative value is resolved under the home directory and must stay inside it, so `..` cannot walk out; an absolute value is an explicit operator choice and is taken as-is. Empty means "use the default". Because hull derives the blob, the machine key, and the legacy fallbacks from one home directory, the override moves all of them together -- do not point only part of the store somewhere else, or the next run cannot decrypt what was written.

Never commit tokens, `.secret`, `config.json`, or captured protocol output. Do not use an external service as the source of truth for local development or verification.

## Transports and auth modes

- **stdio** (default): one user, token from `NOTION_TOKEN` or the stored default namespace. No listener.
- **HTTP `multi`** (default for HTTP): every caller is resolved to a namespace from `MCP_USERS_FILE`, and that namespace's Notion token is the only one the request can read. A namespace that has no stored token is an error; it never falls back to the default namespace.
- **HTTP `token`**: one shared bearer token, stored only as its scrypt hash in `MCP_AUTH_TOKEN_HASH`; the raw token is sent by clients as `Authorization: Bearer <token>`. `MCP_RPM` optionally caps requests per minute.
- **HTTP `no-auth`**: no bearer check, loopback binds only; hull refuses a non-loopback host in this mode.

Namespaces are validated against a fixed pattern, so a caller cannot address `subs/../..`. `docker-compose.http.yml` publishes the HTTP image on host loopback only; exposing it further is the operator's own TLS reverse proxy.

## Data and state

- Credential store and machine key: as above, under `NOTION_DATA_DIR` when set.
- The credential store is the only durable state this server owns. There is no request queue or durable session store, and `config`'s `cache_clear` is a no-op. `set` is also a no-op -- Notion has no mutable runtime settings, so a token change is `setup_reset` followed by `notion auth`.
- Restarting the server loses nothing that survives on disk; in-flight requests fail.

## Release and rollback

Releases are dispatch-only. `.github/workflows/cd.yml` takes `release_type` (`beta` or `stable`) and never releases on a push. In order: the README/package/Registry metadata gate (`verify_readme_sync.py`), a dry run of `n24q02m/better-semantic-release` to learn the version it would publish, a guard that refuses to continue if that version already exists on npm, the real semantic-release run (version bump in `package.json` / `.claude-plugin/plugin.json` / `server.json`, changelog, tag, GitHub release), then npm publish, the one-time legacy-package release, a multi-arch Docker build (`linux/amd64`, `linux/arm64`) merged into a manifest for Docker Hub and GHCR, the MCP Registry publish, and a marketplace sync dispatch.

Verify a release as separate facts: exact source commit, workflow run and job conclusions, the version on the tag, the npm package metadata, the image digests behind the manifest, and the Registry entry. A tag or an uploaded asset alone is not runtime evidence. Beta and stable are two dispatches of the same pipeline; a merge never promotes by itself, and stable promotion is a separate decision from this handover.

Rollback is forward: revert or fix the source commit and dispatch the pipeline again with a version above every version ever published. Never re-dispatch a version that reached npm -- the registry rejects it permanently -- and never hand-create or move tags. If a run fails after publication steps began, record the exact run and job ids and inspect provider state before retrying.

## Known limits

- There is no vendor-hosted endpoint; every HTTP deployment is self-hosted and its bearer token is the operator's responsibility.
- The legacy `@n24q02m/better-notion-mcp` package receives one final release, then freezes. The Registry id is `io.github.n24q02m/notion`; the pre-rename `io.github.n24q02m/better-notion-mcp` entry stays frozen in the registry and is never republished, while the repository, package, image, and binary are `notion`.
- `no-auth` is loopback-only by design and is not a remote deployment mode.
- Two names keep their pre-rename spelling on purpose: hull's storage key for this server is `better-notion-mcp` (`SERVER_NAME` in `src/credential-state.ts`, while `STORE_PLUGIN = 'notion'` sets the on-disk directory), and the pre-rename store directory `better-notion` stays a read-only migration source. Renaming either would orphan saved credentials, so treat the product name and the storage surfaces as independent.
- Token validation happens at `notion auth`; a token later revoked in Notion surfaces as an authentication error at call time, not at startup.
- The version line at the top of this file is a release snapshot, not a live value.

## Week-one operator checklist

1. Decide the transport (stdio or HTTP) and, for HTTP, the auth mode (`multi` for several callers, `token` for one shared bearer).
2. Install with the documented command, then run `bun run check` and `bun run test`.
3. Store a token with `notion auth` (and `--user <namespace>` for each namespace in `multi`) against a workspace you can safely write to.
4. Exercise one representative read: `notion users me`, then a page read through the `pages` tool.
5. For HTTP `multi`, confirm two namespaces resolve to separate stores under `subs/` and that a namespace without a token fails instead of inheriting the default.
6. Review the exact CI run before merging, and the exact release run before using a beta artifact.

## Triage

- Exits 1 on stdio start with a setup hint: no token for the current namespace. Run `notion auth`, or set `NOTION_TOKEN`.
- `MCP_AUTH_MODE=token` refuses to start: `MCP_AUTH_TOKEN_HASH` is missing (or hull rejects the hash). Mint it with `token hash` and pass the hash, never the raw token.
- `Unknown MCP_AUTH_MODE` / `--user requires a namespace value`: argv or env is wrong; both messages name the accepted set.
- Decryption failure after moving a volume: only the blob or only the key was moved. Restore the pair under one base directory.
- `DataDirEscapeError`: `NOTION_DATA_DIR` is relative and resolves outside the home directory. Use an absolute path to choose another directory.
- Notion errors: distinguish a missing token, a rejected token (`users.me` fails), and a Notion API rejection (missing integration access on the page, rate limit, validation). Rotating credentials does not fix a page that the integration was never shared with.
