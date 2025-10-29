# SGP Yoga - SEO Implementation Checklist

**Document Version:** 1.0  
**Last Updated:** January 29, 2025  
**Website:** SGP Yoga (sgpyoga.com)

---

## Table of Contents

1. [Phase 1: Critical Fixes (Immediate)](#phase-1-critical-fixes-immediate)
2. [Phase 2: High Priority (Week 1-2)](#phase-2-high-priority-week-1-2)
3. [Phase 3: Enhancements (Month 1)](#phase-3-enhancements-month-1)
4. [Phase 4: Ongoing Optimization](#phase-4-ongoing-optimization)
5. [Technical Implementation Details](#technical-implementation-details)
6. [Testing & Verification](#testing--verification)
7. [Monitoring & Reporting](#monitoring--reporting)

---

## Phase 1: Critical Fixes (Immediate)

### ☐ 1.1 Create robots.txt

**Location:** `/robots.txt` (root directory)

**Implementation:**
```txt
# SGP Yoga - Robots.txt
# Last Updated: 2025-01-29

User-agent: *
Allow: /

# Disallow admin and system directories
Disallow: /blog/dist/admin/
Disallow: /js/
Disallow: /css/
Disallow: /.git/

# Sitemap location
Sitemap: https://www.sgpyoga.com/sitemap.xml

# Crawl-delay for polite bots
Crawl-delay: 1
```

**Verification:**
- [ ] File placed in root directory
- [ ] Accessible at: `https://www.sgpyoga.com/robots.txt`
- [ ] Test with [robots.txt Tester](https://www.google.com/webmasters/tools/robots-testing-tool)

---

### ☐ 1.2 Create sitemap.xml

**Location:** `/sitemap.xml` (root directory)

**Implementation:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Home Page -->
  <url>
    <loc>https://www.sgpyoga.com/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.sgpyoga.com/?lang=en"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.sgpyoga.com/?lang=es"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.com/"/>
    <lastmod>2025-01-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- About Page -->
  <url>
    <loc>https://www.sgpyoga.com/about.html</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.sgpyoga.com/about.html?lang=en"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.sgpyoga.com/about.html?lang=es"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.com/about.html"/>
    <lastmod>2025-01-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Classes Page -->
  <url>
    <loc>https://www.sgpyoga.com/classes.html</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.sgpyoga.com/classes.html?lang=en"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.sgpyoga.com/classes.html?lang=es"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.com/classes.html"/>
    <lastmod>2025-01-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Events Page -->
  <url>
    <loc>https://www.sgpyoga.com/events.html</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.sgpyoga.com/events.html?lang=en"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.sgpyoga.com/events.html?lang=es"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.com/events.html"/>
    <lastmod>2025-01-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog Page -->
  <url>
    <loc>https://www.sgpyoga.com/blog.html</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.sgpyoga.com/blog.html?lang=en"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.sgpyoga.com/blog.html?lang=es"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.com/blog.html"/>
    <lastmod>2025-01-29</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  
</urlset>
```

**Verification:**
- [ ] File placed in root directory
- [ ] Accessible at: `https://www.sgpyoga.com/sitemap.xml`
- [ ] Valid XML structure (test with [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html))
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools

**Maintenance:**
- [ ] Update `<lastmod>` dates when pages change
- [ ] Add new pages/blog posts as they're created

---

### ☐ 1.3 Add Open Graph Tags

**Pages to Update:** `index.html`, `about.html`, `classes.html`, `events.html`, `blog.html`

**Add to `<head>` section of each page:**

#### **index.html**
```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.sgpyoga.com/">
<meta property="og:title" content="SGP Yoga - Find Your Inner Peace in Mexico City">
<meta property="og:description" content="Transformative yoga classes, workshops, and retreats in CDMX. Experience Vinyasa, Hatha, Kundalini, and Aerial Yoga with expert teachers.">
<meta property="og:image" content="https://www.sgpyoga.com/assets/social/og-home.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="es_MX">
<meta property="og:site_name" content="SGP Yoga">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://www.sgpyoga.com/">
<meta name="twitter:title" content="SGP Yoga - Find Your Inner Peace in Mexico City">
<meta name="twitter:description" content="Transformative yoga classes, workshops, and retreats in CDMX. Experience Vinyasa, Hatha, Kundalini, and Aerial Yoga.">
<meta name="twitter:image" content="https://www.sgpyoga.com/assets/social/twitter-home.jpg">
```

#### **about.html**
```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.sgpyoga.com/about.html">
<meta property="og:title" content="About SGP Yoga - Expert Yoga Teachers in Mexico City">
<meta property="og:description" content="Meet our passionate yoga teachers and learn about our philosophy. Discover Kundalini, Vinyasa, Hatha, and Aerial Yoga in CDMX.">
<meta property="og:image" content="https://www.sgpyoga.com/assets/social/og-about.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="es_MX">
<meta property="og:site_name" content="SGP Yoga">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://www.sgpyoga.com/about.html">
<meta name="twitter:title" content="About SGP Yoga - Expert Yoga Teachers in Mexico City">
<meta name="twitter:description" content="Meet our passionate yoga teachers and learn about our philosophy. Discover Kundalini, Vinyasa, Hatha, and Aerial Yoga.">
<meta name="twitter:image" content="https://www.sgpyoga.com/assets/social/twitter-about.jpg">
```

#### **classes.html**
```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.sgpyoga.com/classes.html">
<meta property="og:title" content="Yoga Classes Schedule in Mexico City | SGP Yoga">
<meta property="og:description" content="Weekly yoga classes in CDMX. Join us for Aerial, Vinyasa, Hatha, and Kundalini Yoga. View our schedule and book your spot today!">
<meta property="og:image" content="https://www.sgpyoga.com/assets/social/og-classes.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="es_MX">
<meta property="og:site_name" content="SGP Yoga">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://www.sgpyoga.com/classes.html">
<meta name="twitter:title" content="Yoga Classes Schedule in Mexico City | SGP Yoga">
<meta name="twitter:description" content="Weekly yoga classes in CDMX. Join us for Aerial, Vinyasa, Hatha, and Kundalini Yoga. View our schedule!">
<meta name="twitter:image" content="https://www.sgpyoga.com/assets/social/twitter-classes.jpg">
```

#### **events.html**
```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.sgpyoga.com/events.html">
<meta property="og:title" content="Yoga Workshops & Retreats in Mexico City | SGP Yoga">
<meta property="og:description" content="Join transformative yoga workshops, retreats, and teacher training programs. Special events for deepening your practice in CDMX.">
<meta property="og:image" content="https://www.sgpyoga.com/assets/social/og-events.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="es_MX">
<meta property="og:site_name" content="SGP Yoga">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://www.sgpyoga.com/events.html">
<meta name="twitter:title" content="Yoga Workshops & Retreats in Mexico City | SGP Yoga">
<meta name="twitter:description" content="Join transformative yoga workshops, retreats, and teacher training programs in CDMX.">
<meta name="twitter:image" content="https://www.sgpyoga.com/assets/social/twitter-events.jpg">
```

**Required Assets:**
- [ ] Create `/assets/social/` directory
- [ ] Design OG images (1200x630px) for each page
- [ ] Design Twitter card images (1200x628px) for each page
- [ ] Images should include branding and key messaging
- [ ] Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

### ☐ 1.4 Add Canonical URLs & Hreflang Tags

**Add to `<head>` of ALL pages:**

#### **index.html**
```html
<link rel="canonical" href="https://www.sgpyoga.com/">
<link rel="alternate" hreflang="en" href="https://www.sgpyoga.com/?lang=en">
<link rel="alternate" hreflang="es" href="https://www.sgpyoga.com/?lang=es">
<link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.com/">
```

#### **about.html**
```html
<link rel="canonical" href="https://www.sgpyoga.com/about.html">
<link rel="alternate" hreflang="en" href="https://www.sgpyoga.com/about.html?lang=en">
<link rel="alternate" hreflang="es" href="https://www.sgpyoga.com/about.html?lang=es">
<link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.com/about.html">
```

#### **classes.html**
```html
<link rel="canonical" href="https://www.sgpyoga.com/classes.html">
<link rel="alternate" hreflang="en" href="https://www.sgpyoga.com/classes.html?lang=en">
<link rel="alternate" hreflang="es" href="https://www.sgpyoga.com/classes.html?lang=es">
<link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.com/classes.html">
```

#### **events.html**
```html
<link rel="canonical" href="https://www.sgpyoga.com/events.html">
<link rel="alternate" hreflang="en" href="https://www.sgpyoga.com/events.html?lang=en">
<link rel="alternate" hreflang="es" href="https://www.sgpyoga.com/events.html?lang=es">
<link rel="alternate" hreflang="x-default" href="https://www.sgpyoga.com/events.html">
```

**Verification:**
- [ ] Canonical URLs point to correct pages
- [ ] Hreflang tags match language switcher functionality
- [ ] Test with [Hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)

---

### ☐ 1.5 Add LocalBusiness Structured Data

**Add to `index.html` before closing `</head>` tag:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "YogaStudio",
  "name": "SGP Yoga",
  "alternateName": "Sat Gur Prasaad Yoga",
  "description": "Transformative yoga studio in Mexico City offering Vinyasa, Hatha, Kundalini, and Aerial Yoga classes, workshops, and teacher training programs.",
  "url": "https://www.sgpyoga.com",
  "logo": "https://www.sgpyoga.com/assets/logo/logoMain.png",
  "image": [
    "https://www.sgpyoga.com/assets/photos/inUse/home/hero-1280.webp",
    "https://www.sgpyoga.com/assets/photos/inUse/home/classes-1200.webp",
    "https://www.sgpyoga.com/assets/photos/inUse/home/events-1200.webp"
  ],
  "telephone": "+525539061305",
  "email": "satgurprasaadyoga@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tres Zapotes 128, Letran Valle",
    "addressLocality": "Benito Juárez",
    "addressRegion": "CDMX",
    "postalCode": "03650",
    "addressCountry": "MX"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "19.373788",
    "longitude": "-99.1517289"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "21:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "14:00"
    }
  ],
  "priceRange": "$$",
  "sameAs": [
    "https://www.facebook.com/profile.php?id=100035570391956",
    "https://www.instagram.com/satgurprasaad_yoga/",
    "https://www.youtube.com/@satgurprasaadyoga"
  ],
  "hasMap": "https://www.google.com/maps/place/Tres+Zapotes+128",
  "areaServed": {
    "@type": "City",
    "name": "Mexico City"
  },
  "knowsLanguage": ["en", "es"]
}
</script>
```

**Verification:**
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify business hours are correct
- [ ] Ensure coordinates match actual location

---

## Phase 2: High Priority (Week 1-2)

### ☐ 2.1 Optimize Title Tags

**Current vs. Optimized:**

| Page | Current | Optimized | Length |
|------|---------|-----------|--------|
| Home | SGP Yoga - Home | SGP Yoga - Yoga Classes in Mexico City \| CDMX Studio | 58 chars |
| About | SGP Yoga - About | About SGP Yoga - Kundalini, Vinyasa & Aerial Yoga CDMX | 57 chars |
| Classes | SGP Yoga - Classes | Yoga Classes Schedule Mexico City \| SGP Yoga CDMX | 53 chars |
| Events | SGP Yoga - Events | Yoga Workshops, Retreats & Training \| SGP Yoga CDMX | 56 chars |

**Implementation in i18n files:**

Edit `/locales/en/common.json`:
```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "classes": "Classes",
    "events": "Events",
    "blog": "Blog"
  },
  "pageTitles": {
    "home": "SGP Yoga - Yoga Classes in Mexico City | CDMX Studio",
    "about": "About SGP Yoga - Kundalini, Vinyasa & Aerial Yoga CDMX",
    "classes": "Yoga Classes Schedule Mexico City | SGP Yoga CDMX",
    "events": "Yoga Workshops, Retreats & Training | SGP Yoga CDMX",
    "blog": "Yoga Blog - Tips, Insights & News | SGP Yoga Mexico City"
  }
}
```

Edit `/locales/es/common.json`:
```json
{
  "nav": {
    "home": "Inicio",
    "about": "Nosotros",
    "classes": "Clases",
    "events": "Eventos",
    "blog": "Blog"
  },
  "pageTitles": {
    "home": "SGP Yoga - Clases de Yoga en CDMX | Estudio Mexico City",
    "about": "Sobre SGP Yoga - Kundalini, Vinyasa y Yoga Aéreo CDMX",
    "classes": "Horario Clases de Yoga CDMX | SGP Yoga Mexico City",
    "events": "Talleres, Retiros y Formación de Yoga | SGP Yoga CDMX",
    "blog": "Blog de Yoga - Consejos y Noticias | SGP Yoga CDMX"
  }
}
```

Update HTML:
```html
<title data-i18n="common:pageTitles.home">SGP Yoga - Yoga Classes in Mexico City | CDMX Studio</title>
```

**Verification:**
- [ ] All titles under 60 characters
- [ ] Include primary keyword
- [ ] Include location (CDMX/Mexico City)
- [ ] Brand name present
- [ ] Compelling and click-worthy

---

### ☐ 2.2 Enhance Meta Descriptions

**Optimized descriptions for each page:**

#### **index.html**
```html
<meta name="description" content="Discover inner peace at SGP Yoga in Mexico City. Expert-led Vinyasa, Hatha, Kundalini & Aerial Yoga classes in Roma & Condesa. Book your class today!" data-i18n="home:meta.description">
```

#### **about.html**
```html
<meta name="description" content="Meet SGP Yoga's passionate teachers in CDMX. Learn about our yoga philosophy and explore Kundalini, Vinyasa, Hatha & Aerial styles in our beautiful studios." data-i18n="about:meta.description">
```

#### **classes.html**
```html
<meta name="description" content="View our weekly yoga class schedule in Mexico City. Morning & evening sessions for all levels. Aerial, Vinyasa, Hatha & Kundalini. Reserve your spot now!" data-i18n="classes:meta.description">
```

#### **events.html**
```html
<meta name="description" content="Join transformative yoga workshops, multi-day retreats & certified teacher training in CDMX. Limited spots available. Register for upcoming events today!" data-i18n="events:meta.description">
```

**Best Practices:**
- [ ] 150-160 characters optimal
- [ ] Include call-to-action
- [ ] Natural keyword inclusion
- [ ] Unique for each page
- [ ] Compelling and benefit-focused

---

### ☐ 2.3 Add Event Structured Data

**Add to `events.html` in `<head>` section:**

```html
<!-- This should be dynamically generated for each event -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Event",
      "name": "Kundalini Awakening Workshop",
      "description": "Deep dive into Kundalini yoga practices with breath work, meditation, and kriyas for spiritual awakening.",
      "image": "https://www.sgpyoga.com/assets/photos/inUse/events/kundalini-workshop.webp",
      "startDate": "2025-02-15T10:00:00-06:00",
      "endDate": "2025-02-15T16:00:00-06:00",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": "SGP Yoga Roma Studio",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Tres Zapotes 128",
          "addressLocality": "Mexico City",
          "addressRegion": "CDMX",
          "postalCode": "03650",
          "addressCountry": "MX"
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": "SGP Yoga",
        "url": "https://www.sgpyoga.com"
      },
      "performer": {
        "@type": "Person",
        "name": "Harjeet Singh"
      },
      "offers": {
        "@type": "Offer",
        "price": "800",
        "priceCurrency": "MXN",
        "availability": "https://schema.org/InStock",
        "url": "https://www.sgpyoga.com/events.html",
        "validFrom": "2025-01-15T00:00:00-06:00"
      }
    }
  ]
}
</script>
```

**Implementation Notes:**
- [ ] Generate schema dynamically from `eventsData.js`
- [ ] Update dates in ISO 8601 format with timezone
- [ ] Use actual event data
- [ ] Include all upcoming events in ItemList
- [ ] Test with [Event Rich Results Test](https://search.google.com/test/rich-results)

---

### ☐ 2.4 Add Review/Testimonial Structured Data

**Add to `index.html` before closing `</body>` tag:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Review",
      "itemReviewed": {
        "@type": "YogaStudio",
        "name": "SGP Yoga",
        "url": "https://www.sgpyoga.com"
      },
      "author": {
        "@type": "Person",
        "name": "Ramzi Anh Do"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "I had the pleasure of meeting Harjeet through a mutual acquaintance during his stay in Cambodia. His expertise and passion for yoga transformed my practice completely."
    },
    {
      "@type": "Review",
      "itemReviewed": {
        "@type": "YogaStudio",
        "name": "SGP Yoga"
      },
      "author": {
        "@type": "Person",
        "name": "Lena Tiedmann"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "I tried out many different yoga styles and teachers. Harjeet's approach to Kundalini yoga is exceptional and deeply transformative."
    }
  ]
}
</script>
```

