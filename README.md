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
├── index.html                  # page structure (semantic sections)
├── css/style.css               # Swiss design system + responsive grid
├── js/i18n.js                  # zh/en dictionaries, detection, switching, persistence
├── js/app.js                   # live clock, conversion, statistics, clipboard
├── img/                        # generated donate QR codes (SVG)
├── scripts/generate-donate-qr.mjs  # regenerates the QR SVGs (dev-only)
└── package.json                # dev-only deps for the script above
```

### Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No build step; `index.html` also works when opened directly from disk.

### Regenerate the donate QR codes

```bash
npm install
npm run donate:qr
```

The script renders the payment links as ink-on-white SVG (error correction level H) to match the paper theme.

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
| Typography | System Helvetica stack, tabular numerals, monospace for values |
| Theme | Swiss International Style — paper `#fafaf8`, ink `#111111`, single red accent `#d52b1e`, hairline grids |

## Limitations ⚠️

- Date pickers are limited to years ≥ 1; earlier dates are reachable only through the timestamp input (which accepts the full ECMAScript range, about ±275,000 years).
- Seconds entry in the time picker depends on the browser; the field always accepts `HH:MM` (seconds default to 0).
- Day / week / month counters use the local calendar; pre-1970 dates show non-positive counts by design.

## License

[MIT](LICENSE) © 2026 Yu Hong

---

## Buy me a coffee ￥4.9 ☕

| Alipay 支付宝 | WeChat 微信 |
| :---: | :---: |
| <img src="img/alipay-qr.svg" width="200" alt="Alipay QR code"> | <img src="img/wechat-qr.svg" width="200" alt="WeChat QR code"> |
