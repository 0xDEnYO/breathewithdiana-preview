#!/usr/bin/env node
/* Generates /v2/photos/ from the already-generated /v2/a/index.html.

   Diana picked draft A and then asked to try new shoot photos in three slots plus a
   new quote on the room photo. Rather than render each candidate as a flat mock, this
   wraps the real page in a picker so every option is seen in its actual context.

   The page is generated so it inherits every later edit to base.html for free. Run
   from _site/:  node v2/_drafts/build-photos.js  */
"use strict";
const fs = require("fs");
const path = require("path");

const v2 = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(v2, "a", "index.html"), "utf8");

const P = "/v2/photos/img";
/* `face` is background-position for the 46px hero avatar and the panel thumbnails
   (both 300% zoom), `circle` is object-position for the 230px round crop, `story`
   for the 4/5 plate. Derived from where the face sits in each frame, not guessed:
   for a 2:3 source, circle = 3f-1, story = 6f-2.5, face-y = (4.5f-0.5)/3.5. */
const CANDIDATES = {
  "diana-meditating-beach": { file: "/img/diana-meditating-beach.jpg", label: "current", story: "50% 50%", face: "43% 12%", circle: "50% 50%", zoom: 1 , plate: "1/1|50% 50%" },
  "diana-portrait-scarf": { file: "/img/diana-portrait-scarf.jpg", label: "current", story: "50% 20%", face: "50% 40%", circle: "50% 26%", zoom: 1 , plate: "4/5|50% 20%" },
  CHI_7979: { file: `${P}/CHI_7979.jpg`, label: "CHI 7979", story: "50% 0%", face: "46% 26%", circle: "50% -5%", zoom: 2.2 , plate: "4/5|50% 0%" },
  CHI_8139: { file: `${P}/CHI_8139.jpg`, label: "CHI 8139", story: "50% 69%", face: "40% 54%", circle: "50% 60%", zoom: 2.4 , plate: "4/5|50% 69%" },
  CHI_8146: { file: `${P}/CHI_8146.jpg`, label: "CHI 8146", story: "50% 13%", face: "36% 42%", circle: "50% 32%", zoom: 2.3 , plate: "4/5|50% 13%" },
  CHI_8206: { file: `${P}/CHI_8206.jpg`, label: "CHI 8206", story: "50% 48%", face: "30% 50%", circle: "36% 49%", zoom: 2.6 , plate: "4/5|50% 48%" },
  CHI_8050: { file: `${P}/CHI_8050.jpg`, label: "CHI 8050", story: "50% 13%", face: "53% 42%", circle: "52% 32%", zoom: 2.2 , plate: "4/5|50% 13%" },
  CHI_8054: { file: `${P}/CHI_8054.jpg`, label: "CHI 8054", story: "50% 0%", face: "46% 39%", circle: "47% 25%", zoom: 2.3 , plate: "4/5|50% 0%" },
  MAW_0952: { file: `${P}/MAW_0952.jpg`, label: "0952", story: "50% 40%", face: "50% 48%", circle: "50% 45%", zoom: 2.3 , plate: "4/5|50% 40%" },
  MAW_1073: { file: `${P}/MAW_1073.jpg`, label: "MAW 1073", story: "50% 0%", face: "46% 35%", circle: "48% 18%", zoom: 2.3 , plate: "4/5|50% 0%" },
  MAW_1124: { file: `${P}/MAW_1124.jpg`, label: "MAW 1124", story: "50% 26%", face: "53% 45%", circle: "52% 38%", zoom: 2.4 , plate: "4/5|50% 26%" },
  /* the five below hold two people, so they are centred on the pair at zoom 1
     rather than on Diana's face: zooming in on her would delete the client, who
     is the reason the photo is worth using at all */
  MAW_1343: { file: `${P}/MAW_1343.jpg`, label: "MAW 1343", story: "50% 30%", face: "29% 40%", circle: "50% 60%", zoom: 1 , plate: "4/5|50% 50%" },
  CHI_9204: { file: `${P}/CHI_9204.jpg`, label: "9204", story: "50% 20%", face: "55% 25%", circle: "50% 66%", zoom: 1 , plate: "4/5|50% 50%" },
  CHI_9205: { file: `${P}/CHI_9205.jpg`, label: "9205", story: "50% 20%", face: "58% 24%", circle: "50% 67%", zoom: 1 , plate: "4/5|50% 50%" },
  MAW_1374: { file: `${P}/MAW_1374.jpg`, label: "MAW 1374", story: "50% 10%", face: "3% 37%", circle: "50% 21%", zoom: 1 , plate: "4/5|50% 0%" },
  MAW_1379: { file: `${P}/MAW_1379.jpg`, label: "MAW 1379", story: "50% 50%", face: "27% 35%", circle: "47% 50%", zoom: 1 , plate: "3/2|50% 50%" },
};

