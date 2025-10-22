/**
 * SGP Yoga - Events Page JavaScript
 * Handles event filtering, modal functionality, and interactive features
 */

// =============================================================================
// EVENT DATA STRUCTURE
// =============================================================================
/**
 * Purpose: Store complete event details for populating the modal
 * Structure: Maps event IDs to their full data from translation files
 * 
 * Why we do this: Event cards show limited info, but modal needs complete details.
 * This data structure is populated from i18next translations after they load.
 */
const eventData = {};

// =============================================================================
// DOM ELEMENT REFERENCES
// =============================================================================
/**
 * Purpose: Cache DOM element references for better performance
 * We store these once on page load instead of querying repeatedly
 */
let filterButtons;
let eventCards;
let modal;
let modalClose;
let modalContent = {};

// =============================================================================
// INITIALIZATION
// =============================================================================
/**
 * Purpose: Set up all event listeners and initialize features when DOM is ready
 * This runs after the page HTML has fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements for performance
    initializeDOMReferences();
    
    // Set up event filtering functionality
    initializeFilters();
    
    // Set up modal functionality
    initializeModal();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Load event data from translations after a small delay to ensure i18n is ready
    setTimeout(() => {
        loadEventDataFromTranslations();
    }, 500);
    
    console.log('Events page initialized successfully');
});

// =============================================================================
// DOM REFERENCES INITIALIZATION
// =============================================================================
/**
 * Purpose: Cache all DOM element references in one place
 * This improves performance by querying the DOM once instead of repeatedly
 */
function initializeDOMReferences() {
    // Filter buttons
    filterButtons = document.querySelectorAll('.filter-btn');
    
    // Event cards
    eventCards = document.querySelectorAll('.event-card');
    
    // Modal elements
    modal = document.getElementById('eventModal');
    modalClose = document.getElementById('modalClose');
    
    // Modal content elements (for populating with event data)
    modalContent = {
        image: document.getElementById('modalEventImage'),
        badge: document.getElementById('modalEventBadge'),
        title: document.getElementById('modalEventTitle'),
        description: document.getElementById('modalEventDescription'),
        instructor: document.getElementById('modalEventInstructor'),
        dateTime: document.getElementById('modalEventDateTime'),
        location: document.getElementById('modalEventLocation'),
        price: document.getElementById('modalEventPrice'),
        registerBtn: document.getElementById('modalRegisterBtn')
    };
}

// =============================================================================
// EVENT DATA LOADING
// =============================================================================
/**
 * Purpose: Load event data from i18next translations
 * This ensures we have all event details available for the modal
 * 
 * Why: The HTML only contains basic info (title, date, location).
 * Full details (description, instructor, price, etc.) come from translations.
 */
function loadEventDataFromTranslations() {
    // Wait for i18next OR SGPi18n to be ready
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkI18n = setInterval(() => {
        attempts++;
        
        // Check if either i18next or SGPi18n is ready
        const i18nReady = (typeof i18next !== 'undefined' && i18next.isInitialized) ||
                          (typeof SGPi18n !== 'undefined' && SGPi18n.isInitialized);
        
        if (i18nReady || attempts >= maxAttempts) {
            clearInterval(checkI18n);
            
            if (!i18nReady) {
                console.warn('i18n not fully ready, loading with fallback');
            }
            
            // Load data for all 5 events
            ['event1', 'event2', 'event3', 'event4', 'event5'].forEach(eventId => {
                // Try i18next first, then fall back to SGPi18n
                const t = (key) => {
                    if (typeof i18next !== 'undefined' && i18next.isInitialized) {
                        return i18next.t(key);
                    } else if (typeof SGPi18n !== 'undefined') {
                        return SGPi18n.t(key);
                    }
                    return key; // Fallback to key itself
                };
                
                eventData[eventId] = {
                    title: t(`events:events.${eventId}.title`),
                    category: t(`events:events.${eventId}.category`),
                    date: t(`events:events.${eventId}.date`),
                    time: t(`events:events.${eventId}.time`),
                    location: t(`events:events.${eventId}.location`),
                    shortDescription: t(`events:events.${eventId}.shortDescription`),
                    fullDescription: t(`events:events.${eventId}.fullDescription`),
                    instructor: t(`events:events.${eventId}.instructor`),
                    price: t(`events:events.${eventId}.price`)
                };
            });
            
            console.log('Event data loaded from translations:', eventData);
        }
    }, 100);
}

// =============================================================================
// FILTER FUNCTIONALITY
// =============================================================================
/**
 * Purpose: Set up event category filtering (All, Workshops, Retreats, Trainings)
 * Users can click filter buttons to show only events of a specific type
 */
function initializeFilters() {
    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the filter category from data attribute
            const filterCategory = this.getAttribute('data-filter');
            
            // Update active button state
            updateActiveFilter(this);
            
            // Filter event cards based on selection
            filterEvents(filterCategory);
        });
    });
}

/**
 * Purpose: Update which filter button appears active
 * Removes 'active' class from all buttons, adds it to the clicked button
 * 
 * @param {HTMLElement} activeButton - The filter button that was clicked
 */
function updateActiveFilter(activeButton) {
    // Remove 'active' class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add 'active' class to clicked button
    activeButton.classList.add('active');
}

