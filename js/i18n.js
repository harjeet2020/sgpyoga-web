/**
 * SGP Yoga - Improved Internationalization (i18n)
 * Dynamic loading of translation files organized by namespace
 */

class SGPi18n {
    constructor() {
        this.currentLanguage = 'en';
        this.supportedLanguages = ['en', 'es'];
        this.loadedNamespaces = new Set();
        this.translations = {};
        this.fallbackTranslations = {};
        this.isInitialized = false;
    }

    /**
     * Initialize the i18n system
     * @param {Object} options - Configuration options
     * @param {string[]} options.namespaces - Namespaces to preload
     * @param {string} options.defaultLang - Default language
     */
    async init(options = {}) {
        const {
            namespaces = ['common'],
            defaultLang = 'en'
        } = options;

        try {
            // Detect initial language
            this.currentLanguage = this.detectLanguage(defaultLang);
            
            // Load initial namespaces
            await this.loadNamespaces(namespaces);
            
            // Initialize i18next if available
            if (typeof i18next !== 'undefined') {
                await this.initI18next();
            }
            
            this.isInitialized = true;
            
            // Update navbar and content
            this.updateNavbarLanguageDisplay();
            this.updatePageContent();
            
            console.log('SGP i18n initialized successfully');
        } catch (error) {
            console.warn('SGP i18n initialization failed:', error);
            // Fall back to embedded translations if available
            this.isInitialized = true;
        }
    }

    /**
     * Detect the user's preferred language
     */
    detectLanguage(defaultLang) {
        const storedLang = localStorage.getItem('selectedLanguage');
        const browserLang = navigator.language.toLowerCase();
        const detectedLang = storedLang || (browserLang.startsWith('es') ? 'es' : defaultLang);
        
        return this.supportedLanguages.includes(detectedLang) ? detectedLang : defaultLang;
    }

    /**
     * Load translation namespaces
     * @param {string[]} namespaces - Array of namespace names to load
     */
    async loadNamespaces(namespaces) {
        const loadPromises = [];
        
        for (const namespace of namespaces) {
            if (!this.loadedNamespaces.has(namespace)) {
                loadPromises.push(this.loadNamespace(namespace));
            }
        }
        
        await Promise.all(loadPromises);
    }

    /**
     * Load a single namespace for all languages
     * @param {string} namespace - Namespace name (e.g., 'common', 'home')
     */
    async loadNamespace(namespace) {
        try {
            const loadPromises = this.supportedLanguages.map(lang => 
                this.loadTranslationFile(lang, namespace)
            );
            
            await Promise.all(loadPromises);
            this.loadedNamespaces.add(namespace);
            
            console.log(`Loaded namespace: ${namespace}`);
        } catch (error) {
            console.warn(`Failed to load namespace ${namespace}:`, error);
        }
    }

