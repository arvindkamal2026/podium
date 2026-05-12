"use client";

import { useMemo } from "react";
import { pointInFeatureCollection } from "@/lib/geo/point-in-polygon";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const geoData = require("@/data/north-america.json") as {
  features: Array<{ geometry: { type: string; coordinates: number[][][] | number[][][][] } }>;
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

// Pre-compute land cells once at module load
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
