/**
 * @module scripts/content/events
 *
 * Turns `school_events` into everything the events page reads: the pre-rendered cards, the `eventsData` array and the `eventContent` locale namespace.
 *
 * @remarks
 * **The cards are static HTML**, rendered by {@link module:scripts/content/eventCards} into `/events.html`, so the page no longer builds them in the browser. See that module for why.
 *
 * **The two data shapes are still fixed by C2**, now because `js/eventSchema.js` reads them to write the page's structured data. `eventsData` keeps `id · category · startDate · endDate · imageMobile · image · imageHigh · cardImagePosition · modalImagePosition`; each `eventContent` entry keeps `title · category · date · time · location · shortDescription · fullDescription · instructor · price`.
 *
 * **Where the content ends up at runtime.** `js/eventSchema.js` looks text up as `events:events.<id>.title`, from the authored `events` namespace. `eventContent.json` is kept a separate file, so a build never rewrites hand-written copy (C1), and `js/i18n.js` grafts it into the `events` namespace in memory when the events page loads. The cards read the same file directly as `eventContent:<id>.*`. See {@link buildEvents}.
 *
 * **Dates are derived, except where a row overrides them.** `date` comes from `start_date`/`end_date` via {@link module:scripts/content/dates}, unless `date_label_en`/`_es` is set. `category` works the same way with `category_label_en`/`_es`. Two events override their date and four their category; see Data model in `MIGRATION.md` for why.
 */

const { derivedDateLabel, derivedCategoryLabel } = require('./dates');
const { assertPlainText } = require('./html');
const { renderEventCards, CATEGORY_IMAGES } = require('./eventCards');

/** The widths an event image is stored at, per C4, in the order `eventsData` names them. */
const EVENT_WIDTHS = { imageMobile: 480, image: 720, imageHigh: 1080 };

/**
 * The prose fields of an event: the `eventContent` key each fills, and the column pair it comes from.
 *
 * @remarks
 * `price` is one column rather than a pair, deliberately; see Data model in `MIGRATION.md`.
 */
const PROSE_FIELDS = [
  ['title', 'title'],
  ['time', 'time'],
  ['location', 'location'],
  ['shortDescription', 'short_description'],
  ['fullDescription', 'full_description'],
  ['instructor', 'instructor'],
];

/**
 * Everything the events contribute to the build.
 *
 * @typedef {object} EventsOutput
 * @property {string} dataArray - The JavaScript array literal for the `/* BUILD:events-data *\/` marker.
 * @property {string} categoryDefaults - The JavaScript object literal for the `/* BUILD:category-defaults *\/` marker.
 * @property {string} cards - The card markup for the `<!-- BUILD:events-cards -->` marker in `templates/events.html`.
 * @property {{en: object, es: object}} namespace - The `eventContent` locale namespace per language.
 * @property {string[]} imageStems - Storage stems of every event image referenced.
 */

/**
 * Converts a stored focal point into a CSS `object-position`.
 *
 * @param {{x: number, y: number}} point - Percentages from the top left, as stored.
 * @param {string} where - Where it came from, for the error.
 * @returns {string} Such as `50% 20%`.
 * @throws {Error} When either coordinate is not a number from 0 to 100; the database forbids it.
 */
function objectPosition(point, where) {
  const valid = (n) => typeof n === 'number' && n >= 0 && n <= 100;
  if (!point || !valid(point.x) || !valid(point.y)) {
    throw new Error(`${where} is ${JSON.stringify(point)}, expected {"x": 0-100, "y": 0-100}.`);
  }
  return `${point.x}% ${point.y}%`;
}

/**
 * Picks the text for one field in one language.
 *
 * @remarks
 * A missing Spanish value falls back to English, with a warning, rather than to an empty string — a half-translated event is better than a Spanish card with no title. A field empty in both languages becomes `""`, never `null`: the card renderer would print `null`, and at runtime a key i18next cannot find is printed as the key itself.
 *
 * @param {object} row - The `school_events` row.
 * @param {string} column - The column's base name, such as `short_description`.
 * @param {'en'|'es'} lang - Which language.
 * @param {(message: string) => void} warn - Where warnings go.
 * @returns {string} The text.
 */
function pick(row, column, lang, warn) {
  const english = row[`${column}_en`] ?? '';
  if (lang === 'en') return english;

  const spanish = row[`${column}_es`];
  if (spanish && spanish.trim()) return spanish;
  if (english) warn(`school_events.${column}_es (${row.slug}) is empty; the Spanish site will show the English text.`);
  return english;
}

