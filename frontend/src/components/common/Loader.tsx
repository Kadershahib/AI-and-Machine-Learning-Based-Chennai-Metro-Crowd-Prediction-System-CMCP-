import { Train } from "lucide-react";

export default function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-metro-blue/20" />
        <Train size={18} className="text-metro-blue" />
      </div>
      <span className="text-xs uppercase tracking-widest text-ink-muted">{label}</span>
    </div>
  );
}
