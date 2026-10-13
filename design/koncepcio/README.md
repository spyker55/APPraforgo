# „A fény felé" — koncepcióterv

Az APPraforgó oldalának filmszerű újragondolása. **Koncepció, nem az éles oldal:**
önálló lap, saját stílussal és saját betűkkel, `noindex`-szel (a szövege az
élesével egyezik, és nem szabad versenyre kelnie vele a keresőben). Az éles
oldalt nem érinti.

Megnyitás: a repó gyökeréből `python3 -m http.server 8000`, aztán
`http://localhost:8000/design/koncepcio/` (magyar) vagy
`http://localhost:8000/design/koncepcio/en/` (angol). A fejlécben lévő
EN / HU gomb a két koncepció között vált, nem az éles oldalra visz. A képek a `../../assets/` mappából jönnek,
ezért a gyökérből kell kiszolgálni, nem ebből a mappából.

---

## 1 · A gondolat

A *napraforgó* szó szerint azt jelenti: **a nap felé forduló.** A koncepció
ezt veszi szó szerint.

Az egész lap **egyetlen folyamatos snitt egy napon át.** A görgetés az idő:
a tetején napkelte van (04:46), az alján alkony (20:46) — a nyári napforduló
Budapesten, ahol a nap ~4:46-kor kel és ~20:45-kor nyugszik. A lap alja egy
perccel napnyugta után van. Közben változik a papír színe, vándorol a nap, és a virág
követi. Öt jelenet, öt napszak:

| | Jelenet | Napszak | Mit mond |
|---|---|---|---|
| 01 | Hajnal | 04:46 | Egy mag. *Ötletből alkalmazások.* |
| 02 | Délelőtt | ~08:00–10:00 | A szabály. Amiből a rend lesz — és amit vállalunk. |
| 03 | Dél | ~12:10–14:10 | A nap pályája: a négy lépés. |
| 04 | Aranyóra | ~18:00–20:10 | A termés: a három működő termék. |
| 05 | Alkony | 20:46 | Egyetlen dolog maradt: írjon. |

Az óra nem lineáris a görgetéssel: a jelenetekhez van horgonyozva, ahogy a
színek is. A dél **Budapest csillagászati dele** — a 19,04°-os keleti
hosszúság és a nyári időszámítás miatt ~12:46, nem 12:00 —, és a nap ott, a
dél-jelenetben áll a legmagasabban. Az aranyóra este nyolc körül van, ahogy
júniusban valóban.

A narratíva gerince egy valódi botanikai tény és egy valódi képlet:

- **A fiatal napraforgó napközben követi a napot** (heliotrópia). A lapon a
  virágfej két dolgot követ: a napot, ahogy a görgetéssel halad, és a
  látogató egerét — ha mozog, felé fordul. Lassan, mint egy növény.
- **A magok egyetlen szabály szerint ülnek:** az *n*-edik mag
  `r = c·√n` távolságra és `n · 137,508°` szögben van az előzőhöz képest
  (Vogel-modell). Ebből a két sorból *magától* kijön a 21-es és 34-es
  spirálpár, amit egy igazi napraforgón meg lehet számolni. A szirmok száma is
  ez: 21 hátul, 34 elöl. Fibonacci-számok.

Ez a stúdió története is: **egy világos irány és egy pontos szabály, amiből
rend nő ki.** Ezért nem díszítés a virág, hanem állítás.

## 2 · Amit szándékosan nem csináltunk

- **Nincs „pasztell mező".** Az előző két kör a színt mintaként kezelte
  (barack doboz, menta csempe). Itt a szín **fény**: a papír egésze melegszik
  vagy hűl, ahogy telik a nap. Egyetlen színes kártya sincs a lapon.
- **Nincs SaaS-rács.** Nincs három egyforma kártya ikonnal, nincs „features"
  blokk. A szolgáltatások stáblista, a folyamat a nap pályája, a munkák
  filmkockák.
- **Nincs sötét „cinematic" klisé.** A filmszerűség itt nem a fekete háttér és
  a neon, hanem a fény iránya, a hideg árnyék és a lassú mozgás. Az oldal
  világos marad — ezt kérted, és az éles oldal elve is ez.
- **Nincs stock fotó, nincs 3D-render, nincs illusztráció-csomag.** Minden kép
  kódból születik (a virág, a nap, a műszaki rajz), kivéve a három valódi
  terméket, amelyek a saját képernyőképükkel szerepelnek, szerkesztetlenül.
- **Nincs pill-gomb, nincs gradiens-gomb, nincs glassmorphism.** Az elsődleges
  gomb tinta-téglalap éles sarokkal.