/**
 * Purpose: Show/hide event cards based on selected category
 * 
 * @param {string} category - The category to filter by ('all', 'workshop', 'retreat', 'training')
 * 
 * How it works:
 * - If category is 'all', show all cards
 * - Otherwise, show only cards matching the selected category
 * - Uses 'hidden' class to hide non-matching cards
 */
function filterEvents(category) {
    eventCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all') {
            // Show all cards
            card.classList.remove('hidden');
        } else {
            // Show only cards matching the selected category
            if (cardCategory === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}

// =============================================================================
// MODAL FUNCTIONALITY
// =============================================================================
/**
 * Purpose: Set up modal (popup) functionality for displaying event details
 * Modal opens when user clicks an event card, closes via X button, overlay click, or ESC key
 */
function initializeModal() {
    // Add click event to each event card to open modal
    eventCards.forEach(card => {
        card.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event');
            openModal(eventId);
        });
    });
    
    // Close modal when X button is clicked
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside the modal container (on the dark overlay)
    if (modal) {
        modal.addEventListener('click', function(event) {
            // Only close if clicking the overlay itself, not the modal content
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal when ESC key is pressed (accessibility feature)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Set up register button functionality
    initializeRegisterButton();
}

/**
 * Purpose: Open modal and populate it with event details
 * 
 * @param {string} eventId - The ID of the event to display (e.g., 'event1', 'event2')
 * 
 * How it works:
 * 1. Get event data from eventData object
 * 2. Populate all modal fields with event information
 * 3. Set appropriate event image based on category
 * 4. Show the modal
 * 5. Prevent body scrolling while modal is open
 */
function openModal(eventId) {
    const event = eventData[eventId];
    
    if (!event) {
        console.error(`Event data not found for: ${eventId}`);
        return;
    }
    
    // Populate modal with event data
    modalContent.title.textContent = event.title;
    modalContent.badge.textContent = event.category;
    modalContent.description.textContent = event.fullDescription;
    modalContent.instructor.textContent = event.instructor;
    modalContent.dateTime.textContent = `${event.date} • ${event.time}`;
    modalContent.location.textContent = event.location;
    modalContent.price.textContent = event.price;
    
    // Set event image based on category
    // Map event categories to appropriate images
    const eventCard = document.querySelector(`[data-event="${eventId}"]`);
    const category = eventCard.getAttribute('data-category');
    let imagePath = '';
    
    switch(category) {
        case 'workshop':
            imagePath = 'assets/photos/inUse/events/workshops-720.webp';
            break;
        case 'retreat':
            imagePath = 'assets/photos/inUse/events/retreats-720.webp';
            break;
        case 'training':
            imagePath = 'assets/photos/inUse/events/teacher-trainings-720.webp';
            break;
        default:
            imagePath = 'assets/photos/inUse/events/workshops-720.webp';
    }
    
    modalContent.image.src = imagePath;
    modalContent.image.alt = event.title;
    
    // Show modal
    modal.classList.add('active');
    
    // Prevent body scroll when modal is open (improves UX)
    document.body.style.overflow = 'hidden';
    
    // Reinitialize Lucide icons for modal content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Purpose: Close the modal and restore normal page behavior
 * 
 * How it works:
 * 1. Hide the modal by removing 'active' class
 * 2. Re-enable body scrolling
 */
function closeModal() {
    modal.classList.remove('active');
    
    // Re-enable body scroll
    document.body.style.overflow = '';
}

// =============================================================================
// LANGUAGE CHANGE HANDLING
// =============================================================================
/**
 * Purpose: Reload event data when language changes
 * This ensures modal displays correct language after user switches languages
 * 
 * Why: When user changes language, all i18next translations update,
 * but our cached eventData needs to be refreshed with new language
 */
document.addEventListener('languageChanged', function() {
    // Wait a moment for translations to fully update
    setTimeout(() => {
        loadEventDataFromTranslations();
    }, 100);
});

// =============================================================================
// REGISTER BUTTON FUNCTIONALITY
// =============================================================================
/**
 * Purpose: Handle registration button clicks in modal
 * Opens WhatsApp chat with pre-filled message for event registration
 */
function initializeRegisterButton() {
    if (modalContent.registerBtn) {
        modalContent.registerBtn.addEventListener('click', function() {
            // Get current event title from modal
            const eventTitle = modalContent.title.textContent;
            
            // Create WhatsApp message with event details
            const message = encodeURIComponent(`Hi! I would like to register for ${eventTitle}. Please provide me with more information about registration process, availability, and payment options. Thank you!`);
            
            // Open WhatsApp with pre-filled message
            // Phone number: +52 55 3906 1305 (format for WhatsApp: 525539061305)
            window.open(`https://wa.me/525539061305?text=${message}`, '_blank');
            
            console.log('Register button clicked, opening WhatsApp...');
        });
    } else {
        console.error('Register button not found in modal');
    }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Purpose: Smooth scroll to event section (if needed for navigation)
 * Can be used for anchor links or "back to events" functionality
 * 
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// =============================================================================
// EXPORT FOR TESTING (if needed)
// =============================================================================
// Uncomment if you want to test functions externally
// window.eventsPage = {
//     filterEvents,
//     openModal,
//     closeModal,
//     loadEventDataFromTranslations
// };
