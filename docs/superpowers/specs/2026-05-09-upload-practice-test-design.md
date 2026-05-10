# Upload Practice Test — Design Spec

**Date:** 2026-05-09  
**Status:** Approved  
**Scope:** Full upload-parse-take-review flow for user-uploaded DECA practice test PDFs

---

## Overview

Users can upload their own DECA practice test PDFs and take them inside Podium's existing exam interface. Podium never hosts official PDFs — users upload their own copies. The PDF must be text-based and include an answer key. After parsing, the raw PDF is discarded; only the extracted question data is persisted in Firestore.

---

## Architecture

### Pipeline (Option A — Direct to Route Handler)

```
Client (file picker)
  → POST /api/upload-test/parse   (multipart/form-data, max 5MB enforced client-side)
      → pdf-parse extracts raw text
      → parser identifies questions, options A–D, answer key
      → returns { questions[] } or { error: string }
  → saveUploadedTest() Server Action
      → batch-writes top-level doc + questions subcollection to Firestore
      → returns testId
  → redirect to /exams
```

No Firebase Storage is used. The PDF bytes travel directly to the Route Handler and are discarded after parsing.

### Route Structure

```
app/(app)/exams/page.tsx                  — Exams page (Server Component)
app/(app)/exams/upload/page.tsx           — Upload page (Client Component)
app/(app)/exams/[testId]/page.tsx         — Exam runner page
app/(app)/exams/[testId]/results/page.tsx — Results page
app/api/upload-test/parse/route.ts        — PDF parse Route Handler
lib/actions/uploaded-tests.ts             — Server Actions
components/exams/UploadZone.tsx           — Drag-and-drop upload UI
components/exams/TestCard.tsx             — Card shown on exams page
components/exams/PreTestModal.tsx         — Settings modal before starting
components/exams/SubmitConfirmDialog.tsx  — Confirmation before final submit
```

---

## Data Model

### Firestore

```
uploaded_tests/{testId}
  userId:        string        — owner's Firebase UID
  testName:      string        — user-provided name
  uploadedAt:    string        — ISO timestamp
  questionCount: number        — total questions extracted

uploaded_tests/{testId}/questions/{questionId}
  questionNumber: number
  questionText:   string
  optionA:        string
  optionB:        string
  optionC:        string
  optionD:        string
  correctAnswer:  "A" | "B" | "C" | "D"
```

No `eventId` (no PI integration in this version). No `storageRef` (PDF is discarded).

### TypeScript types (`lib/actions/uploaded-tests.ts`)

```ts
export interface UploadedTest {
  id: string;
  userId: string;
  testName: string;
  uploadedAt: string;
  questionCount: number;
}

export interface UploadedQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
}
```

### Server Actions (`lib/actions/uploaded-tests.ts`)

- `saveUploadedTest(testName: string, questions: Omit<UploadedQuestion, "id">[])` — batch-writes top-level doc + subcollection, returns `{ testId: string }`
- `deleteUploadedTest(testId: string)` — deletes doc + subcollection (for future delete button)
- `getUploadedTests()` — returns `UploadedTest[]` for the current user, used server-side on the exams page

---

## Feature Sections

### 1. Upload Page (`/exams/upload`)

- Drag-and-drop upload zone with file picker fallback, PDF only
- Client-side guard: `file.size > 5_000_000` → inline error, no network request
- Test name text input (required)
- On submit:
  1. `POST /api/upload-test/parse` with `multipart/form-data`
  2. On `{ error }` response → show hard-fail message inline, do not proceed
  3. On success → call `saveUploadedTest()` Server Action → redirect to `/exams`
- Loading state during upload + parse (button disabled, spinner)
- Legal notice: *"Upload your own DECA practice test PDF. The PDF must include an answer key. Podium does not host official DECA materials — you are responsible for ensuring you have the right to use any PDF you upload."*
- Standard Podium footer disclaimer

### 2. PDF Parse Route Handler (`POST /api/upload-test/parse`)

- Accepts `multipart/form-data` with `file` field
- Verifies session cookie (same pattern as `/api/ai/*` routes)
- Runs `pdf-parse` on the buffer
- Parser logic:
  - Questions: lines matching `/^\d+[\.\)]/` 
  - Options: lines matching `/^[A-D][\.\)]/`
  - Answer key: trailing section matching patterns like `1. A`, `1) A`, or a compact grid
