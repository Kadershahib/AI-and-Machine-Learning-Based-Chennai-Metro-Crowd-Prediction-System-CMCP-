import ReactECharts from "echarts-for-react";
import { Station } from "../../types";
import { mockCrowdForStationHour } from "../../utils/mockData";
import { WEEKDAY_LABELS } from "../../utils/formatTime";

interface Props {
  stations: Station[];
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 5);
const levelScore: Record<string, number> = { Low: 1, Medium: 2, High: 3 };

export default function CrowdHeatmap({ stations }: Props) {
  const topStations = stations.slice(0, 10);

  const data: [number, number, number][] = [];
  WEEKDAY_LABELS.forEach((_, dayIdx) => {
    HOURS.forEach((hour, hourIdx) => {
      const avg =
        topStations.reduce((sum, s) => {
          const level = mockCrowdForStationHour(s, hour);
          const dayBoost = dayIdx >= 5 ? 0.7 : 1;
          return sum + levelScore[level] * dayBoost;
        }, 0) / topStations.length;
      data.push([hourIdx, dayIdx, Math.round(avg * 10) / 10]);
    });
  });

  const option = {
    backgroundColor: "transparent",
    grid: { left: 60, right: 20, top: 20, bottom: 40 },
    tooltip: {
      backgroundColor: "#111A2E",
      borderColor: "#1D2C4A",
      textStyle: { color: "#F2F5FA", fontSize: 11 },
      formatter: (p: any) =>
        `${WEEKDAY_LABELS[p.data[1]]}, ${HOURS[p.data[0]]}:00 — Crowd index ${p.data[2]}`,
    },
    xAxis: {
      type: "category",
      data: HOURS.map((h) => `${h}`),
      splitArea: { show: false },
      axisLine: { lineStyle: { color: "#1D2C4A" } },
      axisLabel: { color: "#7C8AA5", fontSize: 10, interval: 1 },
    },
    yAxis: {
      type: "category",
      data: WEEKDAY_LABELS,
      splitArea: { show: false },
      axisLine: { lineStyle: { color: "#1D2C4A" } },
      axisLabel: { color: "#7C8AA5", fontSize: 11 },
    },
    visualMap: {
      min: 1,
      max: 3,
      show: false,
      inRange: { color: ["#22C55E", "#F5A623", "#EF4444"] },
    },
    series: [
      {
        type: "heatmap",
        data,
        itemStyle: { borderRadius: 3, borderColor: "#0A0F1C", borderWidth: 2 },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: "rgba(0,0,0,0.4)" } },
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-base-700 bg-base-800/40 p-5 shadow-panel">
      <h3 className="font-display text-sm font-semibold text-ink-primary">
        Weekly Crowd Pattern
      </h3>
      <p className="mb-3 text-xs text-ink-muted">Averaged across top 10 busiest stations</p>
      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  );
}
