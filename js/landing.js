// Localization for landing page - loads from locales/*.json
let translations = {};

const CACHE_BUST = Date.now();

function getLocalesPath() {
  return new URL('/locales/', window.location.origin).href;
}

async function loadTranslationsForLang(lang) {
  if (translations[lang]) return translations[lang];
  const base = getLocalesPath();
  try {
    const defaultRes = await fetch(base + 'default.json?v=' + CACHE_BUST);
    const defaultT = await defaultRes.json();
    let langT = {};
    if (lang !== 'en') {
      const langRes = await fetch(base + lang + '.json?v=' + CACHE_BUST);
      if (langRes.ok) langT = await langRes.json();
    }
    translations[lang] = Object.assign({}, defaultT, langT);
    return translations[lang];
  } catch (e) {
    console.warn('Failed to load locale', lang, e);
    translations[lang] = translations.en || {};
    return translations[lang];
  }
}

const SUPPORTED_LANGS = ['en', 'ru', 'de', 'fr', 'es', 'es-419', 'it', 'pt-BR', 'ja', 'ko', 'zh-Hans', 'zh-Hant', 'nl', 'sv', 'no', 'ar', 'hi', 'tr', 'pl', 'id', 'th', 'vi', 'uk', 'ca', 'cs', 'da', 'el', 'fi', 'he', 'hr', 'hu', 'ms', 'ro', 'sk'];

function getLangFromPath() {
  const path = window.location.pathname;
  for (const tag of SUPPORTED_LANGS) {
    const prefix = '/' + tag + '/';
    if (path === prefix || path.startsWith(prefix)) return tag;
  }
  if (path === '/' || path === '/en' || path.startsWith('/en/')) return 'en';
  return 'en';
}

function getBrowserPreferredLang() {
  const raw = navigator.language || navigator.userLanguage || 'en';
  const [lang, region] = raw.split('-').map((s) => s && s.toLowerCase());
  if (!lang) return 'en';
  const langRegion = lang + (region ? '-' + region : '');
  if (SUPPORTED_LANGS.includes(langRegion)) return langRegion;
  if (lang === 'zh') return region === 'tw' || region === 'hk' ? 'zh-Hant' : 'zh-Hans';
  if (lang === 'pt') return region === 'br' ? 'pt-BR' : 'pt-BR';
  if (lang === 'es' && region === '419') return 'es-419';
  const match = SUPPORTED_LANGS.find((tag) => tag.toLowerCase().startsWith(lang));
  return match || 'en';
}

function getEffectiveLang() {
  const path = window.location.pathname;
  const fromPath = getLangFromPath();
  if (fromPath !== 'en' || (path !== '/' && path !== '/en' && !path.startsWith('/en/'))) {
    return fromPath;
  }
  return getBrowserPreferredLang();
}

window.getEffectiveLang = getEffectiveLang;

function getBasePath() {
  const path = window.location.pathname;
  if (path === '/' || path === '') return '/';
  const segments = path.split('/').filter(Boolean);
  const first = segments[0];
  if (first && SUPPORTED_LANGS.includes(first)) return '/' + first + '/';
  return '/';
}

let localeCatalog = [];

async function loadLocaleCatalog() {
  if (localeCatalog.length) return localeCatalog;
  const base = getLocalesPath();
  try {
    const res = await fetch(base + 'locale_catalog.json?v=' + CACHE_BUST);
    localeCatalog = await res.json();
    return localeCatalog;
  } catch (e) {
    console.warn('Failed to load locale catalog', e);
    return [];
  }
}

const FALLBACK_LABELS = { en: 'English', ru: 'Русский', de: 'Deutsch', fr: 'Français', es: 'Español', uk: 'Українська', ja: '日本語', ko: '한국어', zh: '中文', it: 'Italiano', pt: 'Português', nl: 'Nederlands', sv: 'Svenska', no: 'Norsk', ar: 'العربية', hi: 'हिन्दी', tr: 'Türkçe', pl: 'Polski', id: 'Bahasa Indonesia', th: 'ไทย', vi: 'Tiếng Việt' };

