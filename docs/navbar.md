# Navbar JavaScript Documentation

## Introduction

The `js/navbar.js` file implements the complete navigation bar functionality for the SGP Yoga website. This comprehensive module provides several key features:

- **Language Selection System**: A fully accessible dropdown for switching between English and Spanish
- **Active Navigation Highlighting**: Automatic detection and highlighting of the current page in navigation
- **Keyboard Accessibility**: Complete keyboard navigation support with arrow keys, Enter, and Escape
- **Responsive Behavior**: Adaptive handling for mobile devices and window resizing
- **i18next Integration**: Seamless integration with the internationalization system
- **Persistent Language Preferences**: User language selection stored in localStorage
- **Icon Management**: Integration with Lucide icons library

The code follows accessibility best practices (WCAG guidelines) and provides a smooth, intuitive user experience across all device types.

## Function Documentation

### Main Initialization

#### DOM Content Loaded Handler
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Language dropdown functionality
    initializeLanguageDropdown();
    
    // Set active nav link based on current page
    setActiveNavLink();
});
```

**Purpose**: Primary entry point that initializes all navbar functionality once the DOM is fully loaded.

**Execution Flow**:
1. Checks for Lucide icons library availability and initializes icons
2. Sets up the language dropdown functionality
3. Highlights the active navigation link for the current page

**Triggered**: Automatically when the page loads and DOM content is ready.

---

### Language Dropdown System

#### initializeLanguageDropdown()
```javascript
function initializeLanguageDropdown() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    // ... setup code
}
```

**Purpose**: Establishes the complete language selection system with all event listeners and accessibility features.

**Key Components**:
- **Element References**: Captures all necessary DOM elements
- **Click Event Handling**: Toggle button and option selection
- **Outside Click Detection**: Closes dropdown when clicking elsewhere
- **Keyboard Navigation**: Full accessibility support
- **Focus Management**: Proper focus handling for screen readers

**Event Listeners Registered**:
- Language toggle click/keyboard events
- Individual language option selections
- Document-wide click detection for closing dropdown
- Escape key handling
- Arrow key navigation within dropdown

**Example Usage**:
```html
<!-- HTML structure expected -->
<button id="languageToggle" aria-expanded="false">
    <span id="currentFlag">🇺🇸</span>
    <span id="currentLangCode">EN</span>
</button>
<div id="languageDropdown">
    <div class="language-option" data-lang="en">English</div>
    <div class="language-option" data-lang="es">Español</div>
