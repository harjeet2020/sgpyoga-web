/**
 * @module scripts/content/schedule
 *
 * Turns the schedule tables into everything the classes page needs: the week's markup, the filter options, the legend, the `schedule` locale namespace and the colour stylesheet.
 *
 * @remarks
 * **Markup carries keys; the namespace carries words.** Every name on a card is emitted as an element with `data-i18n="schedule:<group>.<slug>"` and English fallback text, exactly as the hand-written Phase 3 page did. `build-i18n.js` then bakes the Spanish page from `locales/es/schedule.json`, and the in-page language switcher swaps the same keys at runtime. Neither translation path knows or cares that the markup was generated.
 *
 * **A style's colour is its family's colour.** `school_class_styles` is two levels deep: a top-level style (Aerial Yoga) owns a colour, and a variant (Aerial Yoga Beginners) has a null colour and a `parent_id`. Every card resolves its *family* — itself if top-level, its parent otherwise — and points `--style-accent` at `--style-<family>`. Nothing here keys a colour off a variant's own slug; see C3 in `MIGRATION.md`.
 *
 * **The legend lists what is being taught, not what exists.** A top-level style appears when it is active, has a description, and at least one active slot uses it or one of its variants (C1). That is what stops the legend advertising a style the timetable dropped months ago.
 *
 * The markup mirrors the Phase 3 hand-written page element for element, so `css/classes.css` and `js/classes.js` needed no changes.
 */

const { escapeHtml, assertPlainText } = require('./html');

/**
 * ISO weekday number (1 = Monday) to the key its heading is translated by in the authored `classes` namespace.
 */
const DAY_KEYS = {
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
  7: 'sunday',
};

/** English fallback text for each day heading; the translated text comes from `classes:days.*`. */
const DAY_NAMES_EN = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

/** The widths a teacher photograph is stored at, per C4. */
const TEACHER_WIDTHS = [200, 300, 600];

/**
 * The schedule tables as fetched, before any joining.
 *
 * @typedef {object} ScheduleRows
 * @property {object[]} styles - `school_class_styles`, all rows.
 * @property {object[]} teachers - `school_teachers`, all rows.
 * @property {object[]} locations - `school_locations`, all rows.
 * @property {object[]} slots - `school_schedule_slots`, active rows only (RLS filters the rest).
 */

/**
 * Everything the schedule contributes to the build.
 *
 * @typedef {object} ScheduleOutput
 * @property {{teacherOptions: string, locationOptions: string, week: string, legend: string}} markup - HTML for each marker in `templates/classes.html`.
 * @property {{en: object, es: object}} namespace - The `schedule` locale namespace per language.
 * @property {string} coloursCss - The contents of `css/schedule-colours.css`.
 * @property {string[]} photoStems - Storage stems of every teacher photograph the markup references.
 */

/**
 * Indents every line of a multi-line block, then trims the first line's indent.
 *
 * @remarks
 * Each marker in the template already sits at the right indentation, so the first line inherits it and every later line needs it added. The result reads like hand-written markup in `view-source`, which is worth a few lines of fiddling on a page people will inspect.
 *
 * @param {string[]} lines - Lines without leading indentation.
 * @param {number} indent - How many spaces every line should have.
 * @returns {string} The block, ready to replace a marker.
 */
function indentBlock(lines, indent) {
  const pad = ' '.repeat(indent);
  return lines
    .map((line) => (line ? pad + line : line))
    .join('\n')
    .trimStart();
}

/**
 * Indexes rows by id.
 *
 * @param {object[]} rows - Rows with an `id`.
 * @returns {Map<string, object>} Id to row.
 */
const byId = (rows) => new Map(rows.map((row) => [row.id, row]));

/**
 * Orders rows by their `sort_order`, then by slug so ties are stable across builds.
 *
 * @param {object} a - A row.
 * @param {object} b - Another row.
 * @returns {number} A comparator result.
 */
const bySortOrder = (a, b) => a.sort_order - b.sort_order || a.slug.localeCompare(b.slug);

/**
 * Picks the Spanish value, falling back to English with a warning when it is empty.
 *
 * @param {object} row - A row with `<field>_en` and `<field>_es`.
 * @param {string} field - The field's base name, such as `name`.
 * @param {string} where - Where the row came from, for the warning.
 * @param {(message: string) => void} warn - Where warnings go.
 * @returns {string} The Spanish text, or the English text if there is none.
 */