- **Nincs pattogás.** Egyetlen rugózó, túllendülő animáció sincs.

## 3 · Művészeti irány

**Egy nyomtatott stáblista egy napsütötte papíron, amire egy élő virág vet árnyékot.**
Két világ találkozik: az organikus (a virág, a fény, a por a sugárban) és a
mérnöki (monospace feliratok, időbélyegek, egy pontozott vonalas műszaki rajz
az aranyszögről, méretvonalak a folyamat íven). Az egyik a melegséget adja, a
másik a bizalmat — egy fejlesztőtől mindkettő kell.

## 4 · Tipográfia

Két hang, két család:

| Szerep | Betű | Hol |
|---|---|---|
| **A hang** | Newsreader (Production Type, OFL) | címek, folyószöveg |
| **A pontosság** | Fragment Mono (OFL) | csapók, napóra, stáblista, gombok, jogi adatok |

- A **Newsreader** optikai méretezésű szerif: kétféle méretre vágtuk ki.
  *Display* (opsz 72, 330-as súly) a hatalmas címekhez — itt vékony, éles,
  nagy kontrasztú, mint egy filmplakát. *Text* (opsz 16, 400–560) az
  olvasáshoz — itt erősebb, nyitottabb. Ugyanaz a betű, két optikai méretben:
  ezt egy rendszerfont nem tudja.
- A dőlt csak a hangsúly: *alkalmazások*, *Mi is így építünk*, *Beszéljünk róla*.
- A folyószövegben **régies (oldstyle) számok**, a napórán és a jogi adatokban
  **táblázatos** számok — hogy ne ugráljon az idő, ahogy telik.
- Méretlépcső: a főcím `clamp(3.2rem, …, 10rem)`, `−0.045em` betűközzel, `0.86`
  sorközzel — szorosra húzva, mint egy címkártya.

**A betűk saját domainről jönnek**, nem a Google Fonts-ról. Az éles oldal
„nulla külső kérés" szabálya így is áll. A négy fájl együtt **108 KB**, és
mind a **magyar ábécére vágva**: az ő/ű egy fájlban van a többi ékezettel.
A fontsource kettévágná (`latin` + `latin-ext`), és minden magyar oldal mindkét
fájlt letöltené. A vágás előtt a Newsreader egymaga 250 KB volt.

Licenc: `fonts/OFL-*.txt` (SIL Open Font License 1.1 — szabadon beágyazható,
csak a nevét nem szabad módosított változatra használni).

## 5 · Paletta — a fény öt állapota

A papír színe öt állapot között úszik, a jelenetek tényleges helyéhez kötve
(a dél ott van, ahol a dél-jelenet közepe a képernyő közepére ér):

| Napszak | Papír | Napfény | Hangulat |
|---|---|---|---|
| Hajnal | `#E9ECEC` | `#FFE6D8` | hideg gyöngyház, rózsás fény |
| Délelőtt | `#F5F3EC` | `#FFF3DC` | tiszta, semleges |
| Dél | `#FAF6EC` | `#FFF8E0` | a legvilágosabb pont |
| Aranyóra | `#F4E6CB` | `#FFDB94` | méz |
| Alkony | `#F0D7CB` | `#FFB896` | barack-rózsa |

Állandó tónusok:

| Token | Érték | Szerep |
|---|---|---|
| `--ink` | `#1C1915` | meleg fekete — nyomott tinta, nem kékes képernyőfekete |
| `--ink-soft` | `#585046` | másodlagos szöveg |
| `--ochre` | `#744600` | napsütötte kiemelés szövegben |
| `--gold` / `--gold-deep` | `#E3A21A` / `#C98A12` | szirom, ív, aláhúzás — csak dísz |
| `--seed` | `#3A2817` | mag |
| `--shade` | `rgb(43 58 85)` | **hideg árnyék** |

Az utolsó a operatőri trükk: **meleg fény, hideg árnyék.** A filmkockák
árnyéka és a sarkok vignettája kékes, a fény sárgás — ettől lesz mélység egy
lapos, világos oldalon is.

**Kontraszt.** Minden szöveg az öt napszak **legrosszabb pontján** mérve
(alkonyi sarokárnyék): tinta 10,8:1 · halk tinta 4,9:1 · okker 4,8:1.
Ellenőrizve pixelre is: a lapot láthatatlan szöveggel lefényképezve, a betűk
dobozában a valóban kirajzolt hátteret (papír, szirom, napfolt, szemcse)
mintázva — három képernyőméreten **596 szövegdoboz, egy bukó sincs**.

## 6 · Kompozíció

