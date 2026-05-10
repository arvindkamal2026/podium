"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
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
    timeLimitParam === "null" ? null : parseInt(timeLimitParam ?? "90", 10);
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
        <span aria-hidden="true" className="material-symbols-outlined text-lg animate-spin">
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
          <span aria-hidden="true" className="material-symbols-outlined text-lg animate-spin">
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
