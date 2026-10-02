# LinkedIn Post Kit

Copy-paste ready. No emojis, no em dashes. Links go in the first comment, not
the post body, because LinkedIn suppresses posts with outbound links.

**Caption:** 2,480 characters (limit 3,000)
**First comment:** 622 characters (limit 1,250)

---

## WHAT GOES WHERE

| Where | What |
|---|---|
| **Caption** | The story, all four failures, and the complete setup guide. Someone should be able to finish the setup from the caption alone. |
| **First comment** | Only the clickable links. Post it within one minute of publishing. |
| **Your replies** | Answer every comment for the first hour. This is what drives reach. |

---

## THE CAPTION

```
I spent a weekend trying to run one AI app from an open source repository. It broke four times, and every failure taught me more than the feature did.

The repository holds 100+ AI agents. I picked one: a breakup recovery agent that runs four AI agents in sequence. One listens. One writes the message you never sent. One builds you a week. One tells you the truth.

Here is what actually went wrong:

1. The model was dead. The code called gemini-2.0-flash-exp. Google shut it down in June 2026. The repo was updated in September, but nobody touched the model name.

2. The packages had moved. duckduckgo-search was renamed to ddgs, and a pinned dependency was so old the framework crashed on import.

3. The network was sealed. The app called its API from the server. My environment firewalls every AI provider, so no key on earth would have worked.

4. The key was mine. I pasted 24 characters. A real OpenRouter key is 73. The API said "User not found" and I blamed the code for an hour.

Only one of those four was a coding problem.

So I rebuilt it to survive all four. Here is the entire setup.

NO INSTALL, 2 MINUTES

1. Make a free account at openrouter.ai. No credit card.
2. Go to openrouter.ai/keys and click Create Key.
3. Copy the WHOLE key. It starts with sk-or-v1- and is 73 characters. This is the mistake everyone makes.
4. Open the app link in my first comment.
5. Paste the key, write how you feel, press Get Recovery Plan.

Your key stays in your browser tab. It never touches the server. Requests go straight from you to OpenRouter.

RUN IT ON YOUR OWN MACHINE

1. Clone the repo from my first comment.
2. cd starter_ai_agents/ai_breakup_recovery_agent
3. Run ./serve-browser.sh
4. Open localhost:8000 and paste your key.

Use ./run.sh instead if you want the full interface. That version also supports Gemini.

IF SOMETHING BREAKS

401 User not found means the key is wrong or cut short. Make a new one, copy all 73 characters.
Connection error on every agent means the host blocks AI traffic. Use the browser edition.
404 model not found means the model was retired. Every model ID is editable inside the app.

Test any key with one command:
curl https://openrouter.ai/api/v1/auth/key -H "Authorization: Bearer YOUR-KEY"

200 means the key works. 401 means it is dead.

It is open source, Apache 2.0. Fork it, rewrite the four prompts, ship it as your own.

Links are in the first comment.

What is the oldest project you have cloned that still runs today?
```

---

## THE FIRST COMMENT

Replace `[APNA-APP-LINK-YAHAN]` with your GitHub Pages URL (see below).

```
Everything is free and open source. Nothing to install.

Run it right now, in your browser:
[APNA-APP-LINK-YAHAN]

The full repository, 100+ AI agents:
https://github.com/Venomous-101/Nebula

The app folder inside it:
https://github.com/Venomous-101/Nebula/tree/main/starter_ai_agents/ai_breakup_recovery_agent

Setup guide, if you would rather read it written out:
https://github.com/Venomous-101/Nebula/blob/main/starter_ai_agents/ai_breakup_recovery_agent/SETUP-GUIDE.md

Get your free API key here, no card needed:
https://openrouter.ai/keys

Stuck on any step? Comment below and I will walk you through it personally.
```

---

## BEFORE YOU POST: GET THE APP LINK

The caption promises a link people can open and use instantly. That link needs
GitHub Pages, because opening an HTML file directly from disk is blocked by
browsers for security reasons.

**Five clicks, once:**

1. Merge pull request #1 so the Browser Edition exists on `main`.
2. Open your repository, then **Settings**, then **Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Pick branch `main` and folder `/ (root)`, then **Save**.
5. Wait about a minute. Your app is live at:

```
https://venomous-101.github.io/Nebula/starter_ai_agents/ai_breakup_recovery_agent/browser/
```

Paste that URL over `[APNA-APP-LINK-YAHAN]` in the comment. Open it yourself
first to confirm it loads before posting.

---

## POSTING CHECKLIST

1. Attach the app screenshot as the image.
2. Post Tuesday to Thursday, 7 to 9 AM or 12 to 2 PM.
3. Add the first comment within one minute.
4. Stay online for the first hour and reply to every comment.
5. Use 3 hashtags at most, at the very bottom, or none at all.

```
#AI #OpenSource #Agents
```

---

## OPTIONAL FOLLOW-UP POST (2 to 3 days later)

```
The comment I got most on my last post: how did you actually fix it?

Short answer, one change mattered more than the other three.

The app was calling its API from the server. My environment blocks outbound traffic to every AI provider, so no key could ever work. I had spent an hour checking the key before I checked the network.

The fix was to move the API call into the browser.

The browser is not firewalled. It talks to OpenRouter directly. The key never touches the server. It also means the whole app became one HTML file with zero dependencies, no Python, no virtualenv, no 600 MB of packages.

One of those four problems was in the code.
Three were in the environment around it.

When something fails, check what is around the code before you start reading it.
```

---

## WHY IT IS BUILT THIS WAY

| Choice | Reason |
|---|---|
| Hook is two short lines | Only the first two lines show before "see more". That click is the first ranking signal. |
| Setup lives in the caption | Readers finish it without leaving LinkedIn, then use the comment only for links. |
| No links in the body | Posts with outbound links lose 50 to 70 percent of reach. |
| Numbered failures | Specific beats generic. Lists raise dwell time, the heaviest signal. |
| Ends with a question | Comments carry more weight than likes. |
| No emojis, no em dashes | Clean prose reads as a person, not a marketing team. |