function spanishOrEnglish(row, field, where, warn) {
  const spanish = row[`${field}_es`];
  if (spanish && spanish.trim()) return spanish;
  warn(`${where}.${field}_es is empty; the Spanish site will show the English text.`);
  return row[`${field}_en`];
}

/**
 * Validates that a colour is the exact hex shape the database enforces.
 *
 * @remarks
 * The value is written into a stylesheet, so this is an injection guard as much as a sanity check: anything but `#rrggbb` is refused rather than emitted.
 *
 * @param {string} colour - The stored colour.
 * @param {string} slug - The style it belongs to, for the error.
 * @returns {string} The colour, unchanged.
 * @throws {Error} When the colour is not `#rrggbb`.
 */
function assertHexColour(colour, slug) {
  if (!/^#[0-9a-fA-F]{6}$/.test(colour)) {
    throw new Error(`school_class_styles.colour for "${slug}" is "${colour}", which is not a #rrggbb colour.`);
  }
  return colour;
}

/**
 * The initials shown in place of a teacher photograph.
 *
 * @remarks
 * First letter of the first two words, so `Rox` is `R` and a future `Ana Sofía` is `AS`. A teacher with no photo is a supported state (see Data model in `MIGRATION.md`), and this is its fallback.
 *
 * @param {string} name - The teacher's English name.
 * @returns {string} One or two upper-case letters.
 */
function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase())
    .join('');
}

/**
 * The avatar line of a card: a responsive photo when there is one, initials when there is not.
 *
 * @param {object} teacher - The `school_teachers` row.
 * @param {string} publicPrefix - URL prefix the downloaded images are served from.
 * @returns {string[]} Lines of markup.
 */
function avatarLines(teacher, publicPrefix) {
  if (!teacher.photo_path) {
    return [`<span class="class-card__avatar class-card__avatar--initials" aria-hidden="true">${escapeHtml(initials(teacher.name_en))}</span>`];
  }

  const src = (width) => `${publicPrefix}/${teacher.photo_path}-${width}.webp`;
  const srcset = TEACHER_WIDTHS.map((width) => `${src(width)} ${width}w`);
  return [
    '<img class="class-card__avatar"',
    ` srcset="${srcset[0]},`,
    ...srcset.slice(1, -1).map((entry) => `        ${entry},`),
    `        ${srcset[srcset.length - 1]}"`,
    ' sizes="36px"',
    ` src="${src(TEACHER_WIDTHS[0])}"`,
    ' alt="" width="200" height="200" loading="lazy">',
  ];
}

/**
 * One class card.
 *
 * @param {object} slot - The `school_schedule_slots` row.
 * @param {{style: object, family: object, teacher: object, location: object}} refs - The rows it points at, with the style's family resolved.
 * @param {string} publicPrefix - URL prefix the downloaded images are served from.
 * @returns {string[]} Lines of markup, unindented.
 */
function cardLines(slot, { style, family, teacher, location }, publicPrefix) {
  const time = slot.start_time.slice(0, 5);
  return [
    `<li class="class-card" data-style="${style.slug}" data-family="${family.slug}" data-teacher="${teacher.slug}" data-location="${location.slug}" style="--style-accent: var(--style-${family.slug});">`,
    '    <p class="class-card__when">',
    `        <time class="class-card__time" datetime="${time}">${time}</time>`,
    '        <span class="class-card__dot" aria-hidden="true">·</span>',
    `        <span class="class-card__duration"><span class="class-card__duration-value">${slot.duration_minutes}</span>&nbsp;<span data-i18n="classes:duration.unit">min</span></span>`,
    '    </p>',
    `    <h4 class="class-card__name" data-i18n="schedule:styles.${style.slug}">${escapeHtml(style.name_en)}</h4>`,
    '    <p class="class-card__where">',
    '        <i data-lucide="map-pin" aria-hidden="true"></i>',
    `        <span data-i18n="schedule:locations.${location.slug}">${escapeHtml(location.name_en)}</span>`,
    '    </p>',
    '    <p class="class-card__teacher">',
    ...avatarLines(teacher, publicPrefix).map((line) => `        ${line}`),
    `        <span data-i18n="schedule:teachers.${teacher.slug}">${escapeHtml(teacher.name_en)}</span>`,
    '    </p>',
    '</li>',
  ];
}

