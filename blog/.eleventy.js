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
   */
  eleventyConfig.addCollection("postsEN", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/en/*.md")
      .sort((a, b) => b.date - a.date);
  });
  
  /**
   * Spanish Posts Collection
   * Filters posts from src/posts/es/ and sorts by date (newest first)
   */
  eleventyConfig.addCollection("postsES", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/es/*.md")
      .sort((a, b) => b.date - a.date);
  });
  
  /**
   * All Posts Collection (both languages)
   * Useful for generating combined feeds or search indexes
   */
  eleventyConfig.addCollection("allPosts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
      .sort((a, b) => b.date - a.date);
  });
  
  /**
   * Featured Posts Collection
   * Displays posts marked with featured: true in frontmatter
   * Sorts by featuredOrder (if specified), then by date
   * Enforces min/max limits with warnings
   */
  eleventyConfig.addCollection("featuredPosts", function(collectionApi) {
    const MIN_FEATURED = 1;  // Minimum featured posts
    const MAX_FEATURED = 6;  // Maximum featured posts to display
    
    let featured = collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
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
      console.log(`ℹ️  Found ${featured.length} featured posts. Limiting to ${MAX_FEATURED}.`);
      featured = featured.slice(0, MAX_FEATURED);
    }
    
    // Warn if below minimum
    if (featured.length > 0 && featured.length < MIN_FEATURED) {
      console.warn(`⚠️  Only ${featured.length} featured post(s) found. Minimum recommended: ${MIN_FEATURED}`);
    }
    
    if (featured.length === 0) {
      console.warn(`⚠️  No featured posts found. Add 'featured: true' to post frontmatter.`);
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
        category: post.data.categoryKey || 'general',
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
