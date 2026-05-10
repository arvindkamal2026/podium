# Theme CSS Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all 45 hardcoded design-system colors in `globals.css` respond to the `[data-theme]` attribute so theme switching repaints the entire app — without touching any component file.

**Architecture:** Every hardcoded hex value in `@theme inline` is replaced with a `var(--ds-*)` reference. Each `[data-theme]` block defines all 45 `--ds-*` slots. `podium-default` uses the exact same hex values that exist today (zero visual change). Future themes only need to fill those 45 slots.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, CSS custom properties

---

## File Map

| File | Change |
|---|---|
| `podium/app/globals.css` | `@theme inline` → `var(--ds-*)`, expand `[data-theme]` blocks, update utility classes |
| `podium/app/page.tsx` | Replace inline hex for design-system colors (not Google logo colors) |

`app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx` have hex only in Google logo SVG paths — brand-fixed, leave untouched.

---

## Task 1: Refactor `@theme inline` — replace 45 hardcoded values with `var(--ds-*)` references

**Files:**
- Modify: `podium/app/globals.css`

- [ ] **Step 1.1: Replace the custom token section of `@theme inline`**

In `podium/app/globals.css`, find the block starting with `/* Design System: Executive Brutalism - Custom Color Tokens */` (around line 50) and replace everything from that comment through line 95 (`--color-inverse-on-surface`) with the following. The Shadcn tokens above it and the font tokens below it are unchanged.

```css
  /* Design System: Executive Brutalism - Custom Color Tokens */
  --color-surface: var(--ds-surface);
  --color-surface-dim: var(--ds-surface-dim);
  --color-surface-bright: var(--ds-surface-bright);
  --color-surface-container-lowest: var(--ds-surface-container-lowest);
  --color-surface-container-low: var(--ds-surface-container-low);
  --color-surface-container: var(--ds-surface-container);
  --color-surface-container-high: var(--ds-surface-container-high);
  --color-surface-container-highest: var(--ds-surface-container-highest);
  --color-surface-variant: var(--ds-surface-variant);
  --color-surface-tint: var(--ds-surface-tint);
  --color-primary-container: var(--ds-primary-container);
  --color-primary-fixed: var(--ds-primary-fixed);
  --color-primary-fixed-dim: var(--ds-primary-fixed-dim);
  --color-on-primary: var(--ds-on-primary);
  --color-on-primary-container: var(--ds-on-primary-container);
  --color-on-primary-fixed: var(--ds-on-primary-fixed);
  --color-on-primary-fixed-variant: var(--ds-on-primary-fixed-variant);
  --color-inverse-primary: var(--ds-inverse-primary);
  --color-secondary-ds: var(--ds-secondary);
  --color-secondary-container: var(--ds-secondary-container);
  --color-secondary-fixed: var(--ds-secondary-fixed);
  --color-secondary-fixed-dim: var(--ds-secondary-fixed-dim);
  --color-on-secondary: var(--ds-on-secondary);
  --color-on-secondary-container: var(--ds-on-secondary-container);
  --color-on-secondary-fixed: var(--ds-on-secondary-fixed);
  --color-on-secondary-fixed-variant: var(--ds-on-secondary-fixed-variant);
  --color-tertiary: var(--ds-tertiary);
  --color-tertiary-container: var(--ds-tertiary-container);
  --color-tertiary-fixed: var(--ds-tertiary-fixed);
  --color-tertiary-fixed-dim: var(--ds-tertiary-fixed-dim);
  --color-on-tertiary: var(--ds-on-tertiary);
  --color-on-tertiary-container: var(--ds-on-tertiary-container);
  --color-on-tertiary-fixed: var(--ds-on-tertiary-fixed);
  --color-on-tertiary-fixed-variant: var(--ds-on-tertiary-fixed-variant);
  --color-error: var(--ds-error);
  --color-error-container: var(--ds-error-container);
  --color-on-error: var(--ds-on-error);
  --color-on-error-container: var(--ds-on-error-container);
  --color-on-surface: var(--ds-on-surface);
  --color-on-surface-variant: var(--ds-on-surface-variant);
  --color-on-background: var(--ds-on-background);
  --color-outline: var(--ds-outline);
  --color-outline-variant: var(--ds-outline-variant);
  --color-inverse-surface: var(--ds-inverse-surface);
  --color-inverse-on-surface: var(--ds-inverse-on-surface);
```

- [ ] **Step 1.2: Commit**

```bash
git add podium/app/globals.css
git commit -m "refactor(theme): make @theme inline tokens reference --ds-* vars"
```

---

## Task 2: Expand `[data-theme]` blocks with all 45 `--ds-*` slots

