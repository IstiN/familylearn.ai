#!/usr/bin/env node
/**
 * Generates sitemap.xml + static SEO HTML for published public courses.
 * Run in CI after flutter build + landing pages: fetches API, writes into build/web.
 *
 * Flags:
 *   --fingerprint   Print a single sha256 line (content + generator files) and exit. No build dir required.
 *
 * Env:
 *   PUBLIC_SITE_BASE_URL  e.g. https://familylearn.ai (no trailing slash)
 *   PUBLIC_API_BASE_URL   e.g. https://learn.ai-native.cloud/api/v1
 *   PUBLIC_SEO_SKIP_API   if "1", only static sitemap URLs (no /c/ pages; fingerprint mode ignores this)
 *   PUBLIC_SEO_INDEXER_SECRET  optional; must match API env — sent as X-Public-Seo-Indexer so snapshots include full lesson text for robots
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const scriptDir = path.resolve(process.cwd(), path.dirname(process.argv[1] || '.'));
const webDir = path.resolve(scriptDir, '..');
const templatePath = path.join(webDir, 'templates', 'public_course_seo.html');
const selfPath = path.join(scriptDir, 'generate_public_seo.js');

const argvRaw = process.argv.slice(2);
const fingerprintOnly = argvRaw.includes('--fingerprint');
const positionalArgs = argvRaw.filter((a) => a !== '--fingerprint');
const buildDir = positionalArgs[0]
  ? path.resolve(positionalArgs[0])
  : path.resolve(webDir, '..', 'build', 'web');

const SITE = (process.env.PUBLIC_SITE_BASE_URL || 'https://familylearn.ai').replace(/\/$/, '');
const API_BASE = (process.env.PUBLIC_API_BASE_URL || 'https://learn.ai-native.cloud/api/v1').replace(/\/$/, '');
const SKIP_API = process.env.PUBLIC_SEO_SKIP_API === '1';

const SITE_NAME = 'FamilyLearn.AI';
const OG_IMAGE = `${SITE}/og-image-whatsapp.jpg`;
const TWITTER_IMAGE = `${SITE}/og-image-twitter.jpg`;

const HREFLANG_LANDING = ['en', 'ru', 'de', 'es', 'fr'];

function publicApiHeadersForFullSnapshot() {
  const h = { Accept: 'application/json' };
  const secret = (process.env.PUBLIC_SEO_INDEXER_SECRET || '').trim();
  if (secret) {
    h['X-Public-Seo-Indexer'] = secret;
  }
  return h;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatW3CDate(d) {
  if (!d) return new Date().toISOString().slice(0, 10);
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return new Date().toISOString().slice(0, 10);
  return x.toISOString().slice(0, 10);
}

function localeToHtmlLang(locale) {
  if (!locale) return 'en';
  const l = String(locale).toLowerCase().replace('_', '-');
  if (l.startsWith('zh')) return l.includes('hant') || l.includes('tw') ? 'zh-Hant' : 'zh-Hans';
  return l.split('-')[0];
}

function localeToOgLocale(locale) {
  const map = {
    en: 'en_US',
    ru: 'ru_RU',
    de: 'de_DE',
    es: 'es_ES',
    fr: 'fr_FR',
    it: 'it_IT',
    pt: 'pt_BR',
    ja: 'ja_JP',
    ko: 'ko_KR',
    'zh-hans': 'zh_CN',
    'zh-hant': 'zh_TW',
    uk: 'uk_UA',
    pl: 'pl_PL',
  };
  const short = String(locale || 'en').toLowerCase().split('-')[0];
  return map[short] || `${short}_${short.toUpperCase()}`;
}

function buildCourseDescription(topics, fallbackTitle) {
  const parts = [];
  const seen = new Set();
  for (const t of topics || []) {
    const line = (t.short_description || '').trim() || (t.title || '').trim();
    if (!line || seen.has(line)) continue;
    seen.add(line);
    parts.push(line);
    if (parts.length >= 14) break;
  }
  let text = parts.join(' · ');
  if (!text) text = `${fallbackTitle} — ${SITE_NAME}`;
  if (text.length > 175) text = `${text.slice(0, 172)}…`;
  return text;
}

function landingAlternateLinks(pageUrl) {
  return HREFLANG_LANDING.map((lang) => {
    const href = lang === 'en' ? `${SITE}/` : `${SITE}/${lang}/`;
    return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeHtml(href)}"/>`;
  }).join('\n');
}

function staticSitemapUrls(today) {
  const rows = [];
  const alternatesBlock = landingAlternateLinks();

  const addLanding = (locSuffix, priority) => {
    const loc = `${SITE}${locSuffix}`;
    rows.push(`  <url>
    <loc>${escapeHtml(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
${alternatesBlock}
  </url>`);
  };

  addLanding('/', '1.0');
  for (const lang of HREFLANG_LANDING) {
    if (lang === 'en') continue;
    addLanding(`/${lang}/`, '0.9');
  }

  const privacy = ['en', 'ru', 'de', 'es', 'fr'];
  for (const lang of privacy) {
    rows.push(`  <url>
    <loc>${escapeHtml(`${SITE}/privacy-policy-${lang}.html`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);
  }

  for (const lang of ['en', 'ru']) {
    rows.push(`  <url>
    <loc>${escapeHtml(`${SITE}/terms-${lang}.html`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);
  }

  return rows;
}

async function fetchAllListItems() {
  const items = [];
  let cursor = '';
  const limit = 100;
  for (;;) {
    const u = new URL(`${API_BASE}/public/dynamic-courses`);
    u.searchParams.set('limit', String(limit));
    if (cursor) u.searchParams.set('cursor', cursor);
    const res = await fetch(u, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`GET ${u}: ${res.status} ${body.slice(0, 200)}`);
    }
    const data = await res.json();
    const chunk = data.items || [];
    items.push(...chunk);
    if (!data.next_cursor) break;
    cursor = data.next_cursor;
  }
  return items;
}

async function fetchPublicSnapshot(id) {
  const u = `${API_BASE}/public/dynamic-courses/${encodeURIComponent(id)}`;
  const res = await fetch(u, { headers: publicApiHeadersForFullSnapshot() });
  if (!res.ok) return null;
  return res.json();
}

function generatorSourceHash() {
  const h = crypto.createHash('sha256');
  if (fs.existsSync(selfPath)) h.update(fs.readFileSync(selfPath));
  if (fs.existsSync(templatePath)) h.update(fs.readFileSync(templatePath));
  return h.digest('hex');
}

/** Stable snapshot of public catalog + topic data; any change to generated HTML/sitemap should move the hash. */
function stablePayloadFromCourses(courses) {
  const sorted = [...courses].sort((a, b) => String(a.snap.id).localeCompare(String(b.snap.id)));
  return sorted.map(({ list: row, snap }) => {
    const publishedAt =
      row.published_at != null ? String(row.published_at) : '';
    const topics = (snap.topics || [])
      .slice()
      .sort((a, b) => {
        const pa = Number(a.position) || 0;
        const pb = Number(b.position) || 0;
        if (pa !== pb) return pa - pb;
        return String(a.id).localeCompare(String(b.id));
      })
      .map((t) => ({
        id: String(t.id),
        parent_id: t.parent_id != null ? String(t.parent_id) : null,
        title: String(t.title || ''),
        short_description: String(t.short_description || ''),
        position: Number(t.position) || 0,
        body_markdown: String(t.body_markdown || ''),
        lesson_locked: Boolean(t.lesson_locked),
        links: [...(t.links || [])].map(String).sort(),
        tags: [...(t.tags || [])].map(String).sort(),
      }));
    return {
      id: String(snap.id),
      published_at: publishedAt,
      locale: String(snap.locale || row.locale || ''),
      title: snap.title != null ? String(snap.title) : '',
      color: snap.color != null ? String(snap.color) : '',
      topics,
    };
  });
}

