/**
 * Classes Page JavaScript
 * Handles icon initialization and optional enhancements for the weekly schedule
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Optional: Highlight current time slot
    highlightCurrentTimeSlot();
    
    // Optional: Add smooth scroll behavior to schedule on mobile
    initMobileScrollEnhancement();
    
    // Initialize legend scroll indicators
    initLegendScrollIndicators();
    
    // Initialize class card tap-to-toggle for touch devices
    initClassCardToggle();
});

/**
 * Highlights the current time slot if within schedule hours (7 AM - 8 PM)
 */
function highlightCurrentTimeSlot() {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Only highlight if within schedule hours (7 AM to 8 PM)
    if (currentHour >= 7 && currentHour <= 20) {
        // Format hour for time label matching (7:00, 8:00, etc.)
        const timeString = currentHour < 10 ? `${currentHour}:00` : `${currentHour}:00`;
        
        // Find all time labels
        const timeLabels = document.querySelectorAll('.time-label');
        
        timeLabels.forEach(label => {
            if (label.textContent.trim() === timeString) {
                // Add a subtle highlight to the current time row
                label.style.backgroundColor = 'rgba(160, 103, 137, 0.1)';
                label.style.fontWeight = '600';
                
                // Also highlight the corresponding grid cells in this row
                const row = label.parentElement;
                const cells = row.querySelectorAll('.grid-cell');
                cells.forEach(cell => {
                    if (!cell.querySelector('.class-card')) {
                        cell.style.backgroundColor = 'rgba(160, 103, 137, 0.05)';
                    }
                });
            }
        });
    }
}

/**
 * Enhances horizontal scroll behavior on mobile/tablet
 */
function initMobileScrollEnhancement() {
    const scheduleContainer = document.querySelector('.schedule-container');
    
    if (!scheduleContainer) return;
    
    // Check if we're on a device that needs horizontal scrolling
    if (window.innerWidth < 1024) {
        // Scroll to today's column on page load
        scrollToToday();
        
        // Add scroll shadow indicators
        addScrollShadows();
    }
}

/**
 * Scrolls the schedule to today's column
 */
function scrollToToday() {
    const scheduleContainer = document.querySelector('.schedule-container');
    const dayHeaders = document.querySelectorAll('.day-header');
    
    if (!scheduleContainer || dayHeaders.length === 0) return;
    
    // Get current day (0 = Sunday, 1 = Monday, etc.)
    const today = new Date().getDay();
    
    // Convert Sunday (0) to index 6, and other days to index - 1
    // Because our grid starts with Monday
    const dayIndex = today === 0 ? 6 : today - 1;
    
    // Find the day header for today
    const todayHeader = dayHeaders[dayIndex];
    
    if (todayHeader) {
        // Scroll to today's column with smooth behavior
        setTimeout(() => {
            const scrollLeft = todayHeader.offsetLeft - scheduleContainer.offsetLeft - 20;
            scheduleContainer.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }, 300); // Delay to ensure DOM is fully rendered
    }
}

/**
 * Adds shadow indicators to show scrollable content
 */
function addScrollShadows() {
    const scheduleContainer = document.querySelector('.schedule-container');
    
    if (!scheduleContainer) return;
    
    // Update shadows on scroll
    const updateShadows = () => {
        const scrollLeft = scheduleContainer.scrollLeft;
        const maxScrollLeft = scheduleContainer.scrollWidth - scheduleContainer.clientWidth;
        
        // Add/remove classes based on scroll position
        if (scrollLeft > 10) {
            scheduleContainer.classList.add('has-scroll-left');
        } else {
            scheduleContainer.classList.remove('has-scroll-left');
        }
        
        if (scrollLeft < maxScrollLeft - 10) {
            scheduleContainer.classList.add('has-scroll-right');
        } else {
            scheduleContainer.classList.remove('has-scroll-right');
        }
    };
    
    // Initial check
    updateShadows();
    
    // Update on scroll
    scheduleContainer.addEventListener('scroll', updateShadows);
    
    // Update on window resize
    window.addEventListener('resize', updateShadows);
}