/**
 * One day column, with its cards or its empty state.
 *
 * @param {number} dayNumber - ISO weekday, 1 = Monday.
 * @param {string[][]} cards - Each card's lines, already in time order.
 * @returns {string[]} Lines of markup, unindented.
 */
function dayLines(dayNumber, cards) {
  const isEmpty = cards.length === 0;
  const head = [
    `<li class="schedule-day${isEmpty ? ' is-empty' : ''}" data-day="${dayNumber}">`,
    '    <div class="schedule-day__head">',
    `        <h3 class="schedule-day__name" data-i18n="classes:days.${DAY_KEYS[dayNumber]}">${DAY_NAMES_EN[dayNumber]}</h3>`,
    '        <span class="schedule-day__today" data-i18n="classes:schedule.today">Today</span>',
    '    </div>',
  ];
  const list = isEmpty
    ? ['    <ol class="schedule-day__classes"></ol>']
    : [
        '    <ol class="schedule-day__classes">',
        ...cards.flatMap((card) => card.map((line) => `        ${line}`)),
        '    </ol>',
      ];
  return [
    ...head,
    ...list,
    '    <p class="schedule-day__empty" data-i18n="classes:schedule.noClasses">No classes</p>',
    '</li>',
  ];
}

/**
 * Builds every schedule artefact from the fetched rows.
 *
 * @param {ScheduleRows} rows - The four schedule tables.
 * @param {{publicPrefix: string, warn: (message: string) => void}} options - Image URL prefix and a warning sink.
 * @returns {ScheduleOutput} Markup, namespaces, stylesheet and the photos to download.
 * @throws {Error} When there are no active slots, a slot points at a row that was not returned, a colour cannot be resolved, or any string contains markup.
 */