- **Aszimmetria és kivágás.** A virág jobbra, félig a képen kívül ül, mint a
  nap a képkivágás szélén. A hatalmas cím a szirmokra fut rá — előtér és
  háttér, mélység —, de **a sötét korong soha nem kerül szöveg alá.** Ezt nem
  szemre, hanem mérve: hét képernyőméreten és három egérhelyzetben (amikor a
  fej a szöveg felé fordul) a legközelebbi betű is legalább 30 px-re van a
  korongtól.
- **Csapó minden jelenet elején:** `01 · Hajnal`, `03 · Dél · A nap pályája` —
  monospace, nagybetű, széles betűköz. A néző mindig tudja, hol tart a napban.
- **A szolgáltatások stáblista:** római szám dőlt szerifben, cím, leírás, és
  közöttük hajszálvonal, ami balról húzódik ki.
- **A folyamat a nap pályája:** egy ív, négy állomással; a lépések a horizont
  alatt, mindegyik a saját állomása alatt, pontozott méretvonallal. Az ív
  soha nem fut át szövegen.
- **A munkák filmkockák:** váltakozó oldalú, 12 hasábos elrendezés (8+4, 4+8,
  majd egy széles 10-es), éles sarkú keret, „Kocka 01" felirat.
- **Az alkony a lap egyetlen középre zárt jelenete:** a végén egyetlen dolgot
  kell tudni megtenni, és arra minden a középre mutat.

## 7 · Képi világ

- **A virág** (SVG, futásidőben generálva): 600 mag a Vogel-képlettel, 21 + 34
  szirom determinisztikus szórással (minden betöltéskor ugyanaz a virág).
  A mag színe a sugárral változik, ahogy egy valódi fejen: olajzöld, éretlen
  közép → barna → **nyíló virágkák arany gyűrűje** (a fej ~55%-ánál) →
  sötét perem.
- **A műszaki rajz:** az aranyszög, pontozott körrel, két maggal, és a
  levezetéssel: `360° · (3 − √5) / 2 ≈ 137,508°`. A koordináták kiszámolva,
  nem rajzolva (az első, fejből beírt változat 142,4°-ot mutatott).
- **A termékek:** a saját képernyőképük, szerkesztetlenül, színezés nélkül.
  Egy referencia akkor hiteles, ha olyan, amilyen.

## 8 · Fény és atmoszféra

Rétegek alulról felfelé:

1. **Papír** — a napszak színe.
2. **Nap** — egy hatalmas, lágy fényfolt (120 vmax), ami a görgetéssel
   ívben halad: balról alacsonyan kel, délben fent áll, jobbra nyugszik.
   *Dél felé nézve* a nap tényleg balról (kelet) jobbra (nyugat) jár.
3. **Por a napsugárban** — 46 arany porszem, csak a fénykévén belül, lassan
   sodródva. Mint egy napos szobában. (Világos papíron a fehér por nem
   látszana, ezért arany.)
4. **Szemcse** — nem divatból: a nagy, lágy gradiensek 8 bites kijelzőn
   sávosodnak, és egy halk zaj ezt eltünteti. Ezért a tartalom **alatt** van:
   az első változatban fölötte volt, és koszosnak mutatta a referenciák
   képernyőképeit.
5. **Tartalom.**
6. **Lencse** — hideg vignetta a sarkokban, multiply-jal, mint egy objektív.

## 9 · Mélység

- A virág **3D-ben fordul** (perspektíva 1600 px): a nap és az egér felé.
- A filmkockák **keretei lassabban mozognak**, mint a lap (parallax ±34 px), így
  a kép és a szöveg két külön mélységi síkon van. A kép a keretben nem mozdul,
  tehát semmi nem vágódik le belőle.
- **Árnyék:** a virágnak saját, elmosott hideg árnyéka van a papíron; a
  filmkockáknak hosszú hideg és rövid meleg árnyéka — a napfény iránya szerint.

## 10 · Mozgásnyelv

**Minden mozgás lassú, mint a fény.** Exponenciális lassulás
(`cubic-bezier(.16, 1, .3, 1)`), 0,9–1,7 másodperc. Nincs rugó, nincs
túllendülés, nincs pattogás.