/**
 * Optional: Add click handlers to class cards for future booking functionality
 * Currently just logs the class info, but can be extended for booking modal
 */
document.addEventListener('DOMContentLoaded', function() {
    const classCards = document.querySelectorAll('.class-card');
    
    classCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get class information from card
            const className = this.querySelector('.class-name')?.textContent;
            const teacher = this.querySelector('.teacher-name')?.textContent;
            const location = this.querySelector('.class-location span:last-child')?.textContent;
            const style = this.dataset.style;
            
            // Log for now - can be replaced with booking modal
            console.log('Class clicked:', {
                name: className,
                teacher: teacher,
                location: location,
                style: style
            });
            
            // TODO: Open booking modal when booking system is implemented
            // showBookingModal({ className, teacher, location, style });
        });
    });
});

/**
 * Initialize legend scroll indicators
 * Show/hide arrows based on scroll position and handle click scrolling
 */
function initLegendScrollIndicators() {
    const legendSection = document.querySelector('.legend-section');
    const leftIndicator = document.querySelector('.legend-scroll-indicator.left');
    const rightIndicator = document.querySelector('.legend-scroll-indicator.right');
    
    if (!legendSection || !leftIndicator || !rightIndicator) return;
    
    // Only show on mobile/tablet (1024px and below)
    const isMobileOrTablet = () => window.innerWidth <= 1024;
    
    if (!isMobileOrTablet()) return;
    
    // Position indicators vertically based on section position
    function positionIndicators() {
        const rect = legendSection.getBoundingClientRect();
        const centerY = rect.top + (rect.height / 2);
        
        leftIndicator.style.top = `${centerY}px`;
        rightIndicator.style.top = `${centerY}px`;
    }
    
    // Update indicator visibility based on scroll position
    function updateIndicators() {
        if (!isMobileOrTablet()) {
            leftIndicator.classList.remove('visible');
            rightIndicator.classList.remove('visible');
            return;
        }
        
        // Update position
        positionIndicators();
        
        const scrollLeft = legendSection.scrollLeft;
        const maxScroll = legendSection.scrollWidth - legendSection.clientWidth;
        
        // Show left arrow if not at the start
        if (scrollLeft > 10) {
            leftIndicator.classList.add('visible');
        } else {
            leftIndicator.classList.remove('visible');
        }
        
        // Show right arrow if not at the end
        if (scrollLeft < maxScroll - 10) {
            rightIndicator.classList.add('visible');
        } else {
            rightIndicator.classList.remove('visible');
        }
    }
    
    // Scroll left when left arrow is clicked
    leftIndicator.addEventListener('click', function() {
        const scrollAmount = legendSection.clientWidth * 0.8;
        legendSection.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Scroll right when right arrow is clicked
    rightIndicator.addEventListener('click', function() {
        const scrollAmount = legendSection.clientWidth * 0.8;
        legendSection.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Update indicators on scroll (both window and section scroll)
    legendSection.addEventListener('scroll', updateIndicators);
    window.addEventListener('scroll', updateIndicators);
    
    // Update indicators on window resize
    window.addEventListener('resize', updateIndicators);
    
    // Initial update
    updateIndicators();
}

/**
 * Initialize class card tap-to-toggle for touch devices
 * On mobile/tablet, tap to expand/collapse card details instead of hover
 */
function initClassCardToggle() {
    const classCards = document.querySelectorAll('.class-card');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) return;
    
    classCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Check if this card is already active
            const isActive = this.classList.contains('active');
            
            // Close all other cards
            classCards.forEach(otherCard => {
                if (otherCard !== this) {
                    otherCard.classList.remove('active');
                }
            });
            
            // Toggle this card
            if (isActive) {
                this.classList.remove('active');
            } else {
                this.classList.add('active');
            }
        });
    });
    
    // Close active card when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.class-card')) {
            classCards.forEach(card => {
                card.classList.remove('active');
            });
        }
    });
}
