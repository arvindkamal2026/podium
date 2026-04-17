import Link from "next/link";

const ACTIONS = [
  { href: "/exams", icon: "quiz", title: "Practice Exam", desc: "Take a timed practice exam" },
  { href: "/roleplay", icon: "record_voice_over", title: "Role Play", desc: "Practice with AI judge scoring" },
  { href: "/vocab", icon: "style", title: "Flashcards", desc: "Study key terms for your event" },
];

export function QuickActions() {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
        Quick Actions
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group bg-surface-container-low rounded-2xl p-6 transition-all duration-200 hover:bg-surface-container border-l-[3px] border-l-transparent hover:border-l-primary"
          >
            <span className="material-symbols-outlined text-2xl text-primary mb-3 block">
              {a.icon}
            </span>
            <p className="font-headline font-semibold text-on-surface mb-1">{a.title}</p>
            <p className="text-sm text-outline">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
