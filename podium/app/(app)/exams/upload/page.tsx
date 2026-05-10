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
