const STATUS_CONFIG = {
  mastered: { color: "bg-tertiary", textColor: "text-on-tertiary", label: "Mastered" },
  learning: { color: "bg-secondary-ds", textColor: "text-on-secondary", label: "Learning" },
  untested: { color: "bg-error", textColor: "text-on-error", label: "Untested" },
};

export function MasteryBadge({ status }: { status: "mastered" | "learning" | "untested" }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.textColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
      {config.label}
    </span>
  );
}
