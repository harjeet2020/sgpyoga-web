# Event Structured Data

The events page tells search engines about upcoming events with [schema.org `Event`](https://schema.org/Event) JSON-LD. That's the data behind Google's event rich results (dates and venue shown right in the search listing). This data is **generated at build time**. Nobody writes or edits it by hand.

## How it works

```
Supabase (school_events)
   │  npm run build:content
   ▼
scripts/content/eventSchema.js ── renderEventSchema() ──┬─ English → inlined into events.html
                                                        │           at <!-- BUILD:events-schema -->
                                                        └─ Spanish → .build/jsonld/events.es.json
   │  npm run build:i18n
   ▼
build-i18n.js swaps the Spanish JSON into es/events.html
(any <script type="application/ld+json" data-jsonld="NAME"> with a matching .build/jsonld/NAME.es.json)
```

- **Which events:** only those still upcoming on the build day (end date today or later), soonest first. The site rebuilds whenever staff publish in the admin panel, so the list stays as fresh as the event cards. If no event is upcoming, the page ships with no event schema, and the build prints a warning.
- **Where the text comes from:** the same generated `eventContent` namespaces that the cards use, so the schema always matches what the page shows, in each page's language.
- **Free-text parsing:** `location` (for example `Hari Om, Mexico City`) is split into venue, city, region and country by `parseLocation`. `price` (for example `$23,000 MXN`) becomes an `Offer` via `parsePrice`. A price without a three-letter currency code produces no offer, because that would be invalid.
- **URLs** always use the canonical `https://sgpyoga.co`, never the redirecting `www.` host.

### Why build time, not the browser

This used to be `js/eventSchema.js`, which ran in the visitor's browser. It polled for up to 10 s until i18next and `eventsData.js` had loaded, then injected the JSON-LD. Google only sees injected data when it renders the page with JavaScript, a slower second pass it doesn't always do promptly. Everything the schema needs is known at build time, so it now ships in the HTML, where every crawler sees it on the first request. The old script has been deleted.

## Example output

```json
[
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "100-Hour Aerial Yoga Teacher Training",
    "description": "Aerial yoga is getting increasingly popular…",
    "url": "https://sgpyoga.co/events.html",
    "image": "https://sgpyoga.co/assets/photos/school/events/…-720.webp",
    "startDate": "2026-10-10",
    "endDate": "2026-12-12",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Hari Om",
      "address": { "@type": "PostalAddress", "addressLocality": "Mexico City", "addressRegion": "CDMX", "addressCountry": "MX" }
    },
    "organizer": { "@type": "Organization", "name": "SGP Yoga", "url": "https://sgpyoga.co" },
    "offers": { "@type": "Offer", "price": 23000, "priceCurrency": "MXN", "url": "https://sgpyoga.co/events.html", "availability": "https://schema.org/InStock" }
  }
]
```

## Adding or changing events

Do it in the platform admin panel (`platform.sgpyoga.co/admin/school`) and publish. The schema follows automatically. To get the richest listing:

- Write the location as `Venue, City` (for example `Hari Om, Mexico City`).
- Write the price with an amount and an ISO currency code (for example `$2,500 MXN`). An early-bird price in parentheses after it is ignored.

## Verifying

1. `npm run build`, then open `_site/events.html` and `_site/es/events.html` and search for `data-jsonld="events"`.
2. Paste the live URL into [Google's Rich Results Test](https://search.google.com/test/rich-results).
3. Search Console → Enhancements → Events shows what Google has picked up, with any errors.

## Other structured data on the site

| Page | Type | Where it's written |
|---|---|---|
| Home | `LocalBusiness` with `"@id": "https://sgpyoga.co/#business"` | Hand-written in `index.html`. The events' `organizer`, the course's `provider` and the blog's `publisher` reuse this `@id` so Google sees one business. Testimonials are not marked up as reviews: Google ignores reviews a business publishes about itself. |
| Aerial teacher training | `Course` (with `CourseInstance`, `Offer`) | Hand-written in `certifications/aerial-yoga-100.html` |
| Blog posts | `BlogPosting` | `blog/src/_includes/layouts/base.njk`, from each post's front matter |

The home page has no `FAQPage` markup on purpose. Since 2023 Google only shows FAQ rich results for government and health sites, so the old runtime script `js/faqSchema.js` was deleted.

## Resources

- [Google: Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event)
- [schema.org/Event](https://schema.org/Event)
- [Rich Results Test](https://search.google.com/test/rich-results)
