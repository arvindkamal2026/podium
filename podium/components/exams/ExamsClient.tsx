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
            <span aria-hidden="true" className="material-symbols-outlined text-lg">upload</span>
            Upload a Test
          </Link>
        </div>

        {tests.length === 0 ? (
          <div className="bg-surface-container-low rounded-2xl p-12 flex flex-col items-center gap-4 text-center">
            <span aria-hidden="true" className="material-symbols-outlined text-4xl text-outline">
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
          <span aria-hidden="true" className="material-symbols-outlined text-3xl text-outline">
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
