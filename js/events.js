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

/**
 * Purpose: Reference to the events grid container for dynamic rendering
 */
let eventsGrid;

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
    
    // Wait for i18n to be ready, then render events and initialize features
    waitForI18n().then(() => {
        // Render events dynamically from eventsData.js
        renderEvents();
        
        // Load full event data from translations for modal
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
    
    // Events grid container (for dynamic rendering)
    eventsGrid = document.getElementById('eventsGrid');
    
    // Event cards (will be queried after rendering)
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
// I18N READINESS CHECK
// =============================================================================
/**
 * Purpose: Wait for i18next to be fully initialized before rendering
 * This ensures translations are available when we create event cards
 * 
 * @returns {Promise} Resolves when i18n is ready
 * 
 * Why: We need translations to be loaded before rendering event cards,
 * otherwise they'll show translation keys instead of actual text
 */
function waitForI18n() {
    return new Promise((resolve) => {
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
                    console.warn('i18n not fully ready after timeout');
                }
                
                resolve();
            }
        }, 100);
    });
}

// =============================================================================
// DYNAMIC EVENT RENDERING
// =============================================================================
/**
 * Purpose: Dynamically render event cards from eventsData array
 * This is the core function that creates HTML for all events
 * 
 * How it works:
 * 1. Clears existing events
 * 2. Loops through eventsData array
 * 3. Creates HTML for each event using template literals
 * 4. Fetches translations from i18n
 * 5. Inserts HTML into events grid
 * 6. Updates eventCards reference
 * 7. Reinitializes Lucide icons
 */
function renderEvents() {
    if (!eventsGrid) {
        console.error('Events grid container not found');
        return;
    }
    
    // Check if eventsData exists
    if (typeof eventsData === 'undefined' || !eventsData.length) {
        console.error('eventsData not found or empty');
        return;
    }
    
    // Clear existing events
    eventsGrid.innerHTML = '';
    
    // Get translation function
    const t = (key) => {
        if (typeof i18next !== 'undefined' && i18next.isInitialized) {
            return i18next.t(key);
        } else if (typeof SGPi18n !== 'undefined') {
            return SGPi18n.t(key);
        }
        return key; // Fallback to key itself
    };
    
    // Render each event
    eventsData.forEach(event => {
        const eventId = event.id;
        const category = event.category;
        const imagePath = getEventImage(event, false);
        
        // Create event card HTML
        const eventCardHTML = `
            <div class="event-card" data-category="${category}" data-event="${eventId}">
                <div class="event-card-image">
                    <img src="${imagePath}" alt="${t(`events:events.${eventId}.title`)}" loading="lazy">
                    <span class="event-badge ${category}" data-i18n="events:events.${eventId}.category">${t(`events:events.${eventId}.category`)}</span>
                </div>
                <div class="event-card-content">
                    <h3 class="event-card-title" data-i18n="events:events.${eventId}.title">${t(`events:events.${eventId}.title`)}</h3>
                    <div class="event-card-meta">
                        <div class="event-meta-item">
                            <i data-lucide="calendar" class="meta-icon"></i>
                            <span data-i18n="events:events.${eventId}.date">${t(`events:events.${eventId}.date`)}</span>
                        </div>
                        <div class="event-meta-item">
                            <i data-lucide="map-pin" class="meta-icon"></i>
                            <span data-i18n="events:events.${eventId}.location">${t(`events:events.${eventId}.location`)}</span>
                        </div>
                    </div>
                    <p class="event-card-description" data-i18n="events:events.${eventId}.shortDescription">${t(`events:events.${eventId}.shortDescription`)}</p>
                </div>
            </div>
        `;
        
        // Insert event card into grid
        eventsGrid.insertAdjacentHTML('beforeend', eventCardHTML);
    });
    
    // Update eventCards reference after rendering
    eventCards = document.querySelectorAll('.event-card');
    
    // Reinitialize Lucide icons for newly rendered content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log(`Rendered ${eventsData.length} events`);
}

// =============================================================================
// EVENT DATA LOADING
// =============================================================================
/**
 * Purpose: Load event data from i18next translations
 * This ensures we have all event details available for the modal
 * 
 * Why: Dynamically rendered cards show basic info, but modal needs complete details.
 * Full details (description, instructor, price, etc.) come from translations.
 */
function loadEventDataFromTranslations() {
    // Get translation function
    const t = (key) => {
        if (typeof i18next !== 'undefined' && i18next.isInitialized) {
            return i18next.t(key);
        } else if (typeof SGPi18n !== 'undefined') {
            return SGPi18n.t(key);
        }
        return key; // Fallback to key itself
    };
    
    // Load data for all events from eventsData array
    if (typeof eventsData !== 'undefined') {
        eventsData.forEach(event => {
            const eventId = event.id;
            
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
    } else {
        console.error('eventsData not found');
    }
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
    
    // Set event image based on eventsData configuration
    const eventCard = document.querySelector(`[data-event="${eventId}"]`);
    const category = eventCard.getAttribute('data-category');
    
    // Find the event in eventsData to get its image
    let imagePath = '';
    if (typeof eventsData !== 'undefined') {
        const eventConfig = eventsData.find(e => e.id === eventId);
        if (eventConfig) {
            // Use high-res image for modal if available
            imagePath = getEventImage(eventConfig, true);
        }
    }
    
    // Fallback to category default if no image found
    if (!imagePath) {
        switch(category) {
            case 'workshop':
                imagePath = 'assets/photos/inUse/events/workshops-1080.webp';
                break;
            case 'retreat':
                imagePath = 'assets/photos/inUse/events/retreats-1080.webp';
                break;
            case 'training':
                imagePath = 'assets/photos/inUse/events/teacher-trainings-1080.webp';
                break;
            default:
                imagePath = 'assets/photos/inUse/events/workshops-1080.webp';
        }
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
 * Purpose: Re-render events and reload data when language changes
 * This ensures everything displays in the correct language after user switches languages
 * 
 * Why: When user changes language, we need to:
 * 1. Re-render all event cards with new translations
 * 2. Reload eventData for modal with new translations
 */
document.addEventListener('languageChanged', function() {
    // Wait a moment for translations to fully update
    setTimeout(() => {
        // Re-render events with new language
        renderEvents();
        
        // Reload event data for modal
        loadEventDataFromTranslations();
        
        // Re-initialize filters and modal for newly rendered cards
        initializeFilters();
        initializeModal();
        
        console.log('Events re-rendered for language change');
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
