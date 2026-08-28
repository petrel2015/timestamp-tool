# Changelog

All notable, user-visible changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

> **Versioning note.** This repository has no git tags, no GitHub Releases, and no `package.json` (checked 2026-08-27: `git tag` → empty, `gh release list` → empty). `1.0.0` below is therefore a **declared summary version** for the already-published site — it aggregates the complete capability set as of the founding commits (both dated 2026-08-27) into one entry. New changes go under `[Unreleased]` until the maintainer cuts the first real tag, at which point this note should be removed.

## [Unreleased]

### Added

- Complete bilingual documentation set: restructured `README.md` / `README.zh.md`, new `README_FOR_AI.md`, this changelog (EN/中文), `docs/en` + `docs/zh` pages (usage, development, deployment, troubleshooting, privacy, FAQ), and the donation feature design doc under `docs/*/features/`, with real-browser screenshots in `docs/img/`. (The old `README.zh-CN.md` was renamed to `README.zh.md`.)

### Changed

- **Visual restyle: Swiss → institutional research report, Tongcheng purple-yellow theme** (visual layer only; no logic, data, or interaction changes). Three-color constitution: purple `#56338A` as the only colored text (kickers, section numbers, active pills, metric values), yellow `#F6C343` strictly as background accents (square dots on section/methodology heads, soft hover wash on data rows), red `#B02418` reserved for the dashed warning note on input errors. Spectral serif (3 faces) + IBM Plex Mono (2 faces) vendored to `fonts/` under SIL OFL, Chinese falling back to a Noto Serif SC / Songti stack; every value renders in monospace + tabular numerals. Hairline rules replace card boxes; buttons become purple-outlined capsule pills; the result panel keeps the chart four-piece container (serif title + sentence-case mono sub-head + source line); metric stats gain a 2px ink top rule; the footer methodology block appears (computation conventions, ISO-week rule, local-only disclaimer). New favicon set (purple tile, white route silhouette, yellow square dot) in svg + 16/32/180 px, checked against light and dark chrome. `prefers-reduced-motion` respected.
- **Converter promoted to the top of the page**: the bidirectional converter is now section 01, above the live clock (02), so the input fields are the first thing users see on every screen size — no scrolling past the clock on phones.
- Input areas visually emphasized: large monospace fields (18 px type, 56 px height), yellow square markers on both card titles, a purple top bar on the card holding the focused field, and a purple caret + underline on focus.
- Mobile polish: full-width unit selector and "Use current time" button, pressed (`:active`) states with the system tap highlight removed, normalized iOS date/time fields (≥ 16 px, no focus zoom), a hairline separator between the stacked input cards, footer safe-area padding (`env(safe-area-inset-bottom)`), and a `theme-color` meta for mobile browser chrome.

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
