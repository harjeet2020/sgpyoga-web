# Development Workflow for SGP Yoga Blog

## Understanding the Setup

The blog is located in `/blog/dist/` and needs to integrate with the main site. This creates a challenge for local development since the blog needs to access parent directory files.

## Development Options

### Option 1: Full Site Server (Recommended for testing navigation)

This serves the entire site from the parent directory, allowing you to test navigation between the blog and main site.

**Terminal 1 - Build and watch for changes:**
```bash
cd blog
npm run build:watch
```
This rebuilds the blog automatically whenever you change blog files.

**Terminal 2 - Serve the entire site:**
```bash
cd blog
npm run serve
```
OR if you prefer another server:
```bash
# From the sgpyoga root directory
python3 -m http.server 8080
# or
npx http-server -p 8080
```

**Access:**
- Main site: `http://localhost:8080/index.html`
- Blog: `http://localhost:8080/blog/dist/`

**Pros:**
✅ All navigation works correctly
✅ Tests exactly how production will behave
✅ Can navigate between blog and main site

**Cons:**
❌ No automatic browser reload
❌ Need to manually refresh after changes
❌ Requires two terminal windows

---

### Option 2: Eleventy Dev Server (Faster for blog-only work)

Use this when you're only working on blog content/styles and don't need to test navigation to other pages.

```bash
cd blog
npm run dev
```

**Access:**
- Blog only: `http://localhost:8080/`

**Pros:**
✅ Automatic browser reload
✅ Fast development cycle
✅ Single command

**Cons:**
❌ Links to main site pages won't work
❌ Only see the blog, not full site
❌ Not representative of production

---

## Recommended Workflow

### For blog content/styling work:
1. Use `npm run dev` for fast iteration
2. Don't worry about broken navigation links
3. Focus on blog appearance and functionality

### Before committing or for navigation testing:
1. Run `npm run build` to generate latest version
2. Start a simple HTTP server from parent directory
3. Test all navigation links work correctly
4. Verify blog integrates properly with main site

---

## Production Deployment

In production, your web server will serve everything from a single root directory, so all the absolute paths (`/index.html`, `/blog/dist/`, etc.) will work correctly.

**Deployment checklist:**
1. Run `npm run build` to generate `dist/`
2. Upload the entire `sgpyoga/` directory to your server
3. Ensure your web server serves from the `sgpyoga/` root
4. Blog will be accessible at `yoursite.com/blog/dist/`

**Optional:** You could create a rewrite rule or symbolic link so the blog is accessible at `yoursite.com/blog/` instead of `yoursite.com/blog/dist/`.

---

## Quick Reference

```bash
# Blog development (fast, blog only)
npm run dev

# Build blog for production
npm run build

# Watch for changes (pair with separate server)
npm run build:watch

# Serve entire site (in separate terminal)
npm run serve

# Clean build
npm run clean
```

---

## Why This Setup?

The blog uses absolute paths (`/index.html`, `/assets/...`) to match how it will work in production. This means:

- **In dev:** Links to parent pages don't work in Eleventy's server (expected)
- **In production:** Everything works perfectly because all files share the same server root

This is a common pattern for blogs integrated into existing sites and is **working as intended**. The important thing is that production behaves correctly, which it will!
