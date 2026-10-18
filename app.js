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
    degInSign: "Grado del signo", degTotal: "Grado eclíptico total",
    ascent: "Ascenso", anomalistic: "Anomalístico",
    planets: "Planetas",
    footnote: "Zodíaco tropical · posiciones geocéntricas calculadas en el dispositivo, para el día elegido a la hora local del lugar.",
    ascending: "Asciende ↑", descending: "Desciende ↓",
    until: "hasta el", movingNorth: "hacia el norte", movingSouth: "hacia el sur",
    toPerigee: "Hacia el perigeo", toApogee: "Hacia el apogeo",
    untilApsis: (n, hours) =>
      `${n === 1 ? "falta" : "faltan"} ${n} ${hours ? "h" : n === 1 ? "día" : "días"}`,
    illuminated: "iluminada",
    phases: ["Luna nueva", "Creciente", "Cuarto creciente", "Gibosa creciente",
             "Luna llena", "Gibosa menguante", "Cuarto menguante", "Menguante"],
    sunrise: "Salida del sol", sunset: "Puesta del sol",
    moonrise: "Salida de la luna", moonset: "Puesta de la luna",
    noEvent: "no ocurre este día", needsLocation: "requiere ubicación",
    locating: "Buscando ubicación…", noLocation: "Ubicación no disponible",
    locTitle: "Tu ubicación", useLocation: "Usar mi ubicación (GPS)",
    chooseLocation: "Elegir ubicación", changeLocation: "Cambiar ubicación",
    searchCity: "O busca tu ciudad", cityPlaceholder: "Ej.: Bragado", search: "Buscar",
    searching: "Buscando…", noResults: "No se encontraron lugares",
    searchFailed: "No se pudo buscar. Revisa la conexión a internet.",
    helpIosSafari: "La ubicación está bloqueada en el iPhone. Ve a Ajustes › Privacidad y seguridad › " +
      "Localización, actívala y en «Sitios web de Safari» elige «Cuando se use la app». " +
      "Luego recarga esta página. También puedes buscar tu ciudad abajo.",
    helpIosChrome: "La ubicación está bloqueada en el iPhone. Ve a Ajustes › Privacidad y seguridad › " +
      "Localización, actívala y en «Chrome» elige «Cuando se use la app». " +
      "Luego recarga esta página. También puedes buscar tu ciudad abajo.",
    helpOther: "La ubicación está bloqueada. Permítela desde el icono junto a la dirección y " +
      "recarga la página, o busca tu ciudad abajo.",
    themeDark: "Tema oscuro", themeLight: "Tema claro",
  },
  en: {
    time: "Time", sun: "Sun", moon: "Moon", sign: "Sign", today: "Today",
    degInSign: "Degree in sign", degTotal: "Total ecliptic degree",
    ascent: "Ascent", anomalistic: "Anomalistic",
    planets: "Planets",
    footnote: "Tropical zodiac · geocentric positions computed on-device, for the selected day at the local time of the place.",
    ascending: "Ascending ↑", descending: "Descending ↓",
    until: "until", movingNorth: "moving north", movingSouth: "moving south",
    toPerigee: "Heading to perigee", toApogee: "Heading to apogee",
    untilApsis: (n, hours) => `${n} ${hours ? "h" : n === 1 ? "day" : "days"} left`,
    illuminated: "illuminated",
    phases: ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
             "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"],
    sunrise: "Sunrise", sunset: "Sunset",
    moonrise: "Moonrise", moonset: "Moonset",
    noEvent: "none this day", needsLocation: "needs location",
    locating: "Locating…", noLocation: "Location unavailable",
    locTitle: "Your location", useLocation: "Use my location (GPS)",
    chooseLocation: "Set location", changeLocation: "Change location",
    searchCity: "Or search for your city", cityPlaceholder: "e.g. Bragado", search: "Search",
    searching: "Searching…", noResults: "No places found",
    searchFailed: "Couldn't search. Check your internet connection.",
    helpIosSafari: "Location is blocked on this iPhone. Go to Settings › Privacy & Security › " +
      "Location Services, turn it on, and set “Safari Websites” to “While Using the App”. " +
      "Then reload this page. You can also search for your city below.",
    helpIosChrome: "Location is blocked on this iPhone. Go to Settings › Privacy & Security › " +
      "Location Services, turn it on, and set “Chrome” to “While Using the App”. " +
      "Then reload this page. You can also search for your city below.",
    helpOther: "Location is blocked. Allow it from the icon next to the address bar and reload " +
      "the page, or search for your city below.",
    themeDark: "Dark theme", themeLight: "Light theme",
  },
};

