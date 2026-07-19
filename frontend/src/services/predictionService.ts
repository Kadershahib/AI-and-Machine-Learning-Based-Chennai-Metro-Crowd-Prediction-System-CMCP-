import api from "./api";
import { Station, HourlyPrediction, LiveStationSnapshot, Prediction } from "../types";
import { mockDayPredictions, mockLiveSnapshot, mockCrowdForStationHour, mockConfidence } from "../utils/mockData";

export async function fetchDayPredictions(station: Station): Promise<HourlyPrediction[]> {
  try {
    const { data } = await api.get(`/predictions/station/${station.id}/day`);
    return data.predictions.map((p: any) => ({
      hour: p.hour,
      crowd_level: p.crowd_level,
      confidence: p.confidence,
    }));
  } catch {
    return mockDayPredictions(station);
  }
}

export async function fetchLiveSnapshot(): Promise<LiveStationSnapshot[]> {
  try {
    const { data } = await api.get("/predictions/live");
    return data;
  } catch {
    return mockLiveSnapshot();
  }
}

export async function fetchStationPrediction(
  station: Station,
  hour: number,
  weather = "Clear"
): Promise<Prediction> {
  try {
    const { data } = await api.post(`/predictions/station/${station.id}`, { hour, weather });
    return data;
  } catch {
    const level = mockCrowdForStationHour(station, hour);
    const confidence = mockConfidence(station, hour);
    return {
      crowd_level: level,
      confidence,
      probabilities: {
        Low: level === "Low" ? confidence : (1 - confidence) / 2,
        Medium: level === "Medium" ? confidence : (1 - confidence) / 2,
        High: level === "High" ? confidence : (1 - confidence) / 2,
      },
      explanation: [
        { feature: "Hour of day", impact: 0.6, direction: "increases" },
        { feature: "Station size/importance", impact: 0.3, direction: "increases" },
      ],
    };
  }
}

export async function fetchBestTravelTime(fromStation: Station, toStation: Station) {
  try {
    const { data } = await api.post("/route/best-time", {
      fromStationId: fromStation.id,
      toStationId: toStation.id,
    });
    return data;
  } catch {
    const hours = Array.from({ length: 18 }, (_, i) => i + 5);
    const levelScore = { Low: 0, Medium: 1, High: 2 };
    const scored = hours.map((hour) => {
      const fromLevel = mockCrowdForStationHour(fromStation, hour);
      const toLevel = mockCrowdForStationHour(toStation, hour);
      return {
        hour,
        fromPred: { crowd_level: fromLevel, confidence: mockConfidence(fromStation, hour) },
        toPred: { crowd_level: toLevel, confidence: mockConfidence(toStation, hour) },
        combinedScore: levelScore[fromLevel] + levelScore[toLevel],
      };
    });
    scored.sort((a, b) => a.combinedScore - b.combinedScore);
    return {
      from: fromStation.name,
      to: toStation.name,
      bestWindow: scored[0],
      worstWindow: scored[scored.length - 1],
      allHours: scored,
    };
  }
}
