import { CrowdLevel } from "../types";

export const crowdColor: Record<CrowdLevel, string> = {
  Low: "#22C55E",
  Medium: "#F5A623",
  High: "#EF4444",
};

export const crowdColorDim: Record<CrowdLevel, string> = {
  Low: "#22C55E33",
  Medium: "#F5A62333",
  High: "#EF444433",
};

export const crowdLabel: Record<CrowdLevel, string> = {
  Low: "Low crowd",
  Medium: "Moderate crowd",
  High: "High crowd",
};

export function crowdFromPercent(percent: number): CrowdLevel {
  if (percent < 35) return "Low";
  if (percent < 70) return "Medium";
  return "High";
}

export const lineColor: Record<string, string> = {
  Blue: "#2E6FE0",
  Green: "#22B573",
};
