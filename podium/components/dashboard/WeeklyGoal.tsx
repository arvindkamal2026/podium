export function WeeklyGoal({ sessions, goal }: { sessions: number; goal: number }) {
  const pct = Math.min((sessions / goal) * 100, 100);

  return (
    <div className="bg-surface-container-low rounded-2xl p-8">
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-2">
        Weekly Sessions
      </p>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-headline text-3xl font-bold text-on-surface">{sessions}</span>
        <span className="text-sm text-outline">/ {goal}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden">
        <div className="h-full rounded-full progress-gradient transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