async function getCurrentLocaleLabel(lang) {
  try {
    const catalog = await loadLocaleCatalog();
    const item = catalog.find((x) => x.tag.toLowerCase() === lang.toLowerCase());
    if (item) return item.nativeName;
  } catch (e) {
    console.warn('Locale catalog load failed', e);
  }
  return FALLBACK_LABELS[lang] || FALLBACK_LABELS[lang.split('-')[0]] || lang;
}

async function applyTranslations() {
  const lang = getEffectiveLang();
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);

  const basePath = getBasePath();

  // Fix nav anchor links to preserve path (prevents language reset on click)
  document.querySelectorAll('nav a[href^="#"]').forEach(a => {
    const hash = a.getAttribute('href');
    if (hash && hash.startsWith('#')) {
      a.href = basePath + hash;
    }
  });

  // Update image paths to use correct language folder
  document.querySelectorAll('img[src*="__LANG__"]').forEach(img => {
    img.src = img.src.replace('__LANG__', lang);
  });

  // Update current language label (globe button)
  const labelEl = document.getElementById('lang-current-label');
  if (labelEl) {
    labelEl.textContent = await getCurrentLocaleLabel(lang);
  }

  const t = await loadTranslationsForLang(lang);

  // Update loading text
  const loadingText = document.getElementById('loading-text');
  if (loadingText && t.loading_text) loadingText.innerText = t.loading_text;

  // Apply translations
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.innerText = t[key];
  });

  // Update footer legal links based on language
  updateFooterLegalLinks(lang);
  updateFooterNavLinks(lang);
}

function updateFooterLegalLinks(lang) {
  const privacyLang = ['en', 'ru', 'de', 'es', 'fr'];
  const termsLang = ['en', 'ru'];
  const privacySuffix = privacyLang.includes(lang) ? '-' + lang : '-en';
  const termsSuffix = termsLang.includes(lang) ? '-' + lang : '-en';
  document.querySelectorAll('footer a[href^="/privacy-policy-"]').forEach(a => {
    a.href = '/privacy-policy' + privacySuffix + '.html';
  });
  document.querySelectorAll('footer a[href^="/terms-"]').forEach(a => {
    a.href = '/terms' + termsSuffix + '.html';
  });
}

function updateFooterNavLinks(lang) {
  const langPrefix = lang === 'en' ? '' : '/' + lang;
  const landingPages = ['/ai-homework-helper/', '/parental-control-learning/', '/ai-checks-homework/', '/family-chat/', '/exam-prep-podcast/'];
  landingPages.forEach(path => {
    document.querySelectorAll(`footer a[href="${path}"]`).forEach(a => {
      a.href = path + (lang === 'en' ? '' : '?lang=' + lang);
    });
  });
  document.querySelectorAll('footer a[href="/blog/"]').forEach(a => {
    a.href = '/blog/' + (lang === 'en' ? '' : '?lang=' + lang);
  });
  document.querySelectorAll('footer a[href="/glossary/"]').forEach(a => {
    a.href = '/glossary/' + (lang === 'en' ? '' : '?lang=' + lang);
  });
  document.querySelectorAll('footer a[href="/qa/"]').forEach(a => {
    a.href = '/qa/' + (lang === 'en' ? '' : '?lang=' + lang);
  });
}

// Apply translations (async - runs on load)
applyTranslations();

// Theme Switcher Logic
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const sunIcon = toggleBtn.querySelector('.sun-icon');
  const moonIcon = toggleBtn.querySelector('.moon-icon');
  
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    document.body.classList.add('light-mode');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }

  const isDark = () => document.body.classList.contains('dark-mode');

  const setThemeColor = (dark) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#111424' : '#f6f8ff';
  };

  toggleBtn.addEventListener('click', () => {
    window.trackLandingEvent?.('theme_toggle', { from: isDark() ? 'dark' : 'light' });
    if (isDark()) {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
      setThemeColor(false);
      updateHeroImage(false);
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
      setThemeColor(true);
      updateHeroImage(true);
    }
  });

  setThemeColor(isDark());
  updateHeroImage(isDark());
}

function initNavHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const navMenu = document.getElementById('nav-menu');
  const backdrop = document.getElementById('nav-menu-backdrop');
  if (!hamburger || !navMenu) return;

  function setMenuOpen(open) {
    hamburger.setAttribute('aria-expanded', open);
    navMenu.classList.toggle('nav-menu--open', open);
    if (backdrop) {
      backdrop.classList.toggle('nav-menu-backdrop--visible', open);
      backdrop.setAttribute('aria-hidden', !open);
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  if (backdrop) {
    backdrop.addEventListener('click', () => setMenuOpen(false));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
    }
  });

  navMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setMenuOpen(false));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLangDialog();
  initNavHamburger();
  initVideoModal();
});

function initVideoModal() {
  const playBtn = document.getElementById('hero-play-btn');
  if (!playBtn) return;

  const VIDEOS = {
    dark: '_O5AC9LOUXg',
    light: 'YhcPLZuTuSE',
  };

  function isDark() {
    return document.body.classList.contains('dark-mode');
  }

  playBtn.addEventListener('click', () => {
    const videoId = isDark() ? VIDEOS.dark : VIDEOS.light;
    window.trackLandingEvent?.('hero_video_play', { theme: isDark() ? 'dark' : 'light', videoId });
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
  });
}

function updateHeroImage(dark) {
  const img = document.getElementById('hero-img');
  if (!img) return;
  img.src = dark ? img.dataset.dark : img.dataset.light;
}

function initLangDialog() {
  const btn = document.getElementById('lang-globe-btn');
  const dialog = document.getElementById('lang-dialog');
  const list = document.getElementById('lang-list');
  const search = document.getElementById('lang-search');
  if (!btn || !dialog || !list) return;

  function renderList(query) {
    const q = (query || '').trim().toLowerCase();
    const filtered = localeCatalog.filter((item) => {
      if (!q) return true;
      return (
        item.nativeName.toLowerCase().includes(q) ||
        item.englishName.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
      );
    });
  const lang = getEffectiveLang();
  list.innerHTML = filtered
      .map(
        (item) => {
          const isSelected = item.tag.toLowerCase() === lang.toLowerCase();
          const url = item.tag === 'en' ? '/' : '/' + item.tag + '/';
          return `<a href="${url}" class="lang-dialog-item ${isSelected ? 'lang-dialog-item--selected' : ''}" role="option" aria-selected="${isSelected}">
            <span class="lang-dialog-item-native">${escapeHtml(item.nativeName)}</span>
            <span class="lang-dialog-item-english">${escapeHtml(item.englishName)}</span>
            ${isSelected ? '<span class="lang-dialog-item-check">✓</span>' : ''}
          </a>`;
        }
      )
      .join('');
  }

  function escapeHtml(s) {
    if (!s) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  btn.addEventListener('click', async () => {
    await loadLocaleCatalog();
    renderList(search.value);
    search.value = '';
    dialog.showModal();
    search.focus();
  });

  search.addEventListener('input', () => renderList(search.value));
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => search.blur());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dialog.close();
  });

  list.addEventListener('click', (e) => {
    const item = e.target.closest('.lang-dialog-item');
    if (item && item.href) {
      try {
        const url = new URL(item.href);
        const segs = url.pathname.split('/').filter(Boolean);
        const lang = segs[0] || 'en';
        window.trackLandingEvent?.('language_selected', { language: lang });
      } catch (_) {}
    }
  });
}

// Core Logic: Boot Flutter App
window.flutterBooted = false;

window.revealLandingPage = function() {
  if (window.flutterBooted) return;
  window.authChecked = true;

  const appLoader = document.getElementById('app-loader');
  if (appLoader) {
    appLoader.style.display = 'none';
  }

  const landingPage = document.getElementById('landing-page');
  if (landingPage) {
    landingPage.style.display = 'flex';
  }

  document.body.style.overflow = 'auto';

  window.trackLandingEvent?.('landing_page_view', {
    page_language: typeof window.getEffectiveLang === 'function' ? window.getEffectiveLang() : 'en',
    page_location: window.location.pathname || '/',
  });
};

