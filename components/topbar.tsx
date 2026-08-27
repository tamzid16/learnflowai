"use client";

import { Menu } from "lucide-react";
import Logo from "@/components/logo";
import ThemeToggle from "@/components/theme-toggle";

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[rgb(var(--border))] bg-[rgba(var(--panel),0.75)] px-4 backdrop-blur-xl md:px-7 lg:border-b-0 lg:bg-transparent">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onMenu}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))]"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
        <Logo compact />
      </div>
      <div className="hidden lg:block">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Learning workspace</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))] px-3 py-2 text-xs font-semibold text-[rgb(var(--muted))] sm:block">
          Local study engine
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
