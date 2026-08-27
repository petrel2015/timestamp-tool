# FAQ

Scope and edge-case questions. For the Chinese page, see [常见问题](../zh/faq.md).

## General

**Is it free? Is it open source?**
Yes — MIT-licensed, source at [petrel2015/timestamp-tool](https://github.com/petrel2015/timestamp-tool). The vendored QR library is also MIT.

**Does it send my data anywhere?**
No. The app makes zero network requests for all core functionality; the only storage is your language choice in localStorage. Details and how to verify yourself: [Privacy](./privacy.md).

**Can I use it offline?**
The deployed page itself needs the initial load, but you can save the repository and open `index.html` directly from disk — everything including the donation QR works from `file://` (verified). There is no service worker, so it is not an installable PWA.

**Can I self-host it?**
Yes — any static host, any subpath. All asset references are relative; there is nothing to configure. Steps and caveats: [Deployment](./deployment.md).

## Conversion behavior

**Why did my 13-digit number parse as milliseconds?**
Auto-detection goes by digit count: ≤ 11 digits → seconds, 12–15 → milliseconds, 16+ → microseconds. If the value is genuinely seconds, click **Seconds** to force it. Rationale and boundaries: [Usage](./usage.md#timestamp-to-date-time).

**Does it handle pre-1970 timestamps?**
Yes — negative values work in the timestamp field across the full ECMAScript range (about ±273,790 years). The day/week/month counters show non-positive values for pre-1970 dates by design.

**Why is the "week since 1970" different from the ISO week?**
They are different counters. "Week since 1970-01-01" counts unbroken 7-day blocks starting at the epoch (week 1 = Jan 1–7, 1970); the ISO week follows the ISO 8601 calendar-week system (Monday-based, week 1 contains January 4). Both are shown. Conventions: [Usage](./usage.md#epoch-statistics-conventions).

**Can I convert between two arbitrary timezones?**
No — results are always your local time plus UTC (and ISO with your offset). A timezone selector is a deliberate non-goal to keep the page a single-glance answer.

**Why can't the date picker reach years before 1?**
Native `<input type="date">` limitation. Use the timestamp field instead — it covers the full representable range.

**Why does the "relative to now" value look off by a minute?**
It rounds to the nearest unit (e.g. `Math.round(sec/60)` minutes). It is a human-facing approximation, not a countdown.

## Donation

**Why is there no stored QR image in the repository?**
The QR codes are generated at run time from payment payload strings, so the repo carries no images and any payload change needs no binary assets. Full design: [Runtime QR Donation](./features/runtime-qr-donation.md).

**Why does WeChat never offer an "open app" button?**
`wxp://` deep links are unreliable across mobile browsers, so the design shows the QR directly instead of gambling on a broken navigation. Alipay uses a plain `https` link which works everywhere.

## Development

**How do I run the tests?**
The E2E suite covers the donation feature (31 assertions, desktop + mobile). It expects a dev server on port 63647 and dev-only npm packages — see [Development](./development.md#running-the-e2e-tests).

**Is there a build or a framework?**
No. Three ES5-style IIFE files, hand-written CSS, no dependencies. See [Development](./development.md#module-responsibilities).
