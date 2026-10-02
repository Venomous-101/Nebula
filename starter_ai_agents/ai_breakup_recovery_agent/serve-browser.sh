#!/usr/bin/env bash
# Serve the Browser Edition. No dependencies, no build step.
#
#   ./serve-browser.sh          # http://0.0.0.0:8000
#   PORT=9000 ./serve-browser.sh
#
# The page calls OpenRouter directly from the visitor's browser, so it works
# even on hosts whose egress to LLM providers is blocked (see DEPLOY.md).
set -euo pipefail
cd "$(dirname "$0")"
PORT="${PORT:-8000}"
echo "==> Browser Edition on http://0.0.0.0:${PORT}"
exec python3 -m http.server "$PORT" --directory browser --bind 0.0.0.0
