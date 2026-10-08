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
helyen. A paletta tiszta fehér alapon dolgozik: majdnem fekete szöveg, négy
pasztell mező, és egy terrakotta kiemelés.

| Változó | Érték | Szerep |
| --- | --- | --- |
| `--bg` | `#FEFFFF` | lap háttere |
| `--ink` | `#12161C` | főszöveg és címek |
| `--ink-solid` | `#161A22` | tömör sötét felület: elsődleges gomb |
| `--muted` | `#4E525B` | másodlagos szöveg |
| `--brand` | `#BC3D17` | terrakotta: linkek, ikonok, kiemelés |
| `--brand-dark` | `#9A300F` | hover |
| `--brand-soft` | `#FFECE5` | barack mező |
| `--coral` | `#F79273` | apró dekoratív jelek |
| `--sun` | `#F9ECA7` | erősebb sárga |
| `--sun-soft` | `#FEF8D2` | napsárga mező (*Hogyan dolgozunk* sáv) |
| `--sun-ink` | `#7A5E06` | sárga családú szöveg (lépések sorszáma) |
| `--mint` | `#E2FAED` | pasztell mező |
| `--lilac` | `#F5F0FF` | pasztell mező |
| `--line` | `#E4E6E9` | hajszálvonal |

⚠️ A pasztellek (`--sun`, `--sun-soft`, `--mint`, `--lilac`, `--brand-soft`,
`--coral`) **csak háttérként vagy grafikaként** használhatók, szövegszínként nem —
fehéren egyik sem éri el a WCAG AA kontrasztot. Sárga családú szöveghez a
`--sun-ink` való.

### Honnan jön a paletta

A színek a biri.chat oldaláról származnak: nem szemre becsülve, hanem a
kirajzolt lapról pixelmintával véve, majd minden használt szöveg–háttér párosra
WCAG AA-ra ellenőrizve. A legszorosabb párosítások: terrakotta szöveg barack
mezőn 4,8:1, terrakotta link fehéren 5,5:1, `--sun-ink` a sárga sávon 5,7:1 —
mind a 4,5:1-es küszöb fölött. Ha a terrakottát sötétítenéd vagy a mezőket
mélyítenéd, ezeket érdemes újraszámolni.

Két dolog nem a referenciaoldalról jön:

* **A napraforgó szirmai** (`#F5B301` / `#FFC94A`) a logóban megmaradtak. A
  referencia paletta sárgái pont a márka sárgái, úgyhogy nem kellett hozzányúlni.
* **A logó tányérja** viszont királykékről majdnem feketére (`#12161C`) váltott:
  kék nem maradt sehol máshol az oldalon, egyedül állva kilógott volna. Ez a
  valódi napraforgó színe is. Visszaállítani egy érték átírása mindkét lapon,
  az `assets/logo.svg`-ben és a `favicon.svg`-ben.

A megosztási kártyák (`assets/og*.png`) követik a palettát, de **nem
automatikusan**: önálló lapként renderelődnek, nem látják az `assets/style.css`-t,
így a színek a `design/og-image.js` `cardHtml` függvényében meg vannak ismételve.
Palettaváltáskor ott is át kell vezetni, és újrafuttatni a generátort.

Amihez nem nyúltunk: a `design/logo-variants/` mappa még a régi kék-arany
palettát viszi. Belső összehasonlító anyag, nem kerül ki a lapra.

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
assets/szamlafolyo.png   1414 × 884   (eredeti 1340 × 884, oldalt 2×37 px — lásd lent)
```

A `leltarium-en.png` az angol lapon szerepel, a magyar `leltarium.png` helyett.
Ennél a kiegészítés **nem tömör színnel** készült: az alsó képsor finom vízszintes
átmenet, amit egy egyszínű sáv látható varratként vágott volna el. Helyette maga
az utolsó képsor van lenyújtva, így az átmenet folytatódik:

```python
tail = im.crop((0, h - 1, w, h)).resize((w, pad), Image.NEAREST)
```

A `szamlafolyo.png`-nél ugyanez a gond vízszintesen: a lap meleg átmenete miatt a
bal és a jobb szél színe eltér (`#F6ECE3` és `#F4E6D7`), tehát egyetlen tömör szín
az egyik oldalon biztosan látszana. Oldalanként a saját szélső képoszlopot nyújtjuk ki:

```python
lstrip = im.crop((0, 0, 1, h)).resize((left, h), Image.NEAREST)
rstrip = im.crop((w - 1, 0, w, h)).resize((right, h), Image.NEAREST)
```

