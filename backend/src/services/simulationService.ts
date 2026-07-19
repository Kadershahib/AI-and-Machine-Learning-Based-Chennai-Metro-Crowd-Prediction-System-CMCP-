import prisma from "../config/db";
import { getBatchPredictions } from "./mlApiService";

const WEATHER_OPTIONS = ["Clear", "Cloudy", "Light Rain"];

/**
 * Builds a live prediction snapshot across all stations for the current
 * simulated hour. Chennai Metro has no public live-data feed, so this
 * simulates a live feed for demonstration purposes — disclosed in the
 * project report methodology.
 */
export async function generateLiveSnapshot() {
  const stations = await prisma.station.findMany();
  const now = new Date();
  const weekday = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0=Mon
  const hour = now.getHours();
  const weather = WEATHER_OPTIONS[Math.floor(Math.random() * WEATHER_OPTIONS.length)];

  const items = stations.map((s) => ({
    station: s.name,
    weekday,
    is_weekend: weekday >= 5 ? 1 : 0,
    hour: Math.max(5, Math.min(22, hour)),
    station_tier: s.tier,
    is_interchange: s.isInterchange ? 1 : 0,
    is_it_corridor: s.isItCorridor ? 1 : 0,
    is_festival: 0,
    weather,
    line: s.line,
  }));

  const results = await getBatchPredictions(items);
  return results.map((r) => ({
    ...r,
    weather,
    timestamp: now.toISOString(),
  }));
}
