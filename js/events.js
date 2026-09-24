/**
 * @module js/events
 *
 * Events page behaviour: the category filter, the past/upcoming toggle, the
 * detail modal, and the sideways-scroll arrows.
 *
 * @remarks
 * **The cards are already in the HTML.** `npm run build:content` renders
 * every event into `events.html` (see `scripts/content/eventCards.js`), so
 * this file never builds a card. It used to: it waited for i18next and six
 * locale files, then wrote the cards with `innerHTML`, which on a real
 * connection left the grid empty for a few hundred milliseconds and then
 * pushed the rest of the page down. Now filtering and switching views only
 * toggle `hidden` on existing cards and reorder them, and the modal copies its
 * text out of the card that was clicked. Nothing here waits for a
 * translation, so nothing here can arrive late.
 *
 * **It runs as soon as it is parsed, not on `DOMContentLoaded`.** The script
 * sits at the end of `<body>`, after everything it touches, and
 * `DOMContentLoaded` would make it wait for the three deferred CDN scripts in
 * `<head>`. The first thing it does is re-check which cards are past against
 * the visitor's own date, and that should happen before the first paint, not
 * after the CDN has answered.
 *
 * **Language needs no handling here.** Every card, label and message carries
 * `data-i18n`, so `js/i18n.js` translates them with the rest of the page, and
 * the language switcher navigates between `/events.html` and
 * `/es/events.html` anyway.
 */

/**
 * How many cards one view shows.
 *
 * @remarks
 * The twelve soonest upcoming, or the twelve most recent past, after the
 * category filter. Kept in step with `MAX_VISIBLE` in
 * `scripts/content/eventCards.js`, which applies the same limit to the served
 * HTML; if they disagree, the number of cards changes on load.
 */
const MAX_EVENTS_TO_DISPLAY = 12;

/**
 * What the visitor is currently looking at.
 *
 * @typedef {object} EventsView
 * @property {'upcoming'|'past'} time - Which side of today.
 * @property {string} category - A category enum value, or `all`.
 */

/** @type {EventsView} */
const view = { time: 'upcoming', category: 'all' };

initEventsPage();

/**
 * Wires up the page, or defers until the DOM exists if the script was ever
 * moved into `<head>`.
 *
 * @returns {void}
 */
function initEventsPage() {
    const grid = document.getElementById('eventsGrid');

    if (!grid) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initEventsPage, { once: true });
        }
        return;
    }

    // The build wrote the cards soonest first, so this list is the canonical
    // upcoming order; the past view is simply its reverse.
    const cards = Array.from(grid.querySelectorAll('.event-card'));
    const scrollIndicators = initEventsScrollIndicators(grid);

    /**
     * Shows the cards the current view asks for, and everything that follows
     * from them: order, past styling, the empty message and the toggle label.
     *
     * @returns {void}
     */
    function applyView() {
        const today = localToday();
        const isPastView = view.time === 'past';

        const matching = cards.filter((card) =>
            isPastCard(card, today) === isPastView &&
            (view.category === 'all' || card.dataset.category === view.category)
        );
        const ordered = isPastView ? matching.slice().reverse() : matching;
        const shown = new Set(ordered.slice(0, MAX_EVENTS_TO_DISPLAY));

        cards.forEach((card) => {
            card.hidden = !shown.has(card);
            card.classList.toggle('past-event', isPastView);
        });

        // Most recent first in the past view. Moving the nodes, rather than
        // using CSS `order`, keeps the tab and screen-reader order matching
        // what is on screen. `append` moves nodes that are already in the grid.
        const inDomOrder = Array.from(grid.querySelectorAll('.event-card'));
        const wanted = isPastView ? cards.slice().reverse() : cards;
        if (inDomOrder.some((card, index) => card !== wanted[index])) {
            grid.append(...wanted);
        }

        grid.querySelectorAll('[data-empty-in]').forEach((message) => {
            message.hidden = message.dataset.emptyIn !== view.time || shown.size > 0;
        });

        updateTimeToggleButton();
        scrollIndicators.update();
    }

    initializeFilters(applyView);
    initializeTimeToggle(applyView, grid);
    initializeModal(grid);
    initEventTypeTilesIntersectionObserver();

    applyView();
}

/**
 * Today's date in the visitor's timezone, as `YYYY-MM-DD`.
 *
 * @returns {string} The local calendar date.
 */
