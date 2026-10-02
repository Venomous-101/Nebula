# Why the hosted preview keeps dying — and how to make it permanent

## Short version

Runs fine. The **hosted sandbox preview** is the fragile part: it is wiped
between sessions, taking the Python environment and the server process with it.
Nothing inside the sandbox can survive that. To get a URL that never dies,
deploy it (see below).

## Evidence

Every session starts on a freshly booted machine:

```console
$ uptime
 22:48:46 up 0 min, 0 user,  load average: 0.15, 0.03, 0.01
```

What survives a reset and what does not:

| Item | Survives? | Why |
|---|---|---|
| Source files (`*.py`, `run.sh`, …) | ✅ | Captured in the workspace snapshot |
| Git commits | ❌ | Snapshot restores the tree, not the commit history |
| `.venv/` | ❌ | Explicitly excluded from snapshots |
| Running processes | ❌ | Fresh container — nothing is started for you |
| `~/.cache/pip`, `/tmp` | ❌ | Outside the workspace |

Rebuilding the environment is not a quick fix either. The dependency set is
large:

```console
$ du -sh .venv && find .venv -type f | wc -l
629M	.venv
21158
```

**629 MB / 21,158 files**, against a snapshot cap of roughly
**128 MB / 10,000 files**. A prebuilt virtualenv can never be shipped inside the
snapshot, so it is rebuilt on every cold start (~25s, handled automatically by
`run.sh`).

## Recovery: one command

`run.sh` is idempotent and supervised. It only builds the venv when missing and
only installs when imports actually fail, then keeps Streamlit alive by
restarting it if it exits.

```bash
./run.sh                # 0.0.0.0:8501
PORT=9000 ./run.sh      # custom port
```

## Permanent options

### 1. Streamlit Community Cloud — best fit, free

This is a single-file Streamlit app, so it deploys with no changes.

1. Push this repo to GitHub (a fork is fine).
2. Go to <https://share.streamlit.io> → **New app**.
3. Pick the repo, branch `main`, and set the main file path to
   `starter_ai_agents/ai_breakup_recovery_agent/ai_breakup_recovery_agent.py`.
4. Deploy. You get a permanent public URL.

The app takes its API key from the sidebar at runtime, so no secrets need to be
configured. If you would rather supply one server-side, add `GEMINI_API_KEY` or
`OPENROUTER_API_KEY` under **App → Settings → Secrets** and read it with
`st.secrets`.

### 2. Docker — any VPS, Render, Fly.io, Railway, Cloud Run

```bash
docker build -t breakup-recovery .
docker run -d -p 8501:8501 --restart unless-stopped breakup-recovery
```

`--restart unless-stopped` survives reboots. The image ships a `HEALTHCHECK`
against `/_stcore/health`, which most platforms use to auto-restart unhealthy
containers.

### 3. Your own machine

```bash
./run.sh
```

## Notes on this app

- **Keys are entered in the sidebar**, not read from `.env` — the app hardcodes
  no credentials.
- Shipping model IDs go stale. Both defaults are editable in the UI:
  `gemini-3.5-flash` (the old `gemini-2.0-flash-exp` was shut down on
  2026-06-01) and `openrouter/free`.
- `openrouter/free` is an auto-router that only picks models supporting what a
  request needs. This app needs **image input** (screenshots) *and* **tool
  calling** (`brutal_honesty_agent` uses DuckDuckGo), so a text-only model will
  fail. Override with `google/gemma-4-31b-it:free` if you want a fixed model.