</div>
```

---

### Dropdown State Management

#### toggleLanguageDropdown()
```javascript
function toggleLanguageDropdown() {
    const languageToggle = document.getElementById('languageToggle');
    const isOpen = languageToggle.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
        closeLanguageDropdown();
    } else {
        openLanguageDropdown();
    }
}
```

**Purpose**: Switches between open and closed states of the language dropdown.

**Logic**:
- Reads current state from `aria-expanded` attribute
- Delegates to appropriate open/close function
- Maintains proper ARIA states for accessibility

**Triggered**: User clicks language toggle button or presses Enter/Space key.

---

#### openLanguageDropdown()
```javascript
function openLanguageDropdown() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    
    languageToggle.setAttribute('aria-expanded', 'true');
    languageDropdown.classList.add('active');
    
    // Focus management with delay for smooth animation
    setTimeout(() => {
        const firstOption = languageDropdown.querySelector('.language-option');
        if (firstOption) {
            firstOption.focus();
        }
    }, 100);
}
```

**Purpose**: Opens the language dropdown with proper accessibility states and focus management.

**Key Actions**:
- Sets `aria-expanded="true"` for screen readers
- Adds `active` class for visual styling
- Focuses first option after 100ms delay (allows for CSS transitions)

---

#### closeLanguageDropdown()
```javascript
function closeLanguageDropdown() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    
    languageToggle.setAttribute('aria-expanded', 'false');
    languageDropdown.classList.remove('active');
}
```

**Purpose**: Closes the language dropdown and updates accessibility states.

**Triggered**:
- Click outside dropdown
- Escape key press
- Language selection
- Window resize events

---

### Keyboard Navigation System

#### focusFirstOption()
```javascript
function focusFirstOption() {
    const firstOption = document.querySelector('.language-option');
    if (firstOption) {
        firstOption.focus();
    }
}
```

**Purpose**: Moves focus to the first language option in the dropdown.

**Triggered**: When dropdown opens via down arrow key from toggle button.

---

#### focusNextOption(currentIndex)
```javascript
function focusNextOption(currentIndex) {
    const options = document.querySelectorAll('.language-option');
    const nextIndex = (currentIndex + 1) % options.length;
    options[nextIndex].focus();
}
```

**Purpose**: Implements circular navigation to the next language option.

**Logic**:
- Uses modulo operator for wraparound (last option → first option)
- Maintains focus within dropdown boundaries

**Triggered**: Down arrow key press while focused on a language option.

---

#### focusPreviousOption(currentIndex)
```javascript
function focusPreviousOption(currentIndex) {
    const options = document.querySelectorAll('.language-option');
    const prevIndex = currentIndex === 0 ? options.length - 1 : currentIndex - 1;
    options[prevIndex].focus();
}
```

**Purpose**: Implements circular navigation to the previous language option.

**Logic**:
- Handles wraparound for first option (first option → last option)
- Maintains focus within dropdown boundaries

**Triggered**: Up arrow key press while focused on a language option.

---

### Language Selection and Persistence

#### selectLanguage(langCode)
```javascript
function selectLanguage(langCode) {
    // Language data structure
    const languages = {
        'en': {
            flag: '🇺🇸',
            code: 'EN'
        },
        'es': {
            flag: '🇲🇽',
            code: 'ES'
        }
    };
    
    const selectedLang = languages[langCode];
    
    if (selectedLang && currentFlag && currentLangCode) {
        // Update UI display
        currentFlag.textContent = selectedLang.flag;
        currentLangCode.textContent = selectedLang.code;
        
        // Persist user choice
        localStorage.setItem('selectedLanguage', langCode);
        
        // Update HTML attributes for i18next
        document.documentElement.setAttribute('lang', langCode);
        document.documentElement.setAttribute('data-lang', langCode);
        
        // Notify i18next system
        const languageChangeEvent = new CustomEvent('languageChanged', {
            detail: { language: langCode }
        });
        document.dispatchEvent(languageChangeEvent);
    }
    
    // Cleanup and focus management
    closeLanguageDropdown();
    document.getElementById('languageToggle').focus();
}
```

**Purpose**: Core function that handles complete language switching workflow.

**Process Flow**:
1. **UI Update**: Changes flag emoji and language code display
2. **Persistence**: Stores selection in localStorage for future visits
3. **HTML Attributes**: Updates document language attributes for i18next
4. **Event Dispatch**: Triggers custom event for i18next integration
5. **Cleanup**: Closes dropdown and restores focus to toggle

**Language Data Structure**:
- English: US flag 🇺🇸, code "EN"
- Spanish: Mexican flag 🇲🇽, code "ES" (appropriate for CDMX location)

**Triggered**:
- User clicks language option
- Initial page load (automatic detection)
- Programmatic language changes

---

### Navigation State Management

#### setActiveNavLink()
```javascript
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-link');
    
    // Clear all active states
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Set active state for current page
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        // Normalize paths for comparison
        const normalizedLinkPath = linkPath === '/' || linkPath.endsWith('/index.html') ? 'index.html' : linkPath.split('/').pop();
        const normalizedCurrentPath = currentPath === '/' || currentPath.endsWith('/index.html') ? 'index.html' : currentPath.split('/').pop();
        
        if (normalizedLinkPath === normalizedCurrentPath) {
            link.classList.add('active');
        }
    });
}
```

**Purpose**: Automatically highlights the current page in the navigation menu.

**Logic**:
1. Gets current page path from `window.location.pathname`
2. Removes existing `active` classes from all navigation links
3. Normalizes paths to handle root/index.html equivalence
4. Compares normalized paths and adds `active` class to matching link

**Path Normalization Examples**:
- `/` → `index.html`
- `/index.html` → `index.html`
- `/about.html` → `about.html`
- `/path/to/classes.html` → `classes.html`

**CSS Integration**:
```css
.navbar-link.active {
    /* Active link styling */
    color: #40689a; /* Lapis Lazuli accent color */
    font-weight: bold;
}
```

---

### Initialization and Language Detection

#### initializeLanguageOnLoad()
```javascript
function initializeLanguageOnLoad() {
    // Check for stored preference first
    const storedLang = localStorage.getItem('selectedLanguage');
    
    if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
        selectLanguage(storedLang);
    } else {
        // Browser language detection with fallback
        const browserLang = navigator.language.toLowerCase();
        const defaultLang = browserLang.startsWith('es') ? 'es' : 'en';
        selectLanguage(defaultLang);
    }
}
```

**Purpose**: Establishes initial language state based on user preferences or browser detection.

**Priority Order**:
1. **Stored Preference**: localStorage value (highest priority)
2. **Browser Detection**: `navigator.language` starting with "es"
3. **Default Fallback**: English (final fallback)

**Language Detection Examples**:
- `navigator.language = "es-MX"` → Spanish
- `navigator.language = "es-ES"` → Spanish
- `navigator.language = "en-US"` → English
- `navigator.language = "fr-FR"` → English (fallback)

**Triggered**: Second DOMContentLoaded event listener (line 268).

---

### Responsive Behavior

#### Window Resize Handler
```javascript
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        closeLanguageDropdown();
    }, 150);
});
```

**Purpose**: Handles responsive behavior during window resize events.

**Debouncing Logic**:
- Uses `clearTimeout`/`setTimeout` pattern to prevent excessive function calls
- 150ms delay ensures resize events have settled
- Prevents UI issues during device orientation changes

**Why Close Dropdown**:
- Prevents dropdown positioning issues on mobile rotation
- Ensures consistent UI state after layout changes
- Avoids dropdown appearing in wrong location post-resize

---

### Global API Export

#### Window Object Integration
```javascript
if (typeof window !== 'undefined') {
    window.SGPNavbar = {
        selectLanguage,
        toggleLanguageDropdown,
        setActiveNavLink
    };
}
```

**Purpose**: Exposes key functions for use by other scripts or external integrations.

**Available Methods**:
- `window.SGPNavbar.selectLanguage('es')`: Programmatically change language
- `window.SGPNavbar.toggleLanguageDropdown()`: Control dropdown state
- `window.SGPNavbar.setActiveNavLink()`: Refresh active link highlighting

**Usage Examples**:
```javascript
// Programmatic language change
window.SGPNavbar.selectLanguage('es');

