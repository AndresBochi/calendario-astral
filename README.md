# Calendario Astral — web prototype

Real-time Sun, Moon and planet positions in a calendar-page layout.

**Live:** https://andresbochi.github.io/calendario-astral/

## Publish changes

Commit and push to `main`; GitHub Pages redeploys in about a minute.
Bump the `?v=` number on `styles.css` and `app.js` in `index.html` with every change,
so browsers don't keep running the old cached files.

```
git add -A
git commit -m "Describe the change"
git push
```

## Run locally

Serve the folder over `localhost` (geolocation needs a secure context), e.g.

```
python -m http.server 8080 --bind 127.0.0.1
```

then open http://localhost:8080.

## What it shows

- Date (day/month/year), weekday and live clock
- Date navigation: ‹ › arrows for month and year, a date picker (tap the dd/mm/yyyy pill),
  a "Hoy/Today" button, and a swipeable day strip with daily moon phases that snaps the
  chosen day to the center with an eased animation
- Positions are for the selected day at the current wall-clock time
- **Sun**: sign, degree within the sign, total ecliptic longitude, sunrise/sunset
- **Moon**: phase name + % illuminated, sign and degree, moonrise/moonset, ascending/descending in the
  biodynamic sense, seen from your exact location (ascending = each day it culminates higher
  in your sky, like the Sun between the winter and summer solstices) and the day it ends;
  heading to perigee or apogee, with days left until it
- **Planets** (compact): sign, degree, ℞ when retrograde
- Light/dark theme toggle and ES/EN toggle (both remembered)

## Notes

- Calculations run on-device with [astronomy-engine](https://github.com/cosinekitty/astronomy)
  (MIT, vendored in `vendor/`), so no internet connection is needed. Only the web fonts
  load from the internet, and the app falls back to system fonts without them.
- The town name in the location line (e.g. "Bragado, Buenos Aires, Argentina") comes from
  OpenStreetMap's Nominatim service, which needs internet and receives the coordinates.
  It's cached on the device and looked up again only after moving about 2 km.
- Zodiac is tropical (ecliptic of date), with geocentric positions.
- Dates and times follow the location's time zone, found offline from the coordinates with
  [tz-lookup](https://github.com/photostructure/tz-lookup) (CC0, vendored in `vendor/`).
  Picking another city switches the clock, "today", the day strip and the rise/set times to
  that place's local time.
- Your location is needed for rise/set times and ascending/descending. The last known
  location is remembered on the device. If the browser refuses location (common on iPhone,
  where Safari/Chrome website location is switched off in iOS Settings and the page is never
  asked), a panel explains how to turn it on for that device and offers a city search
  (OpenStreetMap) instead. A city picked by hand stays until "Use my location (GPS)" is tapped. Without it, the time zone only decides which side of the moon icons is lit.

## Next step: Android

Wrap this folder with [Capacitor](https://capacitorjs.com/) (`npx cap add android`) to get an APK without rewriting the app.
