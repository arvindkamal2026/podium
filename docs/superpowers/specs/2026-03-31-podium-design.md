# Podium — Full-Stack DECA Prep Platform Design Spec

## Overview

Podium is a full-stack DECA competition prep web app built by a competitor, for competitors. It provides personalized dashboards, AI-powered role play coaching, PI mastery tracking, vocab flashcards, and AI-generated practice exams — all tied to the user's specific event. Public-facing, free to use, designed to look like a professional product.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + Shadcn/ui |
| Database | Firebase Firestore (NoSQL) |
| Auth | Firebase Auth (email/password + Google OAuth) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Fonts | Plus Jakarta Sans (headlines) + Inter (body) |
| Icons | Material Symbols Outlined |
| Deployment | Vercel |

---

## Architecture

### Data Access Pattern: Hybrid

- **Client-side reads** — Firebase Client SDK for real-time Firestore listeners on dashboard, PI progress, streaks, activity feeds
- **Server-side writes** — Next.js Server Actions (Firebase Admin SDK) for all mutations: exam scoring, role play submission, progress updates, onboarding
- **Route Handlers** — only for AI streaming endpoints (`/api/ai/*`) and admin seeding routes (`/api/admin/*`)

### Why Hybrid

Client reads give real-time UX for the dashboard and progress tracking. Server writes keep security simple — Firestore rules are read-only for authenticated users, all writes go through trusted server code. AI endpoints need Route Handlers because Server Actions don't support Web Streams.

---

## Firestore Data Model

### Collections & Documents

```
users/{uid}
  - name, school, cluster, eventId, competitionDate, competitionLevel
  - streak, longestStreak, lastActive, createdAt
  - weeklySessionCount, weeklyGoalResetDate

users/{uid}/piProgress/{piId}
  - timesTested, timesCorrect, masteryStatus, lastTested

users/{uid}/vocabProgress/{vocabId}
  - timesSeen, timesCorrect, masteryStatus, lastSeen

users/{uid}/examAttempts/{attemptId}
  - eventId, score, totalQuestions, dateTaken, timeSpentSecs
  - answers: [{ questionId, userAnswer, isCorrect, piId }]

users/{uid}/roleplayAttempts/{attemptId}
  - scenarioId, overallScore, piScores, aiFeedback
  - userResponse, dateTaken

users/{uid}/recentActivity/{activityId}
  - type (exam|roleplay|vocab), score, date, eventId
  (capped at 20 docs — oldest deleted on new write)

events/{eventId}
  - name, code, cluster, category, participants
  - prepTimeMins, interviewTimeMins, hasExam
  - overview, officialPiPdfUrl, officialSampleExamUrl, officialGuidelinesUrl

events/{eventId}/performanceIndicators/{piId}
  - code, text, category, difficulty, eventId, cluster

vocabWords/{vocabId}
  - cluster, term, definition, exampleSentence

practiceExams/{questionId}
  - cluster, eventId, question, optionA-D, correctAnswer
  - piId, difficulty, explanation

roleplayScenarios/{scenarioId}
  - eventId, cluster, title, scenarioText, topicArea
  - year, source, piIds[]
```

### Design Decisions

1. **User progress as subcollections** — reading "all my PI progress" is a single subcollection query. Security rules are trivial (`request.auth.uid == uid`).
2. **Exam answers embedded in attempt doc** — 100 answers per exam is well within Firestore's 1MB doc limit. Avoids third-level nesting.
3. **Recent activity as capped subcollection** — cheap dashboard reads without querying across all attempt subcollections.
4. **Events + PIs as top-level with subcollection** — events are shared, PIs queried per event.
5. **Practice exams & scenarios as top-level** — shared across all users, queried by eventId.

### Mastery Logic

- **Untested** → default state
- **Learning** → after being tested once
- **Mastered** → after 3+ correct answers
- **Mastered → Learning** → if answered incorrectly after reaching mastery

---

## Authentication & Security

### Firebase Auth

- Providers: email/password + Google OAuth
- Auth state managed client-side via `onAuthStateChanged`
- ID tokens passed to server via cookies
- Next.js middleware checks cookie, redirects unauthenticated users

### Route Protection

