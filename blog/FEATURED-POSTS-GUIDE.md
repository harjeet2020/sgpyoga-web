# Featured Posts Implementation Guide

## Overview
The featured posts slideshow is now implemented for the blog index page, using a testimonials-style slideshow to highlight important blog posts.

## How It Works

### 1. Frontmatter Configuration
To make a post featured, add these fields to the markdown frontmatter:

```yaml
---
title: "Your Post Title"
description: "Post description"
date: 2025-01-20
category: "Category Name"
lang: en
tags: ["tag1", "tag2"]

# Featured post configuration
featured: true                    # Required: Marks post as featured
featuredOrder: 1                  # Required: Controls slideshow order (1 = first)
featuredImage: "/path/high.webp"  # Required: High-res image (1200px+)
featuredImageLow: "/path/low.webp" # Required: Low-res image (720px)
featuredImageAlt: "Image description" # Required: Accessibility text
featuredExcerpt: "Custom excerpt"  # Optional: Override description
---
```

### 2. Collection Logic
- Automatically filters posts with `featured: true`
- Sorts by `featuredOrder` (ascending), then by date (descending)
- Enforces maximum of 6 featured posts
- Warns if fewer than 3 featured posts found

### 3. Image Loading Strategy
- **First slide**: `loading="eager"` (loads immediately)
- **Other slides**: `loading="lazy"` (deferred loading)
- **Responsive images**: Uses `<picture>` with high-res for large screens
- **Fallback**: Shows low-res image if high-res not available

### 4. Min/Max Controls
Configure in `.eleventy.js`:
```javascript
const MIN_FEATURED = 3;  // Minimum recommended
const MAX_FEATURED = 6;  // Maximum to display
```

## File Structure

```
blog/
├── .eleventy.js                        # Featured posts collection
├── src/
│   ├── index.njk                       # Includes featured component
│   ├── _includes/
│   │   └── components/
│   │       └── featured-posts.njk      # Slideshow component
│   └── posts/
│       ├── en/
│       │   └── *.md                    # English posts with frontmatter
│       └── es/
│           └── *.md                    # Spanish posts with frontmatter
├── css/
│   └── blog-featured.css               # Slideshow styles
└── js/
    └── blog-featured.js                # Slideshow functionality
```

## Testing Checklist

### Build & View
```bash
cd blog
npm run dev
```
Then visit: `http://localhost:8080/blog/dist/`

### Test Cases

#### ✅ Visual Tests
- [ ] Featured section appears above "Recent Posts"
- [ ] Slideshow shows split-screen layout (image | content)
- [ ] Images load properly (check browser console for errors)
- [ ] Navigation dots display at bottom
- [ ] Prev/Next arrows appear and are clickable

#### ✅ Interaction Tests
- [ ] Click next arrow → advances to next slide
- [ ] Click prev arrow → goes to previous slide
- [ ] Click dots → jumps to specific slide
- [ ] Hover over slideshow → auto-play pauses
- [ ] Leave slideshow → auto-play resumes
- [ ] Auto-advance every 10 seconds

#### ✅ Responsive Tests
- [ ] Desktop (>1200px): Split screen, navigation at bottom-right
- [ ] Tablet (768-1200px): Split screen, adjusted padding
- [ ] Mobile (<768px): Stacked layout (image top, content bottom)
- [ ] Mobile: Navigation centered below content

#### ✅ Touch/Swipe (Mobile)
- [ ] Swipe left → next slide
- [ ] Swipe right → previous slide
- [ ] Vertical scroll → works normally (doesn't trigger slide change)

#### ✅ Keyboard Navigation
- [ ] Tab to navigate to slideshow
- [ ] Arrow Left → previous slide
- [ ] Arrow Right → next slide
- [ ] Home → first slide
- [ ] End → last slide

#### ✅ Accessibility
- [ ] Screen reader announces slide changes
- [ ] All images have alt text
- [ ] Navigation buttons have aria-labels
- [ ] Focus states visible on keyboard navigation

#### ✅ Language Filtering
- [ ] Only shows featured posts matching current language
- [ ] English selected → shows EN featured posts
- [ ] Spanish selected → shows ES featured posts
- [ ] Language switch updates both featured and recent posts

## Customization Options

### Auto-play Speed
In `blog-featured.js`, line 17:
```javascript
this.autoPlayDelay = 10000; // Milliseconds (10 seconds)
```

### Slide Order
Change `featuredOrder` in post frontmatter:
- Lower numbers appear first (1, 2, 3...)
- Posts without `featuredOrder` default to 999 (appear last)

### Maximum Featured Posts
In `.eleventy.js`, line 72:
```javascript
const MAX_FEATURED = 6;  // Change this number
```

### Styling
Edit `css/blog-featured.css`:
- Colors: Use CSS variables (`var(--color-accent-1)`, etc.)
- Spacing: Adjust `padding`, `margin` values
- Transitions: Modify `.featured-slide` transition duration

## Troubleshooting

### No featured posts showing
1. Check browser console for errors
2. Verify at least one post has `featured: true`
3. Check that `featuredImage` paths are correct
4. Run `npm run build` to rebuild

### Images not loading
1. Verify image paths start with `/` (absolute paths)
2. Check that images exist in `assets/` folder
3. Ensure images are copied to `dist/` (check `.eleventy.js` passthrough)

### Slideshow not advancing
1. Check browser console for JavaScript errors
2. Verify `blog-featured.js` is loaded
3. Check that Lucide icons are initializing
4. Ensure no conflicts with other JavaScript

### Language filtering not working
1. Verify `lang: en` or `lang: es` in post frontmatter
2. Check that i18next is initialized
3. Verify `data-lang` attribute on slides

## Adding More Featured Posts

To add a third featured post:

1. Create new post in `src/posts/en/` or `src/posts/es/`
2. Add featured frontmatter:
   ```yaml
   featured: true
   featuredOrder: 3
   featuredImage: "/assets/photos/blog/your-image-1200.webp"
   featuredImageLow: "/assets/photos/blog/your-image-720.webp"
   featuredImageAlt: "Description of image"
   ```
3. Rebuild: `npm run build`
4. Check console for confirmation: `"ℹ️ Found X featured posts"`

## Next Steps - Phase 2

Once featured posts are working, we can move to:
1. ✅ **Filters by category/tag** (dropdowns and checkboxes)
2. ✅ **Fuzzy search** (Fuse.js integration)
3. ✅ **Pagination** ("Load More" button or infinite scroll)
4. ✅ **Extract inline CSS** (move styles from index.njk to blog.css)

## Questions?
If anything isn't working as expected, check:
1. Browser console for errors
2. Eleventy build output for warnings
3. Network tab for failed asset loads
4. This guide's troubleshooting section
