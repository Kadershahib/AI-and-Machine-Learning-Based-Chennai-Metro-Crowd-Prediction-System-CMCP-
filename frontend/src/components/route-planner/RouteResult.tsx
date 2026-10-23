import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatHour, formatHourShort } from "../../utils/formatTime";
import { crowdColor } from "../../utils/crowdColorMap";
import { CrowdLevel } from "../../types";

interface StationPred {
  crowd_level: CrowdLevel;
  confidence: number;
}

interface HourSlot {
  hour: number;
  fromPred: StationPred;
  toPred: StationPred;
  combinedScore: number;
}

interface Props {
  result: {
    from: string;
    to: string;
    bestWindow: HourSlot;
    worstWindow: HourSlot;
    allHours: HourSlot[];
  };
}

function levelFromScore(score: number): CrowdLevel {
  if (score <= 0) return "Low";
  if (score <= 2) return "Medium";
  return "High";
}

const VERDICT: Record<CrowdLevel, string> = {
  Low: "Good time to travel — stations are quiet.",
  Medium: "Moderately busy — expect some crowding.",
  High: "Very crowded right now — consider waiting.",
};

function formatNow(d: Date) {
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

function Chip({ name, level }: { name: string; level: CrowdLevel }) {
  return (
    <span
      className="rounded-full px-2 py-1"
      style={{ backgroundColor: `${crowdColor[level]}22`, color: crowdColor[level] }}
    >
      {name}: {level}
    </span>
  );
}

function WindowCard({
  title, slot, from, to, good,
}: { title: string; slot: HourSlot; from: string; to: string; good: boolean }) {
  const Icon = good ? CheckCircle2 : XCircle;
  return (
    <div
      className={`rounded-2xl border p-5 ${
        good ? "border-crowd-low/30 bg-crowd-low/5" : "border-crowd-high/30 bg-crowd-high/5"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className={good ? "text-crowd-low" : "text-crowd-high"} />
        <span className="text-sm font-medium text-ink-primary">{title}</span>
      </div>
      <div className="font-display text-2xl font-semibold text-ink-primary">
        {formatHour(slot.hour)}
      </div>
      <p className="mt-1 text-xs text-ink-muted">
        {from} → {to}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <Chip name={from} level={slot.fromPred.crowd_level} />
        <Chip name={to} level={slot.toPred.crowd_level} />
      </div>
    </div>
  );
}

export default function RouteResult({ result }: Props) {
  const { from, to, bestWindow, worstWindow, allHours } = result;

  // live clock so "right now" stays accurate while the page is open
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const slots = [...allHours].sort((a, b) => a.hour - b.hour);
  const firstHour = slots[0].hour;
  const lastHour = slots[slots.length - 1].hour;
  const currentHour = now.getHours();

  const isOpen = currentHour >= firstHour && currentHour <= lastHour;
  const nowSlot = slots.find((s) => s.hour === currentHour);
  const nowLevel = nowSlot ? levelFromScore(nowSlot.combinedScore) : null;

  let nextLine = "";
  if (nowSlot) {
    const nextBetter = slots.find(
      (s) => s.hour > currentHour && s.combinedScore < nowSlot.combinedScore
    );
    if (nextBetter) {
      nextLine = `It gets quieter at ${formatHour(nextBetter.hour)} (${levelFromScore(
        nextBetter.combinedScore
      )} crowd).`;
    } else if (nowSlot.combinedScore === 0) {
      nextLine = "This is already the quietest level.";
    } else {
      nextLine = "No quieter time left today — travel now, or try early tomorrow morning.";
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* RIGHT NOW */}
      {isOpen && nowSlot && nowLevel ? (
        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: `${crowdColor[nowLevel]}55`,
            backgroundColor: `${crowdColor[nowLevel]}0F`,
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: crowdColor[nowLevel] }} />
              <span className="text-sm font-medium text-ink-primary">Right now</span>
            </div>
            <span className="font-mono text-sm text-ink-secondary">{formatNow(now)}</span>
          </div>
          <div
            className="font-display text-2xl font-semibold"
            style={{ color: crowdColor[nowLevel] }}
          >
            {nowLevel} crowd
          </div>
          <p className="mt-1 text-sm text-ink-secondary">{VERDICT[nowLevel]}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Chip name={from} level={nowSlot.fromPred.crowd_level} />
            <Chip name={to} level={nowSlot.toPred.crowd_level} />
          </div>
          <p className="mt-4 text-xs text-ink-muted">{nextLine}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-base-700 bg-base-800/40 p-5">
          <div className="mb-2 flex items-center gap-2">
            <Clock size={16} className="text-ink-muted" />
            <span className="text-sm font-medium text-ink-primary">
              Outside prediction hours ({formatNow(now)})
            </span>
          </div>
          <p className="text-sm text-ink-muted">
            Predictions cover {formatHour(firstHour)} – {formatHour(lastHour)}. Today's full
            timeline is shown below.
          </p>
        </div>
      )}

      {/* HOUR-BY-HOUR TIMELINE */}
      <div className="rounded-2xl border border-base-700 bg-base-800/40 p-5">
        <h3 className="font-display text-sm font-semibold text-ink-primary">
          Today's crowd timeline
        </h3>
        <p className="text-xs text-ink-muted">
          Combined crowd for {from} → {to}, hour by hour
        </p>

        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-2">
          {slots.map((s) => {
            const lvl = levelFromScore(s.combinedScore);
            const isNow = s.hour === currentHour;
            const isBest = s.hour === bestWindow.hour;
            return (
              <div key={s.hour} className="flex min-w-[40px] flex-1 flex-col items-center gap-1.5">
                <span
                  className="h-4 text-[10px] font-bold"
                  style={{ color: isNow ? "#F2F5FA" : crowdColor.Low }}
                >
                  {isNow ? "NOW" : isBest ? "BEST" : ""}
                </span>
                <div className="flex h-24 w-full items-end">
                  <div
                    className="w-full rounded-md"
                    style={{
                      height: `${28 + s.combinedScore * 17}px`,
                      backgroundColor: crowdColor[lvl],
                      opacity: isNow ? 1 : 0.8,
                      outline: isNow ? "2px solid #F2F5FA" : "none",
                      outlineOffset: 2,
                    }}
                  />
                </div>
                <span className="text-[11px] text-ink-muted">{formatHourShort(s.hour)}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex gap-4 text-xs text-ink-muted">
          {(["Low", "Medium", "High"] as CrowdLevel[]).map((l) => (
            <span key={l} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: crowdColor[l] }} />
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* BEST / BUSIEST */}
      <div className="grid gap-4 sm:grid-cols-2">
        <WindowCard title="Best time today" slot={bestWindow} from={from} to={to} good />
        <WindowCard title="Busiest time today" slot={worstWindow} from={from} to={to} good={false} />
      </div>
    </motion.div>
  );
}