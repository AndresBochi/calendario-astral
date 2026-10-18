/* Calendario Astral — prototype.
   All positions are computed on-device with astronomy-engine (no internet needed).
   Zodiac is tropical (ecliptic longitude of date), geocentric. */

const A = Astronomy;

const SIGNS = [
  { g: "♈", es: "Aries", en: "Aries" },
  { g: "♉", es: "Tauro", en: "Taurus" },
  { g: "♊", es: "Géminis", en: "Gemini" },
  { g: "♋", es: "Cáncer", en: "Cancer" },
  { g: "♌", es: "Leo", en: "Leo" },
  { g: "♍", es: "Virgo", en: "Virgo" },
  { g: "♎", es: "Libra", en: "Libra" },
  { g: "♏", es: "Escorpio", en: "Scorpio" },
  { g: "♐", es: "Sagitario", en: "Sagittarius" },
  { g: "♑", es: "Capricornio", en: "Capricorn" },
  { g: "♒", es: "Acuario", en: "Aquarius" },
  { g: "♓", es: "Piscis", en: "Pisces" },
];

const PLANETS = [
  { body: "Mercury", g: "☿", es: "Mercurio", en: "Mercury" },
  { body: "Venus", g: "♀", es: "Venus", en: "Venus" },
  { body: "Mars", g: "♂", es: "Marte", en: "Mars" },
  { body: "Jupiter", g: "♃", es: "Júpiter", en: "Jupiter" },
  { body: "Saturn", g: "♄", es: "Saturno", en: "Saturn" },
  { body: "Uranus", g: "♅", es: "Urano", en: "Uranus" },
  { body: "Neptune", g: "♆", es: "Neptuno", en: "Neptune" },
  { body: "Pluto", g: "♇", es: "Plutón", en: "Pluto" },
];

const T = {
  es: {
    time: "Hora", sun: "Sol", moon: "Luna", sign: "Signo", today: "Hoy",
    degInSign: "Grado eclíptico del signo", degTotal: "Grado eclíptico total",
    ascent: "Ascenso", anomalistic: "Anomalístico",
    planets: "Planetas",
    footnote: "Zodíaco tropical · posiciones geocéntricas calculadas en el dispositivo, para el día elegido a la hora actual.",
    ascending: "Asciende ↑", descending: "Desciende ↓",
    northOf: "al norte del ecuador celeste", southOf: "al sur del ecuador celeste",
    toPerigee: "Hacia el perigeo", toApogee: "Hacia el apogeo",
    illuminated: "iluminada",
    phases: ["Luna nueva", "Creciente", "Cuarto creciente", "Gibosa creciente",
             "Luna llena", "Gibosa menguante", "Cuarto menguante", "Menguante"],
    sunrise: "Salida del sol", sunset: "Puesta del sol",
    moonrise: "Salida de la luna", moonset: "Puesta de la luna",
    noEvent: "no ocurre este día", needsLocation: "requiere ubicación",
    locating: "Buscando ubicación…", noLocation: "Ubicación no disponible",
    themeDark: "Tema oscuro", themeLight: "Tema claro",
  },
  en: {
    time: "Time", sun: "Sun", moon: "Moon", sign: "Sign", today: "Today",
    degInSign: "Degree in sign", degTotal: "Total ecliptic degree",
    ascent: "Declination", anomalistic: "Anomalistic",
    planets: "Planets",
    footnote: "Tropical zodiac · geocentric positions computed on-device, for the selected day at the current time.",
    ascending: "Ascending ↑", descending: "Descending ↓",
    northOf: "north of the celestial equator", southOf: "south of the celestial equator",
    toPerigee: "Heading to perigee", toApogee: "Heading to apogee",
    illuminated: "illuminated",
    phases: ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
             "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"],
    sunrise: "Sunrise", sunset: "Sunset",
    moonrise: "Moonrise", moonset: "Moonset",
    noEvent: "none this day", needsLocation: "needs location",
    locating: "Locating…", noLocation: "Location unavailable",
    themeDark: "Dark theme", themeLight: "Light theme",
  },
};

const $ = (id) => document.getElementById(id);

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

/* ---------- date helpers ---------- */

