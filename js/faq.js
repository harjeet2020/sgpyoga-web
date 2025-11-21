/* ==========================================================================
   SGP YOGA - FAQ ACCORDION FUNCTIONALITY
   ========================================================================== */

/**
 * FAQ Accordion Module
 * Handles expand/collapse functionality for FAQ items
 * Supports keyboard navigation and ARIA attributes for accessibility
 */

(function() {
    'use strict';

    /**
     * Initialize FAQ accordion functionality
     * Waits for DOM and i18next to be ready
     */
    function initFAQ() {
        // Select all FAQ items
        const faqItems = document.querySelectorAll('.faq-item');
        
        if (faqItems.length === 0) {
            console.warn('No FAQ items found');
            return;
        }

        // Add click handlers to each FAQ item
        faqItems.forEach((item, index) => {
            const questionButton = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (!questionButton || !answer) {
                console.warn(`FAQ item ${index} missing question or answer element`);
                return;
            }

            // Click handler
            questionButton.addEventListener('click', function() {
                toggleFAQ(item, questionButton, answer);
            });

            // Keyboard handler (Enter and Space)
            questionButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQ(item, questionButton, answer);
                }
            });
        });

        console.log(`FAQ accordion initialized with ${faqItems.length} items`);
    }

    /**
     * Toggle FAQ item open/closed
     * @param {HTMLElement} item - The FAQ item container
     * @param {HTMLElement} button - The question button
     * @param {HTMLElement} answer - The answer container
     */
    function toggleFAQ(item, button, answer) {
        const isActive = item.classList.contains('active');
        
        if (isActive) {
            // Close the item
            item.classList.remove('active');
            button.setAttribute('aria-expanded', 'false');
        } else {
            // Open the item
            item.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        }
    }

    /**
     * Wait for DOM and Lucide to be ready, then initialize
     */
    function ready() {
        // Initialize FAQ
        initFAQ();
        
        // Initialize Lucide icons for FAQ section
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        // DOM is already ready
        ready();
    }

})();
