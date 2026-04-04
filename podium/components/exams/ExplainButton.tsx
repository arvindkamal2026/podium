"use client";
import { useState } from "react";

interface ExplainButtonProps {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  studentAnswer: string;
}

export function ExplainButton(props: ExplainButtonProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleExplain() {
    if (explanation) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });
      const data = await res.json();
      setExplanation(data.explanation ?? "Failed to generate explanation. Please try again.");
    } catch {
      setExplanation("Failed to generate explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      {!explanation && (
        <button
          onClick={handleExplain}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-container transition-colors disabled:opacity-50"
        >
          <span
            className={`material-symbols-outlined text-lg${loading ? " animate-spin" : ""}`}
          >
            {loading ? "progress_activity" : "lightbulb"}
          </span>
          {loading ? "Explaining..." : "AI Explain"}
        </button>
      )}
      {explanation && (
        <div className="bg-surface-container rounded-xl p-4 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm text-primary">
              lightbulb
            </span>
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">
              AI Explanation
            </span>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
