#!/usr/bin/env node
/**
 * @module scripts/content
 *
 * `npm run build:content`: fetches the school's schedule and events from Supabase and writes every generated file the site serves.
 *
 * @remarks
 * **Where this sits.** It is the first step of `npm run build`, before `build-i18n.js`. The later steps don't know it exists: they find a `classes.html`, an `events.html`, a `js/eventsData.js` and some locale JSON exactly where they always have, and translate and copy them as before. See "The website build pipeline" in `MIGRATION.md`.
 *
 * **Order is fetch → build → download → write, and nothing is written until everything has succeeded.** A failure anywhere leaves the previous run's files alone and exits non-zero, which fails the Netlify build and keeps the last good deploy serving. That is deliberate: a red build is a nuisance, and a green build that published an empty timetable is an outage nobody notices.
 *
 * **Nothing tracked is modified.** Every file written here is gitignored. Hand-written parts live in `templates/`, and generated content is rendered into copies of them.
 *
 * @example
 * npm run build:content      # reads SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY from the environment or website/.env
 */

const fs = require('fs');
const path = require('path');

const { TEMPLATES, OUTPUTS, MEDIA, ROOT_DIR, loadSupabaseConfig } = require('./config');
const { fetchTable, downloadAll } = require('./supabase');
const { buildSchedule, TEACHER_WIDTHS } = require('./schedule');
const { buildEvents, EVENT_WIDTHS } = require('./events');
const { schoolToday } = require('./eventCards');
const { fillMarkers } = require('./html');
const { jsonLdScript } = require('./eventSchema');

/** Terminal colours, matching `build-i18n.js`. */
const colors = { reset: '\x1b[0m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m', red: '\x1b[31m' };

/**
 * @param {string} message - What to print.
 * @param {keyof colors} [color] - Which colour to print it in.
 * @returns {void}
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Writes a file, creating its directory, and logs it relative to the website root.
 *
 * @param {string} filePath - Absolute path.
 * @param {string} contents - What to write.
 * @returns {void}
 */
function writeOutput(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, 'utf8');
  log(`  ✓ ${path.relative(ROOT_DIR, filePath)}`, 'green');
}

/**
 * Serialises a locale namespace the way the hand-written ones are formatted.
 *
 * @param {object} namespace - The namespace object.
 * @returns {string} Two-space-indented JSON with a trailing newline.
 */
const toJson = (namespace) => `${JSON.stringify(namespace, null, 2)}\n`;

/**
 * Runs the whole content build.
 *
 * @returns {Promise<void>}
 * @throws {Error} On any fetch, validation, download or template failure; the message names what failed.
 */
