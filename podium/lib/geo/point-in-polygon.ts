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
