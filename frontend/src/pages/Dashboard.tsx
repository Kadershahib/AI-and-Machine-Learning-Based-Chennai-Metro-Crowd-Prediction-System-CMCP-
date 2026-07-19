import { useMemo, useState } from "react";
import { useStations } from "../hooks/useStations";
import { useLiveCrowdUpdates } from "../hooks/useSocket";
import StatsCards from "../components/dashboard/StatsCards";
import MetroLineDiagram from "../components/map/MetroLineDiagram";
import CrowdHeatmap from "../components/dashboard/CrowdHeatmap";
import StationBarChart from "../components/dashboard/StationBarChart";
import Loader from "../components/common/Loader";
import { CrowdLevel } from "../types";
import { formatHour } from "../utils/formatTime";

export default function Dashboard() {
  const { stations, loading } = useStations();
  const { snapshot, lastUpdated, isLive } = useLiveCrowdUpdates();
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const crowdByStation = useMemo(() => {
    const map: Record<string, CrowdLevel> = {};
    snapshot.forEach((s) => {
      map[s.station] = s.crowd_level;
    });
    return map;
  }, [snapshot]);

  const stats = useMemo(() => {
    const highCount = snapshot.filter((s) => s.crowd_level === "High").length;
    const avgConf = snapshot.length
      ? snapshot.reduce((sum, s) => sum + s.confidence, 0) / snapshot.length
      : 0;
    const counts = { Low: 0, Medium: 0, High: 0 };
    snapshot.forEach((s) => counts[s.crowd_level]++);
    const dominant = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Low") as CrowdLevel;
    return { highCount, avgConf, dominant };
  }, [snapshot]);

  const currentHour = new Date().getHours();

  if (loading) return <Loader label="Loading network data" />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-primary">
            Operations Dashboard
          </h1>
          <p className="text-sm text-ink-muted">
            Network-wide crowd intelligence · {formatHour(currentHour)}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-crowd-low" : "bg-crowd-medium"} animate-pulse-slow`} />
          {isLive ? "Live feed" : "Simulated feed"} · updated {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      <div className="mb-6">
        <StatsCards
          totalStations={stations.length}
          highCrowdCount={stats.highCount}
          avgConfidence={stats.avgConf}
          dominantLevel={stats.dominant}
        />
      </div>

      <div className="mb-6">
        <MetroLineDiagram
          stations={stations}
          crowdByStation={crowdByStation}
          selectedStation={selectedStation}
          onSelectStation={setSelectedStation}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CrowdHeatmap stations={stations} />
        <StationBarChart stations={stations} hour={currentHour} />
      </div>
    </div>
  );
}