// Selected days are kept at local noon so DST shifts never move them to another date.
function noonOf(d) {
  const n = new Date(d);
  n.setHours(12, 0, 0, 0);
  return n;
}

function addDays(d, k) {
  const n = new Date(d);
  n.setDate(n.getDate() + k);
  return n;
}

function shiftMonths(d, months) {
  const n = new Date(d);
  const day = n.getDate();
  n.setDate(1);
  n.setMonth(n.getMonth() + months);
  const last = new Date(n);
  last.setMonth(last.getMonth() + 1, 0);
  n.setDate(Math.min(day, last.getDate())); // 31 Jan → 28/29 Feb
  return n;
}

const sameDay = (a, b) => a.toDateString() === b.toDateString();
const pad = (n, w = 2) => String(n).padStart(w, "0");
const isoDate = (d) => `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/* ---------- state ---------- */

const state = {
  lang: store.get("lang") || "es",
  theme: store.get("theme") ||
    (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  lat: null,
  lon: null,
  locStatus: "locating",
  selected: noonOf(new Date()),
};

// The sky is shown for the selected day at the current wall-clock time.
function viewDate(now) {
  const d = new Date(state.selected);
  d.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);
  return d;
}

/* ---------- astro helpers ---------- */

const norm = (x) => ((x % 360) + 360) % 360;
const t = (key) => T[state.lang][key];
const locale = () => (state.lang === "es" ? "es-ES" : "en-GB");
const glyph = (g) => g + "︎"; // force text (not emoji) presentation

function signOf(lon) {
  const L = norm(lon);
  const i = Math.floor(L / 30);
  return { i, sign: SIGNS[i], deg: L - i * 30 };
}

function fmtDeg(d) {
  const D = Math.floor(d);
  const m = Math.floor((d - D) * 60);
  return `${D}°${pad(m)}′`;
}

function eclipticLon(body, date) {
  if (body === "Sun") return A.SunPosition(date).elon;
  if (body === "Moon") return A.EclipticGeoMoon(date).lon;
  return A.Ecliptic(A.GeoVector(body, date, true)).elon;
}

/* Rise and set times during the given local day; null when the event
   doesn't happen that day (common for the Moon, or near the poles). */
function riseSetOn(body, date) {
  const obs = new A.Observer(state.lat, state.lon, 0);
  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);
  const find = (direction) => {
    const r = A.SearchRiseSet(body, obs, direction, midnight, 1);
    return r ? r.date : null;
  };
  return { rise: find(+1), set: find(-1) };
}

function renderRiseSet(body, date, riseId, setId) {
  if (state.lat === null) {
    $(riseId).textContent = $(setId).textContent = t("needsLocation");
    return;
  }
  const { rise, set } = riseSetOn(body, date);
  const fmt = (d) => d
    ? d.toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit", hour12: false })
    : t("noEvent");
  $(riseId).textContent = fmt(rise);
  $(setId).textContent = fmt(set);
}

function phaseIndex(angle) {
  return Math.floor(norm(angle + 22.5) / 45) % 8;
}

/* Moon disk: lit limb + terminator ellipse. Mirrored when waning,
   and flipped again in the southern hemisphere (where the view is inverted). */
function moonSVG(fraction, waxing, size) {
  const rx = Math.abs(1 - 2 * fraction) * 50;
  const sweep = fraction < 0.5 ? 0 : 1;
  const d = `M50 0 A50 50 0 0 1 50 100 A${rx.toFixed(2)} 50 0 0 ${sweep} 50 0Z`;
  const southern = state.lat !== null && state.lat < 0;
  const mirror = !waxing !== southern;
  return `<svg viewBox="-2 -2 104 104" width="${size}" height="${size}" aria-hidden="true">
    <circle cx="50" cy="50" r="50" class="moon-dark"/>
    <path d="${d}" class="moon-lit"${mirror ? ' transform="translate(100 0) scale(-1 1)"' : ""}/>
    <circle cx="50" cy="50" r="50" class="moon-rim"/>
  </svg>`;
}

/* ---------- rendering ---------- */

function renderStatic() {
  document.documentElement.lang = state.lang;
  document.documentElement.dataset.theme = state.theme;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $("langBtn").textContent = state.lang === "es" ? "EN" : "ES";
  const dark = state.theme === "dark";
  $("themeBtn").textContent = dark ? "☀︎" : "☾︎";
  $("themeBtn").title = dark ? t("themeLight") : t("themeDark");
  $("todayBtn").hidden = sameDay(state.selected, new Date());
  document.querySelector('meta[name="theme-color"]').content = dark ? "#7b6cf0" : "#b23a2e";
}

function renderDate() {
  const d = state.selected;
  const loc = locale();
  $("month").textContent = d.toLocaleDateString(loc, { month: "long" });
  $("year").textContent = d.getFullYear();
  $("weekday").textContent = d.toLocaleDateString(loc, { weekday: "long" });
  $("daynum").textContent = d.getDate();
  $("dmy").textContent = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function renderClock(now) {
  $("clock").textContent = now.toLocaleTimeString(locale(), {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
}

function renderLocation() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let text;
  if (state.lat !== null) {
    const ns = state.lat >= 0 ? "N" : "S";
    const ew = state.lon >= 0 ? "E" : "W";
    text = `${Math.abs(state.lat).toFixed(2)}° ${ns}, ${Math.abs(state.lon).toFixed(2)}° ${ew}`;
  } else {
    text = state.locStatus === "locating" ? t("locating") : t("noLocation");
  }
  $("location").textContent = `${text} · ${tz}`;
}

function renderSky(date) {
  // Sun
  const sunLon = eclipticLon("Sun", date);
  const sun = signOf(sunLon);
  $("sunSignGlyph").textContent = glyph(sun.sign.g);
  $("sunSign").textContent = sun.sign[state.lang];
  $("sunDeg").textContent = fmtDeg(sun.deg);
  $("sunTotal").textContent = `${sunLon.toFixed(2)}°`;
  renderRiseSet("Sun", date, "sunRise", "sunSet");

  // Moon: phase + illumination
  const angle = A.MoonPhase(date);
  const frac = A.Illumination("Moon", date).phase_fraction;
  $("moonIcon").innerHTML = moonSVG(frac, angle < 180, 64);
  $("moonPhase").textContent = t("phases")[phaseIndex(angle)];
  $("moonIllum").textContent = `${(frac * 100).toFixed(1)}% ${t("illuminated")}`;

  // Moon: sign
  const moonLon = eclipticLon("Moon", date);
  const moon = signOf(moonLon);
  $("moonSign").innerHTML =
    `${glyph(moon.sign.g)} ${moon.sign[state.lang]} ${fmtDeg(moon.deg)}`;
  $("moonTotal").textContent = `${norm(moonLon).toFixed(2)}°`;
  renderRiseSet("Moon", date, "moonRise", "moonSet");

  // Moon: ascending/descending relative to the celestial equator (declination trend)
  const obs = new A.Observer(state.lat ?? 0, state.lon ?? 0, 0);
  const decNow = A.Equator("Moon", date, obs, true, true).dec;
  const decLater = A.Equator("Moon", new Date(date.getTime() + 3600e3), obs, true, true).dec;
  $("moonAscent").innerHTML = `${decLater > decNow ? t("ascending") : t("descending")}
    <small>${Math.abs(decNow).toFixed(1)}° ${decNow >= 0 ? t("northOf") : t("southOf")}</small>`;

  // Moon: anomalistic — is the next apsis a perigee or an apogee?
  const apsis = A.SearchLunarApsis(date);
  const toPerigee = apsis.kind === A.ApsisKind.Pericenter;
  const distKm = A.GeoMoon(date).Length() * A.KM_PER_AU;
  $("moonApsis").innerHTML = `${toPerigee ? t("toPerigee") : t("toApogee")}
    <small>${Math.round(distKm).toLocaleString(locale())} km</small>`;

  // Planets (compact)
  const later = new Date(date.getTime() + 86400e3);
  $("planetList").innerHTML = PLANETS.map((p) => {
    const lon = eclipticLon(p.body, date);
    const s = signOf(lon);
    const retro = norm(eclipticLon(p.body, later) - lon + 180) - 180 < 0;
    return `<li title="${p[state.lang]}: ${s.sign[state.lang]} ${fmtDeg(s.deg)}">
      <span class="pg">${glyph(p.g)}</span>
      <span class="pn">${p[state.lang]}</span>
      <span class="ps">${glyph(s.sign.g)} ${fmtDeg(s.deg)}${retro ? ' <span class="rx">℞</span>' : ""}</span>
    </li>`;
  }).join("");
}

// Everything that depends on the selected day, except the day strip.
function renderSelection() {
  const now = new Date();
  renderStatic();
  renderDate();
  renderSky(viewDate(now));
}

function renderAll() {
  renderSelection();
  renderLocation();
  renderClock(new Date());
  buildStrip();
}

/* ---------- day strip: drag/swipe/wheel, eased snap to center ---------- */

const strip = $("days");
const RADIUS = 45;      // days rendered on each side of the selected one
const EDGE = 15;        // rebuild when the selection gets this close to an end
let items = [];
let raf = 0;
let animating = false;
let touching = false;
let drag = null;
let suppressClick = false;
let settleTimer = 0;

function buildStrip() {
  const loc = locale();
  const today = new Date();
  let html = "";
  for (let k = -RADIUS; k <= RADIUS; k++) {
    const day = addDays(state.selected, k);
    const angle = A.MoonPhase(day);
    const frac = A.Illumination("Moon", day).phase_fraction;
    const label = day.getDate() === 1
      ? `<span class="mo">${day.toLocaleDateString(loc, { month: "short" }).replace(".", "")}</span>`
      : `<span>${day.toLocaleDateString(loc, { weekday: "short" }).replace(".", "")}</span>`;
    const cls = ["wd", sameDay(day, today) && "is-today", k === 0 && "is-center"]
      .filter(Boolean).join(" ");
    html += `<button type="button" class="${cls}" data-t="${day.getTime()}">${label}
      <b>${day.getDate()}</b>${moonSVG(frac, angle < 180, 18)}</button>`;
  }
  strip.innerHTML = html;
  items = [...strip.querySelectorAll(".wd")];
  stopAnimation();
  strip.scrollLeft = targetLeft(items[RADIUS]);
}

const itemDate = (el) => new Date(Number(el.dataset.t));
const targetLeft = (el) => el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2;

function nearestIndex() {
  const mid = strip.scrollLeft + strip.clientWidth / 2;
  let best = 0;
  let bestDist = Infinity;
  items.forEach((el, i) => {
    const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
    if (dist < bestDist) { bestDist = dist; best = i; }
  });
  return best;
}

function markCenter(i) {
  items.forEach((el, j) => el.classList.toggle("is-center", j === i));
}

const easeOutQuart = (p) => 1 - Math.pow(1 - p, 4);

function stopAnimation() {
  cancelAnimationFrame(raf);
  animating = false;
}

function animateTo(left, done) {
  stopAnimation();
  const from = strip.scrollLeft;
  const delta = left - from;
  const duration = Math.min(650, 280 + Math.abs(delta) * 0.5);
  const t0 = performance.now();
  animating = true;
  const step = (now) => {
    const p = Math.min(1, (now - t0) / duration);
    strip.scrollLeft = from + delta * easeOutQuart(p);
    markCenter(nearestIndex());
    if (p < 1) {
      raf = requestAnimationFrame(step);
    } else {
      animating = false;
      done?.();
    }
  };
  raf = requestAnimationFrame(step);
}

function rebuildIfNearEdge(i) {
  if (i < EDGE || i > items.length - 1 - EDGE) buildStrip();
}

// The centered day becomes the selected day.
function commit(i) {
  const d = itemDate(items[i]);
  if (!sameDay(d, state.selected)) {
    state.selected = noonOf(d);
    renderSelection();
  }
  rebuildIfNearEdge(i);
}

function snap() {
  if (touching || drag || animating) return;
  const i = nearestIndex();
  const left = targetLeft(items[i]);
  if (Math.abs(left - strip.scrollLeft) < 1) commit(i);
  else animateTo(left, () => commit(i));
}

function scheduleSnap() {
  clearTimeout(settleTimer);
  settleTimer = setTimeout(snap, 120);
}

// Jump to any date: update the data right away, then glide the strip there.
function goTo(date) {
  state.selected = noonOf(date);
  renderSelection();
  const i = items.findIndex((el) => sameDay(itemDate(el), state.selected));
  if (i < 0) {
    buildStrip();
    return;
  }
  animateTo(targetLeft(items[i]), () => rebuildIfNearEdge(i));
}

strip.addEventListener("scroll", () => {
  if (animating) return;
  markCenter(nearestIndex());
  scheduleSnap();
}, { passive: true });

strip.addEventListener("touchstart", () => {
  touching = true;
  stopAnimation();
}, { passive: true });

const endTouch = () => {
  touching = false;
  scheduleSnap(); // momentum scrolling keeps pushing this back until it stops
};
strip.addEventListener("touchend", endTouch, { passive: true });
strip.addEventListener("touchcancel", endTouch, { passive: true });

// Mouse drag (touch scrolls natively).
strip.addEventListener("pointerdown", (e) => {
  suppressClick = false;
  if (e.pointerType !== "mouse" || e.button !== 0) return;
  stopAnimation();
  drag = { x: e.clientX, left: strip.scrollLeft, moved: false };
  strip.style.cursor = "grabbing";
});
window.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > 4) drag.moved = true;
  strip.scrollLeft = drag.left - dx;
});
window.addEventListener("pointerup", () => {
  if (!drag) return;
  suppressClick = drag.moved;
  drag = null;
  strip.style.cursor = "";
  scheduleSnap();
});

// Vertical mouse wheel scrolls the strip sideways.
strip.addEventListener("wheel", (e) => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  stopAnimation();
  strip.scrollLeft += e.deltaY;
}, { passive: false });

// Tap a day to glide it to the center.
strip.addEventListener("click", (e) => {
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  const el = e.target.closest(".wd");
  if (!el) return;
  const i = items.indexOf(el);
  animateTo(targetLeft(el), () => commit(i));
});

window.addEventListener("resize", () => {
  const i = items.findIndex((el) => sameDay(itemDate(el), state.selected));
  if (i >= 0) strip.scrollLeft = targetLeft(items[i]);
});

/* ---------- controls ---------- */

$("themeBtn").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  store.set("theme", state.theme);
  renderStatic();
});

$("langBtn").addEventListener("click", () => {
  state.lang = state.lang === "es" ? "en" : "es";
  store.set("lang", state.lang);
  renderAll();
});

$("todayBtn").addEventListener("click", () => goTo(new Date()));
$("prevMonth").addEventListener("click", () => goTo(shiftMonths(state.selected, -1)));
$("nextMonth").addEventListener("click", () => goTo(shiftMonths(state.selected, 1)));
$("prevYear").addEventListener("click", () => goTo(shiftMonths(state.selected, -12)));
$("nextYear").addEventListener("click", () => goTo(shiftMonths(state.selected, 12)));

$("dmyBtn").addEventListener("click", () => {
  const picker = $("datePick");
  picker.value = isoDate(state.selected);
  try {
    picker.showPicker();
  } catch {
    picker.focus();
    picker.click();
  }
});

$("datePick").addEventListener("change", (e) => {
  const [y, m, d] = e.target.value.split("-").map(Number);
  if (!y) return;
  const date = new Date(state.selected);
  date.setFullYear(y, m - 1, d);
  goTo(date);
});

function locate() {
  if (!navigator.geolocation) {
    state.locStatus = "unavailable";
    renderLocation();
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.lat = pos.coords.latitude;
      state.lon = pos.coords.longitude;
      state.locStatus = "ok";
      renderAll();
    },
    () => {
      state.locStatus = "unavailable";
      renderLocation();
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
  );
}

renderAll();
locate();

let lastMinute = new Date().getMinutes();
let lastDay = new Date();
setInterval(() => {
  const now = new Date();
  renderClock(now);
  if (now.getMinutes() === lastMinute) return;
  lastMinute = now.getMinutes();
  if (!sameDay(now, lastDay)) {
    const wasOnToday = sameDay(state.selected, lastDay);
    lastDay = now;
    if (wasOnToday) {
      goTo(now); // follow "today" across midnight
    } else {
      renderStatic();
      buildStrip();
    }
  }
  renderSky(viewDate(now));
}, 1000);
