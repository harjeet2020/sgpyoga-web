# FAQ Schema - Quick Console Tests

Run these commands in your browser console to verify the FAQ schema implementation.

## 1. Check if FAQ Schema is Generated

```javascript
// Check if schema element exists
document.getElementById('faq-schema')
```
**Expected:** Should return the `<script>` element

## 2. View the Schema Content

```javascript
// View the full schema JSON
console.log(JSON.parse(document.getElementById('faq-schema').textContent))
```
**Expected:** Should show FAQPage object with 13 questions

## 3. Verify Question Count

```javascript
// Count questions in schema
JSON.parse(document.getElementById('faq-schema').textContent).mainEntity.length
```
**Expected:** 13

## 4. Check First Question

```javascript
// View first question
const schema = JSON.parse(document.getElementById('faq-schema').textContent);
console.log('Q:', schema.mainEntity[0].name);
console.log('A:', schema.mainEntity[0].acceptedAnswer.text);
```
**Expected:** 
- Q: "What types of yoga classes do you offer in Mexico City?"
- A: Plain text answer (no HTML tags)

## 5. Verify HTML Stripping

```javascript
// Check if any answer contains HTML tags
const schema = JSON.parse(document.getElementById('faq-schema').textContent);
const hasHTML = schema.mainEntity.some(q => 
    q.acceptedAnswer.text.includes('<') || q.acceptedAnswer.text.includes('>')
);
console.log('Contains HTML:', hasHTML);
```
**Expected:** false (no HTML tags should be present)

## 6. Test Manual Schema Refresh

```javascript
// Manually trigger schema regeneration
window.FAQSchemaGenerator.refresh()
```
**Expected:** Console log showing "🔄 Manually refreshing FAQ schema" followed by success message

## 7. Check Current Language

```javascript
// Check what language the schema is using
window.FAQSchemaGenerator.currentLanguage
```
**Expected:** "en" or "es"

## 8. Manually Switch Language and Regenerate

```javascript
// Switch to Spanish
window.FAQSchemaGenerator.currentLanguage = 'es';
window.FAQSchemaGenerator.generateSchema();
// Then check first question again
const schema = JSON.parse(document.getElementById('faq-schema').textContent);
console.log('Q:', schema.mainEntity[0].name);
```
**Expected:** Question should now be in Spanish

## Quick Copy-Paste Test Suite

```javascript
// Run all tests at once
(() => {
    console.log('=== FAQ Schema Tests ===\n');
    
    // Test 1: Schema exists
    const schemaEl = document.getElementById('faq-schema');
    console.log('✓ Schema element exists:', !!schemaEl);
    
    if (!schemaEl) {
        console.error('❌ Schema not found - check console for errors');
        return;
    }
    
    // Test 2: Parse schema
    let schema;
    try {
        schema = JSON.parse(schemaEl.textContent);
        console.log('✓ Schema parses correctly');
    } catch (e) {
        console.error('❌ Schema JSON invalid:', e);
        return;
    }
    
    // Test 3: Check structure
    console.log('✓ Schema type:', schema['@type']);
    console.log('✓ Question count:', schema.mainEntity.length);
    
    // Test 4: Check for HTML in answers
    const hasHTML = schema.mainEntity.some(q => 
        q.acceptedAnswer.text.includes('<') || q.acceptedAnswer.text.includes('>')
    );
    console.log(hasHTML ? '❌ Contains HTML tags' : '✓ No HTML tags in answers');
    
    // Test 5: Show first question
    console.log('\n--- First Question ---');
    console.log('Q:', schema.mainEntity[0].name);
    console.log('A:', schema.mainEntity[0].acceptedAnswer.text.substring(0, 100) + '...');
    
    // Test 6: Current language
    console.log('\n--- Language ---');
    console.log('Current:', window.FAQSchemaGenerator.currentLanguage);
    console.log('i18next:', i18next.language);
    
    console.log('\n=== All Tests Complete ===');
})();
```

## Validation on Google

Once you've confirmed locally:

1. Copy the schema:
```javascript
copy(document.getElementById('faq-schema').textContent)
```

2. Go to: https://validator.schema.org/
3. Paste and validate
4. Should show: "No errors found" ✅
