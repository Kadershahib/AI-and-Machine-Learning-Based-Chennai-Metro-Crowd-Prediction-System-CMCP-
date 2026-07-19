import { useState } from "react";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import Button from "../common/Button";
import api from "../../services/api";

interface FormValues {
  email: string;
  password: string;
}

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit } = useForm<FormValues>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", values);
      localStorage.setItem("cmcp_admin_token", data.token);
      onSuccess();
    } catch {
      setError("Invalid credentials, or backend not running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-base-700 bg-base-800/40 p-6 shadow-panel">
      <div className="mb-5 flex items-center gap-2">
        <Lock size={16} className="text-metro-blue" />
        <h2 className="font-display text-sm font-semibold text-ink-primary">Admin Access</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-ink-muted">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-sm text-ink-primary focus:border-metro-blue focus:outline-none"
            placeholder="admin@cmcp.local"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-ink-muted">Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-sm text-ink-primary focus:border-metro-blue focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-xs text-crowd-high">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
