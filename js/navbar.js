/**
 * SGP Yoga - Navbar Functionality
 * Handles language dropdown interactions and navbar responsive behavior
 */

// CRITICAL: Only initialize essential features on DOMContentLoaded
// This prevents render-blocking and improves LCP
document.addEventListener('DOMContentLoaded', function() {
    // Language dropdown functionality (critical for UX)
    initializeLanguageDropdown();
    
    // Set active nav link based on current page (critical for navigation)
    setActiveNavLink();
});

// DEFERRED: Initialize non-critical features after page load
// This allows the hero section to render without waiting for these features
window.addEventListener('load', function() {
    // Initialize Lucide icons after page load (not needed for LCP)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize mobile scroll behavior after page load (not needed for LCP)
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
    // Use i18n.js to handle the language change if available
    if (typeof window.SGPi18n !== 'undefined' && window.SGPi18n.changeLanguage) {
        window.SGPi18n.changeLanguage(langCode);
        closeLanguageDropdown();
        return;
    }
    
    // Fallback if i18n not available yet
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
    const toggleBtn = document.getElementById('languageToggle');
    if (toggleBtn) {
        toggleBtn.focus();
    }
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
        
        // Special handling for blog - match if current path starts with /blog/dist/
        if (linkPath.includes('/blog/dist/')) {
            if (currentPath.includes('/blog/dist/')) {
                link.classList.add('active');
            }
            return;
        }
        
        // For non-blog pages, match exact paths or normalized paths
        // Normalize: treat '/', '/index.html', '/es/index.html' properly
        let normalizedLinkPath = linkPath;
        let normalizedCurrentPath = currentPath;
        
        // Remove trailing slashes for comparison
        if (normalizedLinkPath.endsWith('/')) {
            normalizedLinkPath = normalizedLinkPath.slice(0, -1);
        }
        if (normalizedCurrentPath.endsWith('/')) {
            normalizedCurrentPath = normalizedCurrentPath.slice(0, -1);
        }
        
        // Exact match
        if (normalizedLinkPath === normalizedCurrentPath) {
            link.classList.add('active');
            return;
        }
        
        // Handle index.html variations
        const linkIsIndex = normalizedLinkPath === '' || normalizedLinkPath === '/index.html' || normalizedLinkPath === '/es/index.html';
        const currentIsIndex = normalizedCurrentPath === '' || normalizedCurrentPath === '/index.html' || normalizedCurrentPath === '/es/index.html';
        
        // Match index pages
        if (linkIsIndex && currentIsIndex && normalizedLinkPath === normalizedCurrentPath) {
            link.classList.add('active');
            return;
        }
        
        // Match other pages by filename
        const linkFilename = normalizedLinkPath.split('/').pop();
        const currentFilename = normalizedCurrentPath.split('/').pop();
        
        if (linkFilename && linkFilename === currentFilename && linkFilename !== 'index.html') {
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
 * OPTIMIZED: Caches layout reads to prevent forced reflows
 */
function initMobileScrollBehavior() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Cache mobile state to avoid repeated layout reads
    let cachedIsMobile = window.innerWidth <= 640;
    
    // Early return if not mobile
    if (!cachedIsMobile) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show
    let ticking = false;
    
    // OPTIMIZED: Use passive listener to improve scroll performance
    window.addEventListener('scroll', function() {
        if (!cachedIsMobile) return;
        
        // Only schedule one RAF callback at a time
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Batch all layout reads together
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Ignore small scroll movements
                if (Math.abs(currentScrollTop - lastScrollTop) < scrollThreshold) {
                    ticking = false;
                    return;
                }
                
                // Batch all DOM writes together (after all reads)
                if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                    // Scrolling down - hide navbar
                    navbar.classList.add('navbar-hidden');
                } else if (currentScrollTop < lastScrollTop) {
                    // Scrolling up - show navbar
                    navbar.classList.remove('navbar-hidden');
                }
                
                // Always show navbar at the very top
                if (currentScrollTop <= 50) {
                    navbar.classList.remove('navbar-hidden');
                }
                
                lastScrollTop = currentScrollTop;
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true }); // CRITICAL: passive listener prevents scroll blocking
    
    // Update cached mobile state on resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Cache the new mobile state
            const wasMobile = cachedIsMobile;
            cachedIsMobile = window.innerWidth <= 640;
            
            // Reset navbar if switching from mobile to desktop
            if (wasMobile && !cachedIsMobile) {
                navbar.classList.remove('navbar-hidden');
            }
        }, 150);
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