| Mozdulat | Mit csinál | Miért |
|---|---|---|
| **Címkártya** | a főcím sorai maszk mögül emelkednek ki | a film nyitóképe |
| **Előhívás** | életlenből élesbe (blur 10 px → 0), alig emelkedve | mint egy fotó a hívótálban — nem becsúszik, hanem előtűnik |
| **Növekedés** | a magok középről kifelé nőnek ki, aztán kinyílnak a szirmok | ötletből rendszer |
| **Heliotrópia** | a fej a nap és az egér felé fordul, 5%-os lépésekkel | lassan, mint egy növény |
| **Élességáthelyezés** | a dél-jelenetben a még el nem ért lépés életlen, a nap elérésekor kiélesedik | rack focus |
| **Fénycsík** | egy átlós fénysáv fut végig a filmkocka üvegén belépéskor és hoverre; ugyanez a gombon | délutáni nap egy kirakaton |
| **Napnyugta** | a lap aljához érve a nap lecsúszik a horizont mögé | a vége |

**Csökkentett mozgás** (`prefers-reduced-motion`): minden marad, ami szín és
kompozíció, de semmi nem mozog. A papír színe továbbra is változik (az nem
mozgás, csak fény), a nap egy helyben áll, a dél-jelenet nem áll meg
görgetés közben, minden lépés ég. **JavaScript nélkül** minden tartalom
látszik, a lépések négyoszlopos sorba rendeződnek; csak a virág és a napszak
marad el.

## 11 · Érzelmi ív

| Jelenet | Amit a látogató érez |
|---|---|
| Hajnal | *Ez valami más.* Csend, egy hatalmas virág, egy mondat. |
| Délelőtt | *Ez valaki, aki gondolkodik.* Egy szabály, egy képlet — és mögötte, hogy mit kap. |
| Dél | *Ez kiszámítható.* Négy lépés, a nap pályáján, meglepetések nélkül. |
| Aranyóra | *Ez működik.* Három valódi termék, élesben. |
| Alkony | *Ez könnyű.* Egyetlen e-mail-cím, nagy betűvel. |

Melegség → bizalom → bizonyíték → egyetlen lépés.

## 12 · Új szöveg a koncepcióban

Az oldal szövege az élesé, egy kivétellel. A **prológus** új, a narratívához
írva:

> A fiatal napraforgó egész nap követi a fényt.
> A magjai egyetlen szabály szerint ülnek: mindegyik 137,5°-kal fordul el az előzőtől.
> Egy világos irány és egy pontos szabály. *Mi is így építünk.*

