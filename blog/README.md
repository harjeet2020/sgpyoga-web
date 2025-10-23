# SGP Yoga Blog

Static blog system powered by [Eleventy (11ty)](https://www.11ty.dev/).

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (with live reload)
npm run dev

# Build for production
npm run build

# Clean build output
npm run clean
```

## Adding a New Post

1. Create a markdown file in `src/posts/en/` or `src/posts/es/`
2. Name it: `YYYY-MM-DD-post-title.md`
3. Add frontmatter:

```yaml
---
title: "Post Title"
description: "Brief description"
date: 2025-01-20
category: "Category"
layout: layouts/post/standard.njk
lang: en
tags: ["tag1", "tag2"]
---
```

4. Write your content in Markdown
5. Preview with `npm run dev`

## Directory Structure

```
blog/
├── src/
│   ├── posts/
│   │   ├── en/          # English posts
│   │   └── es/          # Spanish posts
│   └── _includes/       # Templates
│       └── layouts/
└── dist/                # Generated output (gitignored)
```

## Documentation

See `docs/11ty-configuration.md` for comprehensive documentation including:
- Configuration details
- Frontmatter schema
- Available layouts
- Troubleshooting guide
- Best practices

## Tech Stack

- **Eleventy** v2.0.1 - Static site generator
- **Nunjucks** - Template engine
- **Markdown** - Content format
- **Browser-Sync** - Development server

## Current Status

✅ Basic setup complete
✅ English & Spanish post collections
✅ Standard post layout
✅ Development & build scripts
✅ Test posts created

⏳ To be implemented:
- Blog index page
- Additional layouts (gallery, minimal, feature)
- Search functionality
- Blog-specific CSS
- Navigation integration

---

**For full documentation, see:** `../docs/11ty-configuration.md`
