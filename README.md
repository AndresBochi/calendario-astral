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
  biodynamic sense for your hemisphere (ascending = its daily arc is getting higher, like the
  Sun between the winter and summer solstices), plus its north/south motion, declination and
  peak altitude that day; its solar-year equivalent (the date the Sun stands where the Moon is
  now, and that season where you are); heading to perigee or apogee, current distance
- **Planets** (compact): sign, degree, ℞ when retrograde
- Light/dark theme toggle and ES/EN toggle (both remembered)

## Notes

- Calculations run on-device with [astronomy-engine](https://github.com/cosinekitty/astronomy)
  (MIT, vendored in `vendor/`), so no internet connection is needed. Only the web fonts
  load from the internet, and the app falls back to system fonts without them.
- Zodiac is tropical (ecliptic of date), with geocentric positions.
- Location is used for rise/set times, the hemisphere (ascending/descending, seasons, moon icon
  orientation) and the displayed coordinates. Without it, the hemisphere is guessed from the
  device time zone.

## Next step: Android

Wrap this folder with [Capacitor](https://capacitorjs.com/) (`npx cap add android`) to get an APK without rewriting the app.
