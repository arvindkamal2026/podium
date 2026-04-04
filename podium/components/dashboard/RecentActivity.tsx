interface Activity {
  id: string;
  type: "exam" | "roleplay" | "vocab" | "pi";
  label: string;
  score?: number;
  date: string;
}

const TYPE_COLORS: Record<string, string> = {
  exam: "bg-primary",
  roleplay: "bg-tertiary",
  vocab: "bg-secondary-ds",
  pi: "bg-on-surface-variant",
};

export function RecentActivity({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
          Recent Activity
        </p>
        <div className="bg-surface-container-low rounded-2xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-outline mb-2 block">history</span>
          <p className="text-sm text-outline">No activity yet. Start practicing!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
        Recent Activity
      </p>
      <div className="bg-surface-container-low rounded-2xl overflow-hidden">
        {activities.map((a) => (
          <div key={a.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-surface-container transition-colors">
            <div className={`w-2 h-2 rounded-full ${TYPE_COLORS[a.type] || "bg-outline"}`} />
            <span className="text-sm text-on-surface flex-1">{a.label}</span>
            {a.score !== undefined && (
              <span className="text-sm font-semibold text-on-surface-variant">{a.score}%</span>
            )}
            <span className="text-xs text-outline">{new Date(a.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
