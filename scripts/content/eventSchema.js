/**
 * @module scripts/content/eventSchema
 *
 * Renders the events page's structured data (schema.org `Event` JSON-LD) at build time, in English and Spanish.
 *
 * @remarks
 * **Why at build time.** This used to be `js/eventSchema.js`, which ran in the visitor's browser. It polled for up to ten seconds until i18next and `eventsData.js` had loaded, then injected a `<script type="application/ld+json">` into the head. Google can read injected structured data, but only when it renders the page with JavaScript, which is a slower, second indexing pass that it doesn't always do promptly. Every fact the schema holds is known when the site is built, so it now ships in the HTML, where every crawler sees it on the first request.
 *
 * **What it includes.** Only events still upcoming on the build day, soonest first, each as a top-level `Event` object in a JSON array. Google accepts that form directly, and it doesn't need the `ItemList` wrapper the browser version used. The site is rebuilt whenever staff publish, so the list is as fresh as the cards. An event that ends between rebuilds stays listed until the next one, which Google tolerates. Its dates still say it's over.
 *
 * **Parsing is ported unchanged.** {@link parseLocation} and {@link parsePrice} read the free-text `location` and `price` fields exactly as the browser version did, so the output matches what was published before, except that URLs now use the canonical `https://sgpyoga.co` host instead of the redirecting `www.` one.
 */

const { CATEGORY_IMAGES } = require('./eventCards');

/** The canonical site origin. Structured data must not point at a host that redirects. */
const SITE_ORIGIN = 'https://sgpyoga.co';

/**
 * The events page URL for each language, used as each event's `url` and its offer's `url`.
 */
const EVENTS_PAGE_URL = {
  en: `${SITE_ORIGIN}/events.html`,
  es: `${SITE_ORIGIN}/es/events.html`,
};

/**
 * A location split into the parts schema.org's `Place`/`PostalAddress` want.
 *
 * @typedef {object} ParsedLocation
 * @property {string|null} venue - The venue name, when the text names one.
 * @property {string} city - The city.
 * @property {string|null} region - The region, `CDMX` for Mexico City, or null when unknown.
 * @property {string} country - ISO 3166-1 alpha-2 country code.
 */

/**
 * Splits a free-text location such as `Hari Om, Mexico City` into structured parts.
 *
 * @remarks
 * Recognises Colombia by name and treats everything else as Mexico, defaulting to Mexico City. That fits every event the school has run. A location abroad in another country would need a branch here.
 *
 * @param {string} locationString - The event's `location` text in either language.
 * @returns {ParsedLocation} The parts, with Mexico City defaults when the text is empty.
 */
function parseLocation(locationString) {
  const fallback = { venue: null, city: 'Mexico City', region: 'CDMX', country: 'MX' };
  if (!locationString) return fallback;

  const parts = locationString.split(',').map((part) => part.trim());

  if (locationString.toLowerCase().includes('colombia')) {
    return {
      venue: parts.length >= 3 ? parts[0] : null,
      city: parts.length >= 2 ? parts[parts.length - 2] : fallback.city,
      region: null,
      country: 'CO',
    };
  }

  if (parts.length >= 2) {
    const [venue, city] = parts;
    const isMexicoCity = /mexico city|cdmx/i.test(city);
    return { venue, city: isMexicoCity ? 'Mexico City' : city, region: 'CDMX', country: 'MX' };
  }

  return { ...fallback, city: parts[0] };
}

/**
 * Reads an amount and ISO currency from a free-text price such as `$23,000 MXN`.
 *
 * @remarks
 * When the text lists several prices (`$2,500 MXN ($2,000 early bird)`), only the part before the first parenthesis is read. No currency code means no offer is published, because a price without a currency is invalid structured data.
 *
 * @param {string} priceString - The event's `price` text.
 * @returns {{amount: number|null, currency: string|null}} The parsed price, with nulls when either part is missing.
 */
function parsePrice(priceString) {
  if (!priceString) return { amount: null, currency: null };

  const firstPrice = priceString.split('(')[0].trim();
  const currency = firstPrice.match(/([A-Z]{3})/)?.[1] ?? null;
  const amountText = firstPrice.match(/[\d,]+/)?.[0];
  const amount = amountText ? parseFloat(amountText.replace(/,/g, '')) : null;

  return { amount: Number.isFinite(amount) ? amount : null, currency };
}