| Route | Access |
|-------|--------|
| `/` | Public (landing page) |
| `/login`, `/signup` | Public (redirect to `/home` if authed) |
| `/home`, `/pi-tracker`, `/exams`, `/roleplay`, `/vocab`, `/profile`, `/events`, `/events/[slug]` | Authenticated |
| `/api/admin/*` | `X-Admin-Key` header matching `ADMIN_SECRET_KEY` env var |
| `/api/ai/*` | Authenticated (verify ID token server-side) |

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false;
    }
    match /events/{doc=**} { allow read: if request.auth != null; }
    match /vocabWords/{doc} { allow read: if request.auth != null; }
    match /practiceExams/{doc} { allow read: if request.auth != null; }
    match /roleplayScenarios/{doc} { allow read: if request.auth != null; }
  }
}
```

All writes go through Server Actions / Route Handlers using Admin SDK. Client is read-only.

### Onboarding

After first sign-up, middleware checks for user doc existence. If missing, redirects to `/onboarding`. The 4-step flow creates the user doc via Server Action on completion.

---

## Project Structure

```
podium/
├── app/
│   ├── layout.tsx              # Root layout — fonts, dark theme
│   ├── page.tsx                # Landing page (public, full-width)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx          # Centered, no sidebar
│   ├── (app)/
│   │   ├── layout.tsx          # Top nav + 220px sidebar
│   │   ├── home/page.tsx       # Dashboard
│   │   ├── pi-tracker/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx        # Events hub
│   │   │   └── [slug]/page.tsx # Event detail
│   │   ├── exams/page.tsx
│   │   ├── roleplay/page.tsx
│   │   ├── vocab/page.tsx
│   │   └── profile/page.tsx
│   ├── onboarding/page.tsx     # 4-step modal
│   └── api/
│       ├── ai/
│       │   ├── explain/route.ts
│       │   ├── roleplay-score/route.ts
│       │   └── chat/route.ts
│       └── admin/
│           ├── generate-questions/route.ts
│           └── generate-scenarios/route.ts
├── lib/
│   ├── firebase/
│   │   ├── client.ts           # Client SDK init
│   │   ├── admin.ts            # Admin SDK init
│   │   └── auth.ts             # Sign in, sign up, sign out
│   ├── ai/
│   │   ├── anthropic.ts        # Claude client
│   │   ├── prompts.ts          # All prompt templates
│   │   └── streaming.ts        # Stream helpers
│   ├── actions/
│   │   ├── onboarding.ts
│   │   ├── exams.ts
│   │   ├── roleplay.ts
│   │   ├── vocab.ts
│   │   └── progress.ts         # Shared mastery logic
│   └── hooks/
│       ├── useAuth.ts
│       ├── useFirestore.ts
│       └── useCountdown.ts
├── components/
│   ├── ui/                     # Shadcn/ui
│   ├── layout/
│   │   ├── TopNav.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── CountdownTimer.tsx
│   │   ├── MasteryRing.tsx
│   │   ├── StreakTracker.tsx
│   │   └── QuickActions.tsx
│   ├── pi/
│   │   ├── PICard.tsx
│   │   ├── PIList.tsx
│   │   └── MasteryBadge.tsx
│   ├── exams/
│   │   ├── ExamRunner.tsx
│   │   ├── QuestionCard.tsx
│   │   └── ResultsBreakdown.tsx
│   ├── roleplay/
│   │   ├── ScenarioDisplay.tsx
│   │   ├── ResponseEditor.tsx
│   │   └── Scorecard.tsx
│   ├── vocab/
│   │   ├── Flashcard.tsx
│   │   ├── MultipleChoice.tsx
│   │   └── TypeAnswer.tsx
│   ├── ai/
│   │   └── PIStudyChat.tsx
│   └── legal/
│       ├── ExamDisclaimer.tsx
│       ├── RolePlayDisclaimer.tsx
│       ├── PIAttribution.tsx
│       └── VocabAttribution.tsx
├── data/
│   ├── seed.ts                 # Events + PI seed data
│   ├── marketing/
│   ├── finance/
│   ├── business-mgmt/
│   ├── hospitality/
│   ├── entrepreneurship/
│   └── personal-finance/
├── middleware.ts               # Auth + onboarding redirect
└── tailwind.config.ts          # Design system tokens
```

---

## AI Integration

### Model

Claude Sonnet 4.6 (`claude-sonnet-4-6`) via `@anthropic-ai/sdk` for all features.

### Feature 1: Wrong-Answer Explainer

- **Endpoint:** `POST /api/ai/explain`
- **Method:** Non-streaming
- **Input:** question, correct answer, user's answer, PI text, cluster
- **Prompt:** Explain in under 100 words why the correct answer is right and why theirs is wrong. Use cluster domain knowledge. Conversational tone, no bullet points.
- **Output:** Plain text string rendered inline

### Feature 2: Role Play Scorer

- **Endpoint:** `POST /api/ai/roleplay-score`
- **Method:** Streaming
- **Input:** event name, cluster, scenario text, user response, PI list
- **Prompt:** Score each PI 1-5 with specific feedback, score professionalism/structure/clarity 1-5.
- **Output:** Streamed JSON:
  ```json
  {
    "pi_scores": { "[piCode]": { "score": 1-5, "feedback": "string" } },
    "overall_score": 0-100,
    "strengths": ["string"],
    "improvements": ["string"],
    "summary": "2-3 sentences"
  }
  ```
- **Post-processing:** Server Action saves attempt + updates PI progress

### Feature 3: PI Study Assistant

- **Endpoint:** `POST /api/ai/chat`
- **Method:** Streaming, conversational
- **System prompt:** DECA competition coach for user's event/cluster. Specific, practical, concise.
- **Context per message:** Event name, cluster, PI list
- **Message history:** Client-side React state, sent with each request. Resets on page refresh.
- **UI:** Floating chat widget on PI Tracker and Event Detail pages

### Feature 4: AI Question Generation (Admin)

- **Endpoint:** `POST /api/admin/generate-questions`
- **Auth:** `X-Admin-Key` header
- **Input:** `eventId`
- **Action:** Generates 100 original multiple choice questions for the event, writes to `practiceExams` collection
- **Rate:** Run per-event, not batch

### Feature 5: AI Scenario Generation (Admin)

- **Endpoint:** `POST /api/admin/generate-scenarios`
- **Auth:** `X-Admin-Key` header
- **Input:** `eventId`
- **Action:** Generates 10 original role play scenarios, writes to `roleplayScenarios` collection

---

## Key User Flows

### Exam Practice

1. User selects event at `/exams` (pre-selected to their event)
2. 100 random questions fetched from `practiceExams` by eventId
3. Timed 90-minute exam, one question at a time, forward/back navigation
4. Submit → Server Action scores, writes `examAttempts` with embedded answers
5. Server Action batch-updates `piProgress` for each question's PI
6. Server Action writes to `recentActivity` (capped)
7. Results: score, PI breakdown, wrong answers with "Explain" button
8. "Explain" calls `/api/ai/explain` → inline explanation

### Role Play

1. Random scenario fetched for user's event
2. 30-minute countdown, large text area
3. Submit → POST to `/api/ai/roleplay-score` (streaming)
4. Scorecard renders: per-PI scores (color-coded 1-5), strengths, improvements
5. Server Action saves attempt, updates PI progress, updates activity

### Vocab

1. Filter by cluster or event, three study modes:
   - **Flashcard** — flip animation, term → definition + example
   - **Multiple Choice** — term shown, 4 definitions (1 correct + 3 from same cluster)
   - **Type the Answer** — term shown, fuzzy-match user input
2. Server Action updates `vocabProgress` per word
3. Spaced repetition: weighted random — lower mastery + older `lastSeen` shown first

### PI Tracker

1. Real-time listener on `piProgress` + one-time fetch of event's PIs
2. Client joins datasets, computes summary stats
3. Mastery ring (SVG/recharts), filter/search client-side
4. "Practice this PI" → `/exams?pi={piId}` for 5-question mini-exam
5. PDF export: client-side generation via `jsPDF` or `html2pdf.js` — renders current PI statuses as a downloadable PDF summary

### Dashboard

1. Real-time listeners on user doc, piProgress, recentActivity
2. Countdown: computed from competitionDate, updates every second
3. Streak: gold accent, from user doc
4. Weekly goal: weeklySessionCount, auto-resets Monday via Server Action check
5. Quick actions → pre-filtered links to exams, roleplay, vocab

---

## Design System: Executive Brutalism

Source of truth: `/Design/DESIGN.md`

### Creative Direction

High-stakes, editorial aesthetic. Corporate boardroom meets awards gala. Intentional asymmetry, tonal depth, extreme typographic scale. Not a friendly SaaS tool.

### Typography

- **Plus Jakarta Sans** — headlines, displays, labels (weights 400-800)
- **Inter** — body, utility text (weights 300-600)
- Editorial scale: 48-96px displays next to 10px labels

### Color Tokens

| Role | Token | Value |
|------|-------|-------|
| Background | `surface` | `#131313` |
| Primary containers | `surface-container` | `#201F1F` |
| Elevated | `surface-container-high` | `#2A2A2A` |
| Highest (modals) | `surface-container-highest` | `#353534` |
| Low containers | `surface-container-low` | `#1C1B1B` |
| Deepest base | `surface-container-lowest` | `#0E0E0E` |
| Primary | `primary` | `#ADC6FF` |
| Primary container | `primary-container` | `#4D8EFF` |
| Secondary (gold) | `secondary` | `#FFB95F` |
| Tertiary (success) | `tertiary` | `#4EDEA5` |
| Error | `error` | `#FFB4AB` |
| Body text | `on-surface` | `#E5E2E1` |
| Muted text | `on-surface-variant` | `#C2C6D6` |
| Outline | `outline` | `#8C909F` |
| Ghost border | `outline-variant` | `#424754` at 15% opacity |

