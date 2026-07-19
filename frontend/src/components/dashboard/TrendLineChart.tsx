import ReactECharts from "echarts-for-react";
import { HourlyPrediction } from "../../types";
import { formatHourShort } from "../../utils/formatTime";
import { crowdColor } from "../../utils/crowdColorMap";

interface Props {
  predictions: HourlyPrediction[];
  stationName?: string;
}

const levelScore: Record<string, number> = { Low: 1, Medium: 2, High: 3 };

export default function TrendLineChart({ predictions, stationName }: Props) {
  const option = {
    backgroundColor: "transparent",
    grid: { left: 45, right: 20, top: 30, bottom: 30 },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#111A2E",
      borderColor: "#1D2C4A",
      textStyle: { color: "#F2F5FA", fontSize: 11 },
      formatter: (params: any) => {
        const p = params[0];
        const pred = predictions[p.dataIndex];
        return `${formatHourShort(pred.hour)} — <b>${pred.crowd_level}</b> (${Math.round(pred.confidence * 100)}% conf.)`;
      },
    },
    xAxis: {
      type: "category",
      data: predictions.map((p) => formatHourShort(p.hour)),
      axisLine: { lineStyle: { color: "#1D2C4A" } },
      axisLabel: { color: "#7C8AA5", fontSize: 10 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 3.5,
      splitLine: { lineStyle: { color: "#16213A" } },
      axisLabel: {
        color: "#7C8AA5",
        fontSize: 10,
        formatter: (v: number) => (v === 1 ? "Low" : v === 2 ? "Med" : v === 3 ? "High" : ""),
      },
    },
    series: [
      {
        type: "line",
        data: predictions.map((p) => levelScore[p.crowd_level]),
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { color: "#2E6FE0", width: 3 },
        itemStyle: {
          color: (p: any) => crowdColor[predictions[p.dataIndex].crowd_level],
          borderColor: "#0A0F1C",
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(46,111,224,0.25)" },
              { offset: 1, color: "rgba(46,111,224,0)" },
            ],
          },
        },
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-base-700 bg-base-800/40 p-5 shadow-panel">
      <h3 className="font-display text-sm font-semibold text-ink-primary">
        {stationName ? `${stationName} — Today's Forecast` : "Daily Crowd Trend"}
      </h3>
      <p className="mb-1 text-xs text-ink-muted">Predicted crowd level across operating hours</p>
      <ReactECharts option={option} style={{ height: 260 }} />
    </div>
  );
}
