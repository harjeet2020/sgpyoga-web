# Eleventy (11ty) Blog Configuration Guide

## Table of Contents
1. [Introduction](#introduction)
2. [What is Eleventy?](#what-is-eleventy)
3. [Directory Structure](#directory-structure)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Adding New Blog Posts](#adding-new-blog-posts)
7. [Running the Development Server](#running-the-development-server)
8. [Building for Production](#building-for-production)
9. [Frontmatter Schema](#frontmatter-schema)
10. [Available Layouts](#available-layouts)
11. [Collections and Filters](#collections-and-filters)
12. [Troubleshooting](#troubleshooting)

---

## Introduction

The SGP Yoga blog is powered by **Eleventy (11ty)**, a simple and powerful static site generator. This document provides everything you need to know about configuring, using, and maintaining the blog system.

---

## What is Eleventy?

**Eleventy** is a static site generator that transforms plain text files (like Markdown) into HTML. Key benefits:

- **Fast**: Builds sites in milliseconds
- **Simple**: Easy to learn and configure
- **Flexible**: Supports multiple template languages
- **No framework lock-in**: Generates plain HTML
- **Great for blogs**: Perfect for content-focused sites

**Why we chose 11ty:**
- Seamless integration with existing HTML/CSS/JS site
- Bilingual support through collections
- Markdown makes writing easy
- Fast build times
- No complex framework to learn

---

## Directory Structure

```
sgpyoga/
├── blog/                                    # 11ty root directory
│   ├── .eleventy.js                        # Configuration file
│   ├── package.json                        # Dependencies
│   ├── .gitignore                          # Ignore node_modules & dist
│   │
│   ├── src/                                # Source files
│   │   ├── posts/                          # Blog posts (Markdown)
│   │   │   ├── en/                         # English posts
│   │   │   │   └── YYYY-MM-DD-slug.md
│   │   │   └── es/                         # Spanish posts
│   │   │       └── YYYY-MM-DD-slug.md
│   │   │
│   │   └── _includes/                      # Templates & layouts
│   │       └── layouts/                    # Page layouts
│   │           ├── base.njk               # Base HTML template
│   │           └── post/                   # Post layouts
│   │               ├── standard.njk       # Standard post layout
│   │               ├── gallery.njk        # (To be created)
│   │               ├── minimal.njk        # (To be created)
│   │               └── feature.njk        # (To be created)
│   │
│   └── dist/                               # Generated output ⚠️ DO NOT EDIT
│       └── posts/
│           ├── en/
│           └── es/
│
├── css/
│   ├── main.css                            # Main site styles
│   └── blog.css                            # Blog-specific styles
│
└── js/
    └── blog-search.js                      # Search functionality
```

---

## Installation

### Prerequisites
- **Node.js** v14 or higher
- **npm** (comes with Node.js)

### Setup Steps

1. **Navigate to blog directory:**
   ```bash
   cd blog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify installation:**
   ```bash
   npm run build
   ```

   You should see output like:
   ```
   [11ty] Writing dist/posts/en/...
   [11ty] Wrote 2 files in 0.04 seconds
   ```

---

## Configuration

The `.eleventy.js` file controls how 11ty processes your content. Here's what it does:

### Key Configuration Options

```javascript
module.exports = function(eleventyConfig) {
  // 1. Define collections (groups of content)
  eleventyConfig.addCollection("postsEN", ...);
  eleventyConfig.addCollection("postsES", ...);
  
  // 2. Add custom filters (data transformations)
  eleventyConfig.addFilter("readableDate", ...);
  
  // 3. Configure directories
  return {
    dir: {
      input: "src",        // Where source files live
      output: "dist",      // Where built files go
      includes: "_includes" // Where templates live
    }
  };
};
```

### Collections

Collections organize your posts:

- **`postsEN`**: All English posts from `src/posts/en/*.md`
- **`postsES`**: All Spanish posts from `src/posts/es/*.md`
- **`allPosts`**: Combined collection (both languages)

Posts in each collection are automatically sorted by date (newest first).

### Filters

Filters transform data in templates:

| Filter | Purpose | Usage | Output |
|--------|---------|-------|--------|
| `htmlDateString` | Format for HTML | `{{ date \| htmlDateString }}` | `2025-01-15` |
| `readableDate` | Display date (EN) | `{{ date \| readableDate }}` | `January 15, 2025` |
| `readableDateES` | Display date (ES) | `{{ date \| readableDateES }}` | `15 de enero de 2025` |
| `toSearchIndex` | Generate search data | `{{ collections.postsEN \| toSearchIndex }}` | JSON array |
| `limit` | Limit array items | `{{ array \| limit(5) }}` | First 5 items |

---

## Adding New Blog Posts

### Step 1: Create Markdown File

**English post:** `blog/src/posts/en/YYYY-MM-DD-post-title.md`
**Spanish post:** `blog/src/posts/es/YYYY-MM-DD-post-title.md`

**Naming convention:**
- Start with date: `YYYY-MM-DD-`
- Use lowercase
- Separate words with hyphens
- Use descriptive titles

**Examples:**
- `2025-01-20-breathing-techniques.md`
- `2025-02-01-yoga-for-beginners.md`

### Step 2: Add Frontmatter

At the top of your Markdown file, add YAML frontmatter:

```yaml
---
title: "Your Post Title"
description: "A brief description for SEO and cards"
date: 2025-01-20
category: "Practice Tips"
layout: layouts/post/standard.njk
lang: en
tags: ["yoga", "breathing", "pranayama"]
---
```

### Step 3: Write Content

Below the frontmatter, write your post in Markdown:

```markdown
## Introduction

Your introduction paragraph goes here...

## Main Section

More content with **bold** and *italic* text.

- Bullet point 1
- Bullet point 2

### Subsection

![Image description](/assets/images/photo.jpg)

> This is a quote
```

### Step 4: Build & Preview

```bash
npm run dev
```

Open `http://localhost:8080` to see your post.

---

## Running the Development Server

The development server provides live reload—changes appear instantly in your browser.

### Start Server

```bash
cd blog
npm run dev
```

**What happens:**
- 11ty builds your site
- Browser-Sync starts a local server
- Your browser opens to `http://localhost:8080`
- File changes trigger automatic rebuilds

### Stop Server

Press `Ctrl + C` in the terminal.

---

## Building for Production

When you're ready to publish, build the production version:

```bash
cd blog
npm run build
```

**Output location:** `blog/dist/`

**What gets generated:**
- HTML files for each post
- Organized in `/posts/en/` and `/posts/es/` directories
- Each post gets its own folder with `index.html`

**Example output:**
```
dist/
└── posts/
    ├── en/
    │   └── 2025-01-15-welcome-to-yoga-journey/
    │       └── index.html
    └── es/
        └── 2025-01-15-bienvenidos-viaje-yoga/
            └── index.html
```

### Clean Build

To start fresh:

```bash
npm run clean   # Delete dist/ folder
npm run build   # Rebuild everything
```

---

## Frontmatter Schema

All fields explained:

```yaml
---
# REQUIRED FIELDS

title: "Post Title Here"
# The main heading of your post
# Used in: <title>, <h1>, and post cards

description: "Brief summary (1-2 sentences)"
# Short description for SEO and preview cards
# Keep it under 160 characters for best results

date: YYYY-MM-DD
# Publication date in ISO format
# Used for: sorting, display, datetime attributes
# Example: 2025-01-20

category: "Category Name"
# Organizes posts into topics
# Examples: "Philosophy", "Practice Tips", "Events"
# Used for filtering and display

layout: layouts/post/standard.njk
# Which template to use
# Options: standard.njk, gallery.njk, minimal.njk, feature.njk

lang: en
# Language code: "en" or "es"
# Used for: filtering, date formatting, language-specific display

# OPTIONAL FIELDS

image: "/assets/images/blog/post-image.jpg"
# Hero image URL (optional)
# Displays at top of post (depends on layout)

imageAlt: "Description of image"
# Alt text for hero image (required if image provided)
# Important for accessibility

imageCaption: "Photo credit or description"
# Caption below hero image (optional)

tags: ["tag1", "tag2", "tag3"]
# Array of keywords (optional)
# Used for: search, filtering, display
---
```

---

## Available Layouts

### 1. Standard Layout (`layouts/post/standard.njk`)

**Best for:** Most blog posts with text and optional images

**Features:**
- Optional hero image at top
- Comfortable reading width
- Standard typography
- Tags footer

**Use when:**
- Writing typical blog content
- You have 1-2 images
- Focus is on text

### 2. Gallery Layout (`layouts/post/gallery.njk`)

**Status:** ⚠️ To be created

**Best for:** Photo-heavy posts

**Features:**
- Image grid layout
- Captions support
- Lightbox effect
- Minimal text

### 3. Minimal Layout (`layouts/post/minimal.njk`)

**Status:** ⚠️ To be created

**Best for:** Text-only philosophical posts

**Features:**
- Clean, distraction-free
- Centered text column (800px max)
- No images
- Elegant typography

### 4. Feature Layout (`layouts/post/feature.njk`)

**Status:** ⚠️ To be created

**Best for:** Important announcements or featured posts

**Features:**
- Large hero image with overlay
- Title over image
- Dramatic presentation
- Call-to-action buttons

---

## Collections and Filters

### Using Collections in Templates

Collections are available in any Nunjucks template:

```njk
{# Get all English posts #}
{% for post in collections.postsEN %}
  <h2>{{ post.data.title }}</h2>
  <p>{{ post.data.description }}</p>
{% endfor %}

{# Get latest 5 posts #}
{% for post in collections.postsEN | limit(5) %}
  ...
{% endfor %}

{# Access post data #}
{{ post.data.title }}        {# Title from frontmatter #}
{{ post.date }}              {# Date object #}
{{ post.url }}               {# Generated URL #}
{{ post.data.category }}     {# Category #}
```

### Creating Custom Filters

Add to `.eleventy.js`:

```javascript
eleventyConfig.addFilter("uppercase", function(text) {
  return text.toUpperCase();
});
```

Use in templates:

```njk
{{ title | uppercase }}
```

---

## Troubleshooting

### Build Fails

**Error:** `filter not found`
- **Cause:** Using a filter that doesn't exist
- **Fix:** Check `.eleventy.js` for available filters or add the missing one

**Error:** `Template not found`
- **Cause:** Wrong layout path in frontmatter
- **Fix:** Verify layout path matches file structure

### Posts Don't Appear

**Check:**
1. File is in correct directory (`src/posts/en/` or `src/posts/es/`)
2. File has `.md` extension
3. Frontmatter is valid YAML (no syntax errors)
4. Date is in correct format (`YYYY-MM-DD`)
5. Layout path is correct

### CSS Not Loading

**Issue:** Styles don't appear
- **Cause:** CSS paths in base template are incorrect
- **Current setup:** CSS is referenced from parent directory: `../../css/main.css`
- **Fix:** Ensure main site's `css/` folder exists and contains `main.css` and `blog.css`

### Images Not Displaying

**Issue:** Images show broken
- **Check:**
  1. Image path is correct
  2. Image exists in `assets/images/` folder
  3. Path in frontmatter starts with `/assets/...`

### Development Server Won't Start

**Error:** `Port 8080 already in use`
- **Fix:** Change port in `.eleventy.js`:
  ```javascript
  eleventyConfig.setBrowserSyncConfig({
    port: 3000  // Use different port
  });
  ```

**Error:** `Command not found: eleventy`
- **Fix:** Run `npm install` in `blog/` directory

---

## Best Practices

### Writing Posts

1. **Use descriptive titles** - Clear, engaging, SEO-friendly
2. **Write good descriptions** - 1-2 sentences, 120-160 characters
3. **Choose appropriate layouts** - Match layout to content type
4. **Add alt text to images** - Important for accessibility
5. **Use tags consistently** - Helps with filtering and search
6. **Proofread before publishing** - Check for typos and formatting

### Organization

1. **Keep consistent naming** - Follow `YYYY-MM-DD-title` format
2. **Match English/Spanish posts** - Use same date/slug for translations
3. **Use meaningful categories** - 5-7 categories max
4. **Optimize images** - Compress before uploading

### Development Workflow

1. **Always use dev server** - See changes immediately
2. **Test in multiple languages** - Verify EN and ES work
3. **Build before committing** - Ensure no errors
4. **Validate HTML** - Check generated output occasionally

---

## NPM Scripts Reference

```bash
# Development
npm run dev      # Start development server with live reload
                 # Opens browser to http://localhost:8080

# Production
npm run build    # Build static site to dist/ folder
                 # Run this before deploying

# Maintenance
npm run clean    # Delete dist/ folder
                 # Useful for fresh builds

# Combination
npm run clean && npm run build    # Clean + fresh build
```

---

## File Naming Conventions

### Posts
- **Format:** `YYYY-MM-DD-post-slug.md`
- **Example:** `2025-01-20-breathing-techniques.md`
- **Rules:**
  - Start with date
  - Use lowercase
  - Hyphens (not underscores)
  - Descriptive slug

### Images
- **Format:** `descriptive-name.jpg`
- **Location:** `assets/images/blog/`
- **Example:** `yoga-breathing-technique.jpg`
- **Rules:**
  - Lowercase
  - Hyphens (not spaces)
  - Descriptive names

---

## Additional Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Nunjucks Template Language](https://mozilla.github.io/nunjucks/)
- [Markdown Guide](https://www.markdownguide.org/)
- [YAML Syntax](https://yaml.org/)

---

## Support

For questions or issues:
1. Check this documentation
2. Review `.eleventy.js` comments
3. Test with `npm run dev`
4. Check 11ty documentation

---

**Last Updated:** January 2025  
**11ty Version:** 2.0.1  
**Node.js Required:** v14+