const SLOTS = [
  {
    id: "story",
    jump: "#story",
    title: "The photo in &laquo;Mi camino a casa&raquo;",
    note: "All four are the terracotta dress, so all four sit in the palette. The frame is the same 4/5 crop the big photo under the title uses, so the column beside the text keeps its proportion.",
    options: ["diana-meditating-beach", "CHI_7979", "CHI_8139", "CHI_8146", "CHI_8206"],
    pick: "CHI_7979",
    why: "CHI 7979 is the one I would choose. It is the only one where you look straight at the reader, which is what a personal story wants, and the path behind you says «journey» without the caption having to. The three waterfall frames are lovely but you are looking away in all of them, so they read as a portrait rather than as you telling me something.",
  },
  {
    id: "face",
    jump: "#hero",
    title: "The small circle beside &laquo;con Diana&raquo;",
    note: "This one is 46 pixels wide on screen, so the only question is whether the face still reads that small. All three do, which the current one only barely does.",
    options: ["diana-meditating-beach", "CHI_8054", "CHI_8050", "MAW_0952"],
    pick: "CHI_8054",
    why: "CHI 8054 is the one I would choose. Your face fills the most of the circle of the three, so it survives the shrink best. CHI 8050 is the same moment with your head tilted further, which loses a little of the face, and 0952 has you looking up and away, so at that size it reads as a shape rather than as you.",
  },
  {
    id: "circle",
    jump: "#session",
    title: "The large circle before &laquo;Qu&eacute; esperar&raquo;",
    note: "MAW 1376 is not in that folder (it goes 1374 then 1379), so both of its neighbours are here instead. Tell me if you meant a different number and I will add it.",
    options: ["diana-portrait-scarf", "MAW_1374", "MAW_1073", "MAW_1124", "MAW_1343", "CHI_9204", "CHI_9205", "MAW_1379"],
    pick: "MAW_1374",
    why: "MAW 1374 is the one I would choose. This circle sits at the top of the chapter that opens with «we begin with a conversation», and that is exactly the photo: two people, both faces, nothing happening yet. Every other option is a portrait of you alone, which the page already has three of by that point. Of those, MAW 1073 is the warmest. One thing to settle first: the client is recognisable in 1374, 1379, 1343, 9204 and 9205, so each of those needs that person&rsquo;s written consent before it goes on a public page.",
  },
];

/* All five new lines are Diana's own words, lifted from brand-voice.md, not written
   for the occasion. `echo` names the copy elsewhere on the page that the line would
   half repeat, which is the whole reason she is replacing the current one. */
const QUOTES = [
  {
    id: "q0",
    text: "Whether you cry, laugh, scream, stay quiet, or simply breathe, you are welcome exactly as you are.",
    src: "current",
    echo: "This is the line that closes the letter one screen above, which is what you are replacing.",
  },
  {
    id: "q1",
    text: "Breathe. Soften. Come home.",
    src: "her Instagram bio line, a locked signature line",
    echo: "Nowhere else on the page.",
  },
  {
    id: "q2",
    text: "Permission to slow down. Permission to feel. Permission to come home.",
    src: "her own &laquo;permission&raquo; language",
    echo: "Nowhere else on the page.",
  },
  {
    id: "q3",
    text: "Your body has its own wisdom and its own timing.",
    src: "her line for Trust",
    echo: "The letter says &laquo;I trust your body&rsquo;s own wisdom and timing&raquo;, so it half repeats.",
  },
  {
    id: "q4",
    text: "Breath didn&rsquo;t change who I was. It helped me remember who I had always been.",
    src: "one of her candidate signature lines",
    echo: "The opening paragraph already ends on &laquo;remembering who you&rsquo;ve always been&raquo;.",
  },
  {
    id: "q5",
    text: "You won&rsquo;t go through this alone.",
    src: "her line for Presence",
    echo: "The photo caption below already says &laquo;I&rsquo;ll be right here with you&raquo;.",
  },
];