**Verification:**
- [ ] Add all 8 testimonials from homepage
- [ ] Test with Rich Results Test
- [ ] Consider adding aggregate rating

---

### ☐ 2.5 Create Social Sharing Images

**Required Images:**

| Image | Size | Location | Purpose |
|-------|------|----------|---------|
| OG Home | 1200x630px | `/assets/social/og-home.jpg` | Facebook/LinkedIn |
| OG About | 1200x630px | `/assets/social/og-about.jpg` | Facebook/LinkedIn |
| OG Classes | 1200x630px | `/assets/social/og-classes.jpg` | Facebook/LinkedIn |
| OG Events | 1200x630px | `/assets/social/og-events.jpg` | Facebook/LinkedIn |
| Twitter Home | 1200x628px | `/assets/social/twitter-home.jpg` | Twitter |
| Twitter About | 1200x628px | `/assets/social/twitter-about.jpg` | Twitter |
| Twitter Classes | 1200x628px | `/assets/social/twitter-classes.jpg` | Twitter |
| Twitter Events | 1200x628px | `/assets/social/twitter-events.jpg` | Twitter |

**Design Guidelines:**
- [ ] Include SGP Yoga logo
- [ ] Use brand colors (#1f2121, #ffeddf, #40689a, #a06789)
- [ ] Add text overlay with page title
- [ ] Use high-quality images
- [ ] Ensure text is readable at small sizes
- [ ] Safe zone: 40px margin from edges
- [ ] Test on mobile previews

**Testing:**
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## Phase 3: Enhancements (Month 1)

### ☐ 3.1 Performance Optimization

**Add to `<head>` of all pages:**

```html
<!-- Preconnect to external resources -->
<link rel="preconnect" href="https://unpkg.com" crossorigin>
<link rel="dns-prefetch" href="https://unpkg.com">

<!-- Preload critical assets -->
<link rel="preload" href="css/main.css" as="style">
<link rel="preload" href="css/navbar.css" as="style">
<link rel="preload" href="assets/logo/logoMain.png" as="image">
<link rel="preload" href="https://unpkg.com/lucide@latest/dist/umd/lucide.js" as="script">

<!-- Prefetch likely next pages -->
<link rel="prefetch" href="classes.html">
<link rel="prefetch" href="events.html">
```

**Verification:**
- [ ] Test with [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Target: >90 mobile score, >95 desktop score
- [ ] Lighthouse audit passes

---

### ☐ 3.2 Improve Image Alt Text

**Current vs. Enhanced Alt Text:**

| Current | Enhanced |
|---------|----------|
| `alt="Yoga Classes"` | `alt="Students practicing Vinyasa Flow yoga at SGP Yoga studio in Roma Norte, Mexico City"` |
| `alt="Aerial Yoga"` | `alt="Aerial yoga hammock class with silk fabrics at SGP Yoga CDMX"` |
| `alt="Teacher Name"` | `alt="Harjeet Singh, certified Kundalini yoga teacher at SGP Yoga Mexico City"` |

**Best Practices:**
- [ ] Describe what's in the image
- [ ] Include relevant keywords naturally
- [ ] Mention location when relevant
- [ ] Keep under 125 characters
- [ ] Don't start with "Image of" or "Picture of"

**Pages to update:**
- [ ] index.html (hero, classes, events sections)
- [ ] about.html (yoga styles, teachers, spaces)
- [ ] classes.html (teacher photos)
- [ ] events.html (event type tiles)

---

### ☐ 3.3 Add FAQ Section

**Create new section in `index.html` or dedicated FAQ page:**

```html
<section class="faq-section">
    <div class="container">
        <h2>Frequently Asked Questions</h2>
        
        <div class="faq-item">
            <h3>What yoga styles do you offer in Mexico City?</h3>
            <p>We offer Vinyasa, Hatha, Kundalini, and Aerial Yoga at our studios in Roma and Condesa neighborhoods of CDMX.</p>
        </div>
        
        <div class="faq-item">
            <h3>Do I need experience to join yoga classes?</h3>
            <p>No! Our classes welcome all levels, from complete beginners to advanced practitioners. Our teachers provide modifications for every pose.</p>
        </div>
        
        <div class="faq-item">
            <h3>Where are your yoga studios located in CDMX?</h3>
            <p>We have two locations: our main studio in Roma Norte and a smaller space in Condesa. Both are easily accessible by metro.</p>
        </div>
        
        <div class="faq-item">
            <h3>How much do yoga classes cost?</h3>
            <p>Drop-in classes are 200 MXN. We offer class packages and monthly memberships with better rates. Contact us for current pricing.</p>
        </div>
        
        <div class="faq-item">
            <h3>Do you offer yoga teacher training in Mexico City?</h3>
            <p>Yes! We run 200-hour and 300-hour yoga teacher training programs throughout the year. Check our Events page for upcoming dates.</p>
        </div>
    </div>
</section>
```

**Add FAQ Schema:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What yoga styles do you offer in Mexico City?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer Vinyasa, Hatha, Kundalini, and Aerial Yoga at our studios in Roma and Condesa neighborhoods of CDMX."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need experience to join yoga classes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No! Our classes welcome all levels, from complete beginners to advanced practitioners. Our teachers provide modifications for every pose."
      }
    },
    {
      "@type": "Question",
      "name": "Where are your yoga studios located in CDMX?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We have two locations: our main studio in Roma Norte and a smaller space in Condesa. Both are easily accessible by metro."
      }
    },
    {
      "@type": "Question",
      "name": "How much do yoga classes cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Drop-in classes are 200 MXN. We offer class packages and monthly memberships with better rates. Contact us for current pricing."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer yoga teacher training in Mexico City?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We run 200-hour and 300-hour yoga teacher training programs throughout the year. Check our Events page for upcoming dates."
      }
    }
  ]
}
</script>
```

**Benefits:**
- [ ] Targets long-tail keywords
- [ ] Eligible for featured snippets
- [ ] Improves user experience
- [ ] Reduces support inquiries

---

### ☐ 3.4 Add Breadcrumb Navigation

**Implementation for About page:**

```html
<nav aria-label="Breadcrumb" class="breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li aria-current="page">About</li>
    </ol>
