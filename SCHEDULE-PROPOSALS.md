# Phase 3b — schedule redesign, proposal 1: day cards

**This is the `sched-cards` branch.** The alternative is `sched-grid`. Both
are rough first passes built in one session against the real ten classes,
neither has been opened in a browser, and both are meant to be looked at and
then argued with. Pick one, iterate it to production quality on its branch,
merge it, delete the other.

Read `../PROGRESS.md` (Phase 3b) and `../MIGRATION.md` first — the contracts
about namespaces, colour and the legend apply to whichever wins.

## What this proposal argues

**Days across, classes in time order within each day, and the time printed on
the card rather than encoded as a position.**

The grid this replaces is a fixed 7 × 5 matrix in which 25 of 35 cells are
empty spacers, and — the part that matters more — its time axis is not a time
axis. The rows are 09:00, 10:00, 10:30, 19:00, 20:00, all drawn at the same
height, so thirty minutes occupies exactly as much space as eight and a half
hours. It borrows the visual grammar of a proportional calendar while making
a promise the data cannot keep, and it gets worse as the school grows: a
class at 11:15 adds a whole row of seven cells, six of them empty.

This proposal gives up the axis rather than lying about it. Duration becomes
text on the card, which is what both the old grid and the admin panel already
did in practice. The consequence worth knowing is that **a class of any
length — 45, 75, 120 — renders correctly with no layout consequences at
all.** Nothing has to be re-derived when a duration changes.

`sched-grid` takes the opposite bet: keep a real proportional axis and solve
its emptiness by collapsing the gaps. That is the choice being put.

## What changed beyond the layout

- **Everything the card knows is visible.** The old card showed only the
  class name and revealed duration, venue and teacher on hover, which cost a
  visitor one hover per class to answer "who teaches Tuesday morning".
- **Colour is an accent, not a fill.** White on the aerial mauve is about
  3.6:1 and fails AA for the meta text. On a 3px edge the 3:1 non-text
  threshold applies and every palette colour clears it. The colour arrives
  as `--style-accent` from `css/schedule-colours.css`; the stylesheet knows
  no style names.
- **Filters by teacher and venue.** Nine of ten classes are in the aerial
  family, so filtering by style sorts the week into one pile and one card.
  Teacher and venue are the axes that actually divide this timetable.
- **The legend lists only top-level styles in use.** It goes from three
  entries to two, because the hand-written one advertises Vinyasa Yoga and
  the timetable has held no vinyasa class for months.
- **Rox renders as initials.** `rox-200.webp` has never existed, so the live
  site is serving a broken image inside a hover panel.
- **Today is marked, not scrolled to.** `scrollToToday()` is gone.
- **The week wraps: 7 → 4 → 3 → 2 → 1 columns.** It never scrolls sideways.
  At phone width the day heading goes sticky and the card lays out across
  the row, with the time in a narrow leading rail.

## Known rough edges

Nothing here has been seen rendered. In rough order of how likely it is to
need work:

1. **The phone card at ≤479px** is a two-column grid whose left rail is a
   fixed `4.25rem`. That number is a guess and the row gaps around the
   teacher line probably want adjusting.
2. **The sticky day heading uses `top: 80px`**, the navbar's height as
   declared in `navbar.css`. If the navbar ever gets shorter on mobile this
   silently leaves a gap.
3. **Seven columns at 1200px gives about 153px each**, which wraps
   "Restorative Aerial Yoga" onto two lines and makes those cards taller
   than their neighbours. That may be fine or may want a smaller type size.
4. **The section's white fades** are pseudo-elements at `z-index: 0` with
   the container lifted to `1`. Worth confirming nothing else in the section
   paints underneath them.
5. **Filtering is single-select.** Intersecting two filters on ten classes
   mostly yields an empty week.
6. **No booking affordance.** The old card logged to the console on click;
   this one does nothing. Whatever the call to action turns out to be, the
   card has room for it under the teacher line.

## How the markup was produced

By script, from the ten slots as `school_schedule_slots` holds them — which
is the point, since Phase 4 has to generate exactly this from the database.
Anything that needed a judgement call per card would disqualify the design.
The generator used here was a throwaway; Phase 4 writes the real one in Node.

## Files touched

```
classes.html              schedule + legend sections replaced
css/classes.css           schedule + legend blocks replaced; stale rules
                          purged from the responsive and print blocks
css/schedule-colours.css  new — hand-written stand-in for the file the
                          Phase 4 generator emits
js/classes.js             rewritten: today marker + filters
js/i18n.js                registers the `schedule` namespace for this page
locales/{en,es}/schedule.json   new, generated-shaped, hand-mirrored
locales/{en,es}/classes.json    per-style legend entries moved out per C1;
                          schedule copy and duration.unit added
```
