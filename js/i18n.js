/**
 * SGP Yoga - Internationalization (i18n)
 * Handles text translations for English and Spanish
 */

// Translation resources
const translations = {
    en: {
        nav: {
            home: "Home",
            about: "About",
            classes: "Classes", 
            events: "Events",
            blog: "Blog"
        },
        home: {
            welcome: "Welcome to SGP Yoga",
            subtitle: "Find your inner peace in the heart of Mexico City"
        }
    },
    es: {
        nav: {
            home: "Inicio",
            about: "Acerca De",
            classes: "Clases",
            events: "Eventos", 
            blog: "Blog"
        },
        home: {
            welcome: "Bienvenido a SGP Yoga",
            subtitle: "Encuentra tu paz interior en el corazón de la Ciudad de México"
        }
    }
};

// Current language state
let currentLanguage = 'en';

/**
 * Initialize i18next with our translations
 */
function initializeI18n() {
    // Check if i18next is available
    if (typeof i18next === 'undefined') {
        console.warn('i18next is not loaded. Using fallback translation system.');
        initializeFallbackI18n();
        return;
    }
    
    // Get the initial language from localStorage or browser detection
    const storedLang = localStorage.getItem('selectedLanguage');
    const browserLang = navigator.language.toLowerCase();
    const detectedLang = storedLang || (browserLang.startsWith('es') ? 'es' : 'en');
    
    i18next
        .use(i18nextBrowserLanguageDetector)
        .init({
            debug: false,
            lng: detectedLang, // Set the language explicitly
            fallbackLng: 'en',
            detection: {
                order: ['localStorage', 'navigator', 'htmlTag'],
                lookupLocalStorage: 'selectedLanguage',
                caches: ['localStorage'],
            },
            resources: {
                en: {
                    translation: translations.en
                },
                es: {
                    translation: translations.es
                }
            }
        })
        .then(function() {
            currentLanguage = i18next.language || detectedLang;
            
            // Update the navbar dropdown to match the current language
            updateNavbarLanguageDisplay(currentLanguage);
            
            // Update page content
            updatePageContent();
        })
        .catch(function(error) {
            console.warn('i18next initialization failed:', error);
            initializeFallbackI18n();
        });
}

/**
 * Update navbar language display to match current language
 */
function updateNavbarLanguageDisplay(langCode) {
    const currentFlag = document.getElementById('currentFlag');
    const currentLangCode = document.getElementById('currentLangCode');
    
    if (!currentFlag || !currentLangCode) return;
    
    const languages = {
        'en': { flag: '🇺🇸', code: 'EN' },
        'es': { flag: '🇲🇽', code: 'ES' }
    };
    
    const selectedLang = languages[langCode];
    if (selectedLang) {
        currentFlag.textContent = selectedLang.flag;
        currentLangCode.textContent = selectedLang.code;
    }
}

/**
 * Fallback i18n system if i18next is not available
 */
function initializeFallbackI18n() {
    // Get language from localStorage or detect from browser
    const storedLang = localStorage.getItem('selectedLanguage');
    const browserLang = navigator.language.toLowerCase();
    
    currentLanguage = storedLang || (browserLang.startsWith('es') ? 'es' : 'en');
    
    // Update the navbar dropdown to match the current language
    updateNavbarLanguageDisplay(currentLanguage);
    
    // Update page content
    updatePageContent();
}

/**
 * Get translated text for a given key
 * @param {string} key - The translation key (e.g., 'nav.home')
 * @param {string} [defaultText] - Default text if translation not found
 * @returns {string} - Translated text
 */
function t(key, defaultText = '') {
    // Use i18next if available
    if (typeof i18next !== 'undefined' && i18next.isInitialized) {
        return i18next.t(key, defaultText);
    }
    
    // Fallback translation system
    const keys = key.split('.');
    let translation = translations[currentLanguage];
    
    for (const k of keys) {
        if (translation && translation[k]) {
            translation = translation[k];
        } else {
            // Fallback to English if key not found
            translation = translations['en'];
            for (const k of keys) {
                if (translation && translation[k]) {
                    translation = translation[k];
                } else {
                    return defaultText || key;
                }
            }
            break;
        }
    }
    
    return typeof translation === 'string' ? translation : (defaultText || key);
}

/**
 * Update all page content with current language
 */
function updatePageContent() {
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translatedText = t(key, element.textContent);
        
        // Update the element's text content
        element.textContent = translatedText;
    });
    
    // Update page title if it has a translation key
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
        const titleKey = titleElement.getAttribute('data-i18n');
        document.title = t(titleKey, document.title);
    }
    
    // Update any meta descriptions with translation keys
    const metaDescriptions = document.querySelectorAll('meta[name="description"][data-i18n]');
    metaDescriptions.forEach(meta => {
        const key = meta.getAttribute('data-i18n');
        meta.setAttribute('content', t(key, meta.getAttribute('content')));
    });
    
    // Update placeholders
    const elementsWithPlaceholders = document.querySelectorAll('[data-i18n-placeholder]');
    elementsWithPlaceholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.setAttribute('placeholder', t(key, element.getAttribute('placeholder')));
    });
    
    // Update aria-labels
    const elementsWithAriaLabels = document.querySelectorAll('[data-i18n-aria-label]');
    elementsWithAriaLabels.forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');
        element.setAttribute('aria-label', t(key, element.getAttribute('aria-label')));
    });
}

/**
 * Change the current language
 * @param {string} languageCode - Language code ('en' or 'es')
 */
function changeLanguage(languageCode) {
    if (languageCode !== 'en' && languageCode !== 'es') {
        console.warn('Invalid language code:', languageCode);
        return;
    }
    
    currentLanguage = languageCode;
    
    // Update i18next if available
    if (typeof i18next !== 'undefined' && i18next.isInitialized) {
        i18next.changeLanguage(languageCode).then(() => {
            updatePageContent();
        });
    } else {
        // Use fallback system
        updatePageContent();
    }
    
    // Store in localStorage
    localStorage.setItem('selectedLanguage', languageCode);
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', languageCode);
    document.documentElement.setAttribute('data-lang', languageCode);
}

/**
 * Get the current language code
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Add a new translation key-value pair
 * @param {string} language - Language code
 * @param {string} key - Translation key
 * @param {string} value - Translation value
 */
function addTranslation(language, key, value) {
    if (!translations[language]) {
        translations[language] = {};
    }
    
    const keys = key.split('.');
    let obj = translations[language];
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) {
            obj[keys[i]] = {};
        }
        obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = value;
}

// Initialize i18n when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeI18n();
});

// Listen for language change events from navbar
document.addEventListener('languageChanged', function(event) {
    const newLanguage = event.detail.language;
    if (newLanguage !== currentLanguage) {
        changeLanguage(newLanguage);
    }
});

// Export functions for global use
if (typeof window !== 'undefined') {
    window.SGPi18n = {
        t,
        changeLanguage,
        getCurrentLanguage,
        addTranslation,
        updatePageContent
    };
}
