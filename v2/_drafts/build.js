#!/usr/bin/env node
/* Generates /v2/a/ and /v2/b/ from base.html.
   The two drafts differ in ONE thing: where Diana's portrait sits. Everything
   else is shared, so edit base.html and rerun, never the generated pages.
   Run from _site/:  node v2/_drafts/build.js  */
"use strict";
const fs = require("fs");
const path = require("path");

const here = __dirname;
const v2 = path.join(here, "..");
const base = fs.readFileSync(path.join(here, "base.html"), "utf8");

const figure = variant => `      <figure class="honesty-portrait honesty-portrait--${variant} reveal">
        <img src="/img/diana-portrait-scarf.jpg" alt="Diana, smiling, wrapped in a pale scarf" width="1402" height="2100" loading="lazy" decoding="async">
        <figcaption class="caption">I'll be right here with you, the whole way through.</figcaption>
      </figure>
`;

const band = (other, label, foot) => `  <div class="draft-switch${foot ? " draft-switch--foot" : ""}">
    <b>You are reading draft ${label.here} of two</b>
    <a href="/v2/${other}/">See draft ${label.there} &rarr;</a>
    <a href="/v2/">What is different?</a>
  </div>
`;

const DRAFTS = [
  {
    id: "a",
    other: "b",
    label: { here: "A", there: "B" },
    portrait: { A: figure("top"), B: "" },
    fbPage: "v2 homepage · draft A (photo opens What to expect)",
  },
  {
    id: "b",
    other: "a",
    label: { here: "B", there: "A" },
    portrait: { A: "", B: figure("before-letter") },
    fbPage: "v2 homepage · draft B (photo before the letter)",
  },
];

for (const d of DRAFTS) {
  let out = base
    .replace("{{DRAFT}}", d.label.here)
    .replace("{{PORTRAIT_A}}", d.portrait.A)
    .replace("{{PORTRAIT_B}}", d.portrait.B)
    .replace("{{SWITCH_TOP}}", band(d.other, d.label, false))
    .replace("{{SWITCH_FOOT}}", band(d.other, d.label, true))
    /* the localStorage key stays shared on purpose: her hearts and notes carry
       across both drafts, only the label in the emailed summary differs */
    .replace('data-fb-page="v2 homepage (merged elements)"', `data-fb-page="${d.fbPage}"`);

  if (out.includes("{{")) {
    throw new Error(`draft ${d.id}: unsubstituted placeholder left in output`);
  }
  const dir = path.join(v2, d.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), out);
  console.log(`wrote v2/${d.id}/index.html`);
}
