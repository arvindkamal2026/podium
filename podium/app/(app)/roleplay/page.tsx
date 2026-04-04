"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDocument } from "@/lib/hooks/useFirestore";
import { DECA_EVENTS } from "@/data/events";
import { PERFORMANCE_INDICATORS } from "@/data/performance-indicators";
import { ScenarioDisplay } from "@/components/roleplay/ScenarioDisplay";
import { ResponseEditor } from "@/components/roleplay/ResponseEditor";
import { Scorecard } from "@/components/roleplay/Scorecard";
import { RolePlayDisclaimer } from "@/components/legal/RolePlayDisclaimer";
import { submitRoleplayResult } from "@/lib/actions/roleplay";

interface UserProfile {
  eventId: string;
}

// Placeholder scenarios (will be AI-generated via admin routes later)
function getSampleScenario(eventId: string) {
  const event = DECA_EVENTS.find((e) => e.id === eventId);
  const pis = PERFORMANCE_INDICATORS.filter(
    (pi) => pi.eventId === eventId
  ).slice(0, 3);

  return {
    title: `${event?.name || "DECA"} Business Scenario`,
    businessContext: `You are meeting with the owner of a mid-size company in the ${event?.cluster?.replace("-", " ") || "business"} sector. The company has been experiencing declining customer satisfaction scores and needs a strategic plan to improve their market position. Annual revenue is $2.4M with a 12% year-over-year decline.`,
    role: `You are a ${event?.cluster === "finance" ? "financial consultant" : event?.cluster === "marketing" ? "marketing specialist" : "business consultant"} hired to analyze the situation and present recommendations.`,
    task: `Present a comprehensive plan addressing the company's challenges. Your recommendations should demonstrate knowledge of ${pis.map((p) => p.text.toLowerCase()).join(", ") || "relevant business concepts"}. You have ${event?.interviewTimeMins || 15} minutes.`,
    piIds: pis.map((p) => p.id),
  };
}

type RolePlayState = "setup" | "responding" | "scoring" | "results";

interface ScoringResult {
  scores: { piId: string; piText: string; score: number; feedback: string }[];
  overallScore: number;
  strengths: string[];
  improvements: string[];
}

export default function RolePlayPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, loading: profileLoading } =
    useDocument<UserProfile>(user ? `users/${user.uid}` : null);
  const [state, setState] = useState<RolePlayState>("setup");
  const [scenario, setScenario] = useState<ReturnType<
    typeof getSampleScenario
  > | null>(null);
  const [result, setResult] = useState<ScoringResult | null>(null);

  const event = DECA_EVENTS.find((e) => e.id === profile?.eventId);

  const handleStart = useCallback(() => {
    if (!profile) return;
    const s = getSampleScenario(profile.eventId);
    setScenario(s);
    setResult(null);
    setState("responding");
  }, [profile]);

  const handleSubmit = useCallback(
    async (response: string) => {
      if (!scenario || !event || !profile) return;
      setState("scoring");

      const pis = PERFORMANCE_INDICATORS.filter((pi) =>
        scenario.piIds.includes(pi.id)
      );
      const piListText = pis
        .map((p) => `- ${p.code}: ${p.text}`)
        .join("\n");

      try {
        const res = await fetch("/api/ai/roleplay-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: event.name,
            scenario: `${scenario.title}\n${scenario.businessContext}\n${scenario.task}`,
            piList: piListText,
            response,
          }),
        });

        const scoring: ScoringResult = await res.json();
        setResult(scoring);
        setState("results");

        // Save result
        await submitRoleplayResult({
          eventId: profile.eventId,
          scenarioTitle: scenario.title,
          overallScore: scoring.overallScore,
          piScores: scoring.scores.map((s) => ({
            piId: s.piId,
            score: s.score,
          })),
          response,
        });
      } catch {
        // Fallback if AI fails
        setResult({
          scores: pis.map((p) => ({
            piId: p.id,
            piText: p.text,
            score: 3,
            feedback: "Scoring unavailable — please try again.",
          })),
          overallScore: 3,
          strengths: ["Response submitted successfully"],
          improvements: ["AI scoring temporarily unavailable"],
        });
        setState("results");
      }
    },
    [scenario, event, profile]
  );

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-outline animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  if (state === "scoring") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-5xl text-primary animate-spin">
          progress_activity
        </span>
        <p className="text-outline">AI judge is scoring your response...</p>
      </div>
    );
  }

  if (state === "results" && result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Role Play Results
          </h1>
          <button
            onClick={() => setState("setup")}
            className="text-sm text-primary hover:underline"
          >
            ← New Scenario
          </button>
        </div>
        <Scorecard {...result} />
        <RolePlayDisclaimer eventName={event?.name || "DECA"} />
      </div>
    );
  }

  if (state === "responding" && scenario) {
    return (
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Role Play Coach
        </h1>
        <ScenarioDisplay {...scenario} eventName={event?.name || "DECA"} />
        <ResponseEditor
          onSubmit={handleSubmit}
          timeLimitMinutes={event?.interviewTimeMins || 15}
        />
        <RolePlayDisclaimer eventName={event?.name || "DECA"} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Role Play Coach
        </h1>
        <p className="text-outline mt-1">
          {event?.name || "Select an event"}
        </p>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-3xl text-primary">
            record_voice_over
          </span>
          <div>
            <p className="font-headline font-semibold text-on-surface">
              Practice Role Play
            </p>
            <p className="text-sm text-outline">
              Get a scenario, write your response, and receive AI-powered
              scoring with per-PI feedback
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-6 text-sm text-outline">
          <span>
            {event?.prepTimeMins || 10}min prep +{" "}
            {event?.interviewTimeMins || 15}min response
          </span>
          <span>·</span>
          <span>Scored on 1-5 scale per PI</span>
        </div>
        <button
          onClick={handleStart}
          className="gradient-cta rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Start Role Play
        </button>
      </div>

      <RolePlayDisclaimer eventName={event?.name || "DECA"} />
    </div>
  );
}