**Files:**
- Modify: `podium/app/globals.css`

The existing theme token layer (added in the previous session) has the 9 simple `--color-*` vars per theme. Replace that entire `/* ─── Theme token layer ─── */` section with the version below, which merges those 9 vars and all 45 new `--ds-*` vars into each block. The `:root` selector is included as a fallback so the app renders correctly even before `data-theme` is applied.

- [ ] **Step 2.1: Replace the theme token layer section**

Find the block starting with `/* ─── Theme token layer ─────────────────────────────────────────────────── */` and replace everything up to (but not including) the existing `:root {` Shadcn block with:

```css
/* ─── Theme token layer ─────────────────────────────────────────────────── */
/* :root is the dark fallback. [data-theme] blocks override per-theme.        */
/* Adding a new theme: one [data-theme] block here + one object in themes.ts. */

:root,
[data-theme="podium-default"] {
  /* Simple theme tokens (used by theme-aware components) */
  --color-primary: #4D8EFF;
  --color-primary-soft: #ADC6FF;
  --color-accent: #FFB95F;
  --color-surface: #111118;
  --color-surface-secondary: #1a1a2e;
  --color-surface-tertiary: #0a0a0f;
  --color-text: #f0f0f0;
  --color-text-muted: #888;
  --color-border: rgba(255, 255, 255, 0.08);

  /* Full design-system slots — identical to current hardcoded values */
  --ds-surface: #131313;
  --ds-surface-dim: #131313;
  --ds-surface-bright: #3a3939;
  --ds-surface-container-lowest: #0e0e0e;
  --ds-surface-container-low: #1c1b1b;
  --ds-surface-container: #201f1f;
  --ds-surface-container-high: #2a2a2a;
  --ds-surface-container-highest: #353534;
  --ds-surface-variant: #353534;
  --ds-surface-tint: #adc6ff;
  --ds-primary-container: #4d8eff;
  --ds-primary-fixed: #d8e2ff;
  --ds-primary-fixed-dim: #adc6ff;
  --ds-on-primary: #002e6a;
  --ds-on-primary-container: #00285d;
  --ds-on-primary-fixed: #001a42;
  --ds-on-primary-fixed-variant: #004395;
  --ds-inverse-primary: #005ac2;
  --ds-secondary: #ffb95f;
  --ds-secondary-container: #ee9800;
  --ds-secondary-fixed: #ffddb8;
  --ds-secondary-fixed-dim: #ffb95f;
  --ds-on-secondary: #472a00;
  --ds-on-secondary-container: #5b3800;
  --ds-on-secondary-fixed: #2a1700;
  --ds-on-secondary-fixed-variant: #653e00;
  --ds-tertiary: #4edea5;
  --ds-tertiary-container: #00a574;
  --ds-tertiary-fixed: #6ffbc0;
  --ds-tertiary-fixed-dim: #4edea5;
  --ds-on-tertiary: #003825;
  --ds-on-tertiary-container: #003120;
  --ds-on-tertiary-fixed: #002114;
  --ds-on-tertiary-fixed-variant: #005137;
  --ds-error: #ffb4ab;
  --ds-error-container: #93000a;
  --ds-on-error: #690005;
  --ds-on-error-container: #ffdad6;
  --ds-on-surface: #e5e2e1;
  --ds-on-surface-variant: #c2c6d6;
  --ds-on-background: #e5e2e1;
  --ds-outline: #8c909f;
  --ds-outline-variant: #424754;
  --ds-inverse-surface: #e5e2e1;
  --ds-inverse-on-surface: #313030;
  color-scheme: dark;
}

[data-theme="prosper-eagles"] {
  /* Simple theme tokens */
  --color-primary: #204321;
  --color-primary-soft: #2e5e30;
  --color-accent: #F8BC16;
  --color-accent-contrast: #000000;
  --color-surface: #ffffff;
  --color-surface-secondary: #E9EDEF;
  --color-surface-tertiary: #f0f0f0;
  --color-text: #1a1a1a;
  --color-text-muted: #555;
  --color-border: rgba(0, 0, 0, 0.1);

  /* Full design-system slots — light palette */
  --ds-surface: #f5f5f5;
  --ds-surface-dim: #e8e8e8;
  --ds-surface-bright: #ffffff;
  --ds-surface-container-lowest: #ffffff;
  --ds-surface-container-low: #f0f0f0;
  --ds-surface-container: #E9EDEF;
  --ds-surface-container-high: #dde1e3;
  --ds-surface-container-highest: #d0d4d6;
  --ds-surface-variant: #d0d4d6;
  --ds-surface-tint: #204321;
  --ds-primary-container: #204321;
  --ds-primary-fixed: #c8e6c9;
  --ds-primary-fixed-dim: #2e5e30;
  --ds-on-primary: #ffffff;
  --ds-on-primary-container: #ffffff;
  --ds-on-primary-fixed: #ffffff;
  --ds-on-primary-fixed-variant: #e8f5e9;
  --ds-inverse-primary: #2e5e30;
  --ds-secondary: #F8BC16;
  --ds-secondary-container: #e6a800;
  --ds-secondary-fixed: #fff3cd;
  --ds-secondary-fixed-dim: #F8BC16;
  --ds-on-secondary: #000000;
  --ds-on-secondary-container: #000000;
  --ds-on-secondary-fixed: #000000;
  --ds-on-secondary-fixed-variant: #3d2f00;
  --ds-tertiary: #2e7d32;
  --ds-tertiary-container: #388e3c;
  --ds-tertiary-fixed: #a5d6a7;
  --ds-tertiary-fixed-dim: #2e7d32;
  --ds-on-tertiary: #ffffff;
  --ds-on-tertiary-container: #ffffff;
  --ds-on-tertiary-fixed: #ffffff;
  --ds-on-tertiary-fixed-variant: #e8f5e9;
  --ds-error: #b00020;
  --ds-error-container: #fde0e0;
  --ds-on-error: #ffffff;
  --ds-on-error-container: #7f0013;
  --ds-on-surface: #1a1a1a;
  --ds-on-surface-variant: #444444;
  --ds-on-background: #1a1a1a;
  --ds-outline: #666666;
  --ds-outline-variant: #cccccc;
  --ds-inverse-surface: #1a1a1a;
  --ds-inverse-on-surface: #f5f5f5;
  color-scheme: light;
}

```

