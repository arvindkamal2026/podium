# Community Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/community` page with a GeoJSON-accurate SVG dot map of North America that shows where Podium users are located, with silent IP-based location collection on first dashboard load.

**Architecture:** Location is collected once per user via `ip-api.com` (IP-based, no browser permission needed) and stored in Firestore. A shared server-side function queries those locations; an API route exposes them externally; the community page server component calls that function directly. The map is a pure SVG dot grid (~10,800 cells) with land detection via point-in-polygon against a bundled simplified GeoJSON.

**Tech Stack:** Next.js 16 App Router, Firebase Firestore (Admin SDK for server, Client SDK for location write), TypeScript, Tailwind CSS v4, Natural Earth 110m GeoJSON.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `scripts/fetch-na-geojson.ts` | Create | One-time script to download + filter Natural Earth GeoJSON |
| `podium/data/north-america.geojson` | Create (generated) | Bundled land polygon data for 10 North American countries |
| `podium/lib/geo/point-in-polygon.ts` | Create | Ray-casting PIP algorithm for GeoJSON Polygon + MultiPolygon |
| `podium/lib/map-users.ts` | Create | Shared Firestore query returning `{lat, lng}[]` |
| `podium/app/api/map-users/route.ts` | Create | Auth-gated GET endpoint wrapping the shared query |
| `podium/lib/actions/onboarding.ts` | Modify | Add `lat/lng/city/state/country: null` to initial user doc |
| `podium/lib/collect-location.ts` | Create | Silent IP geolocation → one-time Firestore write |
| `podium/app/(app)/home/page.tsx` | Modify | Call `collectUserLocation` in `useEffect` after profile loads |
| `podium/components/community/NorthAmericaMap.tsx` | Create | SVG dot grid map component with GeoJSON land mask |
| `podium/app/(app)/community/page.tsx` | Create | Community page server component |
| `podium/components/layout/Sidebar.tsx` | Modify | Add Community to `SECONDARY_ITEMS` above Themes |
| `podium/components/layout/BottomNav.tsx` | Modify | Add Community to `MORE_ITEMS` above Themes |

---

## Task 1: Download & Bundle North America GeoJSON

**Files:**
- Create: `scripts/fetch-na-geojson.ts`
- Create (generated): `podium/data/north-america.geojson`

- [ ] **Step 1: Create the download script**

Create `scripts/fetch-na-geojson.ts`:

```ts
import { writeFileSync } from "fs";
import { join } from "path";

const NA_CODES = new Set(["US", "CA", "MX", "GT", "BZ", "HN", "SV", "NI", "CR", "PA", "CU"]);
const SOURCE =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

async function main() {
  console.log("Downloading countries GeoJSON...");
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as { type: string; features: Array<{ properties: { ISO_A2: string } }> };

  const filtered = {
    type: "FeatureCollection",
    features: data.features.filter((f) => NA_CODES.has(f.properties.ISO_A2)),
  };

  const outPath = join(process.cwd(), "podium", "data", "north-america.geojson");
  writeFileSync(outPath, JSON.stringify(filtered));
  console.log(`✓ Wrote ${filtered.features.length} features to podium/data/north-america.geojson`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Run the script**

From the repo root:
```bash
npx tsx scripts/fetch-na-geojson.ts
```

Expected output:
```
Downloading countries GeoJSON...
✓ Wrote 11 features to podium/data/north-america.geojson
```

Verify the file exists and is valid JSON:
```bash
node -e "const d = require('./podium/data/north-america.geojson'); console.log(d.features.length, 'features')"
```
Expected: `11 features`

- [ ] **Step 3: Commit**

```bash
git add scripts/fetch-na-geojson.ts podium/data/north-america.geojson
git commit -m "feat(community): add North America GeoJSON land data"
```

---

## Task 2: Point-in-Polygon Utility

**Files:**
- Create: `podium/lib/geo/point-in-polygon.ts`

- [ ] **Step 1: Create the utility**

Create `podium/lib/geo/point-in-polygon.ts`:

```ts
type Ring = number[][];
type Polygon = Ring[];

