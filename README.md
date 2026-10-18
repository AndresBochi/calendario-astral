# Calendario Astral

An astral calendar for any day and any place: where the Sun, the Moon and the planets are in the
zodiac, the Moon's phase, its ascending and descending periods, its distance cycle, and rise and
set times.

**Open it:** https://andresbochi.github.io/calendario-astral/ (works in Chrome, Safari, Edge and
Firefox, on phones and computers). On Android you can use Chrome's **⋮ → Add to Home screen** to
open it like an app.

The app is in Spanish by default; the **EN / ES** button switches language. Below, each item is
listed with its Spanish label and, in brackets, its English label.

---

## How to read the page

Everything on the page is for **the selected day, at the current local time of the selected
place**. Today and your own location are selected when you open it.

### Header

- **‹ Octubre ›** and **‹ 2026 ›**: go back or forward one month or one year. If the day doesn't
  exist in the new month, it moves to the month's last day (31 Jan → 28/29 Feb).
- **Hoy** (Today): appears when you are on another day; takes you back to today.
- **EN / ES**: language. **☾ / ☀**: dark or light theme. Both are remembered on your device.

### Date and place

- **Weekday, big day number, dd/mm/yyyy**: the selected day. Tap the dd/mm/yyyy pill to jump to
  any date with a calendar.
- **Hora** (Time): the current time **at the selected place**. If you pick a city in another
  country, it shows that city's time, and "today" can be a different date there.
- **Location lines**: the coordinates (e.g. `35.12° S, 60.49° W`) and the town, province and
  country (e.g. `Bragado, Buenos Aires, Argentina`). The town name needs internet; the rest
  doesn't.
