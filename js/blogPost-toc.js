/**
 * Table of Contents Generator and Scroll Spy
 * For Long-Form Blog Posts
 * 
 * Features:
 * - Automatic TOC generation from h2, h3, h4 headings
 * - Automatic ID generation for headings
 * - Scroll spy with active section highlighting
 * - Smooth scroll to sections
 * - Show/hide TOC based on scroll position
 */

class TableOfContents {
    constructor() {
        // Configuration
        this.config = {
            contentSelector: '.post-content',
            tocContainerSelector: '#tocContainer',
            tocListSelector: '#tocList',
            headingSelectors: 'h2, h3, h4',
            activeClass: 'active',
            visibleClass: 'visible',
            scrollThreshold: 200, // Show TOC after scrolling 200px
            intersectionThreshold: 0.5, // 50% of heading must be visible
        };

        // State
        this.headings = [];
        this.tocContainer = null;
        this.tocList = null;
        this.observer = null;
        this.activeHeading = null;

        // Initialize
        this.init();
    }

    /**
     * Initialize the TOC system
     */
    init() {
        // Get DOM elements
        this.tocContainer = document.querySelector(this.config.tocContainerSelector);
        this.tocList = document.querySelector(this.config.tocListSelector);
        
        const contentArea = document.querySelector(this.config.contentSelector);
        
        // Exit if required elements don't exist
        if (!this.tocContainer || !this.tocList || !contentArea) {
            console.warn('TOC: Required elements not found');
            return;
        }

        // Get all headings
        this.headings = Array.from(contentArea.querySelectorAll(this.config.headingSelectors));
        
        if (this.headings.length === 0) {
            console.warn('TOC: No headings found');
            return;
        }

        // Generate IDs for headings without them
        this.generateHeadingIds();

        // Build the TOC
        this.buildTOC();

        // Set up scroll spy
        this.setupScrollSpy();

        // Set up smooth scrolling
        this.setupSmoothScroll();

        console.log(`TOC: Initialized with ${this.headings.length} headings`);
    }

    /**
     * Generate unique IDs for headings that don't have them
     */
    generateHeadingIds() {
        const usedIds = new Set();

        this.headings.forEach(heading => {
            if (!heading.id) {
                // Create ID from heading text
                let baseId = heading.textContent
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '') // Remove special characters
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/-+/g, '-'); // Remove consecutive hyphens

                // Ensure uniqueness
                let id = baseId;
                let counter = 1;
                while (usedIds.has(id)) {
                    id = `${baseId}-${counter}`;
                    counter++;
                }

                heading.id = id;
                usedIds.add(id);
            } else {
                usedIds.add(heading.id);
            }
        });
    }

    /**
     * Build the table of contents structure
     */
    buildTOC() {
        const tocItems = [];
        let currentH2 = null;
        let currentH3 = null;

        this.headings.forEach(heading => {
            const level = parseInt(heading.tagName.substring(1)); // Get number from h2, h3, h4
            const text = heading.textContent;
            const id = heading.id;

            const item = {
                level,
                text,
                id,
                element: heading,
                children: []
            };

            if (level === 2) {
                // Top-level heading
                tocItems.push(item);
                currentH2 = item;
                currentH3 = null;
            } else if (level === 3 && currentH2) {
                // Second-level heading under h2
                currentH2.children.push(item);
                currentH3 = item;
            } else if (level === 4 && currentH3) {
                // Third-level heading under h3
                currentH3.children.push(item);
            } else if (level === 4 && currentH2) {
                // H4 without h3 parent - add to h2
                currentH2.children.push(item);
            }
        });

        // Render the TOC
        this.tocList.innerHTML = this.renderTOCItems(tocItems);
    }

    /**
     * Recursively render TOC items as nested lists
     */
    renderTOCItems(items, level = 2) {
        if (items.length === 0) return '';

        const listClass = `toc-list toc-list-level-${level}`;
        let html = `<ul class="${listClass}">`;

        items.forEach(item => {
            const itemClass = `toc-item toc-item-level-${item.level}`;
            html += `<li class="${itemClass}">`;
            html += `<a href="#${item.id}" class="toc-link" data-heading-id="${item.id}">${item.text}</a>`;
            
            // Recursively render children
            if (item.children.length > 0) {
                html += this.renderTOCItems(item.children, item.level + 1);
            }
            
            html += '</li>';
        });

        html += '</ul>';
        return html;
    }

    /**
     * Set up Intersection Observer for scroll spy
     */
    setupScrollSpy() {
        const options = {
            root: null,
            rootMargin: '-100px 0px -60% 0px', // Trigger when heading is in top 40% of viewport
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveHeading(entry.target.id);
                }
            });
        }, options);

        // Observe all headings
        this.headings.forEach(heading => {
            this.observer.observe(heading);
        });
    }

    /**
     * Set the active heading and update TOC highlighting
     */
    setActiveHeading(headingId) {
        if (this.activeHeading === headingId) return;

        // Remove active class from all links
        const allLinks = this.tocList.querySelectorAll('.toc-link');
        allLinks.forEach(link => link.classList.remove(this.config.activeClass));

        // Add active class to current link
        const activeLink = this.tocList.querySelector(`[data-heading-id="${headingId}"]`);
        if (activeLink) {
            activeLink.classList.add(this.config.activeClass);
            this.activeHeading = headingId;
        }
    }

    /**
     * Set up smooth scrolling for TOC links
     */
    setupSmoothScroll() {
        this.tocList.addEventListener('click', (e) => {
            const link = e.target.closest('.toc-link');
            if (!link) return;

            e.preventDefault();
            
            const targetId = link.getAttribute('data-heading-id');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate offset to account for fixed header
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active state immediately
                this.setActiveHeading(targetId);
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TableOfContents();
    });
} else {
    new TableOfContents();
}
