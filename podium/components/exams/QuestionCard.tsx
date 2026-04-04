"use client";

interface QuestionCardProps {
  index: number;
  question: string;
  options: { key: string; text: string }[];
  selectedAnswer: string | null;
  correctAnswer?: string;
  showResult: boolean;
  onSelect: (key: string) => void;
}

export function QuestionCard({
  index,
  question,
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-on-surface leading-relaxed">
        <span className="font-mono text-outline mr-2">Q{index + 1}.</span>
        {question}
      </p>
      <div className="space-y-2">
        {options.map((opt) => {
          let classes =
            "bg-surface-container-low rounded-xl px-5 py-3 text-sm cursor-pointer transition-all duration-200 flex items-center gap-3 w-full text-left";

          if (showResult && opt.key === correctAnswer) {
            classes += " !bg-tertiary/10 text-tertiary border-l-[3px] border-l-tertiary";
          } else if (
            showResult &&
            opt.key === selectedAnswer &&
            opt.key !== correctAnswer
          ) {
            classes += " !bg-error/10 text-error border-l-[3px] border-l-error";
          } else if (opt.key === selectedAnswer) {
            classes +=
              " !bg-primary/[0.08] text-primary border-l-[3px] border-l-primary";
          } else {
            classes +=
              " text-on-surface hover:bg-surface-container border-l-[3px] border-l-transparent";
          }

          return (
            <button
              key={opt.key}
              onClick={() => !showResult && onSelect(opt.key)}
              disabled={showResult}
              className={classes}
            >
              <span className="font-mono text-xs w-6 shrink-0">{opt.key})</span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
