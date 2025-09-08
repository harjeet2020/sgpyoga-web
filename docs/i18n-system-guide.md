# SGP Yoga i18n System Guide

## 🌍 **Complete Translation System Overview**

This guide explains the SGP Yoga internationalization (i18n) system that uses separate JSON files for organized, scalable translations.

## 📁 **Current Implementation**

**Main Files:**
- `index.html` - Homepage with translation attributes
- `js/i18n.js` - Main translation system with JSON loading
- `js/navbar.js` - Navbar functionality and language switching
- `locales/` - Translation JSON files organized by language and namespace

**File Structure:**
```
sgpyoga/
├── index.html              # Main homepage
├── js/
│   ├── i18n.js            # Translation system
│   └── navbar.js          # Navbar & language switching
└── locales/
    ├── en/
    │   ├── common.json     # Shared translations
    │   └── home.json       # Homepage translations
    └── es/
        ├── common.json
        └── home.json
```

---

## 📋 **Current System (i18n.js)**

### **How i18next is Set Up**

```javascript
i18next
    .use(i18nextBrowserLanguageDetector)  // Plugin for language detection
    .init({
        debug: false,
        lng: detectedLang,                 // Explicit language setting
        fallbackLng: 'en',                 // Default fallback language
        detection: {                       // Detection configuration
            order: ['localStorage', 'navigator', 'htmlTag'],
            lookupLocalStorage: 'selectedLanguage',
            caches: ['localStorage'],
        },
        resources: {                       // Translation resources
            en: { translation: translations.en },
            es: { translation: translations.es }
        }
    })
```

**Key Features:**
- **Language Detection**: localStorage → browser language → HTML lang attribute
- **Fallback System**: Always falls back to English if translation missing
- **Caching**: Saves language preference in localStorage
- **Resource Structure**: `{ language: { namespace: translations } }`

### **Translation Storage**

**Current Structure (In-Memory Object):**
```javascript
const translations = {
    en: {
        nav: { home: "Home", about: "About", ... },
        home: { welcome: "Welcome to SGP Yoga", ... }
    },
    es: {
        nav: { home: "Inicio", about: "Acerca De", ... },
        home: { welcome: "Bienvenido a SGP Yoga", ... }
    }
}
```

### **Element Update Process**

1. **Query Elements**: `document.querySelectorAll('[data-i18n]')`
2. **Extract Key**: `element.getAttribute('data-i18n')`
3. **Get Translation**: `t(key, defaultText)`
4. **Update Content**: `element.textContent = translatedText`

---

## 🚀 **JSON-Based Translation System**

### **Why Separate JSON Files Are Better**

| **Aspect** | **Current (In-Memory)** | **Improved (JSON Files)** |
|------------|-------------------------|---------------------------|
| **Maintainability** | ❌ Hard to maintain | ✅ Easy to edit separate files |
| **Organization** | ❌ All mixed together | ✅ Organized by namespace/page |
| **Performance** | ❌ Loads everything at once | ✅ Lazy loading on demand |
| **Translator-Friendly** | ❌ Need technical knowledge | ✅ Simple JSON files |
| **Scalability** | ❌ Gets unwieldy | ✅ Scales infinitely |
| **Collaboration** | ❌ Merge conflicts | ✅ Separate files, no conflicts |
| **Cache Management** | ❌ Cache entire bundle | ✅ Cache individual files |

### **File Structure**

```
locales/
├── en/
│   ├── common.json     # Navbar, buttons, footer
│   ├── home.json       # Homepage content
│   ├── about.json      # About page content
│   ├── classes.json    # Classes page content
│   └── events.json     # Events page content
└── es/
    ├── common.json
    ├── home.json
    ├── about.json
    ├── classes.json
    └── events.json
```

### **Namespace System**

**Common Namespace** (`common.json`):
```json
{
  "nav": { "home": "Home", "about": "About" },
  "buttons": { "learn_more": "Learn More", "book_now": "Book Now" },
  "footer": { "copyright": "© 2024 SGP Yoga. All rights reserved." }
}
```

**Page-Specific Namespace** (`home.json`):
```json
{
  "hero": {
    "welcome": "Welcome to SGP Yoga",
    "subtitle": "Find your inner peace in the heart of Mexico City"
  },
  "about_preview": {
    "title": "About Our Practice"
  }
}
```

### **How to Use Translation Keys**

In HTML, use `namespace:key.subkey` format:

```html
<!-- Common translations (shared across pages) -->
<a href="index.html" data-i18n="common:nav.home">Home</a>
<button data-i18n="common:buttons.learn_more">Learn More</button>

<!-- Page-specific translations -->
<h1 data-i18n="home:hero.welcome">Welcome to SGP Yoga</h1>
<p data-i18n="home:hero.subtitle">Find your inner peace</p>

<!-- If no namespace specified, defaults to 'common' -->
<span data-i18n="nav.home">Home</span>  <!-- Same as common:nav.home -->
```

---

## 🔧 **Adding New Translations**

### **Method 1: Add to Existing Files**

1. **Edit JSON file**:
```json
// locales/en/home.json
{
  "hero": {
    "welcome": "Welcome to SGP Yoga",
    "new_message": "Your new message here"  // ← Add this
  }
}
```

2. **Use in HTML**:
```html
<p data-i18n="home:hero.new_message">Your new message here</p>
```

3. **No additional JavaScript needed!** The system automatically handles it.

### **Method 2: Create New Namespace Files**

For a new "Classes" page:

1. **Create files**:
   - `locales/en/classes.json`
   - `locales/es/classes.json`

