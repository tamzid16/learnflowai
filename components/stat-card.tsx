import { LucideIcon } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string; note: string }) {
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(var(--brand),0.1)] text-[rgb(var(--brand))]">
          <Icon size={17} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">{label}</span>
      </div>
      <div className="text-2xl font-black tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-[rgb(var(--muted))]">{note}</div>
    </div>
  );
}
