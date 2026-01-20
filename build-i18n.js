#!/usr/bin/env node

/**
 * SGP Yoga - i18n Build Script
 * Generates Spanish HTML files from English templates and translation JSON files
 * 
 * Usage: node build-i18n.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const HTML_FILES = [
    'index.html',
    'about.html',
    'classes.html',
    'events.html',
    'certifications/aerial-yoga-100.html'
];
const SOURCE_LANG = 'en';
const TARGET_LANG = 'es';
const OUTPUT_DIR = 'es';
const LOCALES_DIR = 'locales';

// Color output for terminal
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Load all translation files for a language
 * @param {string} lang - Language code (en/es)
 * @returns {Object} All translations organized by namespace
 */
function loadTranslations(lang) {
    const langDir = path.join(LOCALES_DIR, lang);
    const translations = {};
    
    if (!fs.existsSync(langDir)) {
        log(`Warning: Locales directory not found: ${langDir}`, 'yellow');
        return translations;
    }
    
    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
    
    files.forEach(file => {
        const namespace = path.basename(file, '.json');
        const filePath = path.join(langDir, file);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            translations[namespace] = JSON.parse(content);
            log(`  ✓ Loaded ${lang}/${namespace}.json`, 'green');
        } catch (error) {
            log(`  ✗ Error loading ${filePath}: ${error.message}`, 'red');
        }
    });
    
    return translations;
}

/**
 * Get nested translation value from object
 * @param {Object} obj - Translation object
 * @param {string} keyPath - Dot-separated key path (e.g., "hero.welcome")
 * @returns {string|null} Translation value or null
 */
function getNestedValue(obj, keyPath) {
    const keys = keyPath.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return null;
        }
    }
    
    return typeof current === 'string' ? current : null;
}

/**
 * Get translation for a key
 * @param {Object} translations - All loaded translations
 * @param {string} key - Translation key (format: "namespace:key.path" or "key.path")
 * @returns {string|null} Translated text or null
 */
function getTranslation(translations, key) {
    let namespace = 'common';
    let keyPath = key;
    
    // Parse namespace if present
    if (key.includes(':')) {
        [namespace, keyPath] = key.split(':', 2);
    }
    
    // Get translation
    if (translations[namespace]) {
        return getNestedValue(translations[namespace], keyPath);
    }
    
    return null;
}

/**
 * Process HTML content and replace data-i18n attributes with translations
 * @param {string} html - HTML content
 * @param {Object} translations - Loaded translations
 * @param {string} filename - Source filename (for logging)
 * @returns {string} Processed HTML
 */