const $ = (id) => document.getElementById(id);

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

/* ---------- calendar days ---------- */

// A calendar day is a Date at 12:00 UTC read with the UTC getters: it names a
// day, not a moment. Moments come from instantAt() in the location's time zone.
function calDay(y, m, d) {
  const n = new Date(Date.UTC(2000, 0, 1, 12));
  n.setUTCFullYear(y, m, d); // also handles years 0–99 and month/day overflow
  return n;
}

function addDays(d, k) {
  const n = new Date(d);
  n.setUTCDate(n.getUTCDate() + k);
  return n;
}

function shiftMonths(d, months) {
  const n = calDay(d.getUTCFullYear(), d.getUTCMonth() + months, 1);
  const last = calDay(n.getUTCFullYear(), n.getUTCMonth() + 1, 0).getUTCDate();
  n.setUTCDate(Math.min(d.getUTCDate(), last)); // 31 Jan → 28/29 Feb
  return n;
}

const pad = (n, w = 2) => String(n).padStart(w, "0");
const isoDate = (d) => `${pad(d.getUTCFullYear(), 4)}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const sameDay = (a, b) => isoDate(a) === isoDate(b);

/* ---------- the location's time zone ---------- */

const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

// Time zone at the coordinates (offline lookup), or the device's without a location.
function tzFor(lat, lon) {
  if (lat === null || lat === undefined) return deviceTz;
  try {
    return tzlookup(lat, lon);
  } catch {
    return deviceTz;
  }
}

const zoneFormatters = {};

// Wall-clock fields of a moment, as the location's clocks show it.
function zoned(date) {
  const tz = state.tz;
  zoneFormatters[tz] ??= new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
  });
  const p = {};
  for (const { type, value } of zoneFormatters[tz].formatToParts(date)) p[type] = Number(value);
  return { y: p.year, m: p.month - 1, d: p.day, h: p.hour, mi: p.minute, s: p.second };
}

const todayCal = () => {
  const z = zoned(new Date());
  return calDay(z.y, z.m, z.d);
};

// The moment when the location's clocks show this time on this calendar day.
function instantAt(day, h = 0, mi = 0, s = 0) {
  const wall = (y, m, d, hh, mm, ss) => {
    const n = calDay(y, m, d);
    n.setUTCHours(hh, mm, ss, 0);
    return n.getTime();
  };
  const target = wall(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), h, mi, s);
  let ms = target;
  for (let i = 0; i < 3; i++) {
    const z = zoned(new Date(ms));
    ms += target - wall(z.y, z.m, z.d, z.h, z.mi, z.s);
  }
  return new Date(ms);
}

/* ---------- state ---------- */

// Last known location, so the app is useful right away while GPS refreshes.
const savedLoc = (() => {
  try {
    const v = JSON.parse(store.get("loc"));
    return Number.isFinite(v?.lat) && Number.isFinite(v?.lon) ? v : null;
  } catch {
    return null;
  }
})();

const state = {
  lang: store.get("lang") || "es",
  theme: store.get("theme") ||
    (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  lat: savedLoc?.lat ?? null,
  lon: savedLoc?.lon ?? null,
  locStatus: "locating",
  place: "",
  tz: tzFor(savedLoc?.lat, savedLoc?.lon),
  selected: null,
};
state.selected = todayCal();

// After the location changes: switch to its time zone, and if "today" was
// showing, move to today over there (it can be another date).
function updateZone() {
  const wasToday = sameDay(state.selected, todayCal());
  state.tz = tzFor(state.lat, state.lon);
  if (wasToday) state.selected = todayCal();
}

// The sky is shown for the selected day at the location's current time.
function viewDate(now) {
  const z = zoned(now);
  return instantAt(state.selected, z.h, z.mi, z.s);
}

/* ---------- hemisphere ---------- */

// Time zones south of the equator. Without a location, they only decide which
// side of the moon icons is lit; everything else waits for the real location.
const SOUTHERN_TZ_PREFIXES = ["Australia/", "Antarctica/", "America/Argentina/"];
const SOUTHERN_TZ = new Set([
  // South America
  "America/Buenos_Aires", "America/Cordoba", "America/Mendoza", "America/Catamarca",
  "America/Jujuy", "America/Rosario", "America/Santiago", "America/Punta_Arenas",
  "America/Montevideo", "America/Asuncion", "America/La_Paz", "America/Lima",
  "America/Guayaquil", "America/Sao_Paulo", "America/Bahia", "America/Recife",
  "America/Fortaleza", "America/Belem", "America/Maceio", "America/Araguaina",
  "America/Cuiaba", "America/Campo_Grande", "America/Porto_Velho", "America/Rio_Branco",
  "America/Manaus", "America/Santarem", "America/Noronha", "America/Eirunepe",
  "Brazil/East", "Chile/Continental",
  // Africa
  "Africa/Johannesburg", "Africa/Maputo", "Africa/Harare", "Africa/Lusaka",
  "Africa/Lubumbashi", "Africa/Kinshasa", "Africa/Luanda", "Africa/Windhoek",
  "Africa/Gaborone", "Africa/Maseru", "Africa/Mbabane", "Africa/Blantyre",
  "Africa/Dar_es_Salaam", "Africa/Nairobi", "Africa/Kigali", "Africa/Bujumbura",
  "Africa/Brazzaville",
  // Indian Ocean, Southeast Asia
  "Indian/Antananarivo", "Indian/Mauritius", "Indian/Reunion", "Indian/Mayotte",
  "Indian/Comoro", "Indian/Chagos", "Indian/Kerguelen", "Indian/Cocos", "Indian/Christmas",
  "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "Asia/Dili",
  // Pacific, Atlantic
  "Pacific/Auckland", "Pacific/Chatham", "Pacific/Fiji", "Pacific/Tongatapu",
  "Pacific/Apia", "Pacific/Noumea", "Pacific/Efate", "Pacific/Port_Moresby",
  "Pacific/Bougainville", "Pacific/Guadalcanal", "Pacific/Norfolk", "Pacific/Tahiti",
  "Pacific/Marquesas", "Pacific/Gambier", "Pacific/Pitcairn", "Pacific/Rarotonga",
  "Pacific/Niue", "Pacific/Pago_Pago", "Pacific/Fakaofo", "Pacific/Funafuti",
  "Pacific/Wallis", "Pacific/Easter", "Pacific/Galapagos", "NZ",
  "Atlantic/St_Helena", "Atlantic/South_Georgia", "Atlantic/Stanley",
]);

// GPS when available, otherwise a guess from the time zone, otherwise north.
function hemisphere() {
  if (state.lat !== null) return { southern: state.lat < 0, source: "gps" };
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  if (!tz) return { southern: false, source: "default" };
  const southern = SOUTHERN_TZ.has(tz) || SOUTHERN_TZ_PREFIXES.some((p) => tz.startsWith(p));
  return { southern, source: "tz" };
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

/* Ascending/descending in the biodynamic sense, from the observer's exact spot:
   the Moon ascends while each daily culmination (its highest point in the sky)
   is higher than the one before, like the Sun between the winter and summer
   solstices. Returns the trend and the day of the culmination where it ends. */
function lunarArc(date) {
  const obs = new A.Observer(state.lat, state.lon, 0);
  const culmination = (start, direction) => A.SearchHourAngle("Moon", obs, 0, start, direction);
  const prev = culmination(date, -1);
  let cur = culmination(date, +1);
  const ascending = cur.hor.altitude > prev.hor.altitude;
  // North/south motion, from declination at consecutive culminations, so the
  // daily parallax wobble at the observer's spot cancels out.
  const dec = (event) => A.Equator("Moon", event.time, obs, true, true).dec;
  const movingNorth = dec(cur) > dec(prev);
  for (let i = 0; i < 20; i++) {
    const next = culmination(cur.time.AddDays(0.5), +1);
    if (ascending ? next.hor.altitude < cur.hor.altitude : next.hor.altitude > cur.hor.altitude) {
      return { ascending, movingNorth, end: cur.time.date };
    }
    cur = next;
  }
  return { ascending, movingNorth, end: null };
}

/* Rise and set times during the given calendar day at the location (midnight
   to midnight on its clocks); null when the event doesn't happen that day
   (common for the Moon, or near the poles). */
function riseSetOn(body, day) {
  const obs = new A.Observer(state.lat, state.lon, 0);
  const start = instantAt(day);
  const days = (instantAt(addDays(day, 1)) - start) / 86400e3; // 23–25 h on DST changes
  const find = (direction) => {
    const r = A.SearchRiseSet(body, obs, direction, start, days);
    return r ? r.date : null;
  };
  return { rise: find(+1), set: find(-1) };
}

function renderRiseSet(body, day, riseId, setId) {
  if (state.lat === null) {
    $(riseId).textContent = $(setId).textContent = t("needsLocation");
    return;
  }
  const { rise, set } = riseSetOn(body, day);
  const fmt = (d) => d
    ? d.toLocaleTimeString(locale(), { timeZone: state.tz, hour: "2-digit", minute: "2-digit", hour12: false })
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
  const mirror = !waxing !== hemisphere().southern;
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
  $("todayBtn").hidden = sameDay(state.selected, todayCal());
  document.querySelector('meta[name="theme-color"]').content = dark ? "#7b6cf0" : "#b23a2e";
  $("cityInput").placeholder = t("cityPlaceholder");
}

function renderDate() {
  const d = state.selected;
  const loc = locale();
  $("month").textContent = d.toLocaleDateString(loc, { timeZone: "UTC", month: "long" });
  $("year").textContent = d.getUTCFullYear();
  $("weekday").textContent = d.toLocaleDateString(loc, { timeZone: "UTC", weekday: "long" });
  $("daynum").textContent = d.getUTCDate();
  $("dmy").textContent = `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
}

