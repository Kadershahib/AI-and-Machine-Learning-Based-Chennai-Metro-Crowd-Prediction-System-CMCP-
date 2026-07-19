import { Request, Response } from "express";
import prisma from "../config/db";
import { getPrediction } from "../services/mlApiService";

/**
 * Suggests the best travel hour between two stations by scanning
 * predicted crowd levels across the operating day and recommending
 * the lowest-crowd window.
 */
export async function suggestBestTime(req: Request, res: Response) {
  const { fromStationId, toStationId } = req.body;

  const [from, to] = await Promise.all([
    prisma.station.findUnique({ where: { id: fromStationId } }),
    prisma.station.findUnique({ where: { id: toStationId } }),
  ]);

  if (!from || !to) return res.status(404).json({ error: "Station not found" });

  const date = new Date();
  const weekday = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const hours = Array.from({ length: 18 }, (_, i) => i + 5);

  const scored = await Promise.all(
    hours.map(async (hour) => {
      const [fromPred, toPred] = await Promise.all([
        getPrediction({
          weekday,
          is_weekend: weekday >= 5 ? 1 : 0,
          hour,
          station_tier: from.tier,
          is_interchange: from.isInterchange ? 1 : 0,
          is_it_corridor: from.isItCorridor ? 1 : 0,
          is_festival: 0,
          weather: "Clear",
          line: from.line,
        }),
        getPrediction({
          weekday,
          is_weekend: weekday >= 5 ? 1 : 0,
          hour,
          station_tier: to.tier,
          is_interchange: to.isInterchange ? 1 : 0,
          is_it_corridor: to.isItCorridor ? 1 : 0,
          is_festival: 0,
          weather: "Clear",
          line: to.line,
        }),
      ]);

      const levelScore = { Low: 0, Medium: 1, High: 2 };
      const combinedScore =
        levelScore[fromPred.crowd_level] + levelScore[toPred.crowd_level];

      return { hour, fromPred, toPred, combinedScore };
    })
  );

  scored.sort((a, b) => a.combinedScore - b.combinedScore);

  res.json({
    from: from.name,
    to: to.name,
    bestWindow: scored[0],
    worstWindow: scored[scored.length - 1],
    allHours: scored,
  });
}
