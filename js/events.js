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
    
    // Load event data from translations after i18n is ready
    loadEventDataFromTranslations();
    
    // Set up event filtering functionality
    initializeFilters();
    
    // Set up modal functionality
    initializeModal();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
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
        bring: document.getElementById('modalEventBring'),
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
    // Wait for i18next to be ready
    const checkI18n = setInterval(() => {
        if (typeof i18next !== 'undefined' && i18next.isInitialized) {
            clearInterval(checkI18n);
            
            // Load data for all 5 events
            ['event1', 'event2', 'event3', 'event4', 'event5'].forEach(eventId => {
                eventData[eventId] = {
                    title: i18next.t(`events:events.${eventId}.title`),
                    category: i18next.t(`events:events.${eventId}.category`),
                    date: i18next.t(`events:events.${eventId}.date`),
                    time: i18next.t(`events:events.${eventId}.time`),
                    location: i18next.t(`events:events.${eventId}.location`),
                    shortDescription: i18next.t(`events:events.${eventId}.shortDescription`),
                    fullDescription: i18next.t(`events:events.${eventId}.fullDescription`),
                    instructor: i18next.t(`events:events.${eventId}.instructor`),
                    price: i18next.t(`events:events.${eventId}.price`),
                    whatToBring: i18next.t(`events:events.${eventId}.whatToBring`)
                };
            });
            
            console.log('Event data loaded from translations');
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
    modalContent.bring.textContent = event.whatToBring;
    
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
 * Currently opens email client, can be extended to link to registration form
 */
if (modalContent.registerBtn) {
    modalContent.registerBtn.addEventListener('click', function() {
        // Get current event title from modal
        const eventTitle = modalContent.title.textContent;
        
        // Open email client with pre-filled subject
        const subject = encodeURIComponent(`Registration Inquiry: ${eventTitle}`);
        const body = encodeURIComponent(`I would like to register for ${eventTitle}.\n\nPlease provide me with more information about registration process, availability, and payment options.\n\nThank you!`);
        
        window.location.href = `mailto:satgurprasaadyoga@gmail.com?subject=${subject}&body=${body}`;
        
        // Alternative: Open a registration form page
        // window.open('registration-form.html?event=' + encodeURIComponent(eventTitle), '_blank');
    });
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
