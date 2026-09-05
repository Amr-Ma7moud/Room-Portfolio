import data from "@/data/portfolio.json";

export function SkillsPanel() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {data.skills.map((s) => (
        <div
          key={s.name}
          className="group relative flex cursor-default items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
        >
          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="truncate font-mono text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-emerald-50">
            {s.name}
          </span>
        </div>
      ))}
    </div>
  );
}