- Hard-fail conditions (returns `{ error: string }`):
  - Fewer than 5 questions extracted
  - Any extracted question missing all 4 options
  - Answer key not found or mismatched question count
- On success: returns `{ questions: UploadedQuestion[] }`

### 3. Exams Page (`/exams`)

Server Component. Two sections:

**My Uploaded Tests**
- Calls `getUploadedTests()` at render time
- Grid of `<TestCard>` components (test name, question count, upload date)
- "Upload a Test" button in section header → `/exams/upload`
- Empty state if no tests: prompt to upload first test

**AI-Generated Exams**
- "Coming Soon" section retained below uploaded tests (same pill style as before)

Clicking a `<TestCard>` opens `<PreTestModal>` (Client Component) with `testId` + `testName`.

### 4. Pre-Test Modal

Shadcn/ui `Dialog`. Opens when a test card is clicked.

**Fields:**
- **Time limit** — number input (10–180), default 90. "No time limit" checkbox disables input and sets value to `null`.
- **Answer reveal mode** — radio: "After each question" | "At the end"

**Question fetch:** `useEffect` on modal open reads `uploaded_tests/{testId}/questions` subcollection via Firestore client SDK. Loading spinner shown while fetching.

**"Start Test" CTA:** Navigates to `/exams/{testId}?timeLimit={n|null}&revealMode={after|end}`. Questions passed via `sessionStorage` (key: `uploadedQuestions_{testId}`) to avoid re-fetching.

### 5. Exam Interface (`/exams/[testId]`)

Reuses `ExamRunner` with minimal changes:
- `piId` made optional on `ExamQuestion` interface (`piId?: string`)
- New `revealMode: "after" | "end"` prop
- New `timeLimitMinutes: number | null` prop (null → hide timer, no auto-submit)

**"After each question" mode:** On answer selection, `QuestionCard` flips to `showResult={true}` for that question. A "Next" button replaces the option to re-select. `QuestionCard` already supports this via its `showResult` prop.

**Submission confirmation:** `<SubmitConfirmDialog>` (Shadcn/ui `AlertDialog`) fires when user clicks "Submit Test" and there are unanswered or flagged questions. Lists counts. If all answered and none flagged, submits immediately.

**Legal notice:** Inline below timer bar — *"User-uploaded test. Podium does not verify or endorse the content of uploaded tests."*

**On submit:** Writes `{ answers, questions }` to `sessionStorage` key `examResults_{testId}`, then navigates to `/exams/{testId}/results`.

### 6. Results Screen (`/exams/[testId]/results`)

- Reads `examResults_{testId}` from `sessionStorage` on mount. If missing (e.g. direct navigation), redirects to `/exams`.
- Renders existing `ResultsBreakdown` with a new `showExplain?: boolean` prop (defaults `true`). Pass `showExplain={false}` for uploaded test results — this suppresses the `ExplainButton` on each question row.
- **"Retake Test"** — navigates to `/exams?retake={testId}`. The exams page passes this search param to `<ExamsClient>`, a Client Component wrapper that reads it on mount and auto-opens `<PreTestModal>` for that `testId`.
- **"Back to Exams"** — plain text link to `/exams`
- No Firestore write (results not tracked in this version)

---

## Error Handling

| Scenario | Behavior |
|---|---|
| File > 5MB | Client-side inline error, no network request |
| Non-PDF file | Client-side inline error (file picker restricts to `application/pdf`) |
| Parse fails (< 5 questions, missing options, no answer key) | Route Handler returns `{ error }`, upload page shows message: "We couldn't parse this PDF — make sure it's a text-based PDF with questions in A/B/C/D format and an answer key." |
| sessionStorage missing on results page | Redirect to `/exams` |
| Unauthenticated request to parse endpoint | 401 response, client shows generic error |

---

## Out of Scope

- AI explanations for uploaded test questions
- Sharing tests between users
- PI Tracker integration
- Manual correction UI for partially-parsed PDFs
- Firebase Storage (PDF discarded after parsing)
- Result tracking in user stats / activity feed
