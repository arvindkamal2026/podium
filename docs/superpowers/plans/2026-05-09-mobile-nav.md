# Mobile Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating bottom tab bar on mobile (< 768px) and hide the desktop sidebar, making the app fully usable on phones.

**Architecture:** Pure CSS breakpoints — no JS state required. A new `BottomNav` component renders `md:hidden` at the bottom of the screen. The existing `Sidebar` gets `hidden md:flex` so it only shows on desktop. The app layout removes the left margin on mobile and adds bottom padding to prevent content hiding behind the bar.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, Material Symbols Outlined icons

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `podium/components/layout/BottomNav.tsx` | **Create** | Floating bottom tab bar, mobile-only |
| `podium/components/layout/Sidebar.tsx` | **Modify** | Hide on mobile via `hidden md:flex` |
| `podium/app/(app)/layout.tsx` | **Modify** | Responsive margins/padding, render BottomNav |
| `podium/app/(app)/vocab/page.tsx` | **Modify** | `flex-wrap` on mode selector so buttons don't overflow |

---

## Task 1: Create the BottomNav component

**Files:**
- Create: `podium/components/layout/BottomNav.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/home",      label: "Home",       icon: "dashboard"         },
  { href: "/pi-tracker",label: "PI Tracker", icon: "target"            },
  { href: "/exams",     label: "Exams",      icon: "quiz"              },
  { href: "/vocab",     label: "Vocab",      icon: "style"             },
  { href: "/roleplay",  label: "Role Play",  icon: "record_voice_over" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="bg-surface-container-low rounded-3xl flex items-center justify-around px-2 py-3">
        {TABS.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-0 flex-1"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors ${
                  isActive ? "text-primary-container" : "text-outline"
                }`}
              >
                {tab.icon}
              </span>
              {isActive && (
                <>
                  <span className="text-[10px] font-semibold text-primary-container leading-none">
                    {tab.label}
                  </span>
                  <span className="h-0.5 w-4 rounded-full bg-primary-container" />
                </>
              )}
            </Link>
          );
        })}
      </div>
      {/* iOS-style handle bar */}
      <div className="flex justify-center mt-1.5">
        <div className="w-24 h-1 rounded-full bg-outline-variant/30" />
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify the file saved correctly**

Run: `cat podium/components/layout/BottomNav.tsx`
Expected: file contents printed with no errors.

---

## Task 2: Hide sidebar on mobile

**Files:**
- Modify: `podium/components/layout/Sidebar.tsx:30`

- [ ] **Step 1: Update the `<aside>` className**

In `podium/components/layout/Sidebar.tsx`, change line 30 from:
```tsx
<aside className="fixed top-16 left-0 bottom-0 w-[220px] bg-surface-container-low py-6 flex flex-col gap-0.5 z-40">
```
to:
```tsx
<aside className="hidden md:flex fixed top-16 left-0 bottom-0 w-[220px] bg-surface-container-low py-6 flex-col gap-0.5 z-40">
```

Note: `flex flex-col` becomes `md:flex flex-col` (the `flex` is removed from the base class; Tailwind's `md:flex` sets `display: flex` at ≥768px). The `flex-col` direction stays unconditional.

- [ ] **Step 2: Verify build still passes**

Run: `cd podium && npm run build 2>&1 | tail -20`
Expected: `✓ Compiled successfully` with no TypeScript errors.

---

## Task 3: Update AppLayout for responsive margins and add BottomNav

**Files:**
- Modify: `podium/app/(app)/layout.tsx`

- [ ] **Step 1: Rewrite the layout file**

Replace the entire contents of `podium/app/(app)/layout.tsx` with:

```tsx
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <Sidebar />
      <main className="md:ml-[220px] pt-16 min-h-[calc(100vh-4rem)]">
        <div className="p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
```

Key changes:
- `ml-[220px]` → `md:ml-[220px]` (full-width on mobile)
- `p-8` → `p-4 md:p-8` (tighter padding on mobile)
- `pb-24 md:pb-8` on the content div ensures content doesn't hide behind the bottom bar
- `<BottomNav />` added at the root level so it's always in the DOM (CSS handles show/hide)

- [ ] **Step 2: Verify build passes**

Run: `cd podium && npm run build 2>&1 | tail -20`
Expected: `✓ Compiled successfully`

---

## Task 4: Fix vocab mode selector overflow on mobile

**Files:**
- Modify: `podium/app/(app)/vocab/page.tsx:168`

- [ ] **Step 1: Add `flex-wrap` to the mode selector**

In `podium/app/(app)/vocab/page.tsx`, change line 168 from:
```tsx
<div className="flex gap-2">
```
to:
```tsx
<div className="flex flex-wrap gap-2">
```

This allows the three mode buttons to wrap to a second line on narrow screens instead of overflowing.

- [ ] **Step 2: Final build verification**

Run: `cd podium && npm run build 2>&1 | tail -20`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit all changes**

```bash
git add podium/components/layout/BottomNav.tsx \
        podium/components/layout/Sidebar.tsx \
        podium/app/\(app\)/layout.tsx \
        podium/app/\(app\)/vocab/page.tsx \
        docs/superpowers/plans/2026-05-09-mobile-nav.md
git commit -m "feat(mobile): add bottom tab bar and responsive layout"
```

---

## Visual Verification Checklist

After implementation, verify in a browser at mobile width (≤ 375px):

- [ ] Bottom tab bar floats above screen edge as a dark pill
- [ ] Active tab shows icon in blue (`#4D8EFF`) + label + underline dot
- [ ] Inactive tabs show icon only in muted gray
- [ ] No left margin on mobile (content is full-width)
- [ ] Page content has adequate bottom padding (not hidden by the bar)
- [ ] Desktop (≥ 768px): sidebar visible, bottom bar hidden
- [ ] Vocab mode selector wraps cleanly on mobile