function processHTML(html, translations, filename) {
    let processed = html;
    let replacements = 0;
    
    // Find all elements with data-i18n attribute
    // Regex matches: <tag ...data-i18n="key"...>content</tag>
    const dataI18nPattern = /<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?)data-i18n=["']([^"']+)["']([^>]*?)>([\s\S]*?)<\/\1>/g;
    
    processed = processed.replace(dataI18nPattern, (match, tagName, beforeAttrs, key, afterAttrs, content) => {
        const translation = getTranslation(translations, key);
        
        if (translation) {
            replacements++;
            // Remove data-i18n attribute and replace content
            const cleanBefore = beforeAttrs.trim();
            const cleanAfter = afterAttrs.trim();
            const attrs = [cleanBefore, cleanAfter].filter(a => a).join(' ');
            const attrString = attrs ? ' ' + attrs : '';
            
            return `<${tagName}${attrString}>${translation}</${tagName}>`;
        } else {
            log(`    ⚠ Translation not found: ${key}`, 'yellow');
            // Keep original but remove data-i18n attribute
            const cleanBefore = beforeAttrs.trim();
            const cleanAfter = afterAttrs.trim();
            const attrs = [cleanBefore, cleanAfter].filter(a => a).join(' ');
            const attrString = attrs ? ' ' + attrs : '';
            
            return `<${tagName}${attrString}>${content}</${tagName}>`;
        }
    });
    
    // Handle self-closing elements with data-i18n-placeholder
    const placeholderPattern = /<(input|textarea)([^>]*?)data-i18n-placeholder=["']([^"']+)["']([^>]*?)>/g;
    
    processed = processed.replace(placeholderPattern, (match, tagName, beforeAttrs, key, afterAttrs) => {
        const translation = getTranslation(translations, key);
        
        if (translation) {
            replacements++;
            // Replace placeholder attribute value
            const allAttrs = beforeAttrs + afterAttrs;
            const updatedAttrs = allAttrs.replace(/placeholder=["'][^"']*["']/, `placeholder="${translation}"`);
            return `<${tagName}${updatedAttrs}>`;
        }
        
        return match;
    });
    
    // Handle data-i18n-aria-label attributes
    const ariaLabelPattern = /<([a-zA-Z][a-zA-Z0-9]*)([^>]*?)data-i18n-aria-label=["']([^"']+)["']([^>]*?)>/g;
    
    processed = processed.replace(ariaLabelPattern, (match, tagName, beforeAttrs, key, afterAttrs) => {
        const translation = getTranslation(translations, key);
        
        if (translation) {
            replacements++;
            const allAttrs = beforeAttrs + afterAttrs;
            const updatedAttrs = allAttrs.replace(/aria-label=["'][^"']*["']/, `aria-label="${translation}"`);
            return `<${tagName}${updatedAttrs}>`;
        }
        
        return match;
    });
    
    // Inject Google Search Console verification meta tag if not present
    if (!processed.includes('google-site-verification')) {
        processed = processed.replace(
            /(<meta name=["']viewport["'][^>]*>)/,
            '$1\n    <meta name="google-site-verification" content="d7JoYGZFD3j4ovz9GDIe_fN55bDYiExfHK_jAJeZy-g" />'
        );
    }
    
    // Update lang attribute
    processed = processed.replace(
        /<html[^>]*lang=["']en["'][^>]*>/,
        (match) => match.replace(/lang=["']en["']/, 'lang="es"')
    );
    processed = processed.replace(
        /<html[^>]*data-lang=["']en["'][^>]*>/,
        (match) => match.replace(/data-lang=["']en["']/, 'data-lang="es"')
    );
    
    // Update canonical URL to point to Spanish version
    // Each language version should have a self-referencing canonical
    processed = processed.replace(
        /<link rel=["']canonical["'] href=["'](https:\/\/(?:www\.)?sgpyoga\.co\/)([^"']+)["']>/g,
        (match, domain, page) => `<link rel="canonical" href="https://sgpyoga.co/es/${page}">`
    );
    
    // Update hreflang tags for Spanish version
    // Update the hreflang="es" to point to /es/ version (but avoid double /es/es/)
    processed = processed.replace(
        /<link rel=["']alternate["'] hreflang=["']es["'] href=["'](https:\/\/(?:www\.)?sgpyoga\.co\/)(?!es\/)([^"']+)["']>/g,
        (match, domain, page) => `<link rel="alternate" hreflang="es" href="https://sgpyoga.co/es/${page}">`
    );
    
    // Ensure hreflang="en" points to root version (remove www if present)
    processed = processed.replace(
        /<link rel=["']alternate["'] hreflang=["']en["'] href=["'](https:\/\/(?:www\.)?sgpyoga\.co\/)(?:es\/)?([^"']+)["']>/g,
        (match, domain, page) => `<link rel="alternate" hreflang="en" href="https://sgpyoga.co/${page}">`
    );
    
    // Ensure x-default points to root version (English, without www)
    processed = processed.replace(
        /<link rel=["']alternate["'] hreflang=["']x-default["'] href=["'](https:\/\/(?:www\.)?sgpyoga\.co\/)(?:es\/)?([^"']+)["']>/g,
        (match, domain, page) => `<link rel="alternate" hreflang="x-default" href="https://sgpyoga.co/${page}">`
    );
    
    // Navigation links: href="index.html" -> href="/es/index.html"
    // Only for internal page links, not for external URLs or blog (which uses 11ty)
    processed = processed.replace(
        /(<a[^>]*href=["'])(?!\/|https?:\/\/|#)((?:index|about|classes|events)\.html)(["'][^>]*>)/g,
        '$1/es/$2$3'
    );

    // Handle certifications directory links
    processed = processed.replace(
        /(<a[^>]*href=["'])(?!\/es\/)\/certifications\/([^"']+)(["'][^>]*>)/g,
        '$1/es/certifications/$2$3'
    );
    
    // Blog link needs special handling - point to language-specific blog index
    processed = processed.replace(
        /(<a[^>]*href=["'])blog\.html(["'][^>]*>)/g,
        '$1/blog/dist/es/$2'
    );
    
    log(`    ✓ Made ${replacements} replacements in ${filename}`, 'green');
    
    return processed;
}

/**
 * Generate Spanish HTML file
 * @param {string} filename - HTML filename to process (can include subdirectory path)
 * @param {Object} translations - Loaded translations
 */
function generateSpanishFile(filename, translations) {
    const sourcePath = path.join(__dirname, filename);
    const targetPath = path.join(__dirname, OUTPUT_DIR, filename);

    log(`\nProcessing ${filename}...`, 'blue');

    // Read source HTML
    if (!fs.existsSync(sourcePath)) {
        log(`  ✗ Source file not found: ${sourcePath}`, 'red');
        return;
    }

    let html = fs.readFileSync(sourcePath, 'utf8');

    // Process HTML
    const processed = processHTML(html, translations, filename);

    // Ensure output directory exists (including subdirectories)
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        log(`  ✓ Created directory: ${path.relative(__dirname, targetDir)}`, 'green');
    }

    // Write processed HTML
    fs.writeFileSync(targetPath, processed, 'utf8');
    log(`  ✓ Generated ${OUTPUT_DIR}/${filename}`, 'green');
}

/**
 * Main build function
 */
function build() {
    log('\n=== SGP Yoga i18n Build Script ===\n', 'blue');
    
    // Load translations
    log('Loading translations...', 'blue');
    const translations = loadTranslations(TARGET_LANG);
    
    const namespaceCount = Object.keys(translations).length;
    if (namespaceCount === 0) {
        log('\n✗ No translations found! Check your locales directory.', 'red');
        process.exit(1);
    }
    
    log(`\n✓ Loaded ${namespaceCount} translation namespaces\n`, 'green');
    
    // Process each HTML file
    HTML_FILES.forEach(filename => {
        generateSpanishFile(filename, translations);
    });
    
    log('\n=== Build Complete! ===\n', 'green');
    log(`Spanish files generated in /${OUTPUT_DIR}/ directory`, 'blue');
    log(`\nNext steps:`, 'yellow');
    log(`  1. Review the generated files in /${OUTPUT_DIR}/`);
    log(`  2. Test the language switcher`);
    log(`  3. Verify SEO tags (canonical, hreflang)`);
    log(`  4. Deploy both English and Spanish versions\n`);
}

// Run build
if (require.main === module) {
    try {
        build();
    } catch (error) {
        log(`\n✗ Build failed: ${error.message}`, 'red');
        console.error(error);
        process.exit(1);
    }
}

module.exports = { build, loadTranslations, getTranslation, processHTML };