- [ ] **Step 2.2: Commit**

```bash
git add podium/app/globals.css
git commit -m "refactor(theme): expand [data-theme] blocks with full --ds-* slot definitions"
```

---

## Task 3: Update utility classes to use `--ds-*` variables

**Files:**
- Modify: `podium/app/globals.css`

The four utility classes in `@layer utilities` contain hardcoded hex. Replace them so they read from the theme slots and repaint correctly when the theme changes.

- [ ] **Step 3.1: Replace the `@layer utilities` block**

Find `@layer utilities {` and replace the entire block with:

```css
@layer utilities {
  .ghost-border {
    border: 1px solid rgba(66, 71, 84, 0.15);
  }
  .gradient-cta {
    background: linear-gradient(135deg, var(--ds-primary-fixed-dim), var(--ds-primary-container));
    color: var(--ds-on-primary);
  }
  .frosted-glass {
    background: color-mix(in srgb, var(--ds-surface) 80%, transparent);
    backdrop-filter: blur(16px);
  }
  .gradient-text {
    background: linear-gradient(135deg, var(--ds-primary-fixed-dim), var(--ds-primary-container));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .progress-gradient {
    background: linear-gradient(90deg, var(--ds-secondary), var(--ds-secondary-container));
  }
  .perspective-1000 {
    perspective: 1000px;
  }
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
}
```

- [ ] **Step 3.2: Commit**

```bash
git add podium/app/globals.css
git commit -m "refactor(theme): update utility classes to use --ds-* variables"
```

---

## Task 4: Replace inline hex in `app/page.tsx`

**Files:**
- Modify: `podium/app/page.tsx`

Four data arrays and four inline `style` props use hardcoded hex for design-system colors. Replace each with the matching `--ds-*` variable. Two cluster colors (`#C3AAFF`, `#80DEEA`) are decorative category identifiers with no design-system equivalent — leave them hardcoded.

- [ ] **Step 4.1: Replace the `features` data array**

Find:
```typescript
const features = [
  {
    icon: "quiz",
    title: "Practice Exams",
    description:
      "ICDC-difficulty multiple choice exams for all 59 DECA events. Immediate feedback with AI-powered explanations for every answer.",
    accent: "#ADC6FF",
  },
  {
    icon: "record_voice_over",
    title: "Role Play Coach",
    description:
      "Tackle realistic judged scenarios. Our AI evaluates your response against official DECA rubrics and shows you exactly where to improve.",
    accent: "#FFB95F",
  },
  {
    icon: "track_changes",
    title: "PI Mastery Tracker",
    description:
      "500+ Performance Indicators mapped to every event cluster. Track Untested → Learning → Mastered as you practice.",
    accent: "#4EDEA5",
  },
];
```