async function buildContent() {
  log('\n=== SGP Yoga content build ===\n', 'blue');

  const config = loadSupabaseConfig();
  log(`Fetching from ${config.url}...`, 'blue');

  // Fetch everything first; the tables are independent, so in parallel.
  const [styles, teachers, locations, slots, events] = await Promise.all([
    fetchTable(config, 'school_class_styles', 'order=sort_order'),
    fetchTable(config, 'school_teachers', 'order=sort_order'),
    fetchTable(config, 'school_locations', 'order=sort_order'),
    fetchTable(config, 'school_schedule_slots', 'order=day_of_week,start_time'),
    fetchTable(config, 'school_events', 'order=start_date'),
  ]);
  log(
    `  ✓ ${slots.length} classes, ${styles.length} styles, ${teachers.length} teachers, ` +
      `${locations.length} locations, ${events.length} events`,
    'green'
  );

  // Build everything in memory. Warnings are collected so they print together, after the noise.
  const warnings = [];
  const options = { publicPrefix: MEDIA.publicPrefix, warn: (message) => warnings.push(message) };
  const schedule = buildSchedule({ styles, teachers, locations, slots }, options);
  const eventOutput = buildEvents(events, { ...options, today: schoolToday() });

  const classesTemplate = fs.readFileSync(TEMPLATES.classes.source, 'utf8');
  const classesHtml = fillMarkers(
    classesTemplate,
    {
      '<!-- BUILD:schedule-teacher-options -->': schedule.markup.teacherOptions,
      '<!-- BUILD:schedule-location-options -->': schedule.markup.locationOptions,
      '<!-- BUILD:schedule-week -->': schedule.markup.week,
      '<!-- BUILD:legend-items -->': schedule.markup.legend,
    },
    'templates/classes.html'
  );

  const eventsDataTemplate = fs.readFileSync(TEMPLATES.eventsData.source, 'utf8');
  const eventsDataJs = fillMarkers(
    eventsDataTemplate,
    {
      '/* BUILD:events-data */': eventOutput.dataArray,
      '/* BUILD:category-defaults */': eventOutput.categoryDefaults,
    },
    'templates/eventsData.js'
  );

  const eventsTemplate = fs.readFileSync(TEMPLATES.events.source, 'utf8');
  const eventsHtml = fillMarkers(
    eventsTemplate,
    {
      '<!-- BUILD:events-cards -->': eventOutput.cards,
      // English structured data inline; build-i18n.js swaps in the Spanish file for /es/events.html.
      '<!-- BUILD:events-schema -->': eventOutput.schema ? jsonLdScript('events', eventOutput.schema.en) : '',
    },
    'templates/events.html'
  );

  // Download every image into a fresh directory, so an image removed in the admin disappears too.
  const media = [
    ...schedule.photoStems.flatMap((stem) => TEACHER_WIDTHS.map((width) => `${stem}-${width}.webp`)),
    ...eventOutput.imageStems.flatMap((stem) => Object.values(EVENT_WIDTHS).map((width) => `${stem}-${width}.webp`)),
  ];
  log(`\nDownloading ${media.length} images...`, 'blue');
  const staging = `${MEDIA.dir}.partial`;
  fs.rmSync(staging, { recursive: true, force: true });
  await downloadAll(
    config,
    MEDIA.bucket,
    media.map((key) => ({ key, destination: path.join(staging, key) }))
  );
  fs.rmSync(MEDIA.dir, { recursive: true, force: true });
  fs.renameSync(staging, MEDIA.dir);
  log(`  ✓ ${path.relative(ROOT_DIR, MEDIA.dir)}/`, 'green');

  // Everything succeeded; only now touch the files the rest of the build reads.
  log('\nWriting generated files...', 'blue');
  writeOutput(TEMPLATES.classes.output, classesHtml);
  writeOutput(TEMPLATES.events.output, eventsHtml);
  writeOutput(TEMPLATES.eventsData.output, eventsDataJs);
  writeOutput(OUTPUTS.scheduleColours, schedule.coloursCss);
  for (const lang of ['en', 'es']) {
    writeOutput(OUTPUTS.scheduleNamespace(lang), toJson(schedule.namespace[lang]));
    writeOutput(OUTPUTS.eventContentNamespace(lang), toJson(eventOutput.namespace[lang]));
  }
  // With no upcoming events there is no schema, and a stale Spanish file must not outlive it.
  if (eventOutput.schema) {
    writeOutput(OUTPUTS.jsonLd('events', 'es'), `${eventOutput.schema.es}\n`);
  } else {
    fs.rmSync(OUTPUTS.jsonLd('events', 'es'), { force: true });
    log('  ⚠ No upcoming events: the events page ships without event structured data.', 'yellow');
  }

  // The same missing translation can be read for more than one output (a style's name feeds both the card and the legend).
  const uniqueWarnings = [...new Set(warnings)];
  if (uniqueWarnings.length > 0) {
    log(`\n${uniqueWarnings.length} warning(s):`, 'yellow');
    uniqueWarnings.forEach((message) => log(`  ⚠ ${message}`, 'yellow'));
  }

  log('\n=== Content build complete ===\n', 'green');
}

if (require.main === module) {
  buildContent().catch((error) => {
    log(`\n✗ Content build failed: ${error.message}\n`, 'red');
    log('  The site was not built. The previous deploy stays live until this is fixed.\n', 'red');
    process.exit(1);
  });
}

module.exports = { buildContent };
