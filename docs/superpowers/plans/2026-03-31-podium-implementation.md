# Podium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Podium, a full-stack DECA competition prep platform with Firebase, Next.js 16, AI-powered coaching, and an "Executive Brutalism" design system.

**Architecture:** Hybrid data access — Firebase Client SDK for real-time reads, Server Actions with Admin SDK for all writes. Route Handlers only for streaming AI endpoints and admin seeding. Firestore collections denormalized for read speed. All UI follows the "Executive Brutalism" design system (tonal layering, no borders, Plus Jakarta Sans + Inter).

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, Shadcn/ui, Firebase (Firestore + Auth), Anthropic Claude API (`claude-sonnet-4-6`), Material Symbols, jsPDF

---

## File Map

### Core Infrastructure
| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout — fonts, dark theme, global styles |
| `app/globals.css` | Tailwind v4 directives + design system CSS custom properties |
| `tailwind.config.ts` | Design system color tokens, font families, border radii |
| `middleware.ts` | Auth cookie check, onboarding redirect, route protection |
| `.env.local` | All environment variables (never committed) |
| `firestore.rules` | Security rules (read-only client, deny writes) |

### Firebase
| File | Purpose |
|------|---------|
| `lib/firebase/client.ts` | Firebase Client SDK singleton — `getApp()`, `getAuth()`, `getFirestore()` |
| `lib/firebase/admin.ts` | Firebase Admin SDK singleton — `getFirestore()` for server |
| `lib/firebase/auth.ts` | Client auth helpers — `signInWithEmail`, `signUpWithEmail`, `signInWithGoogle`, `signOut` |

### Auth Pages
| File | Purpose |
|------|---------|
| `app/(auth)/layout.tsx` | Centered layout, no sidebar, frosted glass nav |
| `app/(auth)/login/page.tsx` | Login form + Google OAuth button |
| `app/(auth)/signup/page.tsx` | Signup form + Google OAuth button |

### Onboarding
| File | Purpose |
|------|---------|
| `app/onboarding/page.tsx` | 4-step onboarding flow (profile → cluster → event → date) |
| `lib/actions/onboarding.ts` | Server Action — creates user doc in Firestore |

### App Shell
| File | Purpose |
|------|---------|
| `app/(app)/layout.tsx` | App layout — frosted glass top nav + 220px sidebar |
| `components/layout/TopNav.tsx` | Fixed top nav — logo, event badge, avatar |
| `components/layout/Sidebar.tsx` | Left sidebar — nav items with active state |
| `components/layout/Footer.tsx` | Legal disclaimer footer |

### Seed Data
| File | Purpose |
|------|---------|
| `data/events.ts` | All 59 DECA events as typed array |
| `data/performance-indicators.ts` | PI data for top 10 events |
| `scripts/seed-events.ts` | Script to write events to Firestore |
| `scripts/seed-pis.ts` | Script to write PIs to Firestore |

### Dashboard
| File | Purpose |
|------|---------|
| `app/(app)/home/page.tsx` | Dashboard page — assembles dashboard components |
| `components/dashboard/CountdownTimer.tsx` | Competition countdown (client, updates every second) |
| `components/dashboard/MasteryRing.tsx` | SVG circular progress chart |
| `components/dashboard/StreakTracker.tsx` | Current streak display (gold accent) |
| `components/dashboard/WeeklyGoal.tsx` | Weekly session progress bar |
| `components/dashboard/QuickActions.tsx` | 3 action cards (exam, roleplay, vocab) |
| `components/dashboard/RecentActivity.tsx` | Last 5 activity items |
| `lib/hooks/useAuth.ts` | Auth state hook — `user`, `loading`, `signOut` |
| `lib/hooks/useFirestore.ts` | Real-time Firestore listener hook |
| `lib/hooks/useCountdown.ts` | Countdown timer hook |

### PI Tracker
| File | Purpose |
|------|---------|
| `app/(app)/pi-tracker/page.tsx` | PI Tracker page |
| `components/pi/PICard.tsx` | Single PI row — text, category, mastery badge, stats |
| `components/pi/PIList.tsx` | Filterable list of PIs |
| `components/pi/MasteryBadge.tsx` | Mastered/Learning/Untested badge |
| `components/pi/MasterySummaryBar.tsx` | Summary stats bar |
| `components/pi/PIExportButton.tsx` | PDF export button |
| `lib/actions/progress.ts` | Shared mastery logic — `updatePIProgress()` |

### Events
| File | Purpose |
|------|---------|
| `app/(app)/events/page.tsx` | Events hub — filterable grid |
| `app/(app)/events/[slug]/page.tsx` | Event detail — PIs, tips, resources, actions |
| `components/events/EventCard.tsx` | Event card — name, code, cluster, category |
| `components/events/EventFilter.tsx` | Filter bar — cluster, category |

### Exams
| File | Purpose |
|------|---------|
| `app/(app)/exams/page.tsx` | Exam launcher + results |
| `components/exams/ExamRunner.tsx` | Timed exam — question navigation, timer, submit |
| `components/exams/QuestionCard.tsx` | Single question — A/B/C/D options |
| `components/exams/ResultsBreakdown.tsx` | Score, PI breakdown, wrong answers |
| `components/exams/ExplainButton.tsx` | AI explain trigger + inline display |
| `lib/actions/exams.ts` | Server Action — score exam, update progress, save attempt |
| `app/api/ai/explain/route.ts` | Non-streaming Claude explainer |

### Role Play
| File | Purpose |
|------|---------|
| `app/(app)/roleplay/page.tsx` | Role play launcher + results |
| `components/roleplay/ScenarioDisplay.tsx` | Scenario card — context, role, task |
| `components/roleplay/ResponseEditor.tsx` | Text area + 30-min timer |
| `components/roleplay/Scorecard.tsx` | Per-PI scores, strengths, improvements |
| `lib/actions/roleplay.ts` | Server Action — save attempt, update progress |
| `app/api/ai/roleplay-score/route.ts` | Streaming Claude scorer |

### Vocab
| File | Purpose |
|------|---------|
| `app/(app)/vocab/page.tsx` | Vocab page — mode selector + study area |
| `components/vocab/Flashcard.tsx` | Flip card animation |
| `components/vocab/MultipleChoice.tsx` | 4-option quiz |
| `components/vocab/TypeAnswer.tsx` | Type + fuzzy match |
| `components/vocab/VocabProgress.tsx` | Per-cluster progress bar |
| `lib/actions/vocab.ts` | Server Action — update vocab progress |

### Profile
| File | Purpose |
|------|---------|
| `app/(app)/profile/page.tsx` | Profile + settings |
| `lib/actions/profile.ts` | Server Actions — update profile, delete account |

### AI Chat
| File | Purpose |
|------|---------|
| `components/ai/PIStudyChat.tsx` | Floating chat widget |
| `app/api/ai/chat/route.ts` | Streaming Claude chat |
| `lib/ai/anthropic.ts` | Anthropic client singleton |
| `lib/ai/prompts.ts` | All prompt templates |

### Admin Seeding
| File | Purpose |
|------|---------|
| `app/api/admin/generate-questions/route.ts` | Generate 100 questions per event |
| `app/api/admin/generate-scenarios/route.ts` | Generate 10 scenarios per event |

### Legal Components
| File | Purpose |
|------|---------|
| `components/legal/ExamDisclaimer.tsx` | Exam attribution text |
| `components/legal/RolePlayDisclaimer.tsx` | Role play attribution text |
| `components/legal/PIAttribution.tsx` | PI source attribution |
| `components/legal/VocabAttribution.tsx` | Vocab source attribution |

### Landing Page
| File | Purpose |
|------|---------|
| `app/page.tsx` | Public landing page — full-width, no sidebar |

---

## Task 1: Scaffold Next.js 16 App

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `.env.local`, `.gitignore`

- [ ] **Step 1: Create Next.js 16 app**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA
npx create-next-app@latest podium --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

