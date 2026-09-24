/**
 * SGP Yoga - Improved Internationalization (i18n)
 * Dynamic loading of translation files organized by namespace
 */

/**
 * Generated namespaces that must be read through an authored one.
 *
 * @remarks
 * Maps a generated namespace to the authored namespace and top-level key it
 * is grafted under by {@link SGPi18n#composeGeneratedNamespaces}. The
 * `schedule` namespace is absent because the classes page reads it directly
 * as `schedule:*`.
 */
const GENERATED_NAMESPACE_TARGETS = {
    eventContent: { into: 'events', at: 'events' }
};

/**
 * Is this path part of the blog (`/blog/...` or `/es/blog/...`)?
 *
 * @remarks
 * Blog pages are built by Eleventy with their text already in one language,
 * so they're never translated in place: the URL decides the language, and
 * switching language means navigating to the translated post.
 *
 * @param {string} path - A URL pathname, e.g. `window.location.pathname`.
 * @returns {boolean} True for the blog indexes and posts in either language.
 */
function isBlogPath(path) {
    return /^\/(es\/)?blog(\/|$)/.test(path);
}

/**
 * Find the URL of the current blog page in another language.
 *
 * @remarks
 * Blog slugs are translated (`/blog/yoga-styles/` ↔ `/es/blog/estilos-de-yoga/`),
 * so the other URL can't be worked out from this one. Every blog page already
 * names its translations in `<link rel="alternate" hreflang="…">` tags (see
 * `blog/src/_includes/layouts/base.njk`), so we read them. Only the pathname
 * is used, so this also works on localhost. A post with no translation falls
 * back to that language's blog index.
 *
 * @param {string} languageCode - Target language, `en` or `es`.
 * @returns {string} A pathname such as `/es/blog/estilos-de-yoga/`.
 */
function getBlogTranslationPath(languageCode) {
    const alternate = document.querySelector(`link[rel="alternate"][hreflang="${languageCode}"]`);
    if (alternate && alternate.href) {
        return new URL(alternate.href).pathname;
    }
    return languageCode === 'es' ? '/es/blog/' : '/blog/';
}

