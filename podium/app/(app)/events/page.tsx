"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDocument } from "@/lib/hooks/useFirestore";
import { DECA_EVENTS } from "@/data/events";
import { EventCard } from "@/components/events/EventCard";
import { EventFilter } from "@/components/events/EventFilter";

interface UserProfile {
  eventId: string;
}

export default function EventsPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, loading: profileLoading } = useDocument<UserProfile>(
    user ? `users/${user.uid}` : null
  );

  const [search, setSearch] = useState("");
  const [cluster, setCluster] = useState("all");
  const [category, setCategory] = useState("all");

  const clusters = useMemo(
    () => [...new Set(DECA_EVENTS.map((e) => e.cluster))].sort(),
    []
  );
  const categories = useMemo(
    () => [...new Set(DECA_EVENTS.map((e) => e.category))].sort(),
    []
  );

  const userEvent = DECA_EVENTS.find((e) => e.id === profile?.eventId);

  const filtered = useMemo(() => {
    return DECA_EVENTS.filter((e) => {
      if (e.id === profile?.eventId) return false; // shown in pinned "Your Event" section
      if (cluster !== "all" && e.cluster !== cluster) return false;
      if (category !== "all" && e.category !== category) return false;
      if (
        search &&
        !e.name.toLowerCase().includes(search.toLowerCase()) &&
        !e.code.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, cluster, category, profile?.eventId]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-outline animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-outline mt-1">All {DECA_EVENTS.length} DECA competitive events</p>
      </div>

      {userEvent && (
        <div className="mb-2">
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-3">
            Your Event
          </p>
          <EventCard {...userEvent} isUserEvent={true} />
        </div>
      )}

      <EventFilter
        clusters={clusters}
        categories={categories}
        selectedCluster={cluster}
        selectedCategory={category}
        onClusterChange={setCluster}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
      />

      <p className="text-xs text-outline">{filtered.length} events</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <EventCard key={e.id} {...e} isUserEvent={e.id === profile?.eventId} />
        ))}
      </div>
    </div>
  );
}
