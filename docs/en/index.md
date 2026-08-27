# Documentation

Detailed documentation for topics summarized in the main [README](../../README.md).
For the Chinese documentation set, see [中文索引](../zh/index.md).

## User Documentation

- [Usage](./usage.md) — step-by-step usage: the live clock, both conversion directions, input rules, unit auto-detection, result panel, epoch statistics conventions, copy buttons, language switching, URL prefill, and the donation flow.
- [FAQ](./faq.md) — scope and edge-case questions (before-1970 dates, timezone conversion, offline use, self-hosting…).
- [Troubleshooting](./troubleshooting.md) — symptom → cause → fix table for input errors, copy failures, QR generation, language persistence, and dev-server issues.
- [Privacy](./privacy.md) — what the app stores (`ts-lang` in localStorage, and nothing else), its zero-runtime-network guarantee, and how donations work without a backend.

## Technical Documentation

- [Development](./development.md) — environment requirements, verified commands, the E2E test suite, module responsibilities, and the state model.
- [Deployment](./deployment.md) — how the site is published on GitHub Pages, subpath behavior, cache-freshness tokens, and a post-deploy verification checklist.

## Feature Documentation

| Feature | Introduced | Status | Description |
| --- | --- | --- | --- |
| [Runtime QR Donation](./features/runtime-qr-donation.md) | 1.0.0 | Stable | Footer entry → dialog with Alipay / WeChat Pay QR codes generated in the browser at open time; no stored images, no backend, mobile hand-off with soft detection. |

> The repository has no git tags yet; `1.0.0` is the declared initial summary version — see the note in [CHANGELOG.md](../../CHANGELOG.md).
