import { card } from "./shared";
import data from "@/data/portfolio.json";

export function CertificatesPanel() {
  return (
    <div className="space-y-3">
      {data.certificates.map((c) => (
        <div
          key={c.title}
          className={`${card} grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4`}
        >
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{c.title}</h3>
            <p className="text-xs text-white/55">{c.issuer}</p>
            <p className="mt-1 text-sm text-white/50">{c.detail}</p>
          </div>
          <span className="shrink-0 font-mono text-xs text-emerald-300/80">{c.year}</span>
        </div>
      ))}
    </div>
  );
}
