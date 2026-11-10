#!/usr/bin/env python3
"""PreToolUse hook: hint when notion credentials are not configured.

Non-blocking hint only. A Notion integration token comes from the NOTION_TOKEN
env var or from `notion auth` (stored in ~/.notion/config.json). In stdio mode the
server refuses to start without a token and prints setup options on stderr; in
HTTP mode the token is per user namespace (`notion auth --user <ns>`). A store an
earlier release wrote under ~/.better-notion/ is copied forward on startup
(src/data-dir-migration.ts); it and ~/.better-notion-mcp/ are still accepted here
so an install that has not restarted yet is not nagged. There is no relay or
browser setup form.
"""

import json
import os
import sys

# Add plugins root to sys.path for shared utilities
# Add plugins root to sys.path for shared utilities if in marketplace
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
try:
    from mcp_common import read_mcp_hook_input
except ImportError:
    def read_mcp_hook_input() -> dict:
        data = None
        try:
            data = json.loads(sys.stdin.read(64 * 1024))
        except Exception:
            pass
        if not isinstance(data, dict):
            print(
                json.dumps(
                    {
                        "decision": "block",
                        "reason": "Invalid input: payload must be a JSON dictionary",
                    }
                )
            )
            sys.exit(2)
        return data

CREDENTIAL_KEYS = ["NOTION_TOKEN"]
EXEMPT_SUFFIXES = ("__setup", "__help", "__config")


def _is_configured() -> bool:
    for k in CREDENTIAL_KEYS:
        if os.environ.get(k):
            return True
    home = os.path.expanduser("~")
    # `~/.notion/` is the current store. `~/.better-notion/` and
    # `~/.better-notion-mcp/` are pre-rename layouts kept as read-only accept
    # paths so an install that has not restarted yet is not nagged.
    for p in (
        home + "/.notion/config.json",
        home + "/.better-notion/config.json",
        home + "/.better-notion-mcp/config.json",
        home + "/.config/mcp/config.enc",
        os.path.join(home, ".config", "mcp", "config.enc"),
    ):
        if os.path.exists(p):
            return True
    return False


def main() -> None:
    data = read_mcp_hook_input()

    tool_name = data.get("tool_name")
    if not isinstance(tool_name, str):
        tool_name = ""
    if tool_name.endswith(EXEMPT_SUFFIXES):
        sys.exit(0)

    if _is_configured():
        sys.exit(0)

    # Non-blocking hint: point at the real setup paths (the server itself does not
    # open any setup form)
    print(
        json.dumps(
            {
                "message": (
                    "notion: credentials not yet configured. "
                    "Set NOTION_TOKEN in the plugin config or run "
                    "`npx -y @n24q02m/notion auth`."
                ),
            }
        )
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
