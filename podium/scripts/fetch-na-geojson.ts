import { writeFileSync } from "fs";
import { join } from "path";

const NA_CODES = new Set(["US", "CA", "MX", "GT", "BZ", "HN", "SV", "NI", "CR", "PA", "CU"]);
const SOURCE =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

async function main() {
  console.log("Downloading countries GeoJSON...");
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as { type: string; features: Array<{ properties: { "ISO3166-1-Alpha-2": string } }> };

  const filtered = {
    type: "FeatureCollection",
    features: data.features.filter((f) => NA_CODES.has(f.properties["ISO3166-1-Alpha-2"])),
  };

  const outPath = join(process.cwd(), "data", "north-america.json");
  writeFileSync(outPath, JSON.stringify(filtered));
  console.log(`✓ Wrote ${filtered.features.length} features to data/north-america.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