function hashPublicSeoContent(courses) {
  const gen = generatorSourceHash();
  const payload = stablePayloadFromCourses(courses);
  const contentHex = crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex');
  return crypto.createHash('sha256').update(`${gen}\n${contentHex}`).digest('hex');
}

async function loadCoursesForSeo() {
  const list = await fetchAllListItems();
  const courses = [];
  const concurrency = 8;
  for (let k = 0; k < list.length; k += concurrency) {
    const batch = list.slice(k, k + concurrency);
    const snaps = await Promise.all(batch.map((row) => fetchPublicSnapshot(row.id)));
    for (let i = 0; i < batch.length; i++) {
      if (snaps[i]) courses.push({ list: batch[i], snap: snaps[i] });
    }
  }
  return courses;
}

async function printFingerprintAndExit() {
  try {
    const courses = await loadCoursesForSeo();
    const fp = hashPublicSeoContent(courses);
    process.stdout.write(`${fp}\n`);
  } catch (e) {
    console.error('Public SEO fingerprint:', e.message);
    process.exit(1);
  }
}

function fillTemplate(html, vars) {
  let out = html;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`__${k}__`).join(v);
  }
  return out;
}

function courseJsonLd({ title, description, url, inLanguage }) {
  const safeTitle = (title || 'Course').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const safeDesc = (description || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: title || 'Course',
      description: description || undefined,
      url,
      inLanguage: inLanguage || 'en',
      provider: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE,
      },
    },
    null,
    2
  );
}

