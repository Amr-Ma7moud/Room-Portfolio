import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Sparkles, Zap } from "lucide-react";
import { statusConfig, type StatusKey } from "./shared";
import { ProjectDetail } from "./ProjectDetail";
import data from "@/data/portfolio.json";

type Project = typeof data.projects[number] & {
  role?: string;
  year?: string;
  highlights?: string[];
  imageDir?: string;
};

const projects = data.projects as Project[];

export function ProjectsPanel() {
  const allTags = Array.from(new Set(projects.flatMap((p) => p.stack)));
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const filtered = activeTag === null ? rest : rest.filter((p) => p.stack.includes(activeTag));
  const featuredVisible = activeTag === null || featured?.stack.includes(activeTag);

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-5"
    >
      {/* Stack filter chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All" active={activeTag === null} onClick={() => setActiveTag(null)} />
        {allTags.map((tag) => (
          <FilterChip
            key={tag}
            label={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          />
        ))}
      </div>

      {/* Featured project */}
      <AnimatePresence mode="wait">
        {featured && featuredVisible && (
          <motion.article
            key="featured"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setSelected(featured)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-black/30 to-black/20 p-5 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />

            <div className="absolute right-5 top-5 opacity-0 group-hover:opacity-100 transition duration-300">
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                View Details <ArrowLeft className="h-3 w-3 rotate-180" />
              </span>
            </div>

            <div className="flex items-start justify-between gap-3 pr-24">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                </span>
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-emerald-400/60 uppercase">
                    Featured
                  </p>
                  <h3 className="font-semibold text-white">{featured.name}</h3>
                </div>
              </div>
              <StatusBadge status={featured.status} />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/65">{featured.description}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {featured.stack.map((s) => (
                <StackTag
                  key={s}
                  tag={s}
                  active={activeTag === s}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTag(activeTag === s ? null : s);
                  }}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4">
              {featured.github && featured.github !== "#" && (
                <a
                  href={featured.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70 transition hover:bg-white/15 hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              )}
              {featured.demo && (
                <a
                  href={featured.demo}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs text-emerald-300 transition hover:bg-emerald-500/20"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                </a>
              )}
            </div>
          </motion.article>
        )}
      </AnimatePresence>

      {/* Other projects */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div key="grid" className="grid gap-4 sm:grid-cols-2">
            {filtered.map((p, idx) => (
              <motion.article
                key={p.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelected(p)}
                className="group relative cursor-pointer flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              >
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                  <span className="flex items-center gap-1 text-[10px] font-medium text-white/60 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                    View <ArrowLeft className="h-2.5 w-2.5 rotate-180" />
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 pr-12">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-white/10 bg-white/5">
                      <Zap className="h-3.5 w-3.5 text-white/50 transition-colors group-hover:text-emerald-300" />
                    </span>
                    <h3 className="font-semibold text-white/90 transition-colors group-hover:text-white">
                      {p.name}
                    </h3>
                  </div>
                  <StatusBadge status={p.status} small />
                </div>

                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-white/55">{p.description}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {p.stack.map((s) => (
                    <StackTag
                      key={s}
                      tag={s}
                      active={activeTag === s}
                      small
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTag(activeTag === s ? null : s);
                      }}
                    />
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
                  {p.github && p.github !== "#" && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/60 transition hover:bg-white/15 hover:text-white"
                    >
                      <Github className="h-3 w-3" /> Source
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-300 transition hover:bg-emerald-500/20"
                    >
                      <ExternalLink className="h-3 w-3" /> Demo
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 py-10 text-center"
          >
            <span className="font-mono text-sm text-white/30">
              no projects matching{" "}
              <span className="text-emerald-400/60">{activeTag}</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/50 transition hover:bg-white/15 hover:text-white"
            >
              clear filter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Small internal components ──────────────────────────────────────

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 font-mono text-xs transition-all duration-200 ${
        active
          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
          : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80"
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({
  status,
  small = false,
}: {
  status?: string;
  small?: boolean;
}) {
  if (!status || !statusConfig[status as StatusKey]) return null;
  const cfg = statusConfig[status as StatusKey];
  return (
    <span
      className={`flex shrink-0 items-center rounded-full border font-mono tracking-wider ${cfg.className} ${
        small ? "gap-1 px-2 py-0.5 text-[10px]" : "gap-1.5 px-2.5 py-1 text-[10px]"
      }`}
    >
      <span className={`rounded-full ${cfg.dot} ${small ? "h-1 w-1" : "h-1.5 w-1.5"}`} />
      {cfg.label}
    </span>
  );
}

function StackTag({
  tag,
  active,
  small = false,
  onClick,
}: {
  tag: string;
  active: boolean;
  small?: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <span
      onClick={onClick}
      className={`cursor-pointer rounded-md border font-mono transition-all duration-150 ${
        small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"
      } ${
        active
          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
          : "border-white/10 bg-black/30 text-emerald-200/70 hover:border-emerald-500/30 hover:text-emerald-200"
      }`}
    >
      {tag}
    </span>
  );
}