function raycast(point: [number, number], ring: Ring): boolean {
  const [px, py] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInPolygon(point: [number, number], rings: Polygon): boolean {
  // First ring is outer boundary; rest are holes
  if (!raycast(point, rings[0])) return false;
  for (let i = 1; i < rings.length; i++) {
    if (raycast(point, rings[i])) return false;
  }
  return true;
}

interface GeoFeature {
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

export function pointInFeatureCollection(lat: number, lng: number, features: GeoFeature[]): boolean {
  const point: [number, number] = [lng, lat]; // GeoJSON is [lng, lat]
  for (const feature of features) {
    const { type, coordinates } = feature.geometry;
    if (type === "Polygon") {
      if (pointInPolygon(point, coordinates as number[][][])) return true;
    } else if (type === "MultiPolygon") {
      for (const polygon of coordinates as number[][][][]) {
        if (pointInPolygon(point, polygon)) return true;
      }
    }
  }
  return false;
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd podium && npx tsc --noEmit
```
Expected: no errors related to the new file.

- [ ] **Step 3: Commit**

```bash
git add podium/lib/geo/point-in-polygon.ts
git commit -m "feat(community): add point-in-polygon utility for GeoJSON"
```

---

## Task 3: Shared Map-Users Data Fetcher + API Route

**Files:**
- Create: `podium/lib/map-users.ts`
- Create: `podium/app/api/map-users/route.ts`

- [ ] **Step 1: Create the shared fetcher**

Create `podium/lib/map-users.ts`:

```ts
import { getAdminDb } from "@/lib/firebase/admin";

export interface MapLocation {
  lat: number;
  lng: number;
}

export async function getMapLocations(): Promise<MapLocation[]> {
  const snapshot = await getAdminDb()
    .collection("users")
    .where("country", "in", ["US", "CA", "MX"])
    .where("lat", "!=", null)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return { lat: data.lat as number, lng: data.lng as number };
  });
}
```

- [ ] **Step 2: Create the API route**

Create `podium/app/api/map-users/route.ts`:

```ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getMapLocations } from "@/lib/map-users";

