# Image Size Optimization Report

Generated: 2025-11-01

## Executive Summary

This report analyzes all images in the SGP Yoga website and provides optimization recommendations for each image category. Images are already using WebP format for photos, which is excellent. Key areas for optimization include:

- **PNG Graphics**: Convert to WebP or SVG where applicable
- **Logo Files**: Optimize and add multiple sizes
- **Hero Images**: Add mobile-first variants
- **Responsive Images**: Add intermediate breakpoints

---

## 1. QR Code

### Current State
| File | Size | Dimensions |
|------|------|------------|
| `sgpyoga.co_qr.png` | 484KB | 4096×4096 |

### Recommended Optimization
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **High-res** | ~80KB | 1024×1024 | Print materials, high DPI displays |
| **Standard** | ~30KB | 512×512 | Desktop/tablet display |
| **Mobile** | ~15KB | 256×256 | Mobile screens |

**Notes**: 
- QR codes should maintain sufficient resolution to be scannable (minimum 256×256)
- Consider converting to SVG for perfect scalability if the QR code is simple
- Current file is heavily oversized for web use

---

## 2. Logo Files

### Current State
| File | Size | Dimensions |
|------|------|------------|
| `logo/logoTransparent.png` | 232KB | 2945×2578 |
| `logo/logoMain.png` | 80KB | 928×919 |

### Recommended Optimization

#### logoTransparent.png
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **2x (High-DPI)** | ~40KB | 800×700 | Retina displays, headers |
| **1x (Standard)** | ~15KB | 400×350 | Standard displays |
| **Small** | ~8KB | 200×175 | Favicons, mobile headers |

#### logoMain.png
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **2x (High-DPI)** | ~35KB | 600×600 | Retina displays |
| **1x (Standard)** | ~15KB | 300×300 | Standard displays |
| **Small** | ~8KB | 150×150 | Mobile, small contexts |

**Notes**:
- Consider converting to SVG format for perfect scalability and smaller file sizes
- If SVG is not possible, convert PNG to WebP format
- Current logoTransparent is significantly oversized

---

## 3. Graphics

### Mantra

#### Current State
| File | Size | Dimensions |
|------|------|------------|
| `graphics/mantra.png` | 1.0MB | 940×940 |

#### Recommended Optimization
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **High-res (WebP)** | ~80KB | 800×800 | Desktop, tablets |
| **Standard (WebP)** | ~40KB | 512×512 | Mobile landscape |
| **Mobile (WebP)** | ~25KB | 400×400 | Mobile portrait |

### Chakra Graphics

#### Current State
| File | Size | Dimensions |
|------|------|------------|
| `graphics/chakras/chakras.png` | 1.2MB | 1024×1024 |
| `graphics/chakras/eye.png` | 1.4MB | 1024×1024 |
| `graphics/chakras/1.png` | 1.1MB | 1024×1024 |
| `graphics/chakras/2.png` | 736KB | 1024×1024 |
| `graphics/chakras/3.png` | 1.4MB | 1024×1024 |
| `graphics/chakras/4.png` | 856KB | 1024×1024 |
| `graphics/chakras/5.png` | 1.0MB | 1024×1024 |
| `graphics/chakras/6.png` | 1.1MB | 1024×1024 |
| `graphics/chakras/7.png` | 1.3MB | 1024×1024 |

#### Recommended Optimization (All Chakra Images)
| Variant | Format | Size | Dimensions | Usage |
|---------|--------|------|------------|-------|
| **Desktop** | WebP | ~60-80KB | 600×600 | Desktop displays |
| **Tablet** | WebP | ~40KB | 400×400 | Tablet displays |
| **Mobile** | WebP | ~25KB | 300×300 | Mobile displays |

**Notes**:
- All chakra PNGs are significantly oversized (averaging 1MB+)
- Converting to WebP will reduce file sizes by 90%+
- Consider if SVG format is possible for these graphics

---

## 4. Hero Images

### Home Page Hero

