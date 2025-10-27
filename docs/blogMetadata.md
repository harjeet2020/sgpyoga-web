# Blog Post Metadata Documentation

This document provides a comprehensive reference for all YAML frontmatter metadata fields supported by SGP Yoga's 11ty blog system.

---

## Required Fields

### `title`
**Type:** String  
**Description:** The main title of the blog post. Displayed prominently at the top of the post and used for SEO purposes.  
**Example:**
```yaml
title: "The 7 Main Chakras & The Human Energy System"
```

---

### `description`
**Type:** String  
**Description:** A brief summary or excerpt of the blog post. Used for SEO meta descriptions, search results, and post previews. Should be concise but descriptive (typically 50-160 characters for optimal SEO).  
**Example:**
```yaml
description: "A comprehensive guide to understanding the seven major chakras, the human energy system, and how they influence our spiritual transformation and daily life."
```

---

### `date`
**Type:** Date (ISO 8601 format)  
**Description:** The publication date and time of the post. Used for sorting posts chronologically and displaying publication information. Format: `YYYY-MM-DDTHH:MM:SS` (time is optional).  
**Example:**
```yaml
date: 2025-10-23T12:00:00
```
or
```yaml
date: 2025-10-23
```

---

### `category`
**Type:** String  
**Description:** The primary category this post belongs to. Used for organizing and filtering posts. Common categories include: "spirituality", "general", "announcements".  
**Example:**
```yaml
category: "spirituality"
```

---

### `layout`
**Type:** String (file path)  
**Description:** Specifies which Nunjucks template should be used to render the post. Currently, the standard layout is the primary option available.  
**Example:**
```yaml
layout: layouts/post/standard.njk
```

---

### `lang`
**Type:** String (language code)  
**Description:** The language of the post content. Used for language-specific collections and date formatting. Accepted values: `en` (English) or `es` (Spanish).  
**Example:**
```yaml
lang: en
```

---

## Optional Fields

### `tags`
**Type:** Array of Strings  
**Description:** Keywords or topics associated with the post. Used for categorization, filtering, and generating tag clouds. Can include multiple tags.  
**Example:**
```yaml
tags: ["chakras", "energy", "kundalini yoga"]
```

---

### `authorName`
**Type:** String  
**Description:** The name of the post author. Displayed in the post header metadata alongside the date.  
**Example:**
```yaml
authorName: "Harjeet"
```

---

### `authorImage`
**Type:** String (URL/path)  
**Description:** Path to the author's profile image/avatar. Should be an absolute path starting from the site root. Image will be displayed next to the author name.  
**Example:**
```yaml
authorImage: "/assets/photos/inUse/about/harjeet.webp"
```

---

### `image`
**Type:** String (URL/path)  
**Description:** Path to a hero/featured image for the post. Displayed prominently at the top of the post content area. Should be an absolute path from site root.  
**Example:**
```yaml
image: "/assets/photos/blog/chakras-hero.webp"
```

---

### `imageAlt`
**Type:** String  
**Description:** Alternative text for the hero image. Used for accessibility (screen readers) and SEO. If not provided, the post `title` will be used as fallback.  
**Example:**
```yaml
imageAlt: "Illustration of the seven main chakras in the human body"
```

---

### `imageCaption`
**Type:** String  
**Description:** A caption to display below the hero image. Use this to provide context, credits, or additional information about the image.  
**Example:**
```yaml
imageCaption: "Traditional representation of the chakra system"
```

---

### `featured`
**Type:** Boolean  
**Description:** Marks a post as "featured" to be included in the featured posts collection. Featured posts are displayed prominently on the blog index and home pages. The system enforces a maximum of 6 featured posts.  
**Example:**
```yaml
featured: true
```

---

### `featuredOrder`
**Type:** Integer  
**Description:** Determines the display order of featured posts (lower numbers appear first). Posts without this field default to 999 and are sorted by date. Only relevant when `featured: true` is set.  
**Example:**
```yaml
featuredOrder: 1
```

---

## Complete Example

Here's a full example showing all available metadata fields:

```yaml
---
title: "The Journey So Far | The Origins of SGP Yoga"
description: "A yoga school doesn't just magically pop into being - at least for us, it has been a long journey. This article tells the story of who we are, what we do, and how we got here."
date: 2025-10-27T12:00:00
category: "general"
layout: layouts/post/standard.njk
lang: en
tags: ["sgpyoga", "community", "story"]
featured: true
featuredOrder: 1
authorName: "Harjeet"
authorImage: "/assets/photos/inUse/about/harjeet.webp"
image: "/assets/photos/blog/sgpyoga-journey.webp"
imageAlt: "SGP Yoga team teaching a class in Mexico City"
imageCaption: "Our first joint workshop in Mexico City, 2024"
---
```

---

## Minimal Example

The minimum required fields for a valid blog post:

```yaml
---
title: "My Blog Post Title"
description: "A brief description of my post"
date: 2025-10-27
category: "general"
layout: layouts/post/standard.njk
lang: en
---
```

---

## Collections and Filtering

Posts are automatically organized into collections based on their metadata:

- **`postsEN`** - All English posts (`lang: en`)
- **`postsES`** - All Spanish posts (`lang: es`)
- **`allPosts`** - All posts in both languages
- **`featuredPosts`** - Posts marked with `featured: true` (max 6, sorted by `featuredOrder`)

All collections are automatically sorted by date (newest first), except featured posts which are sorted by `featuredOrder` first, then by date.

---

## Best Practices

1. **Always include required fields** - Posts without required fields may not render correctly
2. **Use descriptive titles and descriptions** - These are crucial for SEO and user engagement
3. **Provide author information** - Helps build connection with readers
4. **Add relevant tags** - Improves discoverability and organization
5. **Optimize images** - Use WebP format for better performance, provide both high and low resolution versions
6. **Write meaningful alt text** - Essential for accessibility
7. **Use featured posts strategically** - Limit to 3-6 most important posts to avoid clutter
8. **Keep descriptions concise** - Aim for 50-160 characters for optimal SEO
9. **Use consistent category names** - Stick to established categories for better organization
10. **Include publication time** - Use full ISO format with time for better timestamp precision

---

## Related Documentation

- `blog/README.md` - Quick start guide for the blog system
- `docs/11ty-configuration.md` - Comprehensive 11ty configuration documentation
- `blog/.eleventy.js` - 11ty configuration file with collection and filter definitions
