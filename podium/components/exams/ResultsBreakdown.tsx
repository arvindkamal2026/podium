"use client";
import { QuestionCard } from "./QuestionCard";
import { ExplainButton } from "./ExplainButton";
import type { ExamQuestion } from "./ExamRunner";

interface ResultsBreakdownProps {
  questions: ExamQuestion[];
  answers: Record<string, string>;
  score: number;
  total: number;
}

export function ResultsBreakdown({
  questions,
  answers,
  score,
  total,
}: ResultsBreakdownProps) {
  const pct = Math.round((score / total) * 100);

  return (
    <div className="space-y-8">
      {/* Score Header */}
      <div className="bg-surface-container-low rounded-2xl p-8 text-center">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-2">
          Your Score
        </p>
        <p
          className={`font-headline text-6xl font-extrabold ${
            pct >= 70
              ? "text-tertiary"
              : pct >= 50
                ? "text-secondary-ds"
                : "text-error"
          }`}
        >
          {pct}%
        </p>
        <p className="text-sm text-outline mt-2">
          {score} of {total} correct
        </p>
      </div>

      {/* Review Questions */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
          Review Answers
        </p>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id] || "";
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div
                key={q.id}
                className={`bg-surface-container-low rounded-2xl p-6 border-l-[3px] ${
                  isCorrect ? "border-l-tertiary" : "border-l-error"
                }`}
              >
                <QuestionCard
                  index={i}
                  question={q.question}
                  options={[
                    { key: "A", text: q.optionA },
                    { key: "B", text: q.optionB },
                    { key: "C", text: q.optionC },
                    { key: "D", text: q.optionD },
                  ]}
                  selectedAnswer={userAnswer}
                  correctAnswer={q.correctAnswer}
                  showResult={true}
                  onSelect={() => {}}
                />
                {!isCorrect && (
                  <ExplainButton
                    question={q.question}
                    optionA={q.optionA}
                    optionB={q.optionB}
                    optionC={q.optionC}
                    optionD={q.optionD}
                    correctAnswer={q.correctAnswer}
                    studentAnswer={userAnswer}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
