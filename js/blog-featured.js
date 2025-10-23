/* ==========================================================================
   SGP YOGA - BLOG FEATURED POSTS SLIDESHOW FUNCTIONALITY
   Adapted from testimonials.js for featured blog posts
   ========================================================================== */

/**
 * Featured Posts Slideshow Class
 * Handles slide transitions, auto-play, navigation controls, and accessibility
 */
class FeaturedPostsSlideshow {
    constructor() {
        this.slides = [];
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.isPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 10000; // 10 seconds (slightly faster than testimonials)
        this.isTransitioning = false;
        
        this.init();
    }

    /**
     * Initialize the slideshow
     */
    init() {
        // Wait for DOM and i18n to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup slideshow elements and event listeners
     */
    setup() {
        this.allSlides = document.querySelectorAll('.featured-slide');
        
        if (this.allSlides.length === 0) {
            console.log('No featured posts slideshow found on this page');
            return;
        }

        // Filter slides by current language
        this.filterSlidesByLanguage();
        
        if (this.totalSlides === 0) {
            console.log('No featured posts for current language');
            return;
        }

        this.setupElements();
        this.setupEventListeners();
        this.showSlide(0);
        this.startAutoPlay();

        // Handle visibility change (pause when tab is not visible)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else if (this.isPlaying) {
                this.startAutoPlay();
            }
        });
        
        // Listen for language changes
        if (window.i18next) {
            window.i18next.on('languageChanged', () => {
                this.handleLanguageChange();
            });
        }
    }
    
    /**
     * Filter slides by current language
     */
    filterSlidesByLanguage() {
        const currentLang = (typeof i18next !== 'undefined' && i18next.language) ? i18next.language : 'en';
        
        console.log('Filtering featured posts for language:', currentLang);
        
        // Hide all slides first
        this.allSlides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Show only slides matching current language
        this.slides = Array.from(this.allSlides).filter(slide => {
            const slideLang = slide.getAttribute('data-lang');
            if (slideLang === currentLang) {
                slide.style.display = '';
                return true;
            }
            return false;
        });
        
        this.totalSlides = this.slides.length;
        console.log(`Showing ${this.totalSlides} featured post(s) in ${currentLang}`);
        
        // Show/hide slideshow and message based on available posts
        this.updateVisibility();
    }
    
    /**
     * Handle language change
     */
    handleLanguageChange() {
        console.log('Language changed - updating featured posts');
        
        // Pause autoplay
        this.pauseAutoPlay();
        
        // Re-filter slides
        this.filterSlidesByLanguage();
        
        if (this.totalSlides === 0) {
            console.log('No featured posts for current language');
            // Visibility already updated by filterSlidesByLanguage
            return;
        }
        
        // Remove active class from all slides first
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Reset to first slide
        this.currentSlide = 0;
        
        // Add active class to first slide
        if (this.slides[0]) {
            this.slides[0].classList.add('active');
        }
        
        // Recreate dots
        this.createDots();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Restart autoplay if it was playing
        if (this.isPlaying) {
            this.startAutoPlay();
        }
    }
    
    /**
     * Update visibility of slideshow vs no-posts message
     */
    updateVisibility() {
        const slideshowContainer = document.getElementById('featuredPostsSlideshow');
        const noPostsMessage = document.getElementById('noFeaturedPosts');
        
        if (this.totalSlides === 0) {
            // No posts for current language - show message
            if (slideshowContainer) slideshowContainer.style.display = 'none';
            if (noPostsMessage) noPostsMessage.style.display = 'block';
        } else {
            // Have posts - show slideshow
            if (slideshowContainer) slideshowContainer.style.display = '';
            if (noPostsMessage) noPostsMessage.style.display = 'none';
        }
    }

    /**
     * Setup DOM elements and navigation
     */
    setupElements() {
        // Get navigation elements
        this.prevBtn = document.getElementById('featured-posts-prev');
        this.nextBtn = document.getElementById('featured-posts-next');
        this.dotsContainer = document.querySelector('.featured-posts-dots');

        // Create dots for navigation
        this.createDots();

        // Update button states
        this.updateNavigationButtons();
    }

    /**
     * Create navigation dots
     */
    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to featured post ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            
            if (i === 0) {
                dot.classList.add('active');
            }
            
            this.dotsContainer.appendChild(dot);
        }
        
        this.dots = this.dotsContainer.querySelectorAll('.dot');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }

        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Pause on hover
        const slideshow = document.querySelector('.featured-posts-slideshow');
        if (slideshow) {
            slideshow.addEventListener('mouseenter', () => this.pauseAutoPlay());
            slideshow.addEventListener('mouseleave', () => {
                if (this.isPlaying) this.startAutoPlay();
            });
        }

        // Touch/swipe support
        this.setupTouchEvents();
    }

    /**
     * Setup touch events for mobile swiping
     */
    setupTouchEvents() {
        const slideshow = document.querySelector('.featured-posts-slideshow');
        if (!slideshow) return;

        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        slideshow.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });

        slideshow.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Only process horizontal swipes (ignore vertical scrolling)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboard(e) {
        const slideshow = document.querySelector('.featured-posts-slideshow');
        if (!slideshow || !slideshow.contains(document.activeElement)) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
        }
    }

    /**
     * Show specific slide
     */
    showSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.isTransitioning = true;

        // Remove active class from current slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
        }

        // Update current slide index
        this.currentSlide = index;

        // Add active class to new slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }

        // Update navigation
        this.updateDots();
        this.updateNavigationButtons();

        // Reset transition flag after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600); // Match CSS transition duration
    }

    /**
     * Go to next slide
     */
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    /**
     * Go to previous slide
     */
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }

    /**
     * Go to specific slide
     */
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }

    /**
     * Update navigation dots
     */
    updateDots() {
        if (!this.dots) return;

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    /**
     * Update navigation buttons
     */
    updateNavigationButtons() {
        // For infinite loop, we don't disable buttons
        // But we update aria-labels for accessibility
        if (this.prevBtn) {
            this.prevBtn.setAttribute('aria-label', 'Previous featured post');
        }
        
        if (this.nextBtn) {
            this.nextBtn.setAttribute('aria-label', 'Next featured post');
        }
    }

    /**
     * Start auto-play
     */
    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }

        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    /**
     * Pause auto-play
     */
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    /**
     * Toggle auto-play
     */
    toggleAutoPlay() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            this.startAutoPlay();
        } else {
            this.pauseAutoPlay();
        }
    }

    /**
     * Destroy slideshow (cleanup)
     */
    destroy() {
        this.pauseAutoPlay();
        
        // Remove event listeners
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', () => this.previousSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', () => this.nextSlide());
        }

        // Remove dots event listeners
        if (this.dots) {
            this.dots.forEach(dot => {
                dot.removeEventListener('click', () => {});
            });
        }
    }
}

/**
 * Initialize featured posts slideshow when page loads
 */
let featuredPostsSlideshow = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeaturedPosts);
} else {
    initFeaturedPosts();
}

function initFeaturedPosts() {
    // Wait for i18n to be ready if it exists
    if (window.i18next && !window.i18next.isInitialized) {
        window.i18next.on('initialized', () => {
            featuredPostsSlideshow = new FeaturedPostsSlideshow();
        });
    } else {
        featuredPostsSlideshow = new FeaturedPostsSlideshow();
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (featuredPostsSlideshow) {
        featuredPostsSlideshow.destroy();
    }
});
