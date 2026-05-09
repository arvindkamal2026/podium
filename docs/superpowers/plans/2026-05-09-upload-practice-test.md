# Upload Practice Test — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users upload their own DECA practice test PDFs, have them parsed server-side with `pdf-parse`, and take the resulting exam inside Podium's existing exam interface.

**Architecture:** PDF bytes are POSTed directly to `/api/upload-test/parse` (Node.js Route Handler), parsed with `pdf-parse`, extracted questions written to Firestore via a Server Action, and the raw PDF discarded. The exam interface reuses `ExamRunner` and `ResultsBreakdown` with minor prop additions. Questions travel: Firestore → `PreTestModal` → `sessionStorage` → exam runner page → results page.

**Tech Stack:** Next.js 16 App Router, Firebase Admin SDK (Firestore writes/reads), Firebase Client SDK (Firestore subcollection reads in browser), `pdf-parse` (server-side PDF text extraction), Tailwind CSS v4, TypeScript

---

## File Map

| File | Status | Responsibility |
|---|---|---|
| `lib/actions/uploaded-tests.ts` | **Create** | Server Actions + shared TS types: save, list, delete uploaded tests |
| `lib/parsers/pdf-questions.ts` | **Create** | Pure function: extract structured questions from raw PDF text |
| `app/api/upload-test/parse/route.ts` | **Create** | Route Handler: auth check, receive PDF bytes, run parser, return JSON |
| `components/exams/UploadZone.tsx` | **Create** | Drag-and-drop file picker with client-side size/type validation |
| `app/(app)/exams/upload/page.tsx` | **Create** | Upload page: test name input + UploadZone + submit flow |
| `components/exams/TestCard.tsx` | **Create** | Clickable card showing test name, question count, upload date |
| `components/exams/PreTestModal.tsx` | **Create** | Settings modal: fetches questions, time limit, reveal mode, Start CTA |
| `components/exams/SubmitConfirmDialog.tsx` | **Create** | Confirmation dialog listing unanswered/flagged questions before submit |
| `components/exams/ExamsClient.tsx` | **Create** | Client wrapper: modal state, `?retake` search param auto-open |
| `app/(app)/exams/page.tsx` | **Modify** | Replace Coming Soon with Server Component that fetches tests + renders ExamsClient |
| `app/(app)/exams/[testId]/page.tsx` | **Create** | Exam runner page: reads sessionStorage + URL params, renders ExamRunner |
| `app/(app)/exams/[testId]/results/page.tsx` | **Create** | Results page: reads sessionStorage, renders ResultsBreakdown |
| `components/exams/ExamRunner.tsx` | **Modify** | `piId` optional, `timeLimitMinutes: number \| null`, `revealMode` prop, submit confirm wiring |
| `components/exams/ResultsBreakdown.tsx` | **Modify** | Add `showExplain?: boolean` prop to suppress ExplainButton |

---

## Task 1: Types & Server Actions

**Files:**
- Create: `lib/actions/uploaded-tests.ts`

- [ ] **Step 1: Create the file**

```ts
"use server";

import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

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

async function getUid(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  try {
    const claims = await getAdminAuth().verifySessionCookie(session, true);
    return claims.uid;
  } catch {
    return null;
  }
}

export async function saveUploadedTest(
  testName: string,
  questions: Omit<UploadedQuestion, "id">[]
): Promise<{ success: boolean; testId?: string; error?: string }> {
  const uid = await getUid();
  if (!uid) return { success: false, error: "Not authenticated" };

  try {
    const db = getAdminDb();
    const testRef = db.collection("uploaded_tests").doc();
    const testId = testRef.id;
    const now = new Date().toISOString();

    const batch = db.batch();
    batch.set(testRef, {
      userId: uid,
      testName,
      uploadedAt: now,
      questionCount: questions.length,
    });
    for (const q of questions) {
      const qRef = testRef.collection("questions").doc();
      batch.set(qRef, q);
    }
    await batch.commit();
    return { success: true, testId };
  } catch (error) {
    console.error("saveUploadedTest error:", error);
    return { success: false, error: "Failed to save test" };
  }
}

export async function getUploadedTests(): Promise<UploadedTest[]> {
  const uid = await getUid();
  if (!uid) return [];

  try {
    const db = getAdminDb();
    // Single equality filter — no composite index needed; sort client-side
    const snap = await db
      .collection("uploaded_tests")
      .where("userId", "==", uid)
      .get();

    const tests = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<UploadedTest, "id">),
    }));

    return tests.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  } catch {
    return [];
  }
}

export async function deleteUploadedTest(
  testId: string
): Promise<{ success: boolean; error?: string }> {
  const uid = await getUid();
  if (!uid) return { success: false, error: "Not authenticated" };

  try {
    const db = getAdminDb();
    const testRef = db.collection("uploaded_tests").doc(testId);
    const testDoc = await testRef.get();

    if (!testDoc.exists || testDoc.data()?.userId !== uid) {
      return { success: false, error: "Not found" };
    }

    const qSnap = await testRef.collection("questions").get();
    const batch = db.batch();
    qSnap.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(testRef);
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error("deleteUploadedTest error:", error);
    return { success: false, error: "Failed to delete test" };
  }
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd podium && npx tsc --noEmit
```

