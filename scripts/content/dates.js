/**
 * @module scripts/content/dates
 *
 * The prose date and category badge an event prints, derived from the columns that hold them.
 *
 * @remarks
 * **This is a line-for-line port of `platform/src/features/admin/school/eventLabels.ts`, and the two must agree.** The admin panel renders these same strings as a preview of what a publish will produce, so if this file and that one ever disagree the preview is lying. C2 in `MIGRATION.md` pins the recipe; change it there first, then in both files.
 *
 * **Month names come from `Intl`; everything around them is composed by hand.** Whole-date `Intl` formatting cannot produce `10 de octubre, 2025` (it yields `de 2025`), and `formatRange` uses an en dash where the site writes a hyphen. Composing reproduces the strings the site printed before this migration exactly.
 *
 * **Only one `Date` is ever constructed, at noon UTC, with the formatter pinned to UTC.** `new Date('2026-08-08')` is UTC midnight, which is already the 7th in Mexico City — so on a build server in any western timezone a naive formatter would print every event a day early. Days and years are read straight off the `YYYY-MM-DD` string, which cannot drift at all.
 */

/**
 * The locale tags month names are formatted with.
 *
 * @remarks
 * Region-qualified so the result cannot depend on the build machine's own preferences. `es-MX` is the school's own Spanish.
 */
const LOCALE_TAGS = { en: 'en-US', es: 'es-MX' };

/**
 * The badge each category shows when the row does not override it.
 *
 * @remarks
 * Singular, unlike the plural `events.filters.*` strings in `events.json`, which label the filter buttons rather than a card.
 */
const CATEGORY_LABELS = {
  en: { workshop: 'Workshop', retreat: 'Retreat', course: 'Course' },
  es: { workshop: 'Taller', retreat: 'Retiro', course: 'Curso' },
};

/**
 * @param {string} iso - A `YYYY-MM-DD` date.
 * @param {'en'|'es'} locale - Which language to name the month in.
 * @returns {string} The month's name, `October` or `octubre`; Spanish folded to lower case by convention.
 */
function monthName(iso, locale) {
  const formatted = new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T12:00:00Z`));

  return locale === 'es' ? formatted.toLocaleLowerCase(LOCALE_TAGS.es) : formatted;
}

/** @param {string} iso - A `YYYY-MM-DD` date. @returns {string} The day without a leading zero. */
const day = (iso) => String(Number(iso.slice(8, 10)));

/** @param {string} iso - A `YYYY-MM-DD` date. @returns {string} Its four-digit year. */
const year = (iso) => iso.slice(0, 4);

/** @param {string} iso - A `YYYY-MM-DD` date. @returns {string} Its `YYYY-MM` prefix. */
const month = (iso) => iso.slice(0, 7);

/**
 * The date an event prints, in one language.
 *
 * @remarks
 * Four shapes, tested in order: one day, a range within a month (unspaced hyphen), a range across months of one year, and a range across years (both spaced). A caller holding a non-null `date_label_en`/`_es` must use it instead of calling this.
 *
 * @example
 * derivedDateLabel('2025-11-14', '2025-11-17', 'en'); // 'November 14-17, 2025'
 * derivedDateLabel('2025-06-21', '2025-09-27', 'es'); // '21 de junio - 27 de septiembre, 2025'
 *
 * @param {string} startDate - First day, `YYYY-MM-DD`.
 * @param {string} endDate - Last day, which may equal the first.
 * @param {'en'|'es'} locale - Which language to derive.
 * @returns {string} The prose date.
 */
function derivedDateLabel(startDate, endDate, locale) {
  const startMonth = monthName(startDate, locale);
  const endMonth = monthName(endDate, locale);
  const en = locale === 'en';

  if (startDate === endDate) {
    return en
      ? `${startMonth} ${day(startDate)}, ${year(startDate)}`
      : `${day(startDate)} de ${startMonth}, ${year(startDate)}`;
  }

  if (month(startDate) === month(endDate)) {
    return en
      ? `${startMonth} ${day(startDate)}-${day(endDate)}, ${year(startDate)}`
      : `${day(startDate)}-${day(endDate)} de ${startMonth}, ${year(startDate)}`;
  }

  if (year(startDate) === year(endDate)) {
    return en
      ? `${startMonth} ${day(startDate)} - ${endMonth} ${day(endDate)}, ${year(startDate)}`
      : `${day(startDate)} de ${startMonth} - ${day(endDate)} de ${endMonth}, ${year(startDate)}`;
  }

  return en
    ? `${startMonth} ${day(startDate)}, ${year(startDate)} - ${endMonth} ${day(endDate)}, ${year(endDate)}`
    : `${day(startDate)} de ${startMonth}, ${year(startDate)} - ${day(endDate)} de ${endMonth}, ${year(endDate)}`;
}

/**
 * The badge an event's card prints, in one language, when the row does not override it.
 *
 * @param {'workshop'|'retreat'|'course'} category - The event's category.
 * @param {'en'|'es'} locale - Which language to derive.
 * @returns {string} The badge text, such as `Retreat` or `Retiro`.
 * @throws {Error} For a category the website cannot render; the database forbids it, so this means the schema changed under the build.
 */
function derivedCategoryLabel(category, locale) {
  const label = CATEGORY_LABELS[locale][category];
  if (!label) {
    throw new Error(`Unknown event category "${category}". The website only renders workshop, retreat and course.`);
  }
  return label;
}

module.exports = { derivedDateLabel, derivedCategoryLabel };
