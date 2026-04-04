interface MasterySummaryBarProps {
  total: number;
  mastered: number;
  learning: number;
  untested: number;
}

export function MasterySummaryBar({ total, mastered, learning, untested }: MasterySummaryBarProps) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div className="bg-surface-container-low rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">PI Progress</p>
          <p className="font-headline text-2xl font-bold text-on-surface mt-1">{pct}% Mastered</p>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <p className="font-bold text-tertiary">{mastered}</p>
            <p className="text-xs text-outline">Mastered</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-secondary-ds">{learning}</p>
            <p className="text-xs text-outline">Learning</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-error">{untested}</p>
            <p className="text-xs text-outline">Untested</p>
          </div>
        </div>
      </div>
      <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden flex">
        {mastered > 0 && (
          <div className="h-full bg-tertiary" style={{ width: `${(mastered / total) * 100}%` }} />
        )}
        {learning > 0 && (
          <div className="h-full bg-secondary-ds" style={{ width: `${(learning / total) * 100}%` }} />
        )}
      </div>
    </div>
  );
}