#### Current State
| File | Size | Dimensions | Aspect Ratio |
|------|------|------------|-------------|
| `photos/home/hero-2560.webp` | 248KB | 2560×1440 | 16:9 |
| `photos/home/hero-1920.webp` | 204KB | 1920×1080 | 16:9 |
| `photos/home/hero-1280.webp` | 120KB | 1280×720 | 16:9 |
| `photos/home/hero-720.webp` | 80KB | 720×480 | 3:2 |

#### Recommended Optimization
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **4K** | ~250KB | 2560×1440 | Large desktop monitors (>1920px) |
| **Full HD** | ~200KB | 1920×1080 | Standard desktop (1280-1920px) |
| **HD** | ~120KB | 1280×720 | Small desktop/large tablet (960-1280px) |
| **Tablet** | ~80KB | 960×540 | Tablets (768-960px) |
| **Mobile Landscape** | ~60KB | 768×432 | Mobile landscape (640-768px) |
| **Mobile Portrait** | ~50KB | 640×360 | Mobile portrait (<640px) |

**Notes**:
- Current variants are good but missing intermediate breakpoints
- Add 960px and 768px variants for tablets
- Consider a mobile-first 640px variant

### About Page Hero

#### Current State
| File | Size | Dimensions | Aspect Ratio |
|------|------|------------|-------------|
| `photos/about/hero-2560.webp` | 432KB | 2560×1440 | 16:9 |
| `photos/about/hero-1920.webp` | 276KB | 1920×1080 | 16:9 |
| `photos/about/hero-1080.webp` | 148KB | 1280×720 | 16:9 |
| `photos/about/hero-720.webp` | 80KB | 720×480 | 3:2 |

#### Recommended Optimization
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **4K** | ~300KB | 2560×1440 | Large desktop monitors (>1920px) |
| **Full HD** | ~200KB | 1920×1080 | Standard desktop (1280-1920px) |
| **HD** | ~120KB | 1280×720 | Small desktop/large tablet (960-1280px) |
| **Tablet** | ~80KB | 960×540 | Tablets (768-960px) |
| **Mobile Landscape** | ~60KB | 768×432 | Mobile landscape (640-768px) |
| **Mobile Portrait** | ~50KB | 640×360 | Mobile portrait (<640px) |

**Notes**:
- 2560 variant is larger than home hero - can be compressed more
- Add tablet-specific variants

### Classes Page Hero

#### Current State
| File | Size | Dimensions | Aspect Ratio |
|------|------|------------|-------------|
| `photos/classes/hero-2560.webp` | 192KB | 2560×1600 | 16:10 |
| `photos/classes/hero-1920.webp` | 132KB | 1920×1200 | 16:10 |
| `photos/classes/hero-1280.webp` | 84KB | 1280×800 | 16:10 |

#### Recommended Optimization
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **4K** | ~190KB | 2560×1600 | Large desktop monitors (>1920px) |
| **Full HD** | ~130KB | 1920×1200 | Standard desktop (1280-1920px) |
| **HD** | ~85KB | 1280×800 | Small desktop/large tablet (960-1280px) |
| **Tablet** | ~60KB | 960×600 | Tablets (768-960px) |
| **Mobile Landscape** | ~45KB | 768×480 | Mobile landscape (640-768px) |
| **Mobile Portrait** | ~35KB | 640×400 | Mobile portrait (<640px) |

**Notes**:
- Add mobile-specific variants (currently missing)
- Good compression already, maintain current quality

---

## 5. Section Images

### Home Page Sections

#### Classes Section

##### Current State
| File | Size | Dimensions |
|------|------|------------|
| `photos/home/classes-1200.webp` | 284KB | 1200×1200 |
| `photos/home/classes-1080.webp` | 244KB | 1080×1080 |
| `photos/home/classes-720.webp` | 136KB | 720×720 |

##### Recommended Optimization
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **Desktop** | ~150KB | 1200×1200 | Desktop displays (>1024px) |
| **Tablet** | ~100KB | 900×900 | Tablets (768-1024px) |
| **Mobile Large** | ~70KB | 720×720 | Large phones (480-768px) |
| **Mobile** | ~45KB | 480×480 | Small phones (<480px) |

**Notes**:
- Current files can be compressed further
- Add 900px and 480px variants

#### Events Section

