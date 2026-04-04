"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDocument } from "@/lib/hooks/useFirestore";
import { useRouter } from "next/navigation";
import { DECA_EVENTS } from "@/data/events";
import { updateProfile, deleteAccount } from "@/lib/actions/profile";
import { signOut } from "@/lib/firebase/auth";

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
      setSchool(profile.school);
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

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 bg-surface-container-low rounded-xl px-5 py-2.5 text-sm text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-lg">logout</span>
        Sign Out
      </button>

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
