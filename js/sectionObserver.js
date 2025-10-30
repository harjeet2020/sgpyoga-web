/**
 * Intersection Observer for Mobile Section Backgrounds
 * 
 * Purpose: On mobile devices, dynamically changes the background color of 
 * classes and events sections as they come into view during scrolling.
 * 
 * Why: Provides smooth, automatic visual feedback without requiring user 
 * interaction, creating a more engaging scrolling experience on mobile.
 */

// Initialize the observer only on mobile devices (768px and below)
function initSectionObserver() {
    // Check if we're on a mobile device
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (!isMobile) {
        return; // Exit early on desktop - we use :hover instead
    }
    
    // Select the sections we want to observe
    const classesSection = document.querySelector('.classes-section');
    const eventsSection = document.querySelector('.events-section');
    
    // Verify sections exist before proceeding
    if (!classesSection || !eventsSection) {
        console.warn('Section observer: Could not find classes or events sections');
        return;
    }
    
    // Configure the Intersection Observer
    // threshold: 0.3 means trigger when 30% of the section is visible
    // This provides a nice balance - not too early, not too late
    const observerOptions = {
        root: null, // Use viewport as root
        rootMargin: '0px', // No margin adjustment
        threshold: 0.3 // Trigger when 30% of section is visible
    };
    
    // Create the callback function that handles intersection changes
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Section is entering the viewport - add the 'in-view' class
                entry.target.classList.add('in-view');
            } else {
                // Section is leaving the viewport - remove the 'in-view' class
                entry.target.classList.remove('in-view');
            }
        });
    };
    
    // Create the observer instance
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Start observing both sections
    observer.observe(classesSection);
    observer.observe(eventsSection);
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSectionObserver);
} else {
    // DOM is already loaded
    initSectionObserver();
}

// Reinitialize on window resize to handle orientation changes or window resizing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Remove existing classes before reinitializing
        const sections = document.querySelectorAll('.classes-section, .events-section');
        sections.forEach(section => section.classList.remove('in-view'));
        
        // Reinitialize the observer with updated screen size
        initSectionObserver();
    }, 250); // Debounce resize events - wait 250ms after resize stops
});
