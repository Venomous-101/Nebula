# LinkedIn Post Kit

Copy-paste ready. No emojis, no em dashes, no links in the post body.

---

## THE POST

```
I did not set out to build a breakup app.

I set out to run one from an open source repository. It broke four times, in four different ways, and every failure taught me more than the feature did.

That repository holds over 100 AI agents. This is the one I chose.

Here is what actually went wrong:

1. The model was dead. The code called gemini-2.0-flash-exp. Google shut that model down in June 2026. The repository was updated in September. Nobody touched the model name.

2. The packages had moved. duckduckgo-search was renamed to ddgs upstream, and one pinned dependency was so old the framework crashed on import.

3. The network was sealed. The app calls its API from the server. My environment firewalls every AI provider, so no key on earth would have worked.

4. The key was mine. I pasted 24 characters. A real OpenRouter key is 73. The API replied "User not found" and I spent an hour blaming the code.

Only one of those four was actually a coding problem.

So I rebuilt it to survive all of them. The API call now runs from your browser instead of the server. The dependencies are current. Every model ID is editable from the interface. And the setup guide is written for someone who has never opened a terminal.

Four agents run in sequence. One listens. One writes the message you never sent. One builds you a week. One tells you the truth.

Open source, Apache 2.0. Links are in the first comment.

What is the oldest project you have cloned that still runs today?
```

**Character count:** ~1,750. Fits comfortably, and long enough to earn dwell time.

---

## FIRST COMMENT

Post this immediately after publishing. Never put these links in the post body,
because LinkedIn suppresses posts with outbound links (50 to 70 percent less
reach).

```
Everything here is free and open source.

The app, plus 100+ other AI agents: https://github.com/Venomous-101/Nebula

Setup guide, written for non technical folks: https://github.com/Venomous-101/Nebula/blob/main/starter_ai_agents/ai_breakup_recovery_agent/SETUP-GUIDE.md

You need one free OpenRouter key. No credit card. If you get stuck anywhere, comment here and I will walk you through it.
```

---

## WHY THIS IS BUILT THIS WAY

| Choice | Reason |
|---|---|
| Hook is two short lines | Only the first two lines show before "see more". The click is the first ranking signal. |
| No links in the body | Posts with outbound links lose 50 to 70 percent of reach. First comment preserves it. |
| Numbered list of four failures | Specific beats generic. Lists raise dwell time, which is the heaviest ranking signal. |
| Ends with a question | Comments carry more weight than likes. A question anyone can answer invites them. |
| No emojis, no em dashes | Clean prose reads as a person, not a marketing team. |
| Story, not announcement | The failure story is true and specific. Announcements get scrolled past. |
| First comment invites replies | You are offering help, which turns lurkers into commenters. |

---

## POSTING CHECKLIST

1. Attach the app screenshot. Put it first, since images raise dwell time.
2. Post Tuesday to Thursday, between 7 and 9 AM or 12 and 2 PM.
3. Add the first comment within one minute of publishing.
4. Stay online for the first hour and reply to every single comment. Early
   engagement in the first 30 to 60 minutes decides how far the post travels.
5. Use 3 hashtags maximum, at the very bottom, or none at all. Some 2026 tests
   show hashtags reduce reach.

Suggested hashtags if you want them:

```
#AI #OpenSource #Agents
```

---

## OPTIONAL FOLLOW-UP POST (2 to 3 days later)

If the first post performs, post the technical version while attention is warm:

```
The comment I got most on my last post: "how did you actually fix it?"

Short answer, one change mattered more than the other three.

The app was calling its API from the server. My environment blocks outbound
traffic to every AI provider, so no key could ever work. I had spent an hour
checking the key before I checked the network.

The fix was to move the API call into the browser.

The browser is not firewalled. It talks to OpenRouter directly. The key never
touches the server. It also means the whole app became one HTML file with zero
dependencies, no Python, no virtualenv, no 600 MB of packages.

One of those four problems was in the code.
Three were in the environment around it.

When something fails, check what is around the code before you start reading it.
```

---

## NOTES

- Both links point to `main`. Merge the pull request before posting so the setup
  guide URL resolves. If the PR is not merged yet, swap `main` for
  `arena/01a0febf-nebula` in both links.
- The repository is Apache 2.0, so you can invite people to fork it and ship it.
  Permission to reuse drives shares.
