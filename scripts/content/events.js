/**
 * @module scripts/content/events
 *
 * Turns `school_events` into the two artefacts the events page already reads: the `eventsData` array and the `eventContent` locale namespace.
 *
 * @remarks
 * **Both shapes are frozen by C2**, because `js/events.js` and `js/eventSchema.js` read them and may not be modified. `eventsData` keeps `id · category · startDate · endDate · imageMobile · image · imageHigh · cardImagePosition · modalImagePosition`; each `eventContent` entry keeps `title · category · date · time · location · shortDescription · fullDescription · instructor · price`.
 *
 * **Where the content ends up at runtime.** Those two frozen scripts look text up as `events:events.<id>.title`, from the authored `events` namespace. `eventContent.json` is kept a separate file, so a build never rewrites hand-written copy (C1), and `js/i18n.js` grafts it into the `events` namespace in memory when the events page loads. See {@link buildEvents}.
 *
 * **Dates are derived, except where a row overrides them.** `date` comes from `start_date`/`end_date` via {@link module:scripts/content/dates}, unless `date_label_en`/`_es` is set. `category` works the same way with `category_label_en`/`_es`. Two events override their date and four their category; see Data model in `MIGRATION.md` for why.
 */

const { derivedDateLabel, derivedCategoryLabel } = require('./dates');
const { assertPlainText } = require('./html');

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
 * A missing Spanish value falls back to English, with a warning, rather than to an empty string — a half-translated event is better than a Spanish card with no title. A field empty in both languages becomes `""`, never `null`: `js/events.js` calls `t()` for every field, and a key i18next cannot find is printed as the key itself.
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
 * One `eventsData` entry as source text, in the file's existing style.
 *
 * @remarks
 * Values go through `JSON.stringify`, which produces a valid, correctly escaped JavaScript string literal whatever an admin typed. Image keys are omitted entirely when the event has no image, which is what `getEventImage()` and `getEventImageSrcset()` already treat as "use the category's stock photograph".
 *
 * @param {object} row - The `school_events` row.
 * @param {string} publicPrefix - URL prefix the downloaded images are served from.
 * @returns {string} The object literal, indented for the array.
 */
function dataEntry(row, publicPrefix) {
  const fields = [
    ['id', row.slug],
    ['category', row.category],
    ['startDate', row.start_date],
    ['endDate', row.end_date],
    ...(row.image_path
      ? Object.entries(EVENT_WIDTHS).map(([key, width]) => [key, `${publicPrefix}/${row.image_path}-${width}.webp`])
      : []),
    ['cardImagePosition', objectPosition(row.card_focal_point, `school_events.card_focal_point (${row.slug})`)],
    ['modalImagePosition', objectPosition(row.modal_focal_point, `school_events.modal_focal_point (${row.slug})`)],
  ];
  return ['  {', ...fields.map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`), '  },'].join('\n');
}

/**
 * Builds both event artefacts from the published rows.
 *
 * @param {object[]} rows - `school_events`, published rows only (RLS filters the rest).
 * @param {{publicPrefix: string, warn: (message: string) => void}} options - Image URL prefix and a warning sink.
 * @returns {EventsOutput} The array literal, the namespaces and the images to download.
 * @throws {Error} When there are no published events, or any row holds markup or an impossible value.
 */
function buildEvents(rows, { publicPrefix, warn }) {
  if (rows.length === 0) {
    throw new Error(
      'school_events returned no published events. Refusing to publish an empty events page — ' +
        'check SUPABASE_URL points at the right project and that its migrations have been pushed.'
    );
  }

  // Stable order: the page sorts by date itself, but a deterministic file makes diffs readable.
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

  return {
    dataArray: ['[', ...events.map((row) => dataEntry(row, publicPrefix)), ']'].join('\n'),
    namespace: { en: namespace('en'), es: namespace('es') },
    imageStems: events.filter((row) => row.image_path).map((row) => row.image_path),
  };
}

module.exports = { buildEvents, EVENT_WIDTHS };
