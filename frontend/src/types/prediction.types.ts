export type CrowdLevel = "Low" | "Medium" | "High";

export interface PredictionExplanation {
  feature: string;
  impact: number;
  direction: "increases" | "decreases";
}

export interface Prediction {
  crowd_level: CrowdLevel;
  confidence: number;
  probabilities: Record<CrowdLevel, number>;
  explanation: PredictionExplanation[];
}

export interface HourlyPrediction {
  hour: number;
  crowd_level: CrowdLevel;
  confidence: number;
}

export interface LiveStationSnapshot {
  station: string;
  hour: number;
  crowd_level: CrowdLevel;
  confidence: number;
  weather: string;
  timestamp: string;
}
