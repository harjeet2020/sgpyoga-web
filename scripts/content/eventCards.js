/**
 * @module scripts/content/eventCards
 *
 * Renders the events page's cards into static HTML, so the page paints complete instead of filling in once its scripts and translations have loaded.
 *
 * @remarks
 * **Why at build time.** The cards used to be built in the browser by `js/events.js`, which had to wait for three deferred CDN scripts (`DOMContentLoaded` waits for them) and then six locale files before it could print a title. On a real connection that was a few hundred milliseconds of empty grid, after which the cards arrived and pushed the rest of the page down. Everything a card shows is known when the site is built, so nothing is gained by waiting until it is in a visitor's browser. The same markup also means search engines and link previews see the events without running any script.
 *
 * **Every event is rendered, and the build only decides which are visible.** Which events are past depends on the day somebody visits, and the site is only rebuilt when staff publish. So the page carries all of them, in date order, with their dates on `data-start`/`data-end`, and `js/events.js` re-checks against the visitor's date on load, filters by category and switches to past events by hiding and reordering these cards. The build hides what was already past, or beyond the first {@link MAX_VISIBLE}, on the day it ran, so the served HTML is right for almost every visit and correct without JavaScript. The script only has anything to change when an event ended between the last publish and the visit.
 *
 * **Translation works exactly as it does for the rest of the page.** Each text element carries `data-i18n="eventContent:<id>.<field>"`. `build-i18n.js` reads that key straight out of `locales/es/eventContent.json` to bake `/es/events.html`, and `js/i18n.js` resolves it at runtime, because the events page loads `eventContent` as a namespace of its own. That is why these keys name `eventContent:` rather than the `events:events.<id>` spot the runtime graft fills: the build never sees the graft. Because `build-i18n.js` matches with a regular expression, not a parser, every `data-i18n` sits on a leaf element whose tag is never nested inside itself.
 *
 * **What the modal needs travels with the card.** The full description, time, instructor and price sit in a `hidden` block inside each card, and the high-resolution image and its focal point are data attributes. The modal copies them out when a card is clicked, so it too works without waiting for any translation to load.
 */

const { escapeHtml } = require('./html');

/**
 * How many cards one view shows, which `js/events.js` applies too.
 *
 * @remarks
 * Twelve soonest upcoming, or twelve most recent past, after the category filter. Kept in step with `MAX_EVENTS_TO_DISPLAY` in `js/events.js` by hand; if they disagree, the first paint shows a different number of cards from what the script settles on.
 */
const MAX_VISIBLE = 12;

/**
 * How many of the first visible cards load their image eagerly.
 *
 * @remarks
 * The grid is the first section on the page, so the first few cards are on screen at load, and a lazy image there is fetched later than it needs to be. Four 360px cards cover a wide desktop; the rest stay lazy.
 */
const EAGER_IMAGES = 4;

/**
 * The school's timezone, which decides what "today" is at build time.
 *
 * @remarks
 * Netlify builds in UTC, where the evening of an event's last day is already tomorrow. Mexico City is where the school runs its events and where most visitors are.
 */
const SCHOOL_TIMEZONE = 'America/Mexico_City';

/**
 * The stock photographs an event without an image of its own falls back to, per category.
 *
 * @remarks
 * These are tracked files, not downloads, and they come in 480/720/900/1200 where per-event images come in 480/720/1080 (C4). This is the one copy of these paths: the build also writes it into `js/eventsData.js` as `categoryDefaults`, which `js/eventSchema.js` still reads through `getEventImage()`.
 */
const CATEGORY_IMAGES = {
  workshop: {
    imageMobile: '/assets/photos/events/workshops-480.webp',
    image: '/assets/photos/events/workshops-720.webp',
    imageHigh: '/assets/photos/events/workshops-900.webp',
    imageMax: '/assets/photos/events/workshops-1200.webp',
  },
  retreat: {
    imageMobile: '/assets/photos/events/retreats-480.webp',
    image: '/assets/photos/events/retreats-720.webp',
    imageHigh: '/assets/photos/events/retreats-900.webp',
    imageMax: '/assets/photos/events/retreats-1200.webp',
  },
  course: {
    imageMobile: '/assets/photos/events/teacher-trainings-480.webp',
    image: '/assets/photos/events/teacher-trainings-720.webp',
    imageHigh: '/assets/photos/events/teacher-trainings-900.webp',
    imageMax: '/assets/photos/events/teacher-trainings-1200.webp',
  },
};