##### Current State
| File | Size | Dimensions |
|------|------|------------|
| `photos/home/events-1200.webp` | 212KB | 1200×1200 |
| `photos/home/events-1080.webp` | 168KB | 1028×1028 |
| `photos/home/events-720.webp` | 100KB | 720×720 |

##### Recommended Optimization
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **Desktop** | ~120KB | 1200×1200 | Desktop displays (>1024px) |
| **Tablet** | ~80KB | 900×900 | Tablets (768-1024px) |
| **Mobile Large** | ~60KB | 720×720 | Large phones (480-768px) |
| **Mobile** | ~40KB | 480×480 | Small phones (<480px) |

**Notes**:
- Note the 1080 variant is actually 1028px (inconsistent sizing)
- Add intermediate breakpoints

---

## 6. Yoga Style Images (About Page)

### Current State
| File | Size | Dimensions |
|------|------|------------|
| `photos/about/aerial-1200.webp` | 116KB | 1200×1200 |
| `photos/about/aerial-1080.webp` | 104KB | 1080×1080 |
| `photos/about/aerial-720.webp` | 72KB | 720×720 |
| `photos/about/aguacate-1200.webp` | 420KB | 1200×1200 |
| `photos/about/aguacate-1080.webp` | 352KB | 1080×1080 |
| `photos/about/aguacate-720.webp` | 172KB | 720×720 |
| `photos/about/hariom-1200.webp` | 116KB | 1200×1200 |
| `photos/about/hariom-1080.webp` | 104KB | 1080×1080 |
| `photos/about/hariom-720.webp` | 72KB | 720×720 |
| `photos/about/hatha-1200.webp` | 292KB | 1200×1200 |
| `photos/about/hatha-1080.webp` | 256KB | 1080×1080 |
| `photos/about/hatha-720.webp` | 148KB | 720×720 |
| `photos/about/kundalini-1200.webp` | 460KB | 1200×1200 |
| `photos/about/kundalini-1080.webp` | 396KB | 1080×1080 |
| `photos/about/kundalini-720.webp` | 224KB | 720×720 |
| `photos/about/vinyasa-1200.webp` | 264KB | 1200×1200 |
| `photos/about/vinyasa-1080.webp` | 224KB | 1080×1080 |
| `photos/about/vinyasa-720.webp` | 116KB | 720×720 |

### Recommended Optimization (All Yoga Style Images)
| Variant | Target Size | Dimensions | Usage |
|---------|-------------|------------|-------|
| **Desktop** | 80-120KB | 1200×1200 | Desktop displays (>1024px) |
| **Tablet** | 60-80KB | 900×900 | Tablets (768-1024px) |
| **Mobile Large** | 40-60KB | 720×720 | Large phones (480-768px) |
| **Mobile** | 25-40KB | 480×480 | Small phones (<480px) |

**Notes**:
- Aguacate and Kundalini images are significantly larger than others - can be compressed more
- Add 900px variant for tablets
- Add 480px variant for mobile
- Target maximum 120KB for 1200px variant

---

## 7. Instructor Photos

### Current State (About & Classes Pages)
| File | Size | Dimensions |
|------|------|------------|
| `photos/about/aro.webp` | 108KB | 600×600 |
| `photos/about/camila.webp` | 56KB | 600×600 |
| `photos/about/dani.webp` | 100KB | 600×600 |
| `photos/about/harjeet.webp` | 132KB | 600×600 |
| `photos/about/itzel.webp` | 80KB | 600×600 |
| `photos/classes/aro.webp` | 108KB | 600×600 |
| `photos/classes/camila.webp` | 56KB | 600×600 |
| `photos/classes/dani.webp` | 100KB | 600×600 |
| `photos/classes/itzel.webp` | 80KB | 600×600 |

### Recommended Optimization
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **2x (High-DPI)** | ~80KB | 600×600 | Retina displays |
| **1x (Standard)** | ~40KB | 300×300 | Standard desktop/tablet |
| **Mobile** | ~25KB | 200×200 | Mobile devices |

**Notes**:
- Consider deduplicating files between about and classes folders
- Current sizes are reasonable but could add smaller variants for mobile
- Harjeet photo is notably larger than others

---

## 8. Testimonial Images

