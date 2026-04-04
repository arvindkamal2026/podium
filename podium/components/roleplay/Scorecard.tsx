interface PIScore {
  piId: string;
  piText: string;
  score: number;
  feedback: string;
}

interface ScorecardProps {
  scores: PIScore[];
  overallScore: number;
  strengths: string[];
  improvements: string[];
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-lg ${i < count ? "text-secondary-ds" : "text-surface-container-highest"}`}
          style={{
            fontVariationSettings: i < count ? '"FILL" 1' : '"FILL" 0',
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export function Scorecard({
  scores,
  overallScore,
  strengths,
  improvements,
}: ScorecardProps) {
  const scoreColor =
    overallScore >= 4
      ? "text-tertiary"
      : overallScore >= 3
        ? "text-secondary-ds"
        : "text-error";

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-surface-container-low rounded-2xl p-8 text-center">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-2">
          Overall Score
        </p>
        <p className={`font-headline text-6xl font-extrabold ${scoreColor}`}>
          {overallScore.toFixed(1)}
        </p>
        <p className="text-sm text-outline mt-1">out of 5.0</p>
      </div>

      {/* Per-PI Scores */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
          Performance Indicator Scores
        </p>
        <div className="space-y-3">
          {scores.map((s) => (
            <div key={s.piId} className="bg-surface-container-low rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="text-sm text-on-surface flex-1">{s.piText}</p>
                <Stars count={s.score} />
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {s.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-tertiary">
              thumb_up
            </span>
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">
              Strengths
            </p>
          </div>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li
                key={i}
                className="text-sm text-on-surface-variant flex items-start gap-2"
              >
                <span className="text-tertiary mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-secondary-ds">
              trending_up
            </span>
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">
              Areas for Improvement
            </p>
          </div>
          <ul className="space-y-2">
            {improvements.map((s, i) => (
              <li
                key={i}
                className="text-sm text-on-surface-variant flex items-start gap-2"
              >
                <span className="text-secondary-ds mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