// The location's local time.
function renderClock(now) {
  $("clock").textContent = now.toLocaleTimeString(locale(), {
    timeZone: state.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
}

function renderLocation() {
  const tz = state.tz;
  const el = $("location");
  if (state.lat !== null) {
    const ns = state.lat >= 0 ? "N" : "S";
    const ew = state.lon >= 0 ? "E" : "W";
    const coords = `${Math.abs(state.lat).toFixed(2)}° ${ns}, ${Math.abs(state.lon).toFixed(2)}° ${ew}`;
    // One line each: coordinates, town/province/country, time zone.
    el.replaceChildren(...[coords, state.place, tz].filter(Boolean).map((text) => {
      const line = document.createElement("div");
      line.textContent = text;
      return line;
    }));
    el.append(locPanelButton("loc-link", t("changeLocation")));
  } else if (state.locStatus === "locating") {
    el.textContent = t("locating");
  } else {
    el.replaceChildren(t("noLocation"), document.createElement("br"),
      locPanelButton("loc-btn", t("chooseLocation")));
  }
  renderLocHelp();
}

function locPanelButton(className, label) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = className;
  b.textContent = label;
  b.addEventListener("click", () => openLocPanel());
  return b;
}

// When the browser refused location, explain how to turn it on for this device.
function renderLocHelp() {
  const help = $("locHelp");
  help.hidden = state.locStatus !== "denied";
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  help.textContent = !ios ? t("helpOther") : /CriOS/.test(ua) ? t("helpIosChrome") : t("helpIosSafari");
}

function openLocPanel() {
  $("locPanel").hidden = false;
  renderLocHelp();
}

function renderSky(date) {
  // Sun
  const sunLon = eclipticLon("Sun", date);
  const sun = signOf(sunLon);
  $("sunSignGlyph").textContent = glyph(sun.sign.g);
  $("sunSign").textContent = sun.sign[state.lang];
  $("sunDeg").textContent = fmtDeg(sun.deg);
  $("sunTotal").textContent = `${sunLon.toFixed(2)}°`;
  renderRiseSet("Sun", state.selected, "sunRise", "sunSet");

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
  renderRiseSet("Moon", state.selected, "moonRise", "moonSet");

  // Moon: ascending/descending, from the observer's exact spot.
  if (state.lat === null) {
    $("moonAscent").textContent = t("needsLocation");
  } else {
    const arc = lunarArc(date);
    const until = arc.end
      ? `${t("until")} ${arc.end.toLocaleDateString(locale(),
        { timeZone: state.tz, weekday: "long", day: "numeric", month: "long" }).replace(",", "")}`
      : "";
    $("moonAscent").innerHTML =
      `${arc.ascending ? t("ascending") : t("descending")}` +
      `<small>${arc.movingNorth ? t("movingNorth") : t("movingSouth")} ${until}</small>`;
  }

  // Moon: anomalistic — is the next apsis a perigee or an apogee?
  const apsis = A.SearchLunarApsis(date);
  const toPerigee = apsis.kind === A.ApsisKind.Pericenter;
  const daysLeft = (apsis.time.date - date) / 86400e3;
  const left = daysLeft < 1
    ? t("untilApsis")(Math.max(1, Math.round(daysLeft * 24)), true)
    : t("untilApsis")(Math.floor(daysLeft), false);
  $("moonApsis").innerHTML = `${toPerigee ? t("toPerigee") : t("toApogee")}
    <small>${left}</small>`;

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
  const today = todayCal();
  let html = "";
  for (let k = -RADIUS; k <= RADIUS; k++) {
    const day = addDays(state.selected, k);
    const noon = instantAt(day, 12);
    const angle = A.MoonPhase(noon);
    const frac = A.Illumination("Moon", noon).phase_fraction;
    const label = day.getUTCDate() === 1
      ? `<span class="mo">${day.toLocaleDateString(loc, { timeZone: "UTC", month: "short" }).replace(".", "")}</span>`
      : `<span>${day.toLocaleDateString(loc, { timeZone: "UTC", weekday: "short" }).replace(".", "")}</span>`;
    const cls = ["wd", sameDay(day, today) && "is-today", k === 0 && "is-center"]
      .filter(Boolean).join(" ");
    html += `<button type="button" class="${cls}" data-t="${day.getTime()}">${label}
      <b>${day.getUTCDate()}</b>${moonSVG(frac, angle < 180, 18)}</button>`;
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
    state.selected = d;
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

// Jump to any calendar day: update the data right away, then glide the strip there.
function goTo(day) {
  state.selected = day;
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
  lookupPlace();
  store.set("lang", state.lang);
  renderAll();
});

$("todayBtn").addEventListener("click", () => goTo(todayCal()));
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
  goTo(calDay(y, m - 1, d));
});

