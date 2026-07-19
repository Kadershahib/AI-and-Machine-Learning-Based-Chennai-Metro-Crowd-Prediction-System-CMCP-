import { Request, Response } from "express";
import prisma from "../config/db";
import { getPrediction } from "../services/mlApiService";
import { generateLiveSnapshot } from "../services/simulationService";

export async function predictForStation(req: Request, res: Response) {
  const { stationId } = req.params;
  const { hour, weather = "Clear", isFestival = false } = req.body;

  const station = await prisma.station.findUnique({ where: { id: stationId } });
  if (!station) return res.status(404).json({ error: "Station not found" });

  const date = new Date();
  const weekday = date.getDay() === 0 ? 6 : date.getDay() - 1;

  try {
    const result = await getPrediction({
      weekday,
      is_weekend: weekday >= 5 ? 1 : 0,
      hour,
      station_tier: station.tier,
      is_interchange: station.isInterchange ? 1 : 0,
      is_it_corridor: station.isItCorridor ? 1 : 0,
      is_festival: isFestival ? 1 : 0,
      weather,
      line: station.line,
    });

    await prisma.prediction.create({
      data: {
        stationId: station.id,
        hour,
        crowdLevel: result.crowd_level,
        crowdPercent: result.probabilities[result.crowd_level] * 100,
        confidence: result.confidence,
        weather,
        isFestival: !!isFestival,
      },
    });

    res.json(result);
  } catch (err) {
    console.error("[predictForStation] ML service unreachable:", (err as Error).message);
    res.status(503).json({ error: "ML service unavailable, please ensure it is running on port 5001" });
  }
}

export async function predictDayForStation(req: Request, res: Response) {
  const { stationId } = req.params;
  const station = await prisma.station.findUnique({ where: { id: stationId } });
  if (!station) return res.status(404).json({ error: "Station not found" });

  const date = new Date();
  const weekday = date.getDay() === 0 ? 6 : date.getDay() - 1;

  const hours = Array.from({ length: 18 }, (_, i) => i + 5); // 5am - 10pm

  try {
    const predictions = await Promise.all(
      hours.map((hour) =>
        getPrediction({
          weekday,
          is_weekend: weekday >= 5 ? 1 : 0,
          hour,
          station_tier: station.tier,
          is_interchange: station.isInterchange ? 1 : 0,
          is_it_corridor: station.isItCorridor ? 1 : 0,
          is_festival: 0,
          weather: "Clear",
          line: station.line,
        }).then((r) => ({ hour, ...r }))
      )
    );
    res.json({ station: station.name, predictions });
  } catch (err) {
    console.error("[predictDayForStation] ML service unreachable:", (err as Error).message);
    res.status(503).json({ error: "ML service unavailable, please ensure it is running on port 5001" });
  }
}

export async function getLiveSnapshot(req: Request, res: Response) {
  const snapshot = await generateLiveSnapshot();
  res.json(snapshot);
}