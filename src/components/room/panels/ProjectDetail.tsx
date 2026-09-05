import { ArrowLeft, CheckCircle2, ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import { statusConfig, type StatusKey } from "./shared";
import { ImageCarousel } from "./ImageCarousel";
import data from "@/data/portfolio.json";

type Project = typeof data.projects[number] & {
  role?: string;
  year?: string;
  highlights?: string[];
  imageDir?: string;
};

type Props = {
  project: Project;
  onBack: () => void;
};

export function ProjectDetail({ project, onBack }: Props) {
  const status = project.status as StatusKey | undefined;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      {/* Header & Back */}
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <button
            onClick={onBack}
            className="mb-3 flex items-center gap-2 text-sm text-white/50 transition hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">{project.name}</h2>
            {status && statusConfig[status] && (
              <span
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wider ${statusConfig[status].className}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[status].dot}`} />
                {statusConfig[status].label}
              </span>
            )}
          </div>
          {project.role && project.year && (
            <p className="mt-1 font-mono text-xs text-white/40">
              {project.role} <span className="mx-1">•</span> {project.year}
            </p>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          {project.github && project.github !== "#" && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition hover:bg-emerald-500/20"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Image Carousel */}
      {project.imageDir && <ImageCarousel imageDir={project.imageDir} />}

      {/* Content */}
      <div className="grid gap-6 sm:grid-cols-[1fr_250px]">
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-mono text-sm tracking-widest text-emerald-400/60 uppercase">
              Overview
            </h3>
            <p className="text-sm leading-relaxed text-white/70">{project.description}</p>
          </div>

          {project.highlights && (
            <div>
              <h3 className="mb-3 font-mono text-sm tracking-widest text-emerald-400/60 uppercase">
                Key Highlights
              </h3>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/70" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 h-fit">
          <h3 className="mb-3 font-mono text-xs tracking-widest text-white/40 uppercase">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-[11px] text-emerald-200/70"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