/* ---------------------------------------------------------------- markup */

const swatch = (slot, key) => {
  const c = CANDIDATES[key];
  const cur = c.label === "current";
  return `        <button type="button" class="pk-sw${cur ? " pk-sw--cur" : ""}" data-slot="${slot.id}" data-key="${key}"${key === slot.pick ? ' data-recommend="1"' : ""}>
          <span class="pk-thumb" style="background-image:url('${c.file}');background-position:${c.face}"></span>
          <span class="pk-lab">${c.label}</span>
        </button>
`;
};

const panel = `
<div class="pk-fab-wrap">
  <button type="button" class="pk-fab" id="pk-fab" aria-expanded="false" aria-controls="pk-panel">Try the photos</button>
</div>
<aside class="pk-panel" id="pk-panel" hidden>
  <div class="pk-head">
    <div>
      <b>Photo and quote options</b>
      <p>Pick one in each group. The page changes underneath you, so you are always looking at the real design and not a mock. The &#10022; marks the one I would choose, with the reason under each group.</p>
    </div>
    <button type="button" class="pk-x" id="pk-close" aria-label="Close">&times;</button>
  </div>
${SLOTS.map(
  s => `  <section class="pk-group">
    <h3>${s.title} <a class="pk-jump" href="${s.jump}">go to it &rarr;</a></h3>
    <p class="pk-note">${s.note}</p>
    <div class="pk-row">
${s.options.map(k => swatch(s, k)).join("")}    </div>
    <p class="pk-why">${s.why}</p>
  </section>
`
).join("")}  <section class="pk-group">
    <h3>The quote on the room photo <a class="pk-jump" href="#space">go to it &rarr;</a></h3>
    <p class="pk-note">Every option below is in your own words already. The last four repeat something that is on the page nearby, which is noted under each.</p>
    <div class="pk-quotes">
${QUOTES.map(
  q => `      <label class="pk-q">
        <input type="radio" name="pk-quote-pick" value="${q.id}">
        <span>
          <i>&ldquo;${q.text}&rdquo;</i>
          <small>${q.src} &middot; ${q.echo}</small>
        </span>
      </label>
`
).join("")}    </div>
  </section>
  <section class="pk-group">
    <h3>One idea of mine</h3>
    <p class="pk-note">Two of the photos you picked for the large circle are session photos with two people in them. A circle has to crop them down to your face alone, which throws away the second person, and that second person is the whole point of that photo. Tick this to see the same slot as a wide photo instead of a circle.</p>
    <label class="pk-toggle"><input type="checkbox" id="pk-plate"> Show the large slot as a wide photo</label>
  </section>
  <p class="pk-foot">Nothing here is live on the site. Heart or comment on any section as usual and I will get your notes.</p>
</aside>
`;

