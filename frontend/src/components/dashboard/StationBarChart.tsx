import ReactECharts from "echarts-for-react";
import { Station } from "../../types";
import { mockCrowdForStationHour } from "../../utils/mockData";
import { crowdColor } from "../../utils/crowdColorMap";

interface Props {
  stations: Station[];
  hour: number;
}

const levelScore: Record<string, number> = { Low: 1, Medium: 2, High: 3 };

export default function StationBarChart({ stations, hour }: Props) {
  const ranked = [...stations]
    .map((s) => ({ station: s, level: mockCrowdForStationHour(s, hour) }))
    .sort((a, b) => levelScore[b.level] - levelScore[a.level])
    .slice(0, 8);

  const option = {
    backgroundColor: "transparent",
    grid: { left: 130, right: 30, top: 10, bottom: 10 },
    tooltip: {
      backgroundColor: "#111A2E",
      borderColor: "#1D2C4A",
      textStyle: { color: "#F2F5FA", fontSize: 11 },
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 3,
      splitLine: { lineStyle: { color: "#16213A" } },
      axisLabel: { show: false },
    },
    yAxis: {
      type: "category",
      data: ranked.map((r) => r.station.name).reverse(),
      axisLine: { lineStyle: { color: "#1D2C4A" } },
      axisLabel: { color: "#B8C2D9", fontSize: 11 },
    },
    series: [
      {
        type: "bar",
        data: ranked.map((r) => levelScore[r.level]).reverse(),
        barWidth: 14,
        itemStyle: {
          borderRadius: [0, 6, 6, 0],
          color: (p: any) => crowdColor[ranked.slice().reverse()[p.dataIndex].level],
        },
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-base-700 bg-base-800/40 p-5 shadow-panel">
      <h3 className="font-display text-sm font-semibold text-ink-primary">
        Busiest Stations Right Now
      </h3>
      <p className="mb-2 text-xs text-ink-muted">Ranked by predicted crowd level</p>
      <ReactECharts option={option} style={{ height: 260 }} />
    </div>
  );
}
