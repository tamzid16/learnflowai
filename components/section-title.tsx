import { LucideIcon } from "lucide-react";

export default function SectionTitle({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[rgba(var(--brand),0.1)] text-[rgb(var(--brand))]">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="m-0 text-xl font-black tracking-tight">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[rgb(var(--muted))]">{description}</p>
      </div>
    </div>
  );
}