Expected: No errors in `lib/actions/uploaded-tests.ts`.

- [ ] **Step 3: Commit**

```bash
git add podium/lib/actions/uploaded-tests.ts
git commit -m "feat: add uploaded tests server actions and types"
```

---

## Task 2: PDF Question Parser

**Files:**
- Create: `lib/parsers/pdf-questions.ts`

Pure function — no imports from the rest of the app. Takes raw text output from `pdf-parse` and returns structured questions or an error string.

**Parsing strategy:**
1. Scan all lines for `"1. A"` / `"1) A"` patterns (number + single letter, nothing after) → answer key map
2. Scan all lines sequentially for question starts (`"1. Question text"`) and option lines (`"A. Option text"`) → build question list
3. Combine: match answer key entries to question numbers
4. Validate: ≥5 questions, ≥80% have all 4 options, ≥80% have a matching answer key entry

- [ ] **Step 1: Create the parser**

```ts
export interface ParsedQuestion {
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
}

export type ParseResult =
  | { questions: ParsedQuestion[]; error?: never }
  | { questions?: never; error: string };

const PARSE_ERROR =
  "We couldn't parse this PDF — make sure it's a text-based PDF with questions in A/B/C/D format and an answer key.";

export function parsePdfText(rawText: string): ParseResult {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Matches question starts: "1. text" or "1) text"
  const questionStartRe = /^(\d+)[\.\)]\s+(.+)/;
  // Matches option lines: "A. text" or "A) text"
  const optionRe = /^([A-D])[\.\)]\s+(.+)/;
  // Matches answer key lines: "1. A" or "1) A" or "1. A." — number, then a SINGLE letter, nothing else
  const answerKeyLineRe = /^(\d+)[\.\)]\s*([A-D])\.?\s*$/;

  // --- Pass 1: build answer key map ---
  const answerMap: Record<number, "A" | "B" | "C" | "D"> = {};
  for (const line of lines) {
    const m = line.match(answerKeyLineRe);
    if (m) {
      answerMap[parseInt(m[1])] = m[2] as "A" | "B" | "C" | "D";
    }
  }

  // --- Pass 2: parse questions and options ---
  type RawQ = {
    number: number;
    text: string;
    options: Partial<Record<"A" | "B" | "C" | "D", string>>;
  };

  const rawQuestions: RawQ[] = [];
  let current: RawQ | null = null;

  for (const line of lines) {
    // Skip answer key lines so they don't get appended to question text
    if (line.match(answerKeyLineRe)) {
      if (current) {
        rawQuestions.push(current);
        current = null;
      }
      continue;
    }

    const qm = line.match(questionStartRe);
    const om = line.match(optionRe);

    if (qm) {
      if (current) rawQuestions.push(current);
      current = { number: parseInt(qm[1]), text: qm[2], options: {} };
    } else if (om && current) {
      current.options[om[1] as "A" | "B" | "C" | "D"] = om[2];
    } else if (current && Object.keys(current.options).length === 0) {
      // Continuation of question text (before any options appear)
      current.text += " " + line;
    }
  }
  if (current) rawQuestions.push(current);

  // --- Validate ---
  if (rawQuestions.length < 5) {
    return { error: PARSE_ERROR };
  }

  const completeCount = rawQuestions.filter(
    (q) => q.options.A && q.options.B && q.options.C && q.options.D
  ).length;
  if (completeCount < rawQuestions.length * 0.8) {
    return { error: PARSE_ERROR };
  }

  if (Object.keys(answerMap).length < rawQuestions.length * 0.8) {
    return { error: PARSE_ERROR };
  }

  // --- Build output (skip any question missing options or answer) ---
  const questions: ParsedQuestion[] = [];
  for (const q of rawQuestions) {
    const { A, B, C, D } = q.options;
    const correctAnswer = answerMap[q.number];
    if (!A || !B || !C || !D || !correctAnswer) continue;
    questions.push({
      questionNumber: q.number,
      questionText: q.text.trim(),
      optionA: A,
      optionB: B,
      optionC: C,
      optionD: D,
      correctAnswer,
    });
  }

  if (questions.length < 5) {
    return { error: PARSE_ERROR };
  }

  return { questions };
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add podium/lib/parsers/pdf-questions.ts
git commit -m "feat: add PDF question parser utility"
```

---

## Task 3: Parse Route Handler

**Files:**
- Create: `app/api/upload-test/parse/route.ts`

- [ ] **Step 1: Create the route handler**

