/* Calendario Astral — prototype.
   All positions are computed on-device with astronomy-engine (no internet needed).
   Zodiac is tropical (ecliptic longitude of date), geocentric. */

const A = Astronomy;

/* A phone: a touch screen with no mouse, whose shorter side is under 600 px
   (tablets and computers fall outside). Phones get one column and no column
   options. The install bar names the device: phone, tablet or PC. */
const IS_TOUCH_ONLY = Boolean(window.matchMedia?.("(pointer: coarse) and (hover: none)").matches);
const IS_PHONE = IS_TOUCH_ONLY && Math.min(screen.width, screen.height) < 600;
const DEVICE = IS_PHONE ? "phone" : IS_TOUCH_ONLY ? "tablet" : "pc";

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
    azimuth: "Acimut (ahora)", altitude: "Altura (ahora)", maxAltitude: "Altura máxima del día",
    azimuthSet: "Acimut (a esa hora)", altitudeSet: "Altura (a esa hora)",
    timeSet: "Hora elegida", resumeNow: "Volver a la hora actual", setTime: "Elegir hora",
    compass: ["N", "NE", "E", "SE", "S", "SO", "O", "NO"],
    belowHorizon: "bajo el horizonte", atTime: "a las",
    aboveHorizon: (ms) => {
      const min = Math.round(ms / 60000);
      return `${Math.floor(min / 60)} h ${pad(min % 60)} min sobre el horizonte`;
    },
    locating: "Buscando ubicación…", noLocation: "Ubicación no disponible",
    locTitle: "Tu ubicación", useLocation: "Usar mi ubicación (GPS)",
    chooseLocation: "Elegir ubicación", changeLocation: "Cambiar ubicación",
    searchCity: "O busca tu ciudad, o escribe coordenadas",
    cityPlaceholder: "Ej.: Bragado o -35.12, -60.49", search: "Buscar",
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
    installText: `Instala Calendario Astral en tu ${{ phone: "teléfono", tablet: "tablet", pc: "PC" }[DEVICE]}`, install: "Instalar",
    customize: "Personalizar", layoutTitle: "Diseño", columns: "Columnas",
    colsNote: (n) => `La ventana solo tiene lugar para ${n} ${n === 1 ? "columna" : "columnas"}; se usan más al agrandarla.`,
    editLayout: "Mover módulos", resetLayout: "Restaurar diseño", done: "Listo",
    modToday: "Fecha y lugar", modDays: "Días", moveEarlier: "Mover antes", moveLater: "Mover después",
    narrower: "Más angosto", wider: "Más ancho", hideMod: "Ocultar", showMod: "Mostrar",
    colorsTitle: "Colores", primaryColor: "Primario (encabezado, botones, resaltados)",
    secondaryColor: "Secundario (símbolos del sol y los signos)", resetColors: "Restaurar colores",
    fontTitle: "Tipografía", fontNormal: "Normal", fontMore: "Más fuentes",
    fontNote: "OpenDyslexic es una letra pensada para facilitar la lectura a personas con dislexia.",
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
    azimuth: "Azimuth (now)", altitude: "Altitude (now)", maxAltitude: "Highest altitude of the day",
    azimuthSet: "Azimuth (at that time)", altitudeSet: "Altitude (at that time)",
    timeSet: "Chosen time", resumeNow: "Back to current time", setTime: "Set time",
    compass: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
    belowHorizon: "below the horizon", atTime: "at",
    aboveHorizon: (ms) => {
      const min = Math.round(ms / 60000);
      return `${Math.floor(min / 60)} h ${pad(min % 60)} min above the horizon`;
    },
    locating: "Locating…", noLocation: "Location unavailable",
    locTitle: "Your location", useLocation: "Use my location (GPS)",
    chooseLocation: "Set location", changeLocation: "Change location",
    searchCity: "Or search for your city, or type coordinates",
    cityPlaceholder: "e.g. Bragado or -35.12, -60.49", search: "Search",
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
    installText: `Install Calendario Astral on your ${{ phone: "phone", tablet: "tablet", pc: "PC" }[DEVICE]}`, install: "Install",
    customize: "Customize", layoutTitle: "Layout", columns: "Columns",
    colsNote: (n) => `The window only has room for ${n} ${n === 1 ? "column" : "columns"}; more are used when it is wider.`,
    editLayout: "Move modules", resetLayout: "Restore layout", done: "Done",
    modToday: "Date & place", modDays: "Days", moveEarlier: "Move earlier", moveLater: "Move later",
    narrower: "Narrower", wider: "Wider", hideMod: "Hide", showMod: "Show",
    colorsTitle: "Colours", primaryColor: "Primary (header, buttons, highlights)",
    secondaryColor: "Secondary (Sun and sign symbols)", resetColors: "Restore colours",
    fontTitle: "Font", fontNormal: "Standard", fontMore: "More fonts",
    fontNote: "OpenDyslexic is a typeface designed to make reading easier for people with dyslexia.",
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

