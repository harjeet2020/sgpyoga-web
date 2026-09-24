/**
 * @module blog/src/posts/posts.11tydata
 *
 * Directory data for every blog post (it applies to posts/en/ and posts/es/).
 * It sets each post's public URL from two front-matter fields:
 *
 * - `lang: en` → `/blog/<slug>/`
 * - `lang: es` → `/es/blog/<slug>/`
 *
 * @remarks
 * Why the slug lives in front matter instead of coming from the filename:
 * an English post and its Spanish translation share a filename (that's how
 * the templates pair them, via `fileSlug`), but each deserves a slug in its
 * own language (`yoga-styles` / `estilos-de-yoga`).
 *
 * Why slugs are validated: Netlify answers any URL with capital letters with
 * a 301 redirect to the lowercase version. A camelCase slug therefore made
 * the page's own canonical URL point at a redirect, which is how 10 of the
 * 14 old blog URLs ended up confusing Google. The build now fails with a
 * clear message instead of publishing such a URL.
 *
 * Changing a published post's slug changes its URL: add a 301 redirect from
 * the old one in netlify.toml.
 */

/**
 * Lowercase words (a-z, 0-9) separated by single hyphens, e.g. `yoga-styles`.
 * No accents: write `formacion`, not `formación`.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Where each language's posts live. Mirrors the main site, where Spanish
 * pages sit under /es/.
 * @type {Record<string, string>}
 */
const BLOG_ROOT_BY_LANG = {
  en: "/blog/",
  es: "/es/blog/",
};

/**
 * Build a post's permalink from its `lang` and `slug` front matter.
 *
 * @param {object} data - The post's Eleventy data cascade.
 * @param {string} data.lang - Post language, `en` or `es`.
 * @param {string} data.slug - URL slug in the post's own language.
 * @param {{inputPath: string}} data.page - Eleventy page info, for error messages.
 * @returns {string} The post's URL path, e.g. `/es/blog/estilos-de-yoga/`.
 * @throws {Error} If `lang` is not a supported language, or `slug` is
 *   missing or not lowercase-kebab-case. This stops the build on purpose.
 */
function postPermalink(data) {
  const { lang, slug, page } = data;
  const source = page && page.inputPath ? page.inputPath : "a blog post";

  const blogRoot = BLOG_ROOT_BY_LANG[lang];
  if (!blogRoot) {
    throw new Error(
      `${source}: "lang" must be one of ${Object.keys(BLOG_ROOT_BY_LANG).join(", ")} (got ${JSON.stringify(lang)}).`
    );
  }

  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
    throw new Error(
      `${source}: "slug" must be lowercase words joined by hyphens, like "yoga-styles" (got ${JSON.stringify(slug)}).`
    );
  }

  return `${blogRoot}${slug}/`;
}

module.exports = {
  eleventyComputed: {
    permalink: postPermalink,
  },
};
