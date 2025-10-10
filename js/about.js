/* ==========================================================================
   ABOUT PAGE JAVASCRIPT
   Handles smooth scrolling, active section highlighting, and animations
   ========================================================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Load the 'about' namespace for translations
    // Wait for SGPi18n to be initialized first
    await waitForI18nAndLoadNamespace();

    // Initialize anchor navigation
    initAnchorNavigation();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize style cards interaction (for touch devices)
    initStyleCards();
    
    // Initialize yoga hero interactive elements
    initYogaHero();
});

/**
 * Wait for SGPi18n to be initialized and load the about namespace
 */
async function waitForI18nAndLoadNamespace() {
    // Wait for SGPi18n to be available and initialized
    let attempts = 0;
    const maxAttempts = 20; // Wait up to 2 seconds (20 * 100ms)
    
    while (attempts < maxAttempts) {
        if (window.SGPi18n && window.SGPi18n.isInitialized) {
            try {
                await window.SGPi18n.loadNamespacesOnDemand(['about']);
                console.log('About namespace loaded successfully');
                return;
            } catch (error) {
                console.error('Error loading about namespace:', error);
                return;
            }
        }
        
        // Wait 100ms before next attempt
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    console.warn('SGPi18n not initialized after waiting, about page translations may not work');
}

/**
 * Initialize anchor navigation with smooth scrolling and active state tracking
 */
function initAnchorNavigation() {
    const anchorLinks = document.querySelectorAll('.anchor-link');
    const sections = document.querySelectorAll('section[id]');
    const anchorNav = document.getElementById('anchorNav');
    
    // Smooth scroll to section when anchor link is clicked
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate offset for sticky navigation
                const navbarHeight = 80; // Main navbar height
                const anchorNavHeight = anchorNav ? anchorNav.offsetHeight : 0;
                const offset = navbarHeight + anchorNavHeight;
                
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveLink(this);
            }
        });
    });
    
    // Track scroll position and update active link
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateActiveSection(sections, anchorLinks);
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Update active link based on current scroll position
 */
