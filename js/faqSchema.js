/**
 * SGP Yoga - FAQ Schema Generator
 * Dynamically generates Schema.org FAQPage JSON-LD from i18next translations
 * 
 * Why this approach?
 * - Single source of truth (locale files contain all FAQ data)
 * - Automatically supports multiple languages
 * - Schema updates automatically when translations change
 * - No duplicate content maintenance
 */

class FAQSchemaGenerator {
    constructor() {
        this.schemaId = 'faq-schema';
        this.currentLanguage = 'en';
        this.isInitialized = false;
    }

    /**
     * Initialize the FAQ schema generator
     * Waits for i18next to be ready before generating schema
     */
    async init() {
        // Wait for i18next to be fully initialized
        await this.waitForI18next();
        
        // Generate initial schema
        this.generateSchema();
        
        // Listen for language changes to regenerate schema
        this.setupLanguageChangeListener();
        
        this.isInitialized = true;
        console.log('✅ FAQ Schema Generator initialized');
    }

    /**
     * Wait for i18next to be initialized
     * Uses polling with timeout to ensure i18next is ready
     */
    async waitForI18next() {
        const maxAttempts = 50; // 5 seconds max (50 * 100ms)
        let attempts = 0;

        return new Promise((resolve) => {
            const checkI18next = () => {
                attempts++;
                
                // Check if i18next is available and initialized
                if (typeof i18next !== 'undefined' && i18next.isInitialized) {
                    console.log('✅ i18next is ready for FAQ schema generation');
                    resolve();
                    return;
                }

                // Timeout after max attempts
                if (attempts >= maxAttempts) {
                    console.warn('⚠️ Timeout waiting for i18next - FAQ schema may not generate correctly');
                    resolve();
                    return;
                }

                // Try again in 100ms
                setTimeout(checkI18next, 100);
            };

            checkI18next();
        });
    }

    /**
     * Listen for language changes and regenerate schema
     */
    setupLanguageChangeListener() {
        // Listen for custom language change event (primary method)
        document.addEventListener('languageChanged', (event) => {
            const newLanguage = event.detail.language;
            
            if (newLanguage !== this.currentLanguage) {
                this.currentLanguage = newLanguage;
                
                // Regenerate schema with new language
                // Use a small delay to ensure translations are updated
                setTimeout(() => {
                    this.generateSchema();
                }, 300);
            }
        });

        // Also monitor i18next language directly as backup
        // This is more reliable than checking SGPi18n
        const checkInterval = setInterval(() => {
            if (typeof i18next !== 'undefined' && i18next.language) {
                const detectedLang = i18next.language;
                
                if (detectedLang && detectedLang !== this.currentLanguage) {
                    this.currentLanguage = detectedLang;
                    this.generateSchema();
                }
            }
        }, 1000);

        // Clear interval after 30 seconds to avoid unnecessary checks
        setTimeout(() => clearInterval(checkInterval), 30000);
    }

    /**
     * Generate FAQ Schema.org JSON-LD
     * Reads FAQ data from i18next translations and injects into DOM
     */
    generateSchema() {
        try {
            // Detect current language from i18next
            if (typeof i18next !== 'undefined' && i18next.language) {
                this.currentLanguage = i18next.language;
            }

            // Get FAQ data from i18next
            const faqData = this.getFAQData();

            if (!faqData || faqData.length === 0) {
                console.warn('⚠️ No FAQ data found for schema generation');
                return;
            }

            // Build Schema.org structure
            const schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqData.map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": this.stripHTML(item.answer)
                    }
                }))
            };

            // Inject schema into DOM
            this.injectSchema(schema);

            console.log(`✅ FAQ Schema generated for language: ${this.currentLanguage}`, `(${faqData.length} questions)`);

        } catch (error) {
            console.error('❌ Error generating FAQ schema:', error);
        }
    }

    /**
     * Extract FAQ data from i18next translations
     * @returns {Array} Array of {question, answer} objects
     */
    getFAQData() {
        const faqData = [];

        try {
            // Try to get FAQ questions from i18next
            // Structure: home:faq.questions[0].q and home:faq.questions[0].a
            
            // First, check if we can access the raw translation data
            if (typeof i18next !== 'undefined' && i18next.store && i18next.store.data) {
                const currentLangData = i18next.store.data[this.currentLanguage];
                
                if (currentLangData && currentLangData.home && currentLangData.home.faq && currentLangData.home.faq.questions) {
                    const questions = currentLangData.home.faq.questions;
                    
                    questions.forEach((item, index) => {
                        if (item.q && item.a) {
                            faqData.push({
                                question: item.q,
                                answer: item.a
                            });
                        }
                    });
                }
            }

            // Fallback: Try using i18next.t() method
            if (faqData.length === 0) {
                console.log('📋 Using fallback method to extract FAQ data');
                
                // Try to extract up to 20 questions (we know there are 13)
                for (let i = 0; i < 20; i++) {
                    const question = i18next.t(`home:faq.questions.${i}.q`, { defaultValue: null });
                    const answer = i18next.t(`home:faq.questions.${i}.a`, { defaultValue: null });
                    
                    // Stop if we get null (no more questions)
                    if (!question || !answer || question === `home:faq.questions.${i}.q`) {
                        break;
                    }
                    
                    faqData.push({ question, answer });
                }
            }

        } catch (error) {
            console.error('Error extracting FAQ data:', error);
        }

        return faqData;
    }

    /**
     * Strip HTML tags from text
     * Necessary because Schema.org Answer text should be plain text
     * @param {string} html - HTML string
     * @returns {string} Plain text
     */
    stripHTML(html) {
        if (!html) return '';
        
        // Create a temporary element to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Extract text content (automatically strips tags)
        let text = temp.textContent || temp.innerText || '';
        
        // Clean up extra whitespace
        text = text.replace(/\s+/g, ' ').trim();
        
        return text;
    }

    /**
     * Inject Schema.org JSON-LD into DOM
     * Removes existing schema if present and injects new one
     * @param {Object} schema - Schema.org object
     */
    injectSchema(schema) {
        // Remove existing FAQ schema if present
        const existingSchema = document.getElementById(this.schemaId);
        if (existingSchema) {
            existingSchema.remove();
        }

        // Create new script element
        const scriptElement = document.createElement('script');
        scriptElement.id = this.schemaId;
        scriptElement.type = 'application/ld+json';
        scriptElement.textContent = JSON.stringify(schema, null, 2);

        // Inject into <head>
        document.head.appendChild(scriptElement);
    }

    /**
     * Manually trigger schema regeneration
     * Useful for debugging or forcing updates
     */
    refresh() {
        console.log('🔄 Manually refreshing FAQ schema');
        this.generateSchema();
    }
}

// Create global instance
const faqSchemaGenerator = new FAQSchemaGenerator();

// Initialize when DOM is ready
// This should run after i18n.js has initialized
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        faqSchemaGenerator.init();
    });
} else {
    // DOM already loaded
    faqSchemaGenerator.init();
}

// Export for global access and debugging
if (typeof window !== 'undefined') {
    window.FAQSchemaGenerator = faqSchemaGenerator;
}
