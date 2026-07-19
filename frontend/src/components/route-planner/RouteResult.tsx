import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { formatHour } from "../../utils/formatTime";
import { crowdColor } from "../../utils/crowdColorMap";
import { CrowdLevel } from "../../types";

interface WindowInfo {
  hour: number;
  fromPred: { crowd_level: CrowdLevel; confidence: number };
  toPred: { crowd_level: CrowdLevel; confidence: number };
}

interface Props {
  result: {
    from: string;
    to: string;
    bestWindow: WindowInfo;
    worstWindow: WindowInfo;
  };
}

export default function RouteResult({ result }: Props) {
  const { from, to, bestWindow, worstWindow } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="rounded-2xl border border-crowd-low/30 bg-crowd-low/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-crowd-low" />
          <span className="text-sm font-medium text-ink-primary">Recommended window</span>
        </div>
        <div className="font-display text-2xl font-semibold text-ink-primary">
          {formatHour(bestWindow.hour)}
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          {from} → {to}
        </p>
        <div className="mt-3 flex gap-2 text-xs">
          <span
            className="rounded-full px-2 py-1"
            style={{
              backgroundColor: `${crowdColor[bestWindow.fromPred.crowd_level]}22`,
              color: crowdColor[bestWindow.fromPred.crowd_level],
            }}
          >
            {from}: {bestWindow.fromPred.crowd_level}
          </span>
          <span
            className="rounded-full px-2 py-1"
            style={{
              backgroundColor: `${crowdColor[bestWindow.toPred.crowd_level]}22`,
              color: crowdColor[bestWindow.toPred.crowd_level],
            }}
          >
            {to}: {bestWindow.toPred.crowd_level}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-crowd-high/30 bg-crowd-high/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <XCircle size={16} className="text-crowd-high" />
          <span className="text-sm font-medium text-ink-primary">Avoid this window</span>
        </div>
        <div className="font-display text-2xl font-semibold text-ink-primary">
          {formatHour(worstWindow.hour)}
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          {from} → {to}
        </p>
        <div className="mt-3 flex gap-2 text-xs">
          <span
            className="rounded-full px-2 py-1"
            style={{
              backgroundColor: `${crowdColor[worstWindow.fromPred.crowd_level]}22`,
              color: crowdColor[worstWindow.fromPred.crowd_level],
            }}
          >
            {from}: {worstWindow.fromPred.crowd_level}
          </span>
          <span
            className="rounded-full px-2 py-1"
            style={{
              backgroundColor: `${crowdColor[worstWindow.toPred.crowd_level]}22`,
              color: crowdColor[worstWindow.toPred.crowd_level],
            }}
          >
            {to}: {worstWindow.toPred.crowd_level}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