function buildTopicRows(topics) {
  const rows = [];
  let n = 1;
  for (const t of topics || []) {
    const ttl = escapeHtml(t.title || `Lesson ${n}`);
    const desc = escapeHtml((t.short_description || '').trim());
    const descHtml = desc
      ? `<p class="topic-desc">${desc}</p>`
      : '';
    rows.push(`        <li><span class="topic-title">${ttl}</span>${descHtml}</li>`);
    n += 1;
    if (n > 40) break;
  }
  if (!rows.length) {
    rows.push('        <li><span class="topic-title">Course content</span></li>');
  }
  return rows.join('\n');
}

function buildFullTextBlockForSeo(topics) {
  const parts = [];
  for (const t of topics || []) {
    const body = String(t.body_markdown || '').trim();
    if (!body) continue;
    const ttl = escapeHtml(t.title || 'Lesson');
    parts.push(`        <div class="seo-lesson"><h3>${ttl}</h3><pre class="seo-md">${escapeHtml(body)}</pre></div>`);
  }
  if (!parts.length) {
    return '        <p class="seo-md">Outline only — open the app for the interactive course.</p>';
  }
  return parts.join('\n');
}

async function main() {
  if (fingerprintOnly) {
    await printFingerprintAndExit();
    return;
  }

  if (!fs.existsSync(buildDir)) {
    console.error('build dir missing:', buildDir);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  const today = formatW3CDate(new Date());
  const sitemapParts = staticSitemapUrls(today);

  let courses = [];
  if (!SKIP_API) {
    try {
      courses = await loadCoursesForSeo();
      console.log(`Fetched ${courses.length} public course snapshot(s).`);
    } catch (e) {
      console.error('Public SEO: API error:', e.message);
      process.exit(1);
    }
  } else {
    console.log('PUBLIC_SEO_SKIP_API=1 — static sitemap only.');
  }

  for (const { list: row, snap } of courses) {
    const id = String(snap.id || row.id);
    const title = (snap.title && String(snap.title).trim()) || 'Course';
    const topics = snap.topics || [];
    const description = buildCourseDescription(topics, title);
    const htmlLang = localeToHtmlLang(snap.locale || row.locale);
    const ogLocale = localeToOgLocale(snap.locale || row.locale);
    const canonical = `${SITE}/c/${id}/`;
    const appDeep = `${SITE}/c/${id}`;

    const jsonLd = courseJsonLd({
      title,
      description,
      url: canonical,
      inLanguage: htmlLang,
    });

    const page = fillTemplate(template, {
      HTML_LANG: escapeHtml(htmlLang),
      BASE_HREF: '/',
      META_DESCRIPTION: escapeHtml(description),
      CANONICAL_URL: escapeHtml(canonical),
      OG_TITLE: escapeHtml(`${title} · ${SITE_NAME}`),
      OG_DESCRIPTION: escapeHtml(description),
      OG_IMAGE: escapeHtml(OG_IMAGE),
      TWITTER_IMAGE: escapeHtml(TWITTER_IMAGE),
      SITE_NAME: escapeHtml(SITE_NAME),
      OG_LOCALE: escapeHtml(ogLocale),
      PAGE_TITLE: escapeHtml(`${title} · ${SITE_NAME}`),
      H1: escapeHtml(title),
      LEAD: escapeHtml(description),
      TOPIC_ROWS: buildTopicRows(topics),
      APP_DEEP_LINK: escapeHtml(appDeep),
      CTA_LABEL: 'Open interactive course',
      NOSCRIPT_HINT: 'Interactive map, timeline, and reader load in the app view.',
      JSON_LD: jsonLd,
      FULL_TEXT_BLOCK: buildFullTextBlockForSeo(topics),
    });

    const outDir = path.join(buildDir, 'c', id);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), page, 'utf8');

    const lastmod = formatW3CDate(row.published_at || today);
    sitemapParts.push(`  <url>
    <loc>${escapeHtml(canonical)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  const contentHash = hashPublicSeoContent(courses);
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- seo-content-sha256: ${contentHash} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapParts.join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), sitemapXml, 'utf8');

  const robots = `# ${SITE_NAME}
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-Web
Allow: /

Disallow: /auth/

Sitemap: ${SITE}/sitemap.xml
`;
  fs.writeFileSync(path.join(buildDir, 'robots.txt'), robots, 'utf8');

  console.log(`Wrote sitemap.xml, robots.txt, and ${courses.length} course page(s) under c/*/index.html`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
