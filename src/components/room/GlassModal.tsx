import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export function GlassModal({ title, subtitle, icon: Icon, onClose, children, size = "md" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => e.stopPropagation()}
      className={`pointer-events-auto w-[92vw] ${sizes[size]} max-h-[85vh] overflow-hidden rounded-xl border border-white/10 bg-black/40 text-white shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md`}
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-white/10 bg-white/5 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/10">
            <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-mono text-sm tracking-[0.18em] uppercase">{title}</h2>
            {subtitle ? <p className="truncate text-xs text-white/50">{subtitle}</p> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </header>
      <div className="max-h-[calc(85vh-73px)] overflow-y-auto p-5">{children}</div>
    </motion.div>
  );
}
