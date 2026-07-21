// Firstgate.ai i18n Controller
import { translations } from './translations.js';

let currentLang = localStorage.getItem('firstgate_lang') || 'en';

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('firstgate_lang', lang);
  updateDOM();
  
  // Dispatch custom event for dynamic components (charts, simulator, audit logs)
  window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
}

export function t(key) {
  const dict = translations[currentLang] || translations['en'];
  return dict[key] || translations['en'][key] || key;
}

export function updateDOM() {
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    const translation = t(key);
    if (translation) {
      elem.innerText = translation;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
    const key = elem.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    if (translation) {
      elem.setAttribute('placeholder', translation);
    }
  });

  // Update Language Selector UI buttons/selects
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = currentLang;
  }
}

// Global window attachment for inline HTML events
window.setLang = setLang;
window.t = t;
