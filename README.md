# Calendario Astral — web prototype

Real-time Sun, Moon and planet positions in a calendar-page layout.

## Run

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
- **Moon**: phase name + % illuminated, sign and degree, moonrise/moonset, ascending/descending
  (declination trend relative to the celestial equator), heading to perigee or apogee,
  current distance
- **Planets** (compact): sign, degree, ℞ when retrograde
- Light/dark theme toggle and ES/EN toggle (both remembered)

## Notes

- Calculations run on-device with [astronomy-engine](https://github.com/cosinekitty/astronomy)
  (MIT, vendored in `vendor/`), so no internet connection is needed. Only the web fonts
  load from the internet, and the app falls back to system fonts without them.
- Zodiac is tropical (ecliptic of date), with geocentric positions.
- Location is used for rise/set times, the hemisphere orientation of the moon icon and the displayed coordinates.

## Next step: Android

Wrap this folder with [Capacitor](https://capacitorjs.com/) (`npx cap add android`) to get an APK without rewriting the app.
