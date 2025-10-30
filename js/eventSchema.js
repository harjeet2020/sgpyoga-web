/**
 * SGP Yoga - Event Structured Data Generator
 * 
 * Purpose: Automatically generate Schema.org Event markup for SEO
 * This script reads event data from eventsData.js and translations,
 * then injects proper JSON-LD structured data into the page <head>
 * for better search engine visibility and rich results.
 * 
 * Benefits:
 * - Events appear in Google Search with rich snippets
 * - Users can add events to calendar directly from search
 * - Better discoverability in Google Events and Maps
 * - Improved click-through rates from search results
 */

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Main initialization function
 * Waits for dependencies (i18n, eventsData) then generates schema
 */
async function initializeEventSchema() {
    try {
        console.log('Initializing event structured data generation...');
        
        // Wait for required dependencies
        await waitForDependencies();
        
        // Generate and inject schema
        const schema = generateEventSchema();
        
        if (schema) {
            injectSchemaIntoHead(schema);
            console.log('Event structured data successfully generated and injected');
        } else {
            console.warn('No upcoming events found for structured data');
        }
        
    } catch (error) {
        console.error('Failed to initialize event schema:', error);
    }
}

/**
 * Wait for i18next and eventsData to be ready
 * @returns {Promise} Resolves when all dependencies are available
 */
function waitForDependencies() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds max
        
        const checkDependencies = setInterval(() => {
            attempts++;
            
            // Check for i18next
            const i18nReady = (typeof i18next !== 'undefined' && i18next.isInitialized) ||
                              (typeof SGPi18n !== 'undefined' && SGPi18n.isInitialized);
            
            // Check for eventsData
            const eventsDataReady = typeof eventsData !== 'undefined' && Array.isArray(eventsData);
            
            // Check for helper functions from eventsData.js
            const helpersReady = typeof isPastEvent === 'function';
            
            if (i18nReady && eventsDataReady && helpersReady) {
                clearInterval(checkDependencies);
                console.log('Event schema dependencies ready');
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkDependencies);
                reject(new Error('Timeout waiting for dependencies'));
            }
        }, 100);
    });
}

// =============================================================================
// SCHEMA GENERATION
// =============================================================================

/**
 * Generate complete Schema.org Event markup for all upcoming events
 * @returns {Object|null} Schema.org ItemList object or null if no events
 */
function generateEventSchema() {
    // Filter to only upcoming events
    const upcomingEvents = eventsData.filter(event => !isPastEvent(event));
    
    if (upcomingEvents.length === 0) {
        return null;
    }
    
    console.log(`Generating schema for ${upcomingEvents.length} upcoming events`);
    
    // Generate schema for each event
    const eventSchemas = upcomingEvents.map((event, index) => 
        generateSingleEventSchema(event, index + 1)
    ).filter(schema => schema !== null);
    
    if (eventSchemas.length === 0) {
        return null;
    }
    
    // Wrap in ItemList
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": eventSchemas
    };
}

/**
 * Generate Schema.org Event object for a single event
 * @param {Object} eventData - Event metadata from eventsData.js
 * @param {Number} position - Position in the list (for ItemList)
 * @returns {Object|null} Schema.org Event object or null on error
 */
function generateSingleEventSchema(eventData, position) {
    try {
        // Get translation function
        const t = getTranslationFunction();
        if (!t) {
            console.warn(`No translation function available for event ${eventData.id}`);
            return null;
        }
        
        // Get translations for this event
        const translationKey = `events:events.${eventData.id}`;
        const title = t(`${translationKey}.title`);
        const fullDescription = t(`${translationKey}.fullDescription`);
        const location = t(`${translationKey}.location`);
        const price = t(`${translationKey}.price`);
        
        // Skip if translation keys not found (would return the key itself)
        if (title.includes('events.events.') || !fullDescription) {
            console.warn(`Translations not found for event: ${eventData.id}`);
            return null;
        }
        
        // Parse location and price
        const locationData = parseLocation(location);
        const priceData = parsePrice(price);
        
        // Build event schema
        const eventSchema = {
            "@type": "Event",
            "name": title,
            "description": fullDescription,
            "image": `https://www.sgpyoga.co${getEventImage(eventData, false)}`,
            "startDate": eventData.startDate,
            "endDate": eventData.endDate || eventData.startDate,
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
                "@type": "Place",
                "name": locationData.venue || locationData.city,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": locationData.city,
                    "addressRegion": locationData.region,
                    "addressCountry": locationData.country
                }
            },
            "organizer": {
                "@type": "Organization",
                "name": "SGP Yoga",
                "url": "https://www.sgpyoga.co"
            }
        };
        
        // Add offers/price if available
        if (priceData.amount && priceData.currency) {
            eventSchema.offers = {
                "@type": "Offer",
                "price": priceData.amount,
                "priceCurrency": priceData.currency,
                "url": "https://www.sgpyoga.co/events.html",
                "availability": "https://schema.org/InStock"
            };
        }
        
        return eventSchema;
        
    } catch (error) {
        console.error(`Error generating schema for event ${eventData.id}:`, error);
        return null;
    }
}

