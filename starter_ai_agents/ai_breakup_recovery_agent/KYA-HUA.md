# Kya Hua, Kya Badla, Aur Koi Aur Kaise Chalayega

Poori kahani — repo kya hai, humne kya kiya, aur doosre log ise kaise use karein.

---

## 1. Yeh repo asal mein kya hai?

**Repo:** `Venomous-101/Nebula`
**Asal:** Yeh **"Awesome LLM Apps"** ka copy hai (original: `Shubhamsaboo/awesome-llm-apps`)
**License:** Apache-2.0 — free hai, bech bhi sakte hain, badal bhi sakte hain

**Sabse zaroori baat:** Yeh **ek app nahi hai.** Yeh **160 chhote chhote alag alag
projects ka collection** hai.

```
Nebula/
├── starter_ai_agents/       (18 apps)  — single-file agents
├── advanced_ai_agents/      — multi-agent apps, game agents
├── advanced_llm_apps/       — chat-with-X, finetuning, memory
├── rag_tutorials/           (26 apps)  — RAG ke 26 alag tareeqe
├── mcp_ai_agents/           (7 apps)   — MCP-based agents
├── voice_ai_agents/         (4 apps)   — voice agents
├── generative_ui_agents/    (8 apps)   — UI banane wale agents
├── always_on_agents/        (2 apps)   — 24/7 chalne wale agents
├── agent_skills/            (8 skills) — coding agent ke skills
└── ai_agent_framework_crash_course/    — Google ADK + OpenAI SDK courses
```

**Har folder apna alag project hai** — apni `requirements.txt`, apna README,
apna run command. Koi global install nahi hai.

**Yeh repo kis liye bana hai:** Seekhne aur reference ke liye. Yeh "install karo
aur chal pade" wala product nahi hai. Isliye har app ko thoda setup chahiye hota hai.

---

## 2. Humne is repo se kya use kiya?

Sirf **ek** app, 160 mein se:

```
starter_ai_agents/ai_breakup_recovery_agent/
```

**Kya karta hai:** Aap apni feelings likhte hain (ya chat screenshots upload karte
hain), aur **4 AI agents** ek ke baad ek chalte hain:

| # | Agent | Kaam |
|---|---|---|
| 1 | 🤗 Emotional Support | Empathy, validation, comfort |
| 2 | ✍️ Finding Closure | Unsent messages, closure rituals |
| 3 | 📅 Recovery Plan | 7-din ka recovery plan |
| 4 | 💪 Honest Perspective | Seedhi baat, no sugar-coating (web search use karta hai) |

Baaki 159 apps ko **humne chhua tak nahi.**

---

## 3. Kya kya masle aaye, aur kyun?

Chaar alag alag masle the. Yeh samajhna zaroori hai kyunki **har masle ki wajah alag thi:**

### Masla #1 — Model band ho chuka tha (TIME ki wajah se)

App mein `gemini-2.0-flash-exp` hardcoded tha. Google ne is model ko
**1 June 2026** ko band kar diya.

```
❌ Gemini 2.0 Flash — Shut down: 1 June 2026
✅ Replacement: gemini-3.5-flash
```

Repo September 2026 mein update hua tha, **lekin pins nahi chhue** — isliye
fresh dikhta hai magar app toota hua hai. Yeh sabse bara trap hai.

### Masla #2 — Packages rename ho gaye (TIME ki wajah se)

```
❌ duckduckgo-search   →   ✅ ddgs        (upstream ne naam badal diya)
❌ google-genai==1.9.0 →   ✅ >=2.0.0    (agno ke saath import crash)
```

`google-genai==1.9.0` pinned tha, jo `agno>=2.2.10` ke liye **bahut purana** hai:

```
ImportError: cannot import name 'FileSearch' from 'google.genai.types'
```

### Masla #3 — "Connection error" (SANDBOX ki wajah se) ⚠️

Yeh sabse confusing tha. Aapki key sahi thi, code sahi tha — phir bhi
charon agents "Connection error" de rahe the.

**Wajah:** Yeh sandbox **firewalled** hai. Sirf package registries khuli hain,
koi bhi AI provider nahi:

| Host | Result |
|---|---|
| `pypi.org`, `registry.npmjs.org`, `codeload.github.com` | ✅ khula |
| `openrouter.ai` | ❌ TLS reset |
| `generativelanguage.googleapis.com` | ❌ TLS reset |
| `api.openai.com`, `api.groq.com`, `api.mistral.ai` | ❌ TLS reset |

Yaani: sandbox **code install kar sakta hai, magar AI se baat nahi kar sakta.**
Streamlit app API call **server-side** karta hai → hamesha fail hoga. Koi key
isay theek nahi kar sakti thi.

### Masla #4 — "401 User not found" (KEY ki wajah se)

Aakhri error aaya jab Browser Edition chala. Iska matlab:

```json
{"message":"User not found","code":401}
```

**OpenRouter ne aapki key pehchani hi nahi.** Wajah: aapki key field mein
~24 characters the, jab ke asli key **73 characters** hoti hai:

```
sk-or-v1- + 64 hex characters  =  73 characters
```

Yani adhoori key paste hui thi. Nayi key banane par **sab kaam kar gaya. ✅**

---

## 4. Sandbox ka asli raaz (yeh samajhna zaroori hai)

Preview baar baar "502 Bad Gateway" de raha tha. Aakhir mein pakra gaya:

```console
$ uptime
 23:04:46 up 0 min, 0 user     ← machine ABHI boot hui hai
```

**Sandbox har session ke beech poora tabah (destroy) aur naya banaya jata hai.**
Yeh crash nahi tha — nayi machine thi.

Kya bachta hai, kya nahi:

| Cheez | Bachti hai? | Kyun |
|---|---|---|
| Source files (`.py`, `.html`) | ✅ | Workspace snapshot mein |
| **Git commits** | ❌ | Base commit par reset ho jate hain |
| **`.venv/`** | ❌ | Snapshot se **exclude** hai |
| **Chalta hua process** | ❌ | Nayi machine, kuch chal nahi raha |
| `/tmp`, pip cache | ❌ | Workspace ke bahar |

Aur environment ship karna bhi mumkin nahi:

```console
$ du -sh .venv && find .venv -type f | wc -l
629M	.venv
21158
```

**629 MB / 21,158 files** — jab ke snapshot limit sirf **~128 MB / 10,000 files** hai.
Yani prebuilt venv **kabhi fit nahi ho sakta.** Isliye har baar dobara banna parta hai.

**Isliye:** Sandbox mein koi bhi process reset ke baad zinda nahi reh sakta.
Yeh platform ki limit hai, code ka masla nahi.

---

## 5. Humne kya changes kiye? (ab tak ka total)

**Sab changes sirf EK folder mein hain:**
`starter_ai_agents/ai_breakup_recovery_agent/`

**Baaki 159 folders bilkul original hain — kuch nahi chhua.** ✅

```console
$ git diff --stat d467049 origin/arena/01a0febf-nebula
 9 files changed, 737 insertions(+), 15 deletions(-)
```

### Purani files mein tabdeeli (2)

| File | Kya badla |
|---|---|
| `requirements.txt` | `google-genai>=2.0.0`, `ddgs` add, `openai` add |
| `ai_breakup_recovery_agent.py` | Provider selector (Gemini/OpenRouter), model override, dead model fix |

### Nayi files (7)

| File | Kaam |
|---|---|
| **`browser/index.html`** | ⭐ **Browser Edition** — asli fix jo kaam kiya |
| `serve-browser.sh` | Browser Edition chalane ke liye (1 command) |
| `run.sh` | Streamlit app — auto-restart supervisor ke saath |
| `Dockerfile` | Kisi bhi VPS par permanent deploy |
| `.dockerignore` | Build clean rakhne ke liye |
| `.gitignore` | `.venv` galti se commit na ho |
| **`DEPLOY.md`** | Poora technical record — reset evidence, firewall proof, deploy steps |

### Sabse bara change: Browser Edition

**Masla:** Sandbox AI providers tak nahi pahunch sakta.
**Hal:** API call **aapke browser se** karo, sandbox se nahi. Browser firewalled nahi hai.

`browser/index.html` — ek single HTML file:
- 4 agents, same prompts, live streaming
- Screenshot upload (multimodal)
- **Zero dependencies** — na Python, na venv, na 629 MB
- **Aapki API key browser mein rehti hai**, sandbox server ko kabhi nahi jati

**Yeh sirf OpenRouter ke saath kaam karta hai** — kyunki OpenRouter
browser-origin calls allow karta hai:

```
access-control-allow-origin: *
```

Google, OpenAI, aur Anthropic **browser se calls allow nahi karte** (CORS block).
Isliye Browser Edition OpenRouter-only hai — aur Gemini is preview mein
**kabhi kaam nahi karega.**

---

## 6. Koi aur isay kaise chalayega? (step-by-step)

### Sabse aasan tareeqa — Browser Edition (recommended)

**Zaroorat:** Sirf Python 3 (already har Mac/Linux par hota hai)

**Step 1 — Repo clone karein:**
```bash
git clone https://github.com/Venomous-101/Nebula.git
cd Nebula
```

**Step 2 — Sahi folder mein jayein:**
```bash
cd starter_ai_agents/ai_breakup_recovery_agent
```

**Step 3 — Server chalayein:**
```bash
./serve-browser.sh
```
(output aayega: `==> Browser Edition on http://0.0.0.0:8000`)

**Step 4 — Browser mein kholein:**
```
http://localhost:8000
```

