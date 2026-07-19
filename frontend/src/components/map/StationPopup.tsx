import { Station, CrowdLevel } from "../../types";
import { crowdColor, crowdLabel } from "../../utils/crowdColorMap";
import { formatHour } from "../../utils/formatTime";

interface Props {
  station: Station;
  level: CrowdLevel;
  confidence: number;
  hour: number;
}

export default function StationPopup({ station, level, confidence, hour }: Props) {
  return (
    <div className="min-w-[180px] font-body">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-display text-sm font-semibold text-ink-primary">
          {station.name}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: `${crowdColor[level]}22`, color: crowdColor[level] }}
        >
          {level}
        </span>
      </div>
      <div className="text-xs text-ink-muted">
        {station.line} Line {station.isInterchange ? "· Interchange" : ""}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-ink-muted">{crowdLabel[level]} · {formatHour(hour)}</span>
        <span className="font-mono text-ink-secondary">{Math.round(confidence * 100)}%</span>
      </div>
    </div>
  );
}