Ökölszabály: ha a kiegészítendő szél egyszínű, elég a tömör kitöltés; ha átmenetes,
a szélső sort vagy oszlopot kell kinyújtani.

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

A Chromiumot `--disable-lcd-text` kapcsolóval indítja: alpixeles betűsimítás
nélkül, szürkeárnyalatosan. A megosztó felületek átméretezik a kártyát, és az
alpixeles betűélek színes szegélyként maradnának meg a képben. (A CSS-ben erre
való `-webkit-font-smoothing` macOS-only, Linuxon nem hat — ezért a kapcsoló.)

⚠️ `og:image` **nélkül** a Facebook a lapon talált legnagyobb képet választja —
esetünkben az egyik referencia-screenshotot. Ezért kell explicit megadni.

Kép cseréje után a Facebook a régi verziót cache-eli; a
[Sharing Debugger](https://developers.facebook.com/tools/debug/) *Scrape Again*
gombja frissíti.

## Beúszó animáció

Görgetéskor a szekciócímek és a kártyák halkan felúsznak a helyükre. Három
darabból áll:

1. a `<head>`-ben egyetlen sor felteszi a `js-reveal` osztályt a `<html>`-re,
2. az `assets/style.css` **csak** `.js-reveal .reveal` alatt rejti el az elemeket,
3. a `<body>` végén egy `IntersectionObserver` ad `.is-visible` osztályt annak,
   ami a képernyőre ér — elemenként egyszer, utána elengedi.

Ez a sorrend a lényeg: **JavaScript nélkül semmi nem tűnik el.** A rejtés csak
akkor lép életbe, ha a `<head>` sora tényleg lefutott, és ha a böngésző nem
ismeri az `IntersectionObserver`-t, a lap alján lévő script le is veszi az
osztályt. Az animáció tehát sosem tudja elnyelni a tartalmat.

Új elemet a `reveal` osztály tesz beúszóvá, más teendő nincs vele. Az azonos
szülőn belüli szomszédok 90 ms-onként lépcsőznek (legfeljebb négy lépcső); ezt a
script számolja ki, és `--reveal-delay` változóban adja át a CSS-nek.

**A referencia-kártyák ennél többet csinálnak:** hátradöntve indulnak, és a
képernyőre érve „felállnak". A térhatás a `.grid-2` rács `perspective`-jéből jön
— a kártyára tett `rotate` önmagában lapos maradna. A szabály a `.work.reveal`
párosra szól, tehát HTML-t nem kellett hozzá módosítani.

Két csapda van benne, mindkettő be van kommentezve a CSS-ben:

- a döntés **`rotate`**, nem `transform` — ugyanazért, amiért a `translate`:
  különben kiütné a kártyák hover-emelkedését;
- a `.js-reveal .work.reveal` és a `.js-reveal .reveal.is-visible` **azonos
  erősségű** (0,3,0), és az utóbbi áll előrébb a fájlban, ezért a végállapotot
  négy osztállyal kell kimondani (`.js-reveal .work.reveal.is-visible`) —
  különben a kártya sosem állna vissza egyenesbe.

A kártyák kifutása szándékosan lassabb (1 mp, lágyabb easing), mint a többi
elemé: a közös görbével a döntés háromnegyede 300 ms alatt lement, és a
térhatás meg sem látszott. A dőlésszög a `rotate: x 30deg`, a mélység a
`perspective: 1400px` — ezekkel lehet erősíteni vagy visszafogni a hatást.

⚠️ A **hero szándékosan kimarad.** A `h1` a lap legnagyobb szövege, tehát jó
eséllyel az, amit a Google LCP-ként mér — egy 0,7 másodperces halványodás ennyivel
tolná ki a mért értéket. Ha mégis kell, elég a hero blokkra ráírni a `reveal`
osztályt, de a sebességmérés rovására megy.

`prefers-reduced-motion: reduce` esetén az egész kikapcsol: minden elem rögtön a
végállapotában áll, görgetés nélkül is.

A két script mindkét lapon megvan (a kommentek nyelvenként mások) — a fenti
duplikációs figyelmeztetés erre is áll.

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

Saját JavaScript két helyen van, összesen pár tucat sor: a láblécben az évszám
frissítése (nélküle is helyes évszám látszik, csak nem frissül magától) és a
beúszó animáció — lásd fentebb. Ezen kívül a Vercel Web Analytics mérőscriptje
fut, `defer`-rel, a `<body>` végén, mindkét lapon.

A mérés a Vercel projekt **Analytics** fülén kapcsolható ki-be. Ha kikapcsolod,
a scriptet is vedd ki az `index.html`-ből, különben 404-re fut.
