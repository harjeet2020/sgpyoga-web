# Certification Programs Page Specification

> **Status**: Complete - Ready for Implementation
> **Last Updated**: January 2026
> **Author**: Development Team

---

## Table of Contents

1. [Overview](#overview)
2. [Navigation Updates](#navigation-updates)
3. [Page Structure](#page-structure)
4. [Section Details](#section-details)
5. [Content Requirements](#content-requirements)
6. [Technical Implementation](#technical-implementation)
7. [Content Pending](#content-pending)

---

## Overview

### Purpose

Create a dedicated certifications page for SGP Yoga to showcase teacher training programs, starting with the **100-Hour Aerial Yoga Certification**. This page will serve as a comprehensive resource for prospective students interested in becoming certified yoga instructors.

### Goals

- Provide clear, compelling information about certification programs
- Establish credibility through curriculum details and teacher profiles
- Build trust through student testimonials
- Drive conversions through strategic CTAs (WhatsApp/Email contact)
- Maintain visual consistency with existing site design
- Support bilingual content (English/Spanish)

### Target Audience

- Yoga practitioners seeking to deepen their practice
- Aspiring yoga teachers looking for certification
- Existing teachers seeking specialized credentials (aerial yoga)
- International students (hence bilingual support)

---

## Navigation Updates

### New "Certifications" Dropdown Menu

**Location**: Main navbar, positioned **between Events and Blog**

**Menu Order**:
```
Home | About | Classes | Events | Certifications ▾ | Blog
                                 └── 100-Hour Aerial Yoga
```

**Dropdown Structure**:
```
Certifications ▾
└── 100-Hour Aerial Yoga → links to /certifications/aerial-yoga-100.html
```

**Behavior**:
- **Parent item ("Certifications")**: Does NOT navigate anywhere on click
- **Hover**: Reveals dropdown menu with available programs
- **Dropdown items**: Clicking navigates to the corresponding certification page
- Keyboard accessible (arrow keys, Enter, Escape)
- Mobile: Expands inline within hamburger menu (tap to expand, tap item to navigate)
- Active state: Underline indicator when on any certification page

**Future Scalability**:
- Structure allows adding more programs (200-Hour, Specialty certifications, etc.)
- Dropdown expands automatically as new items are added

### Files to Update

| File | Changes |
|------|---------|
| `index.html` | Add Certifications dropdown to navbar |
| `about.html` | Add Certifications dropdown to navbar |
| `classes.html` | Add Certifications dropdown to navbar |
| `events.html` | Add Certifications dropdown to navbar |
| `blog.html` | Add Certifications dropdown to navbar |
| `css/navbar.css` | Add dropdown styles for nav menu items |
| `js/navbar.js` | Add dropdown interaction logic (hover, keyboard nav) |
| `locales/en/common.json` | Add `nav.certifications`, `nav.certifications.aerial100` |
| `locales/es/common.json` | Spanish translations for nav items |

---

## Page Structure

### File: `certifications/aerial-yoga-100.html`

### URL: `/certifications/aerial-yoga-100.html`

### Sections (Top to Bottom)

| # | Section | Purpose |
|---|---------|---------|
| 1 | Hero Section | Visual impact with title overlay |
| 2 | Introduction Section | Aerial yoga description & target audience |
| 3 | Curriculum Section | 8 expandable modules (accordion) |
| 4 | Instructors Section | Harjeet & Camila profiles |
| 5 | Testimonials Section | Student reviews carousel |
| 6 | CTA Section | Schedule, pricing & contact links |

---

## Section Details

### 1. Hero Section

**Purpose**: Create immediate visual impact and communicate the certification offering

**Layout**:
- Full-width background image (aerial yoga in action)
- Dark gradient overlay for text readability
- Centered content with title and subtitle
- Height: 70vh (consistent with other pages)
- Parallax scrolling effect (background-attachment: fixed)

**Content**:
```
Title: "100-Hour Aerial Yoga Teacher Training"
Subtitle: "Transform your practice. Inspire others."
```

**Hero Image** (confirmed existing):
```
assets/photos/certifications/
├── hero-640.webp    (mobile)
├── hero-768.webp    (tablet portrait)
├── hero-960.webp    (tablet landscape)
├── hero-1280.webp   (desktop)
├── hero-1920.webp   (large desktop)
└── hero-2560.webp   (4K/retina)
```

**Technical Notes**:
- Use existing responsive image sources (WebP)
- Breakpoints: 640px, 768px, 960px, 1280px, 1920px
- Preload hero image for performance
- Use `data-i18n` attributes for translations

---

### 2. Introduction Section

**Purpose**: Explain what aerial yoga is and who the program is designed for

**Layout**: Single column, centered text
- Standard section padding (100px vertical)
- Max-width container (~800px for readability)
- Clean, elegant typography

**Content** (placeholder - to be refined):

```
Section Title: "Discover Aerial Yoga"

Paragraph 1:
Aerial yoga combines traditional yoga postures with the support of a silk hammock
suspended from the ceiling. This unique practice allows you to explore poses from
a new perspective—floating, inverting, and stretching in ways that ground-based
yoga simply cannot offer. The hammock supports your body weight, making challenging
poses more accessible while deepening stretches and building core strength.

Paragraph 2:
Our 100-hour certification program goes beyond the physical practice. You'll learn
the art of teaching aerial yoga safely and effectively, understanding body mechanics,
rigging fundamentals, and how to guide students of all levels through transformative
aerial sequences. Whether you're a yoga teacher looking to expand your offerings or
a dedicated practitioner ready to share your passion, this training provides the
foundation you need.

Target Audience Title: "This Program Is For You If..."

Target Audience List:
• You're a certified yoga teacher wanting to add aerial yoga to your teaching repertoire
• You're a dedicated yoga practitioner ready to deepen your practice and inspire others
• You have a background in movement arts (dance, gymnastics, Pilates) and want to teach aerial yoga
• You're passionate about yoga and eager to embark on your teaching journey
```

**Design Notes**:
- Keep text focused and scannable
- Consider subtle decorative elements (dividers, accent colors)
- Ensure sufficient line-height for readability
- Target audience could use checkmark icons or styled list items

---

### 3. Curriculum Section (Module List)

**Purpose**: Provide transparent overview of what students will learn

**Layout**: Accordion (expandable modules)

**Structure**:
```
Section Title: "What You'll Learn" (or "Curriculum")

┌─────────────────────────────────────────────────────────┐
│ ▶ Module 1: [Title]                              [+]    │
├─────────────────────────────────────────────────────────┤
│ ▶ Module 2: [Title]                              [+]    │
├─────────────────────────────────────────────────────────┤
│ ▶ Module 3: [Title]                              [+]    │
├─────────────────────────────────────────────────────────┤
│ ...                                                     │
├─────────────────────────────────────────────────────────┤
│ ▼ Module 8: [Title]                              [-]    │  ← Expanded
│   • Topic 1                                             │
│   • Topic 2                                             │
│   • Topic 3                                             │
│   Hours: X hours                                        │
└─────────────────────────────────────────────────────────┘
```

**Module Count**: 8 modules

**Module Content:**

```
Module 1: Introduction to Aerial Yoga
• History and evolution of the practice
• Physical, mental and emotional benefits
• Counterindications and precautions
• Tying the silk hammock

Module 2: Yogic Philosophy
• The spiritual meaning of the practice
• Chakras, nadis & the human energy system
• Bandhas, koshas, yamas & niyamas
• Patanjali yoga sutras

Module 3: Yogic Anatomy
• Joints, muscles & fascia
• The nervous system
• The endocrine system

Module 4: Aerial Yoga Fundamentals
• Basic postures
• Joint grips
• Silk hammock heights
• Adjustments and variations
• Open and close hammock

Module 5: Mobility & Technique
• Stretches
• Hip opening
• Arches
• Twists
• Inverted postures

Module 6: Sequences & Fluidity
• Vinyasa yoga in the silk hammock (sun/moon salutations)
• How to design a balanced aerial yoga sequence
• Fluidity of aerial movement
• Variations & dynamics
• Safe posture transitions

Module 7: Pranayama, Mantra & Meditation
• The importance of the breath in yoga & meditation
• Breathwork exercises (pranayama)
• The therapeutic qualities of sound
• Throat opening & mantra practice
• The art of meditation
• Aerial yoga applications

Module 8: Teaching Methodology
• How to lead a class
• Assistance & adjustments in aerial yoga
• Class preparation with level adjustment
• How to adapt your classes to people with physical limitations
```

**Expanded Content Per Module**:
- List of topics covered (as shown above)
- Hours allocated (optional - can add later if needed)

**Interaction**:
- Click/tap to expand/collapse
- Smooth height animation
- Only one module open at a time (OR allow multiple - TBD)
- Keyboard accessible (Enter/Space to toggle)
- ARIA attributes for accessibility

**Technical Notes**:
- Create reusable accordion component
- CSS transitions for smooth expand/collapse
- Store state in JS (no page reload)

---

### 4. Instructors Section

**Purpose**: Build trust by showcasing qualified teachers

**Layout**: 2 cards, vertically stacked (centered)
- Cards displayed one above the other
- Consistent with teacher-card pattern from about page
- Centered within container

**Visual Layout**:
```
        ┌────────────────────────────────┐
        │         [Harjeet Photo]        │
        │                                │
        │           Harjeet              │
        │      Specialty / Title         │
        │         Brief bio...           │
        └────────────────────────────────┘

        ┌────────────────────────────────┐
        │         [Camila Photo]         │
        │                                │
        │           Camila               │
        │      Specialty / Title         │
        │         Brief bio...           │
        └────────────────────────────────┘
```

**Content Source**: Reuse existing images and text from about page
- Reference `about:teachers.harjeet` and `about:teachers.camila` translations
- Or duplicate into certifications namespace with any customizations

**Card Structure**:
```html
<div class="instructor-card">
  <div class="instructor-photo">
    <picture><!-- responsive image --></picture>
  </div>
  <div class="instructor-info">
    <h3>Name</h3>
    <span class="instructor-specialty">Title/Specialty</span>
    <p>Bio text...</p>
  </div>
</div>
```

**Technical Notes**:
- Reuse teacher-card CSS patterns from `about.css`
- Responsive images with lazy loading
- Consider linking to full bio on about page (optional)

---

### 5. Testimonials Section

**Purpose**: Provide social proof through graduate experiences

**Layout**: Reuse existing testimonials carousel component

**Structure**:
```
"Quote from graduate about their experience in the program..."

— Student Name
  Country | Current Role/Studio (if applicable)
```

**Content**: To be provided (3-5 testimonials from program graduates)

**Technical Implementation**:
- Initialize `TestimonialsSlideshow` class
- Create certification-specific testimonial data in translation files
- Reuse `/css/testimonials.css` styles
- Same autoplay interval (12 seconds) and controls

**Component Reuse**:
```javascript
// In certifications.js
new TestimonialsSlideshow({
  container: '.cert-testimonials-slideshow',
  autoplayInterval: 12000
});
```

---

### 6. CTA Section

**Purpose**: Convert interest into action with clear next steps

**Layout**:
- Distinct background (light accent color or subtle pattern)
- Centered content
- Clear visual hierarchy
- Prominent contact buttons

**Content**:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              Ready to Begin Your Journey?                       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  NEXT TRAINING                                          │   │
│   │                                                         │   │
│   │  March 7 - May 10, 2026                                 │   │
│   │  Weekends (Saturdays & Sundays)                         │   │
│   │  Aguacate Studio, Mexico City                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  INVESTMENT                                             │   │
│   │                                                         │   │
│   │  $25,000 MXN  - Paid in full                            │   │
│   │  $28,000 MXN  - Payment plan                            │   │
│   │               ($12,000 + $8,000 + $8,000 over 3 months) │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│           [  WhatsApp  ]     [  Email  ]                        │
│                                                                 │
│            Questions? We're happy to help!                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Program Details**:
| Field | Value |
|-------|-------|
| Dates | March 7 - May 10, 2026 |
| Schedule | Weekends (Saturdays & Sundays) |
| Location | Aguacate Studio, Mexico City |
| Price (full) | $25,000 MXN |
| Price (plan) | $28,000 MXN ($12,000 + $8,000 + $8,000) |

**Contact Links**:
| Button | Link | Notes |
|--------|------|-------|
| WhatsApp | `https://wa.me/525539061305` | Opens WhatsApp chat |
| Email | `mailto:satgurprasaadyoga@gmail.com` | Opens email client |

**Button Styles**: Use existing `.btn-elegant` class

**Future Enhancement**: "Final spots discount" banner can be added later when needed

---

## Content Requirements

### Images Needed

| Image | Purpose | Dimensions | Status |
|-------|---------|------------|--------|
| Hero background | Main visual | 2560x1440 max | ✅ Exists at `assets/photos/certifications/` |
| Harjeet photo | Instructor | Existing | ✅ Reuse from about |
| Camila photo | Instructor | Existing | ✅ Reuse from about |
| Student photos | Testimonials | Various | ⏳ Pending (to be added later) |

**Testimonial Photo Naming Convention:**
```
assets/photos/certifications/
├── ika-hermenegilda-200.webp
├── ika-hermenegilda-400.webp
├── dani-mexico-200.webp       (distinguish from Colombia Dani)
├── dani-mexico-400.webp
├── itzel-200.webp
├── itzel-400.webp
├── dani-colombia-200.webp
└── dani-colombia-400.webp
```
*Note: Resolution variants (e.g., `-200`, `-400`, `-1200`) indicate image width in pixels.*

### Copy/Text Checklist

| Content | Status | Notes |
|---------|--------|-------|
| Hero title and subtitle | ✅ Defined | See Section Details |
| Introduction paragraphs | ✅ Placeholder | Draft copy in spec, to be refined |
| Module titles (8) | ✅ Complete | All 8 modules defined |
| Module descriptions (8) | ✅ Complete | All topics per module defined |
| Instructor bios | ✅ Existing | Reuse from about page |
| Testimonials (4) | ✅ Complete | EN translations + ES originals |
| CTA copy | ✅ Defined | See Section Details |
| Program details | ✅ Defined | Dates, pricing, location |
| All Spanish translations | ✅ Auto-generated | Will create EN + ES files together |

---

## Technical Implementation

### New Files to Create

```
sgpyoga/
├── certifications/
│   └── aerial-yoga-100.html      # Main certification page
├── es/
│   └── certifications/
│       └── aerial-yoga-100.html  # Spanish version (generated by build)
├── css/
│   └── certifications.css        # Page-specific styles (accordion, layout)
├── js/
│   └── certifications.js         # Accordion logic, testimonials init
└── locales/
    ├── en/
    │   └── certifications.json   # English translations
    └── es/
        └── certifications.json   # Spanish translations
```

---

## Translation File Strategy

### Namespace: `certifications`

A new namespace will be created following the existing pattern (like `home`, `about`, `classes`, `events`).

**Page initialization will load:**
```javascript
await i18n.init({
  namespaces: ['common', 'certifications'],
  defaultLang: 'en'
});
```

### Files to Create

#### `locales/en/certifications.json`
```json
{
  "hero": {
    "title": "100-Hour Aerial Yoga Teacher Training",
    "subtitle": "Transform your practice. Inspire others."
  },
  "intro": {
    "title": "Discover Aerial Yoga",
    "paragraph1": "Aerial yoga combines traditional yoga postures with the support of a silk hammock suspended from the ceiling. This unique practice allows you to explore poses from a new perspective—floating, inverting, and stretching in ways that ground-based yoga simply cannot offer. The hammock supports your body weight, making challenging poses more accessible while deepening stretches and building core strength.",
    "paragraph2": "Our 100-hour certification program goes beyond the physical practice. You'll learn the art of teaching aerial yoga safely and effectively, understanding body mechanics, rigging fundamentals, and how to guide students of all levels through transformative aerial sequences. Whether you're a yoga teacher looking to expand your offerings or a dedicated practitioner ready to share your passion, this training provides the foundation you need.",
    "audienceTitle": "This Program Is For You If...",
    "audienceItems": [
      "You're a certified yoga teacher wanting to add aerial yoga to your teaching repertoire",
      "You're a dedicated yoga practitioner ready to deepen your practice and inspire others",
      "You have a background in movement arts (dance, gymnastics, Pilates) and want to teach aerial yoga",
      "You're passionate about yoga and eager to embark on your teaching journey"
    ]
  },
  "curriculum": {
    "title": "What You'll Learn",
    "modules": {
      "module1": {
        "title": "Introduction to Aerial Yoga",
        "topics": [
          "History and evolution of the practice",
          "Physical, mental and emotional benefits",
          "Counterindications and precautions",
          "Tying the silk hammock"
        ]
      },
      "module2": {
        "title": "Yogic Philosophy",
        "topics": [
          "The spiritual meaning of the practice",
          "Chakras, nadis & the human energy system",
          "Bandhas, koshas, yamas & niyamas",
          "Patanjali yoga sutras"
        ]
      },
      "module3": {
        "title": "Yogic Anatomy",
        "topics": [
          "Joints, muscles & fascia",
          "The nervous system",
          "The endocrine system"
        ]
      },
      "module4": {
        "title": "Aerial Yoga Fundamentals",
        "topics": [
          "Basic postures",
          "Joint grips",
          "Silk hammock heights",
          "Adjustments and variations",
          "Open and close hammock"
        ]
      },
      "module5": {
        "title": "Mobility & Technique",
        "topics": [
          "Stretches",
          "Hip opening",
          "Arches",
          "Twists",
          "Inverted postures"
        ]
      },
      "module6": {
        "title": "Sequences & Fluidity",
        "topics": [
          "Vinyasa yoga in the silk hammock (sun/moon salutations)",
          "How to design a balanced aerial yoga sequence",
          "Fluidity of aerial movement",
          "Variations & dynamics",
          "Safe posture transitions"
        ]
      },
      "module7": {
        "title": "Pranayama, Mantra & Meditation",
        "topics": [
          "The importance of the breath in yoga & meditation",
          "Breathwork exercises (pranayama)",
          "The therapeutic qualities of sound",
          "Throat opening & mantra practice",
          "The art of meditation",
          "Aerial yoga applications"
        ]
      },
      "module8": {
        "title": "Teaching Methodology",
        "topics": [
          "How to lead a class",
          "Assistance & adjustments in aerial yoga",
          "Class preparation with level adjustment",
          "How to adapt your classes to people with physical limitations"
        ]
      }
    }
  },
  "instructors": {
    "title": "Meet Your Teachers",
    "subtitle": "Learn from experienced aerial yoga practitioners"
  },
  "testimonials": {
    "title": "What Our Graduates Say",
    "subtitle": "Hear from students who completed the program",
    "items": [
      {
        "quote": "Completing the aerial yoga training was fulfilling one of my life goals. From the beauty of the suspended body comes an awareness of balance, strength, and coordination to extend movement in the air. This practice allows me to feel more confident in myself, accept the nature of my body, and work on sensuality in a subtle way. I didn't hesitate to take the certification because I knew I would have a great teacher who has accompanied me through this long journey and allowed me to plant seeds and blossom in the world of yoga. She continues to support me through the process, and the fact that she believes in me and shares her knowledge and experiences makes my being expand with joy.",
        "name": "Ika Hermenegilda",
        "location": "Colombia"
      },
      {
        "quote": "For me, the certification was a beautiful process in which I could trust myself and my abilities. Thanks to everything they shared with us, I was able to reflect on many things about my life—how I relate to the world, how I process lived experiences. All the practices taught me so much about myself, and also about opening up to others, observing, listening, receiving. The certification came at the right moment for me because I was going through so many things I couldn't understand, and the space I had during the training helped me channel that noise and digest it. I felt accompanied at every moment, with excellent guidance. I'm deeply grateful to have been part of this learning experience that broadened my perspective.",
        "name": "Dani",
        "location": "Mexico"
      },
      {
        "quote": "The training was a complete physical and mental challenge for me. Cami as a teacher is excellent—she helped me overcome my fear of certain postures and, above all, develop the strength and confidence to perform them. My classmates were a beautiful and essential support throughout the entire training. The theoretical part taught by Harjeet was very comprehensive; he's a very patient teacher, passionate when transmitting his knowledge. Both of them held our hands from start to finish—I'm very grateful for that. The certification helped me gain more confidence and security to teach new people how beautiful aerial yoga is.",
        "name": "Itzel",
        "location": "Mexico"
      },
      {
        "quote": "From day one, I understood that aerial yoga isn't just about hanging from a fabric. My sankalpa for this experience was: 'I want to remember my power, inhabit my body with presence, and guide others to find confidence in theirs.' With the silk, I discovered that letting go doesn't always mean falling—sometimes letting go means holding myself differently.",
        "name": "Dani",
        "location": "Colombia"
      }
    ]
  },
  "cta": {
    "title": "Ready to Begin Your Journey?",
    "nextTraining": {
      "label": "Next Training",
      "dates": "March 7 - May 10, 2026",
      "schedule": "Weekends (Saturdays & Sundays)",
      "location": "Aguacate Studio, Mexico City"
    },
    "investment": {
      "label": "Investment",
      "fullPrice": "$25,000 MXN",
      "fullPriceNote": "Paid in full",
      "planPrice": "$28,000 MXN",
      "planNote": "Payment plan",
      "planBreakdown": "$12,000 + $8,000 + $8,000 over 3 months"
    },
    "buttons": {
      "whatsapp": "WhatsApp",
      "email": "Email"
    },
    "helpText": "Questions? We're happy to help!"
  }
}
```

#### `locales/es/certifications.json`
```json
{
  "hero": {
    "title": "Formación de Profesores de Yoga Aéreo - 100 Horas",
    "subtitle": "Transforma tu práctica. Inspira a otros."
  },
  "intro": {
    "title": "Descubre el Yoga Aéreo",
    "paragraph1": "El yoga aéreo combina posturas tradicionales de yoga con el apoyo de una hamaca de seda suspendida del techo. Esta práctica única te permite explorar posturas desde una nueva perspectiva: flotando, invirtiéndote y estirándote de maneras que el yoga en el suelo simplemente no puede ofrecer. La hamaca soporta el peso de tu cuerpo, haciendo que las posturas desafiantes sean más accesibles mientras profundiza los estiramientos y fortalece el core.",
    "paragraph2": "Nuestro programa de certificación de 100 horas va más allá de la práctica física. Aprenderás el arte de enseñar yoga aéreo de manera segura y efectiva, comprendiendo la mecánica corporal, los fundamentos del montaje y cómo guiar a estudiantes de todos los niveles a través de secuencias aéreas transformadoras. Ya seas un profesor de yoga que busca ampliar sus ofertas o un practicante dedicado listo para compartir tu pasión, esta formación te proporciona la base que necesitas.",
    "audienceTitle": "Este Programa Es Para Ti Si...",
    "audienceItems": [
      "Eres un profesor de yoga certificado que desea agregar yoga aéreo a su repertorio de enseñanza",
      "Eres un practicante dedicado de yoga listo para profundizar tu práctica e inspirar a otros",
      "Tienes experiencia en artes del movimiento (danza, gimnasia, Pilates) y quieres enseñar yoga aéreo",
      "Te apasiona el yoga y estás ansioso por comenzar tu camino como profesor"
    ]
  },
  "curriculum": {
    "title": "Lo Que Aprenderás",
    "modules": {
      "module1": {
        "title": "Introducción al Yoga Aéreo",
        "topics": [
          "Historia y evolución de la práctica",
          "Beneficios físicos, mentales y emocionales",
          "Contraindicaciones y precauciones",
          "Cómo atar la hamaca de seda"
        ]
      },
      "module2": {
        "title": "Filosofía Yóguica",
        "topics": [
          "El significado espiritual de la práctica",
          "Chakras, nadis y el sistema energético humano",
          "Bandhas, koshas, yamas y niyamas",
          "Yoga sutras de Patanjali"
        ]
      },
      "module3": {
        "title": "Anatomía Yóguica",
        "topics": [
          "Articulaciones, músculos y fascia",
          "El sistema nervioso",
          "El sistema endocrino"
        ]
      },
      "module4": {
        "title": "Fundamentos del Yoga Aéreo",
        "topics": [
          "Posturas básicas",
          "Agarres articulares",
          "Alturas de la hamaca de seda",
          "Ajustes y variaciones",
          "Hamaca abierta y cerrada"
        ]
      },
      "module5": {
        "title": "Movilidad y Técnica",
        "topics": [
          "Estiramientos",
          "Apertura de caderas",
          "Arcos",
          "Torsiones",
          "Posturas invertidas"
        ]
      },
      "module6": {
        "title": "Secuencias y Fluidez",
        "topics": [
          "Vinyasa yoga en la hamaca de seda (saludos al sol/luna)",
          "Cómo diseñar una secuencia equilibrada de yoga aéreo",
          "Fluidez del movimiento aéreo",
          "Variaciones y dinámicas",
          "Transiciones seguras entre posturas"
        ]
      },
      "module7": {
        "title": "Pranayama, Mantra y Meditación",
        "topics": [
          "La importancia de la respiración en yoga y meditación",
          "Ejercicios de respiración (pranayama)",
          "Las cualidades terapéuticas del sonido",
          "Apertura de garganta y práctica de mantras",
          "El arte de la meditación",
          "Aplicaciones en yoga aéreo"
        ]
      },
      "module8": {
        "title": "Metodología de Enseñanza",
        "topics": [
          "Cómo guiar una clase",
          "Asistencia y ajustes en yoga aéreo",
          "Preparación de clases con ajuste de nivel",
          "Cómo adaptar tus clases a personas con limitaciones físicas"
        ]
      }
    }
  },
  "instructors": {
    "title": "Conoce a Tus Maestros",
    "subtitle": "Aprende de practicantes experimentados de yoga aéreo"
  },
  "testimonials": {
    "title": "Lo Que Dicen Nuestros Graduados",
    "subtitle": "Escucha a estudiantes que completaron el programa",
    "items": [
      {
        "quote": "Realizar la formación en aerial yoga fue cumplir con uno de mis propósitos. De la belleza del cuerpo suspendido nace la consciencia del equilibrio, la fuerza y la coordinación para prolongar el movimiento en el aire. Esta práctica me permite sentirme más segura de mí misma, aceptar la naturaleza de mi cuerpo y a su vez, trabajar la sensualidad de una manera sutil. No dudé en tomar la certificación, porque sabía que tendría una gran maestra, quien me ha acompañado en este largo proceso y me ha permitido sembrar y florecer en el mundo del yoga, ella me sigue acompañando en los procesos y el hecho de que crea en mí y comparta su saber y sus experiencias, hace que mi ser también se expanda en alegría.",
        "name": "Ika Hermenegilda",
        "location": "Colombia"
      },
      {
        "quote": "Para mí la certificación fue un proceso muy lindo, en el que pude confiar en mi, en mis capacidades. Gracias a todo lo que nos compartieron pude reflexionar muchas cosas sobre mi vida, sobre como me relaciono con el mundo, como atravieso las experiencias vividas. Todas la practicas que tuvimos me enseñaron mucho de mí misma, y también de abrirme a los demás, de observar, escuchar, recibir. Para mí la certificación llego en el momento correcto, por que estaba atravesando un montón de cosas que no lograba entender por qué, y el espacio que tuve en la certificación me ayudó mucho a direccionar ese ruido y poder digerirlo. Me sentí acompañada en todo momento, con una excelente guía. Me siento muy agradecida por haber podido ser parte de este aprendizaje que me hizo abrir mi panorama.",
        "name": "Dani",
        "location": "México"
      },
      {
        "quote": "La formación para mí fue todo un reto físico y mental. Cami como maestra es excelente, me ayudó a no tenerle miedo a algunas posturas y sobretodo a desarrollar la fuerza y la confianza para realizarlas. Mis compañeras fueron un acompañamiento muy bonito y esencial durante toda la formación. La parte teórica impartida por Harjeet fue muy extensa, es un maestro muy paciente y apasionado al momento de transmitir su conocimiento. Ambos nos tomaron de la mano de principio a fin, estoy muy agradecida por eso. La certificación me ayudó a que tuviera más confianza y seguridad y poder enseñar a nuevas personas lo bonito que es el aerial yoga.",
        "name": "Itzel",
        "location": "México"
      },
      {
        "quote": "Desde el primer entendí que el aéreo yoga no es solo colgarse de una tela. Mi sankalpa para esta experiencia fue: \"Quiero recordar mi poder, habitar mi cuerpo con presencia y guiar a otros a encontrar confianza en el suyo.\" Con la tela descubrí que soltar no siempre es caer, a veces soltar es sostenerme distinto.",
        "name": "Dani",
        "location": "Colombia"
      }
    ]
  },
  "cta": {
    "title": "¿Listo Para Comenzar Tu Camino?",
    "nextTraining": {
      "label": "Próxima Formación",
      "dates": "7 de Marzo - 10 de Mayo, 2026",
      "schedule": "Fines de semana (Sábados y Domingos)",
      "location": "Estudio Aguacate, Ciudad de México"
    },
    "investment": {
      "label": "Inversión",
      "fullPrice": "$25,000 MXN",
      "fullPriceNote": "Pago único",
      "planPrice": "$28,000 MXN",
      "planNote": "Plan de pagos",
      "planBreakdown": "$12,000 + $8,000 + $8,000 en 3 meses"
    },
    "buttons": {
      "whatsapp": "WhatsApp",
      "email": "Correo"
    },
    "helpText": "¿Preguntas? ¡Estamos felices de ayudarte!"
  }
}
```

### Files to Modify

#### `locales/en/common.json` - Add:
```json
{
  "nav": {
    "certifications": "Certifications",
    "certificationsDropdown": {
      "aerial100": "100-Hour Aerial Yoga"
    }
  },
  "pageTitles": {
    "certificationsAerial100": "100-Hour Aerial Yoga Teacher Training | SGP Yoga"
  },
  "footer": {
    "sitemap": {
      "certifications": "Certifications"
    }
  }
}
```

#### `locales/es/common.json` - Add:
```json
{
  "nav": {
    "certifications": "Certificaciones",
    "certificationsDropdown": {
      "aerial100": "Yoga Aéreo 100 Horas"
    }
  },
  "pageTitles": {
    "certificationsAerial100": "Formación de Profesores de Yoga Aéreo 100 Horas | SGP Yoga"
  },
  "footer": {
    "sitemap": {
      "certifications": "Certificaciones"
    }
  }
}
```

### Translation Usage in HTML

```html
<!-- Hero -->
<h1 data-i18n="certifications:hero.title">100-Hour Aerial Yoga Teacher Training</h1>
<p data-i18n="certifications:hero.subtitle">Transform your practice. Inspire others.</p>

<!-- Introduction -->
<h2 data-i18n="certifications:intro.title">Discover Aerial Yoga</h2>
<p data-i18n="certifications:intro.paragraph1">...</p>

<!-- Accordion modules -->
<h3 data-i18n="certifications:curriculum.modules.module1.title">Module 1 Title</h3>

<!-- CTA -->
<span data-i18n="certifications:cta.nextTraining.dates">March 7 - May 10, 2026</span>
```

### Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add Certifications dropdown to navbar |
| `about.html` | Add Certifications dropdown to navbar |
| `classes.html` | Add Certifications dropdown to navbar |
| `events.html` | Add Certifications dropdown to navbar |
| `blog.html` | Add Certifications dropdown to navbar |
| `css/navbar.css` | Dropdown styles for nav items |
| `js/navbar.js` | Dropdown hover/keyboard logic |
| `locales/en/common.json` | Nav translations |
| `locales/es/common.json` | Nav translations (Spanish) |
| `sitemap.xml` | Add new page URL |
| `build-i18n.js` | Ensure certifications directory is processed |

### Reusable Components

| Component | Source Files | Reuse Strategy |
|-----------|-------------|----------------|
| Testimonials carousel | `testimonials.js`, `testimonials.css` | Direct reuse with new content |
| Teacher/Instructor cards | `about.css` | Adapt styles, vertical stack |
| Hero section | Various pages | Same pattern, new content |
| Section structure | `main.css` | Use `.section-padding`, `.container` |
| CTA buttons | `main.css`, `classes.css` | Use `.btn-elegant` |
| Page template | All pages | Same head, navbar, footer structure |

### New Components to Build

| Component | Description |
|-----------|-------------|
| Nav dropdown | Hover-activated dropdown for nav items |
| Accordion | Expandable module list with smooth animations |

### CSS Architecture

```css
/* certifications.css structure */

/* Hero section overrides */
.cert-hero { ... }

/* Introduction section */
.cert-intro { ... }

/* Accordion component */
.cert-curriculum { ... }
.accordion { ... }
.accordion-item { ... }
.accordion-header { ... }
.accordion-content { ... }
.accordion-item.active .accordion-content { ... }

/* Instructors section */
.cert-instructors { ... }
.instructor-card { ... }

/* Testimonials (mostly reuse) */
.cert-testimonials { ... }

/* CTA section */
.cert-cta { ... }
.program-details { ... }
.pricing-options { ... }
```

### JavaScript Architecture

```javascript
// certifications.js

/**
 * Accordion component for curriculum modules
 */
class CurriculumAccordion {
  constructor(container) { ... }
  toggle(item) { ... }
  expand(item) { ... }
  collapse(item) { ... }
}

/**
 * Initialize page components
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize accordion
  new CurriculumAccordion('.curriculum-accordion');

  // Initialize testimonials (reuse existing class)
  new TestimonialsSlideshow('.cert-testimonials-slideshow');
});
```

### SEO Implementation

| Element | Value |
|---------|-------|
| Title | "100-Hour Aerial Yoga Teacher Training | SGP Yoga" |
| Meta description | "Become a certified aerial yoga instructor with our comprehensive 100-hour training program in Mexico City. Learn from experienced teachers Harjeet & Camila." |
| Canonical | `https://sgpyoga.com/certifications/aerial-yoga-100.html` |
| hreflang (en) | `/certifications/aerial-yoga-100.html` |
| hreflang (es) | `/es/certifications/aerial-yoga-100.html` |
| Schema.org | Course schema with provider, instructors, price |

### Accessibility Checklist

- [ ] Semantic HTML5 structure (`<main>`, `<section>`, `<article>`)
- [ ] ARIA labels for accordion (`aria-expanded`, `aria-controls`)
- [ ] Keyboard navigation (Tab, Enter, Space, Escape)
- [ ] Alt text for all images
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Focus indicators on interactive elements
- [ ] Skip link to main content
- [ ] Screen reader testing

---

## Content Pending

The following content is needed before implementation can be completed:

### From Client

| Item | Priority | Status | Notes |
|------|----------|--------|-------|
| Hero image | High | ✅ Done | Exists at `assets/photos/certifications/` |
| Introduction copy | High | ✅ Draft | Placeholder created, to be refined |
| Spanish translations | Medium | ✅ Auto | Will generate alongside English |
| 8 module titles | High | ✅ Done | All 8 modules defined |
| 8 module descriptions | High | ✅ Done | All topics per module defined |
| 4 testimonials | Medium | ✅ Done | EN translations + ES originals |
| Student photos | Low | ⏳ Pending | To be added at `assets/photos/certifications/<name>-<res>.webp` |

### Content Template

When providing module content, please use this format:

```
Module 1: [Title]
- Topic 1
- Topic 2
- Topic 3
Hours: X hours (optional)

Module 2: [Title]
...
```

---

## Implementation Phases

### Phase 1: Navigation & Structure
1. Add dropdown menu to navbar (all pages)
2. Create page file structure
3. Set up translation files
4. Build page skeleton with placeholder content

### Phase 2: Core Sections
1. Hero section
2. Introduction section
3. Instructors section (reuse about page content)
4. CTA section with actual details

### Phase 3: Interactive Components
1. Build accordion component
2. Add curriculum content (when provided)
3. Integrate testimonials carousel
4. Add testimonial content (when provided)

### Phase 4: Polish & Launch
1. Responsive testing
2. Accessibility audit
3. SEO optimization
4. Spanish translations
5. Final review and deploy

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| Jan 2026 | 0.1 | Initial draft |
| Jan 2026 | 0.2 | Updated with confirmed decisions: URL structure, accordion layout, pricing, dates, contact info, nav behavior |
| Jan 2026 | 0.3 | Added hero image paths, placeholder introduction copy (EN/ES), detailed translation file strategy with `certifications` namespace |
| Jan 2026 | 0.4 | Added complete curriculum content: 8 modules with all topics (EN/ES translations) |
| Jan 2026 | 0.5 | Added 4 graduate testimonials (ES originals + EN translations), photo naming convention |
