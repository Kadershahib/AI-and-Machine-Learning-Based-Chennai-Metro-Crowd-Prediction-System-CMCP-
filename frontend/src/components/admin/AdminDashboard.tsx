import { LogOut, Database, Cpu, RefreshCw } from "lucide-react";
import Button from "../common/Button";

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink-primary">
          Admin Control Panel
        </h2>
        <Button variant="ghost" icon={<LogOut size={14} />} onClick={onLogout}>
          Sign out
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-base-700 bg-base-800/40 p-5">
          <Database size={16} className="mb-2 text-metro-blue" />
          <div className="text-sm font-medium text-ink-primary">Data Source</div>
          <p className="mt-1 text-xs text-ink-muted">
            Synthetic ridership dataset · 31 stations · 120 days simulated
          </p>
        </div>
        <div className="rounded-2xl border border-base-700 bg-base-800/40 p-5">
          <Cpu size={16} className="mb-2 text-metro-green" />
          <div className="text-sm font-medium text-ink-primary">Model Status</div>
          <p className="mt-1 text-xs text-ink-muted">
            XGBoost classifier · 88.7% accuracy · SHAP-enabled
          </p>
        </div>
        <div className="rounded-2xl border border-base-700 bg-base-800/40 p-5">
          <RefreshCw size={16} className="mb-2 text-crowd-medium" />
          <div className="text-sm font-medium text-ink-primary">Live Simulation</div>
          <p className="mt-1 text-xs text-ink-muted">
            Broadcasting updates every 15 seconds via Socket.IO
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-base-700 bg-base-800/40 p-5">
        <p className="text-sm text-ink-muted">
          This is a lightweight admin surface for the project demo — in a production system
          this panel would trigger model retraining, view raw prediction logs, and manage
          station metadata directly from the connected PostgreSQL database via Prisma.
        </p>
      </div>
    </div>
  );
}
