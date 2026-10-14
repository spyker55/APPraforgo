/**
 * Újragenerálja a LinkedIn-profil angol borítóképét:
 *   design/linkedin-borito-en.jpg   (3168 × 792, azaz 1584 × 396 kétszeres felbontásban)
 *
 * Akkor kell lefuttatni, ha a név, a szlogen, a logó vagy a rajz változik. Az
 * oldalon nem szerepel, ezért nem az assets/-be kerül: a LinkedInen kézzel
 * kell feltölteni (profil → ceruza a borítókép jobb felső sarkában).
 *
 *   npm install playwright-core
 *   node design/linkedin-borito.js
 *
 * A borító maga a design/linkedin-borito.html: ugyanazokat a betűket, logót
 * és assets/main.js-t tölti be, mint az oldal, így a virág bitre ugyanaz.
 *
 * Miért kétszeres: a LinkedIn 1584 × 396-ot kér, de retinás kijelzőn ezt
 * kétszer olyan sűrűn mutatja, és a dőlt okker betűk meg a 600 mag
 * elmosódnak. 8 MB-ig bármit elfogad, és úgyis újratömöríti.
 *
 * A Chromium bináris helye a PW_CHROMIUM környezeti változóval írható felül.
 */

const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright-core');

const CHROME = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium';
const COVER = pathToFileURL(path.join(__dirname, 'linkedin-borito.html')).href;
const OUT = path.join(__dirname, 'linkedin-borito-en.jpg');

const WIDTH = 1584;
const HEIGHT = 396;
const SCALE = 2;
const QUALITY = 92;

const FONTS = ['Newsreader Display normal', 'Newsreader Display italic', 'Newsreader Text normal', 'Fragment Mono normal'];
const SEEDS = 600;
const DISC_GAP = 24;   // px: ennél közelebb egyetlen betű sem mehet a sötét koronghoz
// A LinkedIn a bal alsó sarokra teszi a kerek profilképet (ebben a léptékben
// asztali gépen kb. x < 360, mobilon x < 460). Ettől balra nem kezdődhet szöveg.
const SAFE_LEFT = 470;
const EDGE = 32;       // px: a szöveg legalább ennyire marad a felső, alsó és jobb széltől (mobilon kicsit vág)

(async () => {
  // --disable-lcd-text: szürkeárnyalatos betűsimítás, hogy a LinkedIn
  // átméretezése után ne maradjon színes szegély a betűkön.
  // --allow-file-access-from-files: a file:// lapról betöltött betűket a
  // Chromium különben CORS miatt elutasítja.
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--disable-lcd-text', '--allow-file-access-from-files'],
  });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: SCALE });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', r => errors.push('nem töltődött be: ' + r.url()));

  await page.goto(COVER, { waitUntil: 'load' });
  const s = await page.evaluate(async ([W, H, LEFT, EDGE]) => {
    await document.fonts.ready;
    // A sötét korong a 3D-forgatás miatt ellipszis: a befoglaló doboza a vetület.
    const d = document.querySelector('.flower .disc').getBoundingClientRect();
    const cx = d.left + d.width / 2, cy = d.top + d.height / 2, rx = d.width / 2, ry = d.height / 2;
    let out = [], nearest = Infinity, nearestText = '', lines = 0;
    const walker = document.createTreeWalker(document.querySelector('.copy'), NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (!n.textContent.trim()) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      const rects = rg.getClientRects();
      lines += rects.length;
      for (const q of rects) {
        if (q.left < LEFT || q.top < EDGE || q.right > W - EDGE || q.bottom > H - EDGE) out.push(n.textContent.trim());
        const nx = Math.max(q.left, Math.min(cx, q.right)), ny = Math.max(q.top, Math.min(cy, q.bottom));
        const gap = (Math.hypot((nx - cx) / rx, (ny - cy) / ry) - 1) * Math.min(rx, ry);
        if (gap < nearest) { nearest = gap; nearestText = n.textContent.trim(); }
      }
    }
    return {
      fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style),
      seeds: document.querySelectorAll('.flower .seed').length,
      out, lines, nearest: Math.round(nearest), nearestText,
    };
  }, [WIDTH, HEIGHT, SAFE_LEFT, EDGE]);

  const fail = [];
  const missing = FONTS.filter(f => !s.fonts.includes(f));
  if (missing.length) fail.push('nem töltődött be: ' + missing.join(', '));
  if (s.seeds !== SEEDS) fail.push(s.seeds + ' mag a ' + SEEDS + ' helyett');
  if (s.out.length) fail.push('kilóg a biztonságos területről: ' + s.out.join(' | '));
  // név, domain, a cím két sora, leírás: mind egy-egy sor
  if (s.lines !== 5) fail.push(s.lines + ' sor szöveg az 5 helyett (valami eltört)');
  if (s.nearest < DISC_GAP) fail.push(`„${s.nearestText}" ${s.nearest} px-re van a sötét korongtól (legalább ${DISC_GAP} kell)`);
  if (errors.length) fail.push(errors.join(' | '));
  if (fail.length) throw new Error(fail.join('; '));

  await page.screenshot({ path: OUT, type: 'jpeg', quality: QUALITY });
  console.log(`kész: design/linkedin-borito-en.jpg  (legközelebbi szöveg a koronghoz: ${s.nearest} px)`);
  await browser.close();
})().catch(e => { console.error('HIBA: ' + e.message); process.exit(1); });
