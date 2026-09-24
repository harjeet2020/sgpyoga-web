# Development Workflow for SGP Yoga Blog

## Understanding the Setup

The blog is built by Eleventy from `blog/src/` into `blog/dist/`. `dist/` is laid out like the website root:

| Built file | Public URL |
|---|---|
| `dist/blog/index.html` | `/blog/` (English index) |
| `dist/blog/<slug>/index.html` | `/blog/<slug>/` (English post) |
| `dist/es/blog/index.html` | `/es/blog/` (Spanish index) |
| `dist/es/blog/<slug>/index.html` | `/es/blog/<slug>/` (Spanish post) |
| `dist/blog/search-index.json` | `/blog/search-index.json` |

The root build (`npm run build` in the project root) merges `dist/` into `_site/`, next to the main site's pages and its `css/`, `js/`, `assets/` and `locales/`. Blog pages load those shared files from the site root (`/css/main.css`), so the production blog build never copies them.

## Development Options

### Option 1: Eleventy dev server (fast, blog only)

```bash
cd blog
npm run dev
```

Open `http://localhost:8080/blog/` or `http://localhost:8080/es/blog/`.

- ✅ Rebuilds and reloads the browser on every change, including edits to the shared `../css`, `../js`, `../assets` and `../locales`.
- ❌ Links to main-site pages (`/about.html` and so on) 404: this server only knows about the blog.

In this mode only, `.eleventy.js` copies the shared folders into `dist/` so the pages are styled. Those copies never reach production, because `npm run build` deletes `dist/` first and doesn't copy them.

### Option 2: The full site, as it will be deployed

```bash
# In the project root
npm run build
cd _site && python3 -m http.server 8080
# or, from blog/:  npm run serve
```

Open `http://localhost:8080/blog/`. Everything works, including navigation to the main site and the language switcher. There's no live reload: rebuild after changes.

Use this before committing anything that touches navigation, URLs or the language switcher.

## Production Deployment

Netlify runs the root `npm run build` and publishes `_site/`. Redirects from the blog's old addresses (`/blog/dist/...`) are in `netlify.toml`.

## Quick Reference

```bash
npm run dev          # Blog dev server with live reload (blog only)
npm run build        # Clean production build of the blog into dist/
npm run serve        # Serve the full site build (run the root build first)
npm run clean        # Delete dist/
```
