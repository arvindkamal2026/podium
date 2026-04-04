import { MasteryBadge } from "./MasteryBadge";

interface PICardProps {
  code: string;
  text: string;
  category: string;
  difficulty: "high" | "medium" | "low";
  status: "mastered" | "learning" | "untested";
  timesTested: number;
  timesCorrect: number;
  lastTested: string | null;
}

const DIFFICULTY_COLORS = {
  high: "text-error",
  medium: "text-secondary-ds",
  low: "text-tertiary",
};

export function PICard({
  code,
  text,
  category,
  difficulty,
  status,
  timesTested,
  timesCorrect,
  lastTested,
}: PICardProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-6 hover:bg-surface-container transition-all duration-200 border-l-[3px] border-l-transparent hover:border-l-primary">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono text-outline">{code}</span>
            <span className="text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
              {category}
            </span>
            <span className={`text-xs font-medium ${DIFFICULTY_COLORS[difficulty]}`}>{difficulty}</span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed">{text}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-outline flex-wrap">
            <span>Tested {timesTested}x</span>
            <span>Correct {timesCorrect}x</span>
            {lastTested && <span>Last: {new Date(lastTested).toLocaleDateString()}</span>}
          </div>
        </div>
        <MasteryBadge status={status} />
      </div>
    </div>
  );
}
