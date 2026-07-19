import { useMemo, useState } from "react";
import { useStations } from "../hooks/useStations";
import { useLiveCrowdUpdates } from "../hooks/useSocket";
import MetroMap from "../components/map/MetroMap";
import Loader from "../components/common/Loader";
import { CrowdLevel, MetroLine } from "../types";
import { formatHour } from "../utils/formatTime";

const LINE_FILTERS: (MetroLine | "All")[] = ["All", "Blue", "Green"];

export default function MapView() {
  const { stations, loading } = useStations();
  const { snapshot } = useLiveCrowdUpdates();
  const [lineFilter, setLineFilter] = useState<MetroLine | "All">("All");

  const crowdByStation = useMemo(() => {
    const map: Record<string, CrowdLevel> = {};
    snapshot.forEach((s) => (map[s.station] = s.crowd_level));
    return map;
  }, [snapshot]);

  const confidenceByStation = useMemo(() => {
    const map: Record<string, number> = {};
    snapshot.forEach((s) => (map[s.station] = s.confidence));
    return map;
  }, [snapshot]);

  const filtered =
    lineFilter === "All" ? stations : stations.filter((s) => s.line === lineFilter);

  const currentHour = new Date().getHours();

  if (loading) return <Loader label="Loading station map" />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-primary">Live Network Map</h1>
          <p className="text-sm text-ink-muted">
            Geographic view · predicted crowd at {formatHour(currentHour)}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-base-700 bg-base-800/60 p-1">
          {LINE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setLineFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                lineFilter === f
                  ? "bg-metro-blue text-white"
                  : "text-ink-muted hover:text-ink-primary"
              }`}
            >
              {f} {f !== "All" ? "Line" : ""}
            </button>
          ))}
        </div>
      </div>

      <MetroMap
        stations={filtered}
        crowdByStation={crowdByStation}
        confidenceByStation={confidenceByStation}
        hour={currentHour}
      />
    </div>
  );
}