const css = `
/* ============ photo picker, review only, never ported to the real page ============ */
.pk-fab-wrap{position:fixed;right:1rem;bottom:4.2rem;z-index:60}
.pk-fab{font:600 .72rem/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--bone);
  background:var(--band-ink);border:none;border-radius:999px;padding:.95rem 1.3rem;cursor:pointer;
  box-shadow:0 10px 30px rgba(70,52,38,.3)}
/* bottom offset clears the feedback widget pill, which floats in the same corner */
.pk-panel{position:fixed;right:1rem;bottom:4.2rem;z-index:61;width:min(430px,calc(100vw - 2rem));
  max-height:min(84vh,780px);overflow-y:auto;background:var(--bone);border:1px solid var(--hairline-mid);
  border-radius:18px;box-shadow:0 24px 60px rgba(70,52,38,.26);padding:1.15rem 1.25rem 1.4rem}
.pk-head{display:flex;gap:.8rem;align-items:flex-start;justify-content:space-between}
.pk-head b{font:600 .72rem/1.4 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--umber)}
.pk-head p{font:400 .82rem/1.55 var(--sans);color:var(--muted-strong);margin:.4rem 0 0}
.pk-x{background:none;border:none;font-size:1.5rem;line-height:1;color:var(--muted-strong);cursor:pointer;padding:0 .2rem}
.pk-group{margin-top:1.35rem;padding-top:1.15rem;border-top:1px solid var(--hairline)}
.pk-group h3{font:600 .8rem/1.45 var(--sans);color:var(--umber);margin:0;display:flex;flex-wrap:wrap;gap:.5rem;align-items:baseline}
.pk-jump{font:600 .64rem/1 var(--sans);letter-spacing:.09em;text-transform:uppercase;color:var(--terracotta);text-decoration:none}
.pk-note{font:400 .78rem/1.55 var(--sans);color:var(--muted-strong);margin:.35rem 0 0}
.pk-why{font:400 .78rem/1.6 var(--sans);color:var(--umber);margin:.85rem 0 0;padding-left:.8rem;border-left:2px solid var(--terracotta)}
.pk-why::before{content:"\\2726\\00a0\\00a0";color:var(--terracotta)}
.pk-row{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:.85rem}
.pk-sw{background:none;border:none;padding:0;cursor:pointer;width:64px;text-align:center}
.pk-thumb{display:block;width:56px;height:56px;margin:0 auto;border-radius:50%;background-size:300%;
  box-shadow:0 0 0 1px var(--hairline-mid);transition:box-shadow .2s}
.pk-sw[aria-pressed="true"] .pk-thumb{box-shadow:0 0 0 2px var(--terracotta)}
.pk-lab{display:block;font:500 .62rem/1.3 var(--sans);color:var(--muted-strong);margin-top:.35rem;letter-spacing:.02em}
.pk-sw[aria-pressed="true"] .pk-lab{color:var(--terracotta);font-weight:600}
.pk-sw--cur .pk-lab{font-style:italic}
.pk-sw[data-recommend="1"] .pk-lab::after{content:" \\2726"}
.pk-quotes{display:flex;flex-direction:column;gap:.7rem;margin-top:.85rem}
.pk-q{display:flex;gap:.6rem;align-items:flex-start;cursor:pointer}
.pk-q input{margin-top:.35rem;accent-color:var(--terracotta);flex:0 0 auto}
.pk-q i{display:block;font:italic 400 .95rem/1.5 var(--serif);color:var(--umber)}
.pk-q small{display:block;font:400 .7rem/1.5 var(--sans);color:var(--muted-strong);margin-top:.2rem}
.pk-toggle{display:flex;gap:.55rem;align-items:center;margin-top:.85rem;font:400 .82rem/1.5 var(--sans);color:var(--umber);cursor:pointer}
.pk-toggle input{accent-color:var(--terracotta)}
.pk-foot{font:400 .72rem/1.55 var(--sans);color:var(--muted-strong);margin:1.3rem 0 0;padding-top:1rem;border-top:1px solid var(--hairline)}
@media (max-width:600px){
  .pk-panel{right:.5rem;left:.5rem;bottom:4rem;width:auto;max-height:72vh;border-radius:14px}
  .pk-fab-wrap{right:.75rem;bottom:4rem}
}
/* the story photo takes the same 4/5 frame the frontispiece uses, so a portrait
   candidate does not tower over the text column beside it */
#story .plate img{width:100%;aspect-ratio:4/5;object-fit:cover}
/* a three word line is a much smaller target than the long sentence the scrim was
   tuned for, so it gets bigger type and a tighter, slightly stronger ellipse. Without
   this a short quote reads as weak over the bright wall, which would be the scrim's
   fault and not the line's. */
.space-plate.pk-short .space-quote::before{background:radial-gradient(ellipse 44% 34% at center,rgba(52,38,24,.6),rgba(52,38,24,0) 74%)}
.space-plate.pk-short .space-quote-text{font-size:clamp(1.85rem,4.8vw,2.9rem);max-width:20rem}
@media (max-width:700px){
  .space-plate.pk-short .space-quote::before{background:radial-gradient(ellipse 74% 48% at center,rgba(52,38,24,.66),rgba(52,38,24,0) 82%)}
  .space-plate.pk-short .space-quote-text{font-size:clamp(1.35rem,6.4vw,1.75rem)}
}
/* the round crop needs a clipping wrapper so a candidate can be zoomed inside it:
   these are full frames off the shoot, and a full-body one leaves the face at about
   14% of the circle without it */
.pk-clip{display:block;width:min(230px,62vw);aspect-ratio:1;border-radius:50%;overflow:hidden;
  box-shadow:0 0 0 1px var(--hairline-mid)}
.pk-clip img{width:100%;height:100%;border-radius:0;box-shadow:none;object-fit:cover;
  transform:scale(var(--pk-z,1));transform-origin:center}
/* the alternative to the round crop, for the two-person session photos */
.honesty-portrait.pk-as-plate{padding-left:1.25rem;padding-right:1.25rem}
.honesty-portrait.pk-as-plate .pk-clip{width:min(var(--pk-pw,620px),90vw);aspect-ratio:var(--pk-pr,4/5);border-radius:14px}
.honesty-portrait.pk-as-plate .pk-clip img{transform:none;object-position:var(--pk-pp,50% 50%)}
`;

