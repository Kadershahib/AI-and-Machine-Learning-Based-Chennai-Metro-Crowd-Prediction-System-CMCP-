import { useEffect, useState } from "react";
import { Station, HourlyPrediction } from "../types";
import { fetchDayPredictions } from "../services/predictionService";

export function useDayPrediction(station: Station | null) {
  const [predictions, setPredictions] = useState<HourlyPrediction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!station) {
      setPredictions([]);
      return;
    }
    setLoading(true);
    fetchDayPredictions(station)
      .then(setPredictions)
      .finally(() => setLoading(false));
  }, [station]);

  return { predictions, loading };
}
