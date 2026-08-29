export type Box = { left: number; top: number; width: number; height: number };

type Props = {
  label: string;
  box: Box;
  debug: boolean;
  onSelect: (center: { x: number; y: number }) => void;
};

export function Hitbox({ label, box, debug, onSelect }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => onSelect({ x: box.left + box.width / 2, y: box.top + box.height / 2 })}
      style={{
        left: `${box.left}%`,
        top: `${box.top}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
      }}
      className={`group absolute cursor-pointer rounded-md transition duration-300 ${
        debug
          ? "border border-red-300 bg-red-500/50"
          : "bg-transparent hover:bg-white/6 hover:shadow-[0_0_40px_8px_rgba(255,255,255,0.08)] hover:ring-1 hover:ring-white/25"
      }`}
    >
      {debug ? (
        <span className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-[10px] text-white">
          {label}
        </span>
      ) : (
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md border border-white/10 bg-black/70 px-2 py-1 font-mono text-[10px] whitespace-nowrap text-white/80 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          {label}
        </span>
      )}
    </button>
  );
}
