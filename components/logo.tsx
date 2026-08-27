import { Sparkles } from "lucide-react";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[rgb(var(--brand))] text-white shadow-lg shadow-violet-500/20">
        <Sparkles size={20} strokeWidth={2.2} />
      </div>
      {!compact && (
        <div>
          <div className="text-[15px] font-extrabold tracking-tight">LearnFlow AI</div>
          <div className="text-[11px] font-medium text-[rgb(var(--muted))]">Study smarter, not longer.</div>
        </div>
      )}
    </div>
  );
}