Accept defaults. This creates the `podium/` directory with Next.js 16, Tailwind CSS v4, TypeScript, and App Router.

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA/podium
npm install firebase firebase-admin @anthropic-ai/sdk jspdf
npm install -D @types/node
```

- [ ] **Step 3: Install Shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: Default
- Base color: Neutral
- CSS variables: Yes

Then install the components we'll need:

```bash
npx shadcn@latest add button input label card dialog select tabs progress badge separator dropdown-menu avatar sheet tooltip
```

- [ ] **Step 4: Add Google Fonts (Plus Jakarta Sans + Inter) and Material Symbols**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Podium — DECA Competition Prep",
  description:
    "The only free platform built for DECA competitors — PI tracking, AI role play coaching, vocab flashcards, and practice exams for every event.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${inter.variable} bg-surface text-on-surface font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Configure Tailwind with design system tokens**

Replace `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#131313",
        "surface-dim": "#131313",
        "surface-bright": "#3a3939",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "surface-variant": "#353534",
        "surface-tint": "#adc6ff",
        primary: "#adc6ff",
        "primary-container": "#4d8eff",
        "primary-fixed": "#d8e2ff",
        "primary-fixed-dim": "#adc6ff",
        "on-primary": "#002e6a",
        "on-primary-container": "#00285d",
        "on-primary-fixed": "#001a42",
        "on-primary-fixed-variant": "#004395",
        "inverse-primary": "#005ac2",
        secondary: "#ffb95f",
        "secondary-container": "#ee9800",
        "secondary-fixed": "#ffddb8",
        "secondary-fixed-dim": "#ffb95f",
        "on-secondary": "#472a00",
        "on-secondary-container": "#5b3800",
        "on-secondary-fixed": "#2a1700",
        "on-secondary-fixed-variant": "#653e00",
        tertiary: "#4edea5",
        "tertiary-container": "#00a574",
        "tertiary-fixed": "#6ffbc0",
        "tertiary-fixed-dim": "#4edea5",
        "on-tertiary": "#003825",
        "on-tertiary-container": "#003120",
        "on-tertiary-fixed": "#002114",
        "on-tertiary-fixed-variant": "#005137",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#c2c6d6",
        "on-background": "#e5e2e1",
        background: "#131313",
        outline: "#8c909f",
        "outline-variant": "#424754",
        "inverse-surface": "#e5e2e1",
        "inverse-on-surface": "#313030",
      },
      fontFamily: {
        headline: ["var(--font-headline)", "Plus Jakarta Sans", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        label: ["var(--font-body)", "Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Set up globals.css**

Replace `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    min-height: 100dvh;
  }

  /* Material Symbols configuration */
  .material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  }
}

@layer utilities {
  /* Ghost border — 15% opacity outline-variant for accessibility fallback */
  .ghost-border {
    border: 1px solid rgba(66, 71, 84, 0.15);
  }

  /* Gradient CTA button */
  .gradient-cta {
    background: linear-gradient(135deg, #adc6ff, #4d8eff);
    color: #002e6a;
  }

  /* Frosted glass effect */
  .frosted-glass {
    background: rgba(19, 19, 19, 0.8);
    backdrop-filter: blur(16px);
  }

  /* Gradient text */
  .gradient-text {
    background: linear-gradient(135deg, #adc6ff, #4d8eff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Progress track gradient */
  .progress-gradient {
    background: linear-gradient(90deg, #ffb95f, #ee9800);
  }
}
```

- [ ] **Step 7: Create .env.local template**

Create `.env.local`:

```
# Firebase Client (public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Admin seeding
ADMIN_SECRET_KEY=
```

- [ ] **Step 8: Update .gitignore**

Append to `.gitignore`:

```
.env.local
.env*.local
```

- [ ] **Step 9: Verify the app starts**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA/podium
npm run dev
```

Open `http://localhost:3000`. You should see the default Next.js page with the dark background (#131313).

- [ ] **Step 10: Commit**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA/podium
git init
git add .
git commit -m "feat: scaffold Next.js 16 app with Tailwind v4, Shadcn/ui, and Executive Brutalism design tokens"
```

---

## Task 2: Firebase Client & Admin SDK Setup

**Files:**
- Create: `lib/firebase/client.ts`, `lib/firebase/admin.ts`, `firestore.rules`

- [ ] **Step 1: Create Firebase Client SDK singleton**

Create `lib/firebase/client.ts`:

```ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
```

- [ ] **Step 2: Create Firebase Admin SDK singleton**

Create `lib/firebase/admin.ts`:

```ts
import {
  initializeApp,
  getApps,
  cert,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app =
  getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApps()[0];

const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminDb, adminAuth };
```

- [ ] **Step 3: Create Firestore security rules**

Create `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own doc and all subcollections
    match /users/{uid}/{document=**} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false;
    }

    // Events and PIs — read-only for authenticated users
    match /events/{eventId}/{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Vocab — read-only for authenticated users
    match /vocabWords/{vocabId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Practice exams — read-only for authenticated users
    match /practiceExams/{questionId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Role play scenarios — read-only for authenticated users
    match /roleplayScenarios/{scenarioId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

- [ ] **Step 4: Verify imports compile**

```bash
cd /Users/kamalvaradarajulu/Dev/DECA/podium
npx tsc --noEmit
```

Expected: no errors (env vars are empty strings but types are valid).

- [ ] **Step 5: Commit**

```bash
git add lib/firebase/client.ts lib/firebase/admin.ts firestore.rules
git commit -m "feat: add Firebase client/admin SDK singletons and Firestore security rules"
```

---

## Task 3: Authentication (Signup, Login, Google OAuth, Middleware)

**Files:**
- Create: `lib/firebase/auth.ts`, `lib/hooks/useAuth.ts`, `app/(auth)/layout.tsx`, `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`, `middleware.ts`

- [ ] **Step 1: Create client-side auth helpers**

Create `lib/firebase/auth.ts`:

```ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "./client";

const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await setSessionCookie(credential.user);
  return credential.user;
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await setSessionCookie(credential.user);
  return credential.user;
}

export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await setSessionCookie(credential.user);
  return credential.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
  await fetch("/api/auth/session", { method: "DELETE" });
}

async function setSessionCookie(user: User) {
  const idToken = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}
```

- [ ] **Step 2: Create session API route**

Create `app/api/auth/session/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Create session cookie (5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.json({ status: "success" });
}
```

- [ ] **Step 3: Create useAuth hook**

Create `lib/hooks/useAuth.ts`:

```ts
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}
```

- [ ] **Step 4: Create middleware for route protection**

Create `middleware.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  // Public routes — no auth needed
  if (publicRoutes.includes(pathname)) {
    // If logged in and hitting auth pages, redirect to dashboard
    if (session && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  }

  // API routes — handled by their own auth
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // All other routes require auth
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 5: Create auth layout**

Create `app/(auth)/layout.tsx`:

```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Frosted glass header */}
      <header className="fixed top-0 w-full z-50 frosted-glass flex items-center px-6 h-16">
        <a href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            trophy
          </span>
          <span className="font-headline text-2xl font-bold tracking-tighter text-primary">
            Podium
          </span>
        </a>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/15 to-transparent" />
      </header>

      {/* Centered content */}
      <main className="flex-grow flex items-center justify-center pt-16 px-4">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 6: Create login page**

Create `app/(auth)/login/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push("/home");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/home");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in with Google";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold tracking-[0.2em] text-primary font-headline uppercase">
            Welcome back
          </span>
          <div className="h-px flex-grow bg-outline-variant/20" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-on-surface leading-tight">
          Sign in to Podium
        </h1>
        <p className="text-on-surface-variant text-lg font-body">
          Continue your DECA prep journey.
        </p>
      </div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <div className="group flex flex-col p-6 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container">
          <Label className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4">
            Email
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            className="bg-transparent border-none p-0 text-lg font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus-visible:ring-0 shadow-none"
            required
          />
        </div>

        <div className="group flex flex-col p-6 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container">
          <Label className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4">
            Password
          </Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-transparent border-none p-0 text-lg font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus-visible:ring-0 shadow-none"
            required
          />
        </div>

        {error && (
          <p className="text-error text-sm font-body px-2">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="gradient-cta font-bold rounded-lg text-lg py-6 shadow-xl shadow-primary/10"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="flex items-center gap-4">
        <div className="h-px flex-grow bg-outline-variant/20" />
        <span className="text-xs text-outline uppercase tracking-widest">
          or
        </span>
        <div className="h-px flex-grow bg-outline-variant/20" />
      </div>

      <Button
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="bg-surface-container-low text-on-surface ghost-border rounded-lg py-6 text-base hover:bg-surface-container"
      >
        <span className="material-symbols-outlined mr-2">google</span>
        Continue with Google
      </Button>

      <p className="text-center text-on-surface-variant text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-primary hover:underline">
          Sign up free
        </a>
      </p>
    </div>
  );
}
```

- [ ] **Step 7: Create signup page**

Create `app/(auth)/signup/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      router.push("/onboarding");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create account";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/onboarding");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign up with Google";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold tracking-[0.2em] text-primary font-headline uppercase">
            Get started
          </span>
          <div className="h-px flex-grow bg-outline-variant/20" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-on-surface leading-tight">
          Create your account
        </h1>
        <p className="text-on-surface-variant text-lg font-body">
          Free forever. Built for DECA competitors.
        </p>
      </div>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div className="group flex flex-col p-6 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container">
          <Label className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4">
            Email
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            className="bg-transparent border-none p-0 text-lg font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus-visible:ring-0 shadow-none"
            required
          />
        </div>

        <div className="group flex flex-col p-6 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container">
          <Label className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4">
            Password
          </Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="bg-transparent border-none p-0 text-lg font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus-visible:ring-0 shadow-none"
            required
          />
        </div>

        <div className="group flex flex-col p-6 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container">
          <Label className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4">
            Confirm Password
          </Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-transparent border-none p-0 text-lg font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus-visible:ring-0 shadow-none"
            required
          />
        </div>

        {error && (
          <p className="text-error text-sm font-body px-2">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="gradient-cta font-bold rounded-lg text-lg py-6 shadow-xl shadow-primary/10"
        >
          {loading ? "Creating account..." : "Get Started Free"}
        </Button>
      </form>

      <div className="flex items-center gap-4">
        <div className="h-px flex-grow bg-outline-variant/20" />
        <span className="text-xs text-outline uppercase tracking-widest">
          or
        </span>
        <div className="h-px flex-grow bg-outline-variant/20" />
      </div>

      <Button
        variant="outline"
        onClick={handleGoogleSignup}
        disabled={loading}
        className="bg-surface-container-low text-on-surface ghost-border rounded-lg py-6 text-base hover:bg-surface-container"
      >
        <span className="material-symbols-outlined mr-2">google</span>
        Continue with Google
      </Button>

      <p className="text-center text-on-surface-variant text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
```

- [ ] **Step 8: Verify auth pages render**

```bash
npm run dev
```

Visit `http://localhost:3000/login` and `http://localhost:3000/signup`. Both pages should render with the Executive Brutalism design (dark background, tonal card inputs, gradient CTA button, frosted glass header).

- [ ] **Step 9: Commit**

```bash
git add lib/firebase/auth.ts lib/hooks/useAuth.ts app/\(auth\) app/api/auth middleware.ts
git commit -m "feat: add Firebase auth (email/password + Google OAuth), session cookies, and route protection middleware"
```

---

## Task 4: Onboarding Flow

**Files:**
- Create: `app/onboarding/page.tsx`, `lib/actions/onboarding.ts`

- [ ] **Step 1: Create onboarding Server Action**

Create `lib/actions/onboarding.ts`:

```ts
"use server";

import { adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

interface OnboardingData {
  firstName: string;
  lastName: string;
  school: string;
  cluster: string;
  eventId: string;
  competitionDate: string;
  competitionLevel: "districts" | "state" | "icdc";
}

export async function completeOnboarding(data: OnboardingData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Not authenticated");

  const decoded = await adminAuth.verifySessionCookie(session);
  const uid = decoded.uid;

  await adminDb
    .collection("users")
    .doc(uid)
    .set({
      name: `${data.firstName} ${data.lastName}`,
      school: data.school,
      cluster: data.cluster,
      eventId: data.eventId,
      competitionDate: data.competitionDate,
      competitionLevel: data.competitionLevel,
      streak: 0,
      longestStreak: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      weeklySessionCount: 0,
      weeklyGoalResetDate: getMonday().toISOString(),
    });

  return { success: true };
}

function getMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff));
}
```

- [ ] **Step 2: Create onboarding page**

Create `app/onboarding/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CLUSTERS = [
  {
    id: "marketing",
    name: "Marketing",
    icon: "campaign",
  },
  {
    id: "finance",
    name: "Finance",
    icon: "account_balance",
  },
  {
    id: "business-mgmt",
    name: "Business Management & Administration",
    icon: "business_center",
  },
  {
    id: "hospitality",
    name: "Hospitality & Tourism",
    icon: "hotel",
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship",
    icon: "rocket_launch",
  },
  {
    id: "personal-finance",
    name: "Personal Financial Literacy",
    icon: "savings",
  },
];

// Simplified event list — full list loaded from Firestore in production
const EVENTS_BY_CLUSTER: Record<string, { id: string; name: string; code: string }[]> = {
  marketing: [
    { id: "aam", name: "Apparel and Accessories Marketing Series", code: "AAM" },
    { id: "asm", name: "Automotive Services Marketing Series", code: "ASM" },
    { id: "bsm", name: "Business Services Marketing Series", code: "BSM" },
    { id: "fms", name: "Food Marketing Series", code: "FMS" },
    { id: "mcs", name: "Marketing Communications Series", code: "MCS" },
    { id: "mtdm", name: "Marketing Management Team Decision Making", code: "MTDM" },
    { id: "qsrm", name: "Quick Serve Restaurant Management Series", code: "QSRM" },
    { id: "rfsm", name: "Restaurant and Food Service Management Series", code: "RFSM" },
    { id: "rms", name: "Retail Merchandising Series", code: "RMS" },
    { id: "sem", name: "Sports and Entertainment Marketing Series", code: "SEM" },
    { id: "stdm", name: "Sports and Entertainment Marketing Team Decision Making", code: "STDM" },
    { id: "seor", name: "Sports and Entertainment Marketing Operations Research", code: "SEOR" },
    { id: "imce", name: "Integrated Marketing Campaign-Event", code: "IMCE" },
    { id: "imcp", name: "Integrated Marketing Campaign-Product", code: "IMCP" },
    { id: "imcs", name: "Integrated Marketing Campaign-Service", code: "IMCS" },
    { id: "pse", name: "Professional Selling", code: "PSE" },
    { id: "pmk", name: "Principles of Marketing", code: "PMK" },
  ],
  finance: [
    { id: "act", name: "Accounting Applications Series", code: "ACT" },
    { id: "bfs", name: "Business Finance Series", code: "BFS" },
    { id: "for", name: "Finance Operations Research", code: "FOR" },
    { id: "fce", name: "Financial Consulting", code: "FCE" },
    { id: "ftdm", name: "Financial Services Team Decision Making", code: "FTDM" },
    { id: "pfn", name: "Principles of Finance", code: "PFN" },
  ],
  "business-mgmt": [
    { id: "bltdm", name: "Business Law and Ethics Team Decision Making", code: "BLTDM" },
    { id: "bor", name: "Business Services Operations Research", code: "BOR" },
    { id: "bmor", name: "Buying and Merchandising Operations Research", code: "BMOR" },
    { id: "btdm", name: "Buying and Merchandising Team Decision Making", code: "BTDM" },
    { id: "hrm", name: "Human Resources Management Series", code: "HRM" },
    { id: "pbm", name: "Principles of Business Management and Administration", code: "PBM" },
    { id: "pmbs", name: "Business Solutions Project", code: "PMBS" },
    { id: "pmcd", name: "Career Development Project", code: "PMCD" },
    { id: "pmca", name: "Community Awareness Project", code: "PMCA" },
    { id: "pmcg", name: "Community Giving Project", code: "PMCG" },
    { id: "pmfl", name: "Financial Literacy Project", code: "PMFL" },
    { id: "pmsp", name: "Sales Project", code: "PMSP" },
  ],
  hospitality: [
    { id: "hlm", name: "Hotel and Lodging Management Series", code: "HLM" },
    { id: "htdm", name: "Hospitality Services Team Decision Making", code: "HTDM" },
    { id: "htor", name: "Hospitality and Tourism Operations Research", code: "HTOR" },
    { id: "htps", name: "Hospitality and Tourism Professional Selling", code: "HTPS" },
    { id: "pht", name: "Principles of Hospitality and Tourism", code: "PHT" },
    { id: "ttdm", name: "Travel and Tourism Team Decision Making", code: "TTDM" },
  ],
  entrepreneurship: [
    { id: "ent", name: "Entrepreneurship Series", code: "ENT" },
    { id: "etdm", name: "Entrepreneurship Team Decision Making", code: "ETDM" },
    { id: "ebg", name: "Business Growth Plan", code: "EBG" },
    { id: "efb", name: "Franchise Business Plan", code: "EFB" },
    { id: "eib", name: "Independent Business Plan", code: "EIB" },
    { id: "eip", name: "Innovation Plan", code: "EIP" },
    { id: "esb", name: "Start-Up Business Plan", code: "ESB" },
    { id: "ibp", name: "International Business Plan", code: "IBP" },
    { id: "pen", name: "Principles of Entrepreneurship", code: "PEN" },
  ],
  "personal-finance": [
    { id: "pfl", name: "Personal Financial Literacy", code: "PFL" },
  ],
};

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    school: "",
    cluster: "",
    eventId: "",
    competitionDate: "",
    competitionLevel: "" as "districts" | "state" | "icdc",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  async function handleComplete() {
    setLoading(true);
    try {
      await completeOnboarding(formData);
      router.push("/home");
    } catch (err) {
      console.error("Onboarding error:", err);
    } finally {
      setLoading(false);
    }
  }

  const events = formData.cluster ? EVENTS_BY_CLUSTER[formData.cluster] || [] : [];

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Frosted glass header */}
      <header className="fixed top-0 w-full z-50 frosted-glass flex items-center px-6 h-16">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            trophy
          </span>
          <span className="font-headline text-2xl font-bold tracking-tighter text-primary">
            Podium
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/15 to-transparent" />
      </header>

      <main className="flex-grow flex items-center justify-center pt-16 px-4">
        <div className="max-w-xl w-full flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold tracking-[0.2em] text-primary font-headline uppercase">
                Step {String(step).padStart(2, "0")} / 04
              </span>
              <div className="h-px flex-grow bg-outline-variant/20" />
            </div>

            {step === 1 && (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-on-surface leading-tight">
                  Let&apos;s set up your profile
                </h1>
                <p className="text-on-surface-variant text-lg font-body max-w-md">
                  Personalize your prep experience. This information helps us
                  curate the right competitive materials for you.
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-on-surface leading-tight">
                  Which career cluster are you in?
                </h1>
                <p className="text-on-surface-variant text-lg font-body max-w-md">
                  This determines which events and materials you see.
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-on-surface leading-tight">
                  Which event are you competing in?
                </h1>
                <p className="text-on-surface-variant text-lg font-body max-w-md">
                  We&apos;ll personalize everything to your specific event.
                </p>
              </>
            )}
            {step === 4 && (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-on-surface leading-tight">
                  When is your next competition?
                </h1>
                <p className="text-on-surface-variant text-lg font-body max-w-md">
                  This powers your countdown timer and prep schedule.
                </p>
              </>
            )}
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group flex flex-col p-6 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container">
                <Label className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4">
                  First Name
                </Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Alex"
                  className="bg-transparent border-none p-0 text-2xl font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus-visible:ring-0 shadow-none"
                />
              </div>
              <div className="group flex flex-col p-6 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container">
                <Label className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4">
                  Last Name
                </Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Morgan"
                  className="bg-transparent border-none p-0 text-2xl font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus-visible:ring-0 shadow-none"
                />
              </div>
              <div className="md:col-span-2 group flex flex-col p-6 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container">
                <div className="flex justify-between items-start mb-4">
                  <Label className="text-[10px] font-bold tracking-widest text-primary uppercase">
                    School Name
                  </Label>
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-sm">
                    school
                  </span>
                </div>
                <Input
                  value={formData.school}
                  onChange={(e) =>
                    setFormData({ ...formData, school: e.target.value })
                  }
                  placeholder="Enter your high school or college"
                  className="bg-transparent border-none p-0 text-2xl font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus-visible:ring-0 shadow-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLUSTERS.map((cluster) => (
                <button
                  key={cluster.id}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      cluster: cluster.id,
                      eventId: "",
                    })
                  }
                  className={`flex items-center gap-4 p-6 rounded-xl transition-all duration-300 text-left ${
                    formData.cluster === cluster.id
                      ? "bg-surface-container-high border-l-[3px] border-l-primary"
                      : "bg-surface-container-low hover:bg-surface-container border-l-[3px] border-l-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {cluster.icon}
                  </span>
                  <span className="font-headline font-bold text-on-surface">
                    {cluster.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() =>
                    setFormData({ ...formData, eventId: event.id })
                  }
                  className={`flex items-center gap-4 p-5 rounded-xl transition-all duration-300 text-left ${
                    formData.eventId === event.id
                      ? "bg-surface-container-high border-l-[3px] border-l-primary"
                      : "bg-surface-container-low hover:bg-surface-container border-l-[3px] border-l-transparent"
                  }`}
                >
                  <span className="text-xs font-bold tracking-widest text-primary font-headline uppercase min-w-[60px]">
                    {event.code}
                  </span>
                  <span className="font-body text-on-surface">
                    {event.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div className="group flex flex-col p-6 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container">
                <Label className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4">
                  Competition Date
                </Label>
                <Input
                  type="date"
                  value={formData.competitionDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      competitionDate: e.target.value,
                    })
                  }
                  className="bg-transparent border-none p-0 text-2xl font-semibold text-on-surface focus-visible:ring-0 shadow-none [color-scheme:dark]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {(["districts", "state", "icdc"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setFormData({ ...formData, competitionLevel: level })
                    }
                    className={`p-5 rounded-xl transition-all duration-300 text-center font-headline font-bold capitalize ${
                      formData.competitionLevel === level
                        ? "bg-surface-container-high border-l-[3px] border-l-primary"
                        : "bg-surface-container-low hover:bg-surface-container border-l-[3px] border-l-transparent"
                    }`}
                  >
                    {level === "icdc" ? "ICDC" : level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full ${
                    s === step
                      ? "bg-primary"
                      : s < step
                        ? "bg-primary/50"
                        : "bg-surface-container-highest"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="bg-surface-container-low text-on-surface ghost-border rounded-lg py-6 px-8 hover:bg-surface-container"
                >
                  Back
                </Button>
              )}

              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 &&
                      (!formData.firstName ||
                        !formData.lastName ||
                        !formData.school)) ||
                    (step === 2 && !formData.cluster) ||
                    (step === 3 && !formData.eventId)
                  }
                  className="flex-1 md:flex-none gradient-cta font-bold rounded-lg text-lg py-6 px-10 shadow-xl shadow-primary/10 flex items-center gap-3"
                >
                  Next Step
                  <span className="material-symbols-outlined text-xl">
                    arrow_forward
                  </span>
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={
                    loading ||
                    !formData.competitionDate ||
                    !formData.competitionLevel
                  }
                  className="flex-1 md:flex-none gradient-cta font-bold rounded-lg text-lg py-6 px-10 shadow-xl shadow-primary/10"
                >
                  {loading ? "Setting up..." : "Let's go"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Update middleware to check for onboarding**

Modify `middleware.ts` — add onboarding redirect logic:

```ts
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;
  const hasCompletedOnboarding =
    request.cookies.get("onboarding_complete")?.value === "true";

  // Public routes
  if (publicRoutes.includes(pathname)) {
    if (session && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  }

  // API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Onboarding page — allow if authed
  if (pathname === "/onboarding") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // All other routes require auth + onboarding
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If onboarding not complete, redirect to onboarding
  // The cookie is set by the onboarding Server Action
  if (!hasCompletedOnboarding) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 4: Update onboarding action to set cookie**

Update `lib/actions/onboarding.ts` — add cookie setting after Firestore write:

```ts
"use server";

import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

interface OnboardingData {
  firstName: string;
  lastName: string;
  school: string;
  cluster: string;
  eventId: string;
  competitionDate: string;
  competitionLevel: "districts" | "state" | "icdc";
}

export async function completeOnboarding(data: OnboardingData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Not authenticated");

  const decoded = await adminAuth.verifySessionCookie(session);
  const uid = decoded.uid;

  await adminDb
    .collection("users")
    .doc(uid)
    .set({
      name: `${data.firstName} ${data.lastName}`,
      school: data.school,
      cluster: data.cluster,
      eventId: data.eventId,
      competitionDate: data.competitionDate,
      competitionLevel: data.competitionLevel,
      streak: 0,
      longestStreak: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      weeklySessionCount: 0,
      weeklyGoalResetDate: getMonday().toISOString(),
    });

  // Set onboarding complete cookie
  cookieStore.set("onboarding_complete", "true", {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return { success: true };
}

function getMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff));
}
```

- [ ] **Step 5: Verify onboarding flow renders**

```bash
npm run dev
```

Visit `http://localhost:3000/onboarding`. All 4 steps should render with correct design (tonal input cards, cluster grid, event list, date picker + level selector, dot indicators, gradient CTA).

- [ ] **Step 6: Commit**

```bash
git add app/onboarding lib/actions/onboarding.ts middleware.ts
git commit -m "feat: add 4-step onboarding flow with cluster/event selection and Firestore user creation"
```

---

## Task 5: Seed Events Data

**Files:**
- Create: `data/events.ts`, `scripts/seed-events.ts`

- [ ] **Step 1: Create events data file**

Create `data/events.ts`:

```ts
export interface DECAEvent {
  id: string;
  name: string;
  code: string;
  cluster: string;
  category: string;
  participants: string;
  prepTimeMins: number;
  interviewTimeMins: number;
  hasExam: boolean;
  overview: string;
  officialPiPdfUrl: string;
  officialSampleExamUrl: string;
  officialGuidelinesUrl: string;
}

export const DECA_EVENTS: DECAEvent[] = [
  {
    id: "act",
    name: "Accounting Applications Series",
    code: "ACT",
    cluster: "finance",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Measures understanding of accounting principles, financial statements, and business math in applied scenarios.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ACT-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ACT-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ACT-Guidelines.pdf",
  },
  {
    id: "aam",
    name: "Apparel and Accessories Marketing Series",
    code: "AAM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Focuses on marketing principles applied to apparel and accessories retail.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-AAM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-AAM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-AAM-Guidelines.pdf",
  },
  {
    id: "asm",
    name: "Automotive Services Marketing Series",
    code: "ASM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Tests marketing knowledge in the context of automotive services and products.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ASM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ASM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ASM-Guidelines.pdf",
  },
  {
    id: "bfs",
    name: "Business Finance Series",
    code: "BFS",
    cluster: "finance",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Covers financial analysis, banking, securities, and insurance concepts.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BFS-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BFS-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BFS-Guidelines.pdf",
  },
  {
    id: "ebg",
    name: "Business Growth Plan",
    code: "EBG",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Develop a comprehensive business growth plan for an existing business.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-EBG-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-EBG-Guidelines.pdf",
  },
  {
    id: "bltdm",
    name: "Business Law and Ethics Team Decision Making",
    code: "BLTDM",
    cluster: "business-mgmt",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Team-based event focusing on business law and ethics scenarios.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BLTDM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BLTDM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BLTDM-Guidelines.pdf",
  },
  {
    id: "bsm",
    name: "Business Services Marketing Series",
    code: "BSM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Applies marketing concepts to service-based businesses.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BSM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BSM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BSM-Guidelines.pdf",
  },
  {
    id: "bor",
    name: "Business Services Operations Research",
    code: "BOR",
    cluster: "business-mgmt",
    category: "Business Operations Research",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Research-based event analyzing business services operations.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BOR-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BOR-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BOR-Guidelines.pdf",
  },
  {
    id: "pmbs",
    name: "Business Solutions Project",
    code: "PMBS",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Develop and present a project addressing a real-world business problem.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMBS-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMBS-Guidelines.pdf",
  },
  {
    id: "bmor",
    name: "Buying and Merchandising Operations Research",
    code: "BMOR",
    cluster: "business-mgmt",
    category: "Business Operations Research",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Research-based event analyzing buying and merchandising operations.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BMOR-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BMOR-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BMOR-Guidelines.pdf",
  },
  {
    id: "btdm",
    name: "Buying and Merchandising Team Decision Making",
    code: "BTDM",
    cluster: "business-mgmt",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Team-based event on buying and merchandising decision making.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BTDM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BTDM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-BTDM-Guidelines.pdf",
  },
  {
    id: "pmcd",
    name: "Career Development Project",
    code: "PMCD",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Present a project showcasing career development initiatives.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMCD-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMCD-Guidelines.pdf",
  },
  {
    id: "pmca",
    name: "Community Awareness Project",
    code: "PMCA",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Present a project raising awareness about a community issue.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMCA-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMCA-Guidelines.pdf",
  },
  {
    id: "pmcg",
    name: "Community Giving Project",
    code: "PMCG",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Present a project focused on community giving and philanthropy.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMCG-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMCG-Guidelines.pdf",
  },
  {
    id: "ent",
    name: "Entrepreneurship Series",
    code: "ENT",
    cluster: "entrepreneurship",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Tests knowledge of entrepreneurship concepts and business startup principles.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ENT-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ENT-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ENT-Guidelines.pdf",
  },
  {
    id: "etdm",
    name: "Entrepreneurship Team Decision Making",
    code: "ETDM",
    cluster: "entrepreneurship",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Team-based entrepreneurship decision making scenarios.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ETDM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ETDM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ETDM-Guidelines.pdf",
  },
  {
    id: "for",
    name: "Finance Operations Research",
    code: "FOR",
    cluster: "finance",
    category: "Business Operations Research",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Research-based event analyzing financial operations.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FOR-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FOR-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FOR-Guidelines.pdf",
  },
  {
    id: "fce",
    name: "Financial Consulting",
    code: "FCE",
    cluster: "finance",
    category: "Professional Selling and Consulting",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Simulates financial consulting engagements with clients.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FCE-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FCE-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FCE-Guidelines.pdf",
  },
  {
    id: "pmfl",
    name: "Financial Literacy Project",
    code: "PMFL",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Present a project promoting financial literacy.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMFL-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMFL-Guidelines.pdf",
  },
  {
    id: "ftdm",
    name: "Financial Services Team Decision Making",
    code: "FTDM",
    cluster: "finance",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Team-based financial services decision making.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FTDM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FTDM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FTDM-Guidelines.pdf",
  },
  {
    id: "fms",
    name: "Food Marketing Series",
    code: "FMS",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Marketing principles applied to food products and services.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FMS-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FMS-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-FMS-Guidelines.pdf",
  },
  {
    id: "efb",
    name: "Franchise Business Plan",
    code: "EFB",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Develop a comprehensive franchise business plan.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-EFB-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-EFB-Guidelines.pdf",
  },
  {
    id: "htdm",
    name: "Hospitality Services Team Decision Making",
    code: "HTDM",
    cluster: "hospitality",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Team-based hospitality services decision making.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HTDM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HTDM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HTDM-Guidelines.pdf",
  },
  {
    id: "htor",
    name: "Hospitality and Tourism Operations Research",
    code: "HTOR",
    cluster: "hospitality",
    category: "Business Operations Research",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Research-based event analyzing hospitality and tourism operations.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HTOR-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HTOR-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HTOR-Guidelines.pdf",
  },
  {
    id: "htps",
    name: "Hospitality and Tourism Professional Selling",
    code: "HTPS",
    cluster: "hospitality",
    category: "Professional Selling and Consulting",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 20,
    hasExam: true,
    overview: "Professional selling in hospitality and tourism contexts.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HTPS-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HTPS-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HTPS-Guidelines.pdf",
  },
  {
    id: "hlm",
    name: "Hotel and Lodging Management Series",
    code: "HLM",
    cluster: "hospitality",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Management principles applied to hotel and lodging operations.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HLM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HLM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HLM-Guidelines.pdf",
  },
  {
    id: "hrm",
    name: "Human Resources Management Series",
    code: "HRM",
    cluster: "business-mgmt",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Covers HR management concepts including recruiting, training, and employee relations.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HRM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HRM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-HRM-Guidelines.pdf",
  },
  {
    id: "eib",
    name: "Independent Business Plan",
    code: "EIB",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Develop a business plan for a new independent business venture.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-EIB-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-EIB-Guidelines.pdf",
  },
  {
    id: "eip",
    name: "Innovation Plan",
    code: "EIP",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Develop an innovative product, service, or process for a business.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-EIP-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-EIP-Guidelines.pdf",
  },
  {
    id: "imce",
    name: "Integrated Marketing Campaign-Event",
    code: "IMCE",
    cluster: "marketing",
    category: "Integrated Marketing Campaign",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Develop an integrated marketing campaign for an event.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-IMCE-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-IMCE-Guidelines.pdf",
  },
  {
    id: "imcp",
    name: "Integrated Marketing Campaign-Product",
    code: "IMCP",
    cluster: "marketing",
    category: "Integrated Marketing Campaign",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Develop an integrated marketing campaign for a product.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-IMCP-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-IMCP-Guidelines.pdf",
  },
  {
    id: "imcs",
    name: "Integrated Marketing Campaign-Service",
    code: "IMCS",
    cluster: "marketing",
    category: "Integrated Marketing Campaign",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Develop an integrated marketing campaign for a service.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-IMCS-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-IMCS-Guidelines.pdf",
  },
  {
    id: "ibp",
    name: "International Business Plan",
    code: "IBP",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Develop a business plan for international expansion or operations.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-IBP-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-IBP-Guidelines.pdf",
  },
  {
    id: "mcs",
    name: "Marketing Communications Series",
    code: "MCS",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Tests marketing communications concepts including advertising, PR, and promotions.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-MCS-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-MCS-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-MCS-Guidelines.pdf",
  },
  {
    id: "mtdm",
    name: "Marketing Management Team Decision Making",
    code: "MTDM",
    cluster: "marketing",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Team-based marketing management decision making.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-MTDM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-MTDM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-MTDM-Guidelines.pdf",
  },
  {
    id: "pfl",
    name: "Personal Financial Literacy",
    code: "PFL",
    cluster: "personal-finance",
    category: "Personal Financial Literacy",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Tests personal finance knowledge including budgeting, investing, and credit.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PFL-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PFL-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PFL-Guidelines.pdf",
  },
  {
    id: "pbm",
    name: "Principles of Business Management and Administration",
    code: "PBM",
    cluster: "business-mgmt",
    category: "Principles of Business Administration",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Foundational business management and administration principles.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PBM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PBM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PBM-Guidelines.pdf",
  },
  {
    id: "pen",
    name: "Principles of Entrepreneurship",
    code: "PEN",
    cluster: "entrepreneurship",
    category: "Principles of Business Administration",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Foundational entrepreneurship principles and startup concepts.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PEN-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PEN-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PEN-Guidelines.pdf",
  },
  {
    id: "pfn",
    name: "Principles of Finance",
    code: "PFN",
    cluster: "finance",
    category: "Principles of Business Administration",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Foundational finance concepts including money management and banking.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PFN-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PFN-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PFN-Guidelines.pdf",
  },
  {
    id: "pht",
    name: "Principles of Hospitality and Tourism",
    code: "PHT",
    cluster: "hospitality",
    category: "Principles of Business Administration",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Foundational hospitality and tourism concepts.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PHT-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PHT-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PHT-Guidelines.pdf",
  },
  {
    id: "pmk",
    name: "Principles of Marketing",
    code: "PMK",
    cluster: "marketing",
    category: "Principles of Business Administration",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Foundational marketing concepts and principles.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMK-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMK-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMK-Guidelines.pdf",
  },
  {
    id: "pse",
    name: "Professional Selling",
    code: "PSE",
    cluster: "marketing",
    category: "Professional Selling and Consulting",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 20,
    hasExam: true,
    overview: "Professional selling techniques and customer relationship management.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PSE-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PSE-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PSE-Guidelines.pdf",
  },
  {
    id: "qsrm",
    name: "Quick Serve Restaurant Management Series",
    code: "QSRM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Management principles applied to quick serve restaurant operations.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-QSRM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-QSRM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-QSRM-Guidelines.pdf",
  },
  {
    id: "rfsm",
    name: "Restaurant and Food Service Management Series",
    code: "RFSM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Management of restaurant and food service operations.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-RFSM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-RFSM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-RFSM-Guidelines.pdf",
  },
  {
    id: "rms",
    name: "Retail Merchandising Series",
    code: "RMS",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Retail merchandising concepts and practices.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-RMS-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-RMS-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-RMS-Guidelines.pdf",
  },
  {
    id: "pmsp",
    name: "Sales Project",
    code: "PMSP",
    cluster: "business-mgmt",
    category: "Project Management",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Present a project demonstrating sales skills and strategies.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMSP-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-PMSP-Guidelines.pdf",
  },
  {
    id: "seor",
    name: "Sports and Entertainment Marketing Operations Research",
    code: "SEOR",
    cluster: "marketing",
    category: "Business Operations Research",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Research-based event analyzing sports and entertainment marketing.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-SEOR-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-SEOR-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-SEOR-Guidelines.pdf",
  },
  {
    id: "sem",
    name: "Sports and Entertainment Marketing Series",
    code: "SEM",
    cluster: "marketing",
    category: "Individual Series",
    participants: "1",
    prepTimeMins: 10,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Marketing concepts in the sports and entertainment industry.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-SEM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-SEM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-SEM-Guidelines.pdf",
  },
  {
    id: "stdm",
    name: "Sports and Entertainment Marketing Team Decision Making",
    code: "STDM",
    cluster: "marketing",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Team-based sports and entertainment marketing decisions.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-STDM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-STDM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-STDM-Guidelines.pdf",
  },
  {
    id: "esb",
    name: "Start-Up Business Plan",
    code: "ESB",
    cluster: "entrepreneurship",
    category: "Entrepreneurship",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 15,
    hasExam: false,
    overview: "Develop a comprehensive start-up business plan.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ESB-PIs.pdf",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-ESB-Guidelines.pdf",
  },
  {
    id: "smg",
    name: "Stock Market Game",
    code: "SMG",
    cluster: "finance",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview: "Simulated stock market investment competition.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-SMG-Guidelines.pdf",
  },
  {
    id: "ttdm",
    name: "Travel and Tourism Team Decision Making",
    code: "TTDM",
    cluster: "hospitality",
    category: "Team Decision Making",
    participants: "2",
    prepTimeMins: 30,
    interviewTimeMins: 15,
    hasExam: true,
    overview: "Team-based travel and tourism decision making.",
    officialPiPdfUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-TTDM-PIs.pdf",
    officialSampleExamUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-TTDM-Sample-Exam.pdf",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-TTDM-Guidelines.pdf",
  },
  {
    id: "vbcac",
    name: "Virtual Business Challenge-Accounting",
    code: "VBCAC",
    cluster: "finance",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview: "Online accounting simulation competition.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCAC-Guidelines.pdf",
  },
  {
    id: "vbcen",
    name: "Virtual Business Challenge-Entrepreneurship",
    code: "VBCEN",
    cluster: "entrepreneurship",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview: "Online entrepreneurship simulation competition.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCEN-Guidelines.pdf",
  },
  {
    id: "vbcfa",
    name: "Virtual Business Challenge-Fashion",
    code: "VBCFA",
    cluster: "marketing",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview: "Online fashion business simulation competition.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCFA-Guidelines.pdf",
  },
  {
    id: "vbchm",
    name: "Virtual Business Challenge-Hotel Management",
    code: "VBCHM",
    cluster: "hospitality",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview: "Online hotel management simulation competition.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCHM-Guidelines.pdf",
  },
  {
    id: "vbcpf",
    name: "Virtual Business Challenge-Personal Finance",
    code: "VBCPF",
    cluster: "personal-finance",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview: "Online personal finance simulation competition.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCPF-Guidelines.pdf",
  },
  {
    id: "vbcrs",
    name: "Virtual Business Challenge-Restaurant",
    code: "VBCRS",
    cluster: "hospitality",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview: "Online restaurant management simulation competition.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCRS-Guidelines.pdf",
  },
  {
    id: "vbcrt",
    name: "Virtual Business Challenge-Retail",
    code: "VBCRT",
    cluster: "marketing",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview: "Online retail business simulation competition.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCRT-Guidelines.pdf",
  },
  {
    id: "vbcsp",
    name: "Virtual Business Challenge-Sports",
    code: "VBCSP",
    cluster: "marketing",
    category: "Online Events",
    participants: "1-3",
    prepTimeMins: 0,
    interviewTimeMins: 0,
    hasExam: false,
    overview: "Online sports business simulation competition.",
    officialPiPdfUrl: "",
    officialSampleExamUrl: "",
    officialGuidelinesUrl: "https://www.deca.org/wp-content/uploads/2023/08/HS-VBCSP-Guidelines.pdf",
  },
];
```

- [ ] **Step 2: Create seed script**

Create `scripts/seed-events.ts`:

```ts
import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { DECA_EVENTS } from "../data/events";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

async function seedEvents() {
  console.log(`Seeding ${DECA_EVENTS.length} events...`);

  const batch = db.batch();
  for (const event of DECA_EVENTS) {
    const { id, ...data } = event;
    batch.set(db.collection("events").doc(id), data);
  }

  await batch.commit();
  console.log(`✓ Seeded ${DECA_EVENTS.length} events`);
}

seedEvents().catch(console.error);
```

- [ ] **Step 3: Add seed script to package.json**

Add to `package.json` scripts:

```json
"seed:events": "npx tsx scripts/seed-events.ts",
"seed:pis": "npx tsx scripts/seed-pis.ts"
```

- [ ] **Step 4: Install tsx and dotenv for scripts**

```bash
npm install -D tsx dotenv
```

- [ ] **Step 5: Run seed (after Firebase project is configured)**

```bash
npm run seed:events
```

Expected: `✓ Seeded 59 events`

- [ ] **Step 6: Commit**

```bash
git add data/events.ts scripts/seed-events.ts package.json
git commit -m "feat: add all 59 DECA events seed data and seeding script"
```

---

## Task 6: Seed Performance Indicators

**Files:**
- Create: `data/performance-indicators.ts`, `scripts/seed-pis.ts`

- [ ] **Step 1: Create PI data file for top 10 events**

Create `data/performance-indicators.ts`:

```ts
export interface PerformanceIndicator {
  id: string;
  eventId: string;
  cluster: string;
  code: string;
  text: string;
  category: string;
  difficulty: "high" | "medium" | "low";
}

// PIs for the top 10 most popular events
// Source: DECA Inc. official PI documents
// NOTE: These are placeholder PIs — replace with actual PIs from official DECA documents
// The structure and format is correct; content must be sourced from deca.org

export const PERFORMANCE_INDICATORS: PerformanceIndicator[] = [
  // BFS — Business Finance Series (Finance cluster)
  { id: "bfs-01", eventId: "bfs", cluster: "finance", code: "BFS-01", text: "Explain the nature of business finance", category: "Financial Analysis", difficulty: "high" },
  { id: "bfs-02", eventId: "bfs", cluster: "finance", code: "BFS-02", text: "Explain the role of finance in business", category: "Financial Analysis", difficulty: "high" },
  { id: "bfs-03", eventId: "bfs", cluster: "finance", code: "BFS-03", text: "Describe the nature of budgets", category: "Financial Analysis", difficulty: "medium" },
  { id: "bfs-04", eventId: "bfs", cluster: "finance", code: "BFS-04", text: "Explain the nature of financial statements", category: "Accounting", difficulty: "high" },
  { id: "bfs-05", eventId: "bfs", cluster: "finance", code: "BFS-05", text: "Describe the nature of income statements", category: "Accounting", difficulty: "high" },
  { id: "bfs-06", eventId: "bfs", cluster: "finance", code: "BFS-06", text: "Describe the nature of balance sheets", category: "Accounting", difficulty: "medium" },
  { id: "bfs-07", eventId: "bfs", cluster: "finance", code: "BFS-07", text: "Explain the nature of cash flow statements", category: "Accounting", difficulty: "medium" },
  { id: "bfs-08", eventId: "bfs", cluster: "finance", code: "BFS-08", text: "Describe sources of funding for business", category: "Banking", difficulty: "medium" },
  { id: "bfs-09", eventId: "bfs", cluster: "finance", code: "BFS-09", text: "Explain the time value of money", category: "Banking", difficulty: "low" },
  { id: "bfs-10", eventId: "bfs", cluster: "finance", code: "BFS-10", text: "Explain types of investments", category: "Securities", difficulty: "low" },

  // ENT — Entrepreneurship Series
  { id: "ent-01", eventId: "ent", cluster: "entrepreneurship", code: "ENT-01", text: "Describe the nature of entrepreneurship", category: "Entrepreneurial Concepts", difficulty: "high" },
  { id: "ent-02", eventId: "ent", cluster: "entrepreneurship", code: "ENT-02", text: "Explain the concept of risk management", category: "Risk Management", difficulty: "high" },
  { id: "ent-03", eventId: "ent", cluster: "entrepreneurship", code: "ENT-03", text: "Describe factors that affect business risk", category: "Risk Management", difficulty: "medium" },
  { id: "ent-04", eventId: "ent", cluster: "entrepreneurship", code: "ENT-04", text: "Explain the nature of business plans", category: "Business Planning", difficulty: "high" },
  { id: "ent-05", eventId: "ent", cluster: "entrepreneurship", code: "ENT-05", text: "Describe the components of a business plan", category: "Business Planning", difficulty: "medium" },
  { id: "ent-06", eventId: "ent", cluster: "entrepreneurship", code: "ENT-06", text: "Explain methods used to generate product/service ideas", category: "Product Development", difficulty: "medium" },
  { id: "ent-07", eventId: "ent", cluster: "entrepreneurship", code: "ENT-07", text: "Explain the concept of market identification", category: "Market Analysis", difficulty: "low" },
  { id: "ent-08", eventId: "ent", cluster: "entrepreneurship", code: "ENT-08", text: "Describe marketing functions and channels", category: "Marketing", difficulty: "medium" },
  { id: "ent-09", eventId: "ent", cluster: "entrepreneurship", code: "ENT-09", text: "Explain the concept of financial planning", category: "Finance", difficulty: "low" },
  { id: "ent-10", eventId: "ent", cluster: "entrepreneurship", code: "ENT-10", text: "Describe startup costs and funding options", category: "Finance", difficulty: "low" },

  // SEM — Sports and Entertainment Marketing Series
  { id: "sem-01", eventId: "sem", cluster: "marketing", code: "SEM-01", text: "Explain the nature of sports/entertainment marketing", category: "Industry Foundations", difficulty: "high" },
  { id: "sem-02", eventId: "sem", cluster: "marketing", code: "SEM-02", text: "Describe the concept of marketing mix in SEM", category: "Marketing Strategy", difficulty: "high" },
  { id: "sem-03", eventId: "sem", cluster: "marketing", code: "SEM-03", text: "Explain pricing strategies for events and venues", category: "Pricing", difficulty: "medium" },
  { id: "sem-04", eventId: "sem", cluster: "marketing", code: "SEM-04", text: "Describe sponsorship in sports/entertainment", category: "Sponsorship", difficulty: "high" },
  { id: "sem-05", eventId: "sem", cluster: "marketing", code: "SEM-05", text: "Explain the nature of endorsements", category: "Sponsorship", difficulty: "medium" },
  { id: "sem-06", eventId: "sem", cluster: "marketing", code: "SEM-06", text: "Describe event marketing strategies", category: "Event Management", difficulty: "medium" },
  { id: "sem-07", eventId: "sem", cluster: "marketing", code: "SEM-07", text: "Explain ticket distribution and sales methods", category: "Revenue", difficulty: "low" },
  { id: "sem-08", eventId: "sem", cluster: "marketing", code: "SEM-08", text: "Describe promotional strategies for events", category: "Promotion", difficulty: "medium" },
  { id: "sem-09", eventId: "sem", cluster: "marketing", code: "SEM-09", text: "Explain the role of media in SEM", category: "Media", difficulty: "low" },
  { id: "sem-10", eventId: "sem", cluster: "marketing", code: "SEM-10", text: "Describe licensing in sports/entertainment", category: "Licensing", difficulty: "low" },

  // HLM — Hotel and Lodging Management Series
  { id: "hlm-01", eventId: "hlm", cluster: "hospitality", code: "HLM-01", text: "Explain the nature of the lodging industry", category: "Industry Foundations", difficulty: "high" },
  { id: "hlm-02", eventId: "hlm", cluster: "hospitality", code: "HLM-02", text: "Describe front office operations", category: "Operations", difficulty: "high" },
  { id: "hlm-03", eventId: "hlm", cluster: "hospitality", code: "HLM-03", text: "Explain housekeeping management procedures", category: "Operations", difficulty: "medium" },
  { id: "hlm-04", eventId: "hlm", cluster: "hospitality", code: "HLM-04", text: "Describe revenue management in lodging", category: "Revenue", difficulty: "high" },
  { id: "hlm-05", eventId: "hlm", cluster: "hospitality", code: "HLM-05", text: "Explain food and beverage management", category: "F&B", difficulty: "medium" },
  { id: "hlm-06", eventId: "hlm", cluster: "hospitality", code: "HLM-06", text: "Describe safety and security procedures", category: "Safety", difficulty: "medium" },
  { id: "hlm-07", eventId: "hlm", cluster: "hospitality", code: "HLM-07", text: "Explain guest service management", category: "Guest Services", difficulty: "low" },
  { id: "hlm-08", eventId: "hlm", cluster: "hospitality", code: "HLM-08", text: "Describe human resources in lodging", category: "HR", difficulty: "low" },

  // ACT — Accounting Applications Series
  { id: "act-01", eventId: "act", cluster: "finance", code: "ACT-01", text: "Explain the nature of accounting", category: "Accounting Foundations", difficulty: "high" },
  { id: "act-02", eventId: "act", cluster: "finance", code: "ACT-02", text: "Describe the accounting cycle", category: "Accounting Cycle", difficulty: "high" },
  { id: "act-03", eventId: "act", cluster: "finance", code: "ACT-03", text: "Explain journal entries and ledgers", category: "Accounting Cycle", difficulty: "high" },
  { id: "act-04", eventId: "act", cluster: "finance", code: "ACT-04", text: "Describe trial balance procedures", category: "Accounting Cycle", difficulty: "medium" },
  { id: "act-05", eventId: "act", cluster: "finance", code: "ACT-05", text: "Explain adjusting entries", category: "Accounting Cycle", difficulty: "medium" },
  { id: "act-06", eventId: "act", cluster: "finance", code: "ACT-06", text: "Describe payroll accounting procedures", category: "Payroll", difficulty: "medium" },
  { id: "act-07", eventId: "act", cluster: "finance", code: "ACT-07", text: "Explain inventory accounting methods", category: "Inventory", difficulty: "low" },
  { id: "act-08", eventId: "act", cluster: "finance", code: "ACT-08", text: "Describe depreciation methods", category: "Assets", difficulty: "low" },

  // MCS — Marketing Communications Series
  { id: "mcs-01", eventId: "mcs", cluster: "marketing", code: "MCS-01", text: "Explain the nature of marketing communications", category: "Foundations", difficulty: "high" },
  { id: "mcs-02", eventId: "mcs", cluster: "marketing", code: "MCS-02", text: "Describe the promotional mix", category: "Promotion", difficulty: "high" },
  { id: "mcs-03", eventId: "mcs", cluster: "marketing", code: "MCS-03", text: "Explain advertising strategies and media", category: "Advertising", difficulty: "high" },
  { id: "mcs-04", eventId: "mcs", cluster: "marketing", code: "MCS-04", text: "Describe public relations activities", category: "Public Relations", difficulty: "medium" },
  { id: "mcs-05", eventId: "mcs", cluster: "marketing", code: "MCS-05", text: "Explain digital marketing strategies", category: "Digital", difficulty: "medium" },
  { id: "mcs-06", eventId: "mcs", cluster: "marketing", code: "MCS-06", text: "Describe social media marketing", category: "Digital", difficulty: "medium" },
  { id: "mcs-07", eventId: "mcs", cluster: "marketing", code: "MCS-07", text: "Explain visual merchandising techniques", category: "Visual", difficulty: "low" },
  { id: "mcs-08", eventId: "mcs", cluster: "marketing", code: "MCS-08", text: "Describe branding strategies", category: "Branding", difficulty: "low" },

  // HRM — Human Resources Management Series
  { id: "hrm-01", eventId: "hrm", cluster: "business-mgmt", code: "HRM-01", text: "Explain the nature of human resources management", category: "HR Foundations", difficulty: "high" },
  { id: "hrm-02", eventId: "hrm", cluster: "business-mgmt", code: "HRM-02", text: "Describe recruiting and hiring processes", category: "Talent Acquisition", difficulty: "high" },
  { id: "hrm-03", eventId: "hrm", cluster: "business-mgmt", code: "HRM-03", text: "Explain employee training and development", category: "Development", difficulty: "high" },
  { id: "hrm-04", eventId: "hrm", cluster: "business-mgmt", code: "HRM-04", text: "Describe performance management systems", category: "Performance", difficulty: "medium" },
  { id: "hrm-05", eventId: "hrm", cluster: "business-mgmt", code: "HRM-05", text: "Explain compensation and benefits", category: "Compensation", difficulty: "medium" },
  { id: "hrm-06", eventId: "hrm", cluster: "business-mgmt", code: "HRM-06", text: "Describe labor relations and employment law", category: "Legal", difficulty: "medium" },
  { id: "hrm-07", eventId: "hrm", cluster: "business-mgmt", code: "HRM-07", text: "Explain workplace safety regulations", category: "Safety", difficulty: "low" },
  { id: "hrm-08", eventId: "hrm", cluster: "business-mgmt", code: "HRM-08", text: "Describe employee engagement strategies", category: "Engagement", difficulty: "low" },

  // RMS — Retail Merchandising Series
  { id: "rms-01", eventId: "rms", cluster: "marketing", code: "RMS-01", text: "Explain the nature of retailing", category: "Retail Foundations", difficulty: "high" },
  { id: "rms-02", eventId: "rms", cluster: "marketing", code: "RMS-02", text: "Describe buying and merchandising principles", category: "Buying", difficulty: "high" },
  { id: "rms-03", eventId: "rms", cluster: "marketing", code: "RMS-03", text: "Explain inventory management in retail", category: "Inventory", difficulty: "high" },
  { id: "rms-04", eventId: "rms", cluster: "marketing", code: "RMS-04", text: "Describe visual merchandising and store layout", category: "Visual", difficulty: "medium" },
  { id: "rms-05", eventId: "rms", cluster: "marketing", code: "RMS-05", text: "Explain customer service in retail settings", category: "Customer Service", difficulty: "medium" },
  { id: "rms-06", eventId: "rms", cluster: "marketing", code: "RMS-06", text: "Describe retail pricing strategies", category: "Pricing", difficulty: "medium" },
  { id: "rms-07", eventId: "rms", cluster: "marketing", code: "RMS-07", text: "Explain retail promotions and advertising", category: "Promotion", difficulty: "low" },
  { id: "rms-08", eventId: "rms", cluster: "marketing", code: "RMS-08", text: "Describe e-commerce and omnichannel retailing", category: "E-Commerce", difficulty: "low" },

  // PFL — Personal Financial Literacy
  { id: "pfl-01", eventId: "pfl", cluster: "personal-finance", code: "PFL-01", text: "Explain personal financial planning", category: "Planning", difficulty: "high" },
  { id: "pfl-02", eventId: "pfl", cluster: "personal-finance", code: "PFL-02", text: "Describe budgeting and money management", category: "Budgeting", difficulty: "high" },
  { id: "pfl-03", eventId: "pfl", cluster: "personal-finance", code: "PFL-03", text: "Explain the nature of credit and debt", category: "Credit", difficulty: "high" },
  { id: "pfl-04", eventId: "pfl", cluster: "personal-finance", code: "PFL-04", text: "Describe savings and investment options", category: "Investing", difficulty: "medium" },
  { id: "pfl-05", eventId: "pfl", cluster: "personal-finance", code: "PFL-05", text: "Explain insurance and risk management", category: "Insurance", difficulty: "medium" },
  { id: "pfl-06", eventId: "pfl", cluster: "personal-finance", code: "PFL-06", text: "Describe tax planning and filing", category: "Taxes", difficulty: "medium" },
  { id: "pfl-07", eventId: "pfl", cluster: "personal-finance", code: "PFL-07", text: "Explain consumer rights and responsibilities", category: "Consumer", difficulty: "low" },
  { id: "pfl-08", eventId: "pfl", cluster: "personal-finance", code: "PFL-08", text: "Describe housing and major purchase decisions", category: "Major Purchases", difficulty: "low" },
];
```

- [ ] **Step 2: Create PI seed script**

Create `scripts/seed-pis.ts`:

```ts
import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { PERFORMANCE_INDICATORS } from "../data/performance-indicators";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

async function seedPIs() {
  const grouped = PERFORMANCE_INDICATORS.reduce(
    (acc, pi) => {
      if (!acc[pi.eventId]) acc[pi.eventId] = [];
      acc[pi.eventId].push(pi);
      return acc;
    },
    {} as Record<string, typeof PERFORMANCE_INDICATORS>
  );

  for (const [eventId, pis] of Object.entries(grouped)) {
    console.log(`Seeding ${pis.length} PIs for ${eventId}...`);
    const batch = db.batch();
    for (const pi of pis) {
      const { id, ...data } = pi;
      batch.set(
        db.collection("events").doc(eventId).collection("performanceIndicators").doc(id),
        data
      );
    }
    await batch.commit();
  }

  console.log(`✓ Seeded ${PERFORMANCE_INDICATORS.length} PIs across ${Object.keys(grouped).length} events`);
}

seedPIs().catch(console.error);
```

- [ ] **Step 3: Run PI seed**

```bash
npm run seed:pis
```

Expected: `✓ Seeded [count] PIs across 10 events`

- [ ] **Step 4: Commit**

```bash
git add data/performance-indicators.ts scripts/seed-pis.ts
git commit -m "feat: add PI seed data for top 10 events and seeding script"
```

---

## Task 7: App Shell (Layout, TopNav, Sidebar, Footer)

**Files:**
- Create: `app/(app)/layout.tsx`, `components/layout/TopNav.tsx`, `components/layout/Sidebar.tsx`, `components/layout/Footer.tsx`, `components/legal/ExamDisclaimer.tsx`, `components/legal/RolePlayDisclaimer.tsx`, `components/legal/PIAttribution.tsx`, `components/legal/VocabAttribution.tsx`

- [ ] **Step 1: Create TopNav component**

Create `components/layout/TopNav.tsx`:

```tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export function TopNav() {
  const { user } = useAuth();
  const initial = user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "?";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 frosted-glass flex items-center justify-between px-6 h-16">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-2xl">
          trophy
        </span>
        <span className="font-headline text-2xl font-bold tracking-tighter text-primary">
          Podium
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline hidden md:block">
          BFS — Business Finance Series
        </span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-headline font-bold text-sm">
          {initial}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/15 to-transparent" />
    </header>
  );
}
```

- [ ] **Step 2: Create Sidebar component**

Create `components/layout/Sidebar.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

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

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-[220px] bg-surface-container-low py-6 flex flex-col gap-0.5 z-40">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-200 border-l-[3px] ${
              isActive
                ? "text-primary bg-primary/[0.04] border-l-primary"
                : "text-outline hover:text-on-surface-variant hover:bg-surface-container border-l-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}

      <div className="h-px my-4 mx-6 bg-outline-variant/15" />

      {SECONDARY_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-200 border-l-[3px] ${
              isActive
                ? "text-primary bg-primary/[0.04] border-l-primary"
                : "text-outline hover:text-on-surface-variant hover:bg-surface-container border-l-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
```

- [ ] **Step 3: Create Footer component**

Create `components/layout/Footer.tsx`:

```tsx
export function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`bg-surface-container-lowest py-6 px-8 text-center ghost-border ${className}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-label uppercase tracking-widest text-outline/60">
          <a
            href="https://www.deca.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Official DECA Resources
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
        </div>
        <p className="text-[10px] font-label uppercase tracking-widest leading-relaxed text-outline/40 max-w-2xl mx-auto">
          Podium is an independent student-built prep platform. Not affiliated
          with or endorsed by DECA Inc. DECA® is a registered trademark of DECA
          Inc.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create legal disclaimer components**

Create `components/legal/PIAttribution.tsx`:

```tsx
export function PIAttribution({ pdfUrl }: { pdfUrl?: string }) {
  return (
    <p className="text-xs text-outline/60 font-label mt-6">
      Performance Indicators sourced from DECA Inc.&apos;s official guidelines.{" "}
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          View official PDF →
        </a>
      )}
    </p>
  );
}
```

Create `components/legal/ExamDisclaimer.tsx`:

```tsx
export function ExamDisclaimer() {
  return (
    <p className="text-xs text-outline/60 font-label">
      Podium Practice Exam — ICDC Difficulty. Original content, not affiliated
      with DECA Inc.
    </p>
  );
}
```

Create `components/legal/RolePlayDisclaimer.tsx`:

```tsx
export function RolePlayDisclaimer({ eventName }: { eventName: string }) {
  return (
    <p className="text-xs text-outline/60 font-label">
      Podium practice scenario — modeled after DECA {eventName} format. Not
      affiliated with DECA Inc.
    </p>
  );
}
```

Create `components/legal/VocabAttribution.tsx`:

```tsx
export function VocabAttribution() {
  return (
    <p className="text-xs text-outline/60 font-label">
      Vocabulary aligned with DECA Inc. curriculum standards.
    </p>
  );
}
```

- [ ] **Step 5: Create app layout**

Create `app/(app)/layout.tsx`:

```tsx
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <TopNav />
      <Sidebar />
      <main className="ml-[220px] mt-16 flex-grow p-8">{children}</main>
      <Footer className="ml-[220px]" />
    </div>
  );
}
```

- [ ] **Step 6: Create placeholder dashboard page**

Create `app/(app)/home/page.tsx`:

```tsx
export default function DashboardPage() {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-8">
        <span className="text-[10px] font-bold tracking-[0.2em] text-primary font-headline uppercase">
          Welcome back
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline text-on-surface">
          Let&apos;s get you to the podium.
        </h1>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Verify app shell renders**

```bash
npm run dev
```

Visit `http://localhost:3000/home`. You should see: frosted glass nav with logo + avatar, 220px sidebar with nav items (Dashboard active/blue), main content area with welcome heading, legal footer at bottom.

- [ ] **Step 8: Commit**

```bash
git add app/\(app\) components/layout components/legal
git commit -m "feat: add app shell with frosted glass nav, sidebar, footer, and legal disclaimers"
```

---

## Tasks 8-16: Remaining Feature Implementation

The remaining tasks follow the same structure. Due to the size of this plan, I'm providing the task outlines with key implementation details. Each task follows the same pattern: create files → implement → verify → commit.

### Task 8: Dashboard (`/home`)

**Files:** `app/(app)/home/page.tsx`, `components/dashboard/CountdownTimer.tsx`, `components/dashboard/MasteryRing.tsx`, `components/dashboard/StreakTracker.tsx`, `components/dashboard/WeeklyGoal.tsx`, `components/dashboard/QuickActions.tsx`, `components/dashboard/RecentActivity.tsx`, `lib/hooks/useFirestore.ts`, `lib/hooks/useCountdown.ts`

- [ ] **Step 1: Create `useFirestore` hook** — generic real-time listener hook using `onSnapshot`
- [ ] **Step 2: Create `useCountdown` hook** — accepts target date, returns `{ days, hours, minutes, seconds }`
- [ ] **Step 3: Create `CountdownTimer` component** — 96px gradient number, editorial label above, date below
- [ ] **Step 4: Create `MasteryRing` component** — SVG circular chart, mastered (tertiary) + learning (secondary) arcs on surface-container-highest track
- [ ] **Step 5: Create `StreakTracker` component** — 48px gold number, "days · longest: N" detail
- [ ] **Step 6: Create `WeeklyGoal` component** — session count, progress bar with gradient fill
- [ ] **Step 7: Create `QuickActions` component** — 3 cards with icon, title, description, hover tonal shift + left accent
- [ ] **Step 8: Create `RecentActivity` component** — list with colored dots per type, score + date
- [ ] **Step 9: Wire dashboard page** — real-time listeners on user doc, piProgress, recentActivity, assemble components
- [ ] **Step 10: Verify** — `npm run dev`, visit `/home`
- [ ] **Step 11: Commit**

### Task 9: PI Tracker (`/pi-tracker`)

**Files:** `app/(app)/pi-tracker/page.tsx`, `components/pi/PICard.tsx`, `components/pi/PIList.tsx`, `components/pi/MasteryBadge.tsx`, `components/pi/MasterySummaryBar.tsx`, `components/pi/PIExportButton.tsx`, `lib/actions/progress.ts`

- [ ] **Step 1: Create `MasteryBadge` component** — dot + label, color-coded (tertiary/secondary/error)
- [ ] **Step 2: Create `MasterySummaryBar` component** — total PIs, mastered/learning/untested counts, overall %
- [ ] **Step 3: Create `PICard` component** — PI text, category badge, difficulty badge, mastery badge, times tested/correct, last tested, "Practice this PI" button
- [ ] **Step 4: Create `PIList` component** — filter by mastery status, category, keyword search, renders PICards
- [ ] **Step 5: Create `PIExportButton` component** — uses jsPDF to generate PDF of current PI statuses
- [ ] **Step 6: Create shared mastery logic** in `lib/actions/progress.ts` — `updatePIProgress(uid, piId, isCorrect)` function that handles untested→learning→mastered transitions
- [ ] **Step 7: Wire PI tracker page** — real-time listener on piProgress, fetch event PIs, join data, render summary + list
- [ ] **Step 8: Verify** — visit `/pi-tracker`
- [ ] **Step 9: Commit**

### Task 10: Events Hub + Event Detail

**Files:** `app/(app)/events/page.tsx`, `app/(app)/events/[slug]/page.tsx`, `components/events/EventCard.tsx`, `components/events/EventFilter.tsx`

- [ ] **Step 1: Create `EventCard` component** — name, code badge, cluster color, category badge, participant count, "Your Event" highlight
- [ ] **Step 2: Create `EventFilter` component** — filter by cluster and category
- [ ] **Step 3: Create events hub page** — fetch all events, user's event pinned top, filterable grid
- [ ] **Step 4: Create event detail page** — header, PI list with mastery status, strategy tips, official resource links, quick action buttons
- [ ] **Step 5: Add PIAttribution to event detail page**
- [ ] **Step 6: Verify** — visit `/events` and `/events/bfs`
- [ ] **Step 7: Commit**

### Task 11: Exam Practice + AI Explainer

**Files:** `app/(app)/exams/page.tsx`, `components/exams/ExamRunner.tsx`, `components/exams/QuestionCard.tsx`, `components/exams/ResultsBreakdown.tsx`, `components/exams/ExplainButton.tsx`, `lib/actions/exams.ts`, `lib/ai/anthropic.ts`, `lib/ai/prompts.ts`, `app/api/ai/explain/route.ts`

- [ ] **Step 1: Create Anthropic client** in `lib/ai/anthropic.ts`
- [ ] **Step 2: Create prompt templates** in `lib/ai/prompts.ts` — explainer, scorer, chat, question gen, scenario gen
- [ ] **Step 3: Create `QuestionCard` component** — question text, A/B/C/D options as clickable cards
- [ ] **Step 4: Create `ExamRunner` component** — 90-min timer, question navigation (prev/next/flag), submit button, state management for 100 answers
- [ ] **Step 5: Create `ExplainButton` component** — calls `/api/ai/explain`, shows loading, renders explanation inline
- [ ] **Step 6: Create `ResultsBreakdown` component** — score, PI breakdown by category, wrong answers with ExplainButton
- [ ] **Step 7: Create exam Server Action** in `lib/actions/exams.ts` — scores answers, writes examAttempts, batch-updates piProgress, writes recentActivity
- [ ] **Step 8: Create explain Route Handler** — `POST /api/ai/explain`, verifies session, calls Claude, returns text
- [ ] **Step 9: Wire exams page** — event selector, exam start → ExamRunner → ResultsBreakdown
- [ ] **Step 10: Add ExamDisclaimer**
- [ ] **Step 11: Verify** — visit `/exams`
- [ ] **Step 12: Commit**

### Task 12: Role Play Coach + AI Scorer

**Files:** `app/(app)/roleplay/page.tsx`, `components/roleplay/ScenarioDisplay.tsx`, `components/roleplay/ResponseEditor.tsx`, `components/roleplay/Scorecard.tsx`, `lib/actions/roleplay.ts`, `app/api/ai/roleplay-score/route.ts`

- [ ] **Step 1: Create `ScenarioDisplay` component** — scenario card with business context, role, task
- [ ] **Step 2: Create `ResponseEditor` component** — large text area, 30-min countdown timer
- [ ] **Step 3: Create `Scorecard` component** — per-PI rows (1-5 stars + feedback, color coded), overall score, strengths/improvements sections
- [ ] **Step 4: Create roleplay-score Route Handler** — streaming POST, calls Claude with scorer prompt, returns streamed JSON
- [ ] **Step 5: Create roleplay Server Action** — saves attempt, updates PI progress, writes recentActivity
- [ ] **Step 6: Wire roleplay page** — fetch random scenario → ScenarioDisplay + ResponseEditor → submit → stream → Scorecard
- [ ] **Step 7: Add RolePlayDisclaimer**
- [ ] **Step 8: Verify** — visit `/roleplay`
- [ ] **Step 9: Commit**

### Task 13: Vocab Flashcards

**Files:** `app/(app)/vocab/page.tsx`, `components/vocab/Flashcard.tsx`, `components/vocab/MultipleChoice.tsx`, `components/vocab/TypeAnswer.tsx`, `components/vocab/VocabProgress.tsx`, `lib/actions/vocab.ts`

- [ ] **Step 1: Create `Flashcard` component** — flip animation via CSS transform, term → definition + example
- [ ] **Step 2: Create `MultipleChoice` component** — term shown, 4 definitions (1 correct + 3 random from cluster)
- [ ] **Step 3: Create `TypeAnswer` component** — term shown, text input, fuzzy matching on submit
- [ ] **Step 4: Create `VocabProgress` component** — per-cluster progress bar with gradient fill
- [ ] **Step 5: Create vocab Server Action** — updates vocabProgress per word
- [ ] **Step 6: Wire vocab page** — cluster/event filter, mode selector (tabs), spaced repetition ordering (weighted random by mastery + lastSeen)
- [ ] **Step 7: Add VocabAttribution**
- [ ] **Step 8: Verify** — visit `/vocab`
- [ ] **Step 9: Commit**

### Task 14: Profile + Settings

**Files:** `app/(app)/profile/page.tsx`, `lib/actions/profile.ts`

- [ ] **Step 1: Create profile Server Actions** — update profile fields, change password, delete account
- [ ] **Step 2: Create profile page** — edit name/school/cluster/event/competition date, streak history, all-time stats, danger zone (delete with confirmation dialog)
- [ ] **Step 3: Verify** — visit `/profile`
- [ ] **Step 4: Commit**

### Task 15: AI Chat Widget + Admin Seeding Routes

**Files:** `components/ai/PIStudyChat.tsx`, `app/api/ai/chat/route.ts`, `app/api/admin/generate-questions/route.ts`, `app/api/admin/generate-scenarios/route.ts`

- [ ] **Step 1: Create chat Route Handler** — streaming POST, conversational, system prompt with event/cluster/PI context
- [ ] **Step 2: Create `PIStudyChat` component** — floating widget (bottom-right), expandable, message list, input, streaming display
- [ ] **Step 3: Add PIStudyChat to PI Tracker and Event Detail pages**
- [ ] **Step 4: Create generate-questions Route Handler** — protected by X-Admin-Key, generates 100 questions per event, writes to practiceExams
- [ ] **Step 5: Create generate-scenarios Route Handler** — protected by X-Admin-Key, generates 10 scenarios per event, writes to roleplayScenarios
- [ ] **Step 6: Verify chat** — open widget on `/pi-tracker`, ask about a PI
- [ ] **Step 7: Verify admin routes** — `curl -X POST http://localhost:3000/api/admin/generate-questions -H "X-Admin-Key: $ADMIN_SECRET_KEY" -d '{"eventId":"bfs"}'`
- [ ] **Step 8: Commit**

### Task 16: Landing Page

**Files:** `app/page.tsx`

- [ ] **Step 1: Create landing page** — full-width, no sidebar. Sections: frosted glass nav (Logo + Features/Events/About + CTA), hero (headline + subheadline + 2 CTAs), stats bar, 3 feature highlight cards, how it works (3 steps), cluster grid (6 clusters), social proof (3 placeholder testimonials), final CTA banner, Footer
- [ ] **Step 2: Apply Executive Brutalism design** — editorial typography, tonal layering, gradient CTAs, no borders, asymmetric layouts
- [ ] **Step 3: Verify** — visit `/`
- [ ] **Step 4: Commit**

### Task 17: Deploy to Vercel

- [ ] **Step 1: Add `.superpowers/` to `.gitignore`**
- [ ] **Step 2: Push to GitHub**

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

- [ ] **Step 3: Connect to Vercel** — import from GitHub, set environment variables in Vercel dashboard
- [ ] **Step 4: Deploy Firestore security rules**

```bash
firebase deploy --only firestore:rules
```

- [ ] **Step 5: Run seed scripts against production Firestore**
- [ ] **Step 6: Run admin seeding routes to generate questions and scenarios for all 59 events**
- [ ] **Step 7: Verify production deployment**
