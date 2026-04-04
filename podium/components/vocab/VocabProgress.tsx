interface VocabProgressProps {
  mastered: number;
  learning: number;
  total: number;
}

export function VocabProgress({ mastered, learning, total }: VocabProgressProps) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
  return (
    <div className="bg-surface-container-low rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">
          Vocab Progress
        </p>
        <p className="text-sm text-on-surface font-semibold">{pct}% mastered</p>
      </div>
      <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden flex">
        {mastered > 0 && (
          <div
            className="h-full bg-tertiary"
            style={{ width: `${(mastered / total) * 100}%` }}
          />
        )}
        {learning > 0 && (
          <div
            className="h-full bg-secondary-ds"
            style={{ width: `${(learning / total) * 100}%` }}
          />
        )}
      </div>
      <div className="flex gap-4 mt-3 text-xs">
        <span className="text-tertiary">{mastered} mastered</span>
        <span className="text-secondary-ds">{learning} learning</span>
        <span className="text-error">{total - mastered - learning} untested</span>
      </div>
    </div>
  );
}