function localToday() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * Whether a card's event has finished.
 *
 * @remarks
 * `YYYY-MM-DD` strings compare correctly as text, so the dates are never
 * parsed. Parsing them is how the old code got this wrong: `new Date()` reads
 * `2026-09-23` as UTC midnight, which is the evening of the 22nd in Mexico
 * City, so an event showed as past on its own last day.
 *
 * @param {HTMLElement} card - An `.event-card`.
 * @param {string} today - `YYYY-MM-DD`.
 * @returns {boolean} True once the visitor's date is after the event's end.
 */
function isPastCard(card, today) {
    return card.dataset.end < today;
}

// =============================================================================
// FILTERS AND TIME TOGGLE
// =============================================================================

/**
 * Makes the category buttons filter the grid.
 *
 * @param {() => void} applyView - Re-applies the view after a change.
 * @returns {void}
 */
function initializeFilters(applyView) {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach((button) => {
        button.addEventListener('click', function () {
            filterButtons.forEach((other) => other.classList.remove('active'));
            button.classList.add('active');

            view.category = button.dataset.filter;
            applyView();
        });
    });
}

/**
 * Makes the toggle switch between upcoming and past events.
 *
 * @param {() => void} applyView - Re-applies the view after a change.
 * @param {HTMLElement} grid - The cards' container, scrolled back to the start
 *   so the new view opens on its first card.
 * @returns {void}
 */
function initializeTimeToggle(applyView, grid) {
    const toggle = document.getElementById('timeToggleBtn');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
        view.time = view.time === 'upcoming' ? 'past' : 'upcoming';
        applyView();
        grid.scrollLeft = 0;
    });
}

/**
 * Shows the toggle label for the current view.
 *
 * @remarks
 * Both labels are in the markup, translated by both i18n paths, and this only
 * picks one. The button offers the other view: "Show Past Events" while
 * looking at upcoming ones.
 *
 * @returns {void}
 */
function updateTimeToggleButton() {
    const toggle = document.getElementById('timeToggleBtn');
    if (!toggle) return;

    toggle.setAttribute('aria-pressed', String(view.time === 'past'));
    toggle.querySelectorAll('[data-shown-in]').forEach((label) => {
        label.hidden = label.dataset.shownIn !== view.time;
    });
}

// =============================================================================
// MODAL
// =============================================================================

/**
 * Wires the detail modal: open on a card, close on the X, the overlay or
 * Escape, and register through WhatsApp.
 *
 * @remarks
 * One delegated listener on the grid rather than one per card, so it keeps
 * working however the cards are hidden or reordered.
 *
 * @param {HTMLElement} grid - The cards' container.
 * @returns {void}
 */
function initializeModal(grid) {
    const modal = document.getElementById('eventModal');
    const modalClose = document.getElementById('modalClose');
    const registerBtn = document.getElementById('modalRegisterBtn');

    if (!modal) return;

    grid.addEventListener('click', function (event) {
        const card = event.target.closest('.event-card');
        if (card) {
            openModal(modal, card);
        }
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => closeModal(modal));
    }

    // Only the dark overlay itself, not a click inside the dialog.
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal(modal);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal(modal);
        }
    });

    if (registerBtn) {
        registerBtn.addEventListener('click', function () {
            const eventTitle = document.getElementById('modalEventTitle').textContent;
            const message = encodeURIComponent(`Hi! I would like to register for ${eventTitle}. Please provide me with more information about registration process, availability, and payment options. Thank you!`);

            // +52 55 3906 1305, in the format wa.me expects.
            window.open(`https://wa.me/525539061305?text=${message}`, '_blank', 'noopener');
        });
    }
}

/**
 * Fills the modal from a card and shows it.
 *
 * @remarks
 * Every value is read from the card: the visible text, the `hidden` details
 * block the build put inside it, and the modal image on its data attributes.
 * Reading `textContent` means the modal shows whatever language the card is
 * currently in, and it never interprets event text as HTML.
 *
 * @param {HTMLElement} modal - The `#eventModal` overlay.
 * @param {HTMLElement} card - The `.event-card` that was clicked.
 * @returns {void}
 */