const script = `
<script>
/* photo picker, review page only */
(function(){
  var C = ${JSON.stringify(CANDIDATES)};
  var Q = ${JSON.stringify(QUOTES.reduce((a, q) => ((a[q.id] = q.text), a), {}))};
  var DEFAULTS = ${JSON.stringify(SLOTS.reduce((a, s) => ((a[s.id] = s.options[0]), a), {}))};
  var face = document.getElementById("pk-face");
  var story = document.getElementById("pk-story");
  var circle = document.getElementById("pk-circle");
  var circleFig = document.getElementById("pk-circle-fig");
  var quote = document.getElementById("pk-quote");
  var plateEl = document.querySelector(".space-plate");
  var circleKey = null;

  /* round and wide want different framing out of the same frame, so the candidate
     carries both and this picks whichever mode is on */
  function renderCircle(){
    var c = C[circleKey];
    if(!c) return;
    var wide = circleFig.classList.contains("pk-as-plate");
    var parts = c.plate.split("|");
    circle.src = c.file;
    circle.style.objectPosition = wide ? parts[1] : c.circle;
    circle.style.setProperty("--pk-z", wide ? 1 : c.zoom);
    circleFig.style.setProperty("--pk-pr", parts[0]);
    circleFig.style.setProperty("--pk-pw", parts[0] === "3/2" ? "1080px" : "620px");
  }

  function setQuote(id){
    quote.innerHTML = Q[id];
    plateEl.classList.toggle("pk-short", quote.textContent.length < 60);
  }

  function apply(slot, key){
    var c = C[key];
    if(!c) return;
    if(slot === "face"){
      face.style.backgroundImage = "url('" + c.file + "')";
      face.style.backgroundPosition = c.face;
    } else if(slot === "story"){
      story.src = c.file;
      story.style.objectPosition = c.story;
    } else if(slot === "circle"){
      circleKey = key;
      renderCircle();
    }
    [].forEach.call(document.querySelectorAll('.pk-sw[data-slot="' + slot + '"]'), function(b){
      b.setAttribute("aria-pressed", String(b.dataset.key === key));
    });
    try{ localStorage.setItem("pk-" + slot, key); }catch(e){}
  }

  [].forEach.call(document.querySelectorAll(".pk-sw"), function(b){
    b.addEventListener("click", function(){ apply(b.dataset.slot, b.dataset.key); });
  });

  [].forEach.call(document.querySelectorAll('input[name="pk-quote-pick"]'), function(r){
    r.addEventListener("change", function(){
      setQuote(r.value);
      try{ localStorage.setItem("pk-quote", r.value); }catch(e){}
    });
  });

  var plate = document.getElementById("pk-plate");
  plate.addEventListener("change", function(){
    circleFig.classList.toggle("pk-as-plate", plate.checked);
    renderCircle();
    try{ localStorage.setItem("pk-plate", plate.checked ? "1" : ""); }catch(e){}
  });

  /* restore, so closing the tab and coming back does not lose where she got to */
  Object.keys(DEFAULTS).forEach(function(slot){
    var saved = null;
    try{ saved = localStorage.getItem("pk-" + slot); }catch(e){}
    apply(slot, saved && C[saved] ? saved : DEFAULTS[slot]);
  });
  var sq = null;
  try{ sq = localStorage.getItem("pk-quote"); }catch(e){}
  var qr = document.querySelector('input[name="pk-quote-pick"][value="' + (sq || "q0") + '"]');
  if(qr){ qr.checked = true; setQuote(qr.value); }
  var sp = null;
  try{ sp = localStorage.getItem("pk-plate"); }catch(e){}
  if(sp){ plate.checked = true; circleFig.classList.add("pk-as-plate"); renderCircle(); }

  var fab = document.getElementById("pk-fab");
  var panel = document.getElementById("pk-panel");
  var wrap = document.querySelector(".pk-fab-wrap");
  function open(o){
    panel.hidden = !o;
    wrap.hidden = o;
    fab.setAttribute("aria-expanded", String(o));
  }
  fab.addEventListener("click", function(){ open(true); });
  document.getElementById("pk-close").addEventListener("click", function(){ open(false); });
  [].forEach.call(document.querySelectorAll(".pk-jump"), function(a){
    /* on a phone the panel covers the page, so stand out of the way after jumping */
    a.addEventListener("click", function(){ if(window.innerWidth < 601) open(false); });
  });
  /* on a phone the panel would cover the whole page, so start from the button there */
  open(window.innerWidth > 600);
})();
</script>
`;

