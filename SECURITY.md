# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT** create a public issue.

Instead, please email: **quangminh2402.dev@gmail.com**

Include:

1. Detailed description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

You will receive acknowledgment within 48 hours.

## Security Measures

- Regular dependency updates via Renovate
- npm audit checks in CI
- Docker images from official sources, non-root user
- Bearer token auth on the HTTP transport: per-user tokens (`multi`) or one scrypt-hashed shared token (`token`)
- Optional requests-per-minute cap on the HTTP transport (`MCP_RPM` in `token` mode, `limits.rpm` per user in `multi` mode); requests over the cap get HTTP 429
- X-Powered-By header disabled
- Error sanitization (whitelist-only fields, no token leakage)
- Indirect prompt injection defense (untrusted content markers)
- Path traversal prevention in help/docs endpoints
- Environment variables for sensitive data
- Least privilege principle
