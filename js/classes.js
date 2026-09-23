/**
 * Classes page — weekly schedule behaviour.
 *
 * Two jobs, both progressive enhancements over markup that is already
 * complete and readable without script: mark today's column, and filter the
 * week by any number of teachers and venues.
 *
 * What is deliberately absent is as informative as what is here. There is no
 * scroll-to-today, because the week no longer scrolls sideways — the old one
 * did, and auto-scrolling it left a phone visitor parked mid-week with the
 * day headings out of view in the other axis. There is no tap-to-expand,
 * because nothing on the card is hidden any more. And there are no legend
 * scroll arrows, because the legend is a wrapping grid rather than a
 * horizontal filmstrip.
 */

document.addEventListener('DOMContentLoaded', function () {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    markToday();
    initScheduleFilters();
});

/**
 * Marks the column for the current day of the week.
 *
 * The "Today" label is already in the markup for all seven days, translated
 * by the build like any other string; this only reveals the right one. That
 * is why the label is not written from here — script-injected text is
 * invisible to `build-i18n.js` and would ship in English on the Spanish site.
 *
 * @returns {void}
 */
function markToday() {
    // `getDay()` is 0 for Sunday; the markup's `data-day` follows the
    // database, where 1 is Monday and 7 is Sunday.
    const today = new Date().getDay();
    const dayOfWeek = today === 0 ? 7 : today;

    const column = document.querySelector(`.schedule-day[data-day="${dayOfWeek}"]`);

    if (column) {
        column.classList.add('is-today');
    }
}

/**
 * Wires the filter dropdowns to the week.
 *
 * Four things matter here and none of them is the filtering itself, which is
 * a few lines in `apply`.
 *
 * **Nothing is keyed to a slug.** Each dropdown declares the card attribute it
 * filters on in `data-filter-field`, and the value of each checkbox is
 * whatever `data-<field>` the card carries. Adding a third axis means adding a
 * dropdown to the template, and nothing here changes at all.
 *
 * **Options that match no card are removed on load.** The option lists are
 * generated from the timetable, but a filter whose only possible result is an
 * empty week reads as a broken page rather than as an answer, so this never
 * trusts them to be exact.
 *
 * **Several values per axis, and the axes combine.** Ticking Harjeet and Rox
 * shows either of them; ticking Aguacate as well narrows that to Aguacate.
 * That is "any of these, on every axis", and it is the same rule the admin
 * panel uses, so staff preview exactly what visitors can do. An axis with
 * nothing ticked places no constraint. The empty case is handled honestly, by
 * a sentence that is in the markup and therefore translated like everything
 * else.
 *
 * **Why checkboxes in a disclosure, and not a `<select>`.** A native select
 * takes one value; `<select multiple>` is an always-open list that needs
 * Ctrl-click, which almost nobody knows. A button that shows and hides a
 * group of real checkboxes is operable by anyone and announced correctly by
 * every screen reader without any ARIA listbox machinery.
 *
 * @returns {void}
 */
function initScheduleFilters() {
    const filters = document.querySelector('.schedule__filters');
    const days = Array.from(document.querySelectorAll('.schedule-day'));

    if (!filters || days.length === 0) {
        return;
    }

    const axes = Array.from(filters.querySelectorAll('.schedule__filter[data-filter-field]'));
    const clear = filters.querySelector('.schedule__filter-clear');
    const noneMatch = document.querySelector('.schedule__none');
    const cards = Array.from(document.querySelectorAll('.class-card'));

    if (axes.length === 0 || cards.length === 0) {
        return;
    }

    // Which days were empty before anyone filtered anything. Friday is empty
    // on the live timetable, and it has to stay empty when a filter is
    // cleared rather than being "restored" to a day with classes on it.
    const emptyByDefault = new Set(
        days.filter((day) => day.classList.contains('is-empty'))
    );

    const usable = pruneUnmatchedOptions(axes, cards);

    if (usable.length === 0) {
        return;
    }

    // Revealed only now: without script the bar could do nothing, and the
    // template ships it hidden so a visitor never meets dead controls.
    filters.hidden = false;

    /**
     * The values ticked on one axis.
     *
     * @param {HTMLElement} axis - A `.schedule__filter`.
     * @returns {Set<string>} The checked values; empty means "all".
     */
    function selectionOf(axis) {
        return new Set(
            Array.from(axis.querySelectorAll('.schedule__option-input:checked'))
                .map((input) => input.value)
        );
    }

    /**
     * Hides every card that fails any active axis, and updates the empty
     * states, the summaries and the clear button that follow from it.
     *
     * @returns {void}
     */
    function apply() {
        const active = usable
            .map((axis) => [axis.dataset.filterField, selectionOf(axis)])
            .filter((pair) => pair[1].size > 0);

        cards.forEach((card) => {
            const matches = active.every(
                (pair) => pair[1].has(card.dataset[pair[0]])
            );
            card.classList.toggle('is-filtered', !matches);
        });

        days.forEach((day) => {
            const visible = day.querySelectorAll('.class-card:not(.is-filtered)');
            day.classList.toggle(
                'is-empty',
                emptyByDefault.has(day) || visible.length === 0
            );
        });

        const anyVisible = cards.some(
            (card) => !card.classList.contains('is-filtered')
        );

        if (noneMatch) {
            noneMatch.hidden = anyVisible;
        }

        if (clear) {
            clear.hidden = active.length === 0;
        }

        usable.forEach(updateSummary);
    }

    usable.forEach((axis) => {
        initDropdown(axis, usable);
        axis.addEventListener('change', apply);
    });

    if (clear) {
        clear.addEventListener('click', function () {
            filters.querySelectorAll('.schedule__option-input').forEach((input) => {
                input.checked = false;
            });

            apply();
        });
    }

    apply();
}