export const revalidate = 60;

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await getAdminAuth().verifySessionCookie(session, true);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const locations = await getMapLocations();
    return NextResponse.json({ locations }, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch {
    return NextResponse.json({ locations: [] }, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify it compiles**

```bash
cd podium && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add podium/lib/map-users.ts podium/app/api/map-users/route.ts
git commit -m "feat(community): add map-users fetcher and API route"
```

---

## Task 4: Location Collection — Onboarding + Utility + Dashboard

**Files:**
- Modify: `podium/lib/actions/onboarding.ts`
- Create: `podium/lib/collect-location.ts`
- Modify: `podium/app/(app)/home/page.tsx`

- [ ] **Step 1: Add location fields to the onboarding doc write**

In `podium/lib/actions/onboarding.ts`, find the `getAdminDb().collection("users").doc(uid).set({...})` call and add these fields to the object:

```ts
      lat: null,
      lng: null,
      city: null,
      state: null,
      country: null,
```

Add them after `rolePlayCount: 0,` so the full set call looks like:

```ts
    await getAdminDb().collection("users").doc(uid).set({
      firstName: data.firstName,
      lastName: data.lastName,
      school: data.school,
      cluster: data.cluster,
      eventId: data.eventId,
      competitionDate: data.competitionDate,
      competitionLevel: data.competitionLevel,
      streak: 0,
      longestStreak: 0,
      weeklySessionCount: 0,
      totalSessions: 0,
      lastSessionDate: null,
      piMastered: 0,
      piTotal: 0,
      vocabMastered: 0,
      vocabTotal: 0,
      examsTaken: 0,
      avgExamScore: 0,
      rolePlayCount: 0,
      lat: null,
      lng: null,
      city: null,
      state: null,
      country: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
```

- [ ] **Step 2: Create the location collection utility**

Create `podium/lib/collect-location.ts`:

```ts
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";

const NA_COUNTRIES = new Set(["US", "CA", "MX"]);

export async function collectUserLocation(uid: string): Promise<void> {
  const db = getClientDb();
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  const data = snap.data();

  // Only run once — skip if already collected
  if (data?.lat) return;

  try {
    const res = await fetch(
      "http://ip-api.com/json/?fields=lat,lon,city,regionName,countryCode"
    );
    const geo = await res.json();

    if (geo.status === "success" && NA_COUNTRIES.has(geo.countryCode)) {
      await updateDoc(userRef, {
        lat: geo.lat,
        lng: geo.lon,
        city: geo.city,
        state: geo.regionName,
        country: geo.countryCode,
      });
    }
  } catch {
    // Location is non-critical — silently fail
  }
}
```

- [ ] **Step 3: Wire into the dashboard**

In `podium/app/(app)/home/page.tsx`, add this import at the top:

```ts
import { collectUserLocation } from "@/lib/collect-location";
```

Inside `DashboardPage`, add this `useEffect` after the existing guest-profile effect:

```tsx
  useEffect(() => {
    if (user?.uid && profile) {
      collectUserLocation(user.uid);
    }
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps
```

- [ ] **Step 4: Verify it compiles**

```bash
cd podium && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add podium/lib/actions/onboarding.ts podium/lib/collect-location.ts podium/app/(app)/home/page.tsx
git commit -m "feat(community): silent IP location collection on dashboard load"
```

---

## Task 5: NorthAmericaMap Component

**Files:**
- Create: `podium/components/community/NorthAmericaMap.tsx`

- [ ] **Step 1: Create the component**

Create `podium/components/community/NorthAmericaMap.tsx`:

```tsx
"use client";

import { useMemo } from "react";
import { pointInFeatureCollection } from "@/lib/geo/point-in-polygon";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const geoData = require("@/data/north-america.geojson") as {
  features: Array<{ geometry: { type: string; coordinates: unknown } }>;
};

const COLS = 120;
const ROWS = 90;
const MIN_LAT = 7;
const MAX_LAT = 72;
const MIN_LNG = -168;
const MAX_LNG = -52;
const SPACING = 9;
const DOT_R = 3;
const WIDTH = COLS * SPACING;
const HEIGHT = ROWS * SPACING;

// Pre-compute land cells once at module load (runs client-side only)
const LAND_CELLS = new Set<string>();
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const lat = MAX_LAT - (row / ROWS) * (MAX_LAT - MIN_LAT);
    const lng = MIN_LNG + (col / COLS) * (MAX_LNG - MIN_LNG);
    if (pointInFeatureCollection(lat, lng, geoData.features)) {
      LAND_CELLS.add(`${col},${row}`);
    }
  }
}

function latLngToCell(lat: number, lng: number): string {
  const col = Math.round(((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * COLS);
  const row = Math.round(((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * ROWS);
  return `${col},${row}`;
}

interface Props {
  userLocations: Array<{ lat: number; lng: number }>;
}

export function NorthAmericaMap({ userLocations }: Props) {
  const userCells = useMemo(
    () => new Set(userLocations.map(({ lat, lng }) => latLngToCell(lat, lng))),
    [userLocations]
  );

  return (
    <div className="w-full bg-[#0E0E0E] rounded-2xl overflow-hidden">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        aria-label="North America user map"
      >
        <defs>
          <filter id="user-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from(LAND_CELLS).map((key) => {
          const [colStr, rowStr] = key.split(",");
          const col = Number(colStr);
          const row = Number(rowStr);
          const cx = col * SPACING + SPACING / 2;
          const cy = row * SPACING + SPACING / 2;
          const isUser = userCells.has(key);

          return isUser ? (
            <circle
              key={key}
              cx={cx}
              cy={cy}
              r={DOT_R + 0.5}
              fill="#4D8EFF"
              filter="url(#user-glow)"
              className="animate-pulse"
            />
          ) : (
            <circle key={key} cx={cx} cy={cy} r={DOT_R} fill="#2A2A2A" />
          );
        })}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd podium && npx tsc --noEmit
```

If you get a TS error about importing `.geojson`, add `"resolveJsonModule": true` to `podium/tsconfig.json` under `compilerOptions`. It's likely already there in a Next.js project, but verify.

- [ ] **Step 3: Commit**

```bash
git add podium/components/community/NorthAmericaMap.tsx
git commit -m "feat(community): add NorthAmericaMap SVG dot grid component"
```

---

## Task 6: Community Page

**Files:**
- Create: `podium/app/(app)/community/page.tsx`

- [ ] **Step 1: Create the page**

Create `podium/app/(app)/community/page.tsx`:

```tsx
import { NorthAmericaMap } from "@/components/community/NorthAmericaMap";
import { getMapLocations } from "@/lib/map-users";

export default async function CommunityPage() {
  let locations: Array<{ lat: number; lng: number }> = [];
  try {
    locations = await getMapLocations();
  } catch {
    // Render gracefully with empty map
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          The Podium Network
        </h1>
        <p className="text-outline mt-1">
          DECA competitors preparing from coast to coast.
        </p>
      </div>

      <div className="relative">
        <NorthAmericaMap userLocations={locations} />
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-[16px] bg-white/5">
          <span className="w-2 h-2 rounded-full bg-[#4EDEA5] animate-pulse" />
          <span className="text-white text-sm font-medium">
            {locations.length} competitors mapped
          </span>
        </div>
      </div>

      <div className="flex gap-8">
        <div>
          <p className="text-3xl font-bold text-on-surface">{locations.length}</p>
          <p className="text-outline text-sm">Competitors on the map</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd podium && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add podium/app/(app)/community/page.tsx
git commit -m "feat(community): add Community page server component"
```

---

## Task 7: Navigation Wiring

**Files:**
- Modify: `podium/components/layout/Sidebar.tsx`
- Modify: `podium/components/layout/BottomNav.tsx`

- [ ] **Step 1: Add Community to Sidebar**

In `podium/components/layout/Sidebar.tsx`, update `SECONDARY_ITEMS` to:

```ts
const SECONDARY_ITEMS = [
  { href: "/community", label: "Community", icon: "public" },
  { href: "/themes", label: "Themes", icon: "palette" },
  { href: "/profile", label: "Profile", icon: "person" },
];
```

- [ ] **Step 2: Add Community to BottomNav More panel**

In `podium/components/layout/BottomNav.tsx`, update `MORE_ITEMS` to:

```ts
const MORE_ITEMS = [
  { href: "/roleplay",   label: "Role Play",  icon: "record_voice_over" },
  { href: "/events",     label: "Events",     icon: "category"          },
  { href: "/community",  label: "Community",  icon: "public"            },
  { href: "/themes",     label: "Themes",     icon: "palette"           },
  { href: "/profile",    label: "Profile",    icon: "person"            },
];
```

- [ ] **Step 3: Start the dev server and verify**

```bash
cd podium && npm run dev
```

Open `http://localhost:3000` and log in. Verify:
1. Sidebar shows "Community" above "Themes" with a globe icon (`public`)
2. Bottom nav "More" panel shows "Community" above "Themes"
3. Clicking Community navigates to `/community`
4. The dot map renders (grey continent, any blue dots if you have users with locations)
5. The live badge shows "{n} competitors mapped" in the bottom-left of the map
6. The competitor count stat renders below the map
7. No console errors

- [ ] **Step 4: Commit**

```bash
git add podium/components/layout/Sidebar.tsx podium/components/layout/BottomNav.tsx
git commit -m "feat(community): add Community tab to sidebar and bottom nav"
```

---

## Firestore Index Note

The query in `lib/map-users.ts` uses `where("country", "in", [...])` combined with `where("lat", "!=", null)`. Firestore requires a composite index for this. After deploying, Firestore will log a console error with a direct link to create the index. Click that link and create it. Alternatively, add this to `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "country", "order": "ASCENDING" },
        { "fieldPath": "lat", "order": "ASCENDING" }
      ]
    }
  ]
}
```