window.recoverFromFailedAppBoot = function() {
  window.flutterBooted = false;
  window.authChecked = false;

  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.style.display = 'none';
  }

  const landingPage = document.getElementById('landing-page');
  if (landingPage) {
    landingPage.style.display = 'flex';
  }

  const seoShell = document.getElementById('public-course-seo');
  if (seoShell) {
    seoShell.style.display = 'block';
  }

  document.body.style.overflow = 'auto';
};

window.startApp = function(source) {
  if (window.flutterBooted) return;
  window.flutterBooted = true;
  window.authChecked = true;

  window.trackLandingEvent?.('cta_click', { source: source || 'cta' });

  const lang = getEffectiveLang();
  window.landingLocale = lang;

  // UI Transition (SEO /c/{uuid} pages may omit the marketing landing shell)
  const landingPage = document.getElementById('landing-page');
  if (landingPage) {
    landingPage.style.display = 'none';
  }
  const seoShell = document.getElementById('public-course-seo');
  if (seoShell) {
    seoShell.style.display = 'none';
  }
  const appLoader = document.getElementById('app-loader');
  if (appLoader) {
    appLoader.style.display = 'flex';
  }
  document.body.style.overflow = 'hidden'; // Lock scrolling

  const hideLoaderWhenFlutterReady = () => {
    const hasFlutterView =
      document.querySelector('flutter-view') ||
      document.querySelector('flt-glass-pane') ||
      document.querySelector('flt-scene-host');

    if (hasFlutterView) {
      const loader = document.getElementById('app-loader');
      if (loader) {
        loader.style.display = 'none';
      }
      return true;
    }
    return false;
  };

  const failBoot = (reason) => {
    console.error('Flutter boot failed:', reason);
    window.recoverFromFailedAppBoot?.();
  };

  // Inject Flutter Bootstrap using baseHref to fix routing on subpaths like /ru/
  const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
  const version = 'f9d77b6-1788588988'; // Replaced by build process if needed
  const script = document.createElement('script');
  script.src = baseHref + 'flutter_bootstrap.js?v=' + version;
  script.crossOrigin = 'anonymous';
  script.async = true;
  script.onerror = () => failBoot('flutter_bootstrap.js failed to load');
  document.body.appendChild(script);

  let attempts = 0;
  const maxAttempts = 150;
  const timer = setInterval(() => {
    attempts += 1;
    if (hideLoaderWhenFlutterReady()) {
      clearInterval(timer);
      return;
    }
    if (attempts >= maxAttempts) {
      clearInterval(timer);
      failBoot('Flutter view did not mount in time');
    }
  }, 100);
};

// OAuth callback handling
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');

  if (code || state || error) {
    window.oauthParams = { code, state, error };
    window.oauthParamsReady = true;

    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    
    // If we have OAuth params, boot the app immediately to handle them
    window.startApp('cta');
  } else {
    window.oauthParams = null;
    window.oauthParamsReady = false;
  }
})();

// Public shared course link (/c/{uuid}): guests must boot Flutter; otherwise only the
// marketing shell loads and Dart never reads Uri.base.
// Match "c" + UUID anywhere in the path (root /c/…, GitHub Pages /repo/c/…, etc.)
(function bootPublicCourseDeepLink() {
  if (typeof window.startApp !== 'function') return;
  const segs = (window.location.pathname || '').split('/').filter(Boolean);
  const uuidRe =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  for (let i = 0; i < segs.length - 1; i++) {
    if (segs[i] === 'c' && uuidRe.test(segs[i + 1])) {
      window.startApp('public_course_link');
      return;
    }
  }
})();

// Service worker cleanup
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        if (!registration.active || !registration.active.scriptURL.includes(window.location.hostname)) {
          registration.unregister();
        } else {
          try {
            registration.update();
          } catch (e) {
            console.warn('SW update failed:', e);
          }
        }
      }
    });
  });
}
