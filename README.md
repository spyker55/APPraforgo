# APPraforgó — landing page

Egyoldalas bemutatkozó oldal: egyedi webes alkalmazások kis- és középvállalatoknak.
Üzemeltető: Nyeste Krisztián e.v.

> Ötletből alkalmazások

## Mi ez

Sima statikus oldal: **nincs build, nincs npm, nincs függőség**. Egy HTML, egy CSS,
két SVG. Bárhol elfut, ami fájlokat tud kiszolgálni.

```
index.html          a teljes oldal (tartalom + inline SVG ikonok)
assets/style.css    a teljes stílus, CSS változókkal a tetején
assets/logo.svg     napraforgó logó
assets/*.png        képernyőképek a referencia-kártyákhoz
favicon.svg         böngészőfül ikon
```

## Helyi megnyitás

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

(A puszta duplakattintás az `index.html`-en is működik.)

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