**Step 5 — API key lein:**
1. [openrouter.ai](https://openrouter.ai/) par sign up karein — **free models ke liye card nahi chahiye**
2. [openrouter.ai/keys](https://openrouter.ai/keys) par jayein
3. **"Create Key"** dabayein
4. ⚠️ **POORI key copy karein** — **73 characters** honi chahiye (`sk-or-v1-` + 64)
5. Key **workspace ke andar** banayein, admin key nahi

**Step 6 — Use karein:**
- Key paste karein sidebar mein
- Apni feelings likhein (ya screenshots upload karein)
- **Get Recovery Plan 💝** dabayein

Bas! Chal jayega.

---

### Doosra tareeqa — Streamlit app (behtar UI)

Yeh **local machine par** chalta hai (sandbox mein nahi, kyunki wahan API blocked hai).

```bash
cd starter_ai_agents/ai_breakup_recovery_agent
./run.sh
```

Pehli baar ~25 second lagega (dependencies install hongi), phir
`http://localhost:8501` par khul jayega.

**Faida:** Yeh **Gemini aur OpenRouter dono** support karta hai.
**Nuksan:** Sandbox mein nahi chalega — local ya deploy par chalega.

---

### Teesra tareeqa — Permanent live URL (hamesha chalta rahe)

**Streamlit Community Cloud** — free, aur yeh app perfect fit hai:

1. Repo ko apne GitHub par push karein
2. [share.streamlit.io](https://share.streamlit.io) par jayein → **New app**
3. Main file path dein:
   ```
   starter_ai_agents/ai_breakup_recovery_agent/ai_breakup_recovery_agent.py
   ```
4. Deploy → **permanent public URL**

**Ya Docker se** (kisi bhi VPS par — Render, Fly.io, Railway, Cloud Run):
```bash
docker build -t breakup-recovery .
docker run -d -p 8501:8501 --restart unless-stopped breakup-recovery
```

`--restart unless-stopped` matlab reboot ke baad bhi khud chalega.

---

## 7. Masle aa jayein to? (troubleshooting)

| Error | Matlab | Hal |
|---|---|---|
| `401 User not found` | Key ghalat/adhoori | Nayi key banayein, **poori 73 chars** copy karein |
| `402` | Balance khatam | Free model (`openrouter/free`) use karein |
| `404 model not found` | Model ID purana | Model ID box mein doosra model likhein |
| `Connection error` | Network block | Browser Edition use karein (server-side call block hai) |
| 502 Bad Gateway | Sandbox reset | `./serve-browser.sh` dobara chalayein |
| Key kaam karti hai ya nahi? | — | `curl https://openrouter.ai/api/v1/auth/key -H "Authorization: Bearer KEY"` |

**Key test karne ki command** (200 = sahi, 401 = ghalat):
```bash
curl https://openrouter.ai/api/v1/auth/key -H "Authorization: Bearer sk-or-v1-APNI-KEY"
```

---

## 8. Ahem baatein (yaad rakhein)

1. **Yeh repo ek app nahi, 160 apps ka collection hai.** Har folder alag project hai.

2. **Har app ko patch chahiye hoga.** Time ke saath models band hote hain aur
   packages rename hote hain. `pip install -U <package>` aapka pehla hathiyar hai.

3. **Repo ka fresh dikhna dhoka hai.** September 2026 ka commit hai, magar
   `gemini-2.0-flash-exp` June 2026 mein hi band ho chuka tha.

4. **Sandbox mein AI APIs blocked hain** — isliye Browser Edition banayi. Aapke
   laptop par yeh masla nahi hoga, wahan original Streamlit app bhi chalega.

5. **Sandbox har session reset hota hai** — files bachti hain, commits aur
   processes nahi. Isliye GitHub par push kiya (commits wahan safe hain).

6. **Browser Edition mein API key browser mein rehti hai** — server ko nahi jati.
   Privacy ke liye acha hai, magar key page memory mein hoti hai — isliye
   **limited/scoped key** use karein jo zaroorat par revoke kar sakein.

7. **Sirf ek folder change hua** — baaki 159 bilkul original hain.

---

## 9. Links

| Kya | Kahan |
|---|---|
| OpenRouter signup | https://openrouter.ai/ |
| API keys banayein | https://openrouter.ai/keys |
| Free models dekhein | https://openrouter.ai/models |
| Original repo | https://github.com/Shubhamsaboo/awesome-llm-apps |
| Aapka fork | https://github.com/Venomous-101/Nebula |
| Aapki branch (changes ke saath) | `arena/01a0febf-nebula` |
| Streamlit Cloud (deploy) | https://share.streamlit.io |
| Gemini key (Streamlit app ke liye) | https://aistudio.google.com/apikey |

---

## 10. Ek line mein

**Repo:** 160 AI apps ka collection — seekhne ke liye, plug-and-play nahi.
**Humne:** Sirf 1 app (`ai_breakup_recovery_agent`) liya, 3 bugs fix kiye
(dead model, renamed packages, missing dependency), 2 chalane ke tareeqe banaye
(Streamlit + Browser Edition), aur deployment documented kiya.
**Baaki 159 folders:** bilkul original, untouched.
**Sabse bari seekh:** Sandbox AI APIs tak nahi pahunch sakta — isliye API call
browser mein move ki, aur wahi kaam kar gaya.
