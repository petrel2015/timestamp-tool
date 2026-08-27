# Deployment

How the site is published and how to verify a deployment. For the Chinese page, see [部署指南](../zh/deployment.md).

## How it is deployed

The site is served by **GitHub Pages** at <https://petrel2015.github.io/timestamp-tool/>:

- **Source:** the `main` branch, repository root (verified via the GitHub Pages API: `build_type: legacy`, `source: main /`). Pushing to `main` triggers a site rebuild.
- **HTTPS:** enforced at the Pages level (no custom domain is configured).

There is no build pipeline — what is in the repository *is* what is served.

## Why any static host works

Every asset reference in `index.html` is **relative** (`css/style.css?v=2`, `js/app.js?v=2`, `vendor/qrcode-generator/qrcode.min.js`), and the code never inspects `location`. So the page works:

- at a repository subpath (`/timestamp-tool/`, as on GitHub Pages),
- at a domain root on any other static host (Netlify, Vercel static, nginx, Caddy, an intranet file share),
- or double-clicked from disk (`file://`, verified).

No `basePath` configuration exists or is needed.

## Deploying an update

1. Commit to `main` and push. If you changed `css/`, `js/`, or `vendor/` files, bump their `?v=` tokens in `index.html` in the same commit — this is the project's cache-freshness convention.
2. GitHub Pages rebuilds automatically (typically a minute or two).

## Post-deploy verification checklist

Run through after every deploy (all steps verified for the current site on 2026-08-27):

- [ ] `curl -sI https://petrel2015.github.io/timestamp-tool/` → `200`
- [ ] `curl -sI https://petrel2015.github.io/timestamp-tool/js/app.js?v=2` → `200` (same for the other assets you touched)
- [ ] Open the page in a browser: the clock ticks, the timezone label renders.
- [ ] Paste a known timestamp (e.g. `1760000000` → `2025-10-09`, exact local time depends on your timezone) and check the six result rows.
- [ ] Open the donation dialog: the QR appears (lazy script load) within a second.
- [ ] Browser console shows no errors.

## Custom domain notes

No custom domain is currently configured. If you add one in the GitHub Pages settings later:

- GitHub provisions the DNS/HTTPS side; keep **Enforce HTTPS** on.
- Nothing in this project needs to change — assets are relative and the app has no hardcoded origin. The `?ts=` URL parameter and all features keep working.
