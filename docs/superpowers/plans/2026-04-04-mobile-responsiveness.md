# Mobile Responsiveness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all Podium app pages mobile-first with a bottom tab bar on phones, icon-only sidebar on tablets, and full sidebar on desktop.

**Architecture:** The layout shell (`app/(app)/layout.tsx`) is the single source of truth for responsive structure. The Sidebar becomes tablet/desktop-only. A new `BottomNav` component handles mobile navigation. Tailwind breakpoints (`md:`, `lg:`) drive all responsive behavior — no JS media queries needed.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, Shadcn/ui, Material Symbols Outlined icons

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `podium/app/(app)/layout.tsx` | Responsive main margin, hide sidebar on mobile |
| Modify | `podium/components/layout/Sidebar.tsx` | Hidden on mobile, icon-only on tablet (`md`), full on desktop (`lg`) |
| Create | `podium/components/layout/BottomNav.tsx` | Fixed bottom tab bar, visible only on mobile |
| Modify | `podium/components/layout/TopNav.tsx` | Add bottom padding for mobile safe area |
| Modify | `podium/components/dashboard/CountdownTimer.tsx` | Responsive countdown number size |
| Modify | `podium/components/vocab/page.tsx` (via `app/(app)/vocab/page.tsx`) | Wrapping mode selector buttons |
| Modify | `podium/app/(app)/profile/page.tsx` | Stack name/date grids on mobile |
| Modify | `podium/app/onboarding/page.tsx` | Stack name grid on mobile |
| Modify | `podium/app/(app)/layout.tsx` | Responsive padding on main content area |
| Modify | `podium/components/exams/ExamRunner.tsx` | Responsive question card padding |
| Modify | `podium/components/roleplay/ResponseEditor.tsx` | Responsive textarea height |
| Modify | `podium/components/pi/PIList.tsx` | Stack filters column on mobile |

---

### Task 1: Create BottomNav component

**Files:**
- Create: `podium/components/layout/BottomNav.tsx`

`★ Insight:` The bottom nav mirrors `NAV_ITEMS` from Sidebar but renders as a fixed bar. We include Profile in the bar (7 items would be too many — keep the 6 primary nav items and drop Sign Out to profile page only, matching iOS/Android conventions).

- [ ] **Step 1: Create the BottomNav component**

```tsx
// podium/components/layout/BottomNav.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: "dashboard" },
  { href: "/pi-tracker", label: "PI", icon: "target" },
  { href: "/events", label: "Events", icon: "category" },
  { href: "/exams", label: "Exams", icon: "quiz" },
  { href: "/roleplay", label: "Role Play", icon: "record_voice_over" },
  { href: "/vocab", label: "Vocab", icon: "style" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 frosted-glass flex items-center justify-around h-16 pb-safe md:hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/15 to-transparent" />
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
              isActive ? "text-primary" : "text-outline hover:text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Verify the file was created correctly**

```bash
cat podium/components/layout/BottomNav.tsx | head -5
```

Expected: `"use client";` on first line.

- [ ] **Step 3: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/components/layout/BottomNav.tsx
git commit -m "feat: add BottomNav component for mobile navigation"
```

---

### Task 2: Refactor app layout shell for responsive structure

**Files:**
- Modify: `podium/app/(app)/layout.tsx`
- Modify: `podium/components/layout/Sidebar.tsx`

- [ ] **Step 1: Update the app layout to wire in BottomNav and responsive margins**

Replace the entire content of `podium/app/(app)/layout.tsx`:

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
      <BottomNav />
      {/* mobile: full width with bottom padding for BottomNav
          md: offset by icon sidebar (64px)
          lg: offset by full sidebar (220px) */}
      <main className="pt-16 pb-20 md:pb-0 md:ml-[64px] lg:ml-[220px] min-h-[calc(100vh-4rem)]">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Update Sidebar to be hidden on mobile, icon-only on tablet, full on desktop**

Replace the entire content of `podium/components/layout/Sidebar.tsx`:

