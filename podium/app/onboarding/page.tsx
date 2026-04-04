"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/lib/actions/onboarding";

// ---------------------------------------------------------------------------
// DECA Events by Cluster (all 59 events)
// ---------------------------------------------------------------------------

interface DECAEvent {
  id: string;
  name: string;
  code: string;
}

const EVENTS_BY_CLUSTER: Record<string, DECAEvent[]> = {
  marketing: [
    { id: "aam", name: "Apparel and Accessories Marketing", code: "AAM" },
    { id: "asm", name: "Automotive Services Marketing", code: "ASM" },
    { id: "bsm", name: "Business Services Marketing", code: "BSM" },
    { id: "fms", name: "Food Marketing", code: "FMS" },
    { id: "mcs", name: "Marketing Communications", code: "MCS" },
    { id: "mtdm", name: "Marketing Cluster Exam", code: "MTDM" },
    { id: "qsrm", name: "Quick Serve Restaurant Management", code: "QSRM" },
    { id: "rfsm", name: "Restaurant and Food Service Management", code: "RFSM" },
    { id: "rms", name: "Retail Merchandising", code: "RMS" },
    { id: "sem", name: "Sports and Entertainment Marketing", code: "SEM" },
    { id: "stdm", name: "Sports and Entertainment Marketing Cluster Exam", code: "STDM" },
    { id: "seor", name: "Sports and Entertainment Operations Research", code: "SEOR" },
    { id: "imce", name: "Integrated Marketing Campaign — Event", code: "IMCE" },
    { id: "imcp", name: "Integrated Marketing Campaign — Product", code: "IMCP" },
    { id: "imcs", name: "Integrated Marketing Campaign — Service", code: "IMCS" },
    { id: "pse", name: "Professional Selling", code: "PSE" },
    { id: "pmk", name: "Principles of Marketing", code: "PMK" },
  ],
  finance: [
    { id: "act", name: "Accounting", code: "ACT" },
    { id: "bfs", name: "Business Finance", code: "BFS" },
    { id: "for", name: "Financial Operations Research", code: "FOR" },
    { id: "fce", name: "Financial Consulting", code: "FCE" },
    { id: "ftdm", name: "Finance Cluster Exam", code: "FTDM" },
    { id: "pfn", name: "Principles of Finance", code: "PFN" },
    { id: "smg", name: "Securities and Investments", code: "SMG" },
    { id: "vbcac", name: "Virtual Business Challenge — Accounting", code: "VBCAC" },
  ],
  "business-mgmt": [
    { id: "bltdm", name: "Business Law and Ethics Cluster Exam", code: "BLTDM" },
    { id: "bor", name: "Business Operations Research", code: "BOR" },
    { id: "bmor", name: "Buying and Merchandising Operations Research", code: "BMOR" },
    { id: "btdm", name: "Business Management and Administration Cluster Exam", code: "BTDM" },
    { id: "hrm", name: "Human Resources Management", code: "HRM" },
    { id: "pbm", name: "Principles of Business Management and Administration", code: "PBM" },
    { id: "pmbs", name: "Project Management — Business Solutions", code: "PMBS" },
    { id: "pmcd", name: "Project Management — Community Development", code: "PMCD" },
    { id: "pmca", name: "Project Management — Community Awareness", code: "PMCA" },
    { id: "pmcg", name: "Project Management — Career Growth", code: "PMCG" },
    { id: "pmfl", name: "Project Management — Financial Literacy", code: "PMFL" },
    { id: "pmsp", name: "Project Management — Sales Project", code: "PMSP" },
  ],
  hospitality: [
    { id: "hlm", name: "Hotel and Lodging Management", code: "HLM" },
    { id: "htdm", name: "Hospitality and Tourism Cluster Exam", code: "HTDM" },
    { id: "htor", name: "Hospitality and Tourism Operations Research", code: "HTOR" },
    { id: "htps", name: "Hospitality and Tourism Professional Selling", code: "HTPS" },
    { id: "pht", name: "Principles of Hospitality and Tourism", code: "PHT" },
    { id: "ttdm", name: "Travel and Tourism Cluster Exam", code: "TTDM" },
    { id: "vbchm", name: "Virtual Business Challenge — Hotel Management", code: "VBCHM" },
    { id: "vbcrs", name: "Virtual Business Challenge — Restaurant", code: "VBCRS" },
  ],
  entrepreneurship: [
    { id: "ent", name: "Entrepreneurship", code: "ENT" },
    { id: "etdm", name: "Entrepreneurship Cluster Exam", code: "ETDM" },
    { id: "ebg", name: "Entrepreneurship — Growing Your Business", code: "EBG" },
    { id: "efb", name: "Entrepreneurship — Franchise Business Plan", code: "EFB" },
    { id: "eib", name: "Entrepreneurship — Independent Business Plan", code: "EIB" },
    { id: "eip", name: "Entrepreneurship — Innovation Plan", code: "EIP" },
    { id: "esb", name: "Entrepreneurship — Start-Up Business Plan", code: "ESB" },
    { id: "ibp", name: "International Business Plan", code: "IBP" },
    { id: "pen", name: "Principles of Entrepreneurship", code: "PEN" },
    { id: "vbcen", name: "Virtual Business Challenge — Entrepreneurship", code: "VBCEN" },
  ],
  "personal-finance": [
    { id: "pfl", name: "Personal Financial Literacy", code: "PFL" },
    { id: "vbcpf", name: "Virtual Business Challenge — Personal Finance", code: "VBCPF" },
  ],
};