/* Fonts for Personalizar › Tipografía. "normal" is the app's own pair (Inter
   with Fraunces headings); any other font is used for all the text. The ones
   with a `google` query come from Google Fonts, loaded only once picked;
   OpenDyslexic is saved in vendor/fonts (styles.css). */
const FONTS = {
  normal: { name: "" },
  atkinson: { name: "Atkinson Hyperlegible", label: "Atkinson", google: "Atkinson+Hyperlegible:wght@400;700" },
  lexend: { name: "Lexend", google: "Lexend:wght@400;500;600;700;800" },
  andika: { name: "Andika", google: "Andika:wght@400;700" },
  nunito: { name: "Nunito", google: "Nunito:wght@400;500;600;800" },
  merriweather: { name: "Merriweather", google: "Merriweather:wght@400;700;900" },
  dyslexic: { name: "OpenDyslexic" },
};
const MORE_FONTS = Object.keys(FONTS).filter((k) => FONTS[k].google);

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
  fixedTime: null, // { h, mi } when the person picks a time; null follows the clock
  font: FONTS[store.get("font")] ? store.get("font") : "normal",
  colors: (() => { // { primary, secondary } picked by the person; missing = the theme's own
    try {
      return JSON.parse(store.get("colors")) || {};
    } catch {
      return {};
    }
  })(),
};
state.selected = todayCal();

// After the location changes: switch to its time zone, and if "today" was
// showing, move to today over there (it can be another date).
function updateZone() {
  const wasToday = sameDay(state.selected, todayCal());
  state.tz = tzFor(state.lat, state.lon);
  if (wasToday) state.selected = todayCal();
}

// The sky is shown for the selected day at the chosen time, or else at the
// location's current time.
function viewDate(now) {
  if (state.fixedTime) return instantAt(state.selected, state.fixedTime.h, state.fixedTime.mi);
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
  const small = document.createElement("small");
  small.textContent = t("aboveHorizon")(timeAboveHorizon(body, day));
  $(setId).append(small);
}

/* Total time above the horizon during the calendar day at the location (local
   midnight to midnight), adding up every stretch between a rise and a set. For
   the Moon that is often two stretches: until it sets, and after it rises. */
function timeAboveHorizon(body, day) {
  const obs = new A.Observer(state.lat, state.lon, 0);
  const start = instantAt(day);
  const end = instantAt(addDays(day, 1));
  const next = (direction, from) => {
    const r = A.SearchRiseSet(body, obs, direction, from, (end - from) / 86400e3);
    return r && r.date < end ? r.date : null;
  };
  const firstRise = next(+1, start);
  const firstSet = next(-1, start);
  let up;
  if (firstRise || firstSet) {
    up = Boolean(firstSet) && (!firstRise || firstSet < firstRise);
  } else {
    // No rise or set all day (polar day/night): up or down the whole time.
    const eq = A.Equator(body, start, obs, true, true);
    up = A.Horizon(start, obs, eq.ra, eq.dec, "normal").altitude > 0;
  }
  let total = 0;
  let cursor = start;
  for (let i = 0; i < 6; i++) {
    if (up) {
      const set = next(-1, cursor);
      total += (set ?? end) - cursor;
      if (!set) break;
      cursor = set;
    } else {
      const rise = next(+1, cursor);
      if (!rise) break;
      cursor = rise;
    }
    up = !up;
  }
  return total;
}

