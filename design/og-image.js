/**
 * Újragenerálja a megosztási kártyákat:
 *   assets/og.jpg      a magyar oldalhoz (/)
 *   assets/og-en.jpg   az angol oldalhoz (/en/)
 *
 * Akkor kell lefuttatni, ha a név, a szlogen, a logó vagy a kártya rajza
 * változik — a Facebook, a LinkedIn és az X ezt a képet mutatja a link mellett.
 *
 *   npm install playwright-core
 *   node design/og-image.js
 *
 * A kártya maga a design/og-kartya.html (a nyelvet a ?lang=en dönti el):
 * ugyanazokat a betűket és ugyanazt az assets/main.js-t tölti be, mint az
 * oldal, így a virág bitre ugyanaz. A logót az assets/logo.svg-ből
 * veszi, tehát logóváltáskor magától követi.
 *
 * Miért JPEG, és miért 92-es minőség: a Chromium PNG-je ennél a képnél (nagy,
 * lágy gradiensek + 600 mag) 505 KB lett, veszteségmentes újratömörítéssel is
 * 435. A 92-es JPEG ~115 KB, a pixelek 99,9%-a legfeljebb 11/255-tel tér el,
 * és négyszeres nagyításban sincs színes szegély a dőlt okker betűkön. A
 * megosztó felületek amúgy is JPEG-re tömörítik át. (85-ön 85 KB, de 15/255 az
 * eltérés; 95-ön 143 KB, és szemre nem jobb.)
 *
 * A Chromium bináris helye a PW_CHROMIUM környezeti változóval írható felül;
 * alapból a Claude Code webes környezetének útvonalát használja.
 */

const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright-core');

const ROOT = path.join(__dirname, '..');
const CHROME = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium';
const CARD = pathToFileURL(path.join(__dirname, 'og-kartya.html')).href;

const WIDTH = 1200;
const HEIGHT = 630;
const QUALITY = 92;

// Nyelvenként csak a szöveg változik (az og-kartya.html-ben), a kompozíció nem.
const CARDS = [
  { lang: 'hu', file: 'og.jpg' },
  { lang: 'en', file: 'og-en.jpg' },
];

// Ami nélkül a kártya hibás lenne, és nem szabad csendben kiírni.
const FONTS = ['Newsreader Display normal', 'Newsreader Display italic', 'Newsreader Text normal', 'Fragment Mono normal'];
const SEEDS = 600;
const DISC_GAP = 24;   // px: ennél közelebb egyetlen betű sem mehet a sötét koronghoz

(async () => {
  // --disable-lcd-text: szürkeárnyalatos betűsimítás. A kártyát a megosztó
  // felületek átméretezik, és az alpixeles betűélek színes szegélyként
  // maradnának meg. (A CSS-ben erre való -webkit-font-smoothing macOS-only,
  // Linuxon nem hat — ezért itt.)
  // --allow-file-access-from-files: a file:// lapról betöltött betűket a
  // Chromium különben CORS miatt elutasítja.
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--disable-lcd-text', '--allow-file-access-from-files'],
  });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', r => errors.push('nem töltődött be: ' + r.url()));

  for (const card of CARDS) {
    await page.goto(CARD + '?lang=' + card.lang, { waitUntil: 'load' });
    const s = await page.evaluate(async ([W, H]) => {
      await document.fonts.ready;
      // A sötét korong a 3D-forgatás miatt ellipszis: a befoglaló doboza a vetület.
      const d = document.querySelector('.flower .disc').getBoundingClientRect();
      const cx = d.left + d.width / 2, cy = d.top + d.height / 2, rx = d.width / 2, ry = d.height / 2;
      let out = [], nearest = Infinity, nearestText = '';
      const walker = document.createTreeWalker(document.querySelector('.copy'), NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        if (!n.textContent.trim()) continue;
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const q of rg.getClientRects()) {
          if (q.left < 0 || q.top < 0 || q.right > W || q.bottom > H) out.push(n.textContent.trim());
          const nx = Math.max(q.left, Math.min(cx, q.right)), ny = Math.max(q.top, Math.min(cy, q.bottom));
          const gap = (Math.hypot((nx - cx) / rx, (ny - cy) / ry) - 1) * Math.min(rx, ry);
          if (gap < nearest) { nearest = gap; nearestText = n.textContent.trim(); }
        }
      }
      return {
        fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style),
        seeds: document.querySelectorAll('.flower .seed').length,
        lang: document.documentElement.lang,
        out, nearest: Math.round(nearest), nearestText,
      };
    }, [WIDTH, HEIGHT]);

    const fail = [];
    const missing = FONTS.filter(f => !s.fonts.includes(f));
    if (missing.length) fail.push('nem töltődött be: ' + missing.join(', '));
    if (s.seeds !== SEEDS) fail.push(s.seeds + ' mag a ' + SEEDS + ' helyett');
    if (s.lang !== card.lang) fail.push('a lap nyelve ' + s.lang);
    if (s.out.length) fail.push('kilóg a vászonból: ' + s.out.join(' | '));
    if (s.nearest < DISC_GAP) fail.push(`„${s.nearestText}" ${s.nearest} px-re van a sötét korongtól (legalább ${DISC_GAP} kell)`);
    if (errors.length) fail.push(errors.join(' | '));
    if (fail.length) throw new Error(card.file + ': ' + fail.join('; '));

    const out = path.join(ROOT, 'assets', card.file);
    await page.screenshot({ path: out, type: 'jpeg', quality: QUALITY });
    console.log(`kész: assets/${card.file}  (legközelebbi szöveg a koronghoz: ${s.nearest} px)`);
  }
  await browser.close();
})().catch(e => { console.error('HIBA: ' + e.message); process.exit(1); });
