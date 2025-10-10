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
 * Listen for language change events and reload Lucide icons
 * This ensures icons render properly after content updates
 */
document.addEventListener('languageChanged', function(event) {
    // Re-initialize Lucide icons after language change
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