Replace with:
```typescript
const features = [
  {
    icon: "quiz",
    title: "Practice Exams",
    description:
      "ICDC-difficulty multiple choice exams for all 59 DECA events. Immediate feedback with AI-powered explanations for every answer.",
    accent: "var(--ds-primary-fixed-dim)",
  },
  {
    icon: "record_voice_over",
    title: "Role Play Coach",
    description:
      "Tackle realistic judged scenarios. Our AI evaluates your response against official DECA rubrics and shows you exactly where to improve.",
    accent: "var(--ds-secondary)",
  },
  {
    icon: "track_changes",
    title: "PI Mastery Tracker",
    description:
      "500+ Performance Indicators mapped to every event cluster. Track Untested → Learning → Mastered as you practice.",
    accent: "var(--ds-tertiary)",
  },
];
```

- [ ] **Step 4.2: Replace the `clusters` data array**

Find:
```typescript
const clusters = [
  { name: "Finance", icon: "account_balance", color: "#ADC6FF" },
  { name: "Marketing", icon: "campaign", color: "#FFB95F" },
  { name: "Business Mgmt", icon: "business_center", color: "#4EDEA5" },
  { name: "Hospitality", icon: "hotel", color: "#FFB4AB" },
  { name: "Entrepreneurship", icon: "rocket_launch", color: "#C3AAFF" },
  { name: "Personal Finance", icon: "savings", color: "#80DEEA" },
];
```

Replace with:
```typescript
const clusters = [
  { name: "Finance", icon: "account_balance", color: "var(--ds-primary-fixed-dim)" },
  { name: "Marketing", icon: "campaign", color: "var(--ds-secondary)" },
  { name: "Business Mgmt", icon: "business_center", color: "var(--ds-tertiary)" },
  { name: "Hospitality", icon: "hotel", color: "var(--ds-error)" },
  { name: "Entrepreneurship", icon: "rocket_launch", color: "#C3AAFF" },
  { name: "Personal Finance", icon: "savings", color: "#80DEEA" },
];
```

- [ ] **Step 4.3: Replace the three inline `style` props**

Find (the "verified" badge icon, hero section):
```tsx
style={{
  color: "#4EDEA5",
  fontVariationSettings: '"FILL" 1',
}}
```
Replace with:
```tsx
style={{
  color: "var(--ds-tertiary)",
  fontVariationSettings: '"FILL" 1',
}}
```

Find (the trophy icon, hero section):
```tsx
style={{
  color: "#ADC6FF",
  opacity: 0.15,
  fontVariationSettings: '"FILL" 1, "wght" 700',
}}
```
Replace with:
```tsx
style={{
  color: "var(--ds-primary-fixed-dim)",
  opacity: 0.15,
  fontVariationSettings: '"FILL" 1, "wght" 700',
}}
```

Find (the star icons, hero section):
```tsx
style={{ color: "#FFB95F", fontVariationSettings: '"FILL" 1' }}
```
Replace with:
```tsx
style={{ color: "var(--ds-secondary)", fontVariationSettings: '"FILL" 1' }}
```

Find (the trophy icon, final CTA section):
```tsx
style={{
  color: "#ADC6FF",
  fontVariationSettings: '"FILL" 1, "wght" 600',
}}
```
Replace with:
```tsx
style={{
  color: "var(--ds-primary-fixed-dim)",
  fontVariationSettings: '"FILL" 1, "wght" 600',
}}
```

- [ ] **Step 4.4: Commit**

```bash
git add podium/app/page.tsx
git commit -m "refactor(theme): replace inline hex in landing page with --ds-* variables"
```

---

## Task 5: Verify and push

**Files:** None

- [ ] **Step 5.1: Run lint**

From `podium/`:
```bash
npm run lint
```
Expected: no errors. Fix any that appear before continuing.

- [ ] **Step 5.2: Run build**

From `podium/`:
```bash
npm run build
```
Expected: build completes with no errors. If Turbopack complains about workspace root, try `npx next build` from the `podium/` directory.

- [ ] **Step 5.3: Smoke-test both themes manually**

Start the dev server (`npm run dev`), open the app, go to Profile → Appearance:

| Check | Expected |
|---|---|
| Select "Podium Default" | App looks identical to before — dark obsidian surfaces, blue/gold accents |
| Select "Prosper Eagles" | App repaints: white/light-gray surfaces, forest-green navs, gold accents |
| Switch back to "Podium Default" | Reverts cleanly |
| Hard-refresh with "Prosper Eagles" active | No flash of dark theme (FOUC prevention works) |
| `.gradient-cta` button (landing page CTA) | Repaints from blue to green gradient on Eagles theme |
| Danger Zone section on profile | Red `bg-error` correctly shows dark red on default, light red on Eagles |

- [ ] **Step 5.4: Push to main**

```bash
git push origin HEAD:main
```
