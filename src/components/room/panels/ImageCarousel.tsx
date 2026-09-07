import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { getProjectImages } from "@/data/projectImages";

type Props = {
  /** Matches a subdirectory name under src/assets/projects/ */
  imageDir: string;
};

type LoadState = "loading" | "ready" | "empty";

export function ImageCarousel({ imageDir }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [idx, setIdx] = useState(0);
  // Track which image URLs have finished painting in the browser
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  // Lazily resolve image URLs when the carousel first mounts
  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    setIdx(0);
    setLoaded({});

    getProjectImages(imageDir).then((urls) => {
      if (cancelled) return;
      setImages(urls);
      setLoadState(urls.length > 0 ? "ready" : "empty");
    });

    return () => {
      cancelled = true;
    };
  }, [imageDir]);

  // ── Loading skeleton ──────────────────────────────────────────────
  if (loadState === "loading") {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/50">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-400" />
        </div>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────
  if (loadState === "empty") {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/30">
        <div className="flex flex-col items-center gap-2 text-white/20">
          <ImageOff className="h-8 w-8" />
          <span className="font-mono text-xs">no images</span>
        </div>
      </div>
    );
  }

  // ── Carousel ──────────────────────────────────────────────────────
  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50 aspect-video group">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          {/* Blur placeholder shown until the <img> fires onLoad */}
          {!loaded[idx] && <div className="absolute inset-0 animate-pulse bg-white/5" />}
          <img
            src={images[idx]}
            alt={`Project screenshot ${idx + 1}`}
            // Native lazy loading — browser skips fetch until near viewport
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded((prev) => ({ ...prev, [idx]: true }))}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
              loaded[idx] ? "opacity-100" : "opacity-0"
            }`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Preload the next image silently so the transition feels instant */}
      {images[idx + 1] && <link rel="preload" as="image" href={images[idx + 1]} />}

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition hover:bg-black/80 hover:text-emerald-400"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition hover:bg-black/80 hover:text-emerald-400"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dot pagination */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 backdrop-blur-md border border-white/10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-4 bg-emerald-400" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Counter badge */}
          <div className="absolute right-3 bottom-3 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/50 backdrop-blur-md border border-white/10">
            {idx + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
