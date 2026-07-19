import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Map, Route, Zap, ShieldCheck, BarChart3 } from "lucide-react";
import Button from "../components/common/Button";

const FEATURES = [
  {
    icon: Brain,
    title: "XGBoost Prediction Engine",
    desc: "88.7% accurate crowd-level classification with SHAP explainability for every prediction.",
    color: "#2E6FE0",
  },
  {
    icon: Map,
    title: "Live Network Map",
    desc: "Real geographic map of Blue &amp; Green line stations, color-coded by predicted crowd density.".replace("&amp;", "&"),
    color: "#22B573",
  },
  {
    icon: Route,
    title: "Smart Route Planner",
    desc: "Get the best time window to travel between any two stations based on forecasted crowd.",
    color: "#F5A623",
  },
  {
    icon: Zap,
    title: "Real-Time Simulation",
    desc: "Socket.IO powered live updates simulate a real operational monitoring feed.",
    color: "#2E6FE0",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Heatmaps and trend charts reveal weekly and hourly ridership patterns at a glance.",
    color: "#22B573",
  },
  {
    icon: ShieldCheck,
    title: "Admin Controls",
    desc: "Lightweight authenticated panel for monitoring model and data pipeline health.",
    color: "#F5A623",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Hero */}
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-base-700 bg-base-800/60 px-3 py-1.5 text-xs text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-crowd-low animate-pulse-slow" />
            MCA Final Year Project · AI/ML System
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink-primary sm:text-5xl">
            Predicting Chennai Metro{" "}
            <span className="bg-gradient-to-r from-metro-blue to-metro-green bg-clip-text text-transparent">
              Crowd Density
            </span>{" "}
            Before It Happens
          </h1>
          <p className="mt-4 max-w-lg text-ink-secondary">
            CMCP uses machine learning to forecast station-level passenger crowding across
            the Chennai Metro network — helping commuters plan smarter and operators respond
            faster.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard">
              <Button icon={<ArrowRight size={16} />}>View Live Dashboard</Button>
            </Link>
            <Link to="/map">
              <Button variant="secondary" icon={<Map size={16} />}>
                Explore Network Map
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex gap-8 border-t border-base-700 pt-6">
            <div>
              <div className="font-display text-2xl font-semibold text-ink-primary">88.7%</div>
              <div className="text-xs text-ink-muted">Model Accuracy</div>
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-ink-primary">31</div>
              <div className="text-xs text-ink-muted">Stations Tracked</div>
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-ink-primary">2</div>
              <div className="text-xs text-ink-muted">Metro Lines</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-metro-blue/20 to-metro-green/10 blur-2xl" />
          <div className="relative rounded-2xl border border-base-700 bg-base-800/60 p-6 shadow-panel">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-ink-muted">
                Live Snapshot
              </span>
              <span className="flex items-center gap-1.5 text-xs text-crowd-low">
                <span className="h-1.5 w-1.5 rounded-full bg-crowd-low animate-pulse-slow" />
                Simulated
              </span>
            </div>
            {[
              { name: "Guindy · Blue/Green", level: "High", pct: 82 },
              { name: "Alandur · Interchange", level: "Medium", pct: 58 },
              { name: "Airport", level: "Low", pct: 24 },
              { name: "Koyambedu", level: "Medium", pct: 61 },
            ].map((s, i) => (
              <div key={s.name} className="mb-3 last:mb-0">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink-secondary">{s.name}</span>
                  <span className="font-mono text-ink-muted">{s.pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-base-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        s.level === "High" ? "#EF4444" : s.level === "Medium" ? "#F5A623" : "#22C55E",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="mt-24">
        <h2 className="font-display text-2xl font-semibold text-ink-primary">
          Built for Real Operational Decisions
        </h2>
        <p className="mt-2 text-ink-muted">
          A full-stack AI/ML system spanning prediction, visualization, and planning.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="rounded-2xl border border-base-700 bg-base-800/40 p-5 transition-colors hover:border-base-500"
            >
              <div
                className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${f.color}22` }}
              >
                <f.icon size={17} style={{ color: f.color }} />
              </div>
              <h3 className="font-display text-sm font-semibold text-ink-primary">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
