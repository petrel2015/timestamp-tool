[English](README.md) | [中文](README.zh-CN.md)

# Timestamp Tool

![pure frontend](https://img.shields.io/badge/pure_frontend-no_build%2C_no_framework-111111?style=flat-square)
![license](https://img.shields.io/badge/license-MIT-D52B1E?style=flat-square)
![site](https://img.shields.io/badge/site-GitHub_Pages-111111?style=flat-square)

A one-page Unix timestamp converter laid out like a Swiss technical data sheet: a live clock, bidirectional timestamp ⇄ date-time conversion, and day / week / month counters since 1970-01-01. Runs entirely in the browser — no network requests, no tracking.

**Try it:** <https://petrel2015.github.io/timestamp-tool/>

> 💡 **Core goal** — answer in one glance: paste a timestamp (or pick a date), read local time, UTC, ISO 8601, both Unix units, relative time, and where that instant sits since the epoch.

## Features

| Area | What it does |
| --- | --- |
| Live now | Current local time updated every second, weekday, timezone (`GMT+08:00 · Asia/Shanghai`), and the current Unix seconds / milliseconds with one-click copy |
| Timestamp → date | Accepts negative values (pre-1970) and tolerates spaces / commas / underscores; unit auto-detection or forced seconds / milliseconds |
| Date → timestamp | Native date + time (with seconds) pickers, a “Use current time” shortcut, and instant outputs |
| Shared result panel | Local time, UTC time, ISO 8601, Unix seconds, Unix milliseconds, relative time — all copyable |
| Epoch statistics | Day / week / month since 1970-01-01, plus day of year and ISO week number |
| Donation | Low-key footer entry — ☕ — opens a dialog with Alipay / WeChat Pay QR codes generated in the browser at open time; on mobile it tries the Alipay page first and falls back to the QR |
| Bilingual | Chinese / English, switched in the masthead; defaults to the browser language and remembers your choice |
| Responsive | Single column on phones, two-column grids on tablets and desktops |

## Conventions

- **Day / week / month counting** — 1970-01-01 is day 1; week 1 covers 1970-01-01 → 01-07; month 1 is 1970-01. All counted on the local calendar date.
- **Auto unit detection** — up to 11 digits parsed as seconds, 12–15 as milliseconds, 16+ as microseconds. Force a unit when a value is ambiguous.

## URL parameter

Pre-fill the converter with `?ts=` (same auto-detection rules):

```
https://petrel2015.github.io/timestamp-tool/?ts=1760000000000
```

## Development

### Project structure

```
timestamp-tool/
├── index.html                  # page structure (semantic sections + donation dialog)
├── css/style.css               # Swiss design system + responsive grid
├── css/donation.css            # donation entry / dialog / QR card styles
├── js/i18n.js                  # zh/en dictionaries, detection, switching, persistence
├── js/app.js                   # live clock, conversion, statistics, clipboard
├── js/donation.js              # donation config, dialog, app hand-off, lazy QR generation
├── vendor/qrcode-generator/    # pinned QR library (MIT, minified) — lazy-loaded
└── test/e2e-donation.js        # Playwright E2E incl. jsQR decode verification
```

### Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No build step; `index.html` also works when opened directly from disk.

### Tests

```bash
python3 -m http.server 63647 &   # E2E expects this port
npm i -D playwright pngjs jsqr   # dev-only test deps (or point NODE_PATH at existing copies)
node test/e2e-donation.js        # desktop + iPhone-UA flows, QR decode via jsQR
```

### Donation implementation notes

- The footer entry opens a native-feeling dialog; payment QR codes are **generated at run time** from the payment links in `DONATION_CONFIG` (`js/donation.js`) — no QR images are stored in the repo.
- The QR library (`qrcode-generator` v1.4.4, MIT) is vendored at a pinned version and **lazy-loaded only when the dialog first opens**; codes are rendered as inline SVG (error correction M, 4-module quiet zone, dark modules on a white card) and cached per payment method.
- Desktop never attempts to launch a payment app. On mobile, Alipay gets a plain `https` link (the Alipay page handles its own app hand-off); WeChat shows the QR directly because `wxp://` deep links are unreliable in browsers. A soft `visibilitychange` / `pagehide` / `blur` check swaps the hint text when no hand-off happened — the QR stays visible the whole time, so there is no dead end.

### Architecture notes

- Both scripts are dependency-free IIFEs; `i18n.js` exposes `window.Lang`, `app.js` consumes it and re-renders on language change.
- A single `viewMs` state drives the shared result panel; whichever side you edit (timestamp input or date pickers) re-syncs the other.
- Clipboard writes use the async Clipboard API with an `execCommand` fallback and a timeout race for embedded webviews.
- Asset URLs carry `?v=` tokens so cache freshness is easy to check after each deploy.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Markup / style | Semantic HTML5, hand-written CSS (grid, `clamp()` fluid type) |
| Logic | Vanilla JavaScript (ES5-style IIFEs), no framework, no build |
| QR generation | `qrcode-generator` v1.4.4 (MIT), vendored + minified, lazy-loaded at dialog open |
| Typography | System Helvetica stack, tabular numerals, monospace for values |
| Theme | Swiss International Style — paper `#fafaf8`, ink `#111111`, single red accent `#d52b1e`, hairline grids |

## Limitations ⚠️

- Date pickers are limited to years ≥ 1; earlier dates are reachable only through the timestamp input (which accepts the full ECMAScript range, about ±275,000 years).
- Seconds entry in the time picker depends on the browser; the field always accepts `HH:MM` (seconds default to 0).
- Day / week / month counters use the local calendar; pre-1970 dates show non-positive counts by design.

## License

[MIT](LICENSE) © 2026 Yu Hong

---

## Buy me a coffee ☕

If this little tool helped you, tap **☕ Buy me a coffee** in the site footer — the dialog shows Alipay / WeChat Pay QR codes generated right in your browser.
