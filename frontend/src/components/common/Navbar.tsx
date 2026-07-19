import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Train, Map, LayoutDashboard, Route, BarChart3, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { liveClock } from "../../utils/formatTime";
import { useSocketContext } from "../../context/SocketContext";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Train, end: true },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/map", label: "Live Map", icon: Map },
  { to: "/route-planner", label: "Route Planner", icon: Route },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Navbar() {
  const [clock, setClock] = useState(liveClock());
  const { connected } = useSocketContext();

  useEffect(() => {
    const id = setInterval(() => setClock(liveClock()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-base-700 bg-base-900/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-metro-blue to-metro-green">
              <Train size={16} className="text-base-950" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold tracking-wide text-ink-primary">
                CMCP
              </div>
              <div className="text-[10px] uppercase tracking-widest text-ink-muted">
                Crowd Intelligence
              </div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-ink-primary"
                      : "text-ink-muted hover:text-ink-secondary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={15} />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute inset-x-2 -bottom-[13px] h-[2px] bg-metro-blue"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-base-700 bg-base-800/60 px-3 py-1.5 sm:flex">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? "bg-crowd-low animate-pulse-slow" : "bg-ink-faint"
              }`}
            />
            <span className="text-[11px] uppercase tracking-wider text-ink-muted">
              {connected ? "Live feed" : "Simulated"}
            </span>
          </div>
          <div className="hidden font-mono text-sm tabular-nums text-ink-secondary sm:block">
            {clock}
          </div>
          <NavLink
            to="/admin"
            className="flex items-center gap-1.5 rounded-md border border-base-700 px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-metro-blue/50 hover:text-ink-primary"
          >
            <ShieldCheck size={13} />
            <span className="hidden sm:inline">Admin</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