- **Cambiar ubicación** (Change location): opens the location panel (see
  [Setting your location](#setting-your-location)).

### Day strip

The row of days under the date, each with a small drawing of that day's Moon phase.

- Swipe it (or drag it with the mouse, or use the mouse wheel). When you let go, the nearest day
  glides to the centre and becomes the selected day. You can also tap a day.
- The **filled** day is the selected one; the **outlined** day is today.
- On the 1st of each month the weekday is replaced by the month's short name, so you can see
  where months change.

### Sol (Sun)

| Row | Example | What it tells you |
|---|---|---|
| **Sign** (big, with its symbol) | ♎ Libra | The zodiac sign the Sun is in. |
| **Grado del signo** (Degree in sign) | 25°15′ | How far the Sun has gone into that sign. Each sign spans 30°, so this goes from 0°00′ to 29°59′ (degrees and arcminutes; 60′ = 1°). The Sun moves about 1° a day, so 25°15′ means it will enter the next sign in about 5 days. |
| **Grado eclíptico total** (Total ecliptic degree) | 205.25° | The same position measured around the whole zodiac circle (0°–360°), starting at 0° Aries. Every 30° is one sign; see the [table below](#signs-and-their-degrees). 205.25° = 180° (start of Libra) + 25.25°. |
| **Salida del sol** (Sunrise) | 06:15 | When the Sun rises at the selected place on the selected day, in local time. |
| **Puesta del sol** (Sunset) | 19:19 | When it sets. Near the poles, "no ocurre este día" (none this day) means the Sun doesn't rise or doesn't set that day. |
| *gray line under sunset* | 13 h 04 min sobre el horizonte | Hours of daylight: the total time the Sun is above the horizon that day, from local midnight to midnight. |

### Luna (Moon)

| Row | Example | What it tells you |
|---|---|---|
| **Phase** (drawing, name, %) | Cuarto creciente, 49.6% iluminada | The Moon's phase and how much of its visible face is lit. The drawing is turned the way you see it from your hemisphere (in the south, a waxing Moon is lit on the left). Phases in order: Luna nueva (New Moon) → Creciente (Waxing Crescent) → Cuarto creciente (First Quarter) → Gibosa creciente (Waxing Gibbous) → Luna llena (Full Moon) → Gibosa menguante (Waning Gibbous) → Cuarto menguante (Last Quarter) → Menguante (Waning Crescent). A full cycle takes about 29.5 days. |
| **Signo** (Sign) | ♑ Capricornio 24°29′ | The zodiac sign the Moon is in, and how far into it (0°–29°59′). The Moon moves about 13° a day, so it changes sign roughly every 2½ days. |
| **Grado eclíptico total** (Total ecliptic degree) | 294.49° | The Moon's position around the whole 360° zodiac circle, like the Sun's row above. |
| **Ascenso** (Ascent) | Desciende ↓ — hacia el norte hasta el jueves 29 de octubre | Whether the Moon is **ascending** or **descending** in the biodynamic sense, seen from your exact location. See [Ascending and descending Moon](#ascending-and-descending-moon). |
| **Anomalístico** (Anomalistic) | Hacia el perigeo — faltan 10 días | Whether the Moon is getting closer to the Earth or farther away, and how many whole days are left until the turning point. See [Perigee and apogee](#perigee-and-apogee). |
| **Salida de la luna** (Moonrise) | 11:42 | When the Moon rises at the selected place that day, in local time. |
| **Puesta de la luna** (Moonset) | 01:48 | When it sets. The Moon rises about 50 minutes later each day, so about once a month there's a day with no moonrise or no moonset; the row then says "no ocurre este día" (none this day). A moonset can come before the moonrise on the same day: that's the Moon that rose the day before. |
| *gray line under moonset* | 14 h 10 min sobre el horizonte | The total time the Moon is above the horizon that day, from local midnight to midnight. When it sets in the early morning and rises again later, both stretches are added (e.g. 00:00–01:59 plus 11:49–24:00). |

#### Ascending and descending Moon

Every day the Moon reaches a highest point in your sky (its *culmination*), just like the Sun at
noon. Over about two weeks that highest point gets **higher each day**: the Moon is **ascending**
(Asciende ↑). Then, for about two weeks, it gets **lower each day**: the Moon is **descending**
(Desciende ↓). One full ascending + descending cycle takes about 27.3 days.

It's a small version of the Sun's year: the Sun ascends from the winter solstice to the summer
solstice and descends the rest of the year. Biodynamic and planting calendars use these periods.

- **"hasta el jueves 29 de octubre"** (until Thursday 29 October): the day the current period
  ends, when the Moon has its highest (or lowest) culmination and turns around.
- **"hacia el norte" / "hacia el sur"** (moving north / south): the direction the Moon is moving
  in the sky, relative to the celestial equator. In the **southern hemisphere**, moving north means
  **descending** (the arcs get lower); in the **northern hemisphere**, moving north means
  **ascending**.
- This is **not** the same as waxing and waning: the phase depends on the Sun's light, ascending
  and descending on the height of the Moon's path. They follow different cycles.
- It's calculated for your exact location, so it needs your location (see below).

#### Perigee and apogee

The Moon's orbit is an oval, not a circle. Once a month it passes its **perigee** (closest to the
Earth, about 356,000–370,000 km) and its **apogee** (farthest, about 404,000–406,000 km). Going
from one perigee to the next takes about 27.5 days (the *anomalistic month*).

- **Hacia el perigeo** (Heading to perigee): the Moon is getting closer.
  **Hacia el apogeo** (Heading to apogee): it's getting farther away.
- **"faltan 10 días"** (10 days left): whole days until it reaches that point. In the last day it
  counts in hours ("faltan 5 h").

### Planetas (Planets)

One compact line per planet: symbol, name, the sign it's in, and how far into that sign.

- Example: `♂ Marte ♏ 12°40′` means Mars is 12°40′ into Scorpio.
- **℞** after a planet means it is **retrograde**: seen from the Earth, it appears to move
  backwards through the zodiac for a while. (The Sun and the Moon are never retrograde.)

| Symbol | Planet | Symbol | Planet |
|---|---|---|---|
| ☿ | Mercurio (Mercury) | ♃ | Júpiter (Jupiter) |
| ♀ | Venus | ♄ | Saturno (Saturn) |
| ♂ | Marte (Mars) | ♅ | Urano (Uranus) |
| | | ♆ | Neptuno (Neptune) |
| | | ♇ | Plutón (Pluto) |

### Signs and their degrees

The zodiac circle is 360°, split into twelve signs of 30° each. "Grado eclíptico total" tells you
the position on this circle:

| Total degree | Sign | Total degree | Sign |
|---|---|---|---|
| 0°–30° | ♈ Aries | 180°–210° | ♎ Libra |
| 30°–60° | ♉ Tauro (Taurus) | 210°–240° | ♏ Escorpio (Scorpio) |
| 60°–90° | ♊ Géminis (Gemini) | 240°–270° | ♐ Sagitario (Sagittarius) |
| 90°–120° | ♋ Cáncer (Cancer) | 270°–300° | ♑ Capricornio (Capricorn) |
| 120°–150° | ♌ Leo | 300°–330° | ♒ Acuario (Aquarius) |
| 150°–180° | ♍ Virgo | 330°–360° | ♓ Piscis (Pisces) |

The app uses the **tropical zodiac** (the usual one in Western astrology): 0° Aries is where the
Sun is at the March equinox. Printed biodynamic calendars that use the star constellations
(sidereal) are shifted by about 24°, so their dates for signs differ by a day or two for the Moon.

---

## Setting your location

The rise and set times and the ascending/descending Moon depend on where you are, so they need a
location. Everything else works without one.

- **GPS:** the app asks for your location when it opens. Allow it, and it's remembered on your
  device for next time.
- **Search for a town:** tap **Cambiar ubicación** (or **Elegir ubicación**), type the town and
  tap **Buscar**, then pick it from the list. Needs internet.
- **Type coordinates** in the same box. These work offline. Accepted formats:
  - `-35.12, -60.49` (as Google Maps copies them; latitude first)
  - `35.12 S, 60.49 W` (O for oeste also works)
  - `35°07'12"S 60°29'24"W`
- A town or coordinates picked by hand stay selected until you tap **Usar mi ubicación (GPS)**.
- Picking a place in another time zone switches the clock, "today" and all times to that place's
  local time.

**If location never gets asked on iPhone:** website location is switched off in the iPhone's
settings. Go to *Ajustes › Privacidad y seguridad › Localización* (Settings › Privacy & Security
› Location Services), turn it on, and set *Sitios web de Safari* (Safari Websites), or *Chrome*
if you use Chrome, to *Cuando se use la app* (While Using the App). Then reload the page. Or just
search for your town.

**On Android or a computer:** allow location from the icon next to the address bar and reload.

---

## About the calculations

- All positions are calculated on the device with
  [astronomy-engine](https://github.com/cosinekitty/astronomy) (MIT licence), accurate to
  about one minute of arc (1′), far finer than the degree-and-minute values shown. No internet is needed for them.
- Sign positions are **geocentric** (as seen from the centre of the Earth), which is the
  standard in astrology. The ascending/descending Moon and the rise/set times are calculated
  from your exact location.
- The time zone is found from the coordinates on the device with
  [tz-lookup](https://github.com/photostructure/tz-lookup) (CC0).
- Town names and the town search come from [OpenStreetMap](https://www.openstreetmap.org/)
  (Nominatim). That's the only part that needs internet, and it receives the coordinates. A
  found name is saved on the device and looked up again only after moving about 2 km.

---

## For developers

The app is plain HTML, CSS and JavaScript (`index.html`, `styles.css`, `app.js`), with the two
libraries saved in `vendor/`. There is no build step.

### Run locally

Serve the folder over `localhost` (geolocation needs a secure context), e.g.

```
python -m http.server 8080 --bind 127.0.0.1
```

then open http://localhost:8080.

### Publish changes

Commit and push to `main`; GitHub Pages redeploys in about a minute. Bump the `?v=` number on
`styles.css` and `app.js` in `index.html` with every change, so browsers don't keep running the
old cached files.

```
git add -A
git commit -m "Describe the change"
git push
```

### Next step: Android

Wrap this folder with [Capacitor](https://capacitorjs.com/) (`npx cap add android`) to get an
Android app without rewriting it.
