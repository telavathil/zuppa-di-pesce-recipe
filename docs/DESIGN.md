# Design System: Editorial Intelligence

## 1. Overview & Creative North Star: "The Digital Gastronome"
This design system moves away from the sterile, modular look of traditional SaaS and into the tactile, intentional world of high-end print media. The Creative North Star is **The Digital Gastronome**—an aesthetic that treats every screen like a composed plate or a lithographed page.

To break the "template" feel, we employ **Intentional Asymmetry**. Do not center-align every hero; use generous, unequal margins and allow images to break the container bounds. By overlapping bold typography with soft-edged containers, we create a sense of depth and curated "soul" that feels bespoke, warm, and authoritative.

---

## 2. Colors: Tonal Depth & Warmth
The palette is rooted in organic, culinary tones. We avoid harsh blacks and "tech" blues in favor of ingredients-inspired neutrals and a signature terracotta heat.

### The Palette
* **Surface (Base):** `#fef9f2` (A creamy, eggshell starting point)
* **Primary (The Flame):** `#9b4006` (Terracotta/Muted Orange)
* **Secondary (Earth):** `#84523a` (Deep clay)
* **Tertiary (Sous Vide Mode):** `#652fe8` (Violet) / Container: `#ede9f8` (Lilac)

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or cards. Hierarchy must be achieved through **Background Color Shifts**.
* Place a `surface-container-low` section against a `surface` background to create a "pocket" of content.
* Use `surface-container-highest` for sidebars or navigation rails to ground the layout without structural "wires."

### Glass & Gradient Polish
Main CTAs and Hero backgrounds should utilize a subtle **Linear Gradient** (from `primary` to `primary-container`) to provide a "simmering" depth. For floating navigation or modal overlays, use **Glassmorphism**: a semi-transparent `surface` color with a `24px` backdrop-blur to allow the rich background colors to bleed through softly.

---

## 3. Typography: The Editorial Voice
Typography is the most critical element of this system. It mimics the layout of a Michelin-star menu or a luxury cookbook.

* **Display & Headlines (Epilogue):** Bold, geometric, and unapologetic.
* *Signature Styling:* Use "Duotone Headlines." In a phrase like "Roasted *Artichoke*," set the subject in `primary` (Terracotta) and the rest in `on-surface`.
* **Body & Labels (Manrope):** Clean, modern, and highly legible.
* **Section Headers:** Use `label-md` tokens but transform to **ALL CAPS** with a letter-spacing of `0.15em`. This creates a sophisticated "index" feel at the top of content blocks.

---

## 4. Elevation & Depth: Tonal Layering
We reject the use of heavy, dark drop shadows. Depth in this system is a result of light and material stacking.

* **The Layering Principle:** Treat the UI as physical layers of paper.
* Base: `surface`
* Sub-sections: `surface-container-low` (inset)
* Interactive Cards: `surface-container-lowest` (sitting "on top")
* **Ambient Shadows:** For elements that must float (e.g., a "Start Cooking" FAB), use a shadow color tinted with the primary hue: `rgba(155, 64, 6, 0.08)` with a `48px` blur. It should feel like an ambient glow, not a shadow.
* **The "Ghost Border" Fallback:** If a boundary is strictly required for accessibility, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Tactile & Rounded
All components utilize the **XL (1.5rem / 24px)** or **LG (1rem / 16px)** roundedness scale to mimic the soft edges of ceramic cookware.

### Buttons
* **Primary:** A pill-shaped (`full` roundedness) container using the Terracotta gradient. No border. Text is `on-primary`.
* **Tertiary:** No container. All-caps `label-md` typography with wide tracking and a `primary` underline that appears on hover.

### Cards & Lists
* **The Card Rule:** Never use dividers. Separate list items using the `spacing-4` (1.4rem) scale or by alternating background tints (`surface` vs `surface-container-low`).
* **Padding:** Use generous internal padding (`spacing-6` or 2rem) to ensure content has "breathing room," mimicking a luxury magazine layout.

### Input Fields
* **Style:** Minimalist. A bottom-only "Ghost Border" that transitions to a `2px` `primary` weight on focus. Labels are always small-caps `label-sm` positioned above the field.

### Special Component: The 'Sous Vide' Banner
* **Container:** `tertiary-container` (#EDE9F8).
* **Typography:** `tertiary` (#652FE8) for text and iconography.
* **Visual Treatment:** A soft, pulsating "glow" effect using a `tertiary-fixed-dim` shadow to indicate the precision and technical nature of the cooking mode.

---

## 6. Do's and Don'ts

### Do:
* **Use White Space as a Tool:** If a layout feels crowded, increase the spacing from `8` to `12`.
* **Asymmetric Imagery:** Place images off-center or overlapping the edge of a container to break the "grid" feel.
* **Text Hierarchy:** Use `display-lg` for recipe titles to ensure a high-contrast editorial look.

### Don't:
* **Don't use 1px black borders.** It destroys the "High-End Print" softness.
* **Don't use standard "Grey" shadows.** Shadows must always be tinted with the surface or primary color.
* **Don't crowd the edges.** Maintain a minimum `spacing-10` (3.5rem) margin for the primary page container to ensure a "premium gallery" feel.
