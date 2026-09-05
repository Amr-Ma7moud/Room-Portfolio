export const card = "rounded-lg border border-white/10 bg-white/5 p-4";

export const statusConfig = {
  active: {
    label: "Active",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse",
  },
  completed: {
    label: "Shipped",
    className: "border-sky-500/40 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400",
  },
  wip: {
    label: "WIP",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
  },
} as const;

export type StatusKey = keyof typeof statusConfig;
