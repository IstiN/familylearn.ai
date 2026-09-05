# Landing Page Translations

Single source of truth for landing page content. Used by the deploy script to generate pre-rendered HTML per language for SEO.

## Structure

- **default.json** – Fallback (English). Used for `en` and for missing keys in other languages.
- **ru.json**, **de.json**, **es.json**, **fr.json** – One file per language. Overrides default for that language.
- Keys `title` and `description` are used for meta tags; other keys map to `data-i18n` in HTML.

## Adding a Language

1. Create `locales/xx.json` (e.g. `it.json`).
2. Copy keys from `default.json` and translate. You can omit keys to fall back to default.
3. Add the locale to `LOCALE_MAP` in `scripts/generate_landing_pages.js` if needed for og:locale.
4. Rebuild and deploy.

## Workflow

1. **Deploy** (`deploy-web.yml`): After Flutter build, runs `generate_landing_pages.js`.
2. **Script** reads `default.json` + all `*.json` (except default), merges each lang with default.
3. Generates: `index.html` (en), `ru/index.html`, `de/index.html`, etc.
4. Each page has content in HTML, correct hreflang, canonical, and meta tags.

## Syncing with landing.js

For local dev, `landing.js` still has its own translations. When changing locale files, update `landing.js` if you need runtime translation during development.
