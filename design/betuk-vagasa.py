"""
A betűfájlok újravágása (assets/fonts/*.woff2).

A betűk a magyar ábécére és az oldalon ténylegesen használt jelekre vannak
vágva — ezért kicsik (négy fájl együtt ~108 KB). Ha a szövegbe olyan karakter
kerül, ami nincs benne (pl. €, →, ×), a böngésző CSENDBEN egy rendszerbetűből
pótolja. Ilyenkor vedd fel a karaktert a lenti U listába, és vágd újra.

Kell hozzá:  pip install fonttools brotli
A teljes, vágatlan forrásfájlok (OFL), a Google Fonts nyílt repójából:
  https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/Newsreader%5Bopsz,wght%5D.ttf
  https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/Newsreader-Italic%5Bopsz,wght%5D.ttf
  https://raw.githubusercontent.com/google/fonts/main/ofl/fragmentmono/FragmentMono-Regular.ttf

A négy fájl, pontosan így készült (a tengelyek rögzítése a lényeg — a teljes
6–72-es optikai tengellyel a Newsreader 250 KB lenne):

  python3 design/betuk-vagasa.py "Newsreader[opsz,wght].ttf"        assets/fonts/newsreader-display.woff2        "opsz=72,wght=330"
  python3 design/betuk-vagasa.py "Newsreader-Italic[opsz,wght].ttf" assets/fonts/newsreader-display-italic.woff2 "opsz=72,wght=330"
  python3 design/betuk-vagasa.py "Newsreader[opsz,wght].ttf"        assets/fonts/newsreader-text.woff2           "opsz=16,wght=400:560"
  python3 design/betuk-vagasa.py FragmentMono-Regular.ttf           assets/fonts/fragment-mono-hu.woff2

Harmadik argumentum: tengely-korlátok. Egy szám rögzít (a tengely eltűnik),
az a:b tartományt hagy meg.
"""
import io
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

# Pontosan a magyar szöveghez kellő kódpontok. Az ő/ű/Ő/Ű a latin-ext-ben van,
# a többi ékezet a Latin-1-ben — ezért kell egy fájlba vágni a kettőt (a
# fontsource két fájlra bontaná, és minden magyar oldal mindkettőt letöltené).
U = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [
    0x150, 0x151, 0x170, 0x171,               # Ő ő Ű ű
    0x2009, 0x200A, 0x202F, 0x2011,           # vékony szóközök, nem törő kötőjel
    0x2013, 0x2014, 0x2018, 0x2019, 0x201A,   # – — ‘ ’ ‚
    0x201C, 0x201D, 0x201E, 0x2026, 0x2022,   # “ ” „ … •
    0x2032, 0x2033, 0x2190, 0x2192, 0x2197,   # ′ ″ ← → ↗ (a Newsreaderben nincsenek nyilak)
    0x2116, 0x00B7,
    0x2212, 0x2248, 0x221A,                   # − ≈ √ (az aranyszög-képlet a prológusban)
]
FEATURES = ['kern', 'liga', 'calt', 'clig', 'onum', 'lnum', 'pnum', 'tnum', 'case', 'ccmp', 'mark', 'mkmk', 'locl']
HU = 'áéíóöőúüűÁÉÍÓÖŐÚÜŰ„”–—'


def main(src, out, axes=None):
    font = TTFont(src)
    if axes and 'fvar' in font:
        limits = {}
        for part in axes.split(','):
            k, v = part.split('=')
            limits[k] = tuple(float(x) for x in v.split(':')) if ':' in v else float(v)
        font = instancer.instantiateVariableFont(font, limits)
        # Az instancer után a gvar még lusta nézet a régi glifkészletre, és a
        # subsetter ezen elhasal ('.notdef' KeyError). Mentés-újratöltés segít.
        buf = io.BytesIO()
        font.save(buf)
        buf.seek(0)
        font = TTFont(buf)

    opt = subset.Options()
    opt.layout_features = FEATURES
    opt.flavor = 'woff2'
    opt.desubroutinize = True
    opt.name_IDs = ['*']
    opt.name_languages = ['*']
    opt.notdef_outline = True
    s = subset.Subsetter(opt)
    s.populate(unicodes=U)
    s.subset(font)
    subset.save_font(font, out, opt)

    cmap = TTFont(out).getBestCmap()
    missing = [c for c in HU if ord(c) not in cmap]
    if missing:
        sys.exit('HIBA: hiányzik a magyar ábécéből: ' + ''.join(missing))
    print('%s  %.1f KB' % (out, os.path.getsize(out) / 1024))


if __name__ == '__main__':
    if len(sys.argv) not in (3, 4):
        sys.exit(__doc__)
    main(*sys.argv[1:])
