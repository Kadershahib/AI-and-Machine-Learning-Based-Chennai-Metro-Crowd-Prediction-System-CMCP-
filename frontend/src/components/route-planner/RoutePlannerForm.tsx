import { useForm } from "react-hook-form";
import { Station } from "../../types";
import { ArrowRight, Navigation } from "lucide-react";
import Button from "../common/Button";

interface FormValues {
  fromStationId: string;
  toStationId: string;
}

interface Props {
  stations: Station[];
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
}

export default function RoutePlannerForm({ stations, onSubmit, loading }: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const from = watch("fromStationId");
  const to = watch("toStationId");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-base-700 bg-base-800/40 p-5 shadow-panel"
    >
      <div className="mb-4 flex items-center gap-2">
        <Navigation size={16} className="text-metro-blue" />
        <h3 className="font-display text-sm font-semibold text-ink-primary">
          Plan Your Journey
        </h3>
      </div>

      <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr_auto]">
        <div>
          <label className="mb-1.5 block text-xs text-ink-muted">From</label>
          <select
            {...register("fromStationId", { required: true })}
            className="w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-sm text-ink-primary focus:border-metro-blue focus:outline-none"
          >
            <option value="">Select station</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === to}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <ArrowRight size={18} className="hidden text-ink-faint sm:block sm:mb-3" />

        <div>
          <label className="mb-1.5 block text-xs text-ink-muted">To</label>
          <select
            {...register("toStationId", { required: true })}
            className="w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-sm text-ink-primary focus:border-metro-blue focus:outline-none"
          >
            <option value="">Select station</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === from}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={loading} className="sm:mb-0">
          {loading ? "Analyzing..." : "Find Best Time"}
        </Button>
      </div>
    </form>
  );
}
