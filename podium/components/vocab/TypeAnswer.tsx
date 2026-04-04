"use client";
import { useState } from "react";

interface TypeAnswerProps {
  term: string;
  definition: string;
  onResult: (correct: boolean) => void;
}

function fuzzyMatch(input: string, target: string): boolean {
  const a = input.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  if (a === b) return true;
  // Check if input contains most key words from definition
  const words = b.split(/\s+/).filter((w) => w.length > 4);
  const matched = words.filter((w) => a.includes(w));
  return matched.length >= Math.ceil(words.length * 0.4);
}

export function TypeAnswer({ term, definition, onResult }: TypeAnswerProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function handleSubmit() {
    if (!answer.trim()) return;
    const correct = fuzzyMatch(answer, definition);
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => {
      onResult(correct);
      setAnswer("");
      setSubmitted(false);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-low rounded-2xl p-8 text-center">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
          Define this term
        </p>
        <p className="font-headline text-2xl font-bold text-on-surface">{term}</p>
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your definition..."
        disabled={submitted}
        className="w-full h-32 bg-surface-container-low rounded-2xl p-6 text-sm text-on-surface placeholder:text-outline resize-none focus:outline-none focus:ring-1 focus:ring-primary/30"
      />

      {submitted && (
        <div
          className={`rounded-xl p-4 ${isCorrect ? "bg-tertiary/10" : "bg-error/10"}`}
        >
          <p
            className={`text-sm font-semibold mb-1 ${
              isCorrect ? "text-tertiary" : "text-error"
            }`}
          >
            {isCorrect ? "Correct!" : "Not quite"}
          </p>
          <p className="text-sm text-on-surface-variant">{definition}</p>
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className="gradient-cta rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50"
        >
          Check Answer
        </button>
      )}
    </div>
  );
}
