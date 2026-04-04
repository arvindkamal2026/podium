"use client";
import { useState, useEffect, useRef } from "react";

interface ResponseEditorProps {
  onSubmit: (response: string) => void;
  timeLimitMinutes: number;
}

export function ResponseEditor({
  onSubmit,
  timeLimitMinutes,
}: ResponseEditorProps) {
  const [response, setResponse] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);
  const submitted = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!submitted.current) {
        submitted.current = true;
        onSubmit(response);
      }
      return;
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, response, onSubmit]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  function handleSubmit() {
    if (!submitted.current) {
      submitted.current = true;
      onSubmit(response);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">
          Your Response
        </p>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-outline">
            timer
          </span>
          <span
            className={`font-mono text-sm ${secondsLeft < 120 ? "text-error" : "text-on-surface"}`}
          >
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>
      </div>

      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Type your response to the judge here. Address the scenario, demonstrate your knowledge of the relevant Performance Indicators, and present a professional solution..."
        className="w-full h-64 bg-surface-container-low rounded-2xl p-6 text-sm text-on-surface placeholder:text-outline resize-none focus:outline-none focus:ring-1 focus:ring-primary/30"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-outline">{response.length} characters</span>
        <button
          onClick={handleSubmit}
          disabled={response.trim().length < 50}
          className="gradient-cta rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Response
        </button>
      </div>
    </div>
  );
}
