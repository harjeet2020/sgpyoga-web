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
 * Wires the filter chips to the week.
 *
 * Single-select: a chip replaces the current filter rather than adding to
 * it. Intersecting two filters on a ten-class timetable mostly produces an
 * empty week, which reads as a broken page rather than as an answer.
 *
 * @returns {void}
 */
function initScheduleFilters() {
    const chips = Array.from(document.querySelectorAll('.schedule__chips .chip'));
    const days = Array.from(document.querySelectorAll('.schedule-day'));

    if (chips.length === 0 || days.length === 0) {
        return;
    }

    const cards = Array.from(document.querySelectorAll('.class-card'));

    // Which days were empty before anyone filtered anything. Friday is empty
    // on the live timetable, and it has to stay empty when a filter is
    // cleared rather than being "restored" to a day with classes on it.
    const emptyByDefault = new Set(
        days.filter((day) => day.classList.contains('is-empty'))
    );

    /**
     * Applies one filter expression to every card and day.
     *
     * @param {string} filter - Either `all`, or `<field>:<slug>` where field
     *   is a `data-` attribute on the card (`teacher`, `location`, `style`).
     * @returns {void}
     */
    function apply(filter) {
        const [field, slug] = filter.split(':');

        cards.forEach((card) => {
            const matches = filter === 'all' || card.dataset[field] === slug;
            card.classList.toggle('is-filtered', !matches);
        });

        days.forEach((day) => {
            const visible = day.querySelectorAll('.class-card:not(.is-filtered)');
            day.classList.toggle(
                'is-empty',
                emptyByDefault.has(day) || visible.length === 0
            );
        });
    }

    chips.forEach((chip) => {
        chip.addEventListener('click', function () {
            chips.forEach((other) => {
                other.classList.toggle('is-active', other === chip);
                other.setAttribute('aria-pressed', String(other === chip));
            });

            apply(chip.dataset.filter);
        });

        chip.setAttribute('aria-pressed', String(chip.classList.contains('is-active')));
    });
}
