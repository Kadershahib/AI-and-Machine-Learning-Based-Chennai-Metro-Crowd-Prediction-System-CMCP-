import { motion } from "framer-motion";
import { Users, TrendingUp, AlertTriangle, Activity } from "lucide-react";
import { CrowdLevel } from "../../types";
import { crowdColor } from "../../utils/crowdColorMap";

interface Props {
  totalStations: number;
  highCrowdCount: number;
  avgConfidence: number;
  dominantLevel: CrowdLevel;
}

export default function StatsCards({
  totalStations,
  highCrowdCount,
  avgConfidence,
  dominantLevel,
}: Props) {
  const cards = [
    {
      label: "Stations Monitored",
      value: totalStations,
      icon: Activity,
      accent: "#2E6FE0",
    },
    {
      label: "High-Crowd Alerts",
      value: highCrowdCount,
      icon: AlertTriangle,
      accent: crowdColor.High,
    },
    {
      label: "Model Confidence",
      value: `${Math.round(avgConfidence * 100)}%`,
      icon: TrendingUp,
      accent: "#22B573",
    },
    {
      label: "Network Status",
      value: dominantLevel,
      icon: Users,
      accent: crowdColor[dominantLevel],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="rounded-2xl border border-base-700 bg-base-800/40 p-4 shadow-panel"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">{card.label}</span>
            <card.icon size={15} style={{ color: card.accent }} />
          </div>
          <div
            className="mt-2 font-display text-2xl font-semibold tabular-nums"
            style={{ color: card.accent }}
          >
            {card.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
