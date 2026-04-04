"use client";
import { useState, useEffect, useCallback } from "react";
import { QuestionCard } from "./QuestionCard";

export interface ExamQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  piId: string;
  explanation?: string;
}

interface ExamRunnerProps {
  questions: ExamQuestion[];
  timeLimitMinutes: number;
  onSubmit: (answers: Record<string, string>) => void;
}

export function ExamRunner({
  questions,
  timeLimitMinutes,
  onSubmit,
}: ExamRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (secondsLeft <= 0) {
      onSubmit(answers);
      return;
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, answers, onSubmit]);

  const hours = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  const current = questions[currentIndex];
  const answered = Object.keys(answers).length;

  const toggleFlag = useCallback(() => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(current.id)) next.delete(current.id);
      else next.add(current.id);
      return next;
    });
  }, [current?.id]);

  return (
    <div className="space-y-6">
      {/* Timer + Progress */}
      <div className="flex items-center justify-between bg-surface-container-low rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-outline">
            timer
          </span>
          <span
            className={`font-mono text-lg ${
              secondsLeft < 300 ? "text-error" : "text-on-surface"
            }`}
          >
            {hours > 0 ? `${hours}:` : ""}
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>
        <span className="text-sm text-outline">
          {answered}/{questions.length} answered
        </span>
      </div>

      {/* Question */}
      {current && (
        <div className="bg-surface-container-low rounded-2xl p-8">
          <QuestionCard
            index={currentIndex}
            question={current.question}
            options={[
              { key: "A", text: current.optionA },
              { key: "B", text: current.optionB },
              { key: "C", text: current.optionC },
              { key: "D", text: current.optionD },
            ]}
            selectedAnswer={answers[current.id] || null}
            showResult={false}
            onSelect={(key) =>
              setAnswers((prev) => ({ ...prev, [current.id]: key }))
            }
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 text-sm text-outline hover:text-on-surface disabled:opacity-30 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
          Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFlag}
            className={`flex items-center gap-1 text-sm transition-colors ${
              flagged.has(current?.id)
                ? "text-secondary-ds"
                : "text-outline hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {flagged.has(current?.id) ? "flag" : "outlined_flag"}
            </span>
            Flag
          </button>
        </div>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
            }
            className="flex items-center gap-1 text-sm text-outline hover:text-on-surface transition-colors"
          >
            Next
            <span className="material-symbols-outlined text-lg">
              chevron_right
            </span>
          </button>
        ) : (
          <button
            onClick={() => onSubmit(answers)}
            className="gradient-cta rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            Submit Exam
          </button>
        )}
      </div>

      {/* Question Grid */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className={`w-8 h-8 rounded text-xs font-mono transition-colors ${
              i === currentIndex
                ? "bg-primary text-on-primary"
                : answers[q.id]
                  ? "bg-tertiary/20 text-tertiary"
                  : flagged.has(q.id)
                    ? "bg-secondary-ds/20 text-secondary-ds"
                    : "bg-surface-container text-outline hover:bg-surface-container-high"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
