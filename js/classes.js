/**
 * Classes page — weekly schedule behaviour.
 *
 * Two jobs, both progressive enhancements over markup that is already
 * complete and readable without script: mark today's column, and filter the
 * week by teacher or venue.
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
 * Wires the filter selects to the week.
 *
 * Three things matter here and none of them is the filtering itself, which is
 * four lines at the bottom.
 *
 * **Nothing is keyed to a slug.** Each select declares the card attribute it
 * filters on in `data-filter-field`, and the value of an option is whatever
 * `data-<field>` the card carries. The hand-written version this replaces
 * named three teachers of six and three venues of four in both the markup and
 * the chip list; adding a teacher meant editing this file. Adding a third axis
 * now means adding a select, and nothing here changes at all.
 *
 * **Options that match no card are removed on load.** Phase 4 generates the
 * option lists from the timetable, and the first time a teacher comes off the
 * schedule without coming out of the list, the page would offer a filter whose
 * only possible result is an empty week — which reads as a broken page rather
 * than as an answer.
 *
 * **The two axes combine.** Single-select never produces an empty week, but it
 * also cannot answer "is there a class with Camila at Viveros", which is the
 * question somebody with two constraints is actually asking. The empty case is
 * handled honestly instead, by a sentence that is in the markup and therefore
 * translated like everything else.
 *
 * @returns {void}
 */
function initScheduleFilters() {
    const filters = document.querySelector('.schedule__filters');
    const days = Array.from(document.querySelectorAll('.schedule-day'));

    if (!filters || days.length === 0) {
        return;
    }

    const selects = Array.from(filters.querySelectorAll('[data-filter-field]'));
    const clear = filters.querySelector('.schedule__filter-clear');
    const noneMatch = document.querySelector('.schedule__none');
    const cards = Array.from(document.querySelectorAll('.class-card'));

    if (selects.length === 0 || cards.length === 0) {
        return;
    }

    // Which days were empty before anyone filtered anything. Friday is empty
    // on the live timetable, and it has to stay empty when a filter is
    // cleared rather than being "restored" to a day with classes on it.
    const emptyByDefault = new Set(
        days.filter((day) => day.classList.contains('is-empty'))
    );

    const usable = pruneUnmatchedOptions(selects, cards);

    if (usable.length === 0) {
        filters.hidden = true;
        return;
    }

    /**
     * Hides every card that fails any active filter, and updates the empty
     * states that follow from it.
     *
     * @returns {void}
     */
    function apply() {
        // Only the selects that are narrowing anything. An empty value is the
        // "all" option, which constrains nothing and is skipped rather than
        // compared against.
        const active = usable
            .map((select) => [select.dataset.filterField, select.value])
            .filter((pair) => pair[1] !== '');

        cards.forEach((card) => {
            const matches = active.every(
                (pair) => card.dataset[pair[0]] === pair[1]
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
    }

    usable.forEach((select) => {
        select.addEventListener('change', apply);
    });

    if (clear) {
        clear.addEventListener('click', function () {
            usable.forEach((select) => {
                select.value = '';
            });

            apply();
        });
    }

    apply();
}

/**
 * Drops any option no card on the page could ever match.
 *
 * The "all" option of each select has an empty value and is always kept; it is
 * the one option that is not a claim about the timetable.
 *
 * @param {HTMLSelectElement[]} selects - The filter controls.
 * @param {HTMLElement[]} cards - Every class on the page.
 * @returns {HTMLSelectElement[]} The selects still able to narrow the week.
 */
function pruneUnmatchedOptions(selects, cards) {
    return selects.filter((select) => {
        const field = select.dataset.filterField;
        const present = new Set(cards.map((card) => card.dataset[field]));

        Array.from(select.options).forEach((option) => {
            if (option.value !== '' && !present.has(option.value)) {
                option.remove();
            }
        });

        // A select down to nothing but "all" cannot narrow anything, so it is
        // removed with its label rather than left as a control that does not
        // do anything — and dropped from the list the filter reads, so nothing
        // goes on consulting a node that is no longer in the document.
        if (select.options.length < 2) {
            select.closest('.schedule__filter').remove();
            return false;
        }

        return true;
    });
}