```ts
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import { parsePdfText } from "@/lib/parsers/pdf-questions";

// Ensure Node.js runtime — pdf-parse requires it (not compatible with Edge)
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // Auth: verify session cookie (same pattern as Server Actions)
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await getAdminAuth().verifySessionCookie(session, true);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse multipart form
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Convert to Buffer
  const arrayBuffer = await (file as File).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Run pdf-parse
  // Using the lib path avoids pdf-parse's test-file resolution issue in Next.js
  let pdfText: string;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse/lib/pdf-parse.js");
    const data = await pdfParse(buffer);
    pdfText = data.text as string;
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn't parse this PDF — make sure it's a text-based PDF with questions in A/B/C/D format and an answer key.",
      },
      { status: 422 }
    );
  }

  // Extract questions
  const result = parsePdfText(pdfText);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ questions: result.questions });
}
```

- [ ] **Step 2: Build to verify**

```bash
npm run build
```

Expected: Build succeeds. If you see a module resolution error for `pdf-parse/lib/pdf-parse.js`, try `require("pdf-parse")` instead.

- [ ] **Step 3: Commit**

```bash
git add podium/app/api/upload-test/parse/route.ts
git commit -m "feat: add PDF parse route handler"
```

---

## Task 4: Modify ExamRunner

**Files:**
- Modify: `components/exams/ExamRunner.tsx`

Three changes: (1) `piId` optional on `ExamQuestion`, (2) timer accepts `null` for no-limit mode, (3) new `revealMode` prop controls when answers are revealed.

- [ ] **Step 1: Update the interface and props at the top of the file**

Replace the existing `ExamQuestion` interface and `ExamRunnerProps` interface:

```ts
export interface ExamQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  piId?: string;         // optional — not present on uploaded tests
  explanation?: string;
}

interface ExamRunnerProps {
  questions: ExamQuestion[];
  timeLimitMinutes: number | null;  // null = no timer, no auto-submit
  revealMode: "after" | "end";
  onSubmit: (answers: Record<string, string>) => void;
}
```

- [ ] **Step 2: Update timer state**

Replace the `useState` for `secondsLeft`:

```ts
const [secondsLeft, setSecondsLeft] = useState<number | null>(
  timeLimitMinutes !== null ? timeLimitMinutes * 60 : null
);
```

- [ ] **Step 3: Update the timer useEffect**

Replace the existing timer `useEffect`:

```ts
useEffect(() => {
  if (secondsLeft === null) return; // no timer
  if (secondsLeft <= 0) {
    onSubmit(answers);
    return;
  }
  const timer = setInterval(
    () => setSecondsLeft((s) => (s !== null ? s - 1 : null)),
    1000
  );
  return () => clearInterval(timer);
}, [secondsLeft, answers, onSubmit]);
```

- [ ] **Step 4: Update the time calculation**

Replace the three `const hours/mins/secs` lines:

```ts
const hours = secondsLeft !== null ? Math.floor(secondsLeft / 3600) : 0;
const mins = secondsLeft !== null ? Math.floor((secondsLeft % 3600) / 60) : 0;
const secs = secondsLeft !== null ? secondsLeft % 60 : 0;
```

- [ ] **Step 5: Update the timer display block**

Replace the timer `<div className="flex items-center gap-2">` block (the one with the clock icon):

```tsx
{secondsLeft !== null ? (
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-lg text-outline">timer</span>
    <span
      className={`font-mono text-lg ${
        secondsLeft < 300 ? "text-error" : "text-on-surface"
      }`}
    >
      {hours > 0 ? `${hours}:` : ""}
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </span>
  </div>
) : (
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-lg text-outline">timer_off</span>
    <span className="text-sm text-outline">No time limit</span>
  </div>
)}
```

- [ ] **Step 6: Update the QuestionCard call for revealMode**

In the JSX where `QuestionCard` is rendered, update the `showResult` prop:

```tsx
<QuestionCard
  index={currentIndex}
  question={current.question}
  options={[
    { key: "A", text: current.optionA },
    { key: "B", text: current.optionB },
    { key: "C", text: current.optionC },
    { key: "D", text: current.optionD },
  ]}
  selectedAnswer={answers[current.id] || null}
  correctAnswer={current.correctAnswer}
  showResult={revealMode === "after" && !!answers[current.id]}
  onSelect={(key) =>
    setAnswers((prev) => ({ ...prev, [current.id]: key }))
  }
/>
```

