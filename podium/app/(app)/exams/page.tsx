"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDocument } from "@/lib/hooks/useFirestore";
import { PERFORMANCE_INDICATORS } from "@/data/performance-indicators";
import { DECA_EVENTS } from "@/data/events";
import { ExamRunner, type ExamQuestion } from "@/components/exams/ExamRunner";
import { ResultsBreakdown } from "@/components/exams/ResultsBreakdown";
import { ExamDisclaimer } from "@/components/legal/ExamDisclaimer";
import { submitExamResult } from "@/lib/actions/exams";

interface UserProfile {
  eventId: string;
}

// Generate sample questions from PIs (placeholder until AI generates real questions)
function generateSampleQuestions(eventId: string): ExamQuestion[] {
  const pis = PERFORMANCE_INDICATORS.filter((pi) => pi.eventId === eventId);
  return pis.map((pi, i) => ({
    id: `q-${i}`,
    question: `Which of the following best describes: "${pi.text}"?`,
    optionA:
      "A comprehensive understanding of the foundational concepts and their practical applications in business settings",
    optionB:
      "The ability to analyze and evaluate complex scenarios using industry-specific frameworks",
    optionC:
      "Knowledge of regulatory requirements and compliance standards in the field",
    optionD:
      "Understanding market dynamics and their impact on strategic decision-making",
    correctAnswer: (["A", "B", "C", "D"] as const)[i % 4],
    piId: pi.id,
  }));
}

type ExamState = "setup" | "running" | "results";

export default function ExamsPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, loading: profileLoading } =
    useDocument<UserProfile>(user ? `users/${user.uid}` : null);
  const [state, setState] = useState<ExamState>("setup");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);

  const handleStart = useCallback(() => {
    if (!profile) return;
    const qs = generateSampleQuestions(profile.eventId);
    if (qs.length === 0) return;
    setQuestions(qs);
    setAnswers({});
    setScore(0);
    setState("running");
  }, [profile]);

  const handleSubmit = useCallback(
    async (ans: Record<string, string>) => {
      const correct = questions.filter(
        (q) => ans[q.id] === q.correctAnswer
      ).length;
      setAnswers(ans);
      setScore(correct);
      setState("results");

      if (profile) {
        const piResults = questions.map((q) => ({
          piId: q.piId,
          correct: ans[q.id] === q.correctAnswer,
        }));
        await submitExamResult({
          eventId: profile.eventId,
          score: correct,
          total: questions.length,
          answers: ans,
          piResults,
        });
      }
    },
    [questions, profile]
  );

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-outline animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  const event = DECA_EVENTS.find((e) => e.id === profile?.eventId);
  const availablePIs = PERFORMANCE_INDICATORS.filter(
    (pi) => pi.eventId === profile?.eventId
  );

  if (state === "running") {
    return (
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Practice Exam
        </h1>
        <ExamRunner
          questions={questions}
          timeLimitMinutes={90}
          onSubmit={handleSubmit}
        />
        <ExamDisclaimer />
      </div>
    );
  }

  if (state === "results") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Exam Results
          </h1>
          <button
            onClick={() => setState("setup")}
            className="text-sm text-primary hover:underline"
          >
            ← Back to Exams
          </button>
        </div>
        <ResultsBreakdown
          questions={questions}
          answers={answers}
          score={score}
          total={questions.length}
        />
        <ExamDisclaimer />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Practice Exams
        </h1>
        <p className="text-outline mt-1">{event?.name || "Select an event"}</p>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-3xl text-primary">
            quiz
          </span>
          <div>
            <p className="font-headline font-semibold text-on-surface">
              {event?.code} Practice Exam
            </p>
            <p className="text-sm text-outline">
              {availablePIs.length} questions · 90 minutes · ICDC difficulty
            </p>
          </div>
        </div>

        {availablePIs.length > 0 ? (
          <button
            onClick={handleStart}
            className="gradient-cta rounded-xl px-6 py-3 text-sm font-semibold"
          >
            Start Exam
          </button>
        ) : (
          <p className="text-sm text-outline">
            No practice questions available for this event yet.
          </p>
        )}
      </div>

      <ExamDisclaimer />
    </div>
  );
}
