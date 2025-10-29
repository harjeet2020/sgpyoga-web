/**
 * SGP Yoga - Navbar Functionality
 * Handles language dropdown interactions and navbar responsive behavior
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Language dropdown functionality
    initializeLanguageDropdown();
    
    // Set active nav link based on current page
    setActiveNavLink();
    
    // Initialize mobile scroll behavior
    initMobileScrollBehavior();
});

/**
 * Initialize the language dropdown functionality
 */
function initializeLanguageDropdown() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const currentFlag = document.getElementById('currentFlag');
    const currentLangCode = document.getElementById('currentLangCode');
    
    if (!languageToggle || !languageDropdown) return;
    
    // Toggle dropdown when clicking the language button
    languageToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleLanguageDropdown();
    });
    
    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const selectedLang = this.getAttribute('data-lang');
            selectLanguage(selectedLang);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!languageToggle.contains(e.target) && !languageDropdown.contains(e.target)) {
            closeLanguageDropdown();
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLanguageDropdown();
        }
    });
    
    // Handle keyboard navigation in dropdown
    languageToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleLanguageDropdown();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            openLanguageDropdown();
            focusFirstOption();
        }
    });
    
    // Add keyboard navigation for options
    languageOptions.forEach((option, index) => {
        option.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.click();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    focusNextOption(index);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    focusPreviousOption(index);
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeLanguageDropdown();
                    languageToggle.focus();
                    break;
            }
        });
        
        // Make options focusable
        option.setAttribute('tabindex', '0');
    });
}

/**
 * Toggle the language dropdown
 */
function toggleLanguageDropdown() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    
    const isOpen = languageToggle.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
        closeLanguageDropdown();
    } else {
        openLanguageDropdown();
    }
}

/**
 * Open the language dropdown
 */
function openLanguageDropdown() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    
    languageToggle.setAttribute('aria-expanded', 'true');
    languageDropdown.classList.add('active');
    
    // Focus management
    setTimeout(() => {
        const firstOption = languageDropdown.querySelector('.language-option');
        if (firstOption) {
            firstOption.focus();
        }
    }, 100);
}

/**
 * Close the language dropdown
 */
function closeLanguageDropdown() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    
    languageToggle.setAttribute('aria-expanded', 'false');
    languageDropdown.classList.remove('active');
}

/**
 * Focus the first option in the dropdown
 */
function focusFirstOption() {
    const firstOption = document.querySelector('.language-option');
    if (firstOption) {
        firstOption.focus();
    }
}

/**
 * Focus the next option in the dropdown
 */
function focusNextOption(currentIndex) {
    const options = document.querySelectorAll('.language-option');
    const nextIndex = (currentIndex + 1) % options.length;
    options[nextIndex].focus();
}

/**
 * Focus the previous option in the dropdown
 */
function focusPreviousOption(currentIndex) {
    const options = document.querySelectorAll('.language-option');
    const prevIndex = currentIndex === 0 ? options.length - 1 : currentIndex - 1;
    options[prevIndex].focus();
}

/**
 * Select a language and update the UI
 */
function selectLanguage(langCode) {
    const currentFlag = document.getElementById('currentFlag');
    const currentLangCode = document.getElementById('currentLangCode');
    
    // Language data
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
        // Update the toggle display
        currentFlag.textContent = selectedLang.flag;
        currentLangCode.textContent = selectedLang.code;
        
        // Store the selection in localStorage
        localStorage.setItem('selectedLanguage', langCode);
        
        // Update the HTML lang attribute
        document.documentElement.setAttribute('lang', langCode);
        document.documentElement.setAttribute('data-lang', langCode);
        
        // Trigger language change event for i18n
        const languageChangeEvent = new CustomEvent('languageChanged', {
            detail: { language: langCode }
        });
        document.dispatchEvent(languageChangeEvent);
    }
    
    // Close the dropdown
    closeLanguageDropdown();
    
    // Return focus to the toggle button
    document.getElementById('languageToggle').focus();
}

/**
 * Set the active navigation link based on current page
 */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-link');
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        // Handle root path and index.html
        const normalizedLinkPath = linkPath === '/' || linkPath.endsWith('/index.html') ? 'index.html' : linkPath.split('/').pop();
        const normalizedCurrentPath = currentPath === '/' || currentPath.endsWith('/index.html') ? 'index.html' : currentPath.split('/').pop();
        
        if (normalizedLinkPath === normalizedCurrentPath) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize language on page load
 */
function initializeLanguageOnLoad() {
    // Check for stored language preference
    const storedLang = localStorage.getItem('selectedLanguage');
    
    if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
        selectLanguage(storedLang);
    } else {
        // Detect browser language or default to English
        const browserLang = navigator.language.toLowerCase();
        const defaultLang = browserLang.startsWith('es') ? 'es' : 'en';
        selectLanguage(defaultLang);
    }
}

// Initialize language on load
document.addEventListener('DOMContentLoaded', initializeLanguageOnLoad);

// Handle window resize for responsive behavior
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Close dropdown on resize
        closeLanguageDropdown();
    }, 150);
});

/**
 * Initialize mobile scroll behavior - hide navbar on scroll down, show on scroll up
 */
function initMobileScrollBehavior() {
    // Only apply on mobile devices (640px and below)
    const isMobile = () => window.innerWidth <= 640;
    
    if (!isMobile()) return;
    
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let scrollThreshold = 10; // Minimum scroll distance to trigger hide/show
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isMobile()) return;
        
        // Use requestAnimationFrame for better performance
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Ignore small scroll movements
                if (Math.abs(currentScrollTop - lastScrollTop) < scrollThreshold) {
                    isScrolling = false;
                    return;
                }
                
                // Scrolling down - hide navbar
                if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                    navbar.classList.add('navbar-hidden');
                } 
                // Scrolling up - show navbar
                else if (currentScrollTop < lastScrollTop) {
                    navbar.classList.remove('navbar-hidden');
                }
                
                // Always show navbar at the very top
                if (currentScrollTop <= 50) {
                    navbar.classList.remove('navbar-hidden');
                }
                
                lastScrollTop = currentScrollTop;
                isScrolling = false;
            });
            
            isScrolling = true;
        }
    });
    
    // Reset on window resize
    window.addEventListener('resize', function() {
        if (!isMobile()) {
            navbar.classList.remove('navbar-hidden');
        }
    });
}

// Export functions for potential use in other scripts
if (typeof window !== 'undefined') {
    window.SGPNavbar = {
        selectLanguage,
        toggleLanguageDropdown,
        setActiveNavLink,
        initMobileScrollBehavior
    };
}
