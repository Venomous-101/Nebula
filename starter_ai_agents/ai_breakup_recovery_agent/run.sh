#!/usr/bin/env bash
# Setup + supervised launch for the AI Breakup Recovery Agent.
#
#   ./run.sh                 # serve on 0.0.0.0:8501, auto-restart if it crashes
#   PORT=9000 ./run.sh       # custom port
#
# Idempotent: creates the virtualenv and installs dependencies only when they
# are missing, so re-running after a machine reset is a single command.
# Supervised: if Streamlit exits unexpectedly it is restarted (2s backoff).
set -uo pipefail

cd "$(dirname "$0")"

PYTHON="${PYTHON:-python3}"
VENV_DIR=".venv"
PORT="${PORT:-8501}"
RESTART_DELAY="${RESTART_DELAY:-2}"

if [ ! -x "$VENV_DIR/bin/python" ]; then
  echo "==> Creating virtualenv ($VENV_DIR)"
  "$PYTHON" -m venv "$VENV_DIR" || exit 1
fi

# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

# Check the imports the app actually needs -- both providers plus tools.
if ! python -c "import streamlit, agno, openai; from agno.tools.duckduckgo import DuckDuckGoTools; from agno.models.openrouter import OpenRouter" >/dev/null 2>&1; then
  echo "==> Installing dependencies (~25s on a cold machine)"
  pip install --quiet --upgrade pip
  pip install --quiet -r requirements.txt || { echo "==> dependency install failed"; exit 1; }
else
  echo "==> Dependencies already installed, skipping"
fi

STOPPING=0
CHILD=""
shutdown() {
  STOPPING=1
  [ -n "$CHILD" ] && kill "$CHILD" 2>/dev/null
}
trap shutdown TERM INT

while :; do
  streamlit run ai_breakup_recovery_agent.py \
    --server.address=0.0.0.0 \
    --server.port="$PORT" \
    --server.headless=true \
    --server.enableCORS=false \
    --server.enableXsrfProtection=false \
    --browser.gatherUsageStats=false &
  CHILD=$!
  echo "==> streamlit running (pid $CHILD) on http://0.0.0.0:$PORT"

  wait "$CHILD"
  CODE=$?

  if [ "$STOPPING" = "1" ]; then
    echo "==> stopped"
    exit 0
  fi
  echo "==> streamlit exited (code $CODE); restarting in ${RESTART_DELAY}s"
  sleep "$RESTART_DELAY"
done
