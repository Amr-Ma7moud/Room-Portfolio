import { Terminal as TerminalIcon } from "lucide-react";
import data from "@/data/portfolio.json";

export function NeofetchPanel() {
  return (
    <div className="rounded-lg border border-white/10 bg-black/60 p-4 font-mono text-[13px]">
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-white/50">
        <TerminalIcon className="h-3.5 w-3.5" /> {data.profile.handle}
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <pre className="hidden text-emerald-400/80 sm:block">{`      /\\
     /  \\
    /\\   \\
   /      \\
  /   ,,   \\
 /   |  |   \\
/_-''    ''-_\\`}</pre>
        <div className="min-w-0 space-y-0.5">
          <p className="text-emerald-300">{data.profile.handle}</p>
          <p className="text-white/30">-----------------</p>
          {data.neofetch.lines.map(([k, v]) => (
            <p key={String(k)} className="break-words">
              <span className="text-emerald-300">{k}: </span>
              <span className="text-white/80">{v}</span>
            </p>
          ))}
          <div className="mt-3 flex gap-1">
            {["bg-red-400", "bg-amber-300", "bg-emerald-400", "bg-sky-400", "bg-violet-400", "bg-white/70"].map(
              (c) => (
                <span key={c} className={`h-3 w-6 rounded-sm ${c}`} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
