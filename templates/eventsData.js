/**
 * SGP Yoga - Events Data (TEMPLATE)
 *
 * THIS IS A TEMPLATE. `npm run build:content` replaces the marker below with
 * the published events from Supabase and writes the result to the gitignored
 * `js/eventsData.js`. Edit this file only to change the helpers; add, edit or
 * remove events in the platform admin panel, then publish.
 *
 * Purpose: Centralized event metadata for dynamic rendering. This file holds
 * structural/technical data for events, while all text (titles, descriptions,
 * etc.) comes from the generated `eventContent` locale namespace, which
 * `js/i18n.js` grafts into `events:events.<id>.*` at load time.
 *
 * The array's shape is frozen by contract C2 in MIGRATION.md, because
 * `js/events.js` and `js/eventSchema.js` read it and must not change:
 * id · category · startDate · endDate · imageMobile · image · imageHigh ·
 * cardImagePosition · modalImagePosition. The image keys are omitted for an
 * event with no image of its own, which falls back to `categoryDefaults`.
 */

// =============================================================================
// EVENT DATA (GENERATED)
// =============================================================================

const eventsData = /* BUILD:events-data */;

// =============================================================================
// CATEGORY IMAGE DEFAULTS
// =============================================================================
/**
 * Purpose: Provide fallback images when an event doesn't specify a custom image
 * These are used if you don't provide an 'image' property for an event
 *
 * Each size key maps to a width variant (encoded in the filename suffix):
 * imageMobile (480w), image (720w), imageHigh (900w), imageMax (1200w).
 * All variants of a category feed getEventImageSrcset() so the browser can
 * pick a DPR-appropriate resolution.
 */
const categoryDefaults = {
  workshop: {
    imageMobile: "/assets/photos/events/workshops-480.webp",
    image: "/assets/photos/events/workshops-720.webp",
    imageHigh: "/assets/photos/events/workshops-900.webp",
    imageMax: "/assets/photos/events/workshops-1200.webp",
  },
  retreat: {
    imageMobile: "/assets/photos/events/retreats-480.webp",
    image: "/assets/photos/events/retreats-720.webp",
    imageHigh: "/assets/photos/events/retreats-900.webp",
    imageMax: "/assets/photos/events/retreats-1200.webp",
  },
  course: {
    imageMobile: "/assets/photos/events/teacher-trainings-480.webp",
    image: "/assets/photos/events/teacher-trainings-720.webp",
    imageHigh: "/assets/photos/events/teacher-trainings-900.webp",
    imageMax: "/assets/photos/events/teacher-trainings-1200.webp",
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Purpose: Get the image path for an event, with fallback to category default
 *
 * @param {object} event - Event object from eventsData
 * @param {boolean} highRes - Whether to get high-res version (for modal)
 * @param {boolean} mobile - Whether to get mobile version (for small screens)
 * @returns {string} Image path
 */
function getEventImage(event, highRes = false, mobile = false) {
  const imageKey = mobile
    ? "imageMobile"
    : highRes
      ? "imageHigh"
      : "image";

  // If event has custom image, use it
  if (event[imageKey]) {
    return event[imageKey];
  }

  // Otherwise fall back to category default
  const defaults = categoryDefaults[event.category];
  return defaults
    ? defaults[imageKey]
    : categoryDefaults.workshop[imageKey];
}

/**
 * Purpose: Build a width-descriptor srcset string for an event's images,
 * so the browser can pick a resolution matching both viewport and pixel
 * density (retina screens need ~2x the CSS width in image pixels).
 *
 * How it works:
 * 1. Gathers every image variant defined for the event, or (if the event
 *    defines no custom images) its category defaults. Variants are never
 *    mixed between the two sources — they would be different photos.
 * 2. Reads each variant's pixel width from the filename suffix
 *    (e.g. "workshops-720.webp" -> 720).
 * 3. Returns them as "path 480w, path 720w, ..." sorted small-to-large.
 *
 * This handles both variant families automatically: category defaults use
 * 480/720/900/1200 widths, unique per-event images use 480/720/1080.
 *
 * @param {object} event - Event object from eventsData (needs at least `category`)
 * @returns {string} srcset value, e.g. "/a-480.webp 480w, /a-720.webp 720w"
 */
function getEventImageSrcset(event) {
  const sizeKeys = ["imageMobile", "image", "imageHigh", "imageMax"];

  // Use the event's own variants if it defines any, else category defaults
  const hasCustomImages = sizeKeys.some(key => event[key]);
  const source = hasCustomImages
    ? event
    : categoryDefaults[event.category] || categoryDefaults.workshop;

  const candidates = sizeKeys
    .map(key => source[key])
    .filter(Boolean)
    .map(path => {
      // Width is encoded in the filename suffix, e.g. "-720.webp"
      const match = path.match(/-(\d+)\.webp$/);
      return match ? { path, width: Number(match[1]) } : null;
    })
    .filter(Boolean);

  // Dedupe by width (duplicate descriptors make the srcset invalid) and sort ascending
  const seenWidths = new Set();
  return candidates
    .filter(({ width }) => !seenWidths.has(width) && seenWidths.add(width))
    .sort((a, b) => a.width - b.width)
    .map(({ path, width }) => `${path} ${width}w`)
    .join(", ");
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
