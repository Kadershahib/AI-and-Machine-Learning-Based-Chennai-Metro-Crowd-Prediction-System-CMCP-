import axios from "axios";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:5001";

export interface PredictionRequest {
  weekday: number;
  is_weekend: number;
  hour: number;
  station_tier: number;
  is_interchange: number;
  is_it_corridor: number;
  is_festival: number;
  weather: string;
  line: string;
}

export interface PredictionResponse {
  crowd_level: "Low" | "Medium" | "High";
  confidence: number;
  probabilities: Record<string, number>;
  explanation: { feature: string; impact: number; direction: string }[];
}

export async function getPrediction(payload: PredictionRequest): Promise<PredictionResponse> {
  const { data } = await axios.post(`${ML_API_URL}/predict`, payload, { timeout: 8000 });
  return data;
}

export async function getBatchPredictions(items: (PredictionRequest & { station: string })[]) {
  const { data } = await axios.post(`${ML_API_URL}/predict/batch`, { items }, { timeout: 15000 });
  return data.results as { station: string; hour: number; crowd_level: string; confidence: number }[];
}

export async function getModelMetadata() {
  const { data } = await axios.get(`${ML_API_URL}/metadata`, { timeout: 5000 });
  return data;
}
