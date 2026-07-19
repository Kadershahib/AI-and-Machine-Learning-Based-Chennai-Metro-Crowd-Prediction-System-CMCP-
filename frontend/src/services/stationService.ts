import api from "./api";
import { Station } from "../types";
import { MOCK_STATIONS } from "../utils/mockData";

export async function fetchStations(line?: "Blue" | "Green"): Promise<Station[]> {
  try {
    const { data } = await api.get<Station[]>("/stations", { params: { line } });
    return data;
  } catch {
    // Backend not running — fall back to local demo data so the UI still works.
    return line ? MOCK_STATIONS.filter((s) => s.line === line) : MOCK_STATIONS;
  }
}

export async function fetchStationById(id: string): Promise<Station | undefined> {
  try {
    const { data } = await api.get<Station>(`/stations/${id}`);
    return data;
  } catch {
    return MOCK_STATIONS.find((s) => s.id === id);
  }
}