    /**
     * Load a translation file
     * @param {string} language - Language code
     * @param {string} namespace - Namespace name
     */
    async loadTranslationFile(language, namespace) {
        try {
            const response = await fetch(`locales/${language}/${namespace}.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const translations = await response.json();
            
            // Initialize language object if not exists
            if (!this.translations[language]) {
                this.translations[language] = {};
            }
            
            // Store translations under namespace
            this.translations[language][namespace] = translations;
            
        } catch (error) {
            console.warn(`Failed to load ${language}/${namespace}.json:`, error);
        }
    }

    /**
     * Initialize i18next with loaded translations
     */
    async initI18next() {
        const resources = {};
        
        // Convert our translation structure to i18next format
        for (const lang of this.supportedLanguages) {
            resources[lang] = {};
            
            if (this.translations[lang]) {
                for (const namespace in this.translations[lang]) {
                    resources[lang][namespace] = this.translations[lang][namespace];
                }
            }
        }

        return i18next
            .use(i18nextBrowserLanguageDetector)
            .init({
                debug: false,
                lng: this.currentLanguage,
                fallbackLng: 'en',
                defaultNS: 'common',
                ns: Array.from(this.loadedNamespaces),
                detection: {
                    order: ['localStorage', 'navigator', 'htmlTag'],
                    lookupLocalStorage: 'selectedLanguage',
                    caches: ['localStorage'],
                },
                resources
            });
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key (namespace:key.subkey or key.subkey)
     * @param {string} defaultText - Default text if translation not found
     * @returns {string} Translated text
     */
    t(key, defaultText = '') {
        // Use i18next if available and initialized
        if (typeof i18next !== 'undefined' && i18next.isInitialized) {
            return i18next.t(key, defaultText);
        }
        
        // Parse namespace and key
        const [namespace, keyPath] = this.parseKey(key);
        
        // Get translation from our loaded translations
        const translation = this.getNestedTranslation(
            this.translations[this.currentLanguage]?.[namespace], 
            keyPath
        );
        
        if (translation) return translation;
        
        // Fallback to English
        const fallback = this.getNestedTranslation(
            this.translations['en']?.[namespace], 
            keyPath
        );
        
        return fallback || defaultText || key;
    }

    /**
     * Parse a translation key to extract namespace and key path
     * @param {string} key - Full translation key
     * @returns {Array} [namespace, keyPath]
     */
    parseKey(key) {
        if (key.includes(':')) {
            const [namespace, keyPath] = key.split(':', 2);
            return [namespace, keyPath];
        }
        
        // Default to 'common' namespace
        return ['common', key];
    }

    /**
     * Get nested translation value
     * @param {Object} obj - Translation object
     * @param {string} keyPath - Dot-separated key path
     * @returns {string|null} Translation value or null
     */
    getNestedTranslation(obj, keyPath) {
        if (!obj) return null;
        
        const keys = keyPath.split('.');
        let current = obj;
        
        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }
        
        return typeof current === 'string' ? current : null;
    }

    /**
     * Change language and reload content
     * @param {string} languageCode - New language code
     */
    async changeLanguage(languageCode) {
        if (!this.supportedLanguages.includes(languageCode)) {
            console.warn('Unsupported language:', languageCode);
            return;
        }

        const previousLang = this.currentLanguage;
        this.currentLanguage = languageCode;

        try {
            // Update i18next if available
            if (typeof i18next !== 'undefined' && i18next.isInitialized) {
                await i18next.changeLanguage(languageCode);
            }

            // Update localStorage and HTML attributes
            localStorage.setItem('selectedLanguage', languageCode);
            document.documentElement.setAttribute('lang', languageCode);
            document.documentElement.setAttribute('data-lang', languageCode);

            // Update UI
            this.updateNavbarLanguageDisplay();
            this.updatePageContent();

            console.log(`Language changed from ${previousLang} to ${languageCode}`);
        } catch (error) {
            console.error('Error changing language:', error);
            this.currentLanguage = previousLang; // Revert on error
        }
    }

    /**
     * Load additional namespaces on demand
     * @param {string[]} namespaces - Namespaces to load
     */
    async loadNamespacesOnDemand(namespaces) {
        await this.loadNamespaces(namespaces);
        
        // Update i18next with new namespaces if available
        if (typeof i18next !== 'undefined' && i18next.isInitialized) {
            const resources = {};
            
            for (const lang of this.supportedLanguages) {
                resources[lang] = {};
                for (const namespace of namespaces) {
                    if (this.translations[lang]?.[namespace]) {
                        resources[lang][namespace] = this.translations[lang][namespace];
                    }
                }
            }
            
            // Add resources to i18next
            for (const lang of this.supportedLanguages) {
                for (const namespace of namespaces) {
                    if (resources[lang][namespace]) {
                        i18next.addResourceBundle(lang, namespace, resources[lang][namespace]);
                    }
                }
            }
        }
        
        // Update page content with new translations
        this.updatePageContent();
    }

    /**
     * Update navbar language display
     */
    updateNavbarLanguageDisplay() {
        const currentFlag = document.getElementById('currentFlag');
        const currentLangCode = document.getElementById('currentLangCode');
        
        if (!currentFlag || !currentLangCode) return;
        
        const languages = {
            'en': { flag: '🇺🇸', code: 'EN' },
            'es': { flag: '🇲🇽', code: 'ES' }
        };
        
        const selectedLang = languages[this.currentLanguage];
        if (selectedLang) {
            currentFlag.textContent = selectedLang.flag;
            currentLangCode.textContent = selectedLang.code;
        }
    }

    /**
     * Update all translatable elements on the page
     */
    updatePageContent() {
        // Update elements with data-i18n attribute
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translatedText = this.t(key, element.textContent);
            element.textContent = translatedText;
        });

        // Update page title
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const titleKey = titleElement.getAttribute('data-i18n');
            document.title = this.t(titleKey, document.title);
        }

        // Update meta descriptions
        const metaDescriptions = document.querySelectorAll('meta[name="description"][data-i18n]');
        metaDescriptions.forEach(meta => {
            const key = meta.getAttribute('data-i18n');
            meta.setAttribute('content', this.t(key, meta.getAttribute('content')));
        });

        // Update placeholders
        const elementsWithPlaceholders = document.querySelectorAll('[data-i18n-placeholder]');
        elementsWithPlaceholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.setAttribute('placeholder', this.t(key, element.getAttribute('placeholder')));
        });

        // Update aria-labels
        const elementsWithAriaLabels = document.querySelectorAll('[data-i18n-aria-label]');
        elementsWithAriaLabels.forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            element.setAttribute('aria-label', this.t(key, element.getAttribute('aria-label')));
        });
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    /**
     * Translate page elements (alias for updatePageContent)
     * This is called by other scripts to re-translate elements
     */
    translatePageElements() {
        this.updatePageContent();
    }
}

// Create global instance
const sgpI18n = new SGPi18n();

/**
 * Detect the current page and return the corresponding namespace
 * @returns {string|null} The namespace for the current page, or null if not found
 */
function detectPageNamespace() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    // Map filenames to namespaces
    const pageNamespaceMap = {
        'index.html': 'home',
        'about.html': 'about',
        'classes.html': 'classes',
        'events.html': 'events',
        'blog.html': 'blog'
    };
    
    // Handle root path
    if (filename === '' || filename === '/') {
        return 'home';
    }
    
    return pageNamespaceMap[filename] || null;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    // Detect current page namespace
    const pageNamespace = detectPageNamespace();
    
    // Build namespaces array - always include common, plus page-specific namespace
    const namespaces = ['common'];
    
    // Add page-specific namespace if detected
    if (pageNamespace && pageNamespace !== 'common') {
        namespaces.push(pageNamespace);
    }
    
    // Add testimonials namespace for home page
    if (pageNamespace === 'home') {
        namespaces.push('testimonials');
    }
    
    console.log('Initializing i18n with namespaces:', namespaces);
    
    await sgpI18n.init({
        namespaces: namespaces,
        defaultLang: 'en'
    });
});

// Listen for language change events from navbar
document.addEventListener('languageChanged', function(event) {
    const newLanguage = event.detail.language;
    sgpI18n.changeLanguage(newLanguage);
});

// Export for global use
if (typeof window !== 'undefined') {
    window.SGPi18n = sgpI18n;
}
