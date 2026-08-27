# Troubleshooting

Real failure modes of this app, ordered by symptom. For the Chinese page, see [故障排查](../zh/troubleshooting.md).

If your case is not covered, please [open an issue](https://github.com/petrel2015/timestamp-tool/issues) and attach: browser + version, OS, the exact input you typed (or the URL for `?ts=`), whether you are on the deployed site or self-hosted, and any console output.

## Input and conversion

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| "Enter a valid numeric timestamp" under the field | Input contains something other than digits, an optional leading `-`, and space/comma/underscore separators (e.g. `1.5e9`, `abc`, `+100`) | Use plain digits; see the accepted-input table in [Usage](./usage.md#timestamp-to-date-time) |
| "Out of representable date range" | Value exceeds the ECMAScript date range (about ±273,790 years from 1970) | That value cannot be represented as a JavaScript date at all |
| A 12-digit value I know is *seconds* parsed as milliseconds | Auto-detection uses digit count (12–15 digits → ms) | Click the **Seconds** unit button to force the interpretation |
| Result doesn't match another tool by a small offset | The other tool interpreted a different unit (s vs ms) or timezone | Compare the UTC row, not just local time; check the unit selection |
| Date picker won't go before year 1 | Native `type="date"` limitation | Enter the earlier date as a (negative) timestamp instead — the full range works there |
| Seconds disappear from the time picker | Browser-dependent behavior of `type="time"` with `step="1"` | The field always accepts `HH:MM`; seconds then default to `0`. Type the seconds manually where the browser supports it |

## Interface

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Copy button does nothing (no check-mark flash) | Clipboard blocked in an embedded webview or non-secure context; both the async API and the `execCommand` fallback failed | Select the value manually; if self-hosting, serve over `https://` or `http://localhost` |
| Language choice forgotten after restarting | localStorage unavailable (private mode / blocked storage) | Expected degradation — the choice then lasts for the session only |
| Page is in the "wrong" language on first visit | Detection follows the browser language (`zh*` → Chinese, else English) | Switch once via the masthead; the choice is then stored |

## Donation dialog

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| "QR code failed to generate — please reload and try again" | The vendored script `vendor/qrcode-generator/qrcode.min.js` failed to load — usually a self-hosting copy that omitted the `vendor/` directory | Ensure the full repository (incl. `vendor/`) is deployed; reload the page |
| On mobile, "Open Alipay" doesn't open the app | Soft detection fired (1.5 s without a hand-off) — some browsers block external navigation | Scan the QR directly; it stays visible the whole time (by design there is no dead end) |
| WeChat has no "open app" button | Deliberate: `wxp://` deep links are unreliable in browsers | Scan the WeChat QR with the WeChat app |

## Self-hosting and development

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `node test/e2e-donation.js` fails to connect | No dev server on port 63647 (the suite hard-expects it) | `python3 -m http.server 63647 --directory . &` then rerun |
| E2E fails on `require('playwright')` / jsQR / pngjs | Dev dependencies not resolvable | Install them and export `NODE_PATH`, or `npm i -D playwright pngjs jsqr` — see [Development](./development.md#running-the-e2e-tests) |
| E2E browser fails to launch | Playwright version doesn't match the cached Chromium | `npx playwright install chromium` for your installed playwright version |
| Stale CSS/JS after a deploy | HTTP cache | Hard-reload; check that the `?v=` token on the asset URL was bumped in `index.html` |
