"use client";
import { useCountdown } from "@/lib/hooks/useCountdown";

export function CountdownTimer({ targetDate }: { targetDate: string | null }) {
  const { days, hours, minutes, isPast } = useCountdown(targetDate);

  if (isPast || !targetDate) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-8">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-2">
          Competition Countdown
        </p>
        <p className="font-headline text-5xl font-bold gradient-text">
          Game Day!
        </p>
        <p className="text-sm text-outline mt-2">Your competition date has arrived or hasn&apos;t been set.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-2xl p-8">
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-2">
        Competition Countdown
      </p>
      <div className="flex items-baseline gap-3">
        <span className="font-headline text-[96px] font-extrabold leading-none gradient-text">
          {days}
        </span>
        <span className="text-xl text-on-surface-variant font-medium">
          days
        </span>
      </div>
      <p className="text-sm text-outline mt-2">
        {hours}h {minutes}m remaining &middot; {new Date(targetDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}