/**
 * The card's `sizes` attribute.
 *
 * @remarks
 * Mirrors the fixed `.event-card` widths in `css/events.css` (360px, 320px at ≤768px, 300px at ≤480px). Keep them in step if a card width ever changes, or the browser picks the wrong file from the `srcset`.
 */
const CARD_SIZES = '(max-width: 480px) 300px, (max-width: 768px) 320px, 360px';

/**
 * Inline copies of the two Lucide icons a card shows.
 *
 * @remarks
 * Inline rather than `<i data-lucide>`, because Lucide is a deferred CDN script and swapping those placeholders for icons after load was one more thing appearing late on this page. The attributes match what `lucide.createIcons()` produces, and `.meta-icon` sizes them.
 */
const ICONS = {
  calendar:
    '<svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
  mapPin:
    '<svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
};

/**
 * One event as the card renderer needs it: identity, dates and resolved images.
 *
 * @typedef {object} EventCardEntry
 * @property {string} id - The event slug, which keys its `eventContent` entry.
 * @property {'workshop'|'retreat'|'course'} category - The category enum, used as a filter value and a CSS class.
 * @property {string} startDate - `YYYY-MM-DD`.
 * @property {string} endDate - `YYYY-MM-DD`, never before `startDate`.
 * @property {Record<string, string>} images - The event's own variants (`imageMobile`, `image`, `imageHigh`), or empty to use its category's.
 * @property {string} cardImagePosition - CSS `object-position` for the card image.
 * @property {string} modalImagePosition - CSS `object-position` for the modal image.
 */

/**
 * Today's date at the school, as `YYYY-MM-DD`.
 *
 * @param {Date} [now] - The moment to read, for tests.
 * @returns {string} The calendar date in {@link SCHOOL_TIMEZONE}.
 */
function schoolToday(now = new Date()) {
  // `en-CA` formats dates as YYYY-MM-DD, which compares correctly as a plain string.
  return new Intl.DateTimeFormat('en-CA', { timeZone: SCHOOL_TIMEZONE }).format(now);
}

/**
 * The image variants a card uses: the event's own, or its category's stock photograph.
 *
 * @remarks
 * Never a mix of the two. They are different photographs, and a `srcset` that combined them would show a different picture depending on the screen.
 *
 * @param {EventCardEntry} entry - The event.
 * @returns {Record<string, string>} Variant key to path.
 */
function imagesFor(entry) {
  return Object.keys(entry.images).length > 0 ? entry.images : CATEGORY_IMAGES[entry.category];
}

/**
 * A width-descriptor `srcset` from a set of variants.
 *
 * @param {Record<string, string>} images - Variant key to path; each path ends `-<width>.webp`.
 * @returns {string} Such as `/a-480.webp 480w, /a-720.webp 720w`, smallest first.
 * @throws {Error} When a path does not end in `-<width>.webp`; both sources of paths guarantee it, so this means one of them changed.
 */
function srcsetFor(images) {
  const candidates = Object.values(images).map((imagePath) => {
    const match = imagePath.match(/-(\d+)\.webp$/);
    if (!match) {
      throw new Error(`Event image ${imagePath} does not end in -<width>.webp, so it cannot go in a srcset.`);
    }
    return { imagePath, width: Number(match[1]) };
  });

  return candidates
    .sort((a, b) => a.width - b.width)
    .map(({ imagePath, width }) => `${imagePath} ${width}w`)
    .join(', ');
}

/**
 * Which events the page shows before any script runs.
 *
 * @remarks
 * The same rule `js/events.js` applies in its default view: upcoming (ending today or later), soonest first, at most {@link MAX_VISIBLE}.
 *
 * @param {EventCardEntry[]} entries - Every event, sorted by start date.
 * @param {string} today - `YYYY-MM-DD`.
 * @returns {Set<string>} The ids to show.
 */
function initiallyVisible(entries, today) {
  return new Set(
    entries
      .filter((entry) => entry.endDate >= today)
      .slice(0, MAX_VISIBLE)
      .map((entry) => entry.id)
  );
}