Ezen kívül a csapók („Hajnal", „A nap pályája", „Termés", „Kocka 01"), a
görgetésjelző („Görgessen — felkel a nap") és a lábléc utolsó sora
(„20:46 — a nap lement.").

## 13 · Az angol változat (`en/`)

Ugyanaz a lap, ugyanazzal a CSS-sel és JS-sel — nincs második példány, amit
külön kellene karbantartani. A stílus és a motor nyelvfüggetlen: a
jelenetneveket (*Dawn, Morning, Noon, Golden hour, Dusk*), amiket a napóra
kiír, a HTML adja a `data-scene` attribútumban.

A szöveg **az éles angol oldalé**, nem újrafordítás. A koncepció saját sorai
(prológus, csapók, görgetésjelző, lábléc) angolul íródtak, nem tükörfordításban:

> A young sunflower follows the light all day.
> Its seeds sit by a single rule: each one turns 137.5° from the one before.
> One clear direction and one precise rule. *That’s how we build, too.*

Ami az éles angol oldalt követve **szándékosan más**, mint a magyaron:

- A Leltárium angolul a **leltarium.com**, saját angol képernyőképpel
  (`assets/leltarium-en.png`).
- A munkáknál ott a megjegyzés: a ZsebGarázs és a SzámlaFolyó csak magyarul
  érhető el — és a két link `hreflang="hu"`-t kap, a képernyőolvasónak pedig
  „(opens in a new tab, in Hungarian)" szól.
- A láblécben az **uniós ÁFA-szám** (HU92220155) áll, nem a hazai adószám, és
  „sole trader" az „e.v." helyett.
- Tizedespont: `137.5°`, `≈ 137.508°`. Tipográfiai aposztróf: *Let’s talk*.

Ugyanúgy ellenőrizve, mint a magyar: pixel-kontraszt három méreten (619
szövegdoboz, 0 bukó), korong–szöveg távolság hét méreten × három
egérhelyzetben (legalább 31 px), teljes glif-lefedettség, nincs túlcsordulás,
csökkentett mozgással és JS nélkül sincs rejtve maradt szöveg, és a nyelvváltó
oda-vissza a megfelelő lapra visz.

## 14 · Megosztási kártya (`og.jpg`, `og-en.jpg`)

Amit a Facebook, a LinkedIn és az X mutat, ha valaki a koncepció linkjét
megosztja. **Egy képben az egész nap:** balra hűvös hajnali papír, jobbra
mézszínű aranyóra, a jobb felső sarokban a nap, és a virág enyhén felé
fordul (ezért ellipszis a korong). Alul monospace stáblista: `appraforgo.hu`
és a szabály, `137,5°`.

```bash
node design/koncepcio/og-image.js     # → design/koncepcio/og.jpg + og-en.jpg
```

- **A kártya maga egy HTML-lap** (`og-kartya.html`, `?lang=en` az angolhoz),
  amit a script lefényképez. Ugyanazokat a betűket és **ugyanazt a
  `koncepcio.js`-t** tölti be, mint az oldal — a virág ugyanazzal a
  determinisztikus véletlennel rajzolódik, tehát bitre ugyanaz.
- A script **hangosan elhasal**, ha bármelyik betű nem töltődött be, ha nem
  pontosan 600 mag rajzolódott ki, vagy ha a lap nyelve nem stimmel. Hibás
  kártyát nem ír ki csendben.
- **JPEG, 92-es minőség, ~115 KB.** A Chromium PNG-je ennél a képnél 505 KB
  volt (a nagy, lágy gradiensek és a 600 mag rosszul tömöríthetők), és
  veszteségmentes újratömörítéssel is 435 KB. A 92-es JPEG pixeleinek 99,9%-a
  legfeljebb 11/255-tel tér el a PNG-től, és négyszeres nagyításban sincs
  színes szegély a dőlt okker betűkön. A megosztó felületek amúgy is JPEG-re
  tömörítik át. (85-ön 85 KB, de 15/255 az eltérés; 95-ön 143 KB, és szemre
  nem jobb.) Python vagy más függőség nem kell hozzá — a Chromium maga
  ír JPEG-et.
- Ellenőrizve: 14 szövegdoboz pixel-kontrasztja a kártyán, 0 bukó; a sötét
  korong a magyar címtől 140, az angoltól 202 px-re.
- **Az éles oldal kártyáit nem írja felül.** Az `assets/og.png` és
  `og-en.png` marad, amíg az éles oldal a régi palettával fut — egy aranyórás
  kártya mást ígérne, mint amit a link mögött talál a látogató.

## 15 · Ha élesbe menne

Ami ehhez még kellene, és amit ez a koncepció szándékosan nem csinált meg:

- **A megosztási kártya kész** (lásd fent). Élesítéskor a két JPEG-et az
  `assets/`-be kell másolni, és az éles `index.html` / `en/index.html`
  `og:image`, `og:image:type` (`image/jpeg`) és `twitter:image` sorait
  átírni. Utána érdemes a Facebook Sharing Debuggerben „Scrape Again"-t
  nyomni, mert a régi képet napokig gyorsítótárazza.
- **LCP:** a főcím maszkos felúszása késlelteti a Google által mért
  „legnagyobb tartalmi kirajzolást". Élesben vagy rövidebbre venném, vagy az
  első sort animáció nélkül hagynám.
- **Betűbetöltés:** `font-display: swap` van, tehát betöltéskor egy pillanatra
  a tartalék szerifben jelenik meg a cím. Élesben egy méretre igazított
  tartalék (`size-adjust`) eltüntetné az ugrást.
- A **Vercel Web Analytics** scriptje (ebből a lapból kimaradt).
- Az éles README „Nincs külső betűtípus — rendszer-fontstack" pontját át
  kellene írni: külső kérés továbbra sincs, de saját betű lesz.

## Súly (magyar lap; az angol ugyanennyi, ugyanazokkal a fájlokkal)

| | Nyers | gzip |
|---|---|---|
| `index.html` | 15,9 KB | 5,3 KB |
| `koncepcio.css` | 32,7 KB | 10,0 KB |
| `koncepcio.js` | 16,3 KB | 6,1 KB |
| 4 betűfájl (woff2) | 107,8 KB | — (már tömörített) |

Összesen kb. **129 KB** átvitel a képeken felül, amelyek ugyanazok, mint az
éles oldalon.

## Ellenőrzés

Ami ezen a lapon mérve van, nem becsülve:

- **Kontraszt pixelre**, három képernyőméreten (1440, 1024, 390), minden
  jelenet a saját napszakának színében: 596 szövegdoboz, 0 bukó.
- **Korong–szöveg távolság**, hét méreten × három egérhelyzet: minden
  esetben ≥ 30 px.
- **Glif-lefedettség:** a lapon ténylegesen használt minden karakter benne van
  a kivágott fontokban (0 hiányzó — az első változatban a képlet φ és Φ jele
  hiányzott, ezért íródott át `√5`-re).
- **Vízszintes túlcsordulás:** 0 px minden méreten.
- **Csökkentett mozgás és JS nélküli állapot:** nincs rejtve maradt szöveg,
  nincs végtelen animáció.
