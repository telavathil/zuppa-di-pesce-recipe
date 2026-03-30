# Zuppa di Pesce — App Functionality Reference

This document describes the structure, tabs, interactive elements, and cooking modes of the Zuppa di Pesce recipe web app. For visual design specifications see `docs/DESIGN.md`.

---

## Layout Structure

### Header (persistent)
- Provenance line: "SERIOUS EATS · ITALIAN–AMERICAN"
- Recipe title: "Zuppa di Pesce"
- Subtitle: "Hearty Italian-American Seafood Stew"

### Content Area (scrollable)
- Fills the space between the header and the bottom nav.
- Each tab renders its content here.

### Bottom Navigation Bar (fixed)
- Four tabs: **Recipe** | **Equipment** | **Shopping** | **Settings**
- Each tab has an icon above its label.

---

## Tab Descriptions

### 1. Recipe Tab

Two sub-views toggled by a segmented control.

#### Sub-view: Ingredients (default)
- Full ingredient list scaled to the current serving size.
- Three-column rows: quantity | unit | ingredient description.
- Fractional quantities shown as Unicode fractions (½, ¼, ⅛).

#### Sub-view: Steps
- Legend row: colored dots labelling cooking stations (Prep, Main pot, Skillet, + Sous Vide when active).
- "Reset timers" button (resets all active countdown timers).
- Steps split into two sections: **Night Before** and **Day Of**, each with an estimated duration.
- **Step cards:** numbered, collapsible. Collapsed shows title + station badges + duration. Expanded shows full instructions + countdown timer.
- **Notes section:** below all steps, culinary notes on the recipe.

#### Sous Vide Banner
- Appears at the top of both sub-views when Sous Vide mode is active.
- Explains the temperature and timing advantage of sous vide for this recipe.

### 2. Equipment Tab
- Context banner: serving count + size label.
- Equipment list: each item shows name, size spec, and a usage note.
- Equipment list is driven by serving size (larger servings = larger/more equipment).
- Time estimates block: Night Before and Day Of durations for the current serving size.
- Sous vide temperature reference card (visible in Sous Vide mode only).

### 3. Shopping Tab
- Progress counter: "X / 19 checked · N servings".
- "Clear all" button resets all checkboxes.
- Items grouped by category: SEAFOOD, PRODUCE, PANTRY.
- Each row: checkbox | quantity (scaled to servings) | unit | item name.
- Checking a row marks it off and increments the counter.
- Footer tip: bread/pasta quantity and wine pairing, scaled to servings.
- Sous vide extras note (visible in Sous Vide mode): bag count per serving size.

### 4. Settings Tab

#### Serving Size
- Large display number showing current serving count.
- Context label: "Intimate dinner" / "Dinner party" / "Large gathering" / "Event-scale feast".
- Time estimates for Night Before and Day Of at current serving size.
- Horizontal range slider: 1–25 servings.
- Quick-pick chips: preset counts (2, 4, 6, 8, 12, 16, 20, 25).
- Changing serving size updates ingredient quantities, equipment, time estimates, and shopping list quantities across all tabs.

#### Cooking Method
- Two options: **Traditional** (stovetop) and **Sous Vide** (precision).
- Selecting Sous Vide: reveals temperature reference card in Settings, adds the sous vide banner to the Recipe tab, changes step sequences and timing estimates throughout.

---

## Interactive Elements

### Segmented Toggle (Recipe tab)
- Switches between Ingredients and Steps sub-views.

### Step Cards (Recipe > Steps)
- Tap to expand/collapse.
- Expanded state shows instructions and a countdown timer widget (Start / Pause / Reset).
- Timer persists (keeps running) when the card is collapsed.
- "Reset timers" button in the legend row resets all timers simultaneously.

### Serving Size Slider
- Dragging updates: serving count, size label, time estimates, all ingredient quantities, equipment list, shopping quantities.

### Quick-Pick Chips
- Tapping a chip sets the serving size directly, updating the same fields as the slider.

### Cooking Method Toggle
- Mutually exclusive. Switching modes updates step sequences, timing, equipment, banner visibility, and the sous vide temperature reference.

### Shopping Checkboxes
- Tapping a row checks/unchecks it and updates the progress counter.
- "Clear all" resets all checkboxes.

---

## Cooking Modes

### Traditional (Stovetop)
- Default mode.
- Night Before: build the base (sauté aromatics, deglaze, reduce broth). ~45 min.
- Day Of: reheat base, cook seafood in sequence on stovetop. ~35 min.
- Stations: PREP, MAIN POT, SKILLET, PARALLEL.

### Sous Vide (Precision)
- Night Before: build the base + sous vide squid at 138°F / 59°C for 1–2 hrs. ~60 min.
- Day Of: sous vide cod (135°F, 30 min) and shrimp (135°F, 20 min) while base reheats; assemble and steam shellfish. ~30 min.
- Stations: PREP, MAIN POT, SKILLET, PARALLEL, SOUS VIDE.
- Additional UI: sous vide banner on Recipe tab, temperature reference card on Equipment and Settings tabs.
