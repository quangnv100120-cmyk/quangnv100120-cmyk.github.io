---
description: IMPC Figma Typography Guidelines & Anti-Bolding Override Rules
---
# Imperial Figma Typography Rules for IMPC Landing Page

When implementing any Figma Node from the IMPC Landing Page (Figma ID: DyNfyFQp6hSHOLCH0X897x), you MUST strictly adhere to the following rules to ensure Pixel-Perfect typography and avoid browser-injected rendering errors:

## 1. The Heading Tag "Faux-Bold" Trap (CRITICAL)
Whenever you use HTML semantic heading tags (`<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`) to architect text extracted from Figma, you **MUST explicitly declare `font-weight: normal;`** (or `400`/`300`) inside its corresponding CSS class.
- **Why?** Browsers automatically enforce `font-weight: bold;` on all `h` tags. When applying custom thin or italic fonts (like `BHN_Victor_Serif` or `BHN_Neue_Haas_Grotes`), the browser will forcefully blur and thicken the font outline ("Faux Bold"), completely destroying the elegant typography intended by the designer.

## 2. Strict Font Family Mappings
Always explicitly declare the target font stack on your CSS classes. Do not rely on generic `body` inheritance, as fallbacks may trigger incorrect weights:
- For `BHN_Neue_Haas_Grotes:55_Roman`: 
  ```css
  font-family: "BHN Neue Haas Grotes", "BHN Neue Haas Grotesk", "BHN_Neue_Haas_Grotes:55_Roman", var(--font-sans);
  font-weight: 400; /* Or 300 if thin is strictly requested */
  ```
- For `BHN_Victor_Serif:Italic`: 
  ```css
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: normal; /* CRUCIAL to disable browser bolding */
  ```

## 3. Emulate Figma's Exact Text Box Geometry
- **Line Height**: Never use `line-height: normal;`. Always extract the exact pixel or percentage leading from Figma (e.g., `line-height: 56px;`).
- **Bounding Boxes**: If a Figma text node has a strict width (e.g., `w-[1360px]`), translate this to `max-width: 1360px; width: 100%; margin: 0 auto;` to ensure identical text wrapping breakpoints across standard monitors, rather than letting it bleed to the screen edges.
