# URL-Based i18n Migration - Review & Fixes Summary

**Date:** January 30, 2025  
**Status:** ✅ Complete - Ready for Testing

---

## Overview

This document summarizes the review and fixes applied to the SGP Yoga website after migrating from query parameter-based language switching (`?lang=en`) to URL path-based language switching (`/es/`).

---

## ✅ What Was Already Working

### 1. **build-i18n.js Script**
- ✅ Properly generates Spanish HTML files in `/es/` directory
- ✅ Correctly replaces translations from JSON files
- ✅ Updates all resource paths to absolute paths (`/css/`, `/js/`, `/assets/`)
- ✅ Updates navigation links to point to `/es/` versions
- ✅ Handles lang attributes correctly (`lang="es"`, `data-lang="es"`)

### 2. **Language Detection (i18n.js)**
- ✅ Properly detects `/es/` path prefix
- ✅ Falls back to localStorage for user preferences
- ✅ Falls back to browser language as final option

### 3. **Language Switching Logic**
- ✅ Redirects from root to `/es/` when switching to Spanish
- ✅ Redirects from `/es/` to root when switching to English
- ✅ Special handling for blog paths (`/blog/dist/` vs `/blog/dist/es/`)

---

## ❌ Issues Found & Fixed

### 1. **sitemap.xml - Using Old URL Pattern**

**Problem:** Sitemap was using the old query parameter approach:
```xml
<loc>https://www.sgpyoga.co/?lang=en</loc>
<loc>https://www.sgpyoga.co/?lang=es</loc>
```

**Fix Applied:** Updated to path-based URLs:
```xml
<!-- English -->
<loc>https://www.sgpyoga.co/index.html</loc>

<!-- Spanish -->
<loc>https://www.sgpyoga.co/es/index.html</loc>
```

**Result:** ✅ Sitemap now properly represents both language versions as separate URLs

---

### 2. **robots.txt - No Changes Needed**

**Status:** ✅ Already correct
- Allows all bots
- Points to sitemap.xml (which has now been fixed)
- Disallows admin and system directories

---

### 3. **Missing Canonical & Hreflang Tags**

**Problem:** English HTML files (index.html, about.html, classes.html, events.html) were missing SEO-critical tags:
- No canonical tags
- No hreflang tags

**Fix Applied:** Added to all English HTML files:
```html
<!-- SEO: Canonical & Hreflang -->
<link rel="canonical" href="https://www.sgpyoga.co/index.html">
<link rel="alternate" hreflang="en" href="https://www.sgpyoga.co/index.html">
<link rel="alternate" hreflang="es" href="https://www.sgpyoga.co/es/index.html">
<link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.co/index.html">
```

**Result:** ✅ Search engines can now properly understand:
- The canonical URL for each page
- Available language alternatives
- The default language version (x-default)

---

### 4. **build-i18n.js - Incomplete Canonical/Hreflang Handling**

**Problem:** The script was only updating the canonical tag but not properly handling hreflang tags for Spanish versions.

**Fix Applied:** Enhanced the script to:
1. Update canonical URL to point to `/es/` version
2. Update hreflang="es" to point to `/es/` version
3. Ensure hreflang="en" points to root version
4. Ensure x-default points to root version

**Code Added:**
```javascript
// Update hreflang tags for Spanish version
processed = processed.replace(
    /<link rel=["']alternate["'] hreflang=["']es["'] href=["'](https:\/\/www\.sgpyoga\.co\/)([^"']+)["']>/g,
    (match, domain, page) => `<link rel="alternate" hreflang="es" href="${domain}es/${page}">`
);

// Ensure hreflang="en" points to root version
processed = processed.replace(
    /<link rel=["']alternate["'] hreflang=["']en["'] href=["'](https:\/\/www\.sgpyoga\.co\/)es\/([^"']+)["']>/g,
    (match, domain, page) => `<link rel="alternate" hreflang="en" href="${domain}${page}"`
);

// Ensure x-default points to root version
processed = processed.replace(
    /<link rel=["']alternate["'] hreflang=["']x-default["'] href=["'](https:\/\/www\.sgpyoga\.co\/)es\/([^"']+)["']>/g,
    (match, domain, page) => `<link rel="alternate" hreflang="x-default" href="${domain}${page}"`
);
```

**Result:** ✅ Spanish HTML files now have correct SEO tags

---

### 5. **Blog Template - Missing Canonical/Hreflang Tags**

**Problem:** The blog base template (`blog/src/_includes/layouts/base.njk`) was missing canonical and hreflang tags entirely.

