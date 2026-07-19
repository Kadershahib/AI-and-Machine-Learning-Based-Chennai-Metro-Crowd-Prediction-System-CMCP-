import L from "leaflet";
import { CrowdLevel } from "../../types";
import { crowdColor } from "../../utils/crowdColorMap";

export function buildStationIcon(level: CrowdLevel, isInterchange: boolean) {
  const color = crowdColor[level];
  const size = isInterchange ? 18 : 14;
  const pulse = level === "High" ? `<span class="marker-pulse" style="background:${color}"></span>` : "";

  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        ${pulse}
        <div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${color};
          border:2px solid #0A0F1C;
          box-shadow: 0 0 8px ${color}99;
        "></div>
      </div>
      <style>
        .marker-pulse {
          position:absolute; inset:-6px; border-radius:50%;
          opacity:0.35; animation: markerPulse 1.6s ease-out infinite;
        }
        @keyframes markerPulse {
          0% { transform: scale(0.6); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
