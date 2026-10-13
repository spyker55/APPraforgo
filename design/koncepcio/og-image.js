/**
 * A koncepció megosztási kártyái:
 *   design/koncepcio/og.jpg      a magyar koncepcióhoz
 *   design/koncepcio/og-en.jpg   az angolhoz
 *
 * Az éles oldal kártyáit (assets/og.png, og-en.png) NEM írja felül — azokat
 * a design/og-image.js készíti, az éles palettával.
 *
 *   npm install playwright-core
 *   node design/koncepcio/og-image.js
 *
 * A kártya maga az og-kartya.html: ugyanazokat a betűket és ugyanazt a
 * koncepcio.js-t tölti be, mint az oldal, így a virág bitre ugyanaz.
 *
 * Miért JPEG, és miért 92-es minőség: a Chromium PNG-je ennél a képnél
 * (nagy, lágy gradiensek + 600 mag) 505 KB lett, veszteségmentes
 * újratömörítéssel is 435. A 92-es JPEG 112 KB, a pixelek 99,9%-a legfeljebb
 * 11/255-tel tér el, és négyszeres nagyításban sincs színes szegély a dőlt
 * okker betűkön. A megosztó felületek amúgy is JPEG-re tömörítik át a képet.
 * (85-ön 85 KB, de 15/255 az eltérés; 95-ön 143 KB, és szemre nem jobb.)
 */

const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright-core');

const CHROME = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium';
const CARD = pathToFileURL(path.join(__dirname, 'og-kartya.html')).href;

const CARDS = [
  { lang: 'hu', file: 'og.jpg' },
  { lang: 'en', file: 'og-en.jpg' },
];
const QUALITY = 92;

// Ami nélkül a kártya hibás lenne, és nem szabad csendben kiírni.
const FONTS = ['Newsreader Display normal', 'Newsreader Display italic', 'Newsreader Text normal', 'Fragment Mono normal'];
const SEEDS = 600;

(async () => {
  // --disable-lcd-text: szürkeárnyalatos betűsimítás. A kártyát a megosztó
  // felületek átméretezik, és az alpixeles betűélek színes szegélyként
  // maradnának meg. --allow-file-access-from-files: a file:// lapról
  // betöltött betűket a Chromium különben CORS miatt elutasítja.
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--disable-lcd-text', '--allow-file-access-from-files'],
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', r => errors.push('nem töltődött be: ' + r.url()));

  for (const card of CARDS) {
    await page.goto(CARD + '?lang=' + card.lang, { waitUntil: 'load' });
    const state = await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style),
        seeds: document.querySelectorAll('.flower .seed').length,
        lang: document.documentElement.lang,
      };
    });
    const missing = FONTS.filter(f => !state.fonts.includes(f));
    if (missing.length) throw new Error(card.file + ': nem töltődött be: ' + missing.join(', '));
    if (state.seeds !== SEEDS) throw new Error(card.file + ': ' + state.seeds + ' mag a ' + SEEDS + ' helyett');
    if (state.lang !== card.lang) throw new Error(card.file + ': a lap nyelve ' + state.lang);
    if (errors.length) throw new Error(card.file + ': ' + errors.join(' | '));

    const out = path.join(__dirname, card.file);
    await page.screenshot({ path: out, type: 'jpeg', quality: QUALITY });
    console.log('kész: ' + path.relative(path.join(__dirname, '..', '..'), out));
  }
  await browser.close();
})().catch(e => { console.error('HIBA: ' + e.message); process.exit(1); });
