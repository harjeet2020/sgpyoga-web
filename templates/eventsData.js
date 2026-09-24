/**
 * SGP Yoga - Events Data (TEMPLATE)
 *
 * THIS IS A TEMPLATE. `npm run build:content` replaces the marker below with
 * the published events from Supabase and writes the result to the gitignored
 * `js/eventsData.js`. Edit this file only to change the helpers; add, edit or
 * remove events in the platform admin panel, then publish.
 *
 * Purpose: Event metadata, still generated and loaded on the events page, but
 * no longer read by anything at runtime. The event cards are rendered into
 * `events.html` at build time (see `scripts/content/eventCards.js`), and the
 * structured data now is too (`scripts/content/eventSchema.js`), which retired
 * `js/eventSchema.js`, this file's last reader. It is kept, unchanged, until
 * contract C2 in MIGRATION.md is revisited; removing it is a follow-up.
 *
 * The array's shape is fixed by contract C2 in MIGRATION.md:
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
 *
 * Each size key maps to a width variant (encoded in the filename suffix):
 * imageMobile (480w), image (720w), imageHigh (900w), imageMax (1200w).
 *
 * Generated from `CATEGORY_IMAGES` in `scripts/content/eventCards.js`, which
 * the pre-rendered cards use too, so the paths are written down only once.
 */
const categoryDefaults = /* BUILD:category-defaults */;

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
 * Purpose: Determine if an event is in the past
 * An event is past once the visitor's calendar date is after its end date,
 * so it still counts as upcoming for the whole of its last day.
 *
 * Why compare strings: `new Date("2026-09-23")` is UTC midnight, which is
 * the evening of the 22nd anywhere west of UTC, including Mexico City. Parsing
 * the end date that way used to mark an event as past on its own final day.
 * `YYYY-MM-DD` strings compare correctly as plain text, so neither side is
 * ever turned into a moment in time. `js/events.js` uses the same rule.
 *
 * @param {object} event - Event object from eventsData
 * @returns {boolean} True if event has ended
 */
function isPastEvent(event) {
  if (!event.endDate) return false;

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  return event.endDate < today;
}
