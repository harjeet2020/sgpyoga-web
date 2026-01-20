# SGP Yoga Website Warp Instructions

## Introduction
This is a yoga studio website built using HTML, CSS and JavaScript. It is a responsive website that is optimized for mobile devices and search engines.

## Site Information

### Basic Information
The yoga studio name is SGP Yoga. It is located in CDMX, Mexico. We offer in-person classes and events in various venues around the city.

### Site Structure
The site is structured into the following pages:
- Home (index.html)
- About (about.html)
- Classes (classes.html)
- Events (events.html)
- Blog (blog.html)

### The site uses the following colors:
Primary Color: #1f2121 (Eerie Black)
Secondary Color: #ffeddf (Linen)
Accent Color 1: #40689a (Lapis Lazuli)
Accent Color 2: #a06789 (Chinese Violet)
Supplemetary Color: #3e3e3e (Onyx)

### The site uses the following fonts:
Heading Font: Cormorant Garamond
Body Font: Lato Light

### Languages
- The site supports English and Spanish languages
- Language is selected automatically based on user's browser language, falling back to English (default)
- There is a dropdown menu in the navbar for manual language selection
- We're using i18next library to implement multiple language support
- We store translations in JSON files under the locales folder
- All html tags use data-i18n attribute to fetch translations

## Guidelines
- Use the provided color palette and fonts
- Use images found under the assets folder
- Use icons from lucide.dev icon library
- Save current progress and project info upon request under memory-bank folder
- Create / update documentation upon request under docs folder
- Use reusable CSS classes to achieve clean and maintainable code
- Use CSS variables for colors and fonts
- Structure CSS files in a readable & maintainable way, using comments to explain the purpose of each section
- Ensure all html tags use data-i18n attribute to fetch translations
- When using images, provide both high and low resolution versions to ensure optimal performance
- Use absolute paths (starting with `/`) for all asset references in HTML files (e.g., `/assets/...`, `/css/...`, `/js/...`) to ensure the Spanish build works correctly