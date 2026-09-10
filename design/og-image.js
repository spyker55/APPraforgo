/**
 * Újragenerálja a megosztási kártyákat:
 *   assets/og.png      a magyar oldalhoz (/)
 *   assets/og-en.png   az angol oldalhoz (/en/)
 *
 * Akkor kell lefuttatni, ha a név, a szlogen vagy a logó változik — a
 * Facebook, a LinkedIn és a Twitter ezt a képet mutatja a link mellett.
 *
 *   npm install playwright-core
 *   node design/og-image.js
 *
 * A Chromium bináris helye a PW_CHROMIUM környezeti változóval írható felül;
 * alapból a Claude Code webes környezetének útvonalát használja.
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.join(__dirname, '..');
const CHROME = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium';

const WIDTH = 1200;
const HEIGHT = 630;

// Nyelvenként csak a szöveg változik, a kompozíció nem.
const CARDS = [
  {
    file: 'og.png',
    slogan: 'Ötletből alkalmazások',
    desc: 'Egyedi webes alkalmazások<br>kis- és középvállalatoknak',
  },
  {
    file: 'og-en.png',
    slogan: 'Ideas into applications',
    desc: 'Custom web applications for<br>small and medium-sized businesses',
  },
];

// A logót a kiszállított fájlból emeljük ki, hogy a kártya ne tudjon
// elcsúszni tőle. Az id-ket egyedivé tesszük, mert a lapra beágyazva
// ütköznének, ha valaha több logó kerülne ide.
const logo = fs
  .readFileSync(path.join(ROOT, 'assets', 'logo.svg'), 'utf8')
  .replace(/<svg /, '<svg width="320" height="320" ')
  .replace(/id="p"/, 'id="og-p"')
  .replace(/href="#p"/g, 'href="#og-p"');

const cardHtml = (card) => `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    background: #FCFBF7;
    font-family: 'Liberation Sans', 'DejaVu Sans', Arial, sans-serif;
    color: #10162B;
    display: flex; align-items: center; gap: 72px;
    padding: 0 88px;
    overflow: hidden;
  }
  .mark { flex: 0 0 320px; line-height: 0; }
  .text { flex: 1; }
  h1 { font-size: 92px; font-weight: 700; letter-spacing: -.02em; line-height: 1; }
  .slogan {
    font-size: 46px; font-weight: 600; color: #2A4BD7;
    margin-top: 18px; letter-spacing: -.01em;
  }
  .rule { width: 96px; height: 5px; background: #F5B301; border-radius: 3px; margin: 32px 0 28px; }
  .desc { font-size: 31px; line-height: 1.4; color: #5A6180; }
  .domain {
    position: absolute; right: 88px; bottom: 56px;
    font-size: 27px; font-weight: 600; color: #2A4BD7;
  }
  .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: #2A4BD7; }
</style>

<div class="mark">${logo}</div>
<div class="text">
  <h1>APPraforgó</h1>
  <div class="slogan">${card.slogan}</div>
  <div class="rule"></div>
  <div class="desc">${card.desc}</div>
</div>
<div class="domain">appraforgo.hu</div>
<div class="bar"></div>
`;

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  for (const card of CARDS) {
    const out = path.join(ROOT, 'assets', card.file);
    await page.setContent(cardHtml(card));
    await page.waitForTimeout(300);

    // A kártyának pontosan a vászon méretűnek kell lennie: ha a szöveg
    // hosszabbra sikerül — és az angol tipikusan hosszabb —, itt derül ki,
    // nem a Facebook megosztás-ellenőrzőjében.
    const { w, h } = await page.evaluate(() => ({
      w: document.documentElement.scrollWidth,
      h: document.documentElement.scrollHeight,
    }));
    if (w > WIDTH || h > HEIGHT) {
      await browser.close();
      throw new Error(`${card.file}: a tartalom túllóg a vásznon: ${w}x${h}, elvárt ${WIDTH}x${HEIGHT}`);
    }

    await page.screenshot({ path: out });
    console.log(`kész: ${out} (${fs.statSync(out).size} bájt)`);
  }

  await browser.close();
})();