```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/firebase/auth";

const NAV_ITEMS = [
  { href: "/home", label: "Dashboard", icon: "dashboard" },
  { href: "/pi-tracker", label: "PI Tracker", icon: "target" },
  { href: "/events", label: "Events", icon: "category" },
  { href: "/exams", label: "Practice Exams", icon: "quiz" },
  { href: "/roleplay", label: "Role Play Coach", icon: "record_voice_over" },
  { href: "/vocab", label: "Vocab Flashcards", icon: "style" },
];

const SECONDARY_ITEMS = [
  { href: "/profile", label: "Profile", icon: "person" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    // hidden on mobile, icon-only (w-16) on tablet, full (w-[220px]) on desktop
    <aside className="hidden md:flex fixed top-16 left-0 bottom-0 md:w-16 lg:w-[220px] bg-surface-container-low py-6 flex-col gap-0.5 z-40 overflow-hidden">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`flex items-center gap-3 px-4 lg:px-6 py-2.5 text-sm font-medium transition-all duration-200 border-l-[3px] ${
              isActive
                ? "text-primary bg-primary/[0.04] border-l-primary"
                : "text-outline hover:text-on-surface-variant hover:bg-surface-container border-l-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-xl shrink-0">
              {item.icon}
            </span>
            <span className="hidden lg:block">{item.label}</span>
          </Link>
        );
      })}

      <div className="h-px my-4 mx-4 lg:mx-6 bg-outline-variant/15" />

      {SECONDARY_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`flex items-center gap-3 px-4 lg:px-6 py-2.5 text-sm font-medium transition-all duration-200 border-l-[3px] ${
              isActive
                ? "text-primary bg-primary/[0.04] border-l-primary"
                : "text-outline hover:text-on-surface-variant hover:bg-surface-container border-l-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-xl shrink-0">
              {item.icon}
            </span>
            <span className="hidden lg:block">{item.label}</span>
          </Link>
        );
      })}

      <div className="mt-auto pb-6">
        <div className="h-px my-4 mx-4 lg:mx-6 bg-outline-variant/15" />
        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="flex items-center gap-3 px-4 lg:px-6 py-2.5 text-sm font-medium text-outline hover:text-error hover:bg-error/[0.04] transition-all duration-200 border-l-[3px] border-l-transparent w-full"
        >
          <span className="material-symbols-outlined text-xl shrink-0">logout</span>
          <span className="hidden lg:block">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Verify no TypeScript errors**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA/podium && npx tsc --noEmit 2>&1 | head -30
```

Expected: No errors (or only pre-existing errors unrelated to these files).

- [ ] **Step 4: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/app/(app)/layout.tsx podium/components/layout/Sidebar.tsx
git commit -m "feat: responsive layout shell — bottom nav mobile, icon sidebar tablet, full sidebar desktop"
```

---

### Task 3: Fix iOS safe area and TopNav mobile padding

**Files:**
- Modify: `podium/app/globals.css` or `podium/tailwind.config.ts` (whichever defines custom utilities)

The `pb-safe` class used in BottomNav requires a CSS custom property for iOS notch support.

- [ ] **Step 1: Check where global CSS lives**

```bash
ls podium/app/globals.css podium/app/global.css 2>/dev/null || echo "not found"
ls podium/*.css 2>/dev/null
```

- [ ] **Step 2: Add pb-safe utility to globals.css**

Open `podium/app/globals.css` and add at the bottom:

```css
/* iOS safe area padding for bottom nav */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/app/globals.css
git commit -m "feat: add pb-safe utility for iOS notch support"
```

---

### Task 4: Fix CountdownTimer responsive font size

**Files:**
- Modify: `podium/components/dashboard/CountdownTimer.tsx`

- [ ] **Step 1: Update the days number to scale down on mobile**

In `podium/components/dashboard/CountdownTimer.tsx`, replace:

```tsx
        <span className="font-headline text-[96px] font-extrabold leading-none gradient-text">
          {days}
        </span>
```

with:

```tsx
        <span className="font-headline text-[60px] sm:text-[80px] lg:text-[96px] font-extrabold leading-none gradient-text">
          {days}
        </span>
```

- [ ] **Step 2: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/components/dashboard/CountdownTimer.tsx
git commit -m "fix: responsive countdown timer font size on mobile"
```

---

### Task 5: Fix Vocab mode selector overflow on mobile

**Files:**
- Modify: `podium/app/(app)/vocab/page.tsx`

- [ ] **Step 1: Add flex-wrap to mode selector**

In `podium/app/(app)/vocab/page.tsx`, replace:

```tsx
      <div className="flex gap-2">
```

with:

```tsx
      <div className="flex flex-wrap gap-2">
```

- [ ] **Step 2: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/app/(app)/vocab/page.tsx
git commit -m "fix: wrap vocab mode selector buttons on mobile"
```

---

### Task 6: Fix Profile page grid stacking on mobile

**Files:**
- Modify: `podium/app/(app)/profile/page.tsx`

- [ ] **Step 1: Fix name fields grid**

In `podium/app/(app)/profile/page.tsx`, replace:

```tsx
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-outline mb-1 block">First Name</label>
```

with:

```tsx
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-outline mb-1 block">First Name</label>
```

- [ ] **Step 2: Fix competition date/level grid**

In `podium/app/(app)/profile/page.tsx`, replace:

```tsx
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-outline mb-1 block">Competition Date</label>
```

with:

```tsx
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-outline mb-1 block">Competition Date</label>
```

- [ ] **Step 3: Make profile page padding responsive**

In `podium/app/(app)/profile/page.tsx`, replace all occurrences of:

```tsx
className="bg-surface-container-low rounded-2xl p-8 space-y-5"
```

with:

```tsx
className="bg-surface-container-low rounded-2xl p-4 sm:p-8 space-y-5"
```

And:

```tsx
className="bg-surface-container-low rounded-2xl p-8"
```

with:

```tsx
className="bg-surface-container-low rounded-2xl p-4 sm:p-8"
```

And:

```tsx
className="bg-error/5 rounded-2xl p-8 space-y-4"
```

with:

```tsx
className="bg-error/5 rounded-2xl p-4 sm:p-8 space-y-4"
```

- [ ] **Step 4: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/app/(app)/profile/page.tsx
git commit -m "fix: responsive grid stacking and padding on profile page"
```

---

### Task 7: Fix Onboarding name grid on mobile

**Files:**
- Modify: `podium/app/onboarding/page.tsx`

- [ ] **Step 1: Stack name fields on mobile**

In `podium/app/onboarding/page.tsx` inside `StepPersonalInfo`, replace:

```tsx
        <div className="grid grid-cols-2 gap-4">
```

with:

```tsx
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
```

- [ ] **Step 2: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/app/onboarding/page.tsx
git commit -m "fix: stack name fields on mobile in onboarding"
```

---

### Task 8: Fix ExamRunner padding on mobile

**Files:**
- Modify: `podium/components/exams/ExamRunner.tsx`

- [ ] **Step 1: Make question card padding responsive**

In `podium/components/exams/ExamRunner.tsx`, replace:

```tsx
        <div className="bg-surface-container-low rounded-2xl p-8">
```

with:

```tsx
        <div className="bg-surface-container-low rounded-2xl p-4 sm:p-8">
```

- [ ] **Step 2: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/components/exams/ExamRunner.tsx
git commit -m "fix: responsive question card padding in ExamRunner"
```

---

### Task 9: Fix ResponseEditor textarea on mobile

**Files:**
- Modify: `podium/components/roleplay/ResponseEditor.tsx`

- [ ] **Step 1: Make textarea height responsive**

In `podium/components/roleplay/ResponseEditor.tsx`, replace:

```tsx
        className="w-full h-64 bg-surface-container-low rounded-2xl p-6 text-sm text-on-surface placeholder:text-outline resize-none focus:outline-none focus:ring-1 focus:ring-primary/30"
```

with:

```tsx
        className="w-full min-h-[160px] h-[40vw] max-h-64 md:h-64 bg-surface-container-low rounded-2xl p-4 sm:p-6 text-sm text-on-surface placeholder:text-outline resize-none focus:outline-none focus:ring-1 focus:ring-primary/30"
```

- [ ] **Step 2: Make submit row wrap on small screens**

In `podium/components/roleplay/ResponseEditor.tsx`, replace:

```tsx
      <div className="flex items-center justify-between">
        <span className="text-xs text-outline">{response.length} characters</span>
```

with:

```tsx
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-outline">{response.length} characters</span>
```

- [ ] **Step 3: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/components/roleplay/ResponseEditor.tsx
git commit -m "fix: responsive textarea height and submit row in ResponseEditor"
```

---

### Task 10: Fix PIList filter row on mobile

**Files:**
- Modify: `podium/components/pi/PIList.tsx`

- [ ] **Step 1: Stack filters vertically on mobile**

In `podium/components/pi/PIList.tsx`, replace:

```tsx
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
```

with:

```tsx
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[160px]">
```

Also add `w-full sm:w-auto` to both select elements:

```tsx
        <select
          value={masteryFilter}
          onChange={(e) => setMasteryFilter(e.target.value)}
          className="w-full sm:w-auto bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
```

```tsx
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
```

- [ ] **Step 2: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/components/pi/PIList.tsx
git commit -m "fix: responsive filter row stacking in PIList"
```

---

### Task 11: Fix role play and exam setup card padding on mobile

**Files:**
- Modify: `podium/app/(app)/roleplay/page.tsx`
- Modify: `podium/app/(app)/exams/page.tsx`

- [ ] **Step 1: Fix roleplay setup card padding**

In `podium/app/(app)/roleplay/page.tsx`, replace:

```tsx
      <div className="bg-surface-container-low rounded-2xl p-8">
```

with:

```tsx
      <div className="bg-surface-container-low rounded-2xl p-4 sm:p-8">
```

- [ ] **Step 2: Fix exams setup card padding**

In `podium/app/(app)/exams/page.tsx`, replace:

```tsx
      <div className="bg-surface-container-low rounded-2xl p-8">
```

with:

```tsx
      <div className="bg-surface-container-low rounded-2xl p-4 sm:p-8">
```

- [ ] **Step 3: Fix exams results back button — stack on mobile**

In `podium/app/(app)/exams/page.tsx`, replace:

```tsx
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Exam Results
          </h1>
```

with:

```tsx
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Exam Results
          </h1>
```

- [ ] **Step 4: Fix roleplay results back button — stack on mobile**

In `podium/app/(app)/roleplay/page.tsx`, replace:

```tsx
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Role Play Results
          </h1>
```

with:

```tsx
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Role Play Results
          </h1>
```

- [ ] **Step 5: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/app/(app)/roleplay/page.tsx podium/app/(app)/exams/page.tsx
git commit -m "fix: responsive padding and header layout on roleplay and exams pages"
```

---

### Task 12: Fix PI Tracker page header on mobile

**Files:**
- Modify: `podium/app/(app)/pi-tracker/page.tsx`

- [ ] **Step 1: Make header row wrap on mobile**

In `podium/app/(app)/pi-tracker/page.tsx`, replace:

```tsx
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">PI Tracker</h1>
```

with:

```tsx
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">PI Tracker</h1>
```

- [ ] **Step 2: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
git add podium/app/(app)/pi-tracker/page.tsx
git commit -m "fix: wrap PI tracker header on mobile"
```

---

### Task 13: Verify build passes

- [ ] **Step 1: Run Next.js build**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA/podium && npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully` with no errors.

- [ ] **Step 2: Run TypeScript check**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA/podium && npx tsc --noEmit 2>&1 | head -30
```

Expected: No output (clean).

- [ ] **Step 3: If build errors, fix them before proceeding**

Common issues:
- Missing import for `BottomNav` → verify import path is `@/components/layout/BottomNav`
- `pb-safe` not recognized → ensure `globals.css` edit was saved

---