### Core Rules

1. **No-Line Rule** — no `1px solid` borders. Separation via tonal layering.
2. **Ghost Border Fallback** — `outline-variant` at 15% opacity when accessibility needs it.
3. **Gradient CTAs** — `linear-gradient(135deg, #ADC6FF, #4D8EFF)` with `#002E6A` text.
4. **Frosted Glass** — nav/floating elements: `backdrop-blur(16px)`, surface at 80% opacity.
5. **Hover = tonal shift** — up one surface tier + 3px left accent bar in primary.
6. **No divider lines** — use 1.5rem gaps or surface shifts.
7. **Never use pure white** — body text is `#E5E2E1`.

### Mastery Colors

- Mastered → `tertiary` (`#4EDEA5`)
- Learning → `secondary` (`#FFB95F`)
- Untested → `error` (`#FFB4AB`)

### Progress Indicators

- Track: `surface-container-highest` (`#353534`)
- Fill: gradient `secondary` → `secondary-container` (`#EE9800`)

---

## Legal & Attribution

### Global Rules

1. Never host DECA PDFs — link to deca.org only
2. Label every exam: *"Podium Practice Exam — ICDC Difficulty. Original content, not affiliated with DECA Inc."*
3. Label every scenario: *"Podium practice scenario — modeled after DECA [event name] format. Not affiliated with DECA Inc."*
4. Every PI display: *"Performance Indicators sourced from DECA Inc.'s official guidelines. [View official PDF →]"*
5. Every vocab page: *"Vocabulary aligned with DECA Inc. curriculum standards."*
6. Sitewide footer: *"Podium is an independent student-built prep platform. Not affiliated with or endorsed by DECA Inc. DECA® is a registered trademark of DECA Inc."*

