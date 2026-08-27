"use client";

import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CalendarDays,
  FileText,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  PanelsTopLeft
} from "lucide-react";
import Logo from "@/components/logo";
import { cn } from "@/lib/utils";

const items = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "topics", label: "Important topics", icon: BrainCircuit },
  { id: "flashcards", label: "Flashcards", icon: PanelsTopLeft },
  { id: "quiz", label: "MCQ quiz", icon: ListChecks },
  { id: "questions", label: "Short questions", icon: MessageSquareText },
  { id: "plan", label: "Study plan", icon: CalendarDays },
  { id: "exam", label: "Exam mode", icon: BookOpenCheck },
  { id: "progress", label: "Progress", icon: BarChart3 }
];

export default function Sidebar({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[254px] shrink-0 border-r border-[rgb(var(--border))] bg-[rgba(var(--panel),0.72)] px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="px-2 pb-7">
        <Logo />
      </div>

      <nav className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
                active === item.id
                  ? "bg-[rgba(var(--brand),0.12)] text-[rgb(var(--brand))]"
                  : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--panel-2))] hover:text-[rgb(var(--text))]"
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))] p-4">
        <div className="mb-1 flex items-center gap-2 text-sm font-bold">
          <HelpCircle size={16} />
          Study tip
        </div>
        <p className="m-0 text-xs leading-5 text-[rgb(var(--muted))]">
          Test yourself before rereading. Retrieval practice usually shows weak areas faster.
        </p>
      </div>
    </aside>
  );
}