class SGPi18n {
    constructor() {
        this.currentLanguage = 'en';
        this.supportedLanguages = ['en', 'es'];
        this.loadedNamespaces = new Set();
        this.translations = {};
        this.fallbackTranslations = {};
        this.isInitialized = false;
        this.isChangingLanguage = false; // Guard against recursive calls
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

            // Graft generated namespaces into the authored ones that are read from
            this.composeGeneratedNamespaces();

            // Initialize i18next if available
            if (typeof i18next !== 'undefined') {
                await this.initI18next();
            }
            
            this.isInitialized = true;
            
            // Update navbar and content
            this.updateNavbarLanguageDisplay();
            this.updatePageContent();
        } catch (error) {
            console.warn('SGP i18n initialization failed:', error);
            // Fall back to embedded translations if available
            this.isInitialized = true;
        }
    }

    /**
     * Detect the user's preferred language
     * First checks URL path, then localStorage, then browser language
     * IMPORTANT: URL path is always the source of truth
     */
    detectLanguage(defaultLang) {
        const currentPath = window.location.pathname;
        
        // Priority 1: Check if we're on a Spanish URL path
        // If URL explicitly indicates language, trust it completely
        if (currentPath.startsWith('/es/')) {
            // We're on a Spanish URL, don't redirect
            localStorage.setItem('selectedLanguage', 'es');
            return 'es';
        }
        
        // English blog (/blog/...): its content is English, so trust the URL.
        // (The Spanish blog lives under /es/blog/ and was handled above.)
        if (isBlogPath(currentPath)) {
            localStorage.setItem('selectedLanguage', 'en');
            return 'en';
        }
        
        // If we're on root (English) path, respect localStorage if available
        // But don't redirect - let the user stay where they are
        const storedLang = localStorage.getItem('selectedLanguage');
        
        // Priority 2: Check localStorage
        if (storedLang && this.supportedLanguages.includes(storedLang)) {
            return storedLang;
        }
        
        // Priority 3: Check browser language
        const browserLang = navigator.language.toLowerCase();
        const detectedLang = browserLang.startsWith('es') ? 'es' : defaultLang;
        
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
            const response = await fetch(`/locales/${language}/${namespace}.json`);
            
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
     * Grafts each loaded generated namespace into the authored namespace its
     * readers look it up in, in memory only.
     *
     * @remarks
     * `events:events.<id>.title` is the shape fixed by contract C2 in
     * MIGRATION.md. Its reader, `js/eventSchema.js`, has been retired (the
     * events' structured data is now rendered at build time), but the graft
     * is kept so C2 still holds until it is revisited. Contract C1 forbids the
     * build from writing generated keys into the hand-written `events.json`.
     * So the build writes them to their own file, `eventContent.json`, and
     * this method places that file's entries under `events.events` after both
     * have loaded. The files stay separate on disk.
     *
     * The event cards do not need the graft: they are pre-rendered with
     * `data-i18n="eventContent:<id>.*"`, which resolves against the
     * `eventContent` namespace directly, because `build-i18n.js` never sees
     * this in-memory copy.
     *
     * The generated file's `_comment` key is dropped rather than grafted,
     * since it would otherwise look like an event id.
     *
     * @returns {void}
     */
    composeGeneratedNamespaces() {
        for (const [generated, { into, at }] of Object.entries(GENERATED_NAMESPACE_TARGETS)) {
            if (!this.loadedNamespaces.has(generated)) continue;

            for (const lang of this.supportedLanguages) {
                const source = this.translations[lang]?.[generated];
                const target = this.translations[lang]?.[into];
                if (!source || !target) continue;

                const { _comment, ...entries } = source;
                target[at] = entries;
            }
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
                interpolation: {
                    escapeValue: false // Allow HTML in translations
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
     * Update language in-place without redirecting
     * @param {string} languageCode - New language code
     */
    async updateLanguageInPlace(languageCode) {
        // Guard against recursive calls
        if (this.isChangingLanguage) {
            return;
        }
        
        // If already on this language, no need to update
        if (this.currentLanguage === languageCode) {
            return;
        }
        
        this.isChangingLanguage = true;
        const previousLang = this.currentLanguage;
        this.currentLanguage = languageCode;

        try {
            // Update i18next if available
            if (typeof i18next !== 'undefined' && i18next.isInitialized) {
                await i18next.changeLanguage(languageCode);
            }

            // Update HTML attributes
            document.documentElement.setAttribute('lang', languageCode);
            document.documentElement.setAttribute('data-lang', languageCode);

            // Update UI
            this.updateNavbarLanguageDisplay();
            this.updatePageContent();
        } catch (error) {
            console.error('Error updating language:', error);
            this.currentLanguage = previousLang; // Revert on error
        } finally {
            this.isChangingLanguage = false;
        }
    }

    /**
     * Change language and redirect to appropriate URL
     * @param {string} languageCode - New language code
     */
    async changeLanguage(languageCode) {
        console.log('🔄 changeLanguage called with:', languageCode, 'from current lang:', this.currentLanguage);
        console.log('📍 Current path:', window.location.pathname);
        console.log('🚦 isChangingLanguage flag:', this.isChangingLanguage);
        
        // Guard against recursive calls
        if (this.isChangingLanguage) {
            console.warn('⚠️ Blocked by isChangingLanguage guard');
            return;
        }
        
        if (!this.supportedLanguages.includes(languageCode)) {
            console.warn('Unsupported language:', languageCode);
            return;
        }

        const currentPath = window.location.pathname;
        
        // Update localStorage for next visit
        localStorage.setItem('selectedLanguage', languageCode);
        
        // Blog pages: the URL decides the language (see isBlogPath), so
        // either stay put or go to this page's translation.
        if (isBlogPath(currentPath)) {
            const onSpanishBlog = currentPath.startsWith('/es/');
            if ((languageCode === 'es') === onSpanishBlog) {
                console.log('✅ Already on the blog in this language - updating UI only');
                await this.updateLanguageInPlace(languageCode);
                return;
            }

            this.isChangingLanguage = true;
            window.location.href = getBlogTranslationPath(languageCode);
            return;
        }
        
        // Regular page handling (non-blog)
        // Check if already on correct language
        const onSpanishPage = currentPath.startsWith('/es/');
        const needsRedirect = (languageCode === 'es' && !onSpanishPage) || (languageCode === 'en' && onSpanishPage);

        if (!needsRedirect) {
            // Already on correct language - just update UI
            console.log('✅ Already on correct language page - updating UI only');
            await this.updateLanguageInPlace(languageCode);
            return;
        }

        // Will redirect - set flag
        this.isChangingLanguage = true;

        // Redirect to appropriate language version, preserving full path structure
        if (languageCode === 'es') {
            // Add /es/ prefix to current path
            window.location.href = `/es${currentPath}`;
            return;
        } else {
            // Remove /es/ prefix from current path
            const englishPath = currentPath.replace(/^\/es/, '');
            window.location.href = englishPath || '/';
            return;
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
            const isHtml = element.hasAttribute('data-i18n-html');
            
            if (isHtml) {
                const translatedText = this.t(key, element.innerHTML);
                element.innerHTML = translatedText;
            } else {
                const translatedText = this.t(key, element.textContent);
                element.textContent = translatedText;
            }
        });

            // Update elements with data-i18n-html attribute using i18next directly
        if (typeof i18next !== 'undefined' && i18next.isInitialized) {
            const htmlElements = document.querySelectorAll('[data-i18n-html]');
            htmlElements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translatedText = i18next.t(key);
                if (translatedText && translatedText !== key) {
                    element.innerHTML = translatedText;
                }
            });
        }

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
 * Handles both root and /es/ paths
 * @returns {string|null} The namespace for the current page, or null if not found
 */
function detectPageNamespace() {
    const path = window.location.pathname;
    
    // Blog pages don't use namespace-based translations (content is in markdown)
    // Only load 'common' namespace for blog
    if (isBlogPath(path)) {
        return null; // Will only load 'common' namespace
    }
    
    // Remove /es/ prefix if present for namespace detection
    const cleanPath = path.replace('/es/', '/');
    const filename = cleanPath.split('/').pop() || 'index.html';
    
    // Handle certifications subdirectory
    if (cleanPath.includes('/certifications/')) {
        return 'certifications';
    }

    // Map filenames to namespaces (support both with and without .html extension)
    const pageNamespaceMap = {
        'index.html': 'home',
        'index': 'home',
        'about.html': 'about',
        'about': 'about',
        'classes.html': 'classes',
        'classes': 'classes',
        'events.html': 'events',
        'events': 'events',
        'blog.html': 'blog',
        'blog': 'blog'
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

    // The classes page's schedule is generated from the database, and its
    // strings live in their own namespace so that build-i18n.js never has to
    // merge generated keys into hand-written classes.json. See C1 in
    // MIGRATION.md.
    if (pageNamespace === 'classes') {
        namespaces.push('schedule');
    }

    // The events page's per-event text is generated from the database into
    // its own namespace too, and grafted into `events:events.*` once loaded.
    // See composeGeneratedNamespaces() above.
    if (pageNamespace === 'events') {
        namespaces.push('eventContent');
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
