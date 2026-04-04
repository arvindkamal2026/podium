"use client";

interface EventFilterProps {
  clusters: string[];
  categories: string[];
  selectedCluster: string;
  selectedCategory: string;
  onClusterChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const CLUSTER_LABELS: Record<string, string> = {
  finance: "Finance",
  marketing: "Marketing",
  "business-mgmt": "Business Management",
  hospitality: "Hospitality & Tourism",
  entrepreneurship: "Entrepreneurship",
  "personal-finance": "Personal Finance",
};

export function EventFilter({
  clusters,
  categories,
  selectedCluster,
  selectedCategory,
  onClusterChange,
  onCategoryChange,
  search,
  onSearchChange,
}: EventFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
          search
        </span>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-surface-container-low rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <select
        value={selectedCluster}
        onChange={(e) => onClusterChange(e.target.value)}
        className="bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30"
      >
        <option value="all">All Clusters</option>
        {clusters.map((c) => (
          <option key={c} value={c}>
            {CLUSTER_LABELS[c] || c}
          </option>
        ))}
      </select>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
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
  );
}
