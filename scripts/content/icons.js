/**
 * @module scripts/content/icons
 *
 * Inline SVG copies of the Lucide icons that the content build writes into generated markup.
 *
 * @remarks
 * **Why inline.** The site no longer loads the Lucide library at runtime. It was a 660 KB script (120 KB gzipped) behind a CDN redirect, used to draw about fifteen icons, which also popped in after first paint. Every icon is now plain SVG in the HTML. Authored pages carry their icons directly. Markup this build generates gets them from here, so a generated icon and a hand-written one look identical.
 *
 * **Keeping them in step with lucide.dev.** The paths were copied from lucide@1.47.0. The attributes match what `lucide.createIcons()` used to produce (24×24 viewBox, `currentColor` stroke, `aria-hidden`), so existing CSS that sizes `svg` elements keeps working. To add an icon, copy its SVG from https://lucide.dev and pass the class names the CSS expects.
 */

/**
 * The shared `<svg>` opening attributes, as Lucide emits them.
 *
 * @remarks
 * `aria-hidden="true"` is included because every icon here sits next to text that already says what it means. An icon that carries meaning on its own needs an accessible name instead.
 */
const SVG_ATTRIBUTES =
  'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

/**
 * Each icon's inner SVG elements, keyed by a camelCase name.
 */
const ICON_PATHS = {
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  mapPin:
    '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
};

/**
 * Builds one inline icon.
 *
 * @param {keyof ICON_PATHS} name - Which icon, such as `mapPin`.
 * @param {string} className - The `class` attribute, which the page's CSS uses to size and colour it.
 * @returns {string} A complete `<svg>…</svg>` element on one line.
 * @throws {Error} If `name` is not a known icon, so a typo fails the build instead of leaving a gap.
 *
 * @example
 * icon('mapPin', 'lucide lucide-map-pin');
 * // → '<svg xmlns="…" … aria-hidden="true" class="lucide lucide-map-pin"><path …/><circle …/></svg>'
 */
function icon(name, className) {
  const paths = ICON_PATHS[name];
  if (!paths) throw new Error(`Unknown icon "${name}" in scripts/content/icons.js`);
  return `<svg ${SVG_ATTRIBUTES} class="${className}">${paths}</svg>`;
}

module.exports = { icon, ICON_PATHS };
