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
    piId: "", // Uploaded tests don't have PI associations
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
            type="button"
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors"
            aria-label="Close"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Loading */}
        {!questions && !fetchError && (
          <div className="flex items-center gap-2 text-sm text-outline py-4">
            <span aria-hidden="true" className="material-symbols-outlined text-lg animate-spin">
              progress_activity
            </span>
            Loading questions...
          </div>
        )}

        {/* Fetch error */}
        {fetchError && (
          <p role="alert" className="text-sm text-error">{fetchError}</p>
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
                      Math.min(180, Math.max(10, parseInt(e.target.value, 10) || 10))
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
              type="button"
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
