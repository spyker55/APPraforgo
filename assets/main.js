/* ==========================================================================
   APPraforgó — a fény motorja

   Egyetlen requestAnimationFrame-ciklus visz mindent:
   - a napszakot (papír- és napfényszín, a nap helye, a napóra),
   - a dél-jelenet ívét,
   - a filmkockák parallaxát és a lemenő napot,
   - és — ha a látogató nem kért csökkentett mozgást — a virág fordulását és
     a napsugárban lebegő porszemeket.
   A szín akkor is változik, ha csökkentett mozgást kértek: az nem mozgás,
   csak fény. A nap viszont ilyenkor egy helyben marad.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var narrow = window.matchMedia("(max-width: 860px)");
  var NS = "http://www.w3.org/2000/svg";

  var ev = document.getElementById("ev");
  if (ev) ev.textContent = new Date().getFullYear();

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mixHex(a, b, t) {
    var x = rgb(a), y = rgb(b), o = "#";
    for (var i = 0; i < 3; i++) o += ("0" + Math.round(x[i] + (y[i] - x[i]) * t).toString(16)).slice(-2);
    return o;
  }
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  // Determinisztikus véletlen (mulberry32): minden betöltéskor ugyanaz a virág.
  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* --- 1. A virág ---------------------------------------------------------
     Vogel-modell: az n-edik mag r = c·√n távolságra és n·137,508° szögben ül.
     Ebből a két sorból jön ki magától a 21-es és 34-es spirálpár, amit egy
     valódi napraforgón is meg lehet számolni. A szirmok száma is ez: 21
     hátul, 34 elöl — Fibonacci-számok. */
  var svg = document.querySelector(".flower");
  if (svg) {
    var R = 290, N = 600, GOLDEN = Math.PI * (3 - Math.sqrt(5));
    var c = R / Math.sqrt(N), rand = rng(1375);

    var defs = el("defs", {}, svg);
    function grad(id, stops) {
      var g = el("linearGradient", { id: id, x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
      stops.forEach(function (s) { el("stop", { offset: s[0], "stop-color": s[1] }, g); });
    }
    grad("pf", [[0, "#C78105"], [.38, "#E8A31C"], [1, "#F7CB52"]]);
    grad("pb", [[0, "#A9690A"], [.5, "#CF8E1B"], [1, "#E2AC42"]]);
    // Fény a korongon: a nap felől (jobbra fent) meleg csúcsfény, a túloldalon
    // hideg-barna árnyék. Ettől lesz a lapos SVG-ből gömbölyű fej.
    var rg = el("radialGradient", { id: "disc-light", cx: .64, cy: .3, r: .95 }, defs);
    el("stop", { offset: 0, "stop-color": "#FFE9B8", "stop-opacity": .3 }, rg);
    el("stop", { offset: .38, "stop-color": "#FFE9B8", "stop-opacity": 0 }, rg);
    el("stop", { offset: 1, "stop-color": "#140C04", "stop-opacity": .42 }, rg);

    function petal(len, w) {
      return "M0 0C" + (w * .95) + " " + (-len * .16) + " " + (w * .7) + " " + (-len * .8) + " 0 " + (-len) +
             "C" + (-w * .7) + " " + (-len * .8) + " " + (-w * .95) + " " + (-len * .16) + " 0 0Z";
    }
    // A növekedést NEM elemenként animáljuk: 655 külön SVG-animáció (mag +
    // szirom) egy 450–850 ms-os főszál-feladatot okozott közvetlenül a
    // betöltés után, és ~1 másodpercre kitolta az első kirajzolást. Az SVG
    // gyerekelemek animációja nem kerülhet külön grafikus rétegre, tehát mind
    // a főszálon fut. Helyette három animáció van, csoportonként egy (CSS).
    function ring(count, lenK, wK, fill, offset, cls) {
      var g = el("g", { class: "petals " + cls }, svg);
      for (var i = 0; i < count; i++) {
        var a = i * 360 / count + offset + (rand() - .5) * 4;
        var len = R * lenK * (.9 + rand() * .2), w = R * wK * (.9 + rand() * .2);
        var holder = el("g", { transform: "rotate(" + a.toFixed(2) + ") translate(0 " + (-R * .9).toFixed(1) + ")" }, g);
        el("path", { d: petal(len, w), fill: "url(#" + fill + ")", class: "petal" }, holder);
        el("path", { d: "M0 " + (-len * .1) + "L0 " + (-len * .86), stroke: "rgba(110,62,0,.22)", "stroke-width": 1.4, fill: "none" }, holder);
      }
    }
    ring(21, .8, .22, "pb", 360 / 42, "petals--back");
    ring(34, .86, .18, "pf", 0, "petals--front");

    el("circle", { r: R * 1.03, fill: "#24170C", class: "disc" }, svg);
    var seeds = el("g", { class: "seeds" }, svg);
    for (var n = 1; n <= N; n++) {
      var r = c * Math.sqrt(n), a = n * GOLDEN, t = r / R, col, k = 1;
      if (t < .14)      col = mixHex("#7C7B35", "#5A5223", t / .14);          // éretlen közép: olajzöld
      else if (t < .5)  col = mixHex("#4F3B1F", "#3A2817", (t - .14) / .36);
      else if (t < .6)  { col = rand() < .5 ? "#D49C22" : "#B9821B"; k = .82; } // nyíló virágkák gyűrűje
      else              col = mixHex("#3A2817", "#22160B", (t - .6) / .4);
      el("circle", {
        cx: (r * Math.cos(a)).toFixed(2), cy: (r * Math.sin(a)).toFixed(2),
        r: (c * (.56 + .3 * t) * k).toFixed(2), fill: col, class: "seed"
      }, seeds);
    }
    el("circle", { r: R * 1.04, fill: "url(#disc-light)" }, svg);
    el("circle", { r: R * 1.04, fill: "none", stroke: "rgba(255,214,140,.28)", "stroke-width": 2 }, svg);
  }

  /* --- 2. A napszak --------------------------------------------------------
     Öt fényállapot, jelenetenként egy. A horgonyok nem egyenletesek, hanem a
     jelenetek tényleges helyéhez kötöttek: a dél ott van, ahol a dél-jelenet
     közepe a képernyő közepére ér. */
  var DAY = [
    { paper: "#E9ECEC", sun: "#FFE6D8" },   // hajnal: hideg gyöngyház, rózsás fény
    { paper: "#F5F3EC", sun: "#FFF3DC" },   // délelőtt
    { paper: "#FAF6EC", sun: "#FFF8E0" },   // dél: a legvilágosabb
    { paper: "#F4E6CB", sun: "#FFDB94" },   // aranyóra: méz
    { paper: "#F0D7CB", sun: "#FFB896" }    // alkony: barack-rózsa
  ];
  // A nyári napforduló Budapesten: napkelte ~4:46, napnyugta ~20:45. A lap
  // alja egy perccel napnyugta után van — ezért igaz a lábléc „a nap lement" sora.
  var START = 4 * 60 + 46, END = 20 * 60 + 46;
  // Az óra is a jelenetekhez horgonyzódik, nem lineáris a görgetéssel —
  // különben az „Aranyóra" délután háromkor kezdődne. Dél = Budapest
  // csillagászati dele (19,04° K, nyári időszámítás): ~12:46. Az aranyóra
  // júniusban este fél nyolc körül van.
  var TIMES = [START, 9 * 60 + 30, 12 * 60 + 46, 19 * 60 + 50, END];
  var scenes = [].slice.call(document.querySelectorAll("[data-scene]"));
  var clock = document.querySelector("[data-clock]");
  var sceneName = document.querySelector("[data-scene-name]");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var anchors = [], maxScroll = 1, lastPaper = "";

  function measure() {
    maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    anchors = scenes.map(function (s, i) {
      if (i === 0) return 0;
      if (i === scenes.length - 1) return 1;
      var mid = s.offsetTop + s.offsetHeight / 2 - window.innerHeight / 2;
      return clamp(mid / maxScroll, 0, 1);
    });
    layoutArc();
  }

  function updateDay(y) {
    // Jelenetek nélküli lapon (pl. a megosztási kártyán, ami csak a virágot
    // kéri ettől a fájltól) nincs napszak — enélkül minden képkockán
    // TypeError lenne a scenes[0]-n.
    if (!scenes.length) return;
    var p = clamp(y / maxScroll, 0, 1), i = 0;
    while (i < anchors.length - 2 && p > anchors[i + 1]) i++;
    var span = anchors[i + 1] - anchors[i] || 1;
    var tl = clamp((p - anchors[i]) / span, 0, 1), t = smooth(tl);
    var paper = mixHex(DAY[i].paper, DAY[i + 1].paper, t);
    var sun = mixHex(DAY[i].sun, DAY[i + 1].sun, t);
    doc.style.setProperty("--paper", paper);
    doc.style.setProperty("--sunlight", sun);
    if (themeMeta && paper !== lastPaper) { themeMeta.setAttribute("content", paper); lastPaper = paper; }

    // Az idő a jelenet-horgonyok között egyenletesen telik; a nap helye az
    // időből jön, így délben (12:46) áll a legmagasabban — a dél-jelenetben.
    var m = Math.round(TIMES[i] + (TIMES[i + 1] - TIMES[i]) * tl);
    var f = (m - START) / (END - START);
    // Dél felé nézve a nap balról (kelet) kel és jobbra (nyugat) nyugszik —
    // ezért halad balról jobbra. Csökkentett mozgásnál egy helyben áll.
    var sx = 6 + 88 * f, sy = 92 - 80 * Math.sin(Math.PI * f);
    if (reduce.matches) { sx = 74; sy = 16; }
    doc.style.setProperty("--sun-x", sx.toFixed(2));
    doc.style.setProperty("--sun-y", sy.toFixed(2));
    sunPos.x = sx; sunPos.y = sy;

    if (clock) clock.textContent = ("0" + Math.floor(m / 60)).slice(-2) + ":" + ("0" + (m % 60)).slice(-2);

    var current = scenes[0];
    for (var k = 0; k < scenes.length; k++) {
      if (scenes[k].getBoundingClientRect().top <= window.innerHeight * .45) current = scenes[k];
    }
    if (sceneName && sceneName.textContent !== current.dataset.scene) sceneName.textContent = current.dataset.scene;
  }
  var sunPos = { x: 50, y: 14 };

  /* --- 3. Dél: a nap pályája ---------------------------------------------- */
  var arcScene = document.querySelector(".scene--del");
  var arcPath = document.querySelector(".arc-lit");
  var arcSun = document.querySelector(".arc-sun");
  var stationsG = document.querySelector(".arc-stations");
  var steps = [].slice.call(document.querySelectorAll(".step"));
  var arcBox = document.querySelector(".arc"), pin = document.querySelector(".pin");
  var arcLen = 0, stations = [], arcPinned = false;

  function layoutArc() {
    if (!arcPath) return;
    // Megáll-e a jelenet: ezt a CSS dönti el (szélesség, magasság, mozgás), innen csak leolvassuk.
    arcPinned = getComputedStyle(pin).position === "sticky";
    arcLen = arcPath.getTotalLength();
    arcPath.style.strokeDasharray = arcLen;
    if (!stations.length) {
      steps.forEach(function (st) {
        var at = parseFloat(st.dataset.at), pt = arcPath.getPointAtLength(arcLen * at);
        var g = el("g", { class: "station", transform: "translate(" + pt.x.toFixed(1) + " " + pt.y.toFixed(1) + ")" }, stationsG);
        el("line", { class: "station-drop", x1: 0, y1: 14, x2: 0, y2: (340 - pt.y).toFixed(1) }, g);
        el("circle", { class: "station-ring", r: 11 }, g);
        el("circle", { class: "station-dot", r: 5 }, g);
        st.style.setProperty("--x", (pt.x / 1200 * 100).toFixed(2));
        stations.push({ at: at, g: g, li: st });
      });
    }
  }

  function updateArc() {
    if (!arcPath || !arcLen) return;
    var a = 1;
    if (!narrow.matches && !reduce.matches) {
      if (arcPinned) {
        var r = arcScene.getBoundingClientRect();
        var q = clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1);
        a = clamp((q - .04) / .86, 0, 1);
      } else {
        // Alacsony képernyő, a jelenet nem áll meg: a nap akkor halad, amikor az
        // ív a képernyő aljáról (90%) felér a harmadáig (35%).
        var top = arcBox.getBoundingClientRect().top, vh = window.innerHeight;
        a = clamp((vh * .9 - top) / (vh * .55), 0, 1);
      }
    }
    arcPath.style.strokeDashoffset = (arcLen * (1 - a)).toFixed(1);
    var pt = arcPath.getPointAtLength(arcLen * a);
    arcSun.setAttribute("transform", "translate(" + pt.x.toFixed(1) + " " + pt.y.toFixed(1) + ")");
    stations.forEach(function (s) {
      var lit = a >= s.at - .005;
      s.g.classList.toggle("is-lit", lit);
      s.li.classList.toggle("is-lit", lit);
    });
  }

  /* --- 4. Filmkockák és a lemenő nap -------------------------------------- */
  var frames = [].slice.call(document.querySelectorAll(".still-frame"));
  var horizonSun = document.querySelector(".horizon-sun");
  var horizon = document.querySelector(".horizon");

  function updateStills() {
    var vh = window.innerHeight;
    if (!reduce.matches) {
      // A keret lassabban mozog, mint a lap: a szöveg és a kép két külön
      // mélységi síkon van. A kép maga nem mozdul a keretben — nincs vágás.
      frames.forEach(function (f) {
        var r = f.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var k = clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1);
        f.style.setProperty("--py", (k * 34).toFixed(1) + "px");
      });
    }
    if (horizon && horizonSun) {
      var hr = horizon.getBoundingClientRect();
      var set = clamp((vh - hr.bottom) / (vh * .55), 0, 1);
      horizonSun.style.setProperty("--set", reduce.matches ? .3 : set.toFixed(3));
    }
  }

  /* --- 5. Heliotrópia: a fej a fény felé fordul ----------------------------
     A fiatal napraforgó napközben követi a napot. Itt a fej két dolgot követ:
     a napot (a görgetéssel) és a látogató egerét — ha mozog, felé fordul. */
  var stage = document.querySelector(".flower-stage");
  var tilt = document.querySelector(".flower-tilt");
  var heroVisible = true, pointer = null, cur = { x: 0, y: 0 };

  if (stage && "IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; }).observe(stage);
  }
  window.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    pointer = { x: e.clientX, y: e.clientY };
  }, { passive: true });
  doc.addEventListener("pointerleave", function () { pointer = null; });

  function updateTilt(y) {
    if (!tilt || !heroVisible) return;
    var tx = (50 - sunPos.y) / 50 * 5, ty = (sunPos.x - 50) / 50 * 12;   // a nap felé
    if (pointer) {
      var r = stage.getBoundingClientRect();
      var dx = clamp((pointer.x - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
      var dy = clamp((pointer.y - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1);
      ty += dx * 14; tx -= dy * 10;                                        // és feléd
    }
    cur.x += (tx - cur.x) * .05; cur.y += (ty - cur.y) * .05;               // lassan, mint egy növény
    tilt.style.setProperty("--tilt-x", cur.x.toFixed(2) + "deg");
    tilt.style.setProperty("--tilt-y", cur.y.toFixed(2) + "deg");
    svg.style.setProperty("--spin", (y * .02).toFixed(2) + "deg");
  }

  /* --- 6. Porszemek a napsugárban ------------------------------------------
     Mint egy napos szobában: csak a fénykévén belül látszanak, és lassan
     sodródnak. Világos papíron fehér por nem látszana, ezért arany. */
  var canvas = document.querySelector(".motes");
  var ctx = canvas && canvas.getContext("2d");
  var motes = [], dpr = 1;
  function sizeCanvas() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
  }
  if (ctx) {
    var mr = rng(7);
    for (var i = 0; i < 46; i++) {
      motes.push({ ang: mr() * Math.PI * 2, rad: .15 + mr() * .85, size: .6 + mr() * 1.5, speed: (mr() - .5) * .00012, phase: mr() * 6.28, bob: mr() * 6.28 });
    }
  }
  function drawMotes(now) {
    if (!ctx) return;
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    var cx = sunPos.x / 100 * w, cy = sunPos.y / 100 * h, Rr = Math.max(w, h) * .3;
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i];
      m.ang += m.speed * 16;
      var rr = Rr * (m.rad + Math.sin(now * .00025 + m.bob) * .03);
      var x = cx + Math.cos(m.ang) * rr, y = cy + Math.sin(m.ang) * rr * .7 + Math.sin(now * .0004 + m.phase) * 6 * dpr;
      if (x < -10 || y < -10 || x > w + 10 || y > h + 10) continue;
      var al = (.22 + .3 * (.5 + .5 * Math.sin(now * .0009 + m.phase))) * (1 - m.rad * .6);
      ctx.fillStyle = "rgba(201,138,18," + (al * .16).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(x, y, m.size * 3.2 * dpr, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(170,110,10," + (al * .75).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(x, y, m.size * dpr, 0, 6.2832); ctx.fill();
    }
  }

  /* --- 7. Expozíció: ami képre ér, előhívódik ------------------------------ */
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && reveals.length) {
    reveals.forEach(function (r) {
      var sib = [].slice.call(r.parentNode.children).filter(function (x) { return x.classList.contains("reveal"); });
      r.style.setProperty("--stagger", sib.indexOf(r));
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .12 });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    doc.classList.remove("js");
  }

  /* --- A ciklus ------------------------------------------------------------ */
  var lastY = -1, dirty = true;
  function frame(now) {
    var y = window.scrollY;
    if (dirty || y !== lastY) { lastY = y; dirty = false; updateDay(y); updateArc(); updateStills(); }
    if (!reduce.matches) { updateTilt(y); drawMotes(now); }
    requestAnimationFrame(frame);
  }
  function onResize() { sizeCanvas(); measure(); dirty = true; }
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", onResize);
  reduce.addEventListener("change", function () { if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height); measure(); dirty = true; });
  narrow.addEventListener("change", function () { dirty = true; });
  onResize();
  requestAnimationFrame(frame);
})();
