#!/usr/bin/env node

/**
 * SGP Yoga - SEO Tags Validator
 * Validates canonical and hreflang tags across all HTML pages
 * 
 * Usage:
 *   node scripts/validate-seo-tags.js          - Run validation (concise output)
 *   node scripts/validate-seo-tags.js -v       - Run with verbose output
 *   node scripts/validate-seo-tags.js --verbose - Run with verbose output (shows expected vs actual for all checks)
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose') || args.includes('-v');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
};

// Expected page configurations
const pages = [
    // Main site English pages
    { file: 'index.html', canonical: 'https://sgpyoga.co/index.html', lang: 'en', alternate: 'https://sgpyoga.co/es/index.html' },
    { file: 'about.html', canonical: 'https://sgpyoga.co/about.html', lang: 'en', alternate: 'https://sgpyoga.co/es/about.html' },
    { file: 'classes.html', canonical: 'https://sgpyoga.co/classes.html', lang: 'en', alternate: 'https://sgpyoga.co/es/classes.html' },
    { file: 'events.html', canonical: 'https://sgpyoga.co/events.html', lang: 'en', alternate: 'https://sgpyoga.co/es/events.html' },
    
    // Main site Spanish pages (self-referencing canonical)
    { file: 'es/index.html', canonical: 'https://sgpyoga.co/es/index.html', lang: 'es', alternate: 'https://sgpyoga.co/es/index.html' },
    { file: 'es/about.html', canonical: 'https://sgpyoga.co/es/about.html', lang: 'es', alternate: 'https://sgpyoga.co/es/about.html' },
    { file: 'es/classes.html', canonical: 'https://sgpyoga.co/es/classes.html', lang: 'es', alternate: 'https://sgpyoga.co/es/classes.html' },
    { file: 'es/events.html', canonical: 'https://sgpyoga.co/es/events.html', lang: 'es', alternate: 'https://sgpyoga.co/es/events.html' },
    
    // Blog English pages
    { file: 'blog/dist/index.html', canonical: 'https://sgpyoga.co/blog/dist/', lang: 'en', alternate: 'https://sgpyoga.co/blog/dist/es/' },
    
    // Blog Spanish pages (self-referencing canonical)
    { file: 'blog/dist/es/index.html', canonical: 'https://sgpyoga.co/blog/dist/es/', lang: 'es', alternate: 'https://sgpyoga.co/blog/dist/es/' },
];

/**
 * Extract tag value from HTML content
 */
function extractTag(html, tagPattern) {
    const match = html.match(tagPattern);
    return match ? match[1] : null;
}

/**
 * Extract all hreflang tags
 */
function extractHreflangTags(html) {
    const pattern = /<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*>/g;
    const tags = [];
    let match;
    
    while ((match = pattern.exec(html)) !== null) {
        tags.push({ lang: match[1], href: match[2] });
    }
    
    return tags;
}

/**
 * Validate a single page
 */