function openModal(modal, card) {
    const field = (name) => {
        const element = card.querySelector(`[data-field="${name}"]`);
        return element ? element.textContent.trim() : '';
    };
    const setText = (id, text) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    };

    setText('modalEventTitle', field('title'));
    setText('modalEventBadge', field('category'));
    setText('modalEventDescription', field('fullDescription'));
    setText('modalEventInstructor', field('instructor'));
    setText('modalEventLocation', field('location'));
    setText('modalEventPrice', field('price'));

    // Date and time on separate lines, built from nodes so neither is parsed as HTML.
    const dateTime = document.getElementById('modalEventDateTime');
    if (dateTime) {
        dateTime.replaceChildren(field('date'), document.createElement('br'), field('time'));
    }

    // Set src, srcset and sizes together on every open, so a previous event's
    // srcset never lingers on the shared element. `sizes` mirrors
    // .modal-container's max-width (900px) in css/events.css.
    const image = document.getElementById('modalEventImage');
    const cardImage = card.querySelector('.event-card-image img');
    if (image) {
        image.src = card.dataset.modalImage;
        image.srcset = cardImage ? cardImage.getAttribute('srcset') : '';
        image.sizes = '(max-width: 900px) 100vw, 900px';
        image.alt = field('title');
        image.style.objectPosition = card.dataset.modalPosition || 'center';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Hides the modal and gives the page its scrolling back.
 *
 * @param {HTMLElement} modal - The `#eventModal` overlay.
 * @returns {void}
 */
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// =============================================================================
// EVENTS SCROLL INDICATORS
// =============================================================================

/**
 * Shows the left/right arrows over the grid on phones and tablets, each only
 * while there is more to scroll in its direction.
 *
 * @param {HTMLElement} grid - The cards' container.
 * @returns {{update: () => void}} Call `update` after the visible cards change.
 */
function initEventsScrollIndicators(grid) {
    const leftIndicator = document.querySelector('.events-scroll-indicator.left');
    const rightIndicator = document.querySelector('.events-scroll-indicator.right');
    const isMobileOrTablet = () => window.innerWidth <= 1024;

    if (!leftIndicator || !rightIndicator || !isMobileOrTablet()) {
        return { update() {} };
    }

    /**
     * Shows each arrow only while there is something to scroll to.
     *
     * @returns {void}
     */
    function update() {
        if (!isMobileOrTablet()) {
            leftIndicator.classList.remove('visible');
            rightIndicator.classList.remove('visible');
            return;
        }

        const maxScroll = grid.scrollWidth - grid.clientWidth;
        leftIndicator.classList.toggle('visible', grid.scrollLeft > 10);
        rightIndicator.classList.toggle('visible', grid.scrollLeft < maxScroll - 10);
    }

    leftIndicator.addEventListener('click', function () {
        grid.scrollBy({ left: -grid.clientWidth * 0.8, behavior: 'smooth' });
    });

    rightIndicator.addEventListener('click', function () {
        grid.scrollBy({ left: grid.clientWidth * 0.8, behavior: 'smooth' });
    });

    grid.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    return { update };
}

// =============================================================================
// EVENT TYPE TILES INTERSECTION OBSERVER
// =============================================================================

/**
 * On phones, reveals each event-type tile's overlay as it scrolls through the
 * upper part of the screen, one at a time; desktop uses `:hover` instead.
 *
 * @returns {void}
 */
function initEventTypeTilesIntersectionObserver() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (!isMobile) {
        return;
    }

    const eventTypeTiles = document.querySelectorAll('.event-type-tile');

    if (!eventTypeTiles.length) {
        return;
    }

    // Trigger as a tile approaches the top third of the viewport, matching
    // the yoga styles and spaces sections.
    const observerOptions = {
        root: null,
        rootMargin: '40% 0px -60% 0px',
        threshold: 0
    };

    function hideAllOverlays() {
        eventTypeTiles.forEach((tile) => {
            tile.querySelector('.event-type-overlay').classList.remove('auto-visible');
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const overlay = entry.target.querySelector('.event-type-overlay');
            if (entry.isIntersecting) {
                // Only one overlay at a time.
                hideAllOverlays();
                overlay.classList.add('auto-visible');
            } else {
                overlay.classList.remove('auto-visible');
            }
        });
    }, observerOptions);

    eventTypeTiles.forEach((tile) => observer.observe(tile));

    // Crossing the mobile breakpoint (a rotation, say) switches between the
    // observer and :hover, which a reload handles most simply.
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.matchMedia('(max-width: 768px)').matches !== isMobile) {
                location.reload();
            }
        }, 250);
    });
}