</nav>
```

**Add Breadcrumb Schema:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.sgpyoga.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "About",
      "item": "https://www.sgpyoga.com/about.html"
    }
  ]
}
</script>
```

**Pages to implement:**
- [ ] about.html
- [ ] classes.html
- [ ] events.html
- [ ] blog pages (when applicable)

---

### ☐ 3.5 Add Business Hours to Structured Data

**Enhance LocalBusiness schema in `index.html`:**

```json
"openingHoursSpecification": [
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": "Monday",
    "opens": "19:00",
    "closes": "20:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": "Tuesday",
    "opens": "09:00",
    "closes": "10:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": "Wednesday",
    "opens": "19:00",
    "closes": "20:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": "Friday",
    "opens": "08:00",
    "closes": "09:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": "Saturday",
    "opens": "10:00",
    "closes": "11:00"
  }
]
```

**Note:** Update based on actual class schedule from classes.html

---

## Phase 4: Ongoing Optimization

### ☐ 4.1 Content Creation Strategy

**Blog Topics (Keyword Research):**
1. "Best yoga studios in Mexico City" (Local SEO)
2. "Kundalini yoga benefits for beginners" (Educational)
3. "What to expect in your first aerial yoga class" (Conversion)
4. "Yoga teacher training in CDMX: Complete guide" (High-value)
5. "Morning yoga routine for busy professionals" (Lifestyle)
6. "Difference between Vinyasa and Hatha yoga" (Comparison)
7. "Yoga retreats near Mexico City" (Event promotion)
8. "Best neighborhoods for yoga in CDMX" (Local)