function buildSchedule(rows, { publicPrefix, warn }) {
  const styles = byId(rows.styles);
  const teachers = byId(rows.teachers);
  const locations = byId(rows.locations);

  if (rows.slots.length === 0) {
    throw new Error(
      'school_schedule_slots returned no active classes. Refusing to publish an empty timetable — ' +
        'check SUPABASE_URL points at the right project and that its migrations have been pushed.'
    );
  }

  // Every string that will reach a page, checked once up front so the error names its row.
  for (const [table, list] of [['school_class_styles', rows.styles], ['school_teachers', rows.teachers], ['school_locations', rows.locations]]) {
    for (const row of list) {
      for (const field of ['name_en', 'name_es', 'description_en', 'description_es']) {
        assertPlainText(row[field], `${table}.${field} (${row.slug})`);
      }
    }
  }

  /** Resolves a style to the top-level style whose colour it wears. */
  const familyOf = (style) => {
    if (!style.parent_id) return style;
    const parent = styles.get(style.parent_id);
    if (!parent) throw new Error(`Style "${style.slug}" has a parent that was not returned by school_class_styles.`);
    return parent;
  };

  /** Looks up a referenced row, failing loudly rather than rendering half a card. */
  const lookup = (map, id, table, slot) => {
    const row = map.get(id);
    if (!row) throw new Error(`Schedule slot ${slot.id} references a ${table} row (${id}) that was not returned.`);
    return row;
  };

  // Join each slot to its lookups once; everything below reads from this.
  const joined = rows.slots.map((slot) => {
    const style = lookup(styles, slot.style_id, 'school_class_styles', slot);
    return {
      slot,
      style,
      family: familyOf(style),
      teacher: lookup(teachers, slot.teacher_id, 'school_teachers', slot),
      location: lookup(locations, slot.location_id, 'school_locations', slot),
    };
  });

  // The week, Monday first, each day in start-time order.
  const week = [];
  for (let dayNumber = 1; dayNumber <= 7; dayNumber++) {
    const cards = joined
      .filter(({ slot }) => slot.day_of_week === dayNumber)
      .sort((a, b) => a.slot.start_time.localeCompare(b.slot.start_time) || a.style.slug.localeCompare(b.style.slug))
      .map(({ slot, ...refs }) => cardLines(slot, refs, publicPrefix));
    week.push(...dayLines(dayNumber, cards));
  }

  // Distinct vocabulary actually on the timetable, in the admin's chosen order.
  const distinct = (key) => [...new Map(joined.map((entry) => [entry[key].id, entry[key]])).values()].sort(bySortOrder);
  const usedStyles = distinct('style');
  const usedTeachers = distinct('teacher');
  const usedLocations = distinct('location');
  const usedFamilies = distinct('family');

  const optionLines = (list, group) =>
    list.map((row) => `<option value="${row.slug}" data-i18n="schedule:${group}.${row.slug}">${escapeHtml(row.name_en)}</option>`);

  // The legend: top-level, active, described, and taught this week (C1).
  const legendStyles = usedFamilies.filter((style) => style.is_active && style.description_en && style.description_en.trim());
  const legendLines = legendStyles.flatMap((style) => [
    `<li class="legend__item" style="--style-accent: var(--style-${style.slug});">`,
    `    <h3 class="legend__name" data-i18n="schedule:legend.${style.slug}.name">${escapeHtml(style.name_en)}</h3>`,
    `    <p class="legend__text" data-i18n="schedule:legend.${style.slug}.description">${escapeHtml(style.description_en)}</p>`,
    '</li>',
  ]);

  // The namespace, one per language. Only what the page references, so it cannot grow stale keys.
  const namespace = (lang) => {
    const text = (row, field, table) =>
      lang === 'en' ? row[`${field}_en`] : spanishOrEnglish(row, field, `${table} (${row.slug})`, warn);
    const map = (list, table) => Object.fromEntries(list.map((row) => [row.slug, text(row, 'name', table)]));
    return {
      _comment:
        lang === 'en'
          ? 'GENERATED FROM SUPABASE — DO NOT EDIT. Written by scripts/content on every build; edit in the platform admin panel instead.'
          : 'GENERADO DESDE SUPABASE — NO EDITAR. Lo escribe scripts/content en cada build; edítalo en el panel de administración de la plataforma.',
      styles: map(usedStyles, 'school_class_styles'),
      teachers: map(usedTeachers, 'school_teachers'),
      locations: map(usedLocations, 'school_locations'),
      legend: Object.fromEntries(
        legendStyles.map((style) => [
          style.slug,
          {
            name: text(style, 'name', 'school_class_styles'),
            description: text(style, 'description', 'school_class_styles'),
          },
        ])
      ),
    };
  };

  // One custom property per top-level style with a colour. Variants never appear (C3).
  const topLevel = rows.styles.filter((style) => !style.parent_id).sort(bySortOrder);
  for (const family of usedFamilies) {
    if (!family.colour) {
      warn(`Style "${family.slug}" has no colour; its cards fall back to --style-default.`);
    }
  }
  const colourLines = topLevel
    .filter((style) => style.colour)
    .map((style) => `    --style-${style.slug}: ${assertHexColour(style.colour, style.slug).toLowerCase()};`);

  const coloursCss = [
    '/* ==========================================================================',
    '   SCHEDULE STYLE COLOURS — GENERATED FROM SUPABASE, DO NOT EDIT',
    '   --------------------------------------------------------------------------',
    '   Written by scripts/content on every build from school_class_styles.colour.',
    '   One custom property per top-level style, keyed by slug; a card sets',
    '   `--style-accent: var(--style-<family>)`, and variants resolve through',
    '   their parent. Change a colour in the platform admin panel, not here.',
    '   ========================================================================== */',
    '',
    ':root {',
    ...colourLines,
    '',
    '    /* The neutral a card falls back to if a style arrives with no colour. */',
    '    --style-default: #8a8580;',
    '}',
    '',
  ].join('\n');

  return {
    markup: {
      teacherOptions: indentBlock(optionLines(usedTeachers, 'teachers'), 24),
      locationOptions: indentBlock(optionLines(usedLocations, 'locations'), 24),
      week: indentBlock(week, 12),
      legend: indentBlock(legendLines, 16),
    },
    namespace: { en: namespace('en'), es: namespace('es') },
    coloursCss,
    photoStems: usedTeachers.filter((teacher) => teacher.photo_path).map((teacher) => teacher.photo_path),
  };
}

module.exports = { buildSchedule, TEACHER_WIDTHS };
