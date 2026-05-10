"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
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
        <span aria-hidden="true" className="material-symbols-outlined text-lg animate-spin">
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
          type="button"
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
          <span aria-hidden="true" className="material-symbols-outlined text-lg animate-spin">
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
