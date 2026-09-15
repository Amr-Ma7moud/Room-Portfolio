import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, lazy, Suspense } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  // Bottom bar icons
  Bug,
  Github,
  Linkedin,
  Mail,
  // Panel meta icons (replaces `import * as Icons`)
  FileText,
  Wrench,
  FolderGit2,
  Award,
  MessageSquareQuote,
  Cpu,
  Terminal as TerminalIcon,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import data from "@/data/portfolio.json";
import desktopBg from "@/assets/landscapeView.webp";
import mobileBg from "@/assets/mobileView.webp";
import { Hitbox } from "@/components/room/Hitbox";
import { GlassModal } from "@/components/room/GlassModal";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";

// ── Lazy-load every panel — none of these are needed on initial paint ──
const ResumePanel = lazy(() =>
  import("@/components/room/panels/ResumePanel").then((m) => ({ default: m.ResumePanel })),
);
const SkillsPanel = lazy(() =>
  import("@/components/room/panels/SkillsPanel").then((m) => ({ default: m.SkillsPanel })),
);
const ProjectsPanel = lazy(() =>
  import("@/components/room/panels/ProjectsPanel").then((m) => ({ default: m.ProjectsPanel })),
);
const CertificatesPanel = lazy(() =>
  import("@/components/room/panels/CertificatesPanel").then((m) => ({
    default: m.CertificatesPanel,
  })),
);
const ContactPanel = lazy(() =>
  import("@/components/room/panels/ContactPanel").then((m) => ({ default: m.ContactPanel })),
);
const TestimonialsPanel = lazy(() =>
  import("@/components/room/panels/TestimonialsPanel").then((m) => ({
    default: m.TestimonialsPanel,
  })),
);
const NeofetchPanel = lazy(() =>
  import("@/components/room/panels/NeofetchPanel").then((m) => ({ default: m.NeofetchPanel })),
);
const Terminal = lazy(() =>
  import("@/components/room/Terminal").then((m) => ({ default: m.Terminal })),
);
const EasterEggTerminal = lazy(() =>
  import("@/components/room/EasterEggTerminal").then((m) => ({ default: m.EasterEggTerminal })),
);

// ── Explicit icon map — replaces `import * as Icons` (tree-shakeable) ──
const iconMap: Record<string, LucideIcon> = {
  FileText,
  Wrench,
  FolderGit2,
  Award,
  Mail,
  MessageSquareQuote,
  Cpu,
  Terminal: TerminalIcon,
  Sparkles,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: data.siteMeta.title },
      { name: "description", content: data.siteMeta.description },
      { property: "og:title", content: data.siteMeta.ogTitle },
      { property: "og:description", content: data.siteMeta.ogDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      // Preload both background images so the browser fetches them
      // in parallel with JS — not after it — eliminating one full RTT.
      { rel: "preload", as: "image", href: desktopBg },
      { rel: "preload", as: "image", href: mobileBg },
      // Warm up DNS + TLS for external profile links
      { rel: "preconnect", href: "https://github.com" },
      { rel: "preconnect", href: "https://linkedin.com" },
      { rel: "dns-prefetch", href: "https://wa.me" },
    ],
  }),
  component: Room,
});

type Kind = (typeof data.hitboxes)[number]["kind"];

const ONBOARDING_STORAGE_KEY = "portfolio-room-onboarding-complete";

const meta = Object.fromEntries(
  Object.entries(data.panelMeta).map(([key, val]) => [
    key,
    { ...val, icon: iconMap[val.icon] as LucideIcon },
  ]),
) as Record<
  string,
  { title: string; subtitle: string; icon: LucideIcon; size: "sm" | "md" | "lg" }
>;

// Minimal spinner shown inside the modal while the lazy chunk loads
function PanelFallback() {
  return (
    <div className="flex h-32 items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-400" />
    </div>
  );
}

function Panel({
  kind,
  onClose,
  onOpenPanel,
}: {
  kind: Kind;
  onClose: () => void;
  onOpenPanel: (kind: Kind) => void;
}) {
  return (
    <Suspense fallback={<PanelFallback />}>
      {kind === "resume" && <ResumePanel />}
      {kind === "skills" && <SkillsPanel />}
      {kind === "projects" && <ProjectsPanel />}
      {kind === "certificates" && <CertificatesPanel />}
      {kind === "contact" && <ContactPanel />}
      {kind === "testimonials" && <TestimonialsPanel />}
      {kind === "neofetch" && <NeofetchPanel />}
      {kind === "terminal" && <Terminal onClose={onClose} onOpenPanel={onOpenPanel} />}
      {kind === "easteregg" && <EasterEggTerminal />}
    </Suspense>
  );
}

