# assets-src: never deployed

This folder holds source and original files that the website does **not** serve. It sits outside `assets/`, so neither `npm run build:copy` nor the blog's asset passthrough copies it into `_site/`.

## `originals/`

High-resolution originals kept when a served image was re-encoded or replaced (Sept 2026 SEO & speed pass):

| Files | Why they're here | What the site serves now |
|---|---|---|
| `testimonials/testimonial{2,3,6}-*.webp` | Exported at quality 100 (near-lossless), 5–8× heavier than the rest of the site | Re-encoded from the 1200 px master at quality 92, the site standard (PSNR ≈ 45 dB, visually identical) |
| `graphics/chakras/{1..7}.png` | 0.7–1.5 MB PNGs displayed at 240 px in the chakras blog post | `assets/graphics/chakras/{1..7}-{480,720}.webp` at quality 92 |

Once you're happy with how the replacements look on a retina screen, these can be deleted (or moved to cloud storage) to slim down the repository.