// ---------------------------------------------------------------------------
// Cluster definitions
// ---------------------------------------------------------------------------

const CLUSTERS = [
  { id: "marketing", label: "Marketing", icon: "campaign" },
  { id: "finance", label: "Finance", icon: "account_balance" },
  { id: "business-mgmt", label: "Business Mgmt", icon: "business_center" },
  { id: "hospitality", label: "Hospitality", icon: "hotel" },
  { id: "entrepreneurship", label: "Entrepreneurship", icon: "rocket_launch" },
  { id: "personal-finance", label: "Personal Finance", icon: "savings" },
] as const;

// ---------------------------------------------------------------------------
// Competition levels
// ---------------------------------------------------------------------------

const COMPETITION_LEVELS = [
  { id: "districts", label: "Districts" },
  { id: "state", label: "State" },
  { id: "icdc", label: "ICDC" },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [school, setSchool] = useState("");
  const [cluster, setCluster] = useState("");
  const [eventId, setEventId] = useState("");
  const [competitionDate, setCompetitionDate] = useState("");
  const [competitionLevel, setCompetitionLevel] = useState("");

  const canProceed = () => {
    switch (step) {
      case 1:
        return firstName.trim() && lastName.trim() && school.trim();
      case 2:
        return cluster !== "";
      case 3:
        return eventId !== "";
      case 4:
        return competitionDate !== "" && competitionLevel !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      // Reset event selection when cluster changes between steps
      if (step === 2) {
        setEventId("");
      }
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await completeOnboarding({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        school: school.trim(),
        cluster,
        eventId,
        competitionDate,
        competitionLevel,
      });
      if (result.success) {
        router.push("/home");
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch {
      setError("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = cluster ? EVENTS_BY_CLUSTER[cluster] || [] : [];

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Header — frosted glass, same as auth layout */}
      <header className="fixed top-0 w-full z-50 frosted-glass flex items-center px-6 h-16">
        <a href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            trophy
          </span>
          <span className="font-headline text-2xl font-bold tracking-tighter text-primary">
            Podium
          </span>
        </a>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/15 to-transparent" />
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center pt-16 px-4">
        <div className="w-full max-w-lg space-y-8 py-12">
          {/* Step label */}
          <p className="text-[10px] tracking-[0.2em] text-primary font-headline uppercase font-bold">
            Step {String(step).padStart(2, "0")} / 04
          </p>

          {/* Step content */}
          {step === 1 && (
            <StepPersonalInfo
              firstName={firstName}
              lastName={lastName}
              school={school}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onSchoolChange={setSchool}
            />
          )}
          {step === 2 && (
            <StepClusterSelection
              selected={cluster}
              onSelect={setCluster}
            />
          )}
          {step === 3 && (
            <StepEventSelection
              events={filteredEvents}
              selected={eventId}
              onSelect={setEventId}
            />
          )}
          {step === 4 && (
            <StepCompetitionDate
              date={competitionDate}
              level={competitionLevel}
              onDateChange={setCompetitionDate}
              onLevelChange={setCompetitionLevel}
            />
          )}

          {/* Error */}
          {error && <p className="text-error text-sm">{error}</p>}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            {step > 1 ? (
              <Button
                type="button"
                onClick={handleBack}
                className="bg-surface-container-low ghost-border hover:bg-surface-container text-on-surface px-6 py-5 rounded-xl font-semibold"
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="gradient-cta shadow-xl shadow-primary/10 px-8 py-5 rounded-xl font-bold disabled:opacity-40"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleComplete}
                disabled={!canProceed() || loading}
                className="gradient-cta shadow-xl shadow-primary/10 px-8 py-5 rounded-xl font-bold disabled:opacity-40"
              >
                {loading ? "Finishing..." : "Complete"}
              </Button>
            )}
          </div>

          {/* Step indicator dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  s === step
                    ? "bg-primary"
                    : s < step
                      ? "bg-primary/50"
                      : "bg-surface-container-highest"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Personal Info
// ---------------------------------------------------------------------------

function StepPersonalInfo({
  firstName,
  lastName,
  school,
  onFirstNameChange,
  onLastNameChange,
  onSchoolChange,
}: {
  firstName: string;
  lastName: string;
  school: string;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onSchoolChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight">
        Let&apos;s set up your profile
      </h1>

      <div className="bg-surface-container-low hover:bg-surface-container rounded-xl p-6 space-y-5 transition-colors">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold tracking-widest text-primary uppercase">
              First Name
            </Label>
            <Input
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="Jane"
              className="bg-transparent border-none text-lg font-semibold text-on-surface placeholder:text-outline"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold tracking-widest text-primary uppercase">
              Last Name
            </Label>
            <Input
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Doe"
              className="bg-transparent border-none text-lg font-semibold text-on-surface placeholder:text-outline"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold tracking-widest text-primary uppercase">
            School Name
          </Label>
          <Input
            value={school}
            onChange={(e) => onSchoolChange(e.target.value)}
            placeholder="Lincoln High School"
            className="bg-transparent border-none text-lg font-semibold text-on-surface placeholder:text-outline"
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Cluster Selection
// ---------------------------------------------------------------------------

function StepClusterSelection({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight">
        Which career cluster are you in?
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CLUSTERS.map((c) => {
          const isActive = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={`flex flex-col items-center gap-3 rounded-xl p-6 text-center transition-colors cursor-pointer ${
                isActive
                  ? "bg-surface-container-high border-l-[3px] border-l-primary"
                  : "bg-surface-container-low hover:bg-surface-container border-l-[3px] border-l-transparent"
              }`}
            >
              <span
                className={`material-symbols-outlined text-3xl ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {c.icon}
              </span>
              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-on-surface" : "text-on-surface-variant"
                }`}
              >
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Event Selection
// ---------------------------------------------------------------------------

function StepEventSelection({
  events,
  selected,
  onSelect,
}: {
  events: DECAEvent[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight">
        Which event are you competing in?
      </h1>

      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
        {events.map((evt) => {
          const isActive = selected === evt.id;
          return (
            <button
              key={evt.id}
              type="button"
              onClick={() => onSelect(evt.id)}
              className={`w-full flex items-center gap-4 rounded-xl p-4 text-left transition-colors cursor-pointer ${
                isActive
                  ? "bg-surface-container-high border-l-[3px] border-l-primary"
                  : "bg-surface-container-low hover:bg-surface-container border-l-[3px] border-l-transparent"
              }`}
            >
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase min-w-[60px]">
                {evt.code}
              </span>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-on-surface" : "text-on-surface-variant"
                }`}
              >
                {evt.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Competition Date
// ---------------------------------------------------------------------------

function StepCompetitionDate({
  date,
  level,
  onDateChange,
  onLevelChange,
}: {
  date: string;
  level: string;
  onDateChange: (v: string) => void;
  onLevelChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight">
        When is your next competition?
      </h1>

      {/* Date picker */}
      <div className="bg-surface-container-low hover:bg-surface-container rounded-xl p-6 space-y-2 transition-colors">
        <Label className="text-[10px] font-bold tracking-widest text-primary uppercase">
          Competition Date
        </Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-transparent border-none text-lg font-semibold text-on-surface"
        />
      </div>

      {/* Competition level */}
      <div className="grid grid-cols-3 gap-3">
        {COMPETITION_LEVELS.map((l) => {
          const isActive = level === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => onLevelChange(l.id)}
              className={`rounded-xl p-4 text-center text-sm font-semibold transition-colors cursor-pointer ${
                isActive
                  ? "bg-surface-container-high border-l-[3px] border-l-primary text-on-surface"
                  : "bg-surface-container-low hover:bg-surface-container border-l-[3px] border-l-transparent text-on-surface-variant"
              }`}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
