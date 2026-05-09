"use client";
import { useState, useMemo } from "react";
import { PICard } from "./PICard";

interface PIWithProgress {
  id: string;
  code: string;
  text: string;
  category: string;
  difficulty: "high" | "medium" | "low";
  status: "mastered" | "learning" | "untested";
  timesTested: number;
  timesCorrect: number;
  lastTested: string | null;
}

export function PIList({ items }: { items: PIWithProgress[] }) {
  const [search, setSearch] = useState("");
  const [masteryFilter, setMasteryFilter] = useState<string>("all");
  const [iaFilter, setIaFilter] = useState<string>("all");

  const instructionalAreas = useMemo(
    () => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(),
    [items]
  );

  const filtered = useMemo(() => {
    return items.filter((pi) => {
      if (masteryFilter !== "all" && pi.status !== masteryFilter) return false;
      if (iaFilter !== "all" && pi.category !== iaFilter) return false;
      if (
        search &&
        !pi.text.toLowerCase().includes(search.toLowerCase()) &&
        !pi.code.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [items, search, masteryFilter, iaFilter]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search PIs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <div className="relative">
          <select
            value={masteryFilter}
            onChange={(e) => setMasteryFilter(e.target.value)}
            className="appearance-none bg-surface-container-low rounded-xl pl-4 pr-10 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="all">All Status</option>
            <option value="mastered">Mastered</option>
            <option value="learning">Learning</option>
            <option value="untested">Untested</option>
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            expand_more
          </span>
        </div>

        <div className="relative">
          <select
            value={iaFilter}
            onChange={(e) => setIaFilter(e.target.value)}
            className="appearance-none bg-surface-container-low rounded-xl pl-4 pr-10 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="all">All Instructional Areas</option>
            {instructionalAreas.map((ia) => (
              <option key={ia} value={ia}>
                {ia}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            expand_more
          </span>
        </div>
      </div>

      <p className="text-xs text-outline mb-4">
        {filtered.length} of {items.length} PIs
      </p>

      <div className="space-y-3">
        {filtered.map((pi) => (
          <PICard key={pi.id} {...pi} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface-container-low rounded-2xl p-8 text-center">
            <p className="text-sm text-outline">No PIs match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
