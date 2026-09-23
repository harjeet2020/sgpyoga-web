/**
 * @module scripts/content/config
 *
 * Where the content build reads from and writes to, and the credentials it needs to do so.
 *
 * @remarks
 * **Credentials come from the environment and are validated before anything else runs.** On Netlify they are site environment variables; locally they come from a gitignored `website/.env`, which is loaded here if present so that `npm run build` works without exporting anything by hand. A missing variable is a build failure naming the variable, never a silent fallback to some default project: a build pointed at the wrong database would publish the wrong schedule with a green tick.
 *
 * **The publishable key is the correct credential, not a compromise.** The school tables are publicly readable by policy — they are marketing content — and public read RLS is what filters out retired slots and unpublished events. A secret key here would bypass those policies and publish drafts.
 *
 * All paths are absolute and resolved from the website root, so the scripts behave the same whichever directory `npm` was invoked from.
 */

const fs = require('fs');
const path = require('path');

/** The website repository root, two levels above this file. */
const ROOT_DIR = path.resolve(__dirname, '..', '..');

/**
 * Tracked templates and the gitignored files they render to.
 *
 * @remarks
 * A template holds everything hand-written about a file plus single-line markers where generated content goes. Rendering it to the original path — rather than editing that path in place — is what keeps a build from ever dirtying the working tree, and it is also why `build-i18n.js` and `build:copy` needed no changes: they still find `classes.html`, `events.html` and `js/eventsData.js` exactly where they always were.
 */
const TEMPLATES = {
  classes: {
    source: path.join(ROOT_DIR, 'templates', 'classes.html'),
    output: path.join(ROOT_DIR, 'classes.html'),
  },
  events: {
    source: path.join(ROOT_DIR, 'templates', 'events.html'),
    output: path.join(ROOT_DIR, 'events.html'),
  },
  eventsData: {
    source: path.join(ROOT_DIR, 'templates', 'eventsData.js'),
    output: path.join(ROOT_DIR, 'js', 'eventsData.js'),
  },
};

/** Generated files with no template: written whole on every build. */
const OUTPUTS = {
  scheduleColours: path.join(ROOT_DIR, 'css', 'schedule-colours.css'),
  /** @param {string} lang - `en` or `es`. @returns {string} Path to that language's generated schedule namespace. */
  scheduleNamespace: (lang) => path.join(ROOT_DIR, 'locales', lang, 'schedule.json'),
  /** @param {string} lang - `en` or `es`. @returns {string} Path to that language's generated event namespace. */
  eventContentNamespace: (lang) => path.join(ROOT_DIR, 'locales', lang, 'eventContent.json'),
};

/**
 * Where downloaded Storage objects land, and the public URL prefix they are served from.
 *
 * @remarks
 * The directory mirrors the bucket's key layout, so the object `teachers/camila-200.webp` is written to `assets/photos/school/teachers/camila-200.webp` and served at `/assets/photos/school/teachers/camila-200.webp`. The whole directory is generated and gitignored; nothing tracked lives beside it. See C4 in `MIGRATION.md`.
 */
const MEDIA = {
  bucket: 'school-media',
  dir: path.join(ROOT_DIR, 'assets', 'photos', 'school'),
  publicPrefix: '/assets/photos/school',
};

/**
 * The environment variables the build cannot run without.
 */
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'];

/**
 * The validated connection settings for the Supabase project the build reads from.
 *
 * @typedef {object} SupabaseConfig
 * @property {string} url - Project URL without a trailing slash, e.g. `https://abc.supabase.co`.
 * @property {string} key - The publishable (anon) key.
 */

/**
 * Loads `website/.env` when it exists and returns the validated Supabase settings.
 *
 * @remarks
 * Variables already present in the environment win over the file, which is Node's own `loadEnvFile` behaviour and the one wanted: Netlify's settings must never be shadowed by a stray local file.
 *
 * @returns {SupabaseConfig} The project URL and publishable key.
 * @throws {Error} When a required variable is missing or the URL is not an http(s) URL.
 */
function loadSupabaseConfig() {
  const envFile = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }

  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing environment variable(s): ${missing.join(', ')}. ` +
        'Set them in Netlify site settings, or in website/.env locally (see .env.example).'
    );
  }

  const url = process.env.SUPABASE_URL.replace(/\/+$/, '');
  if (!/^https?:\/\//.test(url)) {
    throw new Error(`SUPABASE_URL must start with http:// or https://, got "${url}".`);
  }

  return { url, key: process.env.SUPABASE_PUBLISHABLE_KEY };
}

module.exports = { ROOT_DIR, TEMPLATES, OUTPUTS, MEDIA, loadSupabaseConfig };
