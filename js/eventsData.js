/**
 * SGP Yoga - Events Data Configuration
 * 
 * Purpose: Centralized event metadata for dynamic rendering
 * This file contains structural/technical data for events, while all
 * text content (titles, descriptions, etc.) comes from i18n translation files
 * 
 * How to add a new event:
 * 1. Add a new object to the eventsData array below
 * 2. Add corresponding translations to locales/en/events.json and locales/es/events.json
 * 3. That's it! The event will appear automatically on the page
 * 
 * How to remove an event:
 * 1. Remove the object from the eventsData array
 * 2. (Optional) Remove translations from JSON files
 */

// =============================================================================
// EVENT DATA CONFIGURATION
// =============================================================================

const eventsData = [
    // Aerial Yoga Photo Session, Colombia, November 2025 (Dani & Itzel)
    {
        // Unique identifier - must match the translation key in events.json
        // Format: {event-name}_{shortdate} for clarity and uniqueness
        id: 'aerial-yoga-photo_nov2025',
        
        // Category: 'workshop', 'retreat', or 'training'
        // This determines filtering and badge styling
        category: 'workshop',
        
        // Event dates in ISO format (YYYY-MM-DD)
        // For single-day events, startDate and endDate are the same
        // For multi-day events, use first and last day
        startDate: '2025-11-01',
        endDate: '2025-11-01',
        
        // Image path for the event card
        // Can be unique per event or use category defaults
        image: 'assets/photos/inUse/events/unique/aerial-yoga-photo_nov2025-720.webp',
        
        // Optional: Higher resolution image for modal or larger displays
        imageHigh: 'assets/photos/inUse/events/unique/aerial-yoga-photo_nov2025-1080.webp',
        
        // Optional: CSS object-position value for image positioning
        // Examples: 'center', 'top', 'bottom', 'top left', '50% 25%'
        // If not specified, defaults to 'center'
        cardImagePosition: 'center 37%',
        modalImagePosition: 'center 20%'
    },
    // Yoga Retreat, Colombia, November 2025 (Harjeet & Camila)
    {
        id: 'yoga-retreat_nov2025',
        category: 'retreat',
        startDate: '2025-11-14',
        endDate: '2025-11-17',
        image: 'assets/photos/inUse/events/unique/yoga-retreat_nov2025-720.webp',
        imageHigh: 'assets/photos/inUse/events/unique/yoga-retreat_nov2025-1080.webp',
        cardImagePosition: 'center top',
        modalImagePosition: 'center 62%'
    },
     // 100-Hour Aerial Teacher Training, Mexico City, June 2025 (Camila & Harjeet)
    {
        id: 'aerial-teacher-training_jun2025',
        category: 'training',
        startDate: '2025-06-21',
        endDate: '2025-09-27',
        image: 'assets/photos/inUse/events/unique/aerial-teacher-training_jun2025-720.webp',
        imageHigh: 'assets/photos/inUse/events/unique/aerial-teacher-training_jun2025-1080.webp',
        cardImagePosition: 'center',
        modalImagePosition: 'center 85%'
    },
    // 50-Hour Aerial Teacher Training, Colombia, November 2025 (Camila & Harjeet)
    {
        id: 'aerial-teacher-training_nov2025',
        category: 'training',
        startDate: '2025-11-08',
        endDate: '2025-12-14',
        image: 'assets/photos/inUse/events/unique/aerial-teacher-training_nov2025-720.webp',
        imageHigh: 'assets/photos/inUse/events/unique/aerial-teacher-training_nov2025-1080.webp',
        cardImagePosition: 'center',
        modalImagePosition: 'center 85%'
    }
    
    // Add more events here following the same pattern
    // Example:
    // {
    //     id: 'breathwork-fundamentals_dec2025',
    //     category: 'workshop',
    //     startDate: '2025-12-15',
    //     endDate: '2025-12-15',
    //     image: 'assets/photos/inUse/events/my-custom-event.webp',
    //     cardImagePosition: 'center',
    //     modalImagePosition: 'center'
    // }
];

// =============================================================================
// CATEGORY IMAGE DEFAULTS
// =============================================================================
/**
 * Purpose: Provide fallback images when an event doesn't specify a custom image
 * These are used if you don't provide an 'image' property for an event
 */
const categoryDefaults = {
    workshop: {
        image: 'assets/photos/inUse/events/workshops-720.webp',
        imageHigh: 'assets/photos/inUse/events/workshops-1080.webp'
    },
    retreat: {
        image: 'assets/photos/inUse/events/retreats-720.webp',
        imageHigh: 'assets/photos/inUse/events/retreats-1080.webp'
    },
    training: {
        image: 'assets/photos/inUse/events/teacher-trainings-720.webp',
        imageHigh: 'assets/photos/inUse/events/teacher-trainings-1080.webp'
    }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Purpose: Get the image path for an event, with fallback to category default
 * 
 * @param {object} event - Event object from eventsData
 * @param {boolean} highRes - Whether to get high-res version (for modal)
 * @returns {string} Image path
 */
function getEventImage(event, highRes = false) {
    const imageKey = highRes ? 'imageHigh' : 'image';
    
    // If event has custom image, use it
    if (event[imageKey]) {
        return event[imageKey];
    }
    
    // Otherwise fall back to category default
    const defaults = categoryDefaults[event.category];
    return defaults ? defaults[imageKey] : categoryDefaults.workshop[imageKey];
}

/**
 * Purpose: Determine if an event is in the past
 * An event is considered past if its end date has passed
 * 
 * @param {object} event - Event object from eventsData
 * @returns {boolean} True if event has ended
 */
function isPastEvent(event) {
    if (!event.endDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
    
    const eventEndDate = new Date(event.endDate);
    eventEndDate.setHours(0, 0, 0, 0);
    
    return eventEndDate < today;
}

/**
 * Purpose: Sort events by date
 * 
 * @param {Array} events - Array of event objects
 * @param {boolean} ascending - If true, sort earliest first. If false, latest first
 * @returns {Array} Sorted array of events
 */
function sortEventsByDate(events, ascending = true) {
    return [...events].sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        
        return ascending ? dateA - dateB : dateB - dateA;
    });
}
