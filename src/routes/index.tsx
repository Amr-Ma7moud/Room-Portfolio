import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Bug,
  Cpu,
  FileText,
  FolderGit2,
  Mail,
  MessageSquareQuote,
  Sparkles,
  Terminal as TerminalIcon,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import data from "@/data/portfolio.json";
import desktopBg from "@/assets/landscapeView.png.asset.json";
import mobileBg from "@/assets/mobileView.png.asset.json";
import { Hitbox } from "@/components/room/Hitbox";
import { GlassModal } from "@/components/room/GlassModal";
import { Terminal } from "@/components/room/Terminal";
import { EasterEggTerminal } from "@/components/room/EasterEggTerminal";
import {
  CertificatesPanel,
  ContactPanel,
  NeofetchPanel,
  ProjectsPanel,
  ResumePanel,
  SkillsPanel,
  TestimonialsPanel,
} from "@/components/room/panels";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amr Mahmoud — Escape Room Portfolio" },
      {
        name: "description",
        content:
          "An interactive escape-room portfolio set in a dark Arch Linux battlestation. Click the room to explore projects, skills and live terminals.",
      },
      { property: "og:title", content: "Amr Mahmoud — Escape Room Portfolio" },
      {
        property: "og:description",
        content:
          "Explore a backend engineer's portfolio by clicking around a dark, aesthetic coding room — complete with working terminals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Room,
});

type Kind = (typeof data.hitboxes)[number]["kind"];

const meta: Record<string, { title: string; subtitle: string; icon: LucideIcon; size: "sm" | "md" | "lg" }> = {
  resume: { title: "Resume", subtitle: "the short version", icon: FileText, size: "md" },
  skills: { title: "Skills", subtitle: "the toolbox", icon: Wrench, size: "md" },
  projects: { title: "Projects", subtitle: "things that shipped", icon: FolderGit2, size: "lg" },
  certificates: { title: "Certificates", subtitle: "paper trail", icon: Award, size: "md" },
  contact: { title: "Contact", subtitle: "say hello", icon: Mail, size: "md" },
  testimonials: { title: "Testimonials", subtitle: "what people say", icon: MessageSquareQuote, size: "md" },
  neofetch: { title: "Neofetch", subtitle: "btw i use arch", icon: Cpu, size: "md" },
  terminal: { title: "Terminal", subtitle: "keep calm and sudo on", icon: TerminalIcon, size: "lg" },
  easteregg: { title: "root@localhost", subtitle: "unauthorized access", icon: Sparkles, size: "md" },
};

function Panel({ kind, onClose }: { kind: Kind; onClose: () => void }) {
  switch (kind) {
    case "resume":
      return <ResumePanel />;
    case "skills":
      return <SkillsPanel />;
    case "projects":
      return <ProjectsPanel />;
    case "certificates":
      return <CertificatesPanel />;
    case "contact":
      return <ContactPanel />;
    case "testimonials":
      return <TestimonialsPanel />;
    case "neofetch":
      return <NeofetchPanel />;
    case "terminal":
      return <Terminal onClose={onClose} />;
    case "easteregg":
      return <EasterEggTerminal />;
    default:
      return null;
  }
}

function Room() {
  const [active, setActive] = useState<Kind | null>(null);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [debug, setDebug] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key.toLowerCase() === "d" && e.shiftKey && !active) setDebug((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, active]);

  const info = active ? meta[active] : undefined;

  return (
    <main className="relative h-[100svh] w-screen overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${isMobile ? mobileBg.url : desktopBg.url})`,
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
        animate={{ scale: active ? 1.7 : 1, filter: active ? "blur(3px) brightness(0.6)" : "blur(0px) brightness(1)" }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0">
          {data.hitboxes.map((h) => (
            <Hitbox
              key={h.id}
              label={h.label}
              box={isMobile ? h.mobile : h.desktop}
              debug={debug}
              onSelect={(center) => {
                setOrigin(center);
                setActive(h.kind);
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
        <div className="min-w-0 rounded-lg border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-md">
          <h1 className="truncate font-mono text-sm tracking-[0.22em] text-emerald-300 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {data.profile.name}
          </h1>
          <p className="truncate font-mono text-[11px] text-white/70">
            click around the room · esc to exit
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDebug((v) => !v)}
          aria-label="Toggle debug hitboxes"
          className="pointer-events-auto grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/10 bg-black/30 text-white/25 opacity-30 backdrop-blur-sm transition hover:opacity-100"
        >
          <Bug className="h-3.5 w-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {active && info ? (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
          >
            <GlassModal
              title={info.title}
              subtitle={info.subtitle}
              icon={info.icon}
              size={info.size}
              onClose={close}
            >
              <Panel kind={active} onClose={close} />
            </GlassModal>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
