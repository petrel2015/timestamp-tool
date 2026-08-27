# Changelog

All notable, user-visible changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

> **Versioning note.** This repository has no git tags, no GitHub Releases, and no `package.json` (checked 2026-08-27: `git tag` → empty, `gh release list` → empty). `1.0.0` below is therefore a **declared summary version** for the already-published site — it aggregates the complete capability set as of the founding commits (both dated 2026-08-27) into one entry. New changes go under `[Unreleased]` until the maintainer cuts the first real tag, at which point this note should be removed.

## [Unreleased]

### Added

- Complete bilingual documentation set: restructured `README.md` / `README.zh.md`, new `README_FOR_AI.md`, this changelog (EN/中文), `docs/en` + `docs/zh` pages (usage, development, deployment, troubleshooting, privacy, FAQ), and the donation feature design doc under `docs/*/features/`, with real-browser screenshots in `docs/img/`. (The old `README.zh-CN.md` was renamed to `README.zh.md`.)

## [1.0.0] - 2026-08-27

First published release; this entry summarizes the complete feature set of the initial site (both founding commits of 2026-08-27).

### Added

- Swiss-style, bilingual (zh/en) single-page Unix timestamp converter: live clock with weekday, timezone label, and copyable current Unix seconds / milliseconds.
- Bidirectional conversion — timestamp → date-time (negative values, space/comma/underscore-tolerant parsing, auto unit detection: ≤ 11 digits seconds, 12–15 milliseconds, 16+ microseconds; or forced unit) and date-time → timestamp (native pickers, "use current time" shortcut).
- Shared result panel: local time, UTC time, ISO 8601, Unix seconds, Unix milliseconds, relative time — all copyable.
- Epoch statistics for "now" and results: day / week / month since 1970-01-01, day of year, ISO 8601 week number (conventions documented in usage docs).
- URL parameter prefill via `?ts=`.
- Language detection (browser language), masthead switch, persistence in localStorage (`ts-lang`).
- Responsive layout (single column on phones, two-column grids on desktop); hand-written CSS, no framework, no build step; works when opened directly from disk.
- Donation feature: footer entry, dialog with focus trap / ESC / overlay close, Alipay / WeChat Pay QR codes generated at run time (vendored `qrcode-generator` v1.4.4, lazy-loaded on first open), mobile Alipay hand-off with soft detection and QR fallback.
- E2E test suite for the donation feature (Playwright + jsQR decode, desktop + mobile flows, 31 assertions).
