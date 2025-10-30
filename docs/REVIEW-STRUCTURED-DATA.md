# Review/Testimonial Structured Data

**Document Version:** 1.0  
**Last Updated:** January 30, 2025  
**Implemented:** SEO Checklist Step 2.4

---

## Overview

Review structured data is implemented on the homepage (`index.html`) to showcase testimonials from students. This helps with SEO by displaying aggregate ratings and validating social proof for search engines.

### Current Status

- **Location:** `index.html` (before closing `</body>` tag)
- **Format:** Static JSON-LD
- **Reviews:** 8 testimonials
- **Rating:** 5.0/5 (all reviews are 5-star)
- **Type:** LocalBusiness with review array

---

## What It Does

### SEO Benefits:
1. **Aggregate Rating Display** - Shows "★★★★★ 5.0" in search results
2. **Review Count** - Displays "Based on 8 reviews"
3. **Trust Signals** - Validates your testimonials for Google
4. **Local SEO** - Helps with local search rankings

### What It DOESN'T Do:
- Individual reviews won't appear in search results
- This is normal - Google shows aggregate ratings, not full review text
- Focus on getting Google Business Profile reviews for visible reviews in search

---

## Current Reviews

All 8 testimonials from your homepage are included:

1. **Ramzi Anh Do** (United States) - 5★
2. **Agnieszka Malek** (Poland) - 5★
3. **Marcin Topolski** (Poland) - 5★
4. **Lena Tiedmann** (Germany) - 5★
5. **Svetlana Epifanova** (Russia) - 5★
6. **Rosario Hernández Nieves** (Venezuela) - 5★
7. **Rafał Duran** (Poland) - 5★
8. **Julián Alonso** (Spain) - 5★

---

## How to Add a New Testimonial

When you collect a new testimonial and add it to your website:

### Step 1: Add to Translation Files

Add the testimonial to `locales/en/testimonials.json` (and Spanish version):

```json
"testimonial9": {
    "name": "Student Name",
    "country": "Country",
    "profession": "Profession",
    "text": "Full testimonial text here..."
}
```

### Step 2: Add to HTML Slideshow

Add the testimonial slide to `index.html` testimonials section (follow existing pattern).

### Step 3: Update Structured Data

Open `index.html` and find the `<!-- Review/Testimonial Structured Data for SEO -->` section near the end of the file (around line 569).

**Add a new review object** to the `"review"` array:

```json
{
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": "Student Name"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "reviewBody": "Full testimonial text here (same as translation file)..."
}
```

### Step 4: Update Aggregate Rating

Update the `reviewCount`:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "5.0",
  "reviewCount": "9",  // <-- Increment this
  "bestRating": "5",
  "worstRating": "5"
}
```

**Note:** If the new review isn't 5-star, you'll need to recalculate `ratingValue` as an average.

---

## Handling Different Star Ratings

If you receive a testimonial that's not 5-star (e.g., 4-star):

### Update Individual Review:
```json
"reviewRating": {
  "@type": "Rating",
  "ratingValue": "4",  // <-- Change this
  "bestRating": "5"
}
```

### Recalculate Aggregate:
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.9",  // <-- (8×5 + 1×4) / 9 = 4.89 → 4.9
  "reviewCount": "9",
  "bestRating": "5",
  "worstRating": "4"     // <-- Update worst rating
}
```

---

## How to Remove a Testimonial

If you need to remove an outdated testimonial:

### Step 1: Remove from Structured Data

Find the review object in `index.html` and delete it entirely (including the comma if needed).

### Step 2: Update Review Count

Decrement the `reviewCount`:

```json
"reviewCount": "7"  // <-- One less
```

### Step 3: Recalculate Aggregate (if needed)

If the removed review had a different rating, recalculate the average.

---

## Verification

### Check in Browser

1. Open `index.html` in browser
2. Right-click → "View Page Source"
3. Search for `"Review/Testimonial Structured Data"`
4. Verify JSON-LD is present and valid

### Validate with Google

1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Test your URL or paste HTML
3. Look for **"LocalBusiness"** detection
4. Check for warnings/errors

### Validate with Schema.org

1. Go to [Schema Markup Validator](https://validator.schema.org/)
2. Paste your JSON-LD code
3. Ensure no errors

---

## Best Practices

### Quality Over Quantity
- Better to have 8 genuine, detailed testimonials than 50 short ones
- Current testimonials are excellent quality - maintain this standard

### Keep Updated
- Update structured data when you add/remove testimonials
- Review structured data 2-3 times per year
- Remove outdated testimonials if students are no longer active

### Consistency
- Ensure structured data matches what's displayed on page
- All testimonials on homepage should be in structured data
- Don't add testimonials to structured data that aren't visible on site

### Authenticity
- Only include real testimonials from real students
- Google can penalize fake reviews
- Your current testimonials are authentic - keep it that way

---

## Future: Google Business Profile Reviews

When you establish a permanent location:

### Priority Actions:
1. **Create Google Business Profile**
2. **Request Google reviews** from students
3. **Add Google review widget** to website (optional)
4. **Link to Google reviews** from homepage

### Why This Matters More:
- Google Business reviews appear in Maps & Search
- More visible than on-site testimonials
- Better for local SEO
- People trust Google reviews more

### Recommendation:
- Keep on-site testimonials for storytelling
- Focus on collecting Google reviews for SEO
- Update on-site structured data 2-3x per year
- Prioritize Google reviews over on-site system

---

## Troubleshooting

### Schema Not Detected

**Issue:** Google Rich Results Test doesn't detect reviews

**Solution:** 
- Review schema for LocalBusiness won't show as "rich result"
- This is normal - it's for aggregate rating display, not rich snippets
- Check with Schema.org validator instead

### Invalid JSON

**Issue:** Validation errors

**Common Causes:**
- Missing comma between review objects
- Unescaped quotes in review text
- Mismatched brackets

**Solution:**
- Use JSON validator (jsonlint.com)
- Check for syntax errors

### Rating Not Showing in Search

**Issue:** Star rating doesn't appear in Google

**Reality Check:**
- Google doesn't always display ratings
- Need Google Business Profile for guaranteed display
- Can take weeks/months to appear
- On-site reviews alone rarely show stars in search

---

## Resources

- **Schema.org Review:** [https://schema.org/Review](https://schema.org/Review)
- **Google Review Guidelines:** [https://developers.google.com/search/docs/appearance/structured-data/review-snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- **Rich Results Test:** [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- **Schema Validator:** [https://validator.schema.org/](https://validator.schema.org/)

---

**Last Review:** January 30, 2025  
**Next Review:** April 30, 2025
