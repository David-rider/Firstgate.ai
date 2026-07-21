// Firstgate.ai i18n Core Engine (Seamless Multi-Language DOM Renderer)
import { translations } from './translations.js';

let currentLang = localStorage.getItem('fg_lang') || 'en';

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('fg_lang', lang);
  
  // Sync all language selectors on the page
  document.querySelectorAll('select[onchange*="setLang"]').forEach(sel => {
    sel.value = lang;
  });

  updateDOM();
  window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
}
window.setLang = setLang;

export function t(key) {
  const dict = translations[currentLang] || translations['en'];
  return dict[key] || translations['en'][key] || key;
}

export function updateDOM() {
  const lang = currentLang;
  const dict = translations[lang] || translations['en'];

  // Update text & HTML content for data-i18n
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    const val = dict[key] || translations['en'][key];
    if (val !== undefined) {
      if (val.includes('<') && val.includes('>')) {
        elem.innerHTML = val;
      } else {
        elem.textContent = val;
      }
    }
  });

  // Update placeholders for data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
    const key = elem.getAttribute('data-i18n-placeholder');
    const val = dict[key] || translations['en'][key];
    if (val !== undefined) {
      elem.setAttribute('placeholder', val);
    }
  });

  document.documentElement.lang = lang;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('select[onchange*="setLang"]').forEach(sel => {
    sel.value = currentLang;
  });
  updateDOM();
});