/**
 * Renders one text element of a card.
 *
 * @remarks
 * The `data-i18n` is omitted when the Spanish namespace has nothing for the field. `build-i18n.js` treats an empty translation as missing and prints a warning for each, and an empty field has nothing to translate anyway.
 *
 * @param {object} options - What to render.
 * @param {string} options.tag - The element, such as `h3`.
 * @param {string} options.className - Its class, or empty.
 * @param {string} options.id - The event id.
 * @param {string} options.field - The `eventContent` field, which is also its `data-field`.
 * @param {{en: object, es: object}} options.namespace - Both `eventContent` namespaces.
 * @returns {string} The element.
 */
function textElement({ tag, className, id, field, namespace }) {
  const classAttr = className ? ` class="${className}"` : '';
  const i18nAttr = namespace.es[id][field] ? ` data-i18n="eventContent:${id}.${field}"` : '';
  return `<${tag}${classAttr} data-field="${field}"${i18nAttr}>${escapeHtml(namespace.en[id][field])}</${tag}>`;
}

/**
 * Renders one card.
 *
 * @param {EventCardEntry} entry - The event.
 * @param {{en: object, es: object}} namespace - Both `eventContent` namespaces.
 * @param {{isVisible: boolean, isEager: boolean}} display - Whether it shows before script runs, and whether its image loads eagerly.
 * @returns {string} The card's markup, indented for the grid.
 */
function renderCard(entry, namespace, { isVisible, isEager }) {
  const { id, category } = entry;
  const images = imagesFor(entry);
  const text = (tag, className, field) => textElement({ tag, className, id, field, namespace });

  return [
    `<div class="event-card" data-event="${escapeHtml(id)}" data-category="${category}" data-start="${entry.startDate}" data-end="${entry.endDate}" data-modal-image="${escapeHtml(images.imageHigh)}" data-modal-position="${entry.modalImagePosition}"${isVisible ? '' : ' hidden'}>`,
    '    <div class="event-card-image">',
    // Empty alt: the title is printed right below, and a screen reader would otherwise read it twice.
    `        <img src="${escapeHtml(images.image)}" srcset="${escapeHtml(srcsetFor(images))}" sizes="${CARD_SIZES}" alt=""${isEager ? '' : ' loading="lazy"'} width="720" height="720" style="object-position: ${entry.cardImagePosition};">`,
    `        ${text('span', `event-badge ${category}`, 'category')}`,
    '    </div>',
    '    <div class="event-card-content">',
    `        ${text('h3', 'event-card-title', 'title')}`,
    '        <div class="event-card-meta">',
    '            <div class="event-meta-item">',
    `                ${ICONS.calendar}`,
    `                ${text('span', '', 'date')}`,
    '            </div>',
    '            <div class="event-meta-item">',
    `                ${ICONS.mapPin}`,
    `                ${text('span', '', 'location')}`,
    '            </div>',
    '        </div>',
    `        ${text('p', 'event-card-description', 'shortDescription')}`,
    '        <div class="event-card-details" hidden>',
    `            ${text('p', '', 'fullDescription')}`,
    `            ${text('p', '', 'time')}`,
    `            ${text('p', '', 'instructor')}`,
    `            ${text('p', '', 'price')}`,
    '        </div>',
    '    </div>',
    '</div>',
  ].join('\n');
}

/**
 * Renders every event's card for the `<!-- BUILD:events-cards -->` marker.
 *
 * @param {EventCardEntry[]} entries - Every published event, sorted by start date then slug.
 * @param {{en: object, es: object}} namespace - Both `eventContent` namespaces, keyed by event id.
 * @param {string} today - `YYYY-MM-DD`, normally {@link schoolToday}.
 * @returns {string} The cards, joined and indented to sit inside `.events-grid`.
 */
function renderEventCards(entries, namespace, today) {
  const visible = initiallyVisible(entries, today);
  let eagerLeft = EAGER_IMAGES;

  return entries
    .map((entry) => {
      const isVisible = visible.has(entry.id);
      const isEager = isVisible && eagerLeft > 0;
      if (isEager) eagerLeft -= 1;
      return renderCard(entry, namespace, { isVisible, isEager });
    })
    .join('\n')
    .split('\n')
    .map((line, index) => (index === 0 ? line : `                ${line}`))
    .join('\n');
}

module.exports = { renderEventCards, schoolToday, CATEGORY_IMAGES, MAX_VISIBLE };
