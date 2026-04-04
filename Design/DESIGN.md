# Design System Strategy: The Competitive Edge

## 1. Overview & Creative North Star
**The Creative North Star: "Executive Brutalism"**
This design system is not just a study tool; it is a high-stakes environment. We are moving away from the "friendly SaaS" look toward a sophisticated, editorial aesthetic that mirrors the prestige of a corporate boardroom or a high-end awards gala. 

We break the "template" look through **Intentional Asymmetry** and **Tonal Depth**. By utilizing high-contrast typography scales and overlapping surface layers, we create a sense of focused energy. The UI should feel like a curated gallery of information where the user is the primary subject on the "Podium."

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep obsidian tones, punctuated by high-energy "Electric Blue" and "Gold" to signify excellence and achievement.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or cards. Structural boundaries must be created through background color shifts or subtle tonal transitions.
*   **The Technique:** Place a `surface_container_high` (#2A2A2A) element on a `surface` (#131313) background. The contrast is the border.
*   **Exception:** For high-density data, use a "Ghost Border" (see Section 4).

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials.
*   **Background:** `surface` (#131313) – The base floor.
*   **Primary Containers:** `surface_container` (#201F1F) – Main content blocks.
*   **Elevated Elements:** `surface_container_highest` (#353534) – Modals, popovers, or active state cards.
*   **The Nested Rule:** An inner container must always be at least one tier "brighter" or "darker" than its parent to define its importance without needing a stroke.

### The Glass & Gradient Rule
To add "soul" to the dark mode experience:
*   **CTAs:** Use a subtle linear gradient on primary buttons (e.g., `primary` #ADC6FF to `primary_container` #4D8EFF) at a 135-degree angle.
*   **Floating Elements:** Apply `backdrop-blur` (12px–20px) to surface colors with 80% opacity to create a "frosted glass" effect for navigation bars and floating action buttons.

---

## 3. Typography: The Editorial Voice
We utilize a pairing of **Plus Jakarta Sans** for authority and **Inter** for utility.

*   **Display & Headlines (Plus Jakarta Sans):** These are your "Statement" pieces. Use `display-lg` for achievement scores or "Win" states. The high contrast between the bold weight and the dark background creates an authoritative, premium feel.
*   **Titles & Body (Inter):** Clean and functional. `title-lg` should be used for card headings to ensure maximum scannability during timed prep sessions.
*   **Intentional Scale:** Use extreme size differentials. A `display-sm` headline next to a `label-sm` muted text element creates an "Editorial" look found in high-end magazines.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not shadows or lines.

*   **Ambient Shadows:** If an element must "float" (like a modal), use an extra-diffused shadow.
    *   *Value:* `0px 20px 40px rgba(0, 0, 0, 0.5)`
    *   *Tinting:* The shadow should feel like it belongs to the environment. Avoid pure black shadows on non-black surfaces.
*   **The Ghost Border Fallback:** If accessibility requires a border, use the `outline_variant` (#424754) at **15% opacity**. This creates a "suggestion" of a boundary that preserves the high-end feel.
*   **Layering Principle:**
    1.  Base: `surface_container_lowest` (#0E0E0E)
    2.  Section: `surface_container_low` (#1C1B1B)
    3.  Component: `surface_container_high` (#2A2A2A)

---

## 5. Components

### Buttons
*   **Primary:** `primary` (#ADC6FF) background with `on_primary` (#002E6A) text. Roundedness: `md` (0.75rem). No border.
*   **Secondary/Outlined:** Use the "Ghost Border" (15% opacity `outline`) with `primary` colored text.
*   **State:** On hover, shift background to `primary_container`.

### Cards & Lists
*   **The Rule:** NO DIVIDER LINES.
*   **Separation:** Use `spacing-6` (1.5rem) of vertical white space or a subtle shift from `surface_container` to `surface_container_low`.
*   **Interactive Cards:** On hover, increase the surface tier (e.g., from `surface_container` to `surface_container_high`) and apply a 2px "Electric Blue" left-accent bar rather than a full border.

### Progress Indicators (The "Podium" Gauge)
*   **Track:** `surface_container_highest` (#353534).
*   **Indicator:** Linear gradient of `secondary` (Gold) to `secondary_container` to represent DECA excellence.

### Input Fields
*   **Base:** `surface_container_low` (#1C1B1B).
*   **Active State:** No glow. Instead, use a 1px "Ghost Border" at 40% opacity and change the label color to `primary`.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place a large `display-md` heading on the left and a small `label-md` action on the far right to create a professional, non-standard layout.
*   **Embrace Negative Space:** Let the `background` (#131313) breathe. Premium design is defined by what you leave out.
*   **Prioritize Type:** Let the typography scale do the heavy lifting of hierarchy.

### Don’t:
*   **Don't use 100% White:** Use `on_surface` (#E5E2E1) for primary text to prevent eye strain against the dark background.
*   **Don't use 1px Borders:** Never use a solid, opaque line to separate content. Use Tonal Layering.
*   **Don't use Standard "Blue":** Always use the specific `primary` (#ADC6FF) or the "Electric Blue" (#3B82F6) to maintain the signature visual identity.