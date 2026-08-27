# Development

How to run, test, and change this project. For the Chinese page, see [开发指南](../zh/development.md).

## Environment requirements

There are no npm dependencies at runtime or in the page itself — you need only:

- **Python 3** for the local static server (any static server works; `npx serve` is fine too). Verified with Python 3.12.13.
- **Node.js** only if you want to run the E2E tests. Verified with Node 22.

## Commands

| Command | Purpose | Verified result (2026-08-27) |
| --- | --- | --- |
| `python3 -m http.server 8000 --directory .` | Local preview at <http://localhost:8000> | works |
| `open index.html` (no server) | Direct-from-disk preview | works, including donation QR (verified in Chromium) |
| `python3 -m http.server 63647 --directory . &` | Dev server on the port the E2E suite expects | works |
| `node test/e2e-donation.js` | Donation E2E suite (needs deps, see below) | **31 passed, 0 failed**, zero page errors |

There is no build step and no lint configuration in the repository (nothing to run; if you add ESLint/Prettier, record the baseline here).

### Running the E2E tests

The suite is dev-dependency-only (nothing is installed into the repo). It needs `playwright`, `pngjs`, and `jsqr` resolvable — either install them somewhere and point `NODE_PATH` at it, or `npm i -D` them if you don't mind a local `node_modules`:

```bash
python3 -m http.server 63647 --directory . &        # the suite hard-expects this port
NODE_PATH="<dir-with-playwright>:<dir-with-pngjs-jsqr>" node test/e2e-donation.js
```

Playwright must match its cached browser (the run above used playwright 1.60.0 with the locally cached Chromium).

What the suite actually tests (`test/e2e-donation.js`):

- **Desktop, zh locale (20 assertions):** footer entry text; dialog initially hidden; QR library *not* loaded before first open; dialog open → title/method/hint; no launch affordance on desktop; QR library lazy-loaded on open; QR rendered dark-on-light; both Alipay and WeChat QRs **decode via jsQR to the exact payment payloads**; Esc closes and restores focus to the footer entry; overlay click closes; language switch re-renders all dialog texts; zero page errors.
- **Mobile, iPhone UA, en locale (11 assertions):** browser-language default; no horizontal overflow at 390 px; launch link visible for Alipay with the plain `https` href; mobile QR decodes; failed hand-off swaps the hint after the grace period while the QR stays visible; no launch link for WeChat; dialog fits the narrow screen.

## Repository layout

```
timestamp-tool/
├── index.html                  # page structure: semantic sections + donation dialog markup
├── favicon.svg / favicon-*.png / apple-touch-icon-180.png   # research-report favicon set (purple tile, route silhouette, yellow dot)
├── css/
│   ├── fonts.css               # Spectral + IBM Plex Mono @font-face (5 faces)
│   ├── style.css               # research-report design tokens (Tongcheng purple-yellow) + responsive grid
│   └── donation.css            # donation entry / dialog / QR card styles
├── fonts/                      # vendored Spectral ×3 + IBM Plex Mono ×2 (SIL OFL) + OFL texts
├── js/
│   ├── i18n.js                 # zh/en dictionaries, detection, switching, persistence
│   ├── app.js                  # live clock, conversion, statistics, clipboard
│   └── donation.js             # donation config, dialog, app hand-off, lazy QR generation
├── vendor/qrcode-generator/    # pinned QR library (MIT, 21 KB minified) + its LICENSE
├── test/e2e-donation.js        # Playwright E2E incl. jsQR decode verification
├── docs/                       # this documentation set (en/zh, img/)
├── CHANGELOG.md / CHANGELOG.zh.md
└── README.md / README.zh.md / README_FOR_AI.md
```

Scripts are loaded in this order at the end of `<body>`: `i18n.js` → `app.js` → `donation.js`.

## Module responsibilities

- **`js/i18n.js`** — self-contained IIFE. Holds the `zh` / `en` dictionaries, detects the initial language (localStorage `ts-lang` → browser language), applies translations to any element with `data-i18n` / `data-i18n-placeholder` / `data-i18n-aria`, and exposes `window.Lang` (`get` / `set` / `t` / `apply` / `onChange`). Dictionary values may be functions (for pluralized units).
- **`js/app.js`** — consumes `window.Lang`. Owns the 250 ms clock render, timestamp parsing (`parseTs`), the epoch-statistics math (`computeStats`, `isoWeek`), relative-time formatting, the clipboard strategy, and the shared result panel. All UI state reduces to `state.viewMs` (the instant being displayed) plus `state.unit`.
- **`js/donation.js`** — the donation feature: `DONATION_CONFIG` (payment payloads), dialog open/close with focus trap, lazy loading of the vendored QR library, SVG QR generation with per-method caching, and the mobile app hand-off soft detection. See the [feature design doc](./features/runtime-qr-donation.md).

**Data flow (one line):** any input event → `setView(ms, source)` updates `state.viewMs` → `renderResults()` re-renders the six rows + statistics → each row is independently copyable. The clock loop is separate (`renderNow` every 250 ms) and only touches section 01.

## Conventions to preserve when changing code

- ES5-style, no modules, no framework — `index.html` must keep working when opened directly from disk (no bundler assumptions).
- All asset references stay **relative** (`css/…`, `js/…`, `vendor/…`) so any static host and any subpath works unchanged.
- Bump the `?v=` tokens on `index.html` asset URLs when you change those files — it is the cache-freshness signal used after deploys.
- New user-visible strings go into **both** dictionaries in `js/i18n.js`, with `data-i18n*` attributes in the markup — never hard-coded text.
- Update the E2E expectations in `test/e2e-donation.js` if you change donation copy or payment payloads.

## Verifying a change locally

1. Serve the repo (`python3 -m http.server 8000 --directory .`) and click through your change in a browser.
2. Run the E2E suite if you touched the donation feature (server on 63647).
3. Check the browser console is clean — the E2E suite fails on any page error.
4. For deploy-form verification (subpath), see [Deployment](./deployment.md).
