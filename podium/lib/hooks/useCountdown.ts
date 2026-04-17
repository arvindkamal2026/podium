"use client";
import { useEffect, useState } from "react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function useCountdown(targetDate: string | null): CountdownResult {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };

  // Parse as local midnight (avoid UTC offset shifting the date by a day)
  const target = new Date(targetDate + "T00:00:00");
  const diff = target.getTime() - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };

  // Calendar days: midnight-to-midnight so "tomorrow" always shows 1
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);
  const calendarDays = Math.round(
    (target.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    days: calendarDays,
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: false,
  };
}
