import { NorthAmericaMap } from "@/components/community/NorthAmericaMap";
import { getMapLocations, type MapLocation } from "@/lib/map-users";

export default async function CommunityPage() {
  let locations: MapLocation[] = [];
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

      <div className="relative max-w-3xl mx-auto">
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