function locate() {
  if (!navigator.geolocation) {
    state.locStatus = "unavailable";
    renderLocation();
    return;
  }
  if (state.lat === null) {
    state.locStatus = "locating";
    renderLocation();
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.lat = pos.coords.latitude;
      state.lon = pos.coords.longitude;
      state.locStatus = "ok";
      updateZone();
      store.set("loc", JSON.stringify({ lat: state.lat, lon: state.lon }));
      $("locPanel").hidden = true;
      lookupPlace();
      renderAll();
    },
    (err) => {
      // Keep a saved location if there is one; otherwise open the panel with
      // instructions and the city search.
      state.locStatus = err.code === err.PERMISSION_DENIED ? "denied" : "unavailable";
      renderLocation();
      if (state.lat === null) openLocPanel();
    },
    { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 },
  );
}

/* Town name for the location line, from OpenStreetMap (needs internet; the
   rest of the app doesn't). Cached on the device and looked up again only
   after moving about 2 km or switching language. */
async function lookupPlace() {
  if (state.lat === null) return;
  const { lat, lon, lang } = state;
  let cached = null;
  try {
    cached = JSON.parse(store.get("place2"));
  } catch {}
  const km = cached
    ? Math.hypot(cached.lat - lat, (cached.lon - lon) * Math.cos(lat * Math.PI / 180)) * 111
    : Infinity;
  if (cached && cached.lang === lang && km < 2) {
    state.place = cached.name;
    renderLocation();
    return;
  }
  state.place = ""; // never show a town from somewhere else
  try {
    const res = await fetch("https://nominatim.openstreetmap.org/reverse?format=jsonv2" +
      `&lat=${lat}&lon=${lon}&zoom=10&accept-language=${lang}`);
    if (!res.ok) return;
    const name = placeName((await res.json()).address);
    if (!name) return;
    state.place = name;
    store.set("place2", JSON.stringify({ lat, lon, lang, name }));
    renderLocation();
  } catch {
    // Offline or blocked: the line keeps coordinates and time zone.
  }
}