// Force refresh navigation state after dynamic content loading
window.SGPNavbar.setActiveNavLink();
```

---

## i18next Integration

The navbar provides seamless integration with the i18next internationalization system through multiple mechanisms:

### Custom Event System
```javascript
const languageChangeEvent = new CustomEvent('languageChanged', {
    detail: { language: langCode }
});
document.dispatchEvent(languageChangeEvent);
```

**Purpose**: Notifies the i18next system when language changes occur.

**Event Listener Setup** (typically in main i18n file):
```javascript
document.addEventListener('languageChanged', function(event) {
    const newLanguage = event.detail.language;
    i18next.changeLanguage(newLanguage);
});
```

### HTML Attribute Management
```javascript
document.documentElement.setAttribute('lang', langCode);
document.documentElement.setAttribute('data-lang', langCode);
```

**Purpose**: Updates document-level language attributes for:
- Screen reader accessibility
- CSS language-specific styling
- i18next automatic detection

### Persistent Preferences
```javascript
localStorage.setItem('selectedLanguage', langCode);
```

**Benefits**:
- Remembers user choice across page visits
- Integrates with i18next localStorage backend
- Provides consistent user experience

---

## Accessibility Features

The navbar implementation follows WCAG 2.1 AA accessibility guidelines:

### ARIA Support
```javascript
// Proper ARIA expanded states
languageToggle.setAttribute('aria-expanded', 'true');
languageToggle.setAttribute('aria-expanded', 'false');

// Focusable elements
option.setAttribute('tabindex', '0');
```

### Keyboard Navigation
- **Tab Navigation**: All interactive elements are keyboard accessible
- **Arrow Keys**: Navigate between language options
- **Enter/Space**: Activate buttons and options
- **Escape**: Close dropdown and return focus

### Focus Management
```javascript
// Return focus to toggle after selection
document.getElementById('languageToggle').focus();

// Focus first option when opening dropdown
setTimeout(() => {
    const firstOption = languageDropdown.querySelector('.language-option');
    if (firstOption) {
        firstOption.focus();
    }
}, 100);
```

### Screen Reader Support
- Proper ARIA states (`aria-expanded`)
- Semantic HTML structure
- Language attributes for content identification
- Focus announcements through proper focus management

---

## Responsiveness

### Mobile Considerations
```javascript
// Close dropdown on window resize
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        closeLanguageDropdown();
    }, 150);
});
```

### CSS Integration Requirements
```css
/* Dropdown visibility controlled by JavaScript */
.language-dropdown {
    display: none;
}

.language-dropdown.active {
    display: block;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
    .language-dropdown {
        /* Mobile-specific positioning */
    }
}
```

### Touch Device Support
- Click events work on touch devices
- Proper touch target sizes (minimum 44px)
- No hover-dependent functionality

---

## Final Notes

### Browser Compatibility
- Modern browsers supporting ES6+ features
- Custom Events API
- localStorage support
- CSS class manipulation

### Performance Considerations
- Event listener debouncing for resize events
- Minimal DOM queries with element caching
- Efficient event delegation patterns

### Integration Requirements
- Lucide icons library (optional)
- i18next library for full internationalization
- Proper HTML structure with required IDs and classes
- CSS styles for `.active` states and dropdown visibility

### Maintenance Guidelines
- Language data structure easily extensible for additional languages
- Event-driven architecture supports easy feature additions
- Modular function design allows for partial implementations
- Comprehensive error checking prevents runtime failures

This navbar implementation provides a robust, accessible, and user-friendly foundation for the SGP Yoga website's navigation and internationalization needs.
