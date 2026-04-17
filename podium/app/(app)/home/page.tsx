"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useDocument } from "@/lib/hooks/useFirestore";
import { CountdownTimer } from "@/components/dashboard/CountdownTimer";
import { MasteryRing } from "@/components/dashboard/MasteryRing";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { WeeklyGoal } from "@/components/dashboard/WeeklyGoal";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

interface UserProfile {
  firstName: string;
  lastName: string;
  cluster: string;
  eventId: string;
  competitionDate: string;
  competitionLevel: string;
  streak: number;
  longestStreak: number;
  weeklySessionCount: number;
  totalSessions: number;
  piMastered: number;
  piTotal: number;
  vocabMastered: number;
  vocabTotal: number;
  examsTaken: number;
  avgExamScore: number;
  rolePlayCount: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, loading: profileLoading } = useDocument<UserProfile>(
    user ? `users/${user.uid}` : null
  );

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-outline animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-outline">Profile not found. Please complete onboarding.</p>
      </div>
    );
  }

  const totalMasteryItems = profile.piTotal + profile.vocabTotal;
  const masteredItems = profile.piMastered + profile.vocabMastered;
  const learningItems = totalMasteryItems - masteredItems;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome back, {profile.firstName}
        </h1>
        <p className="text-outline mt-1">
          {profile.eventId.toUpperCase()} &middot; {profile.competitionLevel.toUpperCase()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CountdownTimer targetDate={profile.competitionDate} />
        <MasteryRing mastered={masteredItems} learning={learningItems} total={totalMasteryItems || 1} />
        <div className="space-y-6">
          <StreakTracker streak={profile.streak} longestStreak={profile.longestStreak} />
          <WeeklyGoal sessions={profile.weeklySessionCount} goal={5} />
        </div>
      </div>

      <QuickActions />

      <RecentActivity activities={[]} />
    </div>
  );
}