- [ ] **Step 7: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add podium/components/exams/ExamRunner.tsx
git commit -m "feat: update ExamRunner for nullable timer and reveal mode"
```

---

## Task 5: Modify ResultsBreakdown

**Files:**
- Modify: `components/exams/ResultsBreakdown.tsx`

Add `showExplain?: boolean` prop. When `false`, suppress the `ExplainButton`.

- [ ] **Step 1: Update the props interface**

Replace `ResultsBreakdownProps`:

```ts
interface ResultsBreakdownProps {
  questions: ExamQuestion[];
  answers: Record<string, string>;
  score: number;
  total: number;
  showExplain?: boolean;
}
```

- [ ] **Step 2: Update the destructure**

Replace the function signature:

```ts
export function ResultsBreakdown({
  questions,
  answers,
  score,
  total,
  showExplain = true,
}: ResultsBreakdownProps) {
```

- [ ] **Step 3: Wrap ExplainButton in condition**

Find the `{!isCorrect && (` block and replace it:

```tsx
{!isCorrect && showExplain && (
  <ExplainButton
    question={q.question}
    optionA={q.optionA}
    optionB={q.optionB}
    optionC={q.optionC}
    optionD={q.optionD}
    correctAnswer={q.correctAnswer}
    studentAnswer={userAnswer}
  />
)}
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add podium/components/exams/ResultsBreakdown.tsx
git commit -m "feat: add showExplain prop to ResultsBreakdown"
```

---

## Task 6: UploadZone Component

**Files:**
- Create: `components/exams/UploadZone.tsx`

Drag-and-drop zone + hidden file input. Validates file type (PDF only) and size (≤5 MB) client-side before calling `onFile`.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef, useState, useCallback } from "react";

interface UploadZoneProps {
  onFile: (file: File) => void;
  error?: string;
  disabled?: boolean;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function UploadZone({ onFile, error, disabled }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      if (file.type !== "application/pdf") {
        setLocalError("Please upload a PDF file.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setLocalError("File is too large. Maximum size is 5 MB.");
        return;
      }
      setLocalError(null);
      onFile(file);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      validate(e.dataTransfer.files[0]);
    },
    [validate, disabled]
  );

  const displayError = localError || error;

  return (
    <div className="space-y-2">
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !disabled && inputRef.current?.click()}
        className={[
          "rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
          "border-2 border-dashed",
          dragging
            ? "border-primary bg-primary/5"
            : "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-4xl text-outline">
          upload_file
        </span>
        <div className="text-center">
          <p className="text-sm font-medium text-on-surface">
            Drop your PDF here or{" "}
            <span className="text-primary underline underline-offset-2">browse</span>
          </p>
          <p className="text-xs text-outline mt-1">
            PDF only · max 5 MB · must include an answer key
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={disabled}
          onChange={(e) => validate(e.target.files?.[0])}
        />
      </div>
      {displayError && (
        <p className="text-sm text-error px-1">{displayError}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add podium/components/exams/UploadZone.tsx
git commit -m "feat: add UploadZone drag-and-drop component"
```

---

## Task 7: Upload Page

**Files:**
- Create: `app/(app)/exams/upload/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/exams/UploadZone";
import { saveUploadedTest } from "@/lib/actions/uploaded-tests";
import type { UploadedQuestion } from "@/lib/actions/uploaded-tests";
import type { ParsedQuestion } from "@/lib/parsers/pdf-questions";

function toUploadedQuestion(q: ParsedQuestion): Omit<UploadedQuestion, "id"> {
  return {
    questionNumber: q.questionNumber,
    questionText: q.questionText,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correctAnswer: q.correctAnswer,
  };
}

export default function UploadTestPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [testName, setTestName] = useState("");
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFile = useCallback(
    (f: File) => {
      setFile(f);
      setParseError(null);
      if (!testName) {
        setTestName(f.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "));
      }
    },
    [testName]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !testName.trim()) return;
    setLoading(true);
    setParseError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-test/parse", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        setParseError(json.error ?? "Failed to parse PDF. Please try again.");
        setLoading(false);
        return;
      }

      const result = await saveUploadedTest(
        testName.trim(),
        (json.questions as ParsedQuestion[]).map(toUploadedQuestion)
      );

      if (!result.success) {
        setParseError(result.error ?? "Failed to save test. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/exams");
    } catch {
      setParseError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Upload Practice Test
        </h1>
        <p className="text-outline mt-1">Add your own DECA practice test PDF</p>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-5 text-sm text-outline leading-relaxed">
        Upload your own DECA practice test PDF. The PDF must include an answer key.
        Podium does not host official DECA materials — you are responsible for
        ensuring you have the right to use any PDF you upload.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">
            Test Name
          </label>
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="e.g. 2024 MK Practice Exam"
            required
            disabled={loading}
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">
            PDF File
          </label>
          <UploadZone
            onFile={handleFile}
            error={parseError ?? undefined}
            disabled={loading}
          />
          {file && !parseError && (
            <p className="text-xs text-outline px-1">
              Selected: {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!file || !testName.trim() || loading}
          className="gradient-cta w-full rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">
                progress_activity
              </span>
              Parsing PDF...
            </>
          ) : (
            "Upload & Save Test"
          )}
        </button>
      </form>

      <p className="text-xs text-outline leading-relaxed">
        Podium is an independent student-built prep platform. Not affiliated with
        or endorsed by DECA Inc. DECA® is a registered trademark of DECA Inc.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
```

Open `http://localhost:3000/exams/upload`. Verify:
- Page renders with legal notice, test name field, and upload zone
- Clicking upload zone opens file picker
- Dragging a file onto the zone highlights it
- Submit button is disabled when no file is selected

- [ ] **Step 4: Commit**

```bash
git add "podium/app/(app)/exams/upload/page.tsx"
git commit -m "feat: add upload practice test page"
```

---

## Task 8: TestCard Component

**Files:**
- Create: `components/exams/TestCard.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { UploadedTest } from "@/lib/actions/uploaded-tests";

interface TestCardProps {
  test: UploadedTest;
  onOpen: (testId: string) => void;
}

export function TestCard({ test, onOpen }: TestCardProps) {
  const date = new Date(test.uploadedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button
      onClick={() => onOpen(test.id)}
      className="w-full text-left bg-surface-container-low rounded-2xl p-6 hover:bg-surface-container transition-colors group relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 rounded-l-2xl bg-primary transition-all duration-200" />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="font-headline text-base font-semibold text-on-surface truncate">
            {test.testName}
          </p>
          <p className="text-xs text-outline">
            {test.questionCount} questions · Uploaded {date}
          </p>
        </div>
        <span className="material-symbols-outlined text-xl text-outline group-hover:text-primary transition-colors shrink-0">
          play_circle
        </span>
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add podium/components/exams/TestCard.tsx
git commit -m "feat: add TestCard component"
```

---

## Task 9: PreTestModal Component

**Files:**
- Create: `components/exams/PreTestModal.tsx`

Fetches the questions subcollection from Firestore when the modal opens. Stores questions in `sessionStorage` and navigates to the exam page when the user clicks "Start Test".

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import type { UploadedQuestion } from "@/lib/actions/uploaded-tests";
import type { ExamQuestion } from "@/components/exams/ExamRunner";

interface PreTestModalProps {
  testId: string;
  testName: string;
  onClose: () => void;
}

function toExamQuestion(q: UploadedQuestion): ExamQuestion {
  return {
    id: q.id,
    question: q.questionText,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correctAnswer: q.correctAnswer,
  };
}

export function PreTestModal({ testId, testName, onClose }: PreTestModalProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [noTimeLimit, setNoTimeLimit] = useState(false);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(90);
  const [revealMode, setRevealMode] = useState<"after" | "end">("end");

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const db = getClientDb();
        const snap = await getDocs(
          collection(db, `uploaded_tests/${testId}/questions`)
        );
        if (cancelled) return;

        // Sort by questionNumber before mapping
        const sorted = snap.docs.sort(
          (a, b) =>
            ((a.data().questionNumber as number) ?? 0) -
            ((b.data().questionNumber as number) ?? 0)
        );
        const qs = sorted.map((d) =>
          toExamQuestion({ id: d.id, ...(d.data() as Omit<UploadedQuestion, "id">) })
        );
        setQuestions(qs);
      } catch {
        if (!cancelled) setFetchError("Failed to load questions. Please try again.");
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [testId]);

  const handleStart = useCallback(() => {
    if (!questions) return;
    sessionStorage.setItem(`uploadedQuestions_${testId}`, JSON.stringify(questions));
    const timeParam = noTimeLimit ? "null" : String(timeLimitMinutes);
    router.push(`/exams/${testId}?timeLimit=${timeParam}&revealMode=${revealMode}`);
    onClose();
  }, [questions, testId, noTimeLimit, timeLimitMinutes, revealMode, router, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container rounded-2xl w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-1">
              Configure Test
            </p>
            <h2 className="font-headline text-xl font-bold text-on-surface leading-tight">
              {testName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Loading */}
        {!questions && !fetchError && (
          <div className="flex items-center gap-2 text-sm text-outline py-4">
            <span className="material-symbols-outlined text-lg animate-spin">
              progress_activity
            </span>
            Loading questions...
          </div>
        )}

        {/* Fetch error */}
        {fetchError && (
          <p className="text-sm text-error">{fetchError}</p>
        )}

        {/* Settings */}
        {questions && (
          <>
            <p className="text-sm text-outline -mt-2">
              {questions.length} questions loaded
            </p>

            {/* Time limit */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">
                Time Limit
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={10}
                  max={180}
                  value={timeLimitMinutes}
                  disabled={noTimeLimit}
                  onChange={(e) =>
                    setTimeLimitMinutes(
                      Math.min(180, Math.max(10, parseInt(e.target.value) || 10))
                    )
                  }
                  className="w-24 bg-surface-container-low rounded-xl px-3 py-2 text-sm text-on-surface text-center focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-40 transition"
                />
                <span className="text-sm text-outline">minutes</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noTimeLimit}
                  onChange={(e) => setNoTimeLimit(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm text-on-surface">No time limit</span>
              </label>
            </div>

            {/* Reveal mode */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">
                Answer Reveal
              </p>
              {(["end", "after"] as const).map((mode) => (
                <label key={mode} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="revealMode"
                    value={mode}
                    checked={revealMode === mode}
                    onChange={() => setRevealMode(mode)}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <p className="text-sm text-on-surface font-medium">
                      {mode === "end" ? "Reveal at the end" : "Reveal after each question"}
                    </p>
                    <p className="text-xs text-outline">
                      {mode === "end"
                        ? "See all answers on the results screen"
                        : "Correct answer shown immediately after each selection"}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleStart}
              className="gradient-cta w-full rounded-xl px-6 py-3 text-sm font-semibold"
            >
              Start Test
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add podium/components/exams/PreTestModal.tsx
git commit -m "feat: add PreTestModal with question fetch and test settings"
```

---

## Task 10: ExamsClient + Exams Page

**Files:**
- Create: `components/exams/ExamsClient.tsx`
- Modify: `app/(app)/exams/page.tsx`

`ExamsClient` is a Client Component managing modal open/close state and the `?retake` auto-open behavior. The exams page becomes a Server Component that fetches tests server-side.

- [ ] **Step 1: Create ExamsClient**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TestCard } from "@/components/exams/TestCard";
import { PreTestModal } from "@/components/exams/PreTestModal";
import type { UploadedTest } from "@/lib/actions/uploaded-tests";

interface ExamsClientProps {
  tests: UploadedTest[];
}

export function ExamsClient({ tests }: ExamsClientProps) {
  const searchParams = useSearchParams();
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeTestName, setActiveTestName] = useState("");

  // Auto-open modal when ?retake=testId is present (e.g. from results page)
  useEffect(() => {
    const retakeId = searchParams.get("retake");
    if (retakeId) {
      const test = tests.find((t) => t.id === retakeId);
      if (test) {
        setActiveTestId(test.id);
        setActiveTestName(test.testName);
      }
    }
  }, [searchParams, tests]);

  function openModal(testId: string) {
    const test = tests.find((t) => t.id === testId);
    if (!test) return;
    setActiveTestId(testId);
    setActiveTestName(test.testName);
  }

  return (
    <>
      {/* My Uploaded Tests */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-xl font-bold text-on-surface">
            My Uploaded Tests
          </h2>
          <Link
            href="/exams/upload"
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">upload</span>
            Upload a Test
          </Link>
        </div>

        {tests.length === 0 ? (
          <div className="bg-surface-container-low rounded-2xl p-12 flex flex-col items-center gap-4 text-center">
            <span className="material-symbols-outlined text-4xl text-outline">
              upload_file
            </span>
            <div>
              <p className="font-headline text-lg font-semibold text-on-surface mb-1">
                No tests yet
              </p>
              <p className="text-sm text-outline max-w-xs">
                Upload your own DECA practice test PDF to get started.
              </p>
            </div>
            <Link
              href="/exams/upload"
              className="gradient-cta rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              Upload a Test
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {tests.map((test) => (
              <TestCard key={test.id} test={test} onOpen={openModal} />
            ))}
          </div>
        )}
      </section>

      {/* AI-Generated Exams — Coming Soon */}
      <section className="space-y-4">
        <h2 className="font-headline text-xl font-bold text-on-surface">
          AI-Generated Exams
        </h2>
        <div className="bg-surface-container-low rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4">
          <span className="material-symbols-outlined text-3xl text-outline">
            smart_toy
          </span>
          <div>
            <p className="font-headline text-base font-semibold text-on-surface mb-1">
              Coming Soon
            </p>
            <p className="text-sm text-outline max-w-sm">
              AI-generated questions at ICDC difficulty with per-PI breakdowns are on the way.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary-ds/15 text-secondary-ds">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-ds animate-pulse" />
            In Development
          </span>
        </div>
      </section>

      {/* Pre-test modal */}
      {activeTestId && (
        <PreTestModal
          testId={activeTestId}
          testName={activeTestName}
          onClose={() => setActiveTestId(null)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: Replace the exams page**

Replace the full content of `app/(app)/exams/page.tsx`:

```tsx
import { getUploadedTests } from "@/lib/actions/uploaded-tests";
import { ExamsClient } from "@/components/exams/ExamsClient";
import { ExamDisclaimer } from "@/components/legal/ExamDisclaimer";
import { Suspense } from "react";

export default async function ExamsPage() {
  const tests = await getUploadedTests();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Practice Exams
        </h1>
        <p className="text-outline mt-1">
          Upload and take your own DECA practice tests
        </p>
      </div>

      {/* Suspense required for useSearchParams inside ExamsClient */}
      <Suspense>
        <ExamsClient tests={tests} />
      </Suspense>

      <ExamDisclaimer />
    </div>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: Build succeeds.

Run `npm run dev` and open `http://localhost:3000/exams`. Verify:
- "My Uploaded Tests" section shows with empty state and upload link
- "AI-Generated Exams" Coming Soon section renders below it
- Clicking "Upload a Test" navigates to `/exams/upload`

- [ ] **Step 4: Commit**

```bash
git add podium/components/exams/ExamsClient.tsx "podium/app/(app)/exams/page.tsx"
git commit -m "feat: replace exams page with uploaded tests UI"
```

---

## Task 11: SubmitConfirmDialog + Wire Into ExamRunner

**Files:**
- Create: `components/exams/SubmitConfirmDialog.tsx`
- Modify: `components/exams/ExamRunner.tsx`

- [ ] **Step 1: Create SubmitConfirmDialog**

```tsx
"use client";

interface SubmitConfirmDialogProps {
  unansweredCount: number;
  flaggedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SubmitConfirmDialog({
  unansweredCount,
  flaggedCount,
  onConfirm,
  onCancel,
}: SubmitConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-surface-container rounded-2xl w-full max-w-sm p-8 space-y-5">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-2xl text-secondary-ds shrink-0">
            warning
          </span>
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface">
              Submit anyway?
            </h3>
            <div className="mt-2 space-y-1 text-sm text-outline">
              {unansweredCount > 0 && (
                <p>
                  {unansweredCount} question{unansweredCount !== 1 ? "s" : ""} unanswered
                </p>
              )}
              {flaggedCount > 0 && (
                <p>
                  {flaggedCount} question{flaggedCount !== 1 ? "s" : ""} flagged for review
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 gradient-cta rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add import and state to ExamRunner**

At the top of `components/exams/ExamRunner.tsx`, add the import:

```ts
import { SubmitConfirmDialog } from "./SubmitConfirmDialog";
```

Inside the `ExamRunner` component body (alongside the existing `useState` calls), add:

```ts
const [showConfirm, setShowConfirm] = useState(false);
```

- [ ] **Step 3: Add a persistent "Submit Test" button above the question grid**

In the JSX, add this block directly above the `{/* Question Grid */}` comment:

```tsx
{/* Persistent submit — available at any time */}
<div className="flex justify-end">
  <button
    onClick={() => {
      const unanswered = questions.length - Object.keys(answers).length;
      if (unanswered > 0 || flagged.size > 0) {
        setShowConfirm(true);
      } else {
        onSubmit(answers);
      }
    }}
    className="gradient-cta rounded-xl px-5 py-2.5 text-sm font-semibold"
  >
    Submit Test
  </button>
</div>
```

Also update the last-question "Submit Exam" button (in the navigation row) to use the same confirmation flow:

```tsx
<button
  onClick={() => {
    const unanswered = questions.length - Object.keys(answers).length;
    if (unanswered > 0 || flagged.size > 0) {
      setShowConfirm(true);
    } else {
      onSubmit(answers);
    }
  }}
  className="gradient-cta rounded-xl px-5 py-2.5 text-sm font-semibold"
>
  Submit Exam
</button>
```

- [ ] **Step 4: Add the dialog render**

At the very bottom of the returned JSX (inside the outermost `<div className="space-y-6">`), add:

```tsx
{showConfirm && (
  <SubmitConfirmDialog
    unansweredCount={questions.length - Object.keys(answers).length}
    flaggedCount={flagged.size}
    onConfirm={() => { setShowConfirm(false); onSubmit(answers); }}
    onCancel={() => setShowConfirm(false)}
  />
)}
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add podium/components/exams/SubmitConfirmDialog.tsx podium/components/exams/ExamRunner.tsx
git commit -m "feat: add submit confirmation dialog and persistent submit button"
```

---

## Task 12: Exam Runner Page

**Files:**
- Create: `app/(app)/exams/[testId]/page.tsx`

Reads questions from `sessionStorage` (written by `PreTestModal`), reads settings from URL search params, renders `ExamRunner`. On submit, writes results to `sessionStorage` and navigates to results.

- [ ] **Step 1: Create the page**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Suspense } from "react";
import { ExamRunner } from "@/components/exams/ExamRunner";
import type { ExamQuestion } from "@/components/exams/ExamRunner";

function ExamContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);

  const timeLimitParam = searchParams.get("timeLimit");
  const timeLimitMinutes: number | null =
    timeLimitParam === "null" ? null : parseInt(timeLimitParam ?? "90");
  const revealMode = (searchParams.get("revealMode") ?? "end") as "after" | "end";

  useEffect(() => {
    const stored = sessionStorage.getItem(`uploadedQuestions_${testId}`);
    if (!stored) {
      router.replace("/exams");
      return;
    }
    try {
      setQuestions(JSON.parse(stored));
    } catch {
      router.replace("/exams");
    }
  }, [testId, router]);

  function handleSubmit(answers: Record<string, string>) {
    sessionStorage.setItem(
      `examResults_${testId}`,
      JSON.stringify({ answers, questions })
    );
    router.push(`/exams/${testId}/results`);
  }

  if (!questions) {
    return (
      <div className="flex items-center gap-2 text-outline py-12">
        <span className="material-symbols-outlined text-lg animate-spin">
          progress_activity
        </span>
        Loading exam...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight">
          Practice Exam
        </h1>
        <p className="text-xs text-outline mt-1">
          User-uploaded test. Podium does not verify or endorse the content of
          uploaded tests.
        </p>
      </div>
      <ExamRunner
        questions={questions}
        timeLimitMinutes={timeLimitMinutes}
        revealMode={revealMode}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 text-outline py-12">
          <span className="material-symbols-outlined text-lg animate-spin">
            progress_activity
          </span>
          Loading...
        </div>
      }
    >
      <ExamContent />
    </Suspense>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add "podium/app/(app)/exams/[testId]/page.tsx"
git commit -m "feat: add exam runner page for uploaded tests"
```

---

## Task 13: Results Page + End-to-End Verification

**Files:**
- Create: `app/(app)/exams/[testId]/results/page.tsx`

- [ ] **Step 1: Create the results page**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ResultsBreakdown } from "@/components/exams/ResultsBreakdown";
import type { ExamQuestion } from "@/components/exams/ExamRunner";

interface StoredResults {
  answers: Record<string, string>;
  questions: ExamQuestion[];
}

function ResultsContent() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [data, setData] = useState<StoredResults | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`examResults_${testId}`);
    if (!stored) {
      router.replace("/exams");
      return;
    }
    try {
      setData(JSON.parse(stored));
    } catch {
      router.replace("/exams");
    }
  }, [testId, router]);

  if (!data) {
    return (
      <div className="flex items-center gap-2 text-outline py-12">
        <span className="material-symbols-outlined text-lg animate-spin">
          progress_activity
        </span>
        Loading results...
      </div>
    );
  }

  const { answers, questions } = data;
  const score = questions.filter((q) => answers[q.id] === q.correctAnswer).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h1 className="font-headline text-2xl font-bold tracking-tight">Results</h1>
        <p className="text-xs text-outline">
          User-uploaded test. Podium does not verify or endorse the content of
          uploaded tests.
        </p>
      </div>

      <ResultsBreakdown
        questions={questions}
        answers={answers}
        score={score}
        total={questions.length}
        showExplain={false}
      />

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => router.push(`/exams?retake=${testId}`)}
          className="gradient-cta rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          Retake Test
        </button>
        <Link
          href="/exams"
          className="rounded-xl px-5 py-2.5 text-sm font-medium text-outline hover:text-on-surface transition-colors"
        >
          Back to Exams
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 text-outline py-12">
          <span className="material-symbols-outlined text-lg animate-spin">
            progress_activity
          </span>
          Loading...
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
```

- [ ] **Step 2: Final build check**

```bash
npm run build
```

Expected: Build succeeds with zero TypeScript errors and zero compilation errors.

- [ ] **Step 3: End-to-end manual test**

```bash
npm run dev
```

Work through the complete flow:

1. Open `http://localhost:3000/exams` — verify "My Uploaded Tests" empty state and "AI-Generated Exams" Coming Soon section
2. Click "Upload a Test" → `/exams/upload` — verify form renders correctly
3. Upload a text-based DECA practice test PDF with an answer key; enter a test name; click "Upload & Save Test"
4. Verify redirect to `/exams` and the new test card appears
5. Click the test card → `PreTestModal` opens with question count shown
6. Set time limit to 10 minutes, select "Reveal after each question", click "Start Test"
7. Answer a question — verify correct/incorrect highlight appears immediately
8. Flag a question using the flag button
9. Click the persistent "Submit Test" button — verify confirm dialog lists the flagged question
10. Confirm — verify results page shows score, percentage, and per-question breakdown without Explain buttons
11. Click "Retake Test" — verify navigates to `/exams?retake={testId}` and modal auto-opens
12. Close modal; verify no errors in console

- [ ] **Step 4: Commit**

```bash
git add "podium/app/(app)/exams/[testId]/results/page.tsx"
git commit -m "feat: add results page for uploaded tests"
```

---

## Known Considerations

- **`pdf-parse` in Next.js**: Uses `require('pdf-parse/lib/pdf-parse.js')` to bypass the library's internal test-file resolution, which fails in Next.js's module system. If this breaks on a future version of `pdf-parse`, fall back to `require('pdf-parse')`.
- **No Firestore composite index needed**: `getUploadedTests()` uses a single equality filter (`userId`) with client-side sort, avoiding the need for a composite index in Firebase Console.
- **`sessionStorage` and SSR**: All pages reading from `sessionStorage` are Client Components wrapped in `<Suspense>` with `useEffect` guards. The brief loading state during hydration is intentional.
- **5 MB file size cap**: Enforced client-side in `UploadZone` before any network request, keeping the Route Handler's request body well within Vercel's serverless function limits.
- **PDF parser limitations**: The regex-based parser handles standard DECA practice test formats (numbered questions, A/B/C/D options, answer key section). Scanned PDFs (image-only) and non-standard layouts will hit the hard-fail error message.
