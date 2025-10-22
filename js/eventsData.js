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
    {
        // Unique identifier - must match the translation key in events.json
        id: 'event1',
        
        // Category: 'workshop', 'retreat', or 'training'
        // This determines filtering and badge styling
        category: 'workshop',
        
        // Image path for the event card
        // Can be unique per event or use category defaults
        image: 'assets/photos/inUse/events/workshops-720.webp',
        
        // Optional: Higher resolution image for modal or larger displays
        imageHigh: 'assets/photos/inUse/events/workshops-1080.webp'
    },
    {
        id: 'event2',
        category: 'retreat',
        image: 'assets/photos/inUse/events/retreats-720.webp',
        imageHigh: 'assets/photos/inUse/events/retreats-1080.webp'
    },
    {
        id: 'event3',
        category: 'training',
        image: 'assets/photos/inUse/events/teacher-trainings-720.webp',
        imageHigh: 'assets/photos/inUse/events/teacher-trainings-1080.webp'
    }
    
    // Add more events here following the same pattern
    // Example:
    // {
    //     id: 'event4',
    //     category: 'workshop',
    //     image: 'assets/photos/inUse/events/my-custom-event.webp'
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
// HELPER FUNCTION
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
