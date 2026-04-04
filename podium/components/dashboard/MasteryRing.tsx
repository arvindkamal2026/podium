"use client";

interface MasteryRingProps {
  mastered: number;
  learning: number;
  total: number;
}

export function MasteryRing({ mastered, learning, total }: MasteryRingProps) {
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const masteredPct = total > 0 ? mastered / total : 0;
  const learningPct = total > 0 ? learning / total : 0;

  const masteredOffset = circumference * (1 - masteredPct);
  const learningStart = masteredPct;
  const learningOffset = circumference * (1 - learningPct);

  const overallPct = total > 0 ? Math.round(((mastered + learning) / total) * 100) : 0;

  return (
    <div className="bg-surface-container-low rounded-2xl p-8 flex flex-col items-center">
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
        PI Mastery
      </p>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--color-surface-container-highest)" strokeWidth={strokeWidth} />
          {/* Mastered arc */}
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--color-tertiary)" strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={masteredOffset} strokeLinecap="round" />
          {/* Learning arc */}
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--color-secondary-ds)" strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={learningOffset}
            style={{ transform: `rotate(${learningStart * 360}deg)`, transformOrigin: "center" }}
            strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline text-3xl font-bold text-on-surface">{overallPct}%</span>
        </div>
      </div>
      <div className="flex gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-tertiary" />
          <span className="text-outline">Mastered ({mastered})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-secondary-ds" />
          <span className="text-outline">Learning ({learning})</span>
        </div>
      </div>
    </div>
  );
}
