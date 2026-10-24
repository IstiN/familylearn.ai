#!/usr/bin/env node
/**
 * Generates language-specific landing pages from locales/*.json.
 * Run during deploy: reads default.json + lang files, outputs pre-rendered HTML per language.
 * SEO: each page has content in HTML, correct hreflang, canonical, meta.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://familylearn.ai';
const LOCALE_MAP = {
  en: 'en_US', ru: 'ru_RU', de: 'de_DE', es: 'es_ES', 'es-419': 'es_419', fr: 'fr_FR',
  it: 'it_IT', 'pt-BR': 'pt_BR', ja: 'ja_JP', ko: 'ko_KR', 'zh-Hans': 'zh_CN', 'zh-Hant': 'zh_TW',
  nl: 'nl_NL', sv: 'sv_SE', no: 'nb_NO', ar: 'ar_SA', hi: 'hi_IN',
  tr: 'tr_TR', pl: 'pl_PL', id: 'id_ID', th: 'th_TH', vi: 'vi_VN', uk: 'uk_UA'
};
const DEFAULT_LANG = 'en';

const scriptDir = path.resolve(process.cwd(), path.dirname(process.argv[1] || '.'));
const webDir = path.resolve(scriptDir, '..');
const localesDir = path.join(webDir, 'locales');
const buildDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(webDir, '..', 'build', 'web');

function loadTranslations() {
  const defaultPath = path.join(localesDir, 'default.json');
  if (!fs.existsSync(defaultPath)) {
    console.error('locales/default.json not found');
    process.exit(1);
  }
  const defaultT = JSON.parse(fs.readFileSync(defaultPath, 'utf8'));

  const translations = { [DEFAULT_LANG]: { ...defaultT } };
  const langFiles = fs.readdirSync(localesDir)
    .filter((f) => f.endsWith('.json') && f !== 'default.json' && f !== 'locale_catalog.json' && !f.startsWith('_'));

  for (const file of langFiles) {
    const lang = path.basename(file, '.json');
    const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
    translations[lang] = { ...defaultT, ...content };
  }

  return translations;
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHreflangLinks(langs) {
  return langs
    .map((lang) => {
      const url = lang === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${lang}/`;
      return `  <link rel="alternate" hreflang="${lang}" href="${url}">`;
    })
    .join('\n');
}

function applyTranslations(html, t) {
  let out = html;
  for (const [key, value] of Object.entries(t)) {
    if (key === 'title' || key === 'description') continue;
    const escaped = escapeHtml(value);
    const re = new RegExp(
      `(data-i18n="${key}"[^>]*>)([\\s\\S]*?)(</[a-zA-Z][a-zA-Z0-9]*>)`,
      'g'
    );
    out = out.replace(re, `$1${escaped}$3`);
  }
  return out;
}

function generatePage(html, lang, t, allLangs) {
  const pageUrl = lang === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${lang}/`;
  const locale = LOCALE_MAP[lang] || `${lang.replace('-', '_')}`;

  let out = html;

  out = applyTranslations(out, t);

  out = out.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  // Keep base href="/" for all - assets load from root

  out = out.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(t.title)}</title>`
  );
  out = out.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeHtml(t.description)}">`
  );

  out = out.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${escapeHtml(t.title)}">`
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${escapeHtml(t.description)}">`
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${pageUrl}">`
  );
  out = out.replace(
    /<meta property="og:locale" content="[^"]*">/,
    `<meta property="og:locale" content="${locale}">`
  );
  out = out.replace(/<meta property="og:locale:alternate"[^>]*>\n?/g, '');

  out = out.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${escapeHtml(t.title)}">`
  );
  out = out.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${escapeHtml(t.description)}">`
  );
  out = out.replace(
    /<meta name="twitter:url" content="[^"]*">/,
    `<meta name="twitter:url" content="${pageUrl}">`
  );

  out = out.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${pageUrl}">`
  );

  if (t.keywords) {
    out = out.replace(
      /<meta name="keywords" content="[^"]*">/,
      `<meta name="keywords" content="${escapeHtml(t.keywords)}">`
    );
  }

  out = out.replace(
    /"url":\s*"https:\/\/learn\.ai-native\.pro\/"/,
    `"url": "${pageUrl.replace(/\/$/, '')}/"`
  );
  out = out.replace(
    /"inLanguage":\s*\[[^\]]*\]/,
    `"inLanguage": "${lang}"`
  );
  if (t.description) {
    const descEscaped = (t.description || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    out = out.replace(
      /"description":\s*"AI-powered learning companion[^"]*"/,
      `"description": "${descEscaped}"`
    );
  }

  const PRIVACY_LANGS = ['en', 'ru', 'de', 'es', 'fr'];
  const TERMS_LANGS = ['en', 'ru'];
  const privacyLang = PRIVACY_LANGS.includes(lang) ? lang : 'en';
  const termsLang = TERMS_LANGS.includes(lang) ? lang : 'en';
  out = out.replace(/href="\/privacy-policy-en\.html"/, `href="/privacy-policy-${privacyLang}.html"`);
  out = out.replace(/href="\/terms-en\.html"/, `href="/terms-${termsLang}.html"`);

  if (t.faq_q1 && t.faq_a1 && t.faq_q2 && t.faq_a2 && t.faq_q3 && t.faq_a3) {
    const faqItems = [
      [t.faq_q1, t.faq_a1],
      [t.faq_q2, t.faq_a2],
      [t.faq_q3, t.faq_a3]
    ].map(([q, a]) => {
      const qEsc = (q || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const aEsc = (a || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `{"@type":"Question","name":"${qEsc}","acceptedAnswer":{"@type":"Answer","text":"${aEsc}"}}`;
    }).join(',');
    const faqSchema = `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${faqItems}]}`;
    if (!out.includes('"@type":"FAQPage"')) {
      out = out.replace(
        /(<\/script>\s*)(<link rel="stylesheet" href="\/css\/landing\.css">)/,
        `$1<script type="application/ld+json">\n  ${faqSchema}\n  </script>\n\n  $2`
      );
    }
  }

  const hreflangBlock = buildHreflangLinks(allLangs);
  if (!out.includes('rel="alternate" hreflang')) {
    out = out.replace(
      '</head>',
      `\n${hreflangBlock}\n</head>`
    );
  } else {
    out = out.replace(
      /<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?/g,
      ''
    );
    out = out.replace('</head>', `\n${hreflangBlock}\n</head>`);
  }

  out = out.replace(/__LANG__/g, lang);

  return out;
}

function main() {
  const indexPath = path.join(buildDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found in', buildDir);
    process.exit(1);
  }

  const html = fs.readFileSync(indexPath, 'utf8');
  const translations = loadTranslations();
  const allLangs = Object.keys(translations).sort();

  const localeCatalogDir = path.join(buildDir, 'locale_catalog');
  if (fs.existsSync(localeCatalogDir)) {
    fs.rmSync(localeCatalogDir, { recursive: true });
  }

  for (const lang of allLangs) {
    const t = translations[lang];
    const pageHtml = generatePage(html, lang, t, allLangs);

    if (lang === DEFAULT_LANG) {
      fs.writeFileSync(indexPath, pageHtml, 'utf8');
      console.log(`✓ Generated index.html (${DEFAULT_LANG})`);
    } else {
      const langDir = path.join(buildDir, lang);
      fs.mkdirSync(langDir, { recursive: true });
      const outPath = path.join(langDir, 'index.html');
      fs.writeFileSync(outPath, pageHtml, 'utf8');
      console.log(`✓ Generated ${lang}/index.html`);
    }
  }

  console.log(`Generated ${allLangs.length} language variants.`);
}

main();
