import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bug, Github, Linkedin, Mail } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import data from "@/data/portfolio.json";
import desktopBg from "@/assets/landscapeView.png";
import mobileBg from "@/assets/mobileView.png";
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
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: data.siteMeta.title },
      {
        name: "description",
        content: data.siteMeta.description,
      },
      { property: "og:title", content: data.siteMeta.ogTitle },
      {
        property: "og:description",
        content: data.siteMeta.ogDescription,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Room,
});

type Kind = (typeof data.hitboxes)[number]["kind"];

const meta = Object.fromEntries(
  Object.entries(data.panelMeta).map(([key, val]) => [
    key,
    { ...val, icon: (Icons as any)[val.icon] as LucideIcon },
  ])
) as Record<string, { title: string; subtitle: string; icon: LucideIcon; size: "sm" | "md" | "lg" }>;

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
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: isMobile ? "max(100vw, 100vh * 1086 / 1448)" : "max(100vw, 100vh * 1448 / 1086)",
          height: isMobile ? "max(100vh, 100vw * 1448 / 1086)" : "max(100vh, 100vw * 1086 / 1448)",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-no-repeat pointer-events-auto"
          style={{
            backgroundImage: `url(${isMobile ? mobileBg : desktopBg})`,
            backgroundSize: "100% 100%",
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
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
        <div className="justify-self-start flex flex-col min-w-0 px-4 py-3">
          <h1 className="truncate font-mono text-xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
            {data.profile.name}
          </h1>
          <div className="mt-2 flex w-full items-center justify-between pointer-events-auto">
            {data.profile.github && data.profile.github !== "#" && (
              <a href={data.profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-8 w-8 items-center justify-center text-white/70 transition-all duration-200 hover:scale-110 hover:text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Github className="h-5 w-5" />
              </a>
            )}
            {data.profile.linkedin && data.profile.linkedin !== "#" && (
              <a href={data.profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-8 w-8 items-center justify-center text-white/70 transition-all duration-200 hover:scale-110 hover:text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {data.profile.email && data.profile.email !== "#" && (
              <a href={`mailto:${data.profile.email}`} aria-label="Email" className="flex h-8 w-8 items-center justify-center text-white/70 transition-all duration-200 hover:scale-110 hover:text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Mail className="h-5 w-5" />
              </a>
            )}
            {data.profile.whatsapp && data.profile.whatsapp !== "#" && (
              <a href={`https://wa.me/${data.profile.whatsapp.replace(/[^0-9]/g, "")}`} aria-label="Whatsapp" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center text-white/70 transition-all duration-200 hover:scale-110 hover:text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <WhatsappIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
        {import.meta.env.DEV && (
          <button
            type="button"
            onClick={() => setDebug((v) => !v)}
            aria-label="Toggle debug hitboxes"
            className="pointer-events-auto grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/10 bg-black/30 text-white/25 opacity-30 backdrop-blur-sm transition hover:opacity-100"
          >
            <Bug className="h-3.5 w-3.5" />
          </button>
        )}
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
