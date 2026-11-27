# notion - Notion MCP server, optimized for AI agents
# Multi-target Dockerfile: `:stdio` (default for clients) + `:http` (self-hosted daemon).
# See spec 2026-04-30-multi-mode-stdio-http-architecture.md.
# syntax=docker/dockerfile:1

# Use bun for dependency installation
FROM oven/bun:1-alpine@sha256:da816670775f4c2b4e990b6b1847cf5540dcdc721a42033dd331ce7a88ba6a3b AS deps

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Use Node.js for building (tsc + esbuild)
FROM node:24.22.3-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the package
RUN npm run build

# Base runtime stage (shared by both targets)
FROM node:24.22.3-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS base

LABEL org.opencontainers.image.source="https://github.com/n24q02m/notion"
# MCP Registry id must match server.json `name` and package.json `mcpName`;
# it is the GitHub owner/repo pair, so it is not the package name.
LABEL io.modelcontextprotocol.server.name="io.github.n24q02m/notion"

# Copy built package from builder stage
COPY --from=builder /app/build /usr/local/lib/node_modules/@n24q02m/notion/build
COPY --from=builder /app/bin /usr/local/lib/node_modules/@n24q02m/notion/bin
COPY --from=builder /app/skills /usr/local/lib/node_modules/@n24q02m/notion/skills
COPY --from=builder /app/package.json /usr/local/lib/node_modules/@n24q02m/notion/
COPY --from=builder /app/README.md /usr/local/lib/node_modules/@n24q02m/notion/
COPY --from=builder /app/LICENSE /usr/local/lib/node_modules/@n24q02m/notion/
COPY --from=builder /app/node_modules /usr/local/lib/node_modules/@n24q02m/notion/node_modules

# Create symlinks for CLI (notion + legacy better-notion-mcp alias)
RUN ln -s /usr/local/lib/node_modules/@n24q02m/notion/bin/cli.mjs /usr/local/bin/notion \
    && ln -s /usr/local/lib/node_modules/@n24q02m/notion/bin/cli.mjs /usr/local/bin/better-notion-mcp \
    && chmod +x /usr/local/lib/node_modules/@n24q02m/notion/bin/cli.mjs

ENV NODE_ENV=production

# Mount point for the credential store (NOTION_DATA_DIR=/data). A named volume
# takes the ownership of this directory on first mount, so the non-root user can
# write to it.
RUN mkdir -p /data && chown node:node /data

USER node

# stdio target: direct MCP SDK StdioServerTransport (no daemon hop).
# Intended for `docker run --rm -i n24q02m/notion:stdio` from MCP clients.
FROM base AS stdio
ENV MCP_TRANSPORT=stdio
ENTRYPOINT ["node", "/usr/local/lib/node_modules/@n24q02m/notion/bin/cli.mjs"]

# http target: HTTP daemon (runLocalServer). Self-hosted deployment.
FROM base AS http
ENV MCP_TRANSPORT=http
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["node", "/usr/local/lib/node_modules/@n24q02m/notion/bin/cli.mjs"]