// "Bragado, Buenos Aires, Argentina"; skips the region when it repeats the town
// (CABA, Tokyo). `fallback` is the result's own name, for places filed as a
// province or state rather than a city.
function placeName(a = {}, fallback = "") {
  const town = a.city || a.town || a.village || a.municipality || a.hamlet || a.county || fallback;
  const region = a.state || a.province || "";
  const showRegion = region && !(town && region.includes(town));
  return [town, showRegion && region, a.country].filter(Boolean).join(", ");
}

/* ---------- location panel: GPS or city search ---------- */

function setManualLocation(lat, lon, name) {
  state.lat = lat;
  state.lon = lon;
  state.locStatus = "manual";
  state.place = name;
  updateZone();
  store.set("loc", JSON.stringify({ lat, lon, manual: true }));
  store.set("place2", JSON.stringify({ lat, lon, lang: state.lang, name }));
  $("locPanel").hidden = true;
  $("cityResults").replaceChildren();
  $("cityInput").value = "";
  renderAll();
}

function showCityMessage(text) {
  const li = document.createElement("li");
  li.className = "muted";
  li.textContent = text;
  $("cityResults").replaceChildren(li);
}

// Search runs on submit only (no search-as-you-type), per OpenStreetMap's usage policy.
$("citySearch").addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = $("cityInput").value.trim();
  if (!q) return;
  showCityMessage(t("searching"));
  try {
    const res = await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2" +
      `&addressdetails=1&limit=6&accept-language=${state.lang}&q=${encodeURIComponent(q)}`);
    const results = res.ok ? await res.json() : [];
    if (!results.length) {
      showCityMessage(t("noResults"));
      return;
    }
    $("cityResults").replaceChildren(...results.map((r) => {
      const name = placeName(r.address, r.name) || r.display_name;
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = name;
      b.addEventListener("click", () => setManualLocation(Number(r.lat), Number(r.lon), name));
      const li = document.createElement("li");
      li.append(b);
      return li;
    }));
  } catch {
    showCityMessage(t("searchFailed"));
  }
});

$("gpsBtn").addEventListener("click", locate);
$("locClose").addEventListener("click", () => {
  $("locPanel").hidden = true;
});

renderAll();
lookupPlace();
// A city picked by hand stays until the person asks for GPS again.
if (savedLoc?.manual) state.locStatus = "manual";
else locate();

let lastMinute = new Date().getMinutes();
let lastDay = todayCal();
setInterval(() => {
  const now = new Date();
  renderClock(now);
  if (now.getMinutes() === lastMinute) return;
  lastMinute = now.getMinutes();
  const today = todayCal(); // midnight at the location, not on the device
  if (!sameDay(today, lastDay)) {
    const wasOnToday = sameDay(state.selected, lastDay);
    lastDay = today;
    if (wasOnToday) {
      goTo(today); // follow "today" across midnight
    } else {
      renderStatic();
      buildStrip();
    }
  }
  renderSky(viewDate(now));
}, 1000);