/* Where the body is in the observer's sky at this moment: azimuth measured
   clockwise from true north (90° = east), and altitude above the horizon
   (negative = below it), including atmospheric refraction, as the eye sees it. */
function horizontalAt(body, date) {
  const obs = new A.Observer(state.lat, state.lon, 0);
  const eq = A.Equator(body, date, obs, true, true);
  const hor = A.Horizon(date, obs, eq.ra, eq.dec, "normal");
  return { az: hor.azimuth, alt: hor.altitude };
}

/* The highest the body gets during the calendar day at the location (local
   midnight to midnight). That is its culmination (crossing the meridian), or,
   when it doesn't culminate that day (about once a month for the Moon), the
   higher of the day's two ends. */
function maxAltitudeOn(body, day) {
  const obs = new A.Observer(state.lat, state.lon, 0);
  const start = instantAt(day);
  const end = instantAt(addDays(day, 1));
  const candidates = [start, new Date(end - 1000)].map((d) => ({ date: d, alt: horizontalAt(body, d).alt }));
  let from = start;
  for (let i = 0; i < 3; i++) {
    const c = A.SearchHourAngle(body, obs, 0, from, +1);
    if (c.time.date >= end) break;
    candidates.push({ date: c.time.date, alt: horizontalAt(body, c.time.date).alt });
    from = c.time.AddDays(0.01).date;
  }
  return candidates.reduce((a, b) => (b.alt > a.alt ? b : a));
}

const fmtTime = (d) =>
  d.toLocaleTimeString(locale(), { timeZone: state.tz, hour: "2-digit", minute: "2-digit", hour12: false });

function renderAltAz(body, date, day, azId, altId, maxId) {
  if (state.lat === null) {
    $(azId).textContent = $(altId).textContent = $(maxId).textContent = t("needsLocation");
    return;
  }
  const { az, alt } = horizontalAt(body, date);
  $(azId).textContent = `${az.toFixed(1)}° ${t("compass")[Math.round(az / 45) % 8]}`;
  $(altId).textContent = `${alt.toFixed(1)}°`;
  if (alt < 0) $(altId).append(Object.assign(document.createElement("small"), { textContent: t("belowHorizon") }));
  const max = maxAltitudeOn(body, day);
  $(maxId).textContent = `${max.alt.toFixed(1)}°`;
  $(maxId).append(Object.assign(document.createElement("small"), { textContent: `${t("atTime")} ${fmtTime(max.date)}` }));
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
  applyFont();
  // Keys with a "…Set" variant (azimuth, altitude, time) switch to it while a time is chosen.
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(state.fixedTime && T[state.lang][`${key}Set`] ? `${key}Set` : key);
  });
  $("clock").title = t("setTime");
  $("clock").classList.toggle("is-set", Boolean(state.fixedTime));
  $("nowBtn").hidden = !state.fixedTime;
  $("langBtn").textContent = state.lang === "es" ? "EN" : "ES";
  const dark = state.theme === "dark";
  $("themeBtn").textContent = dark ? "☀︎" : "☾︎";
  $("themeBtn").title = dark ? t("themeLight") : t("themeDark");
  $("colorBtn").title = t("customize");
  renderLayout();
  $("todayBtn").hidden = sameDay(state.selected, todayCal());
  applyColors();
  $("cityInput").placeholder = t("cityPlaceholder");
}