### Current State
| File | Size | Dimensions |
|------|------|------------|
| `photos/testimonials/testimonial1-1200.webp` | 156KB | 1200×1200 |
| `photos/testimonials/testimonial1-1080.webp` | 128KB | 1080×1080 |
| `photos/testimonials/testimonial1-720.webp` | 64KB | 720×720 |
| `photos/testimonials/testimonial2-720.webp` | 324KB | 720×720 |
| `photos/testimonials/testimonial3-720.webp` | 292KB | 720×720 |
| `photos/testimonials/testimonial4-1200.webp` | 200KB | 1200×1200 |
| `photos/testimonials/testimonial4-1080.webp` | 176KB | 1080×1080 |
| `photos/testimonials/testimonial4-720.webp` | 100KB | 720×720 |
| `photos/testimonials/testimonial5-1200.webp` | 156KB | 1200×1200 |
| `photos/testimonials/testimonial5-1080.webp` | 136KB | 1080×1080 |
| `photos/testimonials/testimonial5-720.webp` | 76KB | 720×720 |
| `photos/testimonials/testimonial6-720.webp` | 356KB | 720×720 |
| `photos/testimonials/testimonial7-720.webp` | 80KB | 720×720 |
| `photos/testimonials/testimonial8-720.webp` | 88KB | 720×720 |

### Recommended Optimization
| Variant | Target Size | Dimensions | Usage |
|---------|-------------|------------|-------|
| **Desktop** | ~80KB | 1200×1200 | Desktop displays (>1024px) |
| **Tablet** | ~60KB | 900×900 | Tablets (768-1024px) |
| **Mobile Large** | ~40KB | 720×720 | Large phones (480-768px) |
| **Mobile** | ~25KB | 480×480 | Small phones (<480px) |

**Notes**:
- Testimonials 2, 3, and 6 (720px) are significantly oversized (300KB+)
- Missing 1080/1200 variants for testimonials 2, 3, 6, 7, 8
- Standardize all testimonials to have consistent variant sets
- Add 900px and 480px variants

---

## 9. Event Category Images

### Current State
| File | Size | Dimensions |
|------|------|------------|
| `photos/events/retreats-1200.webp` | 104KB | 1200×1200 |
| `photos/events/retreats-1080.webp` | 92KB | 1080×1080 |
| `photos/events/retreats-720.webp` | 52KB | 720×720 |
| `photos/events/teacher-trainings.webp` | 112KB | 1200×1200 |
| `photos/events/teacher-trainings-1080.webp` | 100KB | 1080×1080 |
| `photos/events/teacher-trainings-720.webp` | 60KB | 720×720 |
| `photos/events/workshops-1200.webp` | 92KB | 1200×1200 |
| `photos/events/workshops-1080.webp` | 84KB | 1080×1080 |
| `photos/events/workshops-720.webp` | 56KB | 720×720 |

### Recommended Optimization
| Variant | Target Size | Dimensions | Usage |
|---------|-------------|------------|-------|
| **Desktop** | ~80KB | 1200×1200 | Desktop displays (>1024px) |
| **Tablet** | ~60KB | 900×900 | Tablets (768-1024px) |
| **Mobile Large** | ~40KB | 720×720 | Large phones (480-768px) |
| **Mobile** | ~25KB | 480×480 | Small phones (<480px) |

**Notes**:
- Current sizes are well-optimized
- Add 900px and 480px variants for better responsive coverage
- Note: teacher-trainings.webp appears to be duplicate of teacher-trainings-1200.webp

---

## 10. Unique Event Images

