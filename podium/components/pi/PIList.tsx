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
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))].sort(), [items]);

  const filtered = useMemo(() => {
    return items.filter((pi) => {
      if (masteryFilter !== "all" && pi.status !== masteryFilter) return false;
      if (categoryFilter !== "all" && pi.category !== categoryFilter) return false;
      if (
        search &&
        !pi.text.toLowerCase().includes(search.toLowerCase()) &&
        !pi.code.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [items, search, masteryFilter, categoryFilter]);

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
        <select
          value={masteryFilter}
          onChange={(e) => setMasteryFilter(e.target.value)}
          className="bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          <option value="all">All Status</option>
          <option value="mastered">Mastered</option>
          <option value="learning">Learning</option>
          <option value="untested">Untested</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
