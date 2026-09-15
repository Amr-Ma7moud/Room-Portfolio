import type { LucideIcon } from "lucide-react";

export type Box = { left: number; top: number; width: number; height: number };

type Props = {
  label: string;
  box: Box;
  debug: boolean;
  icon?: LucideIcon;
  isGuided?: boolean;
  isIdle?: boolean;
  onSelect: (center: { x: number; y: number }) => void;
};

export function Hitbox({ label, box, debug, icon: Icon, isGuided = false, isIdle = false, onSelect }: Props) {
  return (
    <button
      type="button"
      aria-label={`Open ${label}`}
      title={label}
      onClick={() => onSelect({ x: box.left + box.width / 2, y: box.top + box.height / 2 })}
      style={{
        left: `${box.left}%`,
        top: `${box.top}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
      }}
      className={`group absolute cursor-pointer rounded-md transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
        debug
          ? "border border-red-300 bg-red-500/50"
          : isGuided
            ? "bg-emerald-300/10 ring-1 ring-emerald-300/80 shadow-[0_0_28px_7px_rgba(110,231,183,0.35)] animate-pulse motion-reduce:animate-none"
            : isIdle
              ? "bg-emerald-300/5 animate-breathe"
              : "bg-transparent hover:bg-emerald-300/10 hover:shadow-[0_0_40px_8px_rgba(110,231,183,0.25)] hover:ring-1 hover:ring-emerald-300/50"
      }`}
    >
      {debug ? (
        <span className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-[10px] text-white">
          {label}
        </span>
      ) : (
        <div className="pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-3 py-1.5 font-mono text-xs whitespace-nowrap text-white opacity-0 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-visible:-translate-y-1 group-focus-visible:opacity-100">
          {Icon && <Icon className="h-3.5 w-3.5 text-emerald-300" />}
          <span>{isGuided ? `Click to open ${label}` : label}</span>
        </div>
      )}
    </button>
  );
}
