# APPraforgó — landing page

Egyoldalas bemutatkozó oldal: egyedi webes alkalmazások kis- és középvállalatoknak.
Üzemeltető: Nyeste Krisztián e.v.

> Ötletből alkalmazások

## Mi ez

Sima statikus oldal: **nincs build, nincs npm, nincs futásidejű függőség**. Két
HTML (magyar, angol), egy CSS, egy JS, négy betűfájl. Bárhol elfut, ami fájlokat
tud kiszolgálni.

A dizájn neve **„A fény felé"**: a görgetés egy nap a napkeltétől az alkonyig,
a napraforgó pedig a valódi aranyszög-képlettel nő ki, és a nap felé fordul. A
teljes művészeti irány — narratíva, tipográfia, paletta, fény, mozgás, és hogy
mit miért *nem* csinál — a [`design/irany.md`](design/irany.md)-ben van. Ez a
README a karbantartásról szól.

```
index.html             a magyar oldal
en/index.html          ugyanaz angolul
assets/style.css       a teljes stílus mindkét nyelvhez, CSS változókkal a tetején
assets/main.js         a „fény motorja": napszak, virág, ív, parallax, felúszás
assets/fonts/          Newsreader + Fragment Mono, a magyar ábécére vágva (OFL)
assets/logo.svg        napraforgó logó
assets/og.jpg          megosztási kártya magyarul (1200×630, JPEG), generált
assets/og-en.jpg       ugyanaz angolul
assets/*.png           képernyőképek a referenciákhoz
favicon.svg            böngészőfül ikon
robots.txt             keresőknek: minden indexelhető, itt a sitemap
sitemap.xml            mindkét nyelv URL-je, hreflang-gel
google*.html           a Google Search Console tulajdonjog-igazoló fájlja

design/irany.md        a művészeti irány
design/og-kartya.html  a megosztási kártya rajza (ezt fényképezi az og-image.js)
design/og-image.js     a kártyák generátora
design/linkedin-borito.*  LinkedIn-profil borítókép (angol): a rajz, a generátor és a kész JPEG
design/betuk-vagasa.py a betűfájlok újravágása, ha új karakter kerül a szövegbe
design/logo-*          logóváltozatok és összehasonlító lapjaik
design/koncepcio/      átirányítás: a koncepció korábbi címe (lásd lent)
```

## Helyi megnyitás

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

(A puszta duplakattintás az `index.html`-en is megnyílik, de a **nyelvváltó gomb
nem** működik: a `/en/` és a `/` hivatkozás a domain gyökeréhez képest értendő,
`file://` alatt nincs gyökér. A betűk sem töltődnek be `file://`-ról — a
Chromium CORS miatt elutasítja őket. Mindkettőhöz a fenti szerver kell.)

## Szerkesztés

**Szövegek** — közvetlenül az `index.html`-ben és az `en/index.html`-ben. A
jelenetek sorrendben, mindegyik egy napszak:

| | Jelenet | Osztály | Horgony (hu / en) |
|---|---|---|---|
| 01 | Hajnal — hero | `.scene--hajnal` | — |
| 02 | Délelőtt — prológus + *Miben segítünk* | `.scene--delelott` | `#szolgaltatasok` / `#services` |
| 03 | Dél — *Hogyan dolgozunk* | `.scene--del` | `#folyamat` / `#process` |
| 04 | Aranyóra — *Referenciamunkák* | `.scene--aranyora` | `#referenciak` / `#work` |
| 05 | Alkony — *Beszéljünk róla* | `.scene--alkony` | `#kapcsolat` / `#contact` |

A horgonyok **a korábbi oldaléval azonosak** (`#referenciak` is maradt, nem lett
`#munkak`), hogy a régi mélylinkek ne törjenek el. A jelenet neve, amit a fejléc
napórája kiír, a szekció `data-scene` attribútumából jön — nyelvenként más.

