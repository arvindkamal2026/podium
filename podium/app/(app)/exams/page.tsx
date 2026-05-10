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