/**
 * Writes what an axis is filtering for onto its trigger.
 *
 * Nothing ticked shows the "All teachers" text, which is in the markup and so
 * translated by both paths. Otherwise the trigger shows the ticked names,
 * joined, read from the option labels on the page at this moment — so on
 * `/es/`, or after the in-page switcher has translated the page, they are
 * already in the right language and this file never needs a translation of
 * its own. The count badge is decorative; the names are what a screen reader
 * hears as part of the button's name.
 *
 * @param {HTMLElement} axis - A `.schedule__filter`.
 * @returns {void}
 */
function updateSummary(axis) {
    const all = axis.querySelector('.schedule__filter-all');
    const picked = axis.querySelector('.schedule__filter-picked');
    const count = axis.querySelector('.schedule__filter-count');
    const trigger = axis.querySelector('.schedule__filter-trigger');

    const names = Array.from(axis.querySelectorAll('.schedule__option'))
        .filter((option) => option.querySelector('.schedule__option-input').checked)
        .map((option) => option.querySelector('.schedule__option-label').textContent.trim());

    all.hidden = names.length > 0;
    picked.hidden = names.length === 0;
    picked.textContent = names.join(', ');

    count.hidden = names.length < 2;
    count.textContent = String(names.length);

    trigger.classList.toggle('is-narrowed', names.length > 0);
}

/**
 * Makes one axis behave as a dropdown.
 *
 * The trigger toggles the panel and moves focus to the first checkbox. The
 * arrow keys move between checkboxes and Space ticks one, which the native
 * inputs already do. Escape closes and puts focus back on the trigger;
 * clicking anywhere else, or tabbing out, closes it. Opening one axis closes
 * any other, so two panels never overlap.
 *
 * @param {HTMLElement} axis - A `.schedule__filter`.
 * @param {HTMLElement[]} allAxes - Every usable axis, so the others can be closed.
 * @returns {void}
 */
function initDropdown(axis, allAxes) {
    const trigger = axis.querySelector('.schedule__filter-trigger');
    const panel = axis.querySelector('.schedule__filter-panel');

    if (!trigger || !panel) {
        return;
    }

    /**
     * Opens or closes this axis's panel.
     *
     * @param {boolean} open - Whether it should be showing.
     * @returns {void}
     */
    function setOpen(open) {
        panel.hidden = !open;
        trigger.setAttribute('aria-expanded', String(open));
        axis.classList.toggle('is-open', open);
    }

    axis.closeDropdown = function () {
        setOpen(false);
    };

    trigger.addEventListener('click', function () {
        const opening = panel.hidden;

        allAxes.forEach((other) => {
            if (other !== axis && typeof other.closeDropdown === 'function') {
                other.closeDropdown();
            }
        });

        setOpen(opening);

        if (opening) {
            // Summaries are rebuilt on open too, in case the in-page language
            // switcher translated the option labels since the last change.
            updateSummary(axis);
            const first = panel.querySelector('.schedule__option-input');
            if (first) {
                first.focus();
            }
        }
    });

    axis.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !panel.hidden) {
            event.preventDefault();
            setOpen(false);
            trigger.focus();
            return;
        }

        if (panel.hidden || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) {
            return;
        }

        const inputs = Array.from(panel.querySelectorAll('.schedule__option-input'));
        if (inputs.length === 0) {
            return;
        }

        event.preventDefault();
        const current = inputs.indexOf(document.activeElement);
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const next = current === -1 ? 0 : (current + step + inputs.length) % inputs.length;
        inputs[next].focus();
    });

    // Tabbing out of the control closes it, so the panel never lingers over
    // the week once focus has moved on.
    axis.addEventListener('focusout', function (event) {
        if (!panel.hidden && !axis.contains(event.relatedTarget)) {
            setOpen(false);
        }
    });

    document.addEventListener('pointerdown', function (event) {
        if (!panel.hidden && !axis.contains(event.target)) {
            setOpen(false);
        }
    });
}

/**
 * Drops any option no card on the page could ever match.
 *
 * @param {HTMLElement[]} axes - The `.schedule__filter` controls.
 * @param {HTMLElement[]} cards - Every class on the page.
 * @returns {HTMLElement[]} The axes still able to narrow the week.
 */
function pruneUnmatchedOptions(axes, cards) {
    return axes.filter((axis) => {
        const field = axis.dataset.filterField;
        const present = new Set(cards.map((card) => card.dataset[field]));

        axis.querySelectorAll('.schedule__option').forEach((option) => {
            const input = option.querySelector('.schedule__option-input');
            if (!input || !present.has(input.value)) {
                option.remove();
            }
        });

        // An axis with one option left cannot narrow anything — ticking it
        // shows the same week as ticking nothing — so it is removed with its
        // label rather than left as a control that does not do anything, and
        // dropped from the list the filter reads.
        if (axis.querySelectorAll('.schedule__option').length < 2) {
            axis.remove();
            return false;
        }

        return true;
    });
}
