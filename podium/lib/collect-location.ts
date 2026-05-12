import { collectAndSaveLocation } from "@/lib/actions/location";

export async function collectUserLocation(): Promise<void> {
  try {
    await collectAndSaveLocation();
  } catch {
    // Location is non-critical — silently fail
  }
}