// =============================================================================
// HELPER FUNCTIONS - TRANSLATION
// =============================================================================

/**
 * Get the appropriate translation function
 * Supports both i18next and SGPi18n wrappers
 * @returns {Function|null} Translation function or null
 */
function getTranslationFunction() {
    if (typeof i18next !== 'undefined' && i18next.isInitialized) {
        return (key) => i18next.t(key);
    } else if (typeof SGPi18n !== 'undefined' && SGPi18n.isInitialized) {
        return (key) => {
            const [namespace, ...rest] = key.split(':');
            return SGPi18n.t(rest.join(':'), namespace);
        };
    }
    return null;
}

// =============================================================================
// HELPER FUNCTIONS - LOCATION PARSING
// =============================================================================

/**
 * Parse location string into structured address components
 * Handles various formats:
 * - "Aguacate Studio, Mexico City"
 * - "Hari Om, Mexico City"
 * - "Bogotá, Colombia"
 * - "La Yoguitería, Calarca, Quindío, Colombia"
 * 
 * @param {String} locationString - Raw location string from translations
 * @returns {Object} Structured location with venue, city, region, country
 */
function parseLocation(locationString) {
    if (!locationString) {
        // Default to Mexico City
        return {
            venue: null,
            city: "Mexico City",
            region: "CDMX",
            country: "MX"
        };
    }
    
    // Split by comma and trim
    const parts = locationString.split(',').map(s => s.trim());
    
    // Detect country
    let country = "MX"; // Default to Mexico
    let region = "CDMX";
    let city = "Mexico City";
    let venue = null;
    
    // Check if Colombia is mentioned
    if (locationString.toLowerCase().includes('colombia')) {
        country = "CO";
        region = null;
        
        // Extract city (usually second-to-last or last part)
        if (parts.length >= 2) {
            city = parts[parts.length - 2]; // City usually before country
            if (parts.length >= 3) {
                venue = parts[0]; // First part is venue
            }
        }
    } else {
        // Mexico location
        if (parts.length >= 2) {
            venue = parts[0];
            city = parts[1];
            
            // Determine region
            if (city.toLowerCase().includes('mexico city') || city.toLowerCase().includes('cdmx')) {
                region = "CDMX";
                city = "Mexico City";
            }
        } else if (parts.length === 1) {
            city = parts[0];
        }
    }
    
    return {
        venue: venue,
        city: city,
        region: region,
        country: country
    };
}

// =============================================================================
// HELPER FUNCTIONS - PRICE PARSING
// =============================================================================

/**
 * Parse price string to extract numeric amount and currency
 * Handles formats like:
 * - "$400 MXN"
 * - "$23,000 MXN"
 * - "$1,800,000 COP ($8,000 MXN)"
 * 
 * @param {String} priceString - Raw price string from translations
 * @returns {Object} Object with amount (number) and currency (string)
 */
function parsePrice(priceString) {
    if (!priceString) {
        return { amount: null, currency: null };
    }
    
    // Use first price if multiple are listed
    const firstPrice = priceString.split('(')[0].trim();
    
    // Extract currency (last 3 uppercase letters)
    const currencyMatch = firstPrice.match(/([A-Z]{3})/);
    const currency = currencyMatch ? currencyMatch[1] : null;
    
    // Extract numeric amount (remove $, commas, and currency)
    const amountMatch = firstPrice.match(/[\d,]+/);
    if (amountMatch) {
        const amountString = amountMatch[0].replace(/,/g, '');
        const amount = parseFloat(amountString);
        return { amount, currency };
    }
    
    return { amount: null, currency: null };
}

// =============================================================================
// SCHEMA INJECTION
// =============================================================================

/**
 * Inject generated schema into page <head> as JSON-LD script
 * @param {Object} schema - Schema.org object to inject
 */
function injectSchemaIntoHead(schema) {
    // Create script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    
    // Add descriptive comment for debugging
    const comment = document.createComment(' Event Structured Data (Auto-generated) ');
    
    // Inject into head
    document.head.appendChild(comment);
    document.head.appendChild(script);
    
    console.log('Event schema injected into <head>');
}

// =============================================================================
// AUTO-INITIALIZE
// =============================================================================

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEventSchema);
} else {
    // DOM already loaded
    initializeEventSchema();
}
