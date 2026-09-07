export type Box = { left: number; top: number; width: number; height: number };

type Props = {
  label: string;
  box: Box;
  debug: boolean;
  isGuided?: boolean;
  onSelect: (center: { x: number; y: number }) => void;
};

export function Hitbox({ label, box, debug, isGuided = false, onSelect }: Props) {
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
            : "bg-transparent hover:bg-white/10 hover:shadow-[0_0_40px_8px_rgba(255,255,255,0.12)] hover:ring-1 hover:ring-white/35"
      }`}
    >
      {debug ? (
        <span className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-[10px] text-white">
          {label}
        </span>
      ) : (
        <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-md border border-white/15 bg-black/75 px-2 py-1 font-mono text-[10px] whitespace-nowrap text-white/90 opacity-0 shadow-lg backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
          {isGuided ? `Click to open ${label}` : label}
        </span>
      )}
    </button>
  );
}