**Publishing Schedule:**
- [ ] 2 blog posts per month minimum
- [ ] Focus on local + educational content
- [ ] Include internal links to relevant pages
- [ ] Add schema markup to blog posts

---

### ☐ 4.2 Local SEO Optimization

**Google Business Profile:**
- [ ] Claim and verify business
- [ ] Complete all sections (hours, services, attributes)
- [ ] Add photos (minimum 10 high-quality images)
- [ ] Post weekly updates
- [ ] Respond to all reviews within 48 hours
- [ ] Add Q&A section
- [ ] Enable messaging
- [ ] Add products/services
- [ ] Create special offers

**Local Citations:**
- [ ] [Yelp](https://www.yelp.com/)
- [ ] [TripAdvisor](https://www.tripadvisor.com/)
- [ ] [Yellow Pages Mexico](https://www.seccionamarilla.com.mx/)
- [ ] [Foursquare](https://foursquare.com/)
- [ ] Local CDMX directories
- [ ] Yoga-specific directories (YogaFinder, Mindbody, ClassPass)

**Ensure NAP Consistency:**
- Name: SGP Yoga (Sat Gur Prasaad Yoga)
- Address: Tres Zapotes 128, Letran Valle, Benito Juárez, CDMX 03650, Mexico
- Phone: +52 55 3906 1305

---

### ☐ 4.3 Review Management

**Platforms to Monitor:**
- [ ] Google Business Profile
- [ ] Facebook
- [ ] Yelp
- [ ] TripAdvisor
- [ ] ClassPass (if applicable)

**Response Templates:**

**Positive Review:**
```
Hi [Name]! 🙏

Thank you so much for your kind words! We're thrilled that you enjoyed [specific class/teacher mentioned]. Our team works hard to create a welcoming space for all practitioners.

We'd love to see you on the mat again soon!

Sat Nam,
The SGP Yoga Team
```

**Negative Review:**
```
Hi [Name],

Thank you for sharing your feedback. We're sorry to hear that [issue]. This isn't the experience we want for our students.

We'd love to make this right. Please reach out to us at satgurprasaadyoga@gmail.com or call +52 55 3906 1305 so we can discuss this further.

With gratitude,
The SGP Yoga Team
```

**Review Request Email Template:**
```
Subject: How was your experience at SGP Yoga?

Hi [Name],

Thank you for joining us at SGP Yoga! We hope you enjoyed [class name] with [teacher].

Your feedback means everything to us. Would you mind taking a moment to share your experience?

[Google Review Link]

Namaste,
The SGP Yoga Team

P.S. We'd love to hear your suggestions for improvement too!
```

---

### ☐ 4.4 Link Building Strategy

**Opportunities:**

1. **Local Partnerships:**
   - [ ] Healthy cafes/restaurants in Roma/Condesa
   - [ ] Wellness centers in CDMX
   - [ ] Meditation studios
   - [ ] Fitness centers
   - [ ] Eco-friendly businesses

2. **Guest Posting:**
   - [ ] Local CDMX lifestyle blogs
   - [ ] Yoga & wellness publications
   - [ ] Travel blogs focused on Mexico

3. **Directory Submissions:**
   - [ ] YogaFinder
   - [ ] Mindbody Online
   - [ ] CDMX tourism websites
   - [ ] Expat community sites

4. **PR & Media:**
   - [ ] Local newspapers (lifestyle sections)
   - [ ] CDMX events calendars
   - [ ] Wellness podcasts
   - [ ] YouTube collaborations

---

### ☐ 4.5 Social Media SEO Integration

**Optimization Checklist:**

**Instagram (@satgurprasaad_yoga):**
- [ ] Optimize bio with keywords
- [ ] Add website link
- [ ] Use local hashtags (#YogaCDMX, #YogaMexicoCity, #YogaRoma)
- [ ] Tag location in posts
- [ ] Create highlights for classes, events, testimonials
- [ ] Regular Stories with location stickers

**Facebook:**
- [ ] Complete About section
- [ ] Add services
- [ ] Enable reviews
- [ ] Post events
- [ ] Share blog posts
- [ ] Respond to messages within 1 hour

**YouTube (@satgurprasaadyoga):**
- [ ] Optimize channel description
- [ ] Add keywords to video titles
- [ ] Write detailed video descriptions with links
- [ ] Create playlists by yoga style
- [ ] Add location to videos
- [ ] Include transcripts/captions

---

## Testing & Verification

### ☐ Technical SEO Tests

**Tools:**
1. [ ] [Google Search Console](https://search.google.com/search-console)
   - Submit sitemap
   - Check coverage report
   - Monitor Core Web Vitals
   - Review mobile usability

2. [ ] [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Test all pages with structured data
   - Verify no errors

3. [ ] [PageSpeed Insights](https://pagespeed.web.dev/)
   - Test all main pages
   - Target: 90+ mobile, 95+ desktop

4. [ ] [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
   - Verify all pages pass

5. [ ] [Lighthouse Audit](https://developer.chrome.com/docs/lighthouse/)
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 100

---

### ☐ On-Page SEO Checklist

**For Each Page:**
- [ ] Unique H1 tag present
- [ ] Proper heading hierarchy (H1 > H2 > H3)
- [ ] Title tag optimized (50-60 chars)
- [ ] Meta description compelling (150-160 chars)
- [ ] Canonical URL set
- [ ] Hreflang tags implemented
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Images have descriptive alt text
- [ ] Internal links present
- [ ] External links open in new tab (rel="noopener")
- [ ] Loading speed under 3 seconds
- [ ] Mobile responsive
- [ ] HTTPS enabled

---

### ☐ Content Quality Checklist

**For Each Page:**
- [ ] Unique content (no duplication)
- [ ] Minimum 300 words (more for blog posts)
- [ ] Keywords used naturally
- [ ] Readability score: Grade 8-10
- [ ] No spelling/grammar errors
- [ ] Clear call-to-action
- [ ] Value provided to users
- [ ] Updated regularly

---

## Monitoring & Reporting

### ☐ Setup Analytics

**Google Analytics 4:**
```html
<!-- Add to <head> of all pages -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Events to Track:**
- [ ] Page views
- [ ] Button clicks (WhatsApp, Email, Register)
- [ ] Form submissions
- [ ] Scroll depth
- [ ] Outbound links (social media)
- [ ] File downloads (if any)

---

### ☐ Monthly SEO Report Template

**Track These Metrics:**

1. **Traffic:**
   - Total organic sessions
   - New vs. returning users
   - Top landing pages
   - Bounce rate
   - Average session duration

2. **Rankings:**
   - "yoga Mexico City" (target: Top 5)
   - "yoga CDMX" (target: Top 5)
   - "Kundalini yoga Mexico City" (target: Top 3)
   - "aerial yoga CDMX" (target: Top 3)
   - "yoga classes Roma Norte" (target: Top 3)

3. **Conversions:**
   - Contact form submissions
   - WhatsApp clicks
   - Email clicks
   - Phone calls
   - Event registrations

4. **Technical:**
   - Core Web Vitals scores
   - Index coverage (errors)
   - Mobile usability issues
   - Site speed metrics

5. **Backlinks:**
   - Total referring domains
   - New backlinks this month
   - Lost backlinks
   - Domain authority

---

### ☐ SEO Tools Setup

**Essential Tools:**

1. **Google Search Console** (Free)
   - [ ] Verify property
   - [ ] Submit sitemap
   - [ ] Monitor performance

2. **Google Analytics 4** (Free)
   - [ ] Set up account
   - [ ] Install tracking code
   - [ ] Configure events

3. **Google Business Profile** (Free)
   - [ ] Claim listing
   - [ ] Complete profile
   - [ ] Regular posts

4. **Bing Webmaster Tools** (Free)
   - [ ] Verify site
   - [ ] Submit sitemap

**Optional (Paid):**
- [ ] SEMrush / Ahrefs (keyword research, competitor analysis)
- [ ] Screaming Frog (technical audits)
- [ ] Rank Tracker (daily ranking monitoring)

---

## Quick Reference: Priority Actions

### Week 1
1. ✅ Create robots.txt
2. ✅ Create sitemap.xml
3. ✅ Add Open Graph tags
4. ✅ Add canonical URLs
5. ✅ Add LocalBusiness schema

### Week 2
1. ✅ Optimize title tags
2. ✅ Enhance meta descriptions
3. ✅ Create social sharing images
4. ✅ Add Event schema
5. ✅ Add Review schema

### Week 3-4
1. ✅ Improve image alt text
2. ✅ Add FAQ section with schema
3. ✅ Implement breadcrumbs
4. ✅ Add performance optimizations
5. ✅ Set up Google Analytics

### Ongoing
1. ✅ Publish blog posts (2/month)
2. ✅ Collect and respond to reviews
3. ✅ Update events regularly
4. ✅ Monitor rankings
5. ✅ Build backlinks

---

## Success Metrics

**3 Months:**
- [ ] Indexed in Google (all pages)
- [ ] Appearing in local pack for "yoga [neighborhood]"
- [ ] 10+ organic keywords ranking in top 50
- [ ] 100+ organic sessions/month

**6 Months:**
- [ ] 3-5 keywords in top 10
- [ ] Featured snippet for at least 1 query
- [ ] 500+ organic sessions/month
- [ ] 10+ organic conversions/month

**12 Months:**
- [ ] 10+ keywords in top 5
- [ ] Rich snippets displaying in search
- [ ] 1,000+ organic sessions/month
- [ ] 50+ organic conversions/month
- [ ] 25+ quality backlinks

---

## Resources

**Documentation:**
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Yoga Studio](https://schema.org/YogaStudio)
- [Open Graph Protocol](https://ogp.me/)
- [Hreflang Guide](https://developers.google.com/search/docs/advanced/crawling/localized-versions)

**Testing Tools:**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

**Learning:**
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Search Engine Journal](https://www.searchenginejournal.com/)

---

## Notes

- Update this checklist as items are completed
- Track completion dates for each phase
- Document any issues or deviations
- Review and update quarterly
- Prioritize based on business goals

**Last Review:** January 29, 2025  
**Next Review:** April 29, 2025

---

**Questions or Issues?**  
Document them in `/docs/SEO-ISSUES.md` for tracking and resolution.