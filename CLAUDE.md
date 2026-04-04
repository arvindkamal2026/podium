# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Podium is a full-stack DECA competition prep web app — AI-powered role play coaching, PI mastery tracking, vocab flashcards, and practice exams for all 60 DECA events. Dark-mode only, free, public-facing. Source code lives in the `podium/` subdirectory.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + Shadcn/ui
- **Database:** Firebase Firestore (NoSQL)
- **Auth:** Firebase Auth (email/password + Google OAuth)
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`) via `@anthropic-ai/sdk`
- **Fonts:** Plus Jakarta Sans (headlines) + Inter (body)
- **Icons:** Material Symbols Outlined
- **Deployment:** Vercel

## Architecture: Hybrid Data Access

- **Client-side reads** — Firebase Client SDK for real-time Firestore listeners (`onSnapshot`) via `useDocument<T>` hook (dashboard, progress, activity feeds)
- **Server-side writes** — Next.js Server Actions with Firebase Admin SDK for all mutations (exam scoring, role play submission, progress updates, onboarding)
- **Route Handlers** — AI endpoints (`/api/ai/*`) return non-streaming JSON responses; admin seeding routes (`/api/admin/*`) generate content via Claude. Both use standard `NextResponse.json()`.
- **Firestore security rules** — defined in `firestore.rules`; client is read-only for authenticated users; all writes denied client-side; writes go through trusted server code only.

### Firebase SDK Pattern (CRITICAL)

Both SDKs use **lazy initialization via getter functions** to avoid build failures during SSR/pre-rendering:
- `lib/firebase/admin.ts` → `getAdminDb()`, `getAdminAuth()` (not top-level constants)
- `lib/firebase/client.ts` → `getClientAuth()`, `getClientDb()` (not top-level constants)
- `lib/ai/anthropic.ts` → `getAnthropicClient()` (same pattern)

**Never** replace these with eagerly-initialized exports — Next.js will execute them at build time when env vars aren't available.

## Key Directories

All paths are relative to `podium/`:

```
app/(app)/            # Authenticated pages (sidebar layout): home, pi-tracker, exams, roleplay, vocab, profile, events/[slug]
app/(auth)/           # Login/signup (centered, no sidebar)
app/onboarding/       # 4-step onboarding flow
app/api/ai/           # AI endpoints (explain, roleplay-score, chat) — non-streaming JSON
app/api/ai/chat/      # PI study chat with conversation history
app/api/ai/explain/   # Exam answer explanations
app/api/ai/roleplay-score/  # Role play scoring with per-PI feedback
app/api/admin/        # Admin seeding routes (generate-questions, generate-scenarios)
app/api/auth/session/ # Session cookie management (POST to set, used by auth flow)
lib/firebase/         # Client SDK (client.ts), Admin SDK (admin.ts), auth helpers (auth.ts)
lib/ai/               # anthropic.ts (client singleton), prompts.ts (5 prompt templates)
lib/actions/          # Server Actions: onboarding, exams, roleplay, vocab, progress, profile
lib/hooks/            # useAuth, useDocument<T> (real-time Firestore), useCountdown
components/ui/        # Shadcn/ui primitives (button, card, dialog, tabs, etc.)
components/layout/    # TopNav, Sidebar, Footer
components/legal/     # ExamDisclaimer, RolePlayDisclaimer, PIAttribution, VocabAttribution
components/dashboard/ # CountdownTimer, MasteryRing, StreakTracker, WeeklyGoal, QuickActions, RecentActivity
components/pi/        # MasteryBadge, MasterySummaryBar, PICard, PIList, PIExportButton
components/events/    # EventCard, EventFilter
components/exams/     # QuestionCard, ExplainButton, ExamRunner, ResultsBreakdown
components/roleplay/  # ScenarioDisplay, ResponseEditor, Scorecard
components/vocab/     # Flashcard (3D flip), MultipleChoice, TypeAnswer, VocabProgress
components/ai/        # PIStudyChat (floating chat widget)
data/                 # events.ts (60 events), performance-indicators.ts (PIs for 10 events), vocab-words.ts (22 words)
scripts/              # seed-events.ts, seed-pis.ts (Firebase Admin batch writers)
```

## Design System: "Executive Brutalism"

Full spec in `Design/DESIGN.md` (repo root). Reference HTML mockup in `Design/code.html`, screenshot in `Design/screen.png`.

Critical rules that must be followed in all UI code:
1. **No `1px solid` borders** — separation via tonal surface layering only
2. **Ghost border fallback** — `outline-variant` (#424754) at 15% opacity when accessibility requires it
3. **Gradient CTAs** — `linear-gradient(135deg, #ADC6FF, #4D8EFF)` with `#002E6A` text
4. **Frosted glass** — nav/floating elements use `backdrop-blur(16px)`, surface at 80% opacity
5. **Hover = tonal shift** — up one surface tier + 3px left accent bar in primary
6. **Never use pure white** — body text is `#E5E2E1` (`on-surface`)
7. **No divider lines** — use 1.5rem gaps or surface color shifts

### Surface Hierarchy (darkest → lightest)
`#0E0E0E` → `#131313` → `#1C1B1B` → `#201F1F` → `#2A2A2A` → `#353534`

### Mastery Status Colors
- Mastered: `#4EDEA5` (tertiary/green)
- Learning: `#FFB95F` (secondary/gold)
- Untested: `#FFB4AB` (error/red)

## Mastery Logic

A PI or vocab word follows this state machine:
- **Untested** → default
- **Learning** → after being tested once
- **Mastered** → after 3+ correct answers
- **Mastered → Learning** → if answered incorrectly after reaching mastery

## Route Protection

| Route Pattern | Access |
|---------------|--------|
| `/` | Public (landing page) |
| `/login`, `/signup` | Public (redirect to `/home` if authed) |
| `/home`, `/pi-tracker`, `/exams`, `/roleplay`, `/vocab`, `/profile`, `/events/**` | Authenticated |
| `/api/admin/*` | `X-Admin-Key` header matching `ADMIN_SECRET_KEY` env var |
| `/api/ai/*` | Authenticated (verify Firebase ID token server-side) |

`proxy.ts` (Next.js 16's replacement for `middleware.ts`) checks the `session` cookie and redirects: unauthenticated → `/login`; authenticated on `/login` or `/signup` → `/home`. API routes are passed through without auth checks (AI endpoints verify tokens internally). Onboarding requires a session cookie but no further server-side user doc check at the proxy level.

## Legal & Attribution (MANDATORY)

These must appear on every relevant page — enforced via reusable components in `components/legal/`:
1. Never host DECA PDFs — link to deca.org only
2. Every practice exam: *"Podium Practice Exam — ICDC Difficulty. Original content, not affiliated with DECA Inc."*
3. Every role play scenario: *"Podium practice scenario — modeled after DECA [event name] format. Not affiliated with DECA Inc."*
4. Every PI display: *"Performance Indicators sourced from DECA Inc.'s official guidelines. [View official PDF →]"*
5. Every vocab page: *"Vocabulary aligned with DECA Inc. curriculum standards."*
6. Sitewide footer: *"Podium is an independent student-built prep platform. Not affiliated with or endorsed by DECA Inc. DECA® is a registered trademark of DECA Inc."*

## Environment Variables

```
# Firebase Client (NEXT_PUBLIC_*)
NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin (server-only)
FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY

# Other
ANTHROPIC_API_KEY, ADMIN_SECRET_KEY
```

## Build Status

All 16 implementation tasks are complete. Only deployment (Task 17) remains. The build was executed via subagent-driven development following the plan below.

## NPM Scripts

```
dev          — next dev
build        — next build
start        — next start
lint         — eslint
seed:events  — npx tsx scripts/seed-events.ts  (batch-write 60 events to Firestore)
seed:pis     — npx tsx scripts/seed-pis.ts     (batch-write PIs to Firestore subcollections)
```

## Server Actions Reference

| File | Exports |
|------|---------|
| `lib/actions/onboarding.ts` | `completeOnboarding(data)` |
| `lib/actions/exams.ts` | `submitExamResult(result)` |
| `lib/actions/roleplay.ts` | `submitRoleplayResult(result)` |
| `lib/actions/progress.ts` | `updatePIProgress(piId, isCorrect)` |
| `lib/actions/vocab.ts` | `updateVocabProgress(wordId, isCorrect)` |
| `lib/actions/profile.ts` | `updateProfile(data)`, `deleteAccount()` |

## AI Prompt Templates (`lib/ai/prompts.ts`)

| Export | Purpose |
|--------|---------|
| `EXPLAIN_PROMPT` | Exam answer explanations |
| `SCORER_PROMPT` | Role play per-PI scoring (1-5 scale) |
| `CHAT_PROMPT` | PI study chat (uses `{eventName}` placeholder) |
| `QUESTION_GEN_PROMPT` | Admin: generate exam questions |
| `SCENARIO_GEN_PROMPT` | Admin: generate role play scenarios |

## Spec Documents

- **Master prompt:** `prompt.md` — original feature requirements and all event seed data
- **Design system:** `Design/DESIGN.md` — colors, typography, component rules
- **Implementation plan & design spec:** in `.superpowers/` at repo root (generated during planning phase)
