# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is
Static website(s) served as plain HTML/CSS/JS (GitHub Pages style). There is **no build framework and no external npm dependencies** — all Node scripts use only built-in modules (`fs`, `path`). Node.js is preinstalled (v22 available; CI uses Node 20). There is nothing to `npm install`.

### Layout / services
- Root site: static files at repo root (`index.html`, `styles.css`, `assets/`, `sitemap.xml`).
- `gift-for-you/`: separate static subsite (no own server).
- `rakuten-gear-review/`: the main app — a Japanese product-review blog. It is the only package with a `package.json` and a dev server.

### Run / build / audit (rakuten-gear-review)
Commands are defined in `rakuten-gear-review/package.json` (run from that dir):
- Dev server: `npm run dev` → serves on `http://127.0.0.1:5173` (see `server.js`, honors `PORT`).
- Build: `npm run build` = `repair` + `audit` + `audit:images`.
- Lint/checks: there is no ESLint; the `audit`/`audit:images` scripts are the correctness checks (they print JSON with `errors`/`warnings`; a healthy run shows `issueCount: 0` and empty `errors`).

### Non-obvious caveats
- `npm run build` runs `scripts/repair-static-site.cjs`, which **regenerates `index.html`** and can leave cosmetic diffs (e.g. blank lines) in tracked files. If you only ran build to verify the env, `git checkout` those regenerated files before committing so setup does not modify site content.
- The root has no `package.json`; `rakuten-gear-review/scripts/repair-static-site.cjs` requires `scripts/sync-root-sitemap.cjs` from the repo root, so run it from within `rakuten-gear-review/`.
- To serve the root site or `gift-for-you/` there is no bundled server; use any static file server (e.g. `python3 -m http.server`).
- Some legacy `article/<japanese-name>/` directories can hit Unicode NFC/NFD path mismatches when requested directly; this is not a bug in the site — the actual links generated on pages use ASCII slugs and resolve correctly.

### Project rules
See `.cursor/rules/kikuchi-web-rules.mdc` (Japanese): do not break the existing site; preserve PR disclosure, canonical, sitemap, feeds, slugs, and internal links; never force-push; confirm before pushing/publishing.
