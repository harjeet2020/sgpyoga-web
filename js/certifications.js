/**
 * @module js/certifications
 * @description Handles interactive functionality for the certifications page,
 * including the curriculum accordion component.
 */

/**
 * Curriculum Accordion Class
 * Manages the expand/collapse behavior of curriculum modules.
 * Allows multiple modules to be open simultaneously.
 */
class CurriculumAccordion {
    /**
     * Creates an instance of CurriculumAccordion.
     * Initializes the accordion when DOM is ready.
     */
    constructor() {
        this.accordionItems = [];
        this.init();
    }

    /**
     * Initializes the accordion functionality.
     * Waits for DOM to be ready if necessary.
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Sets up accordion elements and event listeners.
     */
    setup() {
        this.accordionItems = document.querySelectorAll('.accordion-item');

        if (this.accordionItems.length === 0) {
            return; // No accordion items found, exit silently
        }

        this.accordionItems.forEach((item, index) => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            if (header && content) {
                // Set initial ARIA attributes
                header.setAttribute('aria-expanded', 'false');
                content.id = `accordion-content-${index}`;
                header.setAttribute('aria-controls', content.id);

                // Add click event listener
                header.addEventListener('click', () => this.toggle(item));

                // Add keyboard event listener
                header.addEventListener('keydown', (e) => this.handleKeydown(e, item));
            }
        });

        // Initialize Lucide icons for accordion
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Toggles the expanded state of an accordion item.
     * @param {HTMLElement} item - The accordion item to toggle.
     */
    toggle(item) {
        const header = item.querySelector('.accordion-header');
        const isExpanded = header.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            this.collapse(item);
        } else {
            this.expand(item);
        }
    }

    /**
     * Expands an accordion item.
     * @param {HTMLElement} item - The accordion item to expand.
     */
    expand(item) {
        const header = item.querySelector('.accordion-header');
        header.setAttribute('aria-expanded', 'true');
    }

    /**
     * Collapses an accordion item.
     * @param {HTMLElement} item - The accordion item to collapse.
     */
    collapse(item) {
        const header = item.querySelector('.accordion-header');
        header.setAttribute('aria-expanded', 'false');
    }

    /**
     * Expands all accordion items.
     */
    expandAll() {
        this.accordionItems.forEach(item => this.expand(item));
    }

    /**
     * Collapses all accordion items.
     */
    collapseAll() {
        this.accordionItems.forEach(item => this.collapse(item));
    }

    /**
     * Handles keyboard navigation within the accordion.
     * @param {KeyboardEvent} e - The keyboard event.
     * @param {HTMLElement} item - The current accordion item.
     */
    handleKeydown(e, item) {
        const items = Array.from(this.accordionItems);
        const currentIndex = items.indexOf(item);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < items.length - 1) {
                    items[currentIndex + 1].querySelector('.accordion-header').focus();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    items[currentIndex - 1].querySelector('.accordion-header').focus();
                }
                break;
            case 'Home':
                e.preventDefault();
                items[0].querySelector('.accordion-header').focus();
                break;
            case 'End':
                e.preventDefault();
                items[items.length - 1].querySelector('.accordion-header').focus();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.toggle(item);
                break;
        }
    }
}

// Initialize accordion when page loads
let curriculumAccordion = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCertifications);
} else {
    initCertifications();
}

/**
 * Initializes the certifications page functionality.
 */
function initCertifications() {
    // Initialize accordion
    curriculumAccordion = new CurriculumAccordion();

    // Reinitialize Lucide icons after i18n updates
    if (window.i18next) {
        window.i18next.on('languageChanged', () => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }
}
