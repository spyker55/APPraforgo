# APPraforgó — landing page

Egyoldalas bemutatkozó oldal: egyedi webes alkalmazások kis- és középvállalatoknak.
Üzemeltető: Nyeste Krisztián e.v.

> Ötletből alkalmazások

## Mi ez

Sima statikus oldal: **nincs build, nincs npm, nincs függőség**. Egy HTML, egy CSS,
két SVG. Bárhol elfut, ami fájlokat tud kiszolgálni.

```
index.html          a magyar oldal (tartalom + inline SVG ikonok)
en/index.html       ugyanaz angolul
assets/style.css    a teljes stílus mindkét nyelvhez, CSS változókkal a tetején
assets/logo.svg     napraforgó logó
assets/og.png       megosztási kártya magyarul (1200×630), generált
assets/og-en.png    ugyanaz angolul
assets/*.png        képernyőképek a referencia-kártyákhoz
favicon.svg         böngészőfül ikon
robots.txt          keresőknek: minden indexelhető, itt a sitemap
sitemap.xml         mindkét nyelv URL-je, hreflang-gel
google*.html        a Google Search Console tulajdonjog-igazoló fájlja
```

## Helyi megnyitás

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

(A puszta duplakattintás az `index.html`-en is működik, de a **nyelvváltó gomb
nem**: a `/en/` és a `/` hivatkozás a domain gyökeréhez képest értendő, `file://`
alatt nincs gyökér. Nyelvváltó teszteléséhez indítsd el a fenti szervert.)

## Szerkesztés

**Színek** — az `assets/style.css` tetején, a `:root` blokkban van minden szín egy
helyen. A `--brand` a királykék, a `--sun` a napraforgó sárga; ezt a kettőt átírva az
egész oldal átszíneződik.

| Változó | Érték | Szerep |
| --- | --- | --- |
| `--brand` | `#2A4BD7` | királykék: linkek, gombok, kiemelés |
| `--sun` | `#F5B301` | napraforgó akcentus |
| `--bg` | `#FCFBF7` | törtfehér háttér |
| `--ink` | `#10162B` | főszöveg |

⚠️ A `--sun` **csak háttérként vagy grafikaként** használható, szövegszínként nem —
fehéren nem éri el a WCAG AA kontrasztot.

**Szövegek** — közvetlenül az `index.html`-ben. A szekciók sorrendben:
hero → *Miben segítünk* → *Hogyan dolgozunk* → *Referenciamunkák* → *Beszéljünk róla* → lábléc.

