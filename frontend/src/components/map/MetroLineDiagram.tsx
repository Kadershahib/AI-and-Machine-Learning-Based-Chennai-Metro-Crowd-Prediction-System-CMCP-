import { useMemo } from "react";
import { motion } from "framer-motion";
import { Station } from "../../types";
import { CrowdLevel } from "../../types";
import { crowdColor } from "../../utils/crowdColorMap";
import { schematicPointsFor } from "../../utils/metroLineTopology";

interface Props {
  stations: Station[];
  crowdByStation: Record<string, CrowdLevel>;
  onSelectStation?: (stationName: string) => void;
  selectedStation?: string | null;
}

export default function MetroLineDiagram({
  stations,
  crowdByStation,
  onSelectStation,
  selectedStation,
}: Props) {
  const { blue, green } = useMemo(() => schematicPointsFor(stations), [stations]);

  const bluePath = blue.map((p) => `${p.x},${p.y}`).join(" ");
  const greenPath = green.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-base-700 bg-base-800/40 shadow-panel">
      <div className="flex items-center justify-between border-b border-base-700 px-5 py-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink-primary">
            Network Crowd Overview
          </h3>
          <p className="text-xs text-ink-muted">Schematic line diagram · live-simulated</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {(["Low", "Medium", "High"] as CrowdLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: crowdColor[level] }}
              />
              <span className="text-ink-muted">{level}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox="60 20 850 450" className="h-[420px] w-full">
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2E6FE0" />
            <stop offset="100%" stopColor="#1D4C9E" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22B573" />
            <stop offset="100%" stopColor="#178051" />
          </linearGradient>
        </defs>

        {/* Line tracks */}
        <polyline
          points={bluePath}
          fill="none"
          stroke="url(#blueGrad)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
        />
        <polyline
          points={greenPath}
          fill="none"
          stroke="url(#greenGrad)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
        />

        {/* Blue line stations */}
        {blue.map((p) => {
          const level = crowdByStation[p.stationName] || "Low";
          const isSelected = selectedStation === p.stationName;
          return (
            <g
              key={p.stationName}
              className="cursor-pointer"
              onClick={() => onSelectStation?.(p.stationName)}
            >
              {level === "High" && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={11}
                  fill={crowdColor[level]}
                  opacity={0.25}
                  className="animate-pulse-fast"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isSelected ? 8 : 6}
                fill={crowdColor[level]}
                stroke="#0A0F1C"
                strokeWidth={2}
              />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                className="fill-ink-secondary font-body"
                style={{ fontSize: 8.5 }}
              >
                {p.stationName.length > 14
                  ? p.stationName.slice(0, 13) + "…"
                  : p.stationName}
              </text>
            </g>
          );
        })}

        {/* Green line stations */}
        {green.map((p) => {
          const level = crowdByStation[p.stationName] || "Low";
          const isSelected = selectedStation === p.stationName;
          return (
            <g
              key={p.stationName}
              className="cursor-pointer"
              onClick={() => onSelectStation?.(p.stationName)}
            >
              {level === "High" && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={11}
                  fill={crowdColor[level]}
                  opacity={0.25}
                  className="animate-pulse-fast"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isSelected ? 8 : 6}
                fill={crowdColor[level]}
                stroke="#0A0F1C"
                strokeWidth={2}
              />
              <text
                x={p.x}
                y={p.y + 18}
                textAnchor="middle"
                className="fill-ink-secondary font-body"
                style={{ fontSize: 8.5 }}
              >
                {p.stationName.length > 14
                  ? p.stationName.slice(0, 13) + "…"
                  : p.stationName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