function WelcomeCue({ onDismiss }: { onDismiss: () => void }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.aside
      aria-live="polite"
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto w-[min(19rem,calc(100vw-2rem))] rounded-lg border border-emerald-300/30 bg-black/80 p-3 font-mono text-xs text-emerald-50 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-md"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.18em] text-emerald-300/75 uppercase">
            visitor@portfolio:~$
          </p>
          <p className="mt-1.5 leading-relaxed text-white/90">
            <span className="font-semibold text-emerald-200">{data.onboarding.title}</span>{" "}
            {data.onboarding.message}
          </p>
          <p className="mt-1.5 text-[10px] leading-relaxed text-white/50">
            {data.onboarding.discoveryHint}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss welcome guide"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-white/45 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-3 rounded-md border border-white/10 px-2 py-1 text-[10px] text-white/65 transition hover:border-emerald-300/35 hover:bg-emerald-300/10 hover:text-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        {data.onboarding.dismissLabel}
      </button>
    </motion.aside>
  );
}

// Fires the raw dynamic imports during browser idle time so chunks are
// cached before the user clicks anything. React.lazy then resolves instantly
// from the module cache instead of triggering a network fetch on demand.
function usePrefetchPanels(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const prefetch = () => {
      import("@/components/room/panels/ResumePanel");
      import("@/components/room/panels/SkillsPanel");
      import("@/components/room/panels/ProjectsPanel");
      import("@/components/room/panels/CertificatesPanel");
      import("@/components/room/panels/ContactPanel");
      import("@/components/room/panels/TestimonialsPanel");
      import("@/components/room/panels/NeofetchPanel");
      import("@/components/room/Terminal");
      import("@/components/room/EasterEggTerminal");
    };

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(prefetch, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    } else {
      // Safari doesn't support requestIdleCallback
      const id = setTimeout(prefetch, 200);
      return () => clearTimeout(id);
    }
  }, [enabled]);
}

function Room() {
  const [active, setActive] = useState<Kind | null>(null);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [debug, setDebug] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeCue, setShowWelcomeCue] = useState(false);

  // Prefetch all panel chunks during idle time once the room has painted
  usePrefetchPanels(!isLoading);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const img = new window.Image();
    img.src = isMobile ? mobileBg : desktopBg;
    img.onload = () => setIsLoading(false);
    img.onerror = () => setIsLoading(false);
  }, [isMobile]);

  useEffect(() => {
    if (isLoading) return;

    const timer = window.setTimeout(() => {
      try {
        setShowWelcomeCue(window.localStorage.getItem(ONBOARDING_STORAGE_KEY) !== "true");
      } catch {
        setShowWelcomeCue(true);
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [isLoading]);

  const close = useCallback(() => setActive(null), []);

  const completeWelcomeCue = useCallback(() => {
    setShowWelcomeCue(false);
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch {
      // The guide still closes when storage is unavailable.
    }
  }, []);

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
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500" />
              <p className="font-mono text-sm tracking-widest text-emerald-500/70 uppercase animate-pulse">
                Establishing Connection...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          animate={{
            scale: active ? 1.7 : 1,
            filter: active ? "blur(3px) brightness(0.6)" : "blur(0px) brightness(1)",
          }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0">
            {data.hitboxes.map((h) => (
              <Hitbox
                key={h.id}
                label={h.label}
                box={isMobile ? h.mobile : h.desktop}
                debug={debug}
                isGuided={showWelcomeCue && h.id === data.onboarding.targetId}
                onSelect={(center) => {
                  setOrigin(center);
                  setActive(h.kind);
                  if (h.id === data.onboarding.targetId) completeWelcomeCue();
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showWelcomeCue && !active && !isLoading ? (
          <div className="pointer-events-none fixed right-4 top-4 z-20 sm:right-6 sm:top-6">
            <WelcomeCue onDismiss={completeWelcomeCue} />
          </div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
        <div className="justify-self-start flex flex-col min-w-0 px-4 py-3">
          <h1 className="truncate font-mono text-xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
            {data.profile.name}
          </h1>
          <div className="mt-2 flex w-full items-center justify-between pointer-events-auto">
            {data.profile.github && data.profile.github !== "#" && (
              <a
                href={data.profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center text-white/70 transition-all duration-200 hover:scale-110 hover:text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {data.profile.linkedin && data.profile.linkedin !== "#" && (
              <a
                href={data.profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center text-white/70 transition-all duration-200 hover:scale-110 hover:text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {data.profile.email && data.profile.email !== "#" && (
              <a
                href={`mailto:${data.profile.email}`}
                aria-label="Email"
                className="flex h-8 w-8 items-center justify-center text-white/70 transition-all duration-200 hover:scale-110 hover:text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
            {data.profile.whatsapp && data.profile.whatsapp !== "#" && (
              <a
                href={`https://wa.me/${data.profile.whatsapp.replace(/[^0-9]/g, "")}`}
                aria-label="Whatsapp"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center text-white/70 transition-all duration-200 hover:scale-110 hover:text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
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
              headerControls={
                active === "contact" && (
                  <div className="flex items-center gap-1.5 mr-2">
                    {[
                      { href: data.profile.github, label: "GitHub", Icon: Github },
                      { href: data.profile.linkedin, label: "LinkedIn", Icon: Linkedin },
                      { href: `mailto:${data.profile.email}`, label: "Email", Icon: Mail },
                    ].map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                )
              }
            >
              <Panel kind={active} onClose={close} onOpenPanel={(k) => setActive(k)} />
            </GlassModal>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