### Current State
| File | Size | Dimensions |
|------|------|------------|
| `photos/events/unique/aerial-teacher-training_jun2025-1080.webp` | 180KB | 1080×1080 |
| `photos/events/unique/aerial-teacher-training_jun2025-720.webp` | 96KB | 720×720 |
| `photos/events/unique/aerial-teacher-training_nov2025-1080.webp` | 184KB | 1080×1080 |
| `photos/events/unique/aerial-teacher-training_nov2025-720.webp` | 96KB | 720×720 |
| `photos/events/unique/aerial-yoga-photo_nov2025-1080.webp` | 92KB | 1080×1080 |
| `photos/events/unique/aerial-yoga-photo_nov2025-720.webp` | 56KB | 720×720 |
| `photos/events/unique/aerial-yoga-sound-healing_10oct2025-1080.webp` | 80KB | 1080×1080 |
| `photos/events/unique/aerial-yoga-sound-healing_10oct2025-720.webp` | 48KB | 720×720 |
| `photos/events/unique/aerial-yoga-sound-healing_17oct2025-1080.webp` | 80KB | 1080×1080 |
| `photos/events/unique/aerial-yoga-sound-healing_17oct2025-720.webp` | 52KB | 720×720 |
| `photos/events/unique/yoga-retreat_nov2025-1080.webp` | 108KB | 1080×1080 |
| `photos/events/unique/yoga-retreat_nov2025-720.webp` | 68KB | 720×720 |

### Recommended Optimization
| Variant | Target Size | Dimensions | Usage |
|---------|-------------|------------|-------|
| **Desktop/Tablet** | ~80KB | 1080×1080 | Desktop & tablets (>768px) |
| **Mobile Large** | ~50KB | 720×720 | Large phones (480-768px) |
| **Mobile** | ~30KB | 480×480 | Small phones (<480px) |

**Notes**:
- Current variants are good
- Consider adding 480px variant for mobile
- Aerial teacher training images are slightly larger - can be compressed more

---

## 11. Blog Images

### Current State
| File | Size | Dimensions | Aspect Ratio |
|------|------|------------|-------------|
| `photos/blog/chakras.webp` | 76KB | 1024×1024 | 1:1 |
| `photos/blog/lightBodies.webp` | 116KB | 2560×1440 | 16:9 |
| `photos/blog/ourStory.webp` | 32KB | 1200×630 | ~2:1 |
| `photos/blog/ourTeam.webp` | 272KB | 1280×720 | 16:9 |
| `photos/blog/yogaStyles.webp` | 288KB | 1920×1279 | ~3:2 |

### Recommended Optimization

#### For 1:1 Images (chakras)
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **Desktop** | ~60KB | 1024×1024 | Desktop displays |
| **Tablet** | ~40KB | 768×768 | Tablets |
| **Mobile** | ~25KB | 512×512 | Mobile devices |

#### For Wide Images (lightBodies, ourTeam, yogaStyles)
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **Desktop** | ~150KB | 1920×1080 | Large desktop (>1280px) |
| **Laptop** | ~100KB | 1280×720 | Standard laptop (960-1280px) |
| **Tablet** | ~70KB | 960×540 | Tablets (768-960px) |
| **Mobile** | ~50KB | 640×360 | Mobile devices (<768px) |

#### For Social Share Images (ourStory)
| Variant | Size | Dimensions | Usage |
|---------|------|------------|-------|
| **Social Share** | ~30KB | 1200×630 | Open Graph standard |

**Notes**:
- ourTeam and yogaStyles are quite large - need compression
- lightBodies at 2560px is unnecessarily large for blog content
- Add responsive variants for all images

---

## 12. Social Media / Open Graph Images

### Current State
| File | Size | Dimensions |
|------|------|------------|
| `photos/social/og-about.webp` | 80KB | 1200×630 |
| `photos/social/og-blog.webp` | 32KB | 1200×630 |
| `photos/social/og-classes.webp` | 76KB | 1200×630 |
| `photos/social/og-events.webp` | 36KB | 1200×630 |
| `photos/social/og-home.webp` | 52KB | 1200×630 |

### Recommended Optimization
| Variant | Target Size | Dimensions | Usage |
|---------|-------------|------------|-------|
| **Open Graph** | 30-50KB | 1200×630 | Facebook, LinkedIn, Twitter |

**Notes**:
- Current sizes are excellent and properly formatted
- 1200×630 is the standard Open Graph size (ratio ~1.91:1)
- og-about and og-classes could be compressed slightly more
- These images should remain single-size (no responsive variants needed)

---

## Priority Optimization Recommendations

### High Priority (Immediate Action)
1. **Convert PNG Graphics to WebP**
   - Chakra images (9 files): Reduce from ~1MB each to ~60KB each
   - Mantra graphic: Reduce from 1MB to ~80KB
   - **Potential savings: ~9MB → ~600KB (93% reduction)**

