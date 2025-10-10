# About Page - Image Requirements

This document lists all the images needed for the about.html page. Place these images in the appropriate folders under `assets/photos/inUse/`.

## Section 1: Yoga & Benefits
**Folder:** `assets/photos/inUse/about/`
- `yoga-720.webp` - Mobile/small screens (720px width)
- `yoga-1080.webp` - Tablet screens (1080px width)
- `yoga-1200.webp` - Desktop screens (1200px width)

**Image description:** A serene yoga practice photo showing someone in a meditative or flowing pose, preferably with natural light.

---

## Section 3: Teachers
**Folder:** `assets/photos/inUse/teachers/`

We need 5 teacher photos:
- `teacher1.webp` - Harjeet Singh (square aspect ratio, 500x500px minimum)
- `teacher2.webp` - María González (square aspect ratio, 500x500px minimum)
- `teacher3.webp` - Sofia Martínez (square aspect ratio, 500x500px minimum)
- `teacher4.webp` - Carlos Hernández (square aspect ratio, 500x500px minimum)
- `teacher5.webp` - Ana López (square aspect ratio, 500x500px minimum)

**Image description:** Professional headshots or portrait photos, preferably with a clean background. Images will be displayed in circular frames.

---

## Section 4: Spaces
**Folder:** `assets/photos/inUse/spaces/`

### Space 1: Roma Studio
- `space1-720.webp` - Mobile/small screens (720px width)
- `space1-1080.webp` - Tablet screens (1080px width)
- `space1-1200.webp` - Desktop screens (1200px width)

**Image description:** Interior photo of the Roma studio showing the practice space, preferably with natural light, bamboo floors visible, and a clean, inviting atmosphere.

### Space 2: Condesa Sanctuary
- `space2-720.webp` - Mobile/small screens (720px width)
- `space2-1080.webp` - Tablet screens (1080px width)
- `space2-1200.webp` - Desktop screens (1200px width)

**Image description:** Interior photo of the Condesa studio, ideally showing the garden view or intimate setting mentioned in the description.

---

## Image Specifications

### General Guidelines:
1. **Format:** WebP for optimal performance
2. **Quality:** 80-85% compression for good balance between quality and file size
3. **Color:** Warm, natural tones that complement the site's color palette
4. **Lighting:** Natural light preferred, avoid harsh shadows

### Aspect Ratios:
- **Yoga section image:** 4:5 (portrait orientation)
- **Teacher photos:** 1:1 (square)
- **Space images:** 16:9 or 4:3 (landscape orientation)

### Responsive Sizes:
- **720px:** Mobile devices
- **1080px:** Tablets and small desktops
- **1200px:** Large desktops and high-resolution displays

---

## Creating Placeholder Images

If real photos are not yet available, you can use:
1. **Unsplash** (https://unsplash.com/) - Search for "yoga studio", "yoga teacher", "meditation space"
2. **Pexels** (https://www.pexels.com/) - Similar search terms
3. **Placeholder services** - Use services like placeholder.com for temporary images

### Converting to WebP:
Use online tools or command line:
```bash
# Using cwebp (Google's WebP encoder)
cwebp -q 85 input.jpg -o output.webp
```

---

## Notes
- All images should be optimized before deployment
- Ensure images have appropriate alt text (already included in HTML)
- Consider using progressive loading for better perceived performance
- The HTML already includes proper responsive image markup using `<picture>` elements
