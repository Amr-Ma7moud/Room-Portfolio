import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Copy,
  Check,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  ScanLine,
  Share2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import data from "@/data/portfolio.json";

type QRCodeItem = {
  id: string;
  title: string;
  style: string;
  description: string;
  src: string;
  tag: string;
};

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: `QR Codes - ${data.profile.name}` },
      {
        name: "description",
        content: "Scan or download themed portfolio QR codes for quick access.",
      },
      { property: "og:title", content: `QR Codes - ${data.profile.name}` },
      {
        property: "og:description",
        content: "Scan or download themed portfolio QR codes for quick access.",
      },
    ],
  }),
  component: StandaloneQRPage,
});

function StandaloneQRPage() {
  const qrList: QRCodeItem[] = (data as any).qrCodes || [
    {
      id: "cyberpunk_neon",
      title: "Cyberpunk Neon",
      style: "Cyan & Magenta Glow",
      description: "High-contrast cyberpunk aesthetic QR code with neon cyan and magenta accents.",
      src: "/cyberpunk_neon.png",
      tag: "Cyberpunk",
    },
    {
      id: "aesthetic_terracotta",
      title: "Aesthetic Terracotta",
      style: "Warm Clay & Terracotta",
      description: "Warm and organic earthy tones inspired by terracotta ceramics.",
      src: "/aesthetic_terracotta.png",
      tag: "Earthy",
    },
    {
      id: "dark_blue_qr",
      title: "Dark Blue Tech",
      style: "Deep Navy Minimal",
      description: "Clean, sleek deep navy blue styling for modern terminals and dark interfaces.",
      src: "/dark_blue_qr.png",
      tag: "Minimal",
    },
    {
      id: "gradient_blue_purple",
      title: "Gradient Blue & Purple",
      style: "Violet & Indigo Glow",
      description: "Vibrant and smooth color transition blending cool blue into electric purple.",
      src: "/gradient_blue_purple.png",
      tag: "Vibrant",
    },
  ];

  const [soloQr, setSoloQr] = useState<QRCodeItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pageCopied, setPageCopied] = useState(false);

  // Check URL query on initial load (e.g. /qr?id=cyberpunk_neon)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) {
        const found = qrList.find((q) => q.id === id);
        if (found) setSoloQr(found);
      }
    }
  }, [qrList]);

  const soloIndex = soloQr ? qrList.findIndex((q) => q.id === soloQr.id) : -1;

  const handleNext = useCallback(() => {
    if (soloIndex >= 0 && qrList.length > 0) {
      const nextIndex = (soloIndex + 1) % qrList.length;
      const target = qrList[nextIndex];
      if (target) setSoloQr(target);
    }
  }, [soloIndex, qrList]);

  const handlePrev = useCallback(() => {
    if (soloIndex >= 0 && qrList.length > 0) {
      const prevIndex = (soloIndex - 1 + qrList.length) % qrList.length;
      const target = qrList[prevIndex];
      if (target) setSoloQr(target);
    }
  }, [soloIndex, qrList]);

  // Keyboard navigation when in solo view
  useEffect(() => {
    if (!soloQr) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSoloQr(null);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [soloQr, handleNext, handlePrev]);

  const copyUrl = async (e: React.MouseEvent, item: QRCodeItem) => {
    e.stopPropagation();
    try {
      const fullUrl = `${window.location.origin}/qr?id=${item.id}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setPageCopied(true);
      setTimeout(() => setPageCopied(false), 2000);
    } catch {
      setPageCopied(true);
      setTimeout(() => setPageCopied(false), 2000);
    }
  };

  const downloadImage = (e: React.MouseEvent, item: QRCodeItem) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = item.src;
    link.download = `${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden flex flex-col">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[350px] bg-purple-500/5 blur-[100px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Header bar */}
      <header className="relative z-10 border-b border-white/10 bg-black/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/15 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Main Portfolio</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="font-bold tracking-wider text-sm text-white">QR REPOSITORY</span>
            </div>
          </div>

          <button
            type="button"
            onClick={copyPageLink}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/15 hover:text-white transition-colors"
          >
            {pageCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Page Link</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col">
        {/* Title & info banner */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 mb-4">
            <Sparkles className="h-3 w-3" />
            <span>Interactive QR Gallery</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase">
            Portfolio QR Codes
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/60 leading-relaxed">
            All styled QR codes are displayed below. Click on any QR to enlarge and display it{" "}
            <span className="text-emerald-400 font-semibold">alone on the screen</span> for effortless camera scanning.
          </p>
        </div>

        {/* ── ALL QR CODES GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {qrList.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSoloQr(item)}
                className="group relative flex flex-col justify-between cursor-pointer rounded-xl border border-white/10 bg-black/50 p-5 hover:border-emerald-500/50 hover:bg-white/5 hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)] transition-all duration-300"
              >
                {/* QR Image Box */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/80 p-4 flex items-center justify-center border border-white/5 group-hover:border-emerald-500/30">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain rounded transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs rounded-lg">
                    <span className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-2 text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Maximize2 className="h-4 w-4" /> View Alone
                    </span>
                  </div>

                  {/* Corner theme tag */}
                  <span className="absolute top-2.5 left-2.5 rounded bg-black/90 border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-400">
                    {item.tag}
                  </span>
                </div>

                {/* Info Text */}
                <div className="mt-4 flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-bold text-white group-hover:text-emerald-300 transition-colors text-base">
                      {item.title}
                    </h2>
                  </div>
                  <span className="text-xs text-white/50">{item.style}</span>
                  <p className="text-xs text-white/60 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400/90 group-hover:text-emerald-300 font-medium">
                    <ScanLine className="h-3.5 w-3.5" /> Click to expand
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="Copy QR direct link"
                      onClick={(e) => copyUrl(e, item)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:bg-white/15 hover:text-white transition-colors"
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      title="Download PNG file"
                      onClick={(e) => downloadImage(e, item)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:bg-white/15 hover:text-white transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* ── SOLO SCREEN VIEW: The image appears alone on the screen when clicked ── */}
      <AnimatePresence>
        {soloQr && (
          <motion.div
            key="solo-qr-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSoloQr(null)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-2xl p-4 sm:p-8 select-none"
          >
            {/* Solo View Top Navigation */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-4xl items-center justify-between border-b border-white/10 pb-4"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSoloQr(null)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Back to gallery
                </button>
                <div className="hidden sm:block">
                  <h3 className="text-sm font-bold text-white">{soloQr.title}</h3>
                  <p className="text-[11px] text-white/50">{soloQr.style}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => copyUrl(e, soloQr)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                >
                  {copiedId === soloQr.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => downloadImage(e, soloQr)}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Solo View Center: THE IMAGE APPEARS IN THE SCREEN ALONE */}
            <div className="relative flex flex-1 w-full max-w-5xl items-center justify-center my-4">
              {/* Previous button */}
              {qrList.length > 1 && (
                <button
                  type="button"
                  aria-label="Previous QR Code"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2 sm:left-6 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/70 text-white/70 hover:bg-white/20 hover:text-white transition-all hover:scale-110 shadow-2xl"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* The Solitary QR Image container */}
              <motion.div
                key={soloQr.id}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[75vh] max-w-[88vw] sm:max-w-lg aspect-square flex items-center justify-center p-6 sm:p-10 rounded-2xl border border-white/15 bg-black/90 shadow-[0_0_80px_rgba(0,0,0,0.95)]"
              >
                {/* Target corner reticles */}
                <span className="absolute -top-1.5 -left-1.5 h-6 w-6 border-t-2 border-l-2 border-emerald-400" />
                <span className="absolute -top-1.5 -right-1.5 h-6 w-6 border-t-2 border-r-2 border-emerald-400" />
                <span className="absolute -bottom-1.5 -left-1.5 h-6 w-6 border-b-2 border-l-2 border-emerald-400" />
                <span className="absolute -bottom-1.5 -right-1.5 h-6 w-6 border-b-2 border-r-2 border-emerald-400" />

                {/* The QR Image ALONE */}
                <img
                  src={soloQr.src}
                  alt={soloQr.title}
                  className="h-full w-full object-contain rounded-lg drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                />
              </motion.div>

              {/* Next button */}
              {qrList.length > 1 && (
                <button
                  type="button"
                  aria-label="Next QR Code"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 sm:right-6 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/70 text-white/70 hover:bg-white/20 hover:text-white transition-all hover:scale-110 shadow-2xl"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Solo View Footer hints */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1.5 text-center text-xs text-white/50"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ScanLine className="h-3.5 w-3.5 animate-pulse" />
                <span>Ready to scan with camera</span>
              </div>
              <p className="text-[11px] text-white/40">
                Click anywhere outside or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">ESC</kbd> to return
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
