# Event Structured Data - Auto-Generation System

**Document Version:** 1.0  
**Last Updated:** January 30, 2025  
**Implemented:** SEO Checklist Step 2.3

---

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Technical Architecture](#technical-architecture)
4. [Data Structure](#data-structure)
5. [Adding New Events](#adding-new-events)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)
8. [SEO Benefits](#seo-benefits)
9. [Maintenance](#maintenance)

---

## Overview

The Event Structured Data system automatically generates [Schema.org Event](https://schema.org/Event) markup for all upcoming events on the SGP Yoga website. This improves search engine visibility and enables rich results in Google Search.

### What It Does

- **Reads event data** from `eventsData.js` and translation files
- **Generates proper Schema.org markup** for each upcoming event
- **Injects JSON-LD** into the page `<head>` automatically
- **Updates dynamically** as events are added or removed

### Files Involved

- **`js/eventSchema.js`** - Main generation script
- **`js/eventsData.js`** - Event metadata (dates, images, categories)
- **`locales/en/events.json`** - English event content (titles, descriptions, prices)
- **`locales/es/events.json`** - Spanish event content
- **`events.html`** - Events page (where schema is injected)

---

## How It Works

### Execution Flow

1. **Page loads** `events.html`
2. **Dependencies load** in order:
   - `i18n.js` (internationalization)
   - `eventsData.js` (event metadata)
   - `events.js` (event rendering)
   - `eventSchema.js` (structured data generation)
3. **eventSchema.js waits** for dependencies to be ready
4. **Filters** to only upcoming events (using `isPastEvent()`)
5. **For each upcoming event:**
   - Fetches metadata from `eventsData`
   - Fetches content from i18n translations
   - Parses location and price strings
   - Builds Schema.org Event object
6. **Wraps all events** in an ItemList
7. **Injects JSON-LD** into `<head>` section

### Example Output

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Event",
      "name": "Aerial Yoga Sound Healing",
      "description": "This unique session is a blend of healing aerial yoga movements and sound therapy...",
      "image": "https://www.sgpyoga.co/assets/photos/events/unique/aerial-yoga-sound-healing_10oct2025-720.webp",
      "startDate": "2025-10-10",
      "endDate": "2025-10-10",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": "Aguacate Studio",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Mexico City",
          "addressRegion": "CDMX",
          "addressCountry": "MX"
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": "SGP Yoga",
        "url": "https://www.sgpyoga.co"
      },
      "offers": {
        "@type": "Offer",
        "price": "400",
        "priceCurrency": "MXN",
        "url": "https://www.sgpyoga.co/events.html",
        "availability": "https://schema.org/InStock"
      }
    }
  ]
}
</script>
```

---

## Technical Architecture

### Key Functions

#### 1. `initializeEventSchema()`
Main initialization function that orchestrates the process.

#### 2. `waitForDependencies()`
Waits for i18next, eventsData, and helper functions to be available (max 10 seconds).

#### 3. `generateEventSchema()`
Creates the complete ItemList with all upcoming events.

#### 4. `generateSingleEventSchema(event)`
Converts a single event into Schema.org format.

#### 5. `parseLocation(locationString)`
Parses location strings into structured address components.

**Handles formats:**
- `"Aguacate Studio, Mexico City"` → venue + city
- `"Bogotá, Colombia"` → city + country
- `"La Yoguitería, Calarca, Quindío, Colombia"` → venue + city + region + country

#### 6. `parsePrice(priceString)`
Extracts numeric amount and currency from price strings.

**Handles formats:**
- `"$400 MXN"` → 400 MXN
- `"$23,000 MXN"` → 23000 MXN
- `"$1,800,000 COP ($8,000 MXN)"` → 1800000 COP (uses first price)

#### 7. `injectSchemaIntoHead(schema)`
Creates and appends the JSON-LD script element to page `<head>`.

---

## Data Structure

### Event Metadata (eventsData.js)

```javascript
{
    id: 'aerial-yoga-sound-healing_10oct2025',
    category: 'workshop',
    startDate: '2025-10-10',
    endDate: '2025-10-10',
    image: '/assets/photos/events/unique/aerial-yoga-sound-healing_10oct2025-720.webp',
    imageHigh: '/assets/photos/events/unique/aerial-yoga-sound-healing_10oct2025-1080.webp',
    cardImagePosition: 'center 20%',
    modalImagePosition: 'center 13%'
}
```

### Event Content (locales/en/events.json)

```json
{
  "events": {
    "aerial-yoga-sound-healing_10oct2025": {
      "title": "Aerial Yoga Sound Healing",
      "category": "Workshop",
      "date": "October 10, 2025",
      "time": "19:00 - 20:00 PM",
      "location": "Aguacate Studio, Mexico City",
      "shortDescription": "Immerse yourself in gentle, restorative aerial yoga...",
      "fullDescription": "This unique session is a blend of healing aerial yoga movements and sound therapy...",
      "instructor": "Harjeet & Camila",
      "price": "$400 MXN"
    }
  }
}
```

### Schema.org Output Fields

| Field | Source | Notes |
|-------|--------|-------|
| `name` | Translation: `title` | Event name |
| `description` | Translation: `fullDescription` | Full event description |
| `image` | eventsData: `image` | Absolute URL |
| `startDate` | eventsData: `startDate` | ISO 8601 format |
| `endDate` | eventsData: `endDate` | ISO 8601 format |
| `eventStatus` | Static | Always "EventScheduled" |
| `eventAttendanceMode` | Static | Always "OfflineEventAttendanceMode" |
| `location.name` | Parsed from translation: `location` | Venue or city |
| `location.address` | Parsed from translation: `location` | Structured address |
| `organizer` | Static | SGP Yoga |
| `offers.price` | Parsed from translation: `price` | Numeric value |
| `offers.priceCurrency` | Parsed from translation: `price` | Currency code |

---

## Adding New Events

### Step 1: Add to eventsData.js

```javascript
{
    id: 'breathwork-fundamentals_dec2025',
    category: 'workshop',
    startDate: '2025-12-15',
    endDate: '2025-12-15',
    image: '/assets/photos/events/breathwork-workshop.webp'
}
```

### Step 2: Add Translations

**`locales/en/events.json`:**
```json
{
  "events": {
    "breathwork-fundamentals_dec2025": {
      "title": "Breathwork Fundamentals",
      "fullDescription": "Learn the foundations of conscious breathing...",
      "location": "Hari Om, Mexico City",
      "price": "$350 MXN",
      "instructor": "Harjeet Singh"
    }
  }
}
```

**`locales/es/events.json`:**
```json
{
  "events": {
    "breathwork-fundamentals_dec2025": {
      "title": "Fundamentos de Respiración",
      "fullDescription": "Aprende los fundamentos de la respiración consciente...",
      "location": "Hari Om, Ciudad de México",
      "price": "$350 MXN",
      "instructor": "Harjeet Singh"
    }
  }
}
```

### Step 3: Verify

1. Open `events.html` in browser
2. Open browser DevTools → Console
3. Look for: `"Event structured data successfully generated and injected"`
4. Inspect page `<head>` for JSON-LD script
5. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

**That's it!** The structured data is automatically generated.

---

## Verification

### Browser Console

Open events.html and check console for:
```
Initializing event structured data generation...
Event schema dependencies ready
Generating schema for X upcoming events
Event schema injected into <head>
Event structured data successfully generated and injected
```

### View Page Source

Right-click → "View Page Source" and search for `application/ld+json`. You should see:
```html
<!-- Event Structured Data (Auto-generated) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  ...
}
</script>
```

### Google Rich Results Test

1. Go to [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
2. Enter your URL: `https://www.sgpyoga.co/events.html`
3. Click "TEST URL"
4. Check for **Event** rich results
5. Verify no errors or warnings

### Google Search Console

After deployment:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Navigate to **Enhancements → Events**
3. Check for detected events
4. Monitor for errors

---

## Troubleshooting

### No Schema Generated

**Symptoms:** No console message, no JSON-LD in page source

**Causes & Solutions:**
1. **Dependencies not loaded**
   - Check console for errors
   - Verify `i18n.js`, `eventsData.js` load successfully
   
2. **No upcoming events**
   - Verify events in `eventsData.js` have future dates
   - Check `isPastEvent()` function works correctly

3. **Script not loaded**
   - Verify `<script src="js/eventSchema.js"></script>` in events.html
   - Check file path is correct

### Events Missing from Schema

**Symptoms:** Some events don't appear in generated schema

**Causes & Solutions:**
1. **Translation keys missing**
   - Check console for warnings: `"Translations not found for event: [id]"`
   - Verify event ID matches in eventsData.js and translation files
   
2. **Event is past**
   - Only upcoming events are included
   - Check `startDate` and `endDate` in eventsData.js

3. **Translation loading failure**
   - Ensure i18next loaded correct language
   - Check for JSON syntax errors in translation files

### Schema Validation Errors

**Symptoms:** Google Rich Results Test shows errors

**Common Issues:**

1. **Missing required fields**
   - Ensure `fullDescription` exists in translations
   - Verify `startDate` format is correct (YYYY-MM-DD)

2. **Invalid location format**
   - Location should be recognizable city/venue name
   - Check `parseLocation()` output in console

3. **Price format issues**
   - Price should include currency (e.g., "$400 MXN")
   - Check `parsePrice()` output in console

### Debug Mode

Add this to browser console for detailed logging:
```javascript
// Re-run with verbose logging
initializeEventSchema();
```

Check console for:
- Dependency check status
- Number of upcoming events found
- Translation fetch attempts
- Parsed location/price data

---

## SEO Benefits

### Google Search Rich Results

Events will display in search with:
- **Event name** and date
- **Location** information
- **Organizer** (SGP Yoga)
- **"Add to Calendar"** button
- Direct registration link

### Improved Visibility

- **Google Events** - Events appear in Google's event discovery
- **Google Maps** - Events may show in Maps search
- **Knowledge Panel** - Can enhance your business knowledge panel
- **Voice Search** - Better discoverability via voice assistants

### Click-Through Rate

Rich event snippets typically see **20-30% higher CTR** compared to plain search results.

### Local SEO

Structured location data helps with:
- "yoga events near me" searches
- Location-specific queries
- Google's local pack results

---

## Maintenance

### Regular Tasks

**When adding events:**
- ✅ Add to `eventsData.js`
- ✅ Add translations to both EN and ES
- ✅ Verify schema generation in browser
- ✅ Test with Rich Results Test

**Monthly:**
- Review console logs for warnings
- Check Google Search Console for event errors
- Verify past events are excluded correctly

**After code changes:**
- Test schema generation still works
- Verify no JavaScript errors
- Validate with Schema.org validator

### Updating the System

If you modify `eventSchema.js`:

1. **Test locally** in multiple browsers
2. **Check console** for errors/warnings
3. **Validate schema** with Rich Results Test
4. **Document changes** in code comments
5. **Update this documentation** if behavior changes

### Schema.org Updates

Schema.org occasionally updates event specifications. To stay current:

1. Monitor [schema.org/Event](https://schema.org/Event) for changes
2. Check [Google Event guidelines](https://developers.google.com/search/docs/appearance/structured-data/event)
3. Update `eventSchema.js` if new required/recommended fields added

---

## Resources

- **Schema.org Event Documentation:** [https://schema.org/Event](https://schema.org/Event)
- **Google Event Rich Results Guide:** [https://developers.google.com/search/docs/appearance/structured-data/event](https://developers.google.com/search/docs/appearance/structured-data/event)
- **Rich Results Test:** [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- **Schema Markup Validator:** [https://validator.schema.org/](https://validator.schema.org/)
- **Google Search Console:** [https://search.google.com/search-console](https://search.google.com/search-console)

---

## Questions or Issues?

If the system isn't working as expected:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review browser console for error messages
3. Verify your event data matches the expected format
4. Test with a single simple event first
5. Document the issue with console logs and screenshots

---

**Last Review:** January 30, 2025  
**Next Review:** April 30, 2025
