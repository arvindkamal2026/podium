# Community Map — Design Spec
_2026-05-10_

## Overview

Add a `/community` page to the authenticated app that displays a dot-grid SVG map of North America showing where Podium users are located. Location is collected silently via IP geolocation on first dashboard load — no user prompt, no permission dialog. The page is auth-gated and sits in the sidebar above Themes.

---

## 1. Data Collection

### Firestore schema addition
`completeOnboarding` in `lib/actions/onboarding.ts` already writes the full user doc. Add five new fields to that initial write:

```ts
lat: null,
lng: null,
city: null,
state: null,
country: null,
```

### IP geolocation utility — `lib/collect-location.ts`
Client-side utility. Called from the dashboard (`app/(app)/home/page.tsx`) via `useEffect` after the user profile loads.

- Reads the user doc first. If `data.lat` is already set, exits immediately (one-time only).
- Calls `http://ip-api.com/json/?fields=lat,lon,city,regionName,countryCode` (no browser permission needed — IP-based).
- If `countryCode` is `US`, `CA`, or `MX`, writes `{ lat, lng, city, state, country }` to `users/{uid}` via the client Firestore SDK (`getClientDb()`).
- If the user is outside North America, silently exits — no write.
- All errors are swallowed silently — location is non-critical.
- Rate limit: ip-api.com free tier is 45 req/min. Since this runs once per user lifetime, it won't be an issue at any realistic scale.

---

## 2. API Route — `app/api/map-users/route.ts`

- Auth-gated: reads the `session` cookie and verifies it with `getAdminAuth().verifySessionCookie()`. Returns 401 if missing or invalid.
- Queries Firestore via `getAdminDb()` for all docs in `users` where `country in ["US", "CA", "MX"]` and `lat != null`.
- Returns only `{ locations: Array<{ lat: number; lng: number }> }` — zero PII.
- Response header: `Cache-Control: s-maxage=60, stale-while-revalidate`.
- Requires a Firestore composite index on `(country ASC, lat ASC)`.

---

## 3. Map Component — `components/community/NorthAmericaMap.tsx`

Client component (`"use client"`). Pure SVG, zero third-party map libraries.

### Grid config
| Parameter | Value |
|-----------|-------|
| Columns | 120 |
| Rows | 90 |
| Dot spacing | 9px |
| Dot radius (land) | 3px |
| Dot radius (user) | 3.5px |
| Lat range | 7°N – 72°N |
| Lng range | -168°W – -52°W |
| SVG viewBox | `0 0 1080 810` |

### Land detection
Uses a simplified Natural Earth GeoJSON bundled at `data/north-america.geojson` (~50KB). For each grid cell, the cell's lat/lng is projected and tested with a point-in-polygon algorithm against the GeoJSON feature collection. Only cells that fall inside a land polygon are rendered — ocean cells produce no dot.

### Dot styles
- **Land dot (no user):** `fill="#2A2A2A"` — subtle dark grey
- **User dot:** `fill="#4D8EFF"`, SVG `filter` with `feGaussianBlur` for glow effect, `animate-pulse` CSS class
- **Background:** `#0E0E0E` (the map container background, no dots rendered outside land)

### Performance
All dots are rendered as a single SVG with ~10,800 potential cells (most culled by GeoJSON check). No virtualization needed — SVG handles this size without issue.

### Props
```ts
interface Props {
  userLocations: Array<{ lat: number; lng: number }>;
}
```

Renders gracefully with zero users — just the grey dot continent outline.

---

## 4. Community Page — `app/(app)/community/page.tsx`

Server component. Inside the `(app)` route group, so it inherits the sidebar layout automatically.

- Fetches from `/api/map-users` using `fetch` with `{ next: { revalidate: 60 } }`.
- Passes `locations` to `<NorthAmericaMap userLocations={locations} />`.
- Page header: `font-headline text-3xl font-bold` title "The Podium Network", `text-outline` subtitle "DECA competitors preparing from coast to coast."
- Live badge overlaid on map (bottom-left): pulsing `#4EDEA5` dot + "{n} competitors mapped", frosted glass pill (`backdrop-blur(16px)`, `bg-white/5`).
- Stats row below map: competitor count.

---

## 5. Navigation

### Sidebar — `components/layout/Sidebar.tsx`
Add to `SECONDARY_ITEMS` above Themes:
```ts
{ href: "/community", label: "Community", icon: "public" }
```

### Bottom nav — `components/layout/BottomNav.tsx`
Add to `MORE_ITEMS` above Themes:
```ts
{ href: "/community", label: "Community", icon: "public" }
```

---

## 6. Files Changed / Created

| File | Action |
|------|--------|
| `lib/actions/onboarding.ts` | Add `lat/lng/city/state/country: null` to initial doc write |
| `lib/collect-location.ts` | **New** — IP geolocation utility |
| `app/(app)/home/page.tsx` | Call `collectUserLocation(uid)` in `useEffect` after profile loads |
| `app/api/map-users/route.ts` | **New** — auth-gated, returns `[{lat,lng}]` |
| `data/north-america.geojson` | **New** — simplified Natural Earth GeoJSON (~50KB) |
| `components/community/NorthAmericaMap.tsx` | **New** — SVG dot grid map component |
| `app/(app)/community/page.tsx` | **New** — Community page |
| `components/layout/Sidebar.tsx` | Add Community to `SECONDARY_ITEMS` |
| `components/layout/BottomNav.tsx` | Add Community to `MORE_ITEMS` |

---

## 7. Out of Scope

- No landing page map section (auth-gated only)
- No GPS/browser geolocation prompt or nudge component
- No user-visible location controls or opt-out UI
- No Mapbox / Leaflet / any map library dependency