function updateActiveSection(sections, anchorLinks) {
    const scrollPosition = window.scrollY + 200; // Offset for better UX
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Remove active class from all links
            anchorLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to corresponding link
            const correspondingLink = document.querySelector(`.anchor-link[href="#${section.id}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

/**
 * Update active link when clicked
 */
function updateActiveLink(clickedLink) {
    const anchorLinks = document.querySelectorAll('.anchor-link');
    anchorLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
}

/**
 * Initialize scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        return; // Skip animations if user prefers reduced motion
    }
    
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.benefit-card, .style-card, .teacher-card, .space-card'
    );
    
    // Add fade-in class to elements
    animatedElements.forEach(el => el.classList.add('fade-in'));
    
    // Create Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class with slight delay for stagger effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Initialize style cards for touch devices
 * On mobile/tablet, tap to flip instead of hover
 */
function initStyleCards() {
    const styleCards = document.querySelectorAll('.style-card');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        styleCards.forEach(card => {
            let isFlipped = false;
            
            card.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Toggle flipped state
                const inner = this.querySelector('.style-card-inner');
                
                if (isFlipped) {
                    inner.style.transform = 'rotateY(0deg)';
                } else {
                    inner.style.transform = 'rotateY(180deg)';
                }
                
                isFlipped = !isFlipped;
            });
        });
    }
}

/**
 * Lazy load images for better performance
 * This is a fallback in case native lazy loading is not supported
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        return; // Browser handles it natively
    }
    
    // Fallback for older browsers
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Handle map button clicks
 * Opens Google Maps with the address
 */
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-space') || e.target.closest('.btn-space')) {
        e.preventDefault();
        
        // Get the address from the space card
        const spaceCard = e.target.closest('.space-card');
        const addressElement = spaceCard.querySelector('.space-address span');
        
        if (addressElement) {
            const address = addressElement.textContent.trim();
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        }
    }
});

/**
 * Initialize yoga hero interactive elements
 * Handles hover and click interactions for the 4 yoga aspects
 */
function initYogaHero() {
    const elements = document.querySelectorAll('.yoga-element');
    const textBox = document.querySelector('.yoga-text-box');
    const textElement = document.getElementById('yogaText');
    
    if (!elements.length || !textBox || !textElement) {
        return; // Elements not found, exit gracefully
    }
    
    // Store the default text and current selection
    let defaultText = textElement.textContent;
    let selectedElement = null;
    let isHovering = false;
    
    // Function to update text with smooth transition
    function updateText(newText, isDefault = false) {
        if (!newText) {
            return;
        }
        
        // Add fading class to fade out
        textBox.classList.add('fading');
        
        // Change text after fade out completes
        setTimeout(() => {
            // Update the text content directly
            textElement.textContent = newText;
            
            // Remove fading class to fade back in
            textBox.classList.remove('fading');
        }, 300); // Match CSS transition duration
    }
    
    // Function to get translated text for an element
    function getElementText(elementKey) {
        if (window.SGPi18n && window.SGPi18n.isInitialized) {
            const text = window.SGPi18n.t(`about:yoga.texts.${elementKey}`);
            // If translation returns the key itself, it means it wasn't found
            if (text && text !== `about:yoga.texts.${elementKey}`) {
                return text;
            }
        }
        // Fallback to directly accessing translations object
        if (window.SGPi18n && window.SGPi18n.translations) {
            const lang = window.SGPi18n.currentLanguage || 'en';
            return window.SGPi18n.translations[lang]?.about?.yoga?.texts?.[elementKey];
        }
        return null;
    }
    
    // Add event listeners to each element
    elements.forEach(element => {
        // Hover event - show corresponding text
        element.addEventListener('mouseenter', function() {
            isHovering = true;
            
            // Only change text on hover if no element is selected
            if (!selectedElement) {
                const elementKey = this.dataset.element;
                const text = getElementText(elementKey);
                if (text) {
                    updateText(text);
                }
            }
        });
        
        // Mouse leave - revert to default or selected text
        element.addEventListener('mouseleave', function() {
            isHovering = false;
            
            // If nothing is selected, go back to default
            if (!selectedElement) {
                setTimeout(() => {
                    if (!isHovering) {
                        if (window.SGPi18n && window.SGPi18n.isInitialized) {
                            defaultText = window.SGPi18n.t('about:yoga.defaultText');
                        }
                        updateText(defaultText);
                    }
                }, 100);
            } else if (selectedElement !== this) {
                // If a different element is selected, show that element's text
                const selectedKey = selectedElement.dataset.element;
                const text = getElementText(selectedKey);
                if (text) {
                    updateText(text);
                }
            }
        });
        
        // Click event - toggle selection with underline
        element.addEventListener('click', function() {
            const elementKey = this.dataset.element;
            const text = getElementText(elementKey);
            
            // If clicking the already selected element, deselect it
            if (selectedElement === this) {
                selectedElement.classList.remove('active');
                selectedElement = null;
                
                // Return to default text
                if (window.SGPi18n && window.SGPi18n.isInitialized) {
                    defaultText = window.SGPi18n.t('about:yoga.defaultText');
                }
                updateText(defaultText);
            } else {
                // Deselect previous element if any
                if (selectedElement) {
                    selectedElement.classList.remove('active');
                }
                
                // Select this element
                this.classList.add('active');
                selectedElement = this;
                
                // Update text
                if (text) {
                    updateText(text);
                }
            }
        });
    });
    
    // Update default text when language changes
    document.addEventListener('languageChanged', function() {
        if (window.SGPi18n && window.SGPi18n.isInitialized) {
            defaultText = window.SGPi18n.t('about:yoga.defaultText');
            
            // If no element is selected and not hovering, update to new default
            if (!selectedElement && !isHovering) {
                textElement.textContent = defaultText;
            }
        }
    });
}

/**
 * Listen for language change events and reload Lucide icons
 * This ensures icons render properly after content updates
 */
document.addEventListener('languageChanged', function(event) {
    // Re-initialize Lucide icons after language change
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