/**
 * The absolute URL of the image an event's card shows at its standard size.
 *
 * @param {import('./eventCards').EventCardEntry} entry - The event.
 * @returns {string} An absolute image URL, the event's own or its category's default.
 */
function eventImageUrl(entry) {
  const path = entry.images.image || (CATEGORY_IMAGES[entry.category] || CATEGORY_IMAGES.workshop).image;
  return `${SITE_ORIGIN}${path}`;
}

/**
 * Builds one schema.org `Event`.
 *
 * @param {import('./eventCards').EventCardEntry} entry - The event's identity, dates and images.
 * @param {Record<string, string>} content - Its `eventContent` entry in one language (`title`, `fullDescription`, `location`, `price`, …).
 * @param {'en'|'es'} lang - The language, which picks the page URL.
 * @returns {object} The `Event` object, ready to serialise.
 */
function eventObject(entry, content, lang) {
  const location = parseLocation(content.location);
  const price = parsePrice(content.price);

  const event = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: content.title,
    description: content.fullDescription,
    url: EVENTS_PAGE_URL[lang],
    image: eventImageUrl(entry),
    startDate: entry.startDate,
    endDate: entry.endDate || entry.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: location.venue || location.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: location.city,
        ...(location.region ? { addressRegion: location.region } : {}),
        addressCountry: location.country,
      },
    },
    // "@id" matches the LocalBusiness on the homepage, so Google links every
    // event to the same business entity instead of treating each as new.
    organizer: {
      '@type': 'Organization',
      '@id': `${SITE_ORIGIN}/#business`,
      name: 'SGP Yoga',
      url: SITE_ORIGIN,
    },
  };

  if (price.amount !== null && price.currency) {
    event.offers = {
      '@type': 'Offer',
      price: price.amount,
      priceCurrency: price.currency,
      url: EVENTS_PAGE_URL[lang],
      availability: 'https://schema.org/InStock',
    };
  }

  return event;
}

/**
 * Renders the upcoming events as JSON-LD, one string per language.
 *
 * @param {import('./eventCards').EventCardEntry[]} entries - Every event, in date order.
 * @param {{en: object, es: object}} namespaces - The generated `eventContent` namespaces, keyed by event id.
 * @param {string} today - The build day at the school, `YYYY-MM-DD`. An event is upcoming until its end date has passed.
 * @returns {{en: string, es: string}|null} Pretty-printed JSON arrays, or null when no event is upcoming (the page then carries no event schema).
 *
 * @example
 * const schema = renderEventSchema(entries, namespaces, '2026-09-23');
 * // schema.en → '[\n  {\n    "@context": "https://schema.org",\n    "@type": "Event", …'
 */
function renderEventSchema(entries, namespaces, today) {
  const upcoming = entries.filter((entry) => (entry.endDate || entry.startDate) >= today);
  if (upcoming.length === 0) return null;

  // `<` is escaped as < (still valid JSON) so no string can ever close the <script> early.
  // The content build already refuses markup in content; this is belt and braces.
  const render = (lang) =>
    JSON.stringify(
      upcoming.map((entry) => eventObject(entry, namespaces[lang][entry.id], lang)),
      null,
      2
    ).replace(/</g, '\\u003c');

  return { en: render('en'), es: render('es') };
}

/**
 * Wraps rendered JSON-LD in the `<script>` that `build-i18n.js` recognises and swaps per language.
 *
 * @param {string} name - The block's name, matching its `.build/jsonld/<name>.<lang>.json` file.
 * @param {string} json - The English JSON-LD, as returned by {@link renderEventSchema}.
 * @returns {string} The script element, indented for the page head.
 */
function jsonLdScript(name, json) {
  const body = json.split('\n').map((line) => `    ${line}`).join('\n');
  return `<script type="application/ld+json" data-jsonld="${name}">\n${body}\n    </script>`;
}

module.exports = { renderEventSchema, jsonLdScript, parseLocation, parsePrice };