**Hangnem** — a szövegek többes szám első személyben szólnak („építünk",
„válaszolunk"). Ez szándékos: nem köti az oldalt egyetlen emberhez, így bővülés
esetén nem kell átírni. A kötelező cégadat a láblécben van, tárgyilagosan.

⚠️ **Új karakter a szövegben** — a betűk a mostani szöveg jeleire vannak vágva
(magyar ábécé, „ ” – — … ° · √ ≈ −). Ha olyan jel kerül be, ami nincs köztük
(pl. `€`, `→`, `×`), a böngésző **csendben** egy rendszerbetűből rajzolja. Ilyenkor
vedd fel a `design/betuk-vagasa.py` `U` listájába, és vágd újra — a parancsok a
script tetején vannak. A script a jelenlegi fájlokat (az időbélyeget leszámítva)
pontosan reprodukálja.

**Új referencia** — másold le az egyik `<article class="still …">` blokkot a
`#referenciak` szekcióban, és írd át. Az elrendezést a második osztály adja:
`still--a` (kép balra, szöveg jobbra), `still--b` (fordítva), `still--c` (széles
kép, alatta két hasáb). Negyedik munkához a `still--a`/`still--b` váltakozása
folytatható. A „Kocka 0N" felirat a sorszám.

**Képernyőképek** — valódi böngésző-screenshotok, 16:10-re kiegészítve (nem
vágva): a hiányzó sávot a kép saját szélszíne tölti ki.

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

A filmkocka-keret a kép **saját arányát** veszi fel, tehát a 16:10 nem kötelező.
Egy dolog viszont igen: az `<img>` `width`/`height` attribútuma legyen pontos,
mert a böngésző ebből foglal helyet a kép megérkezése előtt — elavult érték
mellett a lap betöltéskor ugrik (CLS).

### Színek

Az `assets/style.css` tetején, a `:root` blokkban. A szín itt **fény, nem minta**:
nincs pasztell mező, a papír egésze melegszik vagy hűl, ahogy telik a nap.

Állandó tónusok:

| Változó | Érték | Szerep |
| --- | --- | --- |
| `--ink` | `#1C1915` | meleg fekete: főszöveg, címek |
| `--ink-soft` | `#585046` | másodlagos szöveg |
| `--ochre` | `#744600` | napsütötte kiemelés szövegben (dőlt címszavak, sorszámok) |
| `--gold` / `--gold-deep` | `#E3A21A` / `#C98A12` | szirom, ív, aláhúzás — **csak dísz** |
| `--seed` | `#3A2817` | mag |
| `--shade` | `43, 58, 85` (RGB) | hideg árnyék: meleg fény, hideg árnyék |
| `--hair` | tinta 16%-on | hajszálvonal |

A **napszak színei** (papír és napfény, öt állapot) az `assets/main.js` `DAY`
tömbjében vannak, a jelenetek órája a `TIMES`-ban — a CSS `--paper` és
`--sunlight` csak a kiinduló (hajnali) érték, amit a JS görgetés közben felülír.
Palettaváltáskor tehát mindkét helyen kell igazítani.

⚠️ **Kontraszt** — minden szöveg az öt napszak **legrosszabb pontján** mérve
(alkonyi sarokárnyék): tinta 10,8:1 · halk tinta 4,9:1 · okker 4,8:1. Ellenőrizve
pixelre is: a lapot láthatatlan szöveggel lefényképezve, a betűk alatt ténylegesen
kirajzolt hátteret mintázva, három képernyőméreten, mindkét nyelven — 1213
szövegdoboz, egy bukó sincs. A `--gold` szövegszínként nem használható
(1,4–2,5:1). Ha az okkert világosítanád vagy az alkonyi papírt mélyítenéd, ezt
újra kell számolni.

**Logó** — a napraforgó (arany szirmok, `#12161C` tányér) változatlan. A
`design/logo-variants/` mappa és a két összehasonlító lapja
(`design/logo-preview.html`, `design/logo-nagy.html`) az előző, terrakotta
paletta idején készült, és annak a színeit viseli — logóvázlatok, az oldal nem
hivatkozik rájuk. Két fájl korábban nevet váltott, mert a nevük olyan színt
mondott, ami már nincs:

| Régi | Új | Miért |
| --- | --- | --- |
| `logo-ikonos-kek.svg` | `logo-ikonos-terrakotta.svg` | kék ikonok → terrakotta, 34% helyett 42%-on |
| `logo-kek.svg` | `logo-forditott.svg` | kék szirmok → terrakotta és korall, arany tányérral |
| `logo-jelenlegi.svg` | `logo-ikonok-nelkul.svg` | már nem a jelenlegi: ez az ikonok előtti rajz |

⚠️ A `logo-vonalas.svg` gyűrűje a tányér színét kapta, ami **sötét háttéren
eltűnik** — vonalas rajz, nincs mögötte tömör folt. Ha valaha sötét alapon kellene,
a gyűrű kapjon aranyat.

A `logo-preview.html` **„jelenlegi" jelölése** a `logo-ikonos-feher.svg`-n van,
mert az a ténylegesen kiszállított rajz: `assets/logo.svg`, `favicon.svg` és
`design/logo-variants/logo-ikonos-feher.svg` azonos MD5-ű, bájtra egy és
ugyanaz a fájl. Ha a logó valaha változik, mind a hármat együtt kell cserélni —
és a jelölést arra a kártyára vinni, amelyik az új rajzot mutatja. (A fejléc a
logót `<img>`-ként az `assets/logo.svg`-ből tölti be; inline másolat nincs.)

## Mozgás és fény

Az `assets/main.js` egyetlen `requestAnimationFrame`-ciklusban viszi:

- **a napszakot** — papír- és napfényszín, a nap helye, a fejléc napórája. A
  horgonyok nem egyenletesek, hanem a jelenetek tényleges helyéhez kötöttek. A
  dél Budapest csillagászati dele (~12:46 CEST), és a nap ott, a dél-jelenetben
  áll a legmagasabban;
- **a virágot** — 600 mag a Vogel-képlettel (`r = c·√n`, `n · 137,508°`), 21 + 34
  szirom determinisztikus szórással: minden betöltéskor ugyanaz a virág;
- **a fej fordulását** — a nap és az egér felé, lassan (heliotrópia);
- **a dél-jelenet ívét** — széles képernyőn a jelenet megáll (sticky), és a nap
  végigmegy az íven; amelyik állomáson áthaladt, az kigyullad;
- **a filmkockák parallaxát** és **a lemenő napot** a lap alján;
- **a felúszást** — ami képre ér, életlenből élesbe „hívódik elő",
  elemenként egyszer (`.reveal`, `IntersectionObserver`).

**JavaScript nélkül semmi nem tűnik el.** A `<head>` egyetlen sora teszi fel a
`js` osztályt, és minden rejtés, megállítás és halványítás csak `.js` alatt él.
JS nélkül a lap hajnali színben áll, a lépések négyoszlopos sorban, minden
látszik; csak a virág és a napszak marad el.

**Csökkentett mozgás** (`prefers-reduced-motion`): minden marad, ami szín és
kompozíció, de semmi nem mozog. A papír színe továbbra is változik (az nem mozgás,
csak fény), a nap egy helyben áll, a dél-jelenet nem áll meg, minden lépés ég.

Csapdák, amibe az élesítéskor belefutottunk — mind kommentezve a kódban:

- ⚠️ **A nap `translate`-tel mozog, nem `left`/`top`-pal.** A `left`/`top`
  elrendezés-változás, és a böngésző minden képkockáját elrendezés-ugrásnak
  számolta: betöltéskor 0,49 CLS, görgetés közben folyamatosan.
- ⚠️ **A virág három animációval nő, nem 655-tel.** Az első változat minden
  magot és szirmot külön animált; SVG gyerekelem nem kerülhet külön grafikus
  rétegre, így mind a főszálon futott, és egy 450–850 ms-os feladat ~1 másodpercre
  kitolta az első kirajzolást. Most a magok egy táguló maszk mögül bukkannak elő,
  a két szirom-gyűrű egy-egy animációval nyílik ki.
- ⚠️ **A fejléc rácsa szimmetrikus** (`1fr auto 1fr`), a napóra fix szélességű.
  Különben a napóra szélessége tolta a menüt, és minden napszakváltáskor oldalra
  rándult (angolul 31 px-t).
- ⚠️ **A főcím első sora nem animál.** Az első képen ez a lap legnagyobb szövege,
  a Google ezt méri LCP-ként; a címkártya-hatást a második, dőlt sor viszi.
- A filmkockáknál a felúszás a `transform`-ot, a parallax a `translate`-et, a
  hover a `scale`-t írja — három független tulajdonság, mert ha mind a
  `transform`-on osztozna, a felúszás `transform: none`-ja elnyelné a másik kettőt.

### Mérve, az élesítéskor (2026-10-13)

Helyi szerveren, gyorsítótár nélkül, Chromiumban:

| | Magyar | Angol |
|---|---|---|
| Első kirajzolás (FCP), 8 betöltés | 200–424 ms (medián 312) | 184–344 ms (medián 304) |
| LCP | = FCP (az „Ötletből" / „Ideas into") | = FCP |
| LCP lassú 3G-n (400 ms, 400 kbit/s) | 2,70 s | 2,74 s |
| CLS betöltéskor, korlátozás nélkül és lassú 4G-n | 0,0000 | 0,0000 |
| CLS betöltéskor, lassú 3G-n | 0,0012 ¹ | 0,0012 ¹ |
| CLS végiggörgetve | 0,0000 | 0,0000 |
| Leghosszabb főszál-feladat | 125 ms | 114 ms |
| Külső domainre menő kérés | 0 | 0 |

¹ A monospace betű lassú 3G-n 4,7 másodpercnél érkezik meg, és a gomb felirata
ekkor 44 px-szel keskenyebb lesz, mint a tartalék monospace-szel volt. Ez
80-szor a Google „jó" határa (0,1) alatt van; gyors hálózaton a betű az első
kirajzolás előtt megérkezik, ott 0. Szándékosan nincs „javítva": egy
méretigazított tartalék nem segítene (a lehetséges tartalékok — Menlo,
Consolas, DejaVu Sans Mono — maguk is más szélesek), a `font-display: block`
pedig lassú hálózaton másodpercekre láthatatlanná tenné a gombot.

Átvitt méret (gzip): HTML 5,7 KB · CSS 11,4 KB · JS 6,7 KB · betűk 107,8 KB
(woff2, már tömörítve) — a képeken felül, amelyek ugyanazok, mint korábban.

## Publikálás

Nincs build lépés, a repó tartalma **változtatás nélkül feltölthető**:

- **Netlify / Vercel / Cloudflare Pages** — repó bekötése, build parancs: *(üres)*,
  publish könyvtár: `.`
- **GitHub Pages** — Settings → Pages → forrás: a branch gyökere
- **Sima tárhely** — FTP-vel fel a fájlokat, ahogy vannak

A `<head>`-ben a `canonical` és az `og:url` már `https://appraforgo.hu/`-ra mutat,
nincs teendő.

**A koncepció korábbi címe** (`/design/koncepcio/` és `/design/koncepcio/en/`) egy
rövid átirányító lap: `noindex`, és azonnal továbbvisz az élő oldalra. Azért
maradt, hogy a korábban elküldött linkek ne fussanak hibára. Szándékosan HTML-es
átirányítás, nem `vercel.json`: egy elgépelt konfiguráció az egész deployt
elbuktatná, egy HTML-lap semmit nem kockáztat.

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

**A fejléc nyelvváltója** a menü utolsó eleme. A gombon mindig a *másik* nyelv
kódja áll, mert az a művelet, nem az állapot — magyar lapon `EN`, angolon `HU`.
A gomb `aria-label`-je a célnyelven szól, hogy képernyőolvasóval se csak két
betű hangozzon el.

**Ami közös:** a stílus (`assets/style.css`), a motor (`assets/main.js`) és a
betűk. A motor nyelvfüggetlen — minden kiírt szöveg a HTML-ből jön.

⚠️ **A tartalom duplikált.** Ha a magyar oldalon átírsz egy szöveget, az angolt
kézzel kell utána húzni — nincs build lépés, ami szinkronban tartaná. Ez az ára
annak, hogy nulla függőséggel fut az oldal.

**Ami az angol lapon szándékosan más:** a Leltárium a `leltarium.com`-ra mutat,
saját angol képernyőképpel; a munkáknál ott a megjegyzés, hogy a ZsebGarázs és a
SzámlaFolyó csak magyarul érhető el (a két link `hreflang="hu"`-t kap); a
láblécben az uniós ÁFA-szám (HU92220155) áll a hazai adószám helyett;
tizedespont (`137.5°`) és tipográfiai aposztróf (*Let’s talk*).

## Kereső és megosztás

**Google Search Console** — URL prefix property a `https://appraforgo.hu/` címre,
a gyökérben lévő `google8c85458d0ccfd79f.html` fájllal igazolva. **Ez a fájl
maradjon a helyén**: ha törlöd, a property elveszti az igazolást.

**Strukturált adat** — mindkét lap `<head>`-jében egy `ProfessionalService`
JSON-LD blokk (név, szlogen, e-mail, logó, adószám / uniós ÁFA-szám).

**A `design/` oldalak `noindex`-et kapnak**, mert belső lapok. A `robots.txt`
viszont szándékosan *nem* tiltja le őket: egy letiltott oldal külső
hivatkozásból attól még bekerülhet az indexbe, mert a crawler épp azt a fájlt nem
tölti le, amiben a `noindex` áll.

**Megosztási kártya** — az `assets/og.jpg` (magyar) és `assets/og-en.jpg` (angol)
az a kép, amit a Facebook, a LinkedIn és az X mutat a link mellett. Nem kézzel
készültek, hanem generáltak:

```bash
npm install playwright-core
node design/og-image.js          # → assets/og.jpg + assets/og-en.jpg
```

- **A kártya maga egy HTML-lap:** `design/og-kartya.html` (`?lang=en` az
  angolhoz). A szövegei ott vannak, a lap alján. Ugyanazokat a betűket és
  ugyanazt az `assets/main.js`-t tölti be, mint az oldal — a napraforgó ugyanazzal
  a determinisztikus véletlennel rajzolódik, tehát bitre ugyanaz. A logót az
  `assets/logo.svg`-ből veszi, logóváltáskor magától követi.
- **A script hangosan elhasal**, és nem ír ki semmit, ha bármelyik betű nem
  töltődött be, ha nem pontosan 600 mag rajzolódott ki, ha a lap nyelve nem
  stimmel, ha szöveg lóg ki a vászonból (az angol tipikusan hosszabb), vagy ha
  bármelyik betű 24 px-nél közelebb kerül a virág sötét korongjához.
- **JPEG, 92-es minőség, ~115 KB.** PNG-ként 505 KB lenne (a nagy, lágy
  gradiensek és a 600 mag rosszul tömöríthetők), veszteségmentes
  újratömörítéssel is 435. A JPEG pixeleinek 99,9%-a legfeljebb 11/255-tel tér
  el, és négyszeres nagyításban sincs színes szegély a dőlt okker betűkön.

A Chromiumot `--disable-lcd-text` kapcsolóval indítja: alpixeles betűsimítás
nélkül, szürkeárnyalatosan. A megosztó felületek átméretezik a kártyát, és az
alpixeles betűélek színes szegélyként maradnának meg a képben. (A CSS-ben erre
való `-webkit-font-smoothing` macOS-only, Linuxon nem hat — ezért a kapcsoló.)
Az `--allow-file-access-from-files` azért kell, mert a kártyát `file://`-ról
nyitja meg, és onnan a Chromium CORS miatt különben nem töltené be a betűket.

**LinkedIn-borító** — `design/linkedin-borito-en.jpg` (1584 × 396 kétszeres
felbontásban, 3168 × 792). Ugyanaz a nap, csíkra nyújtva. Nincs az oldalon,
kézzel kell feltölteni a LinkedInen (profil → ceruza a borítón).

```bash
node design/linkedin-borito.js   # → design/linkedin-borito-en.jpg
```

Ugyanúgy hangosan elhasal, mint az og-image.js, plusz két dolgot figyel: egyetlen
szöveg sem kezdődhet 470 px-től balra, mert a bal alsó sarkot a kerek profilkép
takarja (mobilon nagyobb, mint asztali gépen), és semmi sem törhet két sorba.

⚠️ `og:image` **nélkül** a Facebook a lapon talált legnagyobb képet választja —
esetünkben az egyik referencia-screenshotot. Ezért kell explicit megadni.

Kép cseréje után a Facebook a régi verziót cache-eli; a
[Sharing Debugger](https://developers.facebook.com/tools/debug/) *Scrape Again*
gombja frissíti — mindkét címre (`https://appraforgo.hu/` és `/en/`) külön.
A legutóbbi cserénél a kép URL-je is változott (`og.png` → `og.jpg`), ami
segít: új címet a crawlerek biztosan újra letöltenek. A már megosztott linkek
előnézete viszont addig a régi marad, amíg valaki újra nem kaparja őket.

## Amit szándékosan nem tartalmaz

- **Nincs külső betűszolgáltatás** (Google Fonts sem). A betűk saját domainről
  jönnek: Newsreader és Fragment Mono, SIL Open Font License alatt
  (`assets/fonts/OFL-*.txt`), a magyar ábécére vágva. Nulla külső kérés, nulla
  GDPR-szürkezóna. A két címbetű `preload`-dal érkezik; mind a négy
  `font-display: swap`. Mérve: a csere csak lassú 3G-n okoz ugrást, akkor is
  0,0012-t (lásd a „Mérve" táblázatot).
- **Nincs süti** — a Vercel Web Analytics süti és localStorage nélkül mér, és a
  scriptje saját domainről (`/_vercel/insights/script.js`) töltődik, nem külső
  CDN-ről. Klasszikus cookie-bannert így nem indokol; az adatkezelési
  tájékoztatóban viszont érdemes megemlíteni, hogy látogatottságot mérsz.
- **Nincs kapcsolati űrlap** — a kapcsolatfelvétel `mailto:` linkkel megy,
  nem kell hozzá backend és nincs spam-kezelés.
- **Nincs sötét mód** — az oldal szándékosan világos. A filmszerűség a fényből
  jön, nem fekete háttérből.
- **Nincs stock fotó és illusztráció-csomag** — a virág, a nap és a műszaki rajz
  kódból születik; a referenciák a saját, szerkesztetlen képernyőképükkel
  szerepelnek.

Saját JavaScript: az `assets/main.js` (17,6 KB, gzip 6,7 KB), `defer`-rel, és a
`<head>` egyetlen sora (a `js` osztály). Ezen kívül a Vercel Web Analytics
mérőscriptje fut, `defer`-rel, a `<body>` végén, mindkét lapon.

A mérés a Vercel projekt **Analytics** fülén kapcsolható ki-be. Ha kikapcsolod,
a scriptet is vedd ki a két HTML-ből, különben 404-re fut. (Helyi szerveren
mindig 404 — azt csak a Vercel szolgálja ki.)