**Hangnem** — a szövegek többes szám első személyben szólnak („építünk",
„válaszolunk"). Ez szándékos: nem köti az oldalt egyetlen emberhez, így bővülés
esetén nem kell átírni. A kötelező cégadat a láblécben van, tárgyilagosan.

**Új referencia hozzáadása** — másold le a `<a class="card work">` blokkot a
`#referenciak` szekcióban, és írd át. A kép a `.work-shot` divbe kerül.

**Képernyőképek** — a két kép valódi böngésző-screenshot a két oldalról,
16:10-re kiegészítve (nem vágva): a hiányzó sávot a kép saját szélszíne tölti ki,
így a keretben nem látszik átmenet.

```
assets/zsebgarazs.png    1229 × 768   (eredeti 1144 × 768, oldalt +85 px  #F5F8F4)
assets/leltarium.png     1144 × 715   (eredeti 1144 × 706, alul   +9 px   #F7F9FC)
assets/leltarium-en.png  1227 × 767   (eredeti 1227 × 672, alul  +95 px — lásd lent)
```

A `leltarium-en.png` az angol lapon szerepel, a magyar `leltarium.png` helyett.
Ennél a kiegészítés **nem tömör színnel** készült: az alsó képsor finom vízszintes
átmenet, amit egy egyszínű sáv látható varratként vágott volna el. Helyette maga
az utolsó képsor van lenyújtva, így az átmenet folytatódik:

```python
tail = im.crop((0, h - 1, w, h)).resize((w, pad), Image.NEAREST)
```

Cseréhez elég ugyanezekkel a nevekkel felülírni őket. A keret `object-fit:
contain`-nel dolgozik, tehát semmilyen arányt nem vág le — de a legszebb, ha a
kép 16:10, mert akkor tölti ki hézagmentesen. Kiegészítés a szélszínnel:

```bash
python3 - <<'EOF'
from PIL import Image
im = Image.open('uj-screenshot.png').convert('RGB')
w, h = im.size
bg = im.getpixel((1, h // 2))                 # bal szél színe
W, H = (round(h * 1.6), h) if w / h < 1.6 else (w, round(w / 1.6))
c = Image.new('RGB', (W, H), bg)
c.paste(im, ((W - w) // 2, 0))
c.save('assets/valami.png', optimize=True)
EOF
```

Új méret esetén érdemes az `index.html`-ben a `width`/`height` attribútumot is
átírni. Nem kötelező: a `.work-shot` fix aránya miatt betöltéskor akkor sem ugrik
a layout, ha elavult — de a helyes érték pontosabb infó a böngészőnek.

## Publikálás

Nincs build lépés, a repó tartalma **változtatás nélkül feltölthető**:

- **Netlify / Vercel / Cloudflare Pages** — repó bekötése, build parancs: *(üres)*,
  publish könyvtár: `.`
- **GitHub Pages** — Settings → Pages → forrás: a branch gyökere
- **Sima tárhely** — FTP-vel fel a fájlokat, ahogy vannak

Éles domain után a `index.html` `<head>` részében a `canonical` és az `og:url`
már `https://appraforgo.hu/`-ra mutat, nincs teendő.

## Két nyelv

Az oldal **két külön HTML fájl**, nem egy lap JavaScriptes szövegcserével:

```
/            index.html       magyar
/en/         en/index.html    angol
```

Ez szándékos. Így mindkét nyelvnek **saját URL-je** van, amit a Google külön
indexelhet és a látogató megoszthat, és JavaScript nélkül is működik. Egy
kapcsolós megoldásnál a Google csak az egyik nyelvet látná.

A két lap `hreflang` hivatkozásokkal mutat egymásra (`hu`, `en`, `x-default` →
magyar), és a `sitemap.xml` ugyanezt megismétli. Ha új nyelv jönne, mindhárom
helyen fel kell venni: a két lap `<head>`-jében és a sitemapban.

**A fejléc nyelvváltója** a `.lang` osztály. A gombon mindig a *másik* nyelv
kódja áll, mert az a művelet, nem az állapot — magyar lapon `EN`, angolon `HU`.
A gomb `aria-label`-je a célnyelven szól, hogy képernyőolvasóval se csak két
betű hangozzon el.

⚠️ **A tartalom duplikált.** Ha a magyar oldalon átírsz egy szöveget, az angolt
kézzel kell utána húzni — nincs build lépés, ami szinkronban tartaná. Ez az ára
annak, hogy nulla függőséggel fut az oldal. Ugyanez igaz a beágyazott logó-SVG-re:
összesen négy példány van belőle (két lap × fejléc és hero), plusz az
`assets/logo.svg` és a `favicon.svg`. Logóváltásnál mind a hat helyen cserélni kell.

A szekció-azonosítók nyelvenként különböznek (`#szolgaltatasok` ↔ `#services`),
hogy az angol lapon ne magyar horgonyok álljanak a címsorban.

## Kereső és megosztás

**Google Search Console** — URL prefix property a `https://appraforgo.hu/` címre,
a gyökérben lévő `google8c85458d0ccfd79f.html` fájllal igazolva. **Ez a fájl
maradjon a helyén**: ha törlöd, a property elveszti az igazolást.

**A `design/` oldalak `noindex`-et kapnak**, mert belső összehasonlító lapok. A
`robots.txt` viszont szándékosan *nem* tiltja le őket: egy letiltott oldal külső
hivatkozásból attól még bekerülhet az indexbe, mert a crawler épp azt a fájlt nem
tölti le, amiben a `noindex` áll.

**Megosztási kártya** — az `assets/og.png` (magyar) és `assets/og-en.png` (angol)
az a kép, amit a Facebook, a LinkedIn és a Twitter mutat a link mellett. Nem
kézzel készültek, hanem generáltak:

```bash
npm install playwright-core
node design/og-image.js          # → assets/og.png + assets/og-en.png
```

A szövegeket a script tetején, a `CARDS` tömbben találod. A logót az
`assets/logo.svg`-ből emeli ki, tehát logóváltáskor magától követi, és elhasal,
ha a szöveg kilógna a vászonból — az angol tipikusan hosszabb, ezért nem árt.

⚠️ `og:image` **nélkül** a Facebook a lapon talált legnagyobb képet választja —
esetünkben az egyik referencia-screenshotot. Ezért kell explicit megadni.

Kép cseréje után a Facebook a régi verziót cache-eli; a
[Sharing Debugger](https://developers.facebook.com/tools/debug/) *Scrape Again*
gombja frissíti.

## Amit szándékosan nem tartalmaz

- **Nincs külső betűtípus** (Google Fonts sem) — rendszer-fontstack. Nulla külső
  kérés, nulla GDPR-szürkezóna, azonnali betöltés.
- **Nincs süti** — a Vercel Web Analytics süti és localStorage nélkül mér, és a
  scriptje saját domainről (`/_vercel/insights/script.js`) töltődik, nem külső
  CDN-ről. Klasszikus cookie-bannert így nem indokol; az adatkezelési
  tájékoztatóban viszont érdemes megemlíteni, hogy látogatottságot mérsz.
- **Nincs kapcsolati űrlap** — a kapcsolatfelvétel `mailto:` linkkel megy,
  nem kell hozzá backend és nincs spam-kezelés.
- **Nincs sötét mód** — az oldal szándékosan világos.

Saját JavaScript egyetlen sor: a láblécben az évszám frissítése. Nélküle is helyes
évszám látszik, csak nem frissül magától. Ezen kívül a Vercel Web Analytics
mérőscriptje fut, `defer`-rel — a `<body>` végén, az `index.html`-ben.

A mérés a Vercel projekt **Analytics** fülén kapcsolható ki-be. Ha kikapcsolod,
a scriptet is vedd ki az `index.html`-ből, különben 404-re fut.