// The picked font replaces both the body and the heading font.
function applyFont() {
  const font = FONTS[state.font];
  const root = document.documentElement.style;
  if (font.google && !document.querySelector(`link[data-font="${state.font}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
    link.dataset.font = state.font;
    link.addEventListener("load", () => refitFont(state.font));
    document.head.append(link);
  }
  if (font.name) {
    const family = `"${font.name}", system-ui, sans-serif`;
    root.setProperty("--font-body", family);
    root.setProperty("--font-display", family);
  } else {
    root.removeProperty("--font-body");
    root.removeProperty("--font-display");
  }
  $("fontSeg").querySelectorAll("button").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.font === state.font));
  });
  const pick = $("fontPick");
  const more = t("fontMore");
  if (pick.options[0]?.text !== more) { // first time, or the language changed
    pick.replaceChildren(new Option(more, ""), ...MORE_FONTS.map((k) => new Option(FONTS[k].label || FONTS[k].name, k)));
    pick.options[0].hidden = true;
  }
  pick.value = MORE_FONTS.includes(state.font) ? state.font : "";
  pick.classList.toggle("on", Boolean(pick.value));
}

/* Picked colours override the theme's, in both light and dark. Text on the
   primary colour turns dark when the colour is light, so it stays readable. */
function applyColors() {
  const root = document.documentElement.style;
  const { primary, secondary } = state.colors;
  if (primary) {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(primary.slice(i, i + 2), 16));
    root.setProperty("--accent", primary);
    root.setProperty("--accent-ink", 0.299 * r + 0.587 * g + 0.114 * b > 160 ? "#1d1a17" : "#ffffff");
  } else {
    root.removeProperty("--accent");
    root.removeProperty("--accent-ink");
  }
  if (secondary) root.setProperty("--sun", secondary);
  else root.removeProperty("--sun");
  const css = getComputedStyle(document.documentElement);
  document.querySelector('meta[name="theme-color"]').content = css.getPropertyValue("--accent").trim();
  $("primaryPick").value = css.getPropertyValue("--accent").trim();
  $("secondaryPick").value = css.getPropertyValue("--sun").trim();
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

// The location's local time, or the chosen time, which stays put.
function renderClock(now) {
  if (state.fixedTime) {
    $("clock").textContent = `${pad(state.fixedTime.h)}:${pad(state.fixedTime.mi)}`;
    return;
  }
  $("clock").textContent = now.toLocaleTimeString(locale(), {
    timeZone: state.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
}

function renderLocation() {
  const el = $("location");
  if (state.lat !== null) {
    const ns = state.lat >= 0 ? "N" : "S";
    const ew = state.lon >= 0 ? "E" : "W";
    const coords = `${Math.abs(state.lat).toFixed(2)}° ${ns}, ${Math.abs(state.lon).toFixed(2)}° ${ew}`;
    // One line each: coordinates, town/province/country.
    el.replaceChildren(...[coords, state.place].filter(Boolean).map((text) => {
      const line = document.createElement("div");
      line.textContent = text;
      if (text === state.place) line.className = "place";
      return line;
    }));
    el.append(locPanelButton("loc-btn", t("changeLocation")));
  } else if (state.locStatus === "locating") {
    el.textContent = t("locating");
  } else {
    el.replaceChildren(t("noLocation"), document.createElement("br"),
      locPanelButton("loc-btn", t("chooseLocation")));
  }
  renderLocHelp();
  fitPlace();
}

// Keep "town, province, country" on one line: beside the date when it fits,
// otherwise below it across the full width, and wrap only if even that is too narrow.
function fitPlace() {
  const today = document.querySelector(".today");
  const line = $("location").querySelector(".place");
  today.classList.remove("loc-wide");
  if (!line) return;
  line.classList.remove("wrap");
  const overflowing = () => line.scrollWidth > line.clientWidth + 1;
  if (overflowing()) today.classList.add("loc-wide");
  if (overflowing()) line.classList.add("wrap");
}

window.addEventListener("resize", fitPlace);
document.fonts?.ready.then(fitPlace);

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
  renderAltAz("Sun", date, state.selected, "sunAz", "sunAlt", "sunMax");

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
  renderAltAz("Moon", date, state.selected, "moonAz", "moonAlt", "moonMax");

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

// Keep the selected day centred when the strip changes width.
function centerStrip() {
  const i = items.findIndex((el) => sameDay(itemDate(el), state.selected));
  if (i >= 0) strip.scrollLeft = targetLeft(items[i]);
}
window.addEventListener("resize", centerStrip);

/* ---------- layout: modules on a grid the person arranges ---------- */

/* The saved layout: how many columns, and each module's place, width in
   columns and whether it's hidden. The window decides how many columns
   actually fit (one on a phone); wider modules shrink to fit them. */
const MODULE_NAMES = { today: "modToday", days: "modDays", sun: "sun", moon: "moon", planets: "planets" };
const DEFAULT_LAYOUT = {
  cols: 2,
  mods: [
    { id: "today", span: 2 }, { id: "days", span: 2 },
    { id: "sun", span: 1 }, { id: "moon", span: 1 }, { id: "planets", span: 2 },
  ],
};
const COLUMN_WIDTH = 400; // px per column on a wide window
const MIN_COLUMN = 320; // narrowest a column may get before one is dropped

const board = $("board");
let editingLayout = false;

const layout = (() => {
  let saved = null;
  try {
    saved = JSON.parse(store.get("layout"));
  } catch {}
  const base = structuredClone(DEFAULT_LAYOUT);
  if (!saved || !Array.isArray(saved.mods)) return base;
  // Keep known modules in their saved order; add any new ones at the end.
  const mods = saved.mods.filter((m) => MODULE_NAMES[m?.id])
    .map((m) => ({ id: m.id, span: Math.min(2, Math.max(1, m.span | 0)), hidden: Boolean(m.hidden) }));
  for (const m of base.mods) if (!mods.some((x) => x.id === m.id)) mods.push(m);
  // Up to 2 columns (a saved 3 from an earlier version becomes 2).
  return { cols: saved.cols === 1 ? 1 : 2, mods };
})();

const saveLayout = () => store.set("layout", JSON.stringify(layout));
const modEl = (id) => board.querySelector(`.mod[data-mod="${id}"]`);
const fittingCols = () => Math.max(1, Math.floor((window.innerWidth - 32) / MIN_COLUMN));
const usedCols = () => (IS_PHONE ? 1 : Math.min(layout.cols, fittingCols()));

function renderLayout() {
  const cols = usedCols();
  document.querySelector(".page").style.maxWidth = cols === 1 ? "" : `${cols * COLUMN_WIDTH}px`;
  board.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  board.classList.toggle("editing", editingLayout);
  board.classList.toggle("one-col", cols === 1);

  // Reorder only when needed: moving the day strip in the page resets its scroll.
  const order = layout.mods.map((m) => m.id);
  if ([...board.children].some((el, i) => el.dataset.mod !== order[i])) {
    for (const id of order) board.append(modEl(id));
  }
  for (const m of layout.mods) {
    const el = modEl(m.id);
    el.style.gridColumn = `span ${Math.min(m.span, cols)}`;
    el.classList.toggle("is-hidden", Boolean(m.hidden));
    const tools = el.querySelector(".mod-tools");
    tools.querySelector(".mod-name").textContent = t(MODULE_NAMES[m.id]);
    tools.querySelector(".mod-span").textContent = `${Math.min(m.span, cols)}/${cols}`;
    const [prev, next] = cols === 1 ? ["▲", "▼"] : ["◀", "▶"];
    Object.assign(tools.querySelector('[data-act="prev"]'), { textContent: prev, title: t("moveEarlier") });
    Object.assign(tools.querySelector('[data-act="next"]'), { textContent: next, title: t("moveLater") });
    tools.querySelector('[data-act="narrow"]').title = t("narrower");
    tools.querySelector('[data-act="wide"]').title = t("wider");
    tools.querySelector('[data-act="hide"]').textContent = m.hidden ? t("showMod") : t("hideMod");
  }

  $("colsSeg").querySelectorAll("button").forEach((b) => {
    b.setAttribute("aria-pressed", String(Number(b.dataset.cols) === layout.cols));
  });
  $("colsRow").hidden = IS_PHONE;
  $("colsNote").hidden = IS_PHONE || layout.cols <= fittingCols();
  $("colsNote").textContent = t("colsNote")(fittingCols());
  $("layoutEdit").textContent = editingLayout ? t("done") : t("editLayout");
  $("layoutDone").hidden = !editingLayout;
}

// After the layout changes: save it, redraw, and re-fit what depends on widths.
function layoutChanged() {
  saveLayout();
  renderLayout();
  fitPlace();
  centerStrip();
}

// A toolbar on each module, shown only while editing.
for (const el of board.querySelectorAll(".mod")) {
  const tools = document.createElement("div");
  tools.className = "mod-tools";
  tools.innerHTML = `<span class="mod-grip" aria-hidden="true">⠿</span><span class="mod-name"></span>
    <button type="button" data-act="prev"></button><button type="button" data-act="next"></button>
    <button type="button" data-act="narrow">−</button><span class="mod-span"></span>
    <button type="button" data-act="wide">+</button><button type="button" data-act="hide"></button>`;
  el.prepend(tools);
}

board.addEventListener("click", (e) => {
  const button = e.target.closest(".mod-tools button");
  if (!button) return;
  const i = layout.mods.findIndex((m) => m.id === button.closest(".mod").dataset.mod);
  const m = layout.mods[i];
  const swap = (j) => {
    if (j < 0 || j >= layout.mods.length) return;
    [layout.mods[i], layout.mods[j]] = [layout.mods[j], layout.mods[i]];
  };
  const act = button.dataset.act;
  if (act === "prev") swap(i - 1);
  else if (act === "next") swap(i + 1);
  else if (act === "narrow") m.span = Math.max(1, Math.min(m.span, usedCols()) - 1);
  else if (act === "wide") m.span = Math.min(usedCols(), m.span + 1);
  else if (act === "hide") m.hidden = !m.hidden;
  layoutChanged();
});

/* Drag a module by its bar (anywhere but its buttons). Nothing moves until it's
   dropped: a label follows the pointer, and a line on the module underneath
   shows whether it will land before or after it (left/right side when it sits
   in a row with others, top/bottom otherwise). Near the window's top or bottom
   edge the page scrolls. Esc cancels. */
board.addEventListener("pointerdown", (e) => {
  const bar = e.target.closest(".mod-tools");
  if (!bar || !editingLayout || e.button !== 0 || e.target.closest("button")) return;
  e.preventDefault();
  const el = bar.closest(".mod");
  const ghost = document.createElement("div");
  ghost.className = "drag-ghost";
  ghost.textContent = bar.querySelector(".mod-name").textContent;
  document.body.append(ghost);
  el.classList.add("dragging");
  board.classList.add("is-dragging");
  try {
    bar.setPointerCapture(e.pointerId);
  } catch {}

  let target = null; // { el, before }
  let lastY = e.clientY;
  let moved = false;
  const clearMark = () => target?.el.removeAttribute("data-drop");
  const place = (x, y) => {
    ghost.style.transform = `translate(${x + 14}px, ${y + 10}px)`;
    const over = document.elementFromPoint(x, y)?.closest(".mod");
    clearMark();
    target = null;
    if (!over || over === el || over.parentElement !== board) return;
    const r = over.getBoundingClientRect();
    const vertical = usedCols() === 1 || r.width > board.clientWidth * 0.9;
    const before = vertical ? y < r.top + r.height / 2 : x < r.left + r.width / 2;
    over.dataset.drop = `${before ? "before" : "after"}-${vertical ? "y" : "x"}`;
    target = { el: over, before };
  };
  const move = (ev) => {
    lastY = ev.clientY;
    moved = true;
    place(ev.clientX, ev.clientY);
  };
  let raf = requestAnimationFrame(function autoScroll() {
    const edge = 70;
    const speed = lastY < edge ? lastY - edge : lastY > innerHeight - edge ? lastY - (innerHeight - edge) : 0;
    if (speed && moved) window.scrollBy(0, speed / 3);
    raf = requestAnimationFrame(autoScroll);
  });
  const finish = (drop) => () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onCancel);
    window.removeEventListener("keydown", onKey);
    ghost.remove();
    clearMark();
    el.classList.remove("dragging");
    board.classList.remove("is-dragging");
    if (!drop || !target) return;
    const i = layout.mods.findIndex((m) => m.id === el.dataset.mod);
    const [moved] = layout.mods.splice(i, 1);
    const j = layout.mods.findIndex((m) => m.id === target.el.dataset.mod);
    layout.mods.splice(target.before ? j : j + 1, 0, moved);
    layoutChanged();
  };
  const onUp = finish(true);
  const onCancel = finish(false);
  const onKey = (ev) => {
    if (ev.key === "Escape") onCancel();
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onCancel);
  window.addEventListener("keydown", onKey);
  place(e.clientX, e.clientY);
});

$("colsSeg").addEventListener("click", (e) => {
  const cols = Number(e.target.closest("button")?.dataset.cols);
  if (!cols) return;
  layout.cols = cols;
  layoutChanged();
});

const setEditing = (on) => {
  editingLayout = on;
  if (on) $("colorPanel").hidden = true;
  renderLayout();
};
$("layoutEdit").addEventListener("click", () => setEditing(!editingLayout));
$("layoutDone").addEventListener("click", () => setEditing(false));

$("layoutReset").addEventListener("click", () => {
  Object.assign(layout, structuredClone(DEFAULT_LAYOUT));
  layoutChanged();
});

window.addEventListener("resize", () => {
  renderLayout();
  fitPlace();
  centerStrip();
});

/* ---------- controls ---------- */

$("themeBtn").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  store.set("theme", state.theme);
  renderStatic();
});

$("colorBtn").addEventListener("click", () => {
  $("colorPanel").hidden = !$("colorPanel").hidden;
});
$("colorClose").addEventListener("click", () => {
  $("colorPanel").hidden = true;
});

const pickColor = (key) => (e) => {
  state.colors[key] = e.target.value;
  store.set("colors", JSON.stringify(state.colors));
  applyColors();
};
$("primaryPick").addEventListener("input", pickColor("primary"));
$("secondaryPick").addEventListener("input", pickColor("secondary"));

$("colorReset").addEventListener("click", () => {
  state.colors = {};
  store.set("colors", "{}");
  applyColors();
});

// Text widths change with the font: re-fit now, and again once it has loaded.
function refitFont(font) {
  const refit = () => { fitPlace(); centerStrip(); };
  refit();
  document.fonts?.load(`600 1em "${FONTS[font].name || "Fraunces"}"`).then(refit, () => {});
}

function pickFont(font) {
  state.font = font;
  store.set("font", font);
  renderStatic();
  refitFont(font);
}
$("fontSeg").addEventListener("click", (e) => {
  const font = e.target.closest("button")?.dataset.font;
  if (font) pickFont(font);
});
$("fontPick").addEventListener("change", (e) => {
  if (e.target.value) pickFont(e.target.value);
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

/* Picking a time stops the clock there and shows the sky at that time; the
   button below it goes back to following the current time. */
function setFixedTime(fixed) {
  state.fixedTime = fixed;
  renderSelection();
  renderClock(new Date());
}

// Hour and minute dropdowns, always 24 h (the browser's time field follows the
// device's AM/PM setting).
const fillOptions = (select, count) =>
  select.replaceChildren(...Array.from({ length: count }, (_, i) => new Option(pad(i), i)));
fillOptions($("pickHour"), 24);
fillOptions($("pickMinute"), 60);

$("clock").addEventListener("click", () => {
  const z = state.fixedTime ?? zoned(new Date());
  $("pickHour").value = z.h;
  $("pickMinute").value = z.mi;
  $("clock").hidden = true;
  $("timePick").hidden = false;
  $("pickHour").focus();
});

$("timePick").addEventListener("change", () => {
  setFixedTime({ h: Number($("pickHour").value), mi: Number($("pickMinute").value) });
});

$("timePick").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === "Escape") document.activeElement.blur();
});

// Close once focus leaves both dropdowns.
$("timePick").addEventListener("focusout", (e) => {
  if ($("timePick").contains(e.relatedTarget)) return;
  $("timePick").hidden = true;
  $("clock").hidden = false;
});

$("nowBtn").addEventListener("click", () => setFixedTime(null));

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

// `name` is empty for typed coordinates; the town is then looked up afterwards.
function setManualLocation(lat, lon, name = "") {
  state.lat = lat;
  state.lon = lon;
  state.locStatus = "manual";
  state.place = name;
  updateZone();
  store.set("loc", JSON.stringify({ lat, lon, manual: true }));
  if (name) store.set("place2", JSON.stringify({ lat, lon, lang: state.lang, name }));
  $("locPanel").hidden = true;
  $("cityResults").replaceChildren();
  $("cityInput").value = "";
  renderAll();
  if (!name) lookupPlace();
}

/* Coordinates typed by hand: "-35.12, -60.49", "35.12 S, 60.49 W" (O = oeste),
   or degrees/minutes/seconds like 35°07'12"S 60°29'24"W. Latitude first,
   unless the letters say otherwise. Returns null when the text isn't coordinates. */
function parseCoords(text) {
  const part = String.raw`([-+]?\d+(?:[.,]\d+)?)\s*°?\s*(?:(\d+(?:[.,]\d+)?)\s*['′’]\s*)?` +
    String.raw`(?:(\d+(?:[.,]\d+)?)\s*(?:["″”]|'')\s*)?([NSEWO])?`;
  const m = text.trim().match(new RegExp(`^${part}\\s*[,;\\s]\\s*${part}$`, "i"));
  if (!m) return null;
  const value = (deg, min, sec, letter) => {
    const num = (x) => Number((x || "0").replace(",", "."));
    let v = Math.abs(num(deg)) + num(min) / 60 + num(sec) / 3600;
    if (deg.startsWith("-") || /[SWO]/i.test(letter || "")) v = -v;
    return v;
  };
  let lat = value(m[1], m[2], m[3], m[4]);
  let lon = value(m[5], m[6], m[7], m[8]);
  if (/[EWO]/i.test(m[4] || "") || /[NS]/i.test(m[8] || "")) [lat, lon] = [lon, lat];
  return Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? { lat, lon } : null;
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
  const coords = parseCoords(q);
  if (coords) {
    setManualLocation(coords.lat, coords.lon);
    return;
  }
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
// Installable app (Android: Chrome ⋮ → Install app) that also opens offline.
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
// A city picked by hand stays until the person asks for GPS again.
if (savedLoc?.manual) state.locStatus = "manual";
else locate();

/* Install bar: shown only when the browser says the app can be installed (Chrome
   and Edge on Android and computers; never once installed). × hides it until the
   next visit. */
let installPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // use our bar instead of Chrome's own pop-up
  installPrompt = e;
  $("installBar").hidden = false;
});
$("installBtn").addEventListener("click", async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  $("installBar").hidden = true;
});
$("installClose").addEventListener("click", () => {
  $("installBar").hidden = true;
});
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  $("installBar").hidden = true;
});

// Coming back to the app (it may have moved with the phone): check GPS again.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && state.locStatus !== "manual") locate();
});

let lastMinute = new Date().getMinutes();
let lastDay = todayCal();
setInterval(() => {
  const now = new Date();
  if (!state.fixedTime) renderClock(now);
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
  if (!state.fixedTime) renderSky(viewDate(now));
}, 1000);
