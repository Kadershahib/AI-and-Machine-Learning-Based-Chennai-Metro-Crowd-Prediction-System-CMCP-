import { Request, Response } from "express";
import prisma from "../config/db";

export async function getAllStations(req: Request, res: Response) {
  const { line } = req.query;
  const stations = await prisma.station.findMany({
    where: line ? { line: String(line) } : undefined,
    orderBy: [{ line: "asc" }, { order: "asc" }],
  });
  res.json(stations);
}

export async function getStationById(req: Request, res: Response) {
  const station = await prisma.station.findUnique({
    where: { id: req.params.id },
  });
  if (!station) return res.status(404).json({ error: "Station not found" });
  res.json(station);
}