const band = `  <div class="draft-switch">
    <b>Draft A &middot; trying the new shoot photos</b>
    <a href="/v2/a/">The plain draft A &rarr;</a>
  </div>
`;

/* ---------------------------------------------------------------- assembly */

const EDITS = [
  [
    '<title>Breathe with Diana · Coming home to your body · Draft A</title>',
    '<title>Breathe with Diana · Draft A · trying the new photos</title>',
  ],
  [
    'data-fb-key="v2-homepage" data-fb-page="v2 homepage · draft A (photo opens What to expect)"',
    'data-fb-key="v2-photos" data-fb-page="v2 draft A · new shoot photos and the room quote"',
  ],
  [
    '<span class="author-face" role="img" aria-label="Diana"></span>',
    '<span class="author-face" id="pk-face" role="img" aria-label="Diana"></span>',
  ],
  [
    '<img src="/img/diana-meditating-beach.jpg" alt="Diana meditating in prayer pose on a beach rock" width="1400" height="1400" loading="lazy" decoding="async">',
    '<img id="pk-story" src="/img/diana-meditating-beach.jpg" alt="Diana" width="1400" height="1400" decoding="async">',
  ],
  [
    '<figure class="honesty-portrait honesty-portrait--top reveal">',
    '<figure class="honesty-portrait honesty-portrait--top reveal" id="pk-circle-fig">',
  ],
  [
    '<img src="/img/diana-portrait-scarf.jpg" alt="Diana, smiling, wrapped in a pale scarf" width="1402" height="2100" loading="lazy" decoding="async">',
    '<span class="pk-clip"><img id="pk-circle" src="/img/diana-portrait-scarf.jpg" alt="Diana" width="1402" height="2100" decoding="async"></span>',
  ],
  ['<span class="space-quote-text">', '<span class="space-quote-text" id="pk-quote">'],
];

let out = src;
for (const [from, to] of EDITS) {
  if (!out.includes(from)) throw new Error(`anchor missing, draft A changed shape:\n${from}`);
  out = out.split(from).join(to);
}

/* both draft-switch bands become one honest band; the foot one just goes */
const bandRe = /  <div class="draft-switch">[\s\S]*?<\/div>\n/;
const footRe = /  <div class="draft-switch draft-switch--foot">[\s\S]*?<\/div>\n/;
if (!bandRe.test(out) || !footRe.test(out)) throw new Error("draft-switch bands not found");
out = out.replace(bandRe, band).replace(footRe, "");

out = out.replace("</style>", `${css}</style>`);
out = out.replace(/(<body[^>]*>)/, `$1\n${panel}`);
out = out.replace("</body>", `${script}</body>`);

const dir = path.join(v2, "photos");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "index.html"), out);
console.log(`wrote v2/photos/index.html (${(out.length / 1024).toFixed(0)} kB)`);
