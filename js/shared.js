(() => {
  "use strict";
  const html = document.documentElement;
  const T = window.BauViTechTranslations;
  const get = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Storage may be unavailable; controls still work. */ } };
  function changeLang(value) {
    const lang = Object.hasOwn(T, value) ? value : 'es';
    html.lang = lang;
    save('bvt-lang', lang);
    document.querySelectorAll('[data-lang]').forEach(el => {
      const active = el.dataset.lang === lang;
      el.classList.toggle('active', active);
      el.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const text = T[lang][el.dataset.i18n];
      if (text === undefined) return;
      if (el.matches('input, textarea')) el.placeholder = text;
      else el.textContent = text;
    });
    const desc = document.getElementById('f-desc');
    if (desc && T[lang]['desc.placeholder']) desc.placeholder = T[lang]['desc.placeholder'];
    const button = document.getElementById('hamburger');
    if (button) button.setAttribute('aria-label', lang === 'en' ? 'Menu' : 'Menú');
  }
  function applyTheme(value) {
    const theme = value === 'light' ? 'light' : 'dark';
    html.classList.toggle('dark', theme === 'dark');
    html.classList.toggle('light', theme === 'light');
    ['icon-sun','icon-sun-m'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = theme === 'dark' ? 'none' : 'block'; });
    ['icon-moon','icon-moon-m'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = theme === 'dark' ? 'block' : 'none'; });
    updateProductLogos(theme);
    save('bvt-theme', theme);
  }
  document.querySelectorAll('[data-lang]').forEach(el => el.addEventListener('click', () => changeLang(el.dataset.lang)));
  ['theme-toggle','theme-toggle-m'].forEach(id => document.getElementById(id)?.addEventListener('click', () => applyTheme(html.classList.contains('dark') ? 'light' : 'dark')));
  const ham = document.getElementById('hamburger'), menu = document.getElementById('mobileMenu');
  function setMenu(open) { menu?.classList.toggle('open', open); ham?.setAttribute('aria-expanded', String(open)); }
  ham?.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.classList.contains('open')) { setMenu(false); ham?.focus(); } });
  const productLogos = [];
  document.querySelectorAll('[data-product-logo]').forEach(cover => {
    const image = cover.querySelector('img');
    const fallback = cover.querySelector('.project-logo-fallback');
    if (!image || !fallback) return;
    const show = loaded => { image.hidden = !loaded; fallback.hidden = loaded; };
    image.addEventListener('load', () => show(image.naturalWidth > 0));
    image.addEventListener('error', () => show(false));
    productLogos.push({image, show});
  });
  function updateProductLogos(theme) {
    productLogos.forEach(({image, show}) => {
      const desired = theme === 'light' ? image.dataset.logoLight : image.dataset.logoDark;
      if (desired && image.getAttribute('src') !== desired) {
        show(false);
        image.setAttribute('src', desired);
      }
      if (image.complete) show(image.naturalWidth > 0);
    });
  }
  applyTheme(get('bvt-theme', 'dark'));
  changeLang(get('bvt-lang', 'es'));
})();
