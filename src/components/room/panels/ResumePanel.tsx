import { Download, Maximize2 } from "lucide-react";
import data from "@/data/portfolio.json";

export function ResumePanel() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-white/70 max-w-xl leading-relaxed">
          {data.resume.summary}
        </p>
        <div className="flex gap-2 shrink-0">
          <a
            href={data.profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20 text-white/80"
          >
            <Maximize2 className="h-3.5 w-3.5" /> Full Screen
          </a>
          <a
            href={data.profile.cvUrl}
            download
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium transition hover:bg-emerald-500/20 text-emerald-300"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-inner">
        <iframe
          src={`${data.profile.cvUrl}#view=FitH&toolbar=0`}
          className="w-full h-[60vh] min-h-[400px] border-none bg-white/5"
          title="Resume PDF"
        />
      </div>
    </div>
  );
}