### Implementation

- Footer component on every layout
- Reusable disclaimer components: `ExamDisclaimer`, `RolePlayDisclaimer`, `PIAttribution`, `VocabAttribution`

---

## Environment Variables

### Firebase (Client — NEXT_PUBLIC)

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Firebase (Server — Admin SDK)

```
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

### Other

```
ANTHROPIC_API_KEY=
ADMIN_SECRET_KEY=
```

---

## Build Order

1. Scaffold Next.js 16 app with Tailwind CSS v4 + Shadcn/ui + Plus Jakarta Sans + Inter
2. Set up Firebase project — Firestore + Auth
3. Set up auth (signup, login, Google OAuth, protected routes, middleware)
4. Build onboarding flow (4 steps, creates user doc)
5. Seed events collection with all 59 events
6. Seed PI subcollections for top 10 events
7. Build Dashboard (`/home`)
8. Build PI Tracker (`/pi-tracker`)
9. Build Events Hub (`/events`) + Event Detail (`/events/[slug]`)
10. Build Exam Practice (`/exams`) + AI wrong-answer explainer
11. Build Role Play Coach (`/roleplay`) + AI scorer
12. Build Vocab Flashcards (`/vocab`)
13. Build Profile + Settings (`/profile`)
14. Run AI seeding routes to generate questions and scenarios
15. Build Landing page (`/`)
16. Deploy to Vercel

---

## Seed Data

All 59 official DECA competitive events seeded with: name, code, cluster, category, participants, hasExam, prepTimeMins, interviewTimeMins, and official deca.org URLs.

Full event list in `/data/seed.ts`. PI data hardcoded per event since PIs come from official DECA documents and change infrequently. Supplementary PDFs in `/data/{cluster}/` parsed by seeding script.