/**
 * One row reduced to what both the card and `eventsData` need.
 *
 * @remarks
 * `images` is empty when the event has no image of its own. `eventsData` then omits the image keys entirely, which is what `getEventImage()` treats as "use the category's stock photograph", and the card renderer makes the same substitution.
 *
 * @param {object} row - The `school_events` row.
 * @param {string} publicPrefix - URL prefix the downloaded images are served from.
 * @returns {import('./eventCards').EventCardEntry} The entry.
 * @throws {Error} When a focal point is out of range.
 */
function toEntry(row, publicPrefix) {
  return {
    id: row.slug,
    category: row.category,
    startDate: row.start_date,
    endDate: row.end_date,
    images: row.image_path
      ? Object.fromEntries(
          Object.entries(EVENT_WIDTHS).map(([key, width]) => [key, `${publicPrefix}/${row.image_path}-${width}.webp`])
        )
      : {},
    cardImagePosition: objectPosition(row.card_focal_point, `school_events.card_focal_point (${row.slug})`),
    modalImagePosition: objectPosition(row.modal_focal_point, `school_events.modal_focal_point (${row.slug})`),
  };
}

/**
 * One `eventsData` entry as source text, in the file's existing style.
 *
 * @remarks
 * Values go through `JSON.stringify`, which produces a valid, correctly escaped JavaScript string literal whatever an admin typed.
 *
 * @param {import('./eventCards').EventCardEntry} entry - The event.
 * @returns {string} The object literal, indented for the array.
 */
function dataEntry(entry) {
  const fields = [
    ['id', entry.id],
    ['category', entry.category],
    ['startDate', entry.startDate],
    ['endDate', entry.endDate],
    ...Object.entries(entry.images),
    ['cardImagePosition', entry.cardImagePosition],
    ['modalImagePosition', entry.modalImagePosition],
  ];
  return ['  {', ...fields.map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`), '  },'].join('\n');
}

/**
 * Builds both event artefacts from the published rows.
 *
 * @param {object[]} rows - `school_events`, published rows only (RLS filters the rest).
 * @param {{publicPrefix: string, today: string, warn: (message: string) => void}} options - Image URL prefix, today's date at the school as `YYYY-MM-DD` (which decides the cards visible before any script runs), and a warning sink.
 * @returns {EventsOutput} The cards, the two script literals, the namespaces and the images to download.
 * @throws {Error} When there are no published events, or any row holds markup or an impossible value.
 */
function buildEvents(rows, { publicPrefix, today, warn }) {
  if (rows.length === 0) {
    throw new Error(
      'school_events returned no published events. Refusing to publish an empty events page — ' +
        'check SUPABASE_URL points at the right project and that its migrations have been pushed.'
    );
  }

  // Date order is load-bearing now: it is the order the cards are rendered in, which `js/events.js`
  // treats as "soonest first". The slug breaks ties so the output is deterministic.
  const events = [...rows].sort((a, b) => a.start_date.localeCompare(b.start_date) || a.slug.localeCompare(b.slug));

  for (const row of events) {
    for (const [key, value] of Object.entries(row)) {
      assertPlainText(value, `school_events.${key} (${row.slug})`);
    }
  }

  const namespace = (lang) => {
    const entries = events.map((row) => {
      const content = Object.fromEntries(PROSE_FIELDS.map(([key, column]) => [key, pick(row, column, lang, warn)]));
      return [
        row.slug,
        {
          title: content.title,
          category: row[`category_label_${lang}`] || derivedCategoryLabel(row.category, lang),
          date: row[`date_label_${lang}`] || derivedDateLabel(row.start_date, row.end_date, lang),
          time: content.time,
          location: content.location,
          shortDescription: content.shortDescription,
          fullDescription: content.fullDescription,
          instructor: content.instructor,
          price: row.price ?? '',
        },
      ];
    });

    return {
      _comment:
        lang === 'en'
          ? 'GENERATED FROM SUPABASE — DO NOT EDIT. Written by scripts/content on every build; edit events in the platform admin panel instead.'
          : 'GENERADO DESDE SUPABASE — NO EDITAR. Lo escribe scripts/content en cada build; edita los eventos en el panel de administración de la plataforma.',
      ...Object.fromEntries(entries),
    };
  };

  const entries = events.map((row) => toEntry(row, publicPrefix));
  const namespaces = { en: namespace('en'), es: namespace('es') };

  return {
    dataArray: ['[', ...entries.map(dataEntry), ']'].join('\n'),
    categoryDefaults: JSON.stringify(CATEGORY_IMAGES, null, 2),
    cards: renderEventCards(entries, namespaces, today),
    namespace: namespaces,
    imageStems: events.filter((row) => row.image_path).map((row) => row.image_path),
  };
}

module.exports = { buildEvents, EVENT_WIDTHS };
