"use client";

import { ExamDisclaimer } from "@/components/legal/ExamDisclaimer";

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Practice Exams
        </h1>
        <p className="text-outline mt-1">AI-generated questions at ICDC difficulty</p>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-outline">
            quiz
          </span>
        </div>
        <div>
          <p className="font-headline text-xl font-semibold text-on-surface mb-2">
            Coming Soon
          </p>
          <p className="text-sm text-outline max-w-sm">
            Practice exams with AI-generated questions and per-PI breakdowns are on the way. Check back soon.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary-ds/15 text-secondary-ds">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-ds animate-pulse" />
          In Development
        </span>
      </div>

      <ExamDisclaimer />
    </div>
  );
}