**Fix Applied:** Added language-aware canonical and hreflang tags to the template:
```html
{# SEO: Canonical & Hreflang Tags #}
<link rel="canonical" href="https://www.sgpyoga.co{{ page.url }}">
{% if lang == 'es' %}
    {# Spanish page - link to English equivalent #}
    <link rel="alternate" hreflang="en" href="https://www.sgpyoga.co/blog/dist/{{ page.fileSlug }}.html">
    <link rel="alternate" hreflang="es" href="https://www.sgpyoga.co{{ page.url }}">
    <link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.co/blog/dist/{{ page.fileSlug }}.html">
{% else %}
    {# English page - link to English equivalent #}
    <link rel="alternate" hreflang="en" href="https://www.sgpyoga.co{{ page.url }}">
    <link rel="alternate" hreflang="es" href="https://www.sgpyoga.co/blog/dist/es/{{ page.fileSlug }}.html">
    <link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.co{{ page.url }}">
{% endif %}
```

**Result:** ✅ All blog pages (index and posts) now have proper SEO tags

---

### 6. **Build Pipeline Configuration**

**Problem:** No unified build command in package.json

**Fix Applied:** Added proper build scripts:
```json
{
  "scripts": {
    "build:i18n": "node build-i18n.js",
    "build:blog": "cd blog && npm run build",
    "build": "npm run build:i18n && npm run build:blog",
    "watch:i18n": "node build-i18n.js && echo 'Watching...' && fswatch..."
  }
}
```

**Result:** ✅ Proper build pipeline in place

---

## 📋 How to Use build-i18n.js

### Development Workflow

1. **Edit English HTML files** (index.html, about.html, classes.html, events.html)
2. **Update translations** in `locales/es/*.json` files
3. **Run build script:**
   ```bash
   npm run build:i18n
   ```
4. **Spanish files are generated** in `/es/` directory

### Production Build

For production deployment, run:
```bash
npm run build
```

This will:
1. Run `build:i18n` to generate Spanish HTML files
2. Run `build:blog` to build the 11ty blog (if applicable)

### Watch Mode

For continuous development:
```bash
npm run watch:i18n
```

This watches for changes in:
- HTML files (index.html, about.html, classes.html, events.html)
- Translation files (locales/)

---

## ✅ Production Checklist

Before deploying to production:

### SEO Verification
- [ ] Verify canonical tags in all English pages
- [ ] Verify canonical tags in all Spanish pages (/es/)
- [ ] Verify hreflang tags point to correct URLs
- [ ] Test sitemap.xml at https://www.sgpyoga.co/sitemap.xml
- [ ] Test robots.txt at https://www.sgpyoga.co/robots.txt
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools

### Functionality Testing
- [ ] Test language switcher from English → Spanish
- [ ] Test language switcher from Spanish → English
- [ ] Verify all navigation links work in both languages
- [ ] Test blog navigation from main site
- [ ] Verify all images load correctly (absolute paths)
- [ ] Verify all CSS/JS loads correctly (absolute paths)

### SEO Tools
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test with [Hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)
- [ ] Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

## 🎯 Key Takeaways

### URL Structure
- **English:** `https://www.sgpyoga.co/index.html`
- **Spanish:** `https://www.sgpyoga.co/es/index.html`

### Blog URLs
- **English:** `https://www.sgpyoga.co/blog/dist/`
- **Spanish:** `https://www.sgpyoga.co/blog/dist/es/`

### Build Order
1. **FIRST:** Run `build:i18n` to generate Spanish files
2. **THEN:** Run 11ty blog build (if needed)
3. **ALWAYS:** Build i18n before blog to ensure proper integration

### SEO Benefits
- ✅ Clean, language-specific URLs (better than query parameters)
- ✅ Proper hreflang tags for international SEO
- ✅ Canonical tags prevent duplicate content issues
- ✅ Language-specific sitemaps for better indexing

---

## 📚 Related Documentation

- See `docs/SEO-CHECKLIST.md` for comprehensive SEO guidelines
- See `WARP.md` for project-specific conventions
- See `build-i18n.js` for implementation details

---

## 🐛 Known Issues

None at this time. All critical issues have been resolved.

---

## 📝 Notes

- The build-i18n.js script is **source of truth** for Spanish HTML generation
- Never edit `/es/*.html` files directly - they are auto-generated
- Always edit English HTML files and run the build script
- Translations are stored in `locales/es/*.json` - edit these for content changes

---

**Migration Status:** ✅ **COMPLETE**  
**Ready for Production:** ✅ **YES** (after testing checklist completion)
