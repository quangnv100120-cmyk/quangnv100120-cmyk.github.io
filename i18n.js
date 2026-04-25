// i18n.js

const I18N_STORAGE_KEY = 'impc_language';
const DEFAULT_LANG = 'vi';
const SUPPORTED_LANGS = ['vi', 'en'];

let currentLang = localStorage.getItem(I18N_STORAGE_KEY) || DEFAULT_LANG;
if (!SUPPORTED_LANGS.includes(currentLang)) {
    currentLang = DEFAULT_LANG;
}
let translations = {};

/**
 * Load translation JSON payload directly from memory to bypass CORS on file:// protocols
 */
async function loadTranslations(lang) {
    if (window.IMPC_LOCALES && window.IMPC_LOCALES[lang]) {
        return window.IMPC_LOCALES[lang];
    } else {
        console.error(`Translations for ${lang} could not be found in window.IMPC_LOCALES.`);
        return null;
    }
}

/**
 * Get nested translation value by key (e.g. "nav.home")
 */
function getTranslationValue(key) {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            return null; // translation missing
        }
    }
    return value;
}

/**
 * Update the DOM elements with data-i18n attribute
 */
function updateDOM() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslationValue(key);
        if (translation) {
            if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                el.placeholder = translation;
            } else {
                // If it contains custom HTML tag, innerHTML will keep it.
                // However, usually it's just text.
                el.innerHTML = translation;
            }
        }
    });

    // Handle elements that specifically need placeholder translation
    const plElements = document.querySelectorAll('[data-i18n-placeholder]');
    plElements.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = getTranslationValue(key);
        if (translation) {
            el.placeholder = translation;
        }
    });
}

/**
 * Initialize internationalization
 */
async function initI18n() {
    // 1. Load initial translations
    const loadedTranslations = await loadTranslations(currentLang);
    if (loadedTranslations) {
        translations = loadedTranslations;
        document.documentElement.lang = currentLang;
    }

    // 2. Update DOM initially
    updateDOM();

    // 3. Setup Language Switcher if it exists (for Custom Elements like header, we might need an event broadcast)
    updateSwitcherUI();
    
    // Dispatch event so other components know i18n is ready
    window.dispatchEvent(new CustomEvent('i18n-ready', { detail: { lang: currentLang } }));
}

/**
 * Change the website language actively
 */
window.setLanguage = async function(lang) {
    if (lang === currentLang) return; // early exit if same language
    if (!SUPPORTED_LANGS.includes(lang)) return;

    localStorage.setItem(I18N_STORAGE_KEY, lang);
    currentLang = lang;

    const newTranslations = await loadTranslations(lang);
    if (newTranslations) {
        translations = newTranslations;
        document.documentElement.lang = currentLang;
        updateDOM();
        updateSwitcherUI();
        window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang: currentLang } }));
    }
}

/**
 * Update all language switchers UI across the header/footer
 */
function updateSwitcherUI() {
    // For custom elements, we will dispatch events.
    // Or we can query selector specific switcher elements if defined.
    document.querySelectorAll('[data-lang]').forEach(btn => {
        const langValue = btn.getAttribute('data-lang');
        if (langValue === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update dropdown triggers
    document.querySelectorAll('.lang-switcher-trigger .current-lang-text').forEach(el => {
        el.textContent = currentLang === 'vi' ? 'VIE' : 'ENG';
    });
}

// Run when DOM is parsed
document.addEventListener('DOMContentLoaded', () => {
    initI18n();
});
