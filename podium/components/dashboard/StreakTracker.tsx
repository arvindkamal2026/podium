export function StreakTracker({ streak, longestStreak }: { streak: number; longestStreak: number }) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-8">
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-2">
        Current Streak
      </p>
      <div className="flex items-baseline gap-2">
        <span className="font-headline text-5xl font-extrabold text-secondary-ds">{streak}</span>
        <span className="text-sm text-outline">days</span>
      </div>
      <p className="text-sm text-outline mt-2">
        longest: {longestStreak} days
      </p>
    </div>
  );
}