2. **Optimize Logo Files**
   - Create responsive variants for both logos
   - Convert to WebP or SVG
   - **Potential savings: 312KB → ~80KB (74% reduction)**

3. **Compress Oversized Testimonials**
   - testimonial2, 3, 6 (720px variants)
   - **Potential savings: ~980KB → ~120KB (88% reduction)**

4. **Optimize QR Code**
   - Reduce from 4096px to appropriate sizes
   - **Potential savings: 484KB → ~125KB total (74% reduction)**

### Medium Priority (Phase 2)
1. **Add Missing Responsive Variants**
   - Add 480px mobile variants across all image sets
   - Add 900px tablet variants where missing
   - Estimated 50+ new variants needed

2. **Compress Large Blog Images**
   - ourTeam and yogaStyles images
   - **Potential savings: 560KB → ~250KB (55% reduction)**

3. **Standardize Testimonial Variants**
   - Ensure all testimonials have 1200, 1080, and 720 variants
   - Add missing variants for testimonials 2, 3, 6, 7, 8

### Low Priority (Future Enhancement)
1. **Add WebP with JPEG/PNG Fallback**
   - Implement picture element with fallback formats for older browsers

2. **Implement Lazy Loading**
   - Add loading="lazy" attribute to below-the-fold images

3. **Consider Next-Gen Formats**
   - Evaluate AVIF format for even better compression (where supported)

---

## Implementation Guide

### Recommended Tools

#### For Batch Conversion & Optimization
```bash
# Install ImageMagick and cwebp
brew install imagemagick webp

# Batch convert PNG to WebP with quality 85
for file in *.png; do
  cwebp -q 85 "$file" -o "${file%.png}.webp"
done

# Resize and optimize
for size in 480 720 900 1080 1200; do
  magick input.webp -resize ${size}x${size} -quality 85 output-${size}.webp
done
```

#### Online Tools
- **Squoosh** (squoosh.app): Google's image optimization tool
- **TinyPNG/TinyWebP**: Excellent batch optimization

### HTML Implementation Pattern

For responsive images, use the picture element:

```html
<picture>
  <source media="(min-width: 1200px)" srcset="image-1200.webp">
  <source media="(min-width: 900px)" srcset="image-900.webp">
  <source media="(min-width: 720px)" srcset="image-720.webp">
  <source media="(min-width: 480px)" srcset="image-480.webp">
  <img src="image-480.webp" alt="Description" loading="lazy">
</picture>
```

---

## Expected Performance Impact

### Current Total Size (Estimated)
- PNG Graphics: ~10.5MB
- WebP Photos: ~15.2MB
- **Total: ~25.7MB**

### Optimized Total Size (Estimated)
- Converted Graphics (WebP): ~0.7MB
- Optimized Photos (WebP): ~12.8MB
- **Total: ~13.5MB**

### Overall Savings
- **Reduction: ~12.2MB (47% smaller)**
- **Page Load Time**: Expected 30-50% improvement
- **Mobile Data Usage**: Reduced by nearly half
- **SEO Impact**: Positive (faster load times improve rankings)

---

## Checklist

- [ ] Convert all PNG graphics to WebP format
- [ ] Optimize logo files and create responsive variants
- [ ] Compress oversized testimonial images
- [ ] Optimize QR code for web use
- [ ] Add 480px mobile variants for all image sets
- [ ] Add 900px tablet variants where missing
- [ ] Compress blog images (ourTeam, yogaStyles)
- [ ] Standardize testimonial image variants
- [ ] Update HTML to use picture elements
- [ ] Add lazy loading attributes
- [ ] Test on various devices and connection speeds
- [ ] Validate Open Graph images still work correctly

---

## Notes

- All recommendations maintain visual quality while optimizing file size
- WebP format provides 25-35% better compression than JPEG/PNG
- Mobile-first approach prioritizes smaller variants for better performance
- Responsive images ensure users download only what they need
- Current WebP photos are already well-optimized; focus is on adding variants
- PNG graphics show the largest opportunity for improvement

**Last Updated**: 2025-11-01
