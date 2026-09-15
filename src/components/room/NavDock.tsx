import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  kind: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

type Props = {
  items: NavItem[];
  activeKind: string | null;
  onSelect: (kind: string) => void;
};

export function NavDock({ items, activeKind, onSelect }: Props) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-30 -translate-x-1/2 sm:bottom-6">
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 rounded-2xl border border-white/10 bg-black/60 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-x-auto max-w-[95vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((item) => {
          const isActive = activeKind === item.kind;
          return (
            <button
              key={item.kind}
              onClick={() => onSelect(item.kind)}
              className="group relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label={item.label}
              title={item.label}
            >
              <item.icon
                className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-300 ${
                  isActive ? "text-emerald-400" : "text-white/60 group-hover:text-white"
                }`}
              />

              {/* Tooltip */}
              <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-black/80 px-2 py-1 font-mono text-[10px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap border border-white/10">
                {item.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 h-1 w-4 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
