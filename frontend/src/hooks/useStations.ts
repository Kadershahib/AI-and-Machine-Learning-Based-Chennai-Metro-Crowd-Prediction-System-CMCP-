import { useEffect, useState } from "react";
import { Station, MetroLine } from "../types";
import { fetchStations } from "../services/stationService";

export function useStations(line?: MetroLine) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStations(line)
      .then(setStations)
      .finally(() => setLoading(false));
  }, [line]);

  return { stations, loading };
}
