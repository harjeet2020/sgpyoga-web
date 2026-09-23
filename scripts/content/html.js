/**
 * @module scripts/content/html
 *
 * Small text utilities shared by the renderers: escaping, the "no markup in content" guard, and template marker substitution.
 */

/**
 * Escapes a string for use as HTML text or a double-quoted attribute value.
 *
 * @param {string} value - Plain text.
 * @returns {string} The text with `& < > " '` replaced by entities.
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Fails the build if a database string contains markup.
 *
 * @remarks
 * **Why fail rather than escape.** Generated locale strings reach the page two ways, and both treat them as HTML: `build-i18n.js` pastes the Spanish string straight into the markup, and `js/events.js` interpolates event text into `innerHTML`. The other path, `js/i18n.js` on a plain `data-i18n` element, uses `textContent` — so an escaped `&lt;` would print literally there. No single encoding is right for all three, and the school's content has never needed a tag, so the honest rule is that content is plain text and a `<` is refused with a message saying exactly where it is. Ampersands are allowed: `Harjeet & Camila` renders correctly on every path.
 *
 * @param {unknown} value - The value about to be published.
 * @param {string} where - Where it came from, for the error, such as `school_events.title_es (chakras-workshop_jul2026)`.
 * @returns {void}
 * @throws {Error} When the value is a string containing `<` or `>`.
 */
function assertPlainText(value, where) {
  if (typeof value === 'string' && /[<>]/.test(value)) {
    throw new Error(
      `${where} contains "<" or ">", which the website would render as HTML. ` +
        'Remove it in the admin panel and publish again.'
    );
  }
}

/**
 * Replaces each marker in a template with its generated content.
 *
 * @remarks
 * A marker must appear exactly once. Missing means somebody edited the template and deleted it, and the build would otherwise ship a page with nothing where the schedule should be; twice means the content would be emitted twice. Either is a failure. The marker's own line indentation is kept on the first line of the replacement.
 *
 * @param {string} template - The template text.
 * @param {Record<string, string>} replacements - Marker text (such as `<!-- BUILD:schedule-week -->`) to content.
 * @param {string} templateName - The template's path, for error messages.
 * @returns {string} The rendered text.
 * @throws {Error} When any marker is missing or duplicated.
 */
function fillMarkers(template, replacements, templateName) {
  let rendered = template;
  for (const [marker, content] of Object.entries(replacements)) {
    const count = rendered.split(marker).length - 1;
    if (count !== 1) {
      throw new Error(`${templateName} must contain the marker ${marker} exactly once, found ${count}.`);
    }
    // A function replacement, so `$` sequences in content are never interpreted.
    rendered = rendered.replace(marker, () => content);
  }
  return rendered;
}

module.exports = { escapeHtml, assertPlainText, fillMarkers };