function validatePage(pageConfig) {
    const filePath = path.join(__dirname, '..', pageConfig.file);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return {
            success: false,
            errors: [`File not found: ${pageConfig.file}`],
            details: []
        };
    }
    
    const html = fs.readFileSync(filePath, 'utf-8');
    const errors = [];
    const details = [];
    
    // 1. Check canonical tag
    const canonicalPattern = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/;
    const canonical = extractTag(html, canonicalPattern);
    
    details.push({
        check: 'Canonical',
        expected: pageConfig.canonical,
        actual: canonical || 'MISSING',
        pass: canonical === pageConfig.canonical
    });
    
    if (!canonical) {
        errors.push('Missing canonical tag');
    } else if (canonical !== pageConfig.canonical) {
        errors.push(`Incorrect canonical: expected "${pageConfig.canonical}", got "${canonical}"`);
    }
    
    // 2. Check HTML lang attribute
    const langPattern = /<html[^>]*lang=["']([^"']+)["'][^>]*>/;
    const htmlLang = extractTag(html, langPattern);
    
    details.push({
        check: 'HTML lang',
        expected: pageConfig.lang,
        actual: htmlLang || 'MISSING',
        pass: htmlLang === pageConfig.lang
    });
    
    if (!htmlLang) {
        errors.push('Missing lang attribute on <html>');
    } else if (htmlLang !== pageConfig.lang) {
        errors.push(`Incorrect lang attribute: expected "${pageConfig.lang}", got "${htmlLang}"`);
    }
    
    // 3. Check hreflang tags
    const hreflangTags = extractHreflangTags(html);
    
    const enTag = hreflangTags.find(tag => tag.lang === 'en');
    const esTag = hreflangTags.find(tag => tag.lang === 'es');
    const defaultTag = hreflangTags.find(tag => tag.lang === 'x-default');
    
    details.push({
        check: 'Hreflang en',
        expected: 'present',
        actual: enTag ? enTag.href : 'MISSING',
        pass: !!enTag
    });
    
    details.push({
        check: 'Hreflang es',
        expected: pageConfig.alternate,
        actual: esTag ? esTag.href : 'MISSING',
        pass: esTag && esTag.href === pageConfig.alternate
    });
    
    details.push({
        check: 'Hreflang x-default',
        expected: 'present',
        actual: defaultTag ? defaultTag.href : 'MISSING',
        pass: !!defaultTag
    });
    
    if (hreflangTags.length === 0) {
        errors.push('Missing hreflang tags');
    } else {
        // Check for English hreflang
        if (!enTag) {
            errors.push('Missing hreflang="en" tag');
        }
        
        // Check for Spanish hreflang
        if (!esTag) {
            errors.push('Missing hreflang="es" tag');
        } else if (esTag.href !== pageConfig.alternate) {
            errors.push(`Incorrect es hreflang href: expected "${pageConfig.alternate}", got "${esTag.href}"`);
        }
        
        // Check for x-default
        if (!defaultTag) {
            errors.push('Missing hreflang="x-default" tag');
        }
    }
    
    // 4. Check og:url
    const ogUrlPattern = /<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*>/;
    const ogUrl = extractTag(html, ogUrlPattern);
    
    details.push({
        check: 'OG URL',
        expected: 'starts with https://sgpyoga.co',
        actual: ogUrl || 'MISSING',
        pass: ogUrl && ogUrl.startsWith('https://sgpyoga.co')
    });
    
    if (!ogUrl) {
        errors.push('Missing og:url meta tag');
    } else if (!ogUrl.startsWith('https://sgpyoga.co')) {
        errors.push(`Incorrect og:url domain: "${ogUrl}"`);
    }
    
    // 5. Check twitter:url
    const twitterUrlPattern = /<meta[^>]*name=["']twitter:url["'][^>]*content=["']([^"']+)["'][^>]*>/;
    const twitterUrl = extractTag(html, twitterUrlPattern);
    
    details.push({
        check: 'Twitter URL',
        expected: 'starts with https://sgpyoga.co',
        actual: twitterUrl || 'MISSING',
        pass: twitterUrl && twitterUrl.startsWith('https://sgpyoga.co')
    });
    
    if (!twitterUrl) {
        errors.push('Missing twitter:url meta tag');
    } else if (!twitterUrl.startsWith('https://sgpyoga.co')) {
        errors.push(`Incorrect twitter:url domain: "${twitterUrl}"`);
    }
    
    // 6. Check for www in any URL (should not exist)
    const hasWww = html.includes('www.sgpyoga.co');
    
    details.push({
        check: 'No WWW',
        expected: 'no www.sgpyoga.co',
        actual: hasWww ? 'FOUND www.sgpyoga.co' : 'clean',
        pass: !hasWww
    });
    
    if (hasWww) {
        errors.push('Found "www.sgpyoga.co" - should be "sgpyoga.co" (no www)');
    }
    
    return {
        success: errors.length === 0,
        errors,
        details
    };
}

/**
 * Validate all blog posts
 */
function validateBlogPosts() {
    const blogPostsDir = path.join(__dirname, '..', 'blog/dist/posts');
    const errors = [];
    let validatedCount = 0;
    
    if (!fs.existsSync(blogPostsDir)) {
        return { success: false, errors: ['Blog posts directory not found'], count: 0 };
    }
    
    // Get all English posts
    const enPostsDir = path.join(blogPostsDir, 'en');
    const esPostsDir = path.join(blogPostsDir, 'es');
    
    if (fs.existsSync(enPostsDir)) {
        const enPosts = fs.readdirSync(enPostsDir);
        
        for (const postSlug of enPosts) {
            const postFile = path.join(enPostsDir, postSlug, 'index.html');
            
            if (fs.existsSync(postFile)) {
                const html = fs.readFileSync(postFile, 'utf-8');
                validatedCount++;
                
                // Check canonical includes /blog/dist/
                const canonicalPattern = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/;
                const canonical = extractTag(html, canonicalPattern);
                
                if (!canonical) {
                    errors.push(`[${postSlug}] Missing canonical tag`);
                } else if (!canonical.includes('/blog/dist/')) {
                    errors.push(`[${postSlug}] Canonical missing /blog/dist/ prefix: ${canonical}`);
                }
                
                // Check for www
                if (html.includes('www.sgpyoga.co')) {
                    errors.push(`[${postSlug}] Found "www.sgpyoga.co" - should be "sgpyoga.co"`);
                }
            }
        }
    }
    
    if (fs.existsSync(esPostsDir)) {
        const esPosts = fs.readdirSync(esPostsDir);
        
        for (const postSlug of esPosts) {
            const postFile = path.join(esPostsDir, postSlug, 'index.html');
            
            if (fs.existsSync(postFile)) {
                const html = fs.readFileSync(postFile, 'utf-8');
                validatedCount++;
                
                // Spanish posts should have self-referencing canonical
                const canonicalPattern = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/;
                const canonical = extractTag(html, canonicalPattern);
                
                if (!canonical) {
                    errors.push(`[${postSlug} ES] Missing canonical tag`);
                } else if (!canonical.includes('/posts/es/')) {
                    errors.push(`[${postSlug} ES] Canonical should be self-referencing (/posts/es/): ${canonical}`);
                }
                
                // Check for www
                if (html.includes('www.sgpyoga.co')) {
                    errors.push(`[${postSlug} ES] Found "www.sgpyoga.co" - should be "sgpyoga.co"`);
                }
            }
        }
    }
    
    return {
        success: errors.length === 0,
        errors,
        count: validatedCount
    };
}

/**
 * Main validation function
 */
function main() {
    console.log(`\n${colors.cyan}🔍 SGP Yoga - SEO Tags Validator${colors.reset}\n`);
    console.log('━'.repeat(60));
    
    let totalErrors = 0;
    let totalPages = 0;
    
    // Validate main pages
    console.log(`\n${colors.blue}📄 Validating main pages...${colors.reset}\n`);
    
    for (const pageConfig of pages) {
        totalPages++;
        const result = validatePage(pageConfig);
        
        if (result.success) {
            console.log(`${colors.green}✓${colors.reset} ${pageConfig.file}`);
        } else {
            console.log(`${colors.red}✗${colors.reset} ${pageConfig.file}`);
            result.errors.forEach(error => {
                console.log(`  ${colors.red}→${colors.reset} ${error}`);
                totalErrors++;
            });
        }
        
        // Verbose mode: show all checks
        if (isVerbose && result.details) {
            console.log(`  ${colors.gray}Details:${colors.reset}`);
            result.details.forEach(detail => {
                const status = detail.pass ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
                console.log(`    ${status} ${detail.check}`);
                console.log(`      ${colors.gray}Expected:${colors.reset} ${detail.expected}`);
                console.log(`      ${colors.gray}Actual:${colors.reset}   ${detail.actual}`);
            });
        }
    }
    
    // Validate blog posts
    console.log(`\n${colors.blue}📝 Validating blog posts...${colors.reset}\n`);
    
    const blogResult = validateBlogPosts();
    totalPages += blogResult.count;
    
    if (blogResult.success) {
        console.log(`${colors.green}✓${colors.reset} All ${blogResult.count} blog posts validated successfully`);
    } else {
        console.log(`${colors.red}✗${colors.reset} Found errors in blog posts:`);
        blogResult.errors.forEach(error => {
            console.log(`  ${colors.red}→${colors.reset} ${error}`);
            totalErrors++;
        });
    }
    
    // Summary
    console.log('\n' + '━'.repeat(60));
    console.log(`\n${colors.cyan}📊 Summary${colors.reset}\n`);
    console.log(`Total pages validated: ${totalPages}`);
    console.log(`Total errors found: ${totalErrors}\n`);
    
    if (totalErrors === 0) {
        console.log(`${colors.green}🎉 All SEO tags are correct!${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`${colors.red}❌ Found ${totalErrors} error(s). Please fix them.${colors.reset}\n`);
        process.exit(1);
    }
}

// Run validation
main();
