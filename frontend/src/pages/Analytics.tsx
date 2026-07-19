import { useState } from "react";
import { useStations } from "../hooks/useStations";
import { useDayPrediction } from "../hooks/usePrediction";
import TrendLineChart from "../components/dashboard/TrendLineChart";
import CrowdHeatmap from "../components/dashboard/CrowdHeatmap";
import Loader from "../components/common/Loader";
import { Station } from "../types";

export default function Analytics() {
  const { stations, loading } = useStations();
  const [selected, setSelected] = useState<Station | null>(null);
  const { predictions, loading: predLoading } = useDayPrediction(selected);

  if (loading) return <Loader label="Loading analytics" />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-primary">Analytics</h1>
        <p className="text-sm text-ink-muted">
          Explore hourly and weekly ridership patterns per station
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {stations.slice(0, 12).map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              selected?.id === s.id
                ? "border-metro-blue bg-metro-blue/15 text-ink-primary"
                : "border-base-700 text-ink-muted hover:border-base-500"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {selected ? (
          predLoading ? (
            <Loader label="Forecasting" />
          ) : (
            <TrendLineChart predictions={predictions} stationName={selected.name} />
          )
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-base-700 p-10 text-center text-sm text-ink-muted">
            Select a station above to view its hourly forecast
          </div>
        )}
        <CrowdHeatmap stations={stations} />
      </div>
    </div>
  );
}
