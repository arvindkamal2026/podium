# Theme CSS Refactor — Design Spec
**Date:** 2026-05-09
**Status:** Approved

## Goal

Make the existing Podium theme system fully functional: switching themes must repaint the entire app correctly. The default appearance must remain pixel-identical to the current site. Adding a future theme must require only one CSS block in `globals.css` and one object in `lib/themes.ts` — no component changes.

## Background

The theme picker and `ThemeContext` are already wired up (merged 2026-05-09). The remaining gap: the ~30 design-system colors in `@theme inline` (globals.css lines 51–95) are hardcoded hex values. Tailwind resolves these at build time, so `[data-theme]` attribute changes have no effect on existing utility classes like `bg-surface-container-low` or `text-on-surface`.

## Approach

**Indirect `@theme inline`** — the only approach that requires zero component changes.

Each hardcoded value in `@theme inline` becomes a reference to a CSS custom property:

```css
/* Before */
--color-surface: #131313;

/* After */
--color-surface: var(--ds-surface);
```

Each `[data-theme]` block defines all `--ds-*` slots. When the attribute changes on `<html>`, all slots update and every Tailwind utility class repaints automatically.

The `--ds-` prefix is chosen to avoid collision with Tailwind's own `--color-*` namespace.

## Scope

### 1. `globals.css` — `@theme inline` block

Replace all 45 hardcoded hex values in the custom design token section (lines 51–95) with `var(--ds-*)` references. The Shadcn tokens (lines 8–41) already use `var()` and are left unchanged.

Every custom token gets converted — including MD3 variants that aren't currently used by components — so that future components can use any token and theming will work automatically.

Complete slot mapping (45 tokens):

```
--color-surface                    → var(--ds-surface)
--color-surface-dim                → var(--ds-surface-dim)
--color-surface-bright             → var(--ds-surface-bright)
--color-surface-container-lowest   → var(--ds-surface-container-lowest)
--color-surface-container-low      → var(--ds-surface-container-low)
--color-surface-container          → var(--ds-surface-container)
--color-surface-container-high     → var(--ds-surface-container-high)
--color-surface-container-highest  → var(--ds-surface-container-highest)
--color-surface-variant            → var(--ds-surface-variant)
--color-surface-tint               → var(--ds-surface-tint)
--color-primary-container          → var(--ds-primary-container)
--color-primary-fixed              → var(--ds-primary-fixed)
--color-primary-fixed-dim          → var(--ds-primary-fixed-dim)
--color-on-primary                 → var(--ds-on-primary)
--color-on-primary-container       → var(--ds-on-primary-container)
--color-on-primary-fixed           → var(--ds-on-primary-fixed)
--color-on-primary-fixed-variant   → var(--ds-on-primary-fixed-variant)
--color-inverse-primary            → var(--ds-inverse-primary)
--color-secondary-ds               → var(--ds-secondary)
--color-secondary-container        → var(--ds-secondary-container)
--color-secondary-fixed            → var(--ds-secondary-fixed)
--color-secondary-fixed-dim        → var(--ds-secondary-fixed-dim)
--color-on-secondary               → var(--ds-on-secondary)
--color-on-secondary-container     → var(--ds-on-secondary-container)
--color-on-secondary-fixed         → var(--ds-on-secondary-fixed)
--color-on-secondary-fixed-variant → var(--ds-on-secondary-fixed-variant)
--color-tertiary                   → var(--ds-tertiary)
--color-tertiary-container         → var(--ds-tertiary-container)
--color-tertiary-fixed             → var(--ds-tertiary-fixed)
--color-tertiary-fixed-dim         → var(--ds-tertiary-fixed-dim)
--color-on-tertiary                → var(--ds-on-tertiary)
--color-on-tertiary-container      → var(--ds-on-tertiary-container)
--color-on-tertiary-fixed          → var(--ds-on-tertiary-fixed)
--color-on-tertiary-fixed-variant  → var(--ds-on-tertiary-fixed-variant)
--color-error                      → var(--ds-error)
--color-error-container            → var(--ds-error-container)
--color-on-error                   → var(--ds-on-error)
--color-on-error-container         → var(--ds-on-error-container)
--color-on-surface                 → var(--ds-on-surface)
--color-on-surface-variant         → var(--ds-on-surface-variant)
--color-on-background              → var(--ds-on-background)
--color-outline                    → var(--ds-outline)
--color-outline-variant            → var(--ds-outline-variant)
--color-inverse-surface            → var(--ds-inverse-surface)
--color-inverse-on-surface         → var(--ds-inverse-on-surface)
```

### 2. `globals.css` — `[data-theme]` blocks

Each theme block defines all `--ds-*` slots. `podium-default` uses the exact same hex values that are currently hardcoded, so the default appearance is unchanged.

**`[data-theme="podium-default"]`** — identical to current hardcoded values (no visual change):
```css
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
```

**`[data-theme="prosper-eagles"]`** — light theme, all 45 slots:
```css
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
```

### 3. `globals.css` — utility classes

The four utility classes that contain hardcoded hex get updated to use the theme slots:

| Class | Current | Updated |
|---|---|---|
| `.gradient-cta` | `#adc6ff`, `#4d8eff`, `#002e6a` | `var(--ds-primary-fixed-dim)`, `var(--ds-primary-container)`, `var(--ds-on-primary)` |
| `.frosted-glass` | `rgba(19,19,19,0.8)` | `color-mix(in srgb, var(--ds-surface) 80%, transparent)` |
| `.gradient-text` | `#adc6ff`, `#4d8eff` | `var(--ds-primary-fixed-dim)`, `var(--ds-primary-container)` |
| `.progress-gradient` | `#ffb95f`, `#ee9800` | `var(--ds-secondary)`, `var(--ds-secondary-container)` |

### 4. `app/page.tsx` and auth pages — inline hex

The landing page and auth pages have hardcoded hex in JavaScript data arrays and inline styles (cluster icons, feature card accents, gradient backgrounds). These get replaced with the `--ds-*` variables via `style={{ color: 'var(--ds-primary-fixed-dim)' }}` etc.

The mini-UI preview colors in the Appearance cards (`profile/page.tsx`) are **intentionally kept hardcoded** — they must always show the theme's actual colors regardless of which theme is active.

### 5. No Shadcn token changes

The Shadcn `--background`, `--foreground`, `--card`, etc. tokens used in `:root` / `.dark` are not touched. These feed the existing Shadcn components and are separate from the custom design token layer.

## Files Changed

| File | Change |
|---|---|
| `podium/app/globals.css` | ~30 `@theme inline` values → `var(--ds-*)`, two expanded `[data-theme]` blocks, updated utility classes |
| `podium/app/page.tsx` | Inline hex → `var(--ds-*)` |
| `podium/app/(auth)/login/page.tsx` | Inline hex → `var(--ds-*)` |
| `podium/app/(auth)/signup/page.tsx` | Inline hex → `var(--ds-*)` |

**No component files are changed.**

## Verification

- Switch to Podium Default → app looks identical to current production
- Switch to Prosper Eagles → app renders in green/gold/light palette
- Switch back to Podium Default → reverts cleanly
- Hard-refresh with Prosper Eagles active → no flash of dark theme (FOUC script handles this)

## Future Themes

Add a new theme by:
1. Adding one `[data-theme="new-id"]` block to `globals.css` with all 45 `--ds-*` slots filled in
2. Adding one object to `lib/themes.ts`

No other files need to change.
