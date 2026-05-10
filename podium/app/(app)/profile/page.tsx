"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDocument } from "@/lib/hooks/useFirestore";
import { useRouter } from "next/navigation";
import { DECA_EVENTS } from "@/data/events";
import { updateProfile, deleteAccount } from "@/lib/actions/profile";
import { signOut } from "@/lib/firebase/auth";
import { useTheme } from "@/context/ThemeContext";
import { THEMES } from "@/lib/themes";

interface UserProfile {
  firstName: string;
  lastName: string;
  school: string;
  cluster: string;
  eventId: string;
  competitionDate: string;
  competitionLevel: string;
  streak: number;
  longestStreak: number;
  totalSessions: number;
  examsTaken: number;
  avgExamScore: number;
  rolePlayCount: number;
  piMastered: number;
  piTotal: number;
  vocabMastered: number;
  vocabTotal: number;
  createdAt: string;
}

// Insert spaces between CamelCase words (e.g. "Prosper HighSchool" → "Prosper High School")
function normalizeSchoolName(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
}

const CLUSTERS = [
  { value: "finance", label: "Finance" },
  { value: "marketing", label: "Marketing" },
  { value: "business-mgmt", label: "Business Management" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "personal-finance", label: "Personal Finance" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { currentTheme, setTheme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, loading: profileLoading } = useDocument<UserProfile>(
    user ? `users/${user.uid}` : null
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [school, setSchool] = useState("");
  const [cluster, setCluster] = useState("");
  const [eventId, setEventId] = useState("");
  const [competitionDate, setCompetitionDate] = useState("");
  const [competitionLevel, setCompetitionLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setSchool(normalizeSchoolName(profile.school));
      setCluster(profile.cluster);
      setEventId(profile.eventId);
      setCompetitionDate(profile.competitionDate);
      setCompetitionLevel(profile.competitionLevel);
    }
  }, [profile]);

  const filteredEvents = DECA_EVENTS.filter((e) => e.cluster === cluster);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await updateProfile({ firstName, lastName, school, cluster, eventId, competitionDate, competitionLevel });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteAccount();
    if (result.success) {
      router.push("/login");
    }
    setDeleting(false);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-outline animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-outline mt-1">Manage your account and preferences</p>
      </div>

      {/* Personal Info */}
      <div className="bg-surface-container-low rounded-2xl p-8 space-y-5">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">Personal Information</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-outline mb-1 block">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs text-outline mb-1 block">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-outline mb-1 block">School</label>
          <input
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Competition Info */}
      <div className="bg-surface-container-low rounded-2xl p-8 space-y-5">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">Competition Settings</p>

        <div>
          <label className="text-xs text-outline mb-1 block">Cluster</label>
          <select
            value={cluster}
            onChange={(e) => { setCluster(e.target.value); setEventId(""); }}
            className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            {CLUSTERS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-outline mb-1 block">Event</label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="">Select event...</option>
            {filteredEvents.map((e) => (
              <option key={e.id} value={e.id}>{e.code} — {e.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-outline mb-1 block">Competition Date</label>
            <input
              type="date"
              value={competitionDate}
              onChange={(e) => setCompetitionDate(e.target.value)}
              className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs text-outline mb-1 block">Level</label>
            <select
              value={competitionLevel}
              onChange={(e) => setCompetitionLevel(e.target.value)}
              className="w-full bg-surface-container rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="district">District</option>
              <option value="state">State</option>
              <option value="icdc">ICDC</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="gradient-cta rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      {/* Stats */}
      {profile && (
        <div className="bg-surface-container-low rounded-2xl p-8">
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">All-Time Stats</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Sessions", value: profile.totalSessions },
              { label: "Exams Taken", value: profile.examsTaken },
              { label: "Role Plays", value: profile.rolePlayCount },
              { label: "Longest Streak", value: `${profile.longestStreak} days` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-headline text-2xl font-bold text-on-surface">{s.value}</p>
                <p className="text-xs text-outline mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-outline mt-4">
            Member since{" "}
            {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      )}

      {/* Appearance */}
      <div className="bg-surface-container-low rounded-2xl p-8 space-y-5">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">Appearance</p>
          <p className="text-xs text-outline mt-1">Theme</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          {THEMES.filter((t) => !t.variantOf).map((theme) => {
            const darkVariant = THEMES.find((t) => t.variantOf === theme.id && t.mode === "dark");
            const isFamilyActive = currentTheme.id === theme.id || currentTheme.variantOf === theme.id;
            const isDarkVariantActive = currentTheme.id === darkVariant?.id;
            const activeSwatches = isDarkVariantActive && darkVariant ? darkVariant.swatches : theme.swatches;

            return (
              <button
                key={theme.id}
                onClick={() => { if (!isFamilyActive) setTheme(theme.id); }}
                className="text-left relative rounded-xl p-4 transition-colors bg-surface-container"
                style={{
                  border: isFamilyActive ? "2px solid var(--color-primary)" : "0.5px solid rgba(255,255,255,0.08)",
                  cursor: isFamilyActive ? "default" : "pointer",
                }}
              >
                {/* Sun/moon variant toggle — shown when this family is active and has a dark variant */}
                {isFamilyActive && darkVariant ? (
                  <div
                    className="absolute top-2.5 right-2.5 flex items-center rounded-full p-0.5"
                    style={{ background: "rgba(128,128,128,0.15)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setTheme(theme.id)}
                      title="Light"
                      className="flex items-center justify-center rounded-full transition-colors"
                      style={{
                        width: 24,
                        height: 24,
                        background: !isDarkVariantActive ? "rgba(255,255,255,0.2)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13, color: !isDarkVariantActive ? "#F8BC16" : "currentColor" }}>
                        light_mode
                      </span>
                    </button>
                    <button
                      onClick={() => setTheme(darkVariant.id)}
                      title="Dark"
                      className="flex items-center justify-center rounded-full transition-colors"
                      style={{
                        width: 24,
                        height: 24,
                        background: isDarkVariantActive ? "rgba(255,255,255,0.2)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13, color: isDarkVariantActive ? "#F8BC16" : "currentColor" }}>
                        dark_mode
                      </span>
                    </button>
                  </div>
                ) : !isFamilyActive && theme.mode === "light" ? (
                  <span
                    className="absolute top-2.5 right-2.5 text-[11px] font-medium rounded-full px-2 py-0.5"
                    style={{ background: "rgba(255,185,95,0.15)", color: "#FFB95F" }}
                  >
                    Light
                  </span>
                ) : !isFamilyActive ? (
                  null
                ) : (
                  <span
                    className="absolute top-2.5 right-2.5 text-[11px] font-medium rounded-full px-2 py-0.5"
                    style={{ background: "rgba(77,142,255,0.15)", color: "#ADC6FF" }}
                  >
                    Active
                  </span>
                )}

                {/* Mini UI preview — hardcoded hex so it always shows correctly */}
                {theme.id === "podium-default" && (
                  <div className="rounded-lg overflow-hidden mb-3" style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 22, background: "#0a0a0f" }}>
                      <div className="rounded-full" style={{ width: 6, height: 6, background: "#ADC6FF" }} />
                      <div className="rounded" style={{ width: 32, height: 6, background: "#1a1a2e" }} />
                      <div className="rounded ml-auto" style={{ width: 20, height: 6, background: "#1a1a2e" }} />
                    </div>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 44, background: "#111118" }}>
                      <div className="rounded" style={{ width: 40, height: 14, background: "#4D8EFF" }} />
                      <div className="rounded" style={{ width: 28, height: 14, background: "#FFB95F" }} />
                      <div className="rounded ml-auto" style={{ width: 50, height: 6, background: "#1e1e2c" }} />
                    </div>
                  </div>
                )}
                {theme.id === "prosper-eagles" && !isDarkVariantActive && (
                  <div className="rounded-lg overflow-hidden mb-3" style={{ border: "0.5px solid rgba(0,0,0,0.1)" }}>
                    <div className="flex" style={{ height: 66 }}>
                      {/* Sidebar strip */}
                      <div className="flex flex-col justify-center gap-1 px-1.5" style={{ width: 32, background: "#1a3520" }}>
                        <div className="rounded-sm" style={{ height: 4, background: "#F8BC16" }} />
                        <div className="rounded-sm" style={{ height: 4, background: "rgba(255,255,255,0.2)" }} />
                        <div className="rounded-sm" style={{ height: 4, background: "rgba(255,255,255,0.2)" }} />
                        <div className="rounded-sm" style={{ height: 4, background: "rgba(255,255,255,0.2)" }} />
                      </div>
                      {/* Content area */}
                      <div className="flex-1 flex flex-col gap-1.5 px-2 justify-center" style={{ background: "#f5f5f0" }}>
                        <div className="rounded" style={{ width: 40, height: 8, background: "#204321" }} />
                        <div className="rounded" style={{ width: 28, height: 8, background: "#F8BC16" }} />
                        <div className="rounded" style={{ width: 50, height: 5, background: "#e8f0e9" }} />
                      </div>
                    </div>
                  </div>
                )}
                {theme.id === "prosper-eagles" && isDarkVariantActive && (
                  <div className="rounded-lg overflow-hidden mb-3" style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 22, background: "#070f08" }}>
                      <div className="rounded-full" style={{ width: 6, height: 6, background: "#F8BC16" }} />
                      <div className="rounded" style={{ width: 32, height: 6, background: "#132c15" }} />
                      <div className="rounded ml-auto" style={{ width: 20, height: 6, background: "#132c15" }} />
                    </div>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 44, background: "#0b1e0d" }}>
                      <div className="rounded" style={{ width: 40, height: 14, background: "#F8BC16" }} />
                      <div className="rounded" style={{ width: 28, height: 14, background: "#4edea5" }} />
                      <div className="rounded ml-auto" style={{ width: 50, height: 6, background: "#132c15" }} />
                    </div>
                  </div>
                )}

                {/* Swatch row */}
                <div className="flex gap-1.5 mb-3">
                  {activeSwatches.map((color, i) => (
                    <div
                      key={i}
                      className="rounded-full flex-shrink-0"
                      style={{
                        width: 24,
                        height: 24,
                        background: color,
                        border: color === "#f5f5f0" || color === "#ffffff" ? "0.5px solid #ddd" : undefined,
                      }}
                    />
                  ))}
                </div>

                <p className="text-sm font-medium text-on-surface mb-0.5">{theme.label}</p>
                <p className="text-xs text-outline leading-relaxed">{theme.description}</p>
              </button>
            );
          })}

          {/* Coming soon */}
          <div
            className="rounded-xl p-4 bg-surface-container"
            style={{
              opacity: 0.5,
              pointerEvents: "none",
              border: "0.5px solid rgba(255,255,255,0.08)",
            }}
          >
            <p className="text-sm font-medium text-on-surface mb-0.5">More coming soon</p>
            <p className="text-xs text-outline leading-relaxed">Submit your school&apos;s colors to get featured.</p>
          </div>
        </div>

        <p className="text-xs text-outline">Themes change the overall look and feel of the entire app.</p>
      </div>

      {/* Danger Zone */}
      <div className="bg-error/5 rounded-2xl p-8 space-y-4">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-error">Danger Zone</p>
        <p className="text-sm text-on-surface-variant">
          Permanently delete your account and all data. This cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-error/10 text-error rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-error/20 transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-error text-on-error rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-sm text-outline hover:text-on-surface"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
