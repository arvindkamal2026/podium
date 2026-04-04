import Link from "next/link";

interface EventCardProps {
  id: string;
  name: string;
  code: string;
  cluster: string;
  category: string;
  participants: string;
  hasExam: boolean;
  isUserEvent: boolean;
}

const CLUSTER_COLORS: Record<string, string> = {
  finance: "bg-primary",
  marketing: "bg-secondary-ds",
  "business-mgmt": "bg-on-surface-variant",
  hospitality: "bg-tertiary",
  entrepreneurship: "bg-primary-container",
  "personal-finance": "bg-error",
};

export function EventCard({
  id,
  name,
  code,
  cluster,
  category,
  participants,
  hasExam,
  isUserEvent,
}: EventCardProps) {
  return (
    <Link
      href={`/events/${id}`}
      className={`group block rounded-2xl p-6 transition-all duration-200 border-l-[3px] ${
        isUserEvent
          ? "bg-primary/[0.06] border-l-primary"
          : "bg-surface-container-low border-l-transparent hover:bg-surface-container hover:border-l-primary"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${CLUSTER_COLORS[cluster] || "bg-outline"}`} />
        <span className="text-xs font-mono text-outline">{code}</span>
        {isUserEvent && (
          <span className="text-[10px] font-semibold tracking-wider uppercase gradient-cta px-2 py-0.5 rounded-full">
            Your Event
          </span>
        )}
      </div>
      <p className="font-headline font-semibold text-on-surface text-sm leading-snug mb-3">{name}</p>
      <div className="flex items-center gap-3 text-xs text-outline flex-wrap">
        <span>{category}</span>
        <span>·</span>
        <span>
          {participants} participant{participants !== "1" ? "s" : ""}
        </span>
        {hasExam && (
          <>
            <span>·</span>
            <span className="text-primary">Has Exam</span>
          </>
        )}
      </div>
    </Link>
  );
}
