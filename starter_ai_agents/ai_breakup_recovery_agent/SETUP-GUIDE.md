# Setup Guide

Everything you need to run the **Breakup Recovery Squad**, written for two kinds
of people: those who have never opened a terminal, and those who have.

The app is one of 100+ AI agents in the [Nebula](https://github.com/Venomous-101/Nebula)
repository. It is free, open source, and Apache 2.0 licensed.

**What it does:** you write how you feel (or upload screenshots of a chat), and
four AI agents run one after another:

| Agent | What it gives you |
|---|---|
| Emotional Support | Empathy, validation, comfort |
| Finding Closure | Templates for unsent messages, closure rituals |
| Your Recovery Plan | A structured 7 day plan |
| Honest Perspective | Direct, unsoftened feedback |

You need one thing: a free API key from OpenRouter. No credit card.

---

## Part 1. No installation (easiest)

Use this if you do not want to install anything.

1. Open the app link shared with this guide.
2. Go to [openrouter.ai](https://openrouter.ai/) and create a free account.
3. Visit [openrouter.ai/keys](https://openrouter.ai/keys) and click **Create Key**.
4. Copy the key. It starts with `sk-or-v1-` and is **73 characters long**.
   Copy the whole thing. This is the single most common mistake.
5. Paste the key into the **OpenRouter API Key** box in the app.
6. Write how you feel, or upload a screenshot, then press
   **Get Recovery Plan**.

Nothing is stored. The key stays in your browser tab and is never sent to the
site serving the page. Requests go straight from your browser to OpenRouter.

**Privacy note:** because the key lives in the page, use a key you can revoke.
You can delete it at any time from openrouter.ai/keys.

---

## Part 2. Run it on your own computer

Use this if you want to run it locally or change the code.

You need Python 3 on your machine. Mac and Linux already have it. On Windows,
install it from [python.org](https://www.python.org/downloads/).

### Step 1. Get the code

```bash
git clone https://github.com/Venomous-101/Nebula.git
cd Nebula/starter_ai_agents/ai_breakup_recovery_agent
```

No git? Download the repository as a ZIP from GitHub and extract it, then open a
terminal in that folder.

### Step 2. Two ways to run it

**Option A. Browser Edition.** No dependencies, starts instantly:

```bash
./serve-browser.sh
```

Then open <http://localhost:8000> in your browser. On Windows, run
`python3 -m http.server 8000 --directory browser --bind 127.0.0.1` instead.

This version calls OpenRouter directly from your browser. It works even on
restricted networks that block outbound AI traffic, because your browser is not
subject to those blocks.

**Option B. Full Streamlit app.** Better interface, more features:

```bash
./run.sh
```

First run takes about 30 seconds to install dependencies, then it opens at
<http://localhost:8501>. This version supports both **Gemini** and
**OpenRouter**, selectable in the sidebar.

To stop either one, press `Ctrl + C`.

---

## Part 3. Put it online permanently

### Option A. GitHub Pages (free, best for the Browser Edition)

The Browser Edition is a single static file, so GitHub can host it for free.

1. Push the repository to your own GitHub account.
2. Open the repository, go to **Settings**, then **Pages**.
3. Under **Source**, pick **Deploy from a branch**, choose `main` and `/ (root)`,
   then save.
4. Wait about a minute. Your app will be live at:

```
https://YOUR-USERNAME.github.io/Nebula/starter_ai_agents/ai_breakup_recovery_agent/browser/
```

Anyone can open that link and use the app with their own key.

### Option B. Docker (any server)

```bash
docker build -t breakup-recovery .
docker run -d -p 8501:8501 --restart unless-stopped breakup-recovery
```

The `--restart unless-stopped` flag means it comes back automatically after a
reboot. Works on any VPS, plus Render, Fly.io, Railway, and Cloud Run.

### Option C. Streamlit Community Cloud (free)

1. Push the repository to GitHub.
2. Go to [share.streamlit.io](https://share.streamlit.io) and click **New app**.
3. Choose your repository and set the main file path to:

```
starter_ai_agents/ai_breakup_recovery_agent/ai_breakup_recovery_agent.py
```

4. Deploy. You get a permanent public URL.

---

## Part 4. Troubleshooting

These are the exact failures this project hit during setup. Most people meet at
least one of them.

| Symptom | What it means | Fix |
|---|---|---|
| `401 User not found` | The key is wrong or incomplete | Create a new key and copy all 73 characters |
| `402` or payment error | No balance on the account | Use a `:free` model such as `openrouter/free` |
| `404 model not found` | The model ID was retired | Type a current model in the **Model ID** box |
| `Connection error` on every agent | The host blocks outbound AI traffic | Use the Browser Edition |
| `502 Bad Gateway` | The server process stopped | Restart it with `./serve-browser.sh` |
| `ImportError: FileSearch` | `google-genai` is too old | `pip install -U google-genai` |
| `No module named 'ddgs'` | A package was renamed upstream | `pip install ddgs` |
| The model returns nothing | The model does not support images or tools | Use `openrouter/free` |

### Test whether a key is valid

One command answers it. A `200` means the key is good and the problem is
somewhere else. A `401` means the key is dead.

```bash
curl https://openrouter.ai/api/v1/auth/key -H "Authorization: Bearer sk-or-v1-YOUR-KEY"
```

### Why so many things break over time

AI projects rot faster than normal software, for three reasons:

1. **Models get retired.** `gemini-2.0-flash-exp` was shut down on 1 June 2026.
   Any project still calling it fails, no matter how new the code looks.
2. **Packages get renamed.** `duckduckgo-search` became `ddgs`. Older pins break
   silently.
3. **Hosts block outbound AI traffic.** On restricted networks, only package
   registries are reachable.

This project already handles all three: model IDs are editable, dependencies are
current, and the Browser Edition works around network blocks entirely.

---

## Frequently asked questions

**Do I need to pay anything?**
No. OpenRouter has free models. The app defaults to `openrouter/free`, which
auto-selects a free model that supports images and tool calling.

**Is my data stored?**
In the Browser Edition, no. Your key and your messages go directly from your
browser to OpenRouter. The site hosting the page never sees them.

**Can I use this for something other than breakups?**
Yes. Edit the four prompts in `browser/index.html` or
`ai_breakup_recovery_agent.py`. The same pattern works for any multi-step
advisor.

**Why does the Streamlit version not work in some online sandboxes?**
It makes API calls server side, and many sandboxes only allow package
registries. The Browser Edition exists for exactly that reason.

**License?**
Apache 2.0. Clone it, fork it, change it, ship it, sell it.

---

## Links

| | |
|---|---|
| Repository (100+ AI agents) | https://github.com/Venomous-101/Nebula |
| OpenRouter sign up | https://openrouter.ai/ |
| Create an API key | https://openrouter.ai/keys |
| Browse models | https://openrouter.ai/models |
| Original upstream project | https://github.com/Shubhamsaboo/awesome-llm-apps |
