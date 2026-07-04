/**
 * Eleventy Configuration for SGP Yoga Blog
 * 
 * This configuration sets up:
 * - Input/output directories
 * - Collections for English and Spanish posts
 * - Passthrough copying for static assets
 * - Custom filters for dates and data formatting
 */

module.exports = function(eleventyConfig) {
  
  // ========================================================================
  // Helper Functions - Post Visibility Control
  // ========================================================================
  
  /**
   * Log information about invisible posts for preview purposes
   * @param {Object} post - The post object
   * @param {String} reason - Why the post is invisible ('draft' or 'scheduled')
   */
  function logInvisiblePost(post, reason) {
    const title = post.data.title || 'Untitled';
    const previewUrl = '/blog/dist' + post.url;
    const dateStr = new Date(post.date).toISOString().split('T')[0];
    
    if (reason === 'draft') {
      console.log(`📝 Draft post hidden: "${title}"`);
      console.log(`   Preview URL: ${previewUrl}`);
    } else if (reason === 'scheduled') {
      console.log(`📅 Scheduled post (${dateStr}): "${title}"`);
      console.log(`   Preview URL: ${previewUrl}`);
    }
  }
  
  /**
   * Check if a post should be visible in collections
   * Posts are hidden if:
   * - visible property is explicitly set to false (draft mode)
   * - date is in the future (scheduled post)
   * 
   * @param {Object} post - The post object with data and date
   * @returns {Boolean} - True if post should be visible in collections
   */
  function isPostVisible(post) {
    const now = new Date();
    const postDate = new Date(post.date);
    
    // Check explicit visibility flag (defaults to true if not specified)
    const isExplicitlyVisible = post.data.visible !== false;
    
    // Check if post date is not in the future
    const isNotFuture = postDate <= now;
    
    // Log invisible posts for preview purposes
    if (!isExplicitlyVisible) {
      logInvisiblePost(post, 'draft');
      return false;
    }
    
    if (!isNotFuture) {
      logInvisiblePost(post, 'scheduled');
      return false;
    }
    
    return true;
  }
  
  
  // ========================================================================
  // Passthrough Copy - Static Assets
  // ========================================================================
  // Copy site-wide assets from parent project into the blog output (dist/)
  // Using explicit destination directories under dist so URLs can be absolute
  eleventyConfig.addPassthroughCopy({ "../css": "css" });
  eleventyConfig.addPassthroughCopy({ "../js": "js" });
  eleventyConfig.addPassthroughCopy({ "../assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "../locales": "locales" });

  // Watch parent directories so BrowserSync reloads on changes
  eleventyConfig.addWatchTarget("../css");
  eleventyConfig.addWatchTarget("../js");
  eleventyConfig.addWatchTarget("../assets");
  eleventyConfig.addWatchTarget("../locales");
  
  
  // ========================================================================
  // Collections - Organize Posts by Language
  // ========================================================================
  
  /**
   * English Posts Collection
   * Filters posts from src/posts/en/ and sorts by date (newest first)
   * Only includes visible posts (respects visible flag and future dates)
   */
  eleventyConfig.addCollection("postsEN", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/en/*.md")
      .filter(post => isPostVisible(post))
      .sort((a, b) => b.date - a.date);
  });
  
  /**
   * Spanish Posts Collection
   * Filters posts from src/posts/es/ and sorts by date (newest first)
   * Only includes visible posts (respects visible flag and future dates)
   */
  eleventyConfig.addCollection("postsES", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/es/*.md")
      .filter(post => isPostVisible(post))
      .sort((a, b) => b.date - a.date);
  });
  
  /**
   * All Posts Collection (both languages)
   * Useful for generating combined feeds or search indexes
   * Only includes visible posts (respects visible flag and future dates)
   */
  eleventyConfig.addCollection("allPosts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
      .filter(post => isPostVisible(post))
      .sort((a, b) => b.date - a.date);
  });
  
  /**
   * Featured Posts Collection - English
   * Displays English posts marked with featured: true in frontmatter
   * Sorts by featuredOrder (if specified), then by date
   * Limits to 6 posts per language
   */
  eleventyConfig.addCollection("featuredPostsEN", function(collectionApi) {
    const MAX_FEATURED = 6;  // Maximum featured posts to display per language
    
    let featured = collectionApi
      .getFilteredByGlob("src/posts/en/*.md")  // Only English posts
      .filter(post => isPostVisible(post))  // Only visible posts can be featured
      .filter(post => post.data.featured === true)
      .sort((a, b) => {
        // Sort by featuredOrder first (lower numbers appear first)
        const orderA = a.data.featuredOrder || 999;
        const orderB = b.data.featuredOrder || 999;
        
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        // Fallback to date (newest first) if order is the same
        return b.date - a.date;
      });
    
    // Enforce maximum limit
    if (featured.length > MAX_FEATURED) {
      console.log(`ℹ️  Found ${featured.length} English featured posts. Limiting to ${MAX_FEATURED}.`);
      featured = featured.slice(0, MAX_FEATURED);
    }
    
    return featured;
  });
  
  /**
   * Featured Posts Collection - Spanish
   * Displays Spanish posts marked with featured: true in frontmatter
   * Sorts by featuredOrder (if specified), then by date
   * Limits to 6 posts per language
   */
  eleventyConfig.addCollection("featuredPostsES", function(collectionApi) {
    const MAX_FEATURED = 6;  // Maximum featured posts to display per language
    
    let featured = collectionApi
      .getFilteredByGlob("src/posts/es/*.md")  // Only Spanish posts
      .filter(post => isPostVisible(post))  // Only visible posts can be featured
      .filter(post => post.data.featured === true)
      .sort((a, b) => {
        // Sort by featuredOrder first (lower numbers appear first)
        const orderA = a.data.featuredOrder || 999;
        const orderB = b.data.featuredOrder || 999;
        
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        // Fallback to date (newest first) if order is the same
        return b.date - a.date;
      });
    
    // Enforce maximum limit
    if (featured.length > MAX_FEATURED) {
      console.log(`ℹ️  Found ${featured.length} Spanish featured posts. Limiting to ${MAX_FEATURED}.`);
      featured = featured.slice(0, MAX_FEATURED);
    }
    
    return featured;
  });
  
  
  // ========================================================================
  // Filters - Custom Data Transformations
  // ========================================================================
  
  /**
   * Format date as HTML datetime attribute
   * Usage: {{ post.date | htmlDateString }}
   * Output: "2025-01-15"
   */
  eleventyConfig.addFilter("htmlDateString", function(dateObj) {
    return new Date(dateObj).toISOString().split('T')[0];
  });
  
  /**
   * Format date for display
   * Usage: {{ post.date | readableDate }}
   * Output: "January 15, 2025"
   */
  eleventyConfig.addFilter("readableDate", function(dateObj) {
    return new Date(dateObj).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });
  
  /**
   * Format date for display in Spanish
   * Usage: {{ post.date | readableDateES }}
   * Output: "15 de enero de 2025"
   */
  eleventyConfig.addFilter("readableDateES", function(dateObj) {
    return new Date(dateObj).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });
  
  /**
   * Convert collection to JSON for search index
   * Usage: {{ collections.allPosts | toSearchIndex }}
   * Generates search index with weighted fields for Fuse.js
   */
  eleventyConfig.addFilter("toSearchIndex", function(collection) {
    return JSON.stringify(collection.map(post => {
      // Extract content and strip excessive whitespace
      const content = (post.template.frontMatter.content || '')
        .replace(/\n{3,}/g, '\n\n')  // Normalize multiple newlines
        .trim();
      
      // Add pathPrefix to URL to match rendered hrefs
      const fullUrl = '/blog/dist' + post.url;
      
      return {
        title: post.data.title || '',
        description: post.data.description || '',
        content: content,
        category: post.data.category || 'general',
        tags: post.data.tags || [],
        url: fullUrl,
        lang: post.data.lang || 'en',
        date: post.date
      };
    }));
  });
  
  /**
   * Limit collection to N items
   * Usage: {{ collections.postsEN | limit(5) }}
   */
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });
  
  /**
   * Find post in collection by fileSlug (filename-based matching)
   * Usage: {{ collections.postsES | findByFileSlug(currentPost.fileSlug) }}
   */
  eleventyConfig.addFilter("findByFileSlug", function(collection, fileSlug) {
    if (!collection || !fileSlug) return null;
    return collection.find(item => item.fileSlug === fileSlug) || null;
  });

  /**
   * Build a width-descriptor srcset string from image paths whose filenames
   * end in "-<width>.<ext>" (e.g. "chakras-768.webp" -> "chakras-768.webp 768w").
   *
   * Why: the width descriptors must match the file's real pixel width or the
   * browser picks the wrong resolution (blurry on retina). Deriving them from
   * the filename keeps templates self-maintaining — new posts just need
   * correctly named variants in front matter.
   *
   * Skips missing entries, dedupes by path and width (posts sometimes reuse
   * one file for two front-matter fields; duplicate descriptors are a srcset
   * parse error), and sorts small-to-large. Returns "" if nothing matches,
   * in which case the <img src> fallback still renders.
   *
   * Usage: srcset="{{ [imageMobile, image, imageHigh] | imageSrcset }}"
   */
  eleventyConfig.addFilter("imageSrcset", function(paths) {
    const seenPaths = new Set();
    const seenWidths = new Set();
    return (paths || [])
      .filter(Boolean)
      .map(path => {
        const match = path.match(/-(\d+)\.\w+$/);
        return match ? { path, width: Number(match[1]) } : null;
      })
      .filter(entry =>
        entry &&
        !seenPaths.has(entry.path) && seenPaths.add(entry.path) &&
        !seenWidths.has(entry.width) && seenWidths.add(entry.width)
      )
      .sort((a, b) => a.width - b.width)
      .map(({ path, width }) => `${path} ${width}w`)
      .join(", ");
  });
  
  
  // ========================================================================
  // Server Configuration
  // ========================================================================
  
  // Browser Sync options for development server
  // Serve from parent directory so main site links work
  eleventyConfig.setBrowserSyncConfig({
    notify: true,
    open: true,
    port: 8080,
    server: {
      baseDir: "../",    // Serve from parent sgpyoga directory
      serveStaticOptions: {
        extensions: ["html"]  // Allow accessing files without .html extension
      }
    },
    startPath: "/blog/dist/"  // Open to blog index by default
  });
  
  
  // ========================================================================
  // Return Configuration Object
  // ========================================================================
  
  return {
    // Path prefix for all URLs (important for subdirectory deployment)
    pathPrefix: "/blog/dist/",
    
    // Directory structure
    dir: {
      input: "src",           // Source files directory
      output: "dist",         // Built site output directory
      includes: "_includes",  // Layout templates and partials
      data: "_data"          // Global data files
    },
    
    // Template formats to process
    templateFormats: ["md", "njk", "html", "liquid"],
    
    // Use Nunjucks for markdown and HTML files
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    
    // Use Nunjucks as default template engine
    dataTemplateEngine: "njk"
  };
};
