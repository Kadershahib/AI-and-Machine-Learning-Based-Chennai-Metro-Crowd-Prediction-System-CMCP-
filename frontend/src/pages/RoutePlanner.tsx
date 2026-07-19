import { useState } from "react";
import { useStations } from "../hooks/useStations";
import { fetchBestTravelTime } from "../services/predictionService";
import RoutePlannerForm from "../components/route-planner/RoutePlannerForm";
import RouteResult from "../components/route-planner/RouteResult";
import Loader from "../components/common/Loader";

export default function RoutePlanner() {
  const { stations, loading } = useStations();
  const [result, setResult] = useState<any>(null);
  const [fetching, setFetching] = useState(false);

  const handleSubmit = async (values: { fromStationId: string; toStationId: string }) => {
    const from = stations.find((s) => s.id === values.fromStationId);
    const to = stations.find((s) => s.id === values.toStationId);
    if (!from || !to) return;

    setFetching(true);
    try {
      const data = await fetchBestTravelTime(from, to);
      setResult(data);
    } finally {
      setFetching(false);
    }
  };

  if (loading) return <Loader label="Loading stations" />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-primary">Route Planner</h1>
        <p className="text-sm text-ink-muted">
          Find the least-crowded time to travel between two stations
        </p>
      </div>

      <RoutePlannerForm stations={stations} onSubmit={handleSubmit} loading={fetching} />

      <div className="mt-6">
        {result && <RouteResult result={result} />}
      </div>
    </div>
  );
}
