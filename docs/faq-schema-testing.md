# FAQ Schema Testing Guide

## Overview
This document provides testing instructions for the dynamically generated FAQ Schema.org JSON-LD implementation.

## Implementation Summary
- **Script:** `js/faqSchema.js`
- **Type:** Dynamic JSON-LD generation from i18next translations
- **Schema Type:** FAQPage with Question/Answer entities
- **Languages:** English (en) and Spanish (es)
- **Source:** Reads from `locales/en/home.json` and `locales/es/home.json`

## Local Testing

### 1. Start Local Server
```bash
cd /Users/camila/Desktop/harjeet/websites/sgpyoga
python3 -m http.server 8000
```

### 2. Open in Browser
Navigate to: `http://localhost:8000/index.html`

### 3. Check Console Logs
Open browser DevTools (F12) and look for:
- ✅ i18next is ready for FAQ schema generation
- ✅ FAQ Schema Generator initialized
- ✅ FAQ Schema generated for language: en (13 questions)

### 4. Inspect Generated Schema
In DevTools:
1. Go to **Elements** tab
2. Look in `<head>` for: `<script type="application/ld+json" id="faq-schema">`
3. Verify the JSON structure contains:
   - `@context`: "https://schema.org"
   - `@type`: "FAQPage"
   - `mainEntity`: Array of 13 Question objects
   - Each Question has `name` (question text) and `acceptedAnswer` (Answer object with text)

### 5. Test Language Switching
1. Click the language selector in navbar
2. Switch to Spanish (ES)
3. Check console for: ✅ FAQ Schema generated for language: es (13 questions)
4. Inspect `<head>` again - schema should be regenerated with Spanish translations
5. Verify question/answer text is in Spanish

### 6. Verify HTML Stripping
In the generated schema:
- Answers should NOT contain HTML tags like `<a>`, `<br>`, etc.
- Links should be stripped but text content preserved
- Example: `<a href='...'>sgpyoga.co/classes</a>` → `sgpyoga.co/classes`

## Online Validation

### Google Rich Results Test
1. Deploy to production or use ngrok for local testing
2. Visit: https://search.google.com/test/rich-results
3. Enter your URL: `https://sgpyoga.co/index.html`
4. Click **Test URL**
5. Verify:
   - ✅ FAQPage is detected
   - ✅ All 13 questions are recognized
   - ✅ No errors or warnings
   - ✅ Preview shows FAQ rich results

### Schema.org Validator
1. Copy the JSON-LD from browser DevTools
2. Visit: https://validator.schema.org/
3. Paste the JSON-LD
4. Verify no validation errors

## Expected Schema Structure

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What types of yoga classes do you offer in Mexico City?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a wide variety of yoga styles such as Hatha, Vinyasa, Aerial and Kundalini. We also regularly organise thematic workshops such as sound healing sessions or yoga philosophy classes. This variety ensures that everyone can find a class that resonates with their soul. See our current class schedule at: sgpyoga.co/classes."
      }
    },
    // ... 12 more questions
  ]
}
```

## Manual Testing Checklist

- [ ] Server runs without errors
- [ ] Page loads correctly at http://localhost:8000
- [ ] Console shows FAQ schema initialization logs
- [ ] `<script id="faq-schema">` exists in `<head>`
- [ ] Schema contains all 13 FAQ questions
- [ ] Answers are plain text (no HTML tags)
- [ ] Language switch to Spanish works
- [ ] Spanish schema is generated correctly
- [ ] Google Rich Results Test passes
- [ ] Schema.org validator shows no errors

## Debugging

### If schema doesn't appear:
1. Check console for errors
2. Verify i18next initialized: `console.log(i18next.isInitialized)`
3. Verify translations loaded: `console.log(i18next.store.data)`
4. Manually trigger refresh: `window.FAQSchemaGenerator.refresh()`

### If schema has wrong language:
1. Check current language: `console.log(i18next.language)`
2. Manually set language: `window.FAQSchemaGenerator.currentLanguage = 'es'`
3. Regenerate: `window.FAQSchemaGenerator.generateSchema()`

### If HTML tags appear in answers:
1. Check stripHTML function in `js/faqSchema.js`
2. Verify temp element creation works in browser

## SEO Benefits
Once validated, this implementation provides:
- **Rich Results:** FAQ answers appear directly in Google search
- **Increased CTR:** More visible SERP presence
- **Voice Search:** Better compatibility with voice assistants
- **Featured Snippets:** Higher chance of position zero
- **Local SEO:** Enhanced local discovery for CDMX yoga searches

## Testing Timeline
- Initial testing should take ~10-15 minutes
- Google Rich Results may take 1-2 days to reflect in production
- Monitor Google Search Console for FAQ rich results appearance

## Notes
- Schema auto-updates when language changes (no page reload needed)
- Schema persists across page navigation (as long as on index.html)
- For debugging, use: `window.FAQSchemaGenerator.refresh()`
