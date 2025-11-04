/**
 * SGP Yoga - Inline Critical Language Detection
 * This script runs inline in the HTML <head> to detect language BEFORE any external JS loads
 * Purpose: Eliminate render-blocking from i18n.js and prevent language-related layout shifts
 * 
 * NOTE: This file is for reference only. The actual implementation is already embedded
 * as a minified inline script in the HTML <head> of all pages. If you need to update
 * the inline script, modify this file, minify it manually (using an online tool), and
 * update all HTML files.
 */

(function() {
    'use strict';
    
    // Detect language from multiple sources (priority order)
    function detectLanguage() {
        // Priority 1: Check URL path for /es/
        const pathname = window.location.pathname;
        if (pathname.startsWith('/es/') || pathname.includes('/blog/dist/es/')) {
            return 'es';
        }
        
        // Priority 2: Check localStorage for saved preference
        try {
            const stored = localStorage.getItem('selectedLanguage');
            if (stored === 'en' || stored === 'es') {
                return stored;
            }
        } catch (e) {
            // localStorage may not be available (privacy mode, etc.)
        }
        
        // Priority 3: Detect from browser language
        const browserLang = navigator.language || navigator.userLanguage || '';
        if (browserLang.toLowerCase().startsWith('es')) {
            return 'es';
        }
        
        // Default to English
        return 'en';
    }
    
    // Update HTML attributes and navbar display
    function applyLanguage(lang) {
        // Set HTML lang attributes immediately (prevents layout shift)
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('data-lang', lang);
        
        // Store for i18n.js to use later
        window.__INITIAL_LANG__ = lang;
        
        // Update navbar display (if elements exist)
        // This prevents flash of wrong language in the navbar
        if (document.readyState !== 'loading') {
            updateNavbarDisplay(lang);
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                updateNavbarDisplay(lang);
            });
        }
    }
    
    // Update navbar language selector display
    function updateNavbarDisplay(lang) {
        const currentFlag = document.getElementById('currentFlag');
        const currentLangCode = document.getElementById('currentLangCode');
        
        if (!currentFlag || !currentLangCode) return;
        
        const languages = {
            'en': { flag: '🇺🇸', code: 'EN' },
            'es': { flag: '🇲🇽', code: 'ES' }
        };
        
        const selectedLang = languages[lang];
        if (selectedLang) {
            currentFlag.textContent = selectedLang.flag;
            currentLangCode.textContent = selectedLang.code;
        }
    }
    
    // Execute immediately
    const detectedLang = detectLanguage();
    applyLanguage(detectedLang);
    
})();
