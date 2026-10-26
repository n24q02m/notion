# notion

mcp-name: io.github.n24q02m/better-notion-mcp

**Markdown-first Notion for AI agents -- pages, databases, blocks, and comments in one call.**

<!-- Badge Row 1: Status -->
[![Mode](https://img.shields.io/badge/mode-http_bearer_token_%C2%B7_stdio-5C6BC0)](https://mcp.n24q02m.com/get-started/modes-overview/)
[![CI](https://github.com/n24q02m/notion/actions/workflows/ci.yml/badge.svg)](https://github.com/n24q02m/notion/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/n24q02m/notion/graph/badge.svg?token=D7FSDVVTAN)](https://codecov.io/gh/n24q02m/notion)
[![npm](https://img.shields.io/npm/v/@n24q02m/notion?logo=npm&logoColor=white)](https://www.npmjs.com/package/@n24q02m/notion)
[![Docker](https://img.shields.io/docker/v/n24q02m/notion?label=docker&logo=docker&logoColor=white&sort=semver)](https://hub.docker.com/r/n24q02m/notion)
[![License: Apache-2.0](https://img.shields.io/github/license/n24q02m/notion)](LICENSE)

<!-- Badge Row 2: Tech -->
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)](#)
[![Notion](https://img.shields.io/badge/Notion_API-000000?logo=notion&logoColor=white)](#)
[![semantic-release](https://img.shields.io/badge/semantic--release-e10079?logo=semantic-release&logoColor=white)](https://github.com/python-semantic-release/python-semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-1A1F6C?logo=renovatebot&logoColor=white)](https://developer.mend.io/)

<!-- BEGIN: AUTO-GENERATED-CROSS-PROMO -->
<details>
  <summary><strong>Sister projects from n24q02m</strong> (click to expand)</summary>

| Project | Tagline | Tag |
|---|---|---|
| [agent-chat-plugin](https://github.com/n24q02m/agent-chat-plugin) | Peer AI agents chat in a shared folder — no human relay, no orchestrator, wor... | Tooling |
| [better-code-review-graph](https://github.com/n24q02m/better-code-review-graph) | Knowledge graph for token-efficient code reviews -- semantic search and call-... | MCP |
| [better-drive](https://github.com/n24q02m/better-drive) | 2-way Google Drive sync with .driveignore filter — rclone engine, Windows tray | Tooling |
| [better-email-mcp](https://github.com/n24q02m/better-email-mcp) | IMAP/SMTP email for AI agents -- read, send, organize folders, and manage att... | MCP |
| [better-godot-mcp](https://github.com/n24q02m/better-godot-mcp) | Composite MCP server for Godot Engine -- 17 composite tools for AI-assisted g... | MCP |
| [better-notion-mcp](https://github.com/n24q02m/better-notion-mcp) | Markdown-first Notion for AI agents -- pages, databases, blocks, and comments... | MCP |
| [better-semantic-release](https://github.com/n24q02m/better-semantic-release) | Drop-in python-semantic-release fork with built-in release-safety guards (orp... | Tooling |
| [better-telegram-mcp](https://github.com/n24q02m/better-telegram-mcp) | Telegram for AI agents -- messages, chats, media, and contacts across both bo... | MCP |
| [better-workspace-mcp](https://github.com/n24q02m/better-workspace-mcp) | Google Workspace MCP server (Docs/Drive/Calendar/Gmail/Sheets/Slides/Tasks/Ch... | MCP |
| [claude-plugins](https://github.com/n24q02m/claude-plugins) | Claude Code plugin marketplace for the n24q02m MCP servers -- install web sea... | Marketplace |
| [imagine-mcp](https://github.com/n24q02m/imagine-mcp) | Image and video understanding + generation for AI agents -- across Gemini, Op... | MCP |
| [jules-task-archiver](https://github.com/n24q02m/jules-task-archiver) | Chrome Extension for bulk operations on Jules tasks via batchexecute API -- a... | Tooling |
| [mcp-core](https://github.com/n24q02m/mcp-core) | Shared foundation for building MCP servers -- Streamable HTTP transport, OAut... | MCP |
| [mnemo-mcp](https://github.com/n24q02m/mnemo-mcp) | Persistent AI memory with hybrid search and embedded sync. Open, free, unlimi... | MCP |
| [qwen3-embed](https://github.com/n24q02m/qwen3-embed) | Lightweight Qwen3 text embedding and reranking via ONNX Runtime and GGUF | Library |
| [skret](https://github.com/n24q02m/skret) | Secrets without the server. | CLI |
| [tacet](https://github.com/n24q02m/tacet) | A self-distilling neuro-symbolic cascade that amortises LLM cost across knowl... | Tooling |
| [web-core](https://github.com/n24q02m/web-core) | Shared web infrastructure package for search, scraping, HTTP security, and st... | Library |
| [wet-mcp](https://github.com/n24q02m/wet-mcp) | Open-source MCP server for AI agents: web search, content extraction, and lib... | MCP |

</details>
<!-- END: AUTO-GENERATED-CROSS-PROMO -->

## Table of contents

- [Features](#features)
- [Install](#install)
- [CLI](#cli)
- [Remote (HTTP mode)](#remote-http-mode)
- [Smithery](#smithery)
- [Status](#status)
- [Documentation](#documentation)
- [Tools](#tools)
- [Configuration](#configuration)
- [Comparison](#comparison)
- [Security](#security)
- [Build from Source](#build-from-source)
- [Trust Model](#trust-model)
- [License](#license)



<a href="https://glama.ai/mcp/servers/n24q02m/better-notion-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/n24q02m/better-notion-mcp/badge" alt="Better Notion MCP server" />
</a>

## Features

- **Markdown in, Markdown out** -- human-readable content instead of raw JSON blocks
- **8 composite tools, 39 actions** -- one call instead of chaining 2+ atomic Notion endpoints (plus `config` and `help`)
- **Auto-pagination and bulk operations** -- no manual cursor handling or looping
- **Tiered token optimization** -- ~77% reduction via compressed descriptions + on-demand `help` tool
- **Dual transport** -- local stdio (integration token) or remote HTTP (per-user or shared bearer token)

## Install

Run with `npx` (Node.js >= 24) and a Notion integration token from <https://www.notion.so/my-integrations> (starts with `ntn_`):

```jsonc
// MCP client config (e.g. .mcp.json / Claude Code / Cursor)
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["--yes", "@n24q02m/notion@latest"],
      "env": { "NOTION_TOKEN": "ntn_your_token_here" }
    }
  }
}
```

The package is `@n24q02m/notion` (formerly `@n24q02m/better-notion-mcp`;
old package receives one final release then freezes). The MCP Registry id stays
`io.github.n24q02m/better-notion-mcp`, and the legacy `better-notion-mcp`
command is kept as an alias of `notion`.

Or run the published Docker image (stdio):

```bash
docker run --rm -i -e NOTION_TOKEN=ntn_your_token_here n24q02m/notion:latest
```

### Install matrix

| Client | Install |
|:-------|:--------|
| Claude Code | `/plugin marketplace add n24q02m/claude-plugins` + `/plugin install better-notion-mcp@n24q02m-plugins` (stdio; prompts for `NOTION_TOKEN`), or an `mcpServers` entry in `.mcp.json` / client settings |
| Codex CLI | `[mcp_servers.notion]` block in `~/.codex/config.toml` (stdio `command`/`args` or HTTP `type`/`url`) |
| OpenCode | `mcpServers` block in `opencode.json` |
| Cursor / Windsurf / Gemini CLI / any MCP client | `mcpServers` JSON in the client's config — same shape as the example above |

Full per-client walkthroughs: [mcp.n24q02m.com/servers/better-notion-mcp/setup/](https://mcp.n24q02m.com/servers/better-notion-mcp/setup/).
See the [Documentation](#documentation) section for per-client setup (Claude Code, Codex, Gemini CLI, Cursor, Windsurf) and HTTP mode.

## CLI

Installing the package exposes a `notion` binary (plus the legacy `better-notion-mcp` alias; run it with `npx` or after a global install). With no arguments it starts the MCP server and speaks the protocol over stdin/stdout, so it is normally launched by an MCP client rather than by hand. Subcommands: `auth` stores the Notion integration token; `config`, `status`, `logout`, `doctor`, and `token` come from the shared hull CLI.

```bash
# Start the stdio server (default transport; requires NOTION_TOKEN)
NOTION_TOKEN=ntn_your_token_here npx --yes @n24q02m/notion@latest

# Start the remote HTTP server (bearer token) instead of stdio
npx --yes @n24q02m/notion@latest --http
```

| Argument / env | Effect |
|:---------------|:-------|
| _(none)_ | stdio transport (default); requires `NOTION_TOKEN` |
| `--http` | HTTP transport; auth chosen by `MCP_AUTH_MODE` (`multi` default, `token`, or `no-auth`) |

See [Configuration](#configuration) for the full environment-variable reference.

## Remote (HTTP mode)

Deployed with the HTTP transport, the server is a remote endpoint gated by bearer-token auth -- no integration token in the server config. Point an MCP client that supports remote HTTP servers at the host you deployed it on:

```jsonc
// MCP client config -- remote HTTP (bearer token)
{
  "mcpServers": {
    "notion": {
      "type": "http",
      "url": "https://<your-host>/mcp",
      "headers": { "Authorization": "Bearer <your-token>" }
    }
  }
}
```

In `multi` mode (default) each user is listed in the users file (`MCP_USERS_FILE`, default `~/.hull/users.toml`) and gets their own token and credential namespace. In `token` mode every client shares one token whose scrypt hash is set in `MCP_AUTH_TOKEN_HASH`. To stand up such an instance, see [Self-Hosting (Remote Mode)](#self-hosting-remote-mode).

## Smithery

The repo ships a [`smithery.yaml`](smithery.yaml) config for [Smithery](https://smithery.ai). Smithery launches the server over stdio (`npx -y @n24q02m/notion`) and requires no install-time config -- provide your Notion credentials at runtime through `NOTION_TOKEN` or the `config` tool (see [Configuration](#configuration)).

## Status

> **2026-05-02 -- Architecture stabilization update**
>
> Past months saw significant churn around credential handling and the daemon-bridge auto-spawn pattern. This caused multi-process races, browser tab spam, and inconsistent setup UX across plugins. **The architecture is now stable**: 2 clean modes (stdio + HTTP), no daemon-bridge layer, no auto-spawn from stdio.
>
> Apologies for the instability period. If you encountered issues with prior versions, please update to the latest release and follow the current [Setup guide](https://mcp.n24q02m.com/servers/better-notion-mcp/setup/) -- most prior workarounds are no longer needed.
>
> **Related plugins from the same author**:
> - [wet](https://github.com/n24q02m/wet) -- Web search + content extraction
> - [mnemo](https://github.com/n24q02m/mnemo) -- Persistent AI memory
> - [imagine-mcp](https://github.com/n24q02m/imagine-mcp) -- Image/video understanding + generation
> - [email](https://github.com/n24q02m/email) -- Email management
> - [telegram](https://github.com/n24q02m/telegram) -- Telegram
> - [better-godot-mcp](https://github.com/n24q02m/better-godot-mcp) -- Godot Engine
> - [crg](https://github.com/n24q02m/crg) -- Code review knowledge graph
>
> All plugins share the same architecture -- install once, learn pattern transfers.

## Documentation

Full docs at **[mcp.n24q02m.com/servers/better-notion-mcp/](https://mcp.n24q02m.com/servers/better-notion-mcp/)**:

- [Setup](https://mcp.n24q02m.com/servers/better-notion-mcp/setup/) -- install methods for Claude Code, Codex, Gemini CLI, Cursor, Windsurf, mcp.json
- [Modes overview](https://mcp.n24q02m.com/get-started/modes-overview/) -- stdio (local, integration token) and HTTP (remote, bearer token)
- [Multi-user setup](https://mcp.n24q02m.com/get-started/multi-user/) -- per-user credential namespace (HTTP mode)

**Install with AI agent** -- paste this to your AI coding agent:

> Install MCP server `notion` following the steps at
> https://raw.githubusercontent.com/n24q02m/claude-plugins/main/plugins/better-notion-mcp/setup-with-agent.md

## Tools

Eight composite Notion tools (39 actions) plus two infrastructure tools (`config`, `help`):

| Tool | Actions | Description |
|:-----|:--------|:------------|
| `pages` | `create`, `get`, `get_property`, `update`, `move`, `archive`, `restore`, `duplicate` | Create, read, update, and organize pages |
| `databases` | `create`, `get`, `query`, `create_page`, `update_page`, `delete_page`, `create_data_source`, `update_data_source`, `update_database`, `list_templates` | Database CRUD and page management within databases |
| `blocks` | `get`, `children`, `append`, `update`, `delete` | Read and manipulate block content |
| `users` | `list`, `get`, `me`, `from_workspace` | List and retrieve user information |
| `workspace` | `info`, `search` | Workspace metadata and cross-workspace search |
| `comments` | `list`, `get`, `create` | Page comments and discussion replies |
| `content_convert` | `markdown-to-blocks`, `blocks-to-markdown` | Convert between Markdown and Notion blocks (uses a `direction` parameter) |
| `file_uploads` | `create`, `send`, `complete`, `retrieve`, `list` | Upload files to Notion (single or multi-part) |
| `config` | `status`, `setup_status`, `setup_start`, `setup_reset`, `setup_complete`, `set`, `cache_clear` | Inspect and manage credential state and configuration lifecycle |
| `help` | - | Get full documentation for any composite tool (`tool_name` parameter) |

### MCP Resources

| URI | Description |
|:----|:------------|
| `notion://docs/pages` | Page operations reference |
| `notion://docs/databases` | Database operations reference |
| `notion://docs/blocks` | Block operations reference |
| `notion://docs/users` | User operations reference |
| `notion://docs/workspace` | Workspace operations reference |
| `notion://docs/comments` | Comment operations reference |
| `notion://docs/content_convert` | Content conversion reference |
| `notion://docs/file_uploads` | File upload reference |

## Configuration

| Variable | Required | Default | Description |
|:---------|:---------|:--------|:------------|
| `NOTION_TOKEN` | Yes (stdio) | - | Notion integration token |
| `TRANSPORT_MODE` / `MCP_TRANSPORT` | No | `stdio` | Set either to `http` for remote mode (or pass `--http`) |
| `MCP_AUTH_MODE` | No (http) | `multi` | `multi` (per-user tokens from `MCP_USERS_FILE`), `token` (one shared token, needs `MCP_AUTH_TOKEN_HASH`), or `no-auth` (trusted/local use only) |
| `MCP_USERS_FILE` | No (http, multi) | `~/.hull/users.toml` | Users file for `multi` mode |
| `MCP_AUTH_TOKEN_HASH` | Yes (token mode) | - | `scrypt$` hash of the shared token (mint with `token hash`) |
| `MCP_RPM` | No (token mode) | - | Optional per-minute request cap in token mode |
| `PORT` | No | `0` (OS-assigned) | Server port; set explicitly (e.g. `8080`) to bind a fixed port |
| `HOST` | No | `127.0.0.1` | Bind address (http mode) |

### Self-Hosting (Remote Mode)

Run the HTTP server on your own host and choose an auth mode with `MCP_AUTH_MODE`:

- `multi` (default): list each user in `MCP_USERS_FILE`; each user's Notion token is stored in their own namespace (`~/.better-notion/subs/<ns>/config.json`).
- `token`: one shared bearer token. Mint the hash with `token hash` and pass it as `MCP_AUTH_TOKEN_HASH`.
- `no-auth`: no bearer check. Use only on a trusted local network.

```bash
docker run -p 8080:8080 \
  -e TRANSPORT_MODE=http \
  -e PORT=8080 \
  -e MCP_AUTH_MODE=token \
  -e MCP_AUTH_TOKEN_HASH='scrypt$...' \
  n24q02m/notion:latest
```

### Docker Compose (loopback)

[`docker-compose.http.yml`](docker-compose.http.yml) builds the `http` image target and publishes it on the host loopback interface only (`127.0.0.1:8081`), so the server is never reachable from other machines directly:

```bash
export MCP_AUTH_MODE=token
export MCP_AUTH_TOKEN_HASH='scrypt$...'
docker compose -f docker-compose.http.yml up
```

The server listens on <http://localhost:8081/mcp>. To expose it, put your own TLS reverse proxy in front of the loopback port.

Release images are published multi-arch (amd64 + arm64) to Docker Hub (`n24q02m/notion`) and GHCR (`ghcr.io/n24q02m/notion`). There is no n24q02m-hosted HTTP endpoint.

## Comparison

How notion stacks up against direct competitors in each pillar:

| Capability | notion | makenotion/notion-mcp-server | suekou/mcp-notion-server | awkoy/notion-mcp-server |
|---|---|---|---|---|
| Markdown in / out | Yes (round-trip on pages + blocks) | No (raw Notion JSON) | partial (experimental, append + opt-in convert) | Yes (round-trip + GFM) |
| Composite tool design | Yes (8 composite tools, 39 actions) | No (22 endpoint-mapped tools) | partial (simplified + raw JSON tools) | Yes (2 dispatch tools, 35+ ops) |
| File uploads to Notion | Yes (`file_uploads`, single + multi-part) | No | No | Yes (`upload_file`, single + multi-part) |
| Comments | Yes (`comments`: list/get/create) | Yes | Yes | Yes |
| Remote HTTP + bearer-token auth | Yes (per-user namespaces or shared token) | partial (HTTP + bearer token) | No (stdio token only) | No (stdio token only) |
| Self-hostable | Yes (Docker, own bearer token) | Yes | Yes | Yes |
| License | Apache-2.0 | ? | MIT | MIT |

## Security

- **Bearer token auth** -- per-user tokens (`multi`) or one scrypt-hashed shared token (`token`)
- **Rate limiting** -- 120 req/min/IP on HTTP transport
- **Session owner binding** -- IP check + TTL for pending token binds
- **Null safety** -- Handles Notion API quirks (comments.list 404, undefined rich_text)

## Build from Source

```bash
git clone https://github.com/n24q02m/notion.git
cd notion
bun install
bun run dev
```

## Trust Model

Credentials are never sent to n24q02m: there is no hosted endpoint.

| Mode | Storage | Protection | Who can read your data? |
|---|---|---|---|
| HTTP self-host (`multi`) | `~/.better-notion/subs/<ns>/config.json` on the server host | File mode 0600 under the server's data dir | The server operator and anyone with access to that host |
| HTTP self-host (`token`) | `~/.better-notion/config.json` on the server host | File mode 0600 under the server's data dir | The server operator and anyone with access to that host |
| stdio (local) | `~/.better-notion/config.json` | File mode 0600; machine key in `~/.better-notion/.secret` | Only your OS user |

## License

Apache-2.0 -- See [LICENSE](LICENSE).
