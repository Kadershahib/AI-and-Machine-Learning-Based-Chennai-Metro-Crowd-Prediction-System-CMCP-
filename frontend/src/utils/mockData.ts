import { Station, CrowdLevel, HourlyPrediction } from "../types";

export const MOCK_STATIONS: Station[] = [
  { id: "s1", name: "Wimco Nagar", line: "Blue", tier: 1, isInterchange: false, isItCorridor: false, latitude: 13.1305, longitude: 80.2957, order: 1 },
  { id: "s2", name: "Washermanpet", line: "Blue", tier: 2, isInterchange: false, isItCorridor: false, latitude: 13.1156, longitude: 80.2887, order: 2 },
  { id: "s3", name: "Mannadi", line: "Blue", tier: 2, isInterchange: false, isItCorridor: false, latitude: 13.1055, longitude: 80.2875, order: 3 },
  { id: "s4", name: "High Court", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0946, longitude: 80.2864, order: 4 },
  { id: "s5", name: "Central (Chennai Central)", line: "Blue", tier: 5, isInterchange: true, isItCorridor: false, latitude: 13.0827, longitude: 80.2757, order: 5 },
  { id: "s6", name: "Government Estate", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0722, longitude: 80.2707, order: 6 },
  { id: "s7", name: "LIC", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0654, longitude: 80.2654, order: 7 },
  { id: "s8", name: "Thousand Lights", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0602, longitude: 80.2564, order: 8 },
  { id: "s9", name: "AG-DMS", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0517, longitude: 80.2499, order: 9 },
  { id: "s10", name: "Teynampet", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.043, longitude: 80.2495, order: 10 },
  { id: "s11", name: "Nandanam", line: "Blue", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0335, longitude: 80.2422, order: 11 },
  { id: "s12", name: "Saidapet", line: "Blue", tier: 4, isInterchange: true, isItCorridor: false, latitude: 13.0212, longitude: 80.2222, order: 12 },
  { id: "s13", name: "Guindy", line: "Blue", tier: 5, isInterchange: true, isItCorridor: true, latitude: 13.0067, longitude: 80.2206, order: 13 },
  { id: "s14", name: "Alandur", line: "Blue", tier: 5, isInterchange: true, isItCorridor: true, latitude: 12.9974, longitude: 80.2007, order: 14 },
  { id: "s15", name: "Nanganallur Road", line: "Blue", tier: 3, isInterchange: false, isItCorridor: true, latitude: 12.9873, longitude: 80.1927, order: 15 },
  { id: "s16", name: "Meenambakkam", line: "Blue", tier: 4, isInterchange: false, isItCorridor: false, latitude: 12.9868, longitude: 80.1706, order: 16 },
  { id: "s17", name: "Airport", line: "Blue", tier: 5, isInterchange: false, isItCorridor: false, latitude: 12.993, longitude: 80.1698, order: 17 },
  { id: "g1", name: "Egmore", line: "Green", tier: 5, isInterchange: true, isItCorridor: false, latitude: 13.0732, longitude: 80.2609, order: 1 },
  { id: "g2", name: "Nehru Park", line: "Green", tier: 2, isInterchange: false, isItCorridor: false, latitude: 13.0783, longitude: 80.2497, order: 2 },
  { id: "g3", name: "Kilpauk Medical College", line: "Green", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0798, longitude: 80.2404, order: 3 },
  { id: "g4", name: "Pachaiyappas College", line: "Green", tier: 2, isInterchange: false, isItCorridor: false, latitude: 13.0817, longitude: 80.2306, order: 4 },
  { id: "g5", name: "Shenoy Nagar", line: "Green", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0821, longitude: 80.2223, order: 5 },
  { id: "g6", name: "Anna Nagar East", line: "Green", tier: 4, isInterchange: false, isItCorridor: false, latitude: 13.085, longitude: 80.2101, order: 6 },
  { id: "g7", name: "Anna Nagar Tower", line: "Green", tier: 4, isInterchange: false, isItCorridor: false, latitude: 13.0866, longitude: 80.2076, order: 7 },
  { id: "g8", name: "Thirumangalam", line: "Green", tier: 4, isInterchange: true, isItCorridor: false, latitude: 13.0819, longitude: 80.2013, order: 8 },
  { id: "g9", name: "Koyambedu", line: "Green", tier: 5, isInterchange: false, isItCorridor: false, latitude: 13.0694, longitude: 80.1958, order: 9 },
  { id: "g10", name: "CMBT", line: "Green", tier: 5, isInterchange: false, isItCorridor: false, latitude: 13.0688, longitude: 80.1948, order: 10 },
  { id: "g11", name: "Arumbakkam", line: "Green", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0733, longitude: 80.2115, order: 11 },
  { id: "g12", name: "Vadapalani", line: "Green", tier: 4, isInterchange: false, isItCorridor: true, latitude: 13.0503, longitude: 80.2126, order: 12 },
  { id: "g13", name: "Ashok Nagar", line: "Green", tier: 3, isInterchange: false, isItCorridor: false, latitude: 13.0357, longitude: 80.2101, order: 13 },
  { id: "g14", name: "Ekkattuthangal", line: "Green", tier: 3, isInterchange: false, isItCorridor: true, latitude: 13.0198, longitude: 80.2029, order: 14 },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** Deterministic pseudo-prediction so the same station/hour always renders the same demo value. */
export function mockCrowdForStationHour(station: Station, hour: number): CrowdLevel {
  const peakBoost = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20) ? 0.4 : 0;
  const tierBoost = station.tier * 0.08;
  const interchangeBoost = station.isInterchange ? 0.2 : 0;
  const noise = seededRandom(station.order * 31 + hour * 7 + station.name.length);
  const score = peakBoost + tierBoost + interchangeBoost + noise * 0.3;

  if (score < 0.45) return "Low";
  if (score < 0.75) return "Medium";
  return "High";
}

export function mockConfidence(station: Station, hour: number): number {
  const noise = seededRandom(station.order * 13 + hour * 3);
  return 0.78 + noise * 0.2;
}

export function mockDayPredictions(station: Station): HourlyPrediction[] {
  return Array.from({ length: 18 }, (_, i) => i + 5).map((hour) => ({
    hour,
    crowd_level: mockCrowdForStationHour(station, hour),
    confidence: mockConfidence(station, hour),
  }));
}

export function mockLiveSnapshot() {
  const hour = new Date().getHours();
  return MOCK_STATIONS.map((s) => ({
    station: s.name,
    hour,
    crowd_level: mockCrowdForStationHour(s, hour),
    confidence: mockConfidence(s, hour),
    weather: "Clear",
    timestamp: new Date().toISOString(),
  }));
}
