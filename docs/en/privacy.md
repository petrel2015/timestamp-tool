# Privacy

Every claim on this page was verified against the source code (three JS files, one HTML file — there is nothing else that runs). For the Chinese page, see [隐私说明](../zh/privacy.md).

## What is stored on your device

| Storage | Key | Value | Lifetime | Purpose |
| --- | --- | --- | --- | --- |
| localStorage | `ts-lang` | `zh` or `en` | until you clear site data | remembers your UI language choice |

That is the complete list. No cookies, no IndexedDB, no session storage, no cache manifests.

## Network behavior

- **Core functionality makes zero network requests.** All conversion, statistics, formatting, and clipboard work is plain in-page JavaScript; nothing is fetched, posted, or beacons anywhere. The footer states this in the UI itself.
- **One deferred local script load:** when you first open the donation dialog, the page loads `vendor/qrcode-generator/qrcode.min.js` — a 21 KB file **from the same site** (it is committed to this repository). No third-party server is involved.
- **External navigation only on your explicit click:** the "Open Alipay" button (mobile only) navigates to `https://qr.alipay.com/…`. Nothing auto-navigates, ever.

You can confirm all of this yourself: open the browser devtools network panel, use the whole app, and watch — the log stays empty until you open the donation dialog (one same-origin request) or tap the Alipay link.

## Donations

- The QR codes are **generated in your browser** from payment payload strings committed in the repository (`DONATION_CONFIG` in `js/donation.js`). No QR image is downloaded, and no payment API is called by this site.
- Any payment happens entirely between you and the payment provider (Alipay / WeChat) once *you* scan the code with their app. This project has no backend, receives no payment notifications, and collects no payer data.

## Not collected

Names, emails, identifiers, usage statistics, telemetry, crash reports, location — none exist in the code base.

## Outside this project's control

- **Hosting:** the deployed site runs on GitHub Pages; its server-side access logging is governed by GitHub, not by this project.
- **Browsers** may keep their own caches of the page's static files.