2. **Add content**:
```json
// locales/en/classes.json
{
  "title": "Our Classes",
  "types": {
    "hatha": "Hatha Yoga",
    "vinyasa": "Vinyasa Flow"
  }
}
```

3. **Load namespace**:
```javascript
// Load when needed (e.g., when navigating to classes page)
await window.SGPi18n.loadNamespacesOnDemand(['classes']);
```

4. **Use in HTML**:
```html
<h1 data-i18n="classes:title">Our Classes</h1>
<h2 data-i18n="classes:types.hatha">Hatha Yoga</h2>
```

---

## 🎯 **Supported Element Types**

The system automatically updates these element types:

### **1. Text Content**
```html
<h1 data-i18n="home:hero.welcome">Default Text</h1>
<p data-i18n="common:nav.home">Default Text</p>
<button data-i18n="common:buttons.book_now">Default Text</button>
```

### **2. Placeholders**
```html
<input type="text" data-i18n-placeholder="forms:search.placeholder" placeholder="Search...">
<textarea data-i18n-placeholder="forms:message.placeholder" placeholder="Your message"></textarea>
```

### **3. ARIA Labels**
```html
<button data-i18n-aria-label="buttons:close.aria" aria-label="Close dialog">×</button>
<input data-i18n-aria-label="forms:email.aria" aria-label="Email address">
```

### **4. Page Titles**
```html
<title data-i18n="common:nav.home">SGP Yoga - Home</title>
```

### **5. Meta Descriptions**
```html
<meta name="description" content="Default description" data-i18n="home:meta.description">
```

---

## ⚡ **Advanced Features**

### **Dynamic Namespace Loading**

Load translations only when needed:

```javascript
// When user navigates to a new section
async function loadBlogPage() {
    await window.SGPi18n.loadNamespacesOnDemand(['blog', 'comments']);
    // Now blog and comments translations are available
}
```

### **Programmatic Translation**

Get translations in JavaScript:

```javascript
// Get translation
const welcomeText = window.SGPi18n.t('home:hero.welcome');
const buttonText = window.SGPi18n.t('common:buttons.book_now');

// Use with fallback
const text = window.SGPi18n.t('missing:key', 'Default text');
```

### **Language Change Events**

Listen for language changes:

```javascript
document.addEventListener('languageChanged', function(event) {
    console.log('Language changed to:', event.detail.language);
    // Update any custom UI elements
});
```

---

## 🎯 **Best Practices**

### **1. Namespace Organization**
- `common`: Navigation, buttons, footer (shared across pages)
- `home`: Homepage-specific content
- `about`: About page content
- `forms`: Form labels, placeholders, validation messages
- `errors`: Error messages

### **2. Key Naming**
- Use descriptive, hierarchical keys: `hero.welcome` not `h1_text`
- Group related content: `buttons.save`, `buttons.cancel`
- Be consistent: `title`, `subtitle`, `description`

### **3. Translation Management**
- Keep translations in sync across languages
- Use translation tools or services for professional translations
- Test all translations in context
- Consider cultural nuances, not just literal translations

### **4. Performance**
- Load only needed namespaces initially
- Use lazy loading for page-specific content
- Consider CDN for translation files
- Cache translation files appropriately

---

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Translation not showing**
   - Check if namespace is loaded
   - Verify key path is correct
   - Ensure JSON files are accessible

2. **Network errors**
   - Check file paths are correct
   - Ensure server is serving JSON files
   - Check CORS if loading from different domain

3. **Missing fallbacks**
   - Always provide default text in HTML
   - Ensure English translations exist
   - Check fallback chain

### **Debug Mode**

Enable debug mode:

```javascript
// In js/i18n.js, change debug: true
debug: true,  // Enable detailed logging
```

This will log:
- Namespace loading
- Translation lookups
- Fallback chains
- Error details

---

## 📈 **Performance Metrics**

### **Legacy In-Memory System**
- Initial load: ~2-3KB (all translations)
- Language switch: Instant (already loaded)
- Memory usage: All translations in memory
- Scalability: Poor for large sites

### **Current JSON-Based System**
- Initial load: ~1KB + only needed namespaces
- Language switch: <100ms (individual file loading)
- Memory usage: Only loaded namespaces
- Network requests: Only when needed
- Scalability: Excellent for any size site

The JSON-based system scales perfectly for websites of any size!

---

## 🚀 **Quick Start Example**

### **1. HTML Setup**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title data-i18n="common:nav.home">SGP Yoga - Home</title>
    <script src="js/i18n.js"></script>
</head>
<body>
    <h1 data-i18n="home:hero.welcome">Welcome to SGP Yoga</h1>
    <p data-i18n="home:hero.subtitle">Find your inner peace</p>
</body>
</html>
```

### **2. Translation Files**
```json
// locales/en/common.json
{ "nav": { "home": "Home" } }

// locales/en/home.json  
{ "hero": { "welcome": "Welcome to SGP Yoga", "subtitle": "Find your inner peace" } }

// locales/es/home.json
{ "hero": { "welcome": "Bienvenido a SGP Yoga", "subtitle": "Encuentra tu paz interior" } }
```

### **3. JavaScript Usage**
```javascript
// Get translation programmatically
const welcomeText = window.SGPi18n.t('home:hero.welcome');

// Change language
window.SGPi18n.changeLanguage('es');

// Load more namespaces
window.SGPi18n.loadNamespacesOnDemand(['classes', 'events']);
```

**That's it!** The system automatically:
- ✅ Detects user's preferred language
- ✅ Loads only needed translations
- ✅ Updates all elements with `data-i18n` attributes
- ✅ Handles language switching seamlessly
- ✅ Provides fallbacks for missing translations
