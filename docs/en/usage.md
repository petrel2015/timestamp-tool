# Usage

How to actually use the tool — what README summarizes in one line each, spelled out step by step. For the Chinese page, see [使用指南](../zh/usage.md).

## Live clock

The **01 · Current time** section is always live:

- Local date and time, refreshed on a 250 ms tick (so seconds never look stale), with the weekday beneath it.
- The timezone label in the section header and footer shows your UTC offset and IANA timezone name, e.g. `GMT+08:00 · Asia/Shanghai`.
- The current Unix **seconds** and **milliseconds** values each have a copy button on the right.
- The five statistics cards below (day / week / month since epoch, day of year, ISO week) track "now" using the same conventions as the result panel — see [Epoch statistics conventions](#epoch-statistics-conventions).

## Timestamp to date-time

Type or paste a timestamp into the **02 · Converter** left card:

1. Click into the timestamp field and paste (e.g. `1760000000`).
2. Results appear immediately in the panel below — no submit button.
3. Optionally pick a unit first: **Auto** (default), **Seconds**, or **Milliseconds**.

Accepted input:

| Input | Parsed as | Notes |
| --- | --- | --- |
| `1760000000` (≤ 11 digits) | seconds | |
| `1760000000000` (12–15 digits) | milliseconds | |
| `1760000000000000` (≥ 16 digits) | microseconds | value is divided to milliseconds internally |
| `-86400` | negative (pre-1970) | full ECMAScript range applies, about ±273,790 years |
| `1_760_000_000` / `1,760,000,000` / `1 760 000 000` | separators tolerated | spaces, commas, underscores are stripped before parsing |

The unit buttons force an interpretation and override digit-count auto-detection — useful for ambiguous values near the boundaries (e.g. a 12-digit value you know is in seconds).

Errors are shown under the field and the previous valid result stays on screen — see the table under [Error messages](#error-messages).

## Date-time to timestamp

Use the right card of section 02:

1. Pick a date with the native date picker (years ≥ 1).
2. Pick a time — `HH:MM` always works; seconds are editable in browsers that support it and default to `0` otherwise (the field is rendered with `step="1"`).
3. Or press **Use current time** to load the current instant into both pickers, then adjust.

The interpretation is always your **local** timezone; the panel additionally shows the UTC equivalent.

Editing either card re-syncs the other: typing a timestamp sets the pickers, and picking a date/time sets the timestamp field (respecting the current unit selection).

## Result panel

For whatever instant is currently loaded (yours or "now" at page load), the panel shows six copyable rows:

| Row | Format | Example |
| --- | --- | --- |
| Local time | `YYYY-MM-DD HH:MM:SS · Weekday` | `2025-10-09 09:33:20 · Thursday` |
| UTC time | `YYYY-MM-DD HH:MM:SS UTC` | `2025-10-09 01:33:20 UTC` |
| ISO 8601 | local time + numeric offset (ms included when non-zero) | `2025-10-09T09:33:20+08:00` |
| Unix seconds | integer | `1760000000` |
| Unix milliseconds | integer | `1760000000000` |
| Relative to now | localized, auto-scaled unit | `in 3 days` / `2 months ago` |

Relative time scales through seconds → minutes → hours → days → years (a year is counted as 365.25 days); anything under a second shows "now". Every row has its own copy button.

![Converter with a pre-filled timestamp](../img/converter-ts-prefill-zh.webp)

## Epoch statistics conventions

Both the live section and the result panel compute five counters on the **local** calendar date:

- **Day since 1970-01-01** — 1970-01-01 itself is day **1** (not day 0).
- **Week since 1970-01-01** — week 1 covers 1970-01-01 → 01-07; weeks advance every 7 days from that anchor, regardless of weekday.
- **Month since 1970-01-01** — 1970-01 is month 1; `year − 1970` × 12 + `month`.
- **Day of year** — `NNN / 365` (or 366 in leap years).
- **ISO week** — the standard ISO 8601 week number (Monday-based, week 1 contains January 4), with its ISO year shown alongside for dates whose ISO year differs from the calendar year.

Note that **Week since 1970-01-01 and ISO week are different counters**: the former counts unbroken 7-day blocks from the epoch, the latter follows the calendar-week system. Pre-1970 dates yield non-positive day/week/month counts by design.

## Copy buttons

Every value row (and both "now" timestamps) has a copy button; on success the icon flashes to a check mark for 1.4 s. The copy path uses the async Clipboard API where available, and automatically falls back to a legacy `execCommand` path (raced against an 800 ms timeout) inside embedded webviews or non-secure contexts where the async API hangs or is blocked.

## Language

Click **中文 / EN** in the masthead. The choice is remembered in localStorage (key `ts-lang`) and restored on the next visit. First visit defaults to your browser language (any `zh*` locale → Chinese, otherwise English). In private-mode browsers where localStorage throws, the choice lasts for the session only. Everything re-renders instantly, including the result panel's weekday and relative-time strings.

## URL parameter prefill

Append `?ts=<value>` to pre-load the converter (same parsing and auto-detection rules as manual input):

```
https://petrel2015.github.io/timestamp-tool/?ts=1760000000000
```

Invalid values are ignored and the page loads with the current time instead.

## Donation

Tap **☕ Buy me a coffee** in the footer:

- The dialog opens with **Alipay** selected; switch to **WeChat Pay** at any time. The QR code is generated in your browser when the dialog opens (no image was downloaded and no request left your machine beyond loading the local vendored script).
- Close with the × button, the overlay, or the **Esc** key.
- On phones, Alipay additionally shows an **Open Alipay** link; if the app does not open within ~1.5 s, the hint switches to "scan the QR instead" — the QR never disappears.
- Design decisions and rationale: [Runtime QR Donation](./features/runtime-qr-donation.md).

![Donation dialog](../img/donation-dialog-zh.webp)

On phones the whole page stacks into one column:

![Mobile layout at 390px](../img/mobile-zh.webp)

## Error messages

| Situation | Behavior |
| --- | --- |
| Non-numeric input (`abc`, `1.5e9`, empty after separators) | "Enter a valid numeric timestamp" under the field; last valid result stays |
| Numeric but out of range (beyond ±273,790 years) | "Out of representable date range"; last valid result stays |
| Empty field | Error clears; "now" result stays |
| Valid input | Error clears; all six rows + statistics update immediately |
| QR script fails to load (should not happen in a normal deployment) | Dialog hint becomes "QR code failed to generate — please reload and try again" |

For recurring problems, see [Troubleshooting](./troubleshooting.md).

## Edge behavior

- **Pre-1970:** negative timestamps work through the timestamp field; day/week/month counters show non-positive values by design.
- **Before year 1:** reachable only via the timestamp field (the ECMAScript range extends to about ±273,790 years); the date picker cannot go there.
- **Microseconds:** 16+ digit values are accepted and treated as microseconds (scaled down to milliseconds); the panel itself always reports seconds and milliseconds.
- **Millisecond precision:** the ISO 8601 row includes `.mmm` only when the milliseconds are non-zero.
- **Local-time interpretation:** the date/time pickers always mean your local timezone; there is no timezone selector (a deliberate non-goal — results include UTC and ISO with offset instead).
