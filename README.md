# APPraforgó — landing page

Egyoldalas bemutatkozó oldal. **Nyeste Krisztián e.v.** — egyedi webes alkalmazások
kis- és középvállalatoknak.

> Ötletből alkalmazások

## Mi ez

Sima statikus oldal: **nincs build, nincs npm, nincs függőség**. Egy HTML, egy CSS,
két SVG. Bárhol elfut, ami fájlokat tud kiszolgálni.

```
index.html          a teljes oldal (tartalom + inline SVG ikonok)
assets/style.css    a teljes stílus, CSS változókkal a tetején
assets/logo.svg     napraforgó logó
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
hero → *Miben segítek* → *Hogyan dolgozom* → *Referenciamunkák* → *Beszéljünk róla* → lábléc.

**Új referencia hozzáadása** — másold le a `<a class="card work">` blokkot a
`#referenciak` szekcióban, és írd át. A `work-mark--blue` / `work-mark--sun` osztály
váltja a kártyafejléc színét.

**Képernyőképek a referenciákhoz** — jelenleg tipográfiai kártyák vannak.
Ha van kép, a `<span class="work-mark …">` helyére tehető egy
`<img src="assets/zsebgarazs.png" alt="" loading="lazy">`.

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
