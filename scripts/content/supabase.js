/**
 * @module scripts/content/supabase
 *
 * The only code in the website that talks to Supabase, and it runs in Node at build time.
 *
 * @remarks
 * **No client library, on purpose.** The build needs two things — read a table, download a public file — and both are one HTTP request against PostgREST and Storage. Plain `fetch` keeps the website at zero runtime dependencies and makes C6 structurally true: there is no Supabase package anywhere in this repository that could be bundled into a page by mistake.
 *
 * **Every failure throws, naming what failed.** A network error, a non-2xx status or an unexpected body all become an `Error` whose message names the table or object key. The orchestrator turns that into a red build, which leaves the previous deploy serving — far better than a green build that published an empty schedule.
 */

const fs = require('fs');
const path = require('path');

/**
 * How long one request may take before the build gives up on it.
 *
 * @remarks
 * Generous, because a free-tier project that has been paused takes several seconds to wake. Without a limit at all a hung connection would stall a Netlify build until Netlify's own much longer timeout, burning build minutes on nothing.
 */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * How many images download at once.
 *
 * @remarks
 * Enough to finish the ~50 current variants in a couple of seconds, few enough not to look like a burst to Storage's rate limiting.
 */
const DOWNLOAD_CONCURRENCY = 6;

/**
 * Performs a request with a timeout, turning a network failure into an error that says what was being fetched.
 *
 * @param {string} url - The absolute URL.
 * @param {RequestInit} init - Fetch options.
 * @param {string} what - A human description for error messages, such as `table school_events`.
 * @returns {Promise<Response>} The response, whatever its status.
 * @throws {Error} When the request cannot be made or times out.
 */
async function request(url, init, what) {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (error) {
    const reason = error.name === 'TimeoutError' ? `timed out after ${REQUEST_TIMEOUT_MS / 1000}s` : error.cause?.code || error.message;
    throw new Error(`Could not fetch ${what} from ${new URL(url).origin}: ${reason}`);
  }
}

/**
 * Reads every row of a table that public read access allows.
 *
 * @remarks
 * RLS decides what "every row" means: retired schedule slots and unpublished events are simply not returned to the publishable key. The response must be a JSON array; anything else — a PostgREST error object, an HTML error page from a proxy — is a failure rather than something to coerce.
 *
 * @param {import('./config').SupabaseConfig} config - Project URL and key.
 * @param {string} table - The table name, such as `school_events`.
 * @param {string} [query] - Extra PostgREST query parameters, such as `order=sort_order`.
 * @returns {Promise<object[]>} The rows.
 * @throws {Error} On any network error, non-2xx status or non-array body.
 */
async function fetchTable(config, table, query = '') {
  const url = `${config.url}/rest/v1/${table}?select=*${query ? `&${query}` : ''}`;
  const what = `table ${table}`;
  const response = await request(
    url,
    { headers: { apikey: config.key, Authorization: `Bearer ${config.key}`, Accept: 'application/json' } },
    what
  );

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Could not fetch ${what}: HTTP ${response.status} ${body.slice(0, 300)}`);
  }

  const rows = await response.json();
  if (!Array.isArray(rows)) {
    throw new Error(`Could not fetch ${what}: expected an array of rows, got ${typeof rows}.`);
  }
  return rows;
}

/**
 * Downloads one public Storage object to a local file.
 *
 * @param {import('./config').SupabaseConfig} config - Project URL and key.
 * @param {string} bucket - The bucket name.
 * @param {string} key - The object key, such as `teachers/camila-200.webp`.
 * @param {string} destination - The absolute local path to write.
 * @returns {Promise<void>}
 * @throws {Error} When the object cannot be fetched, including a 404 for a variant that was never uploaded.
 */
async function downloadObject(config, bucket, key, destination) {
  const url = `${config.url}/storage/v1/object/public/${bucket}/${key}`;
  const what = `image ${bucket}/${key}`;
  const response = await request(url, {}, what);

  if (!response.ok) {
    throw new Error(`Could not download ${what}: HTTP ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes);
}

/**
 * Downloads many objects with bounded concurrency, failing if any one fails.
 *
 * @remarks
 * Everything is downloaded on every build rather than skipped when a file exists. Admins replace an image by uploading to the same key, so "the file is already here" says nothing about whether it is the current one — and Netlify starts each build from a clean checkout anyway.
 *
 * @param {import('./config').SupabaseConfig} config - Project URL and key.
 * @param {string} bucket - The bucket name.
 * @param {Array<{key: string, destination: string}>} objects - What to download and where.
 * @returns {Promise<void>}
 * @throws {Error} The first download failure, after in-flight downloads settle.
 */
async function downloadAll(config, bucket, objects) {
  const queue = [...objects];
  const workers = Array.from({ length: Math.min(DOWNLOAD_CONCURRENCY, queue.length) }, async () => {
    while (queue.length > 0) {
      const { key, destination } = queue.shift();
      await downloadObject(config, bucket, key, destination);
    }
  });
  await Promise.all(workers);
}

module.exports = { fetchTable, downloadAll };
