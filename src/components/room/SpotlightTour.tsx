import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import type { Box } from "./Hitbox";
import type { LucideIcon } from "lucide-react";

export type TourItem = {
  id: string;
  label: string;
  box: Box;
  description?: string;
  icon: LucideIcon;
};

type Props = {
  items: TourItem[];
  onComplete: () => void;
};

export function SpotlightTour({ items, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = items[currentIndex];

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  if (!current) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-auto overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          {/* Dark overlay with transparent cutout */}
          <div
            className="absolute rounded-xl transition-all duration-500 ease-in-out border-2 border-emerald-400/50"
            style={{
              left: `${current.box.left}%`,
              top: `${current.box.top}%`,
              width: `${current.box.width}%`,
              height: `${current.box.height}%`,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.75)",
            }}
          />

          {/* Info Card - positioned dynamically */}
          <div
            className="absolute flex flex-col items-center justify-center transition-all duration-500 pointer-events-none"
            style={{
              left: `${current.box.left + current.box.width / 2}%`,
              top: `${current.box.top + current.box.height + 2}%`,
              transform: "translateX(-50%)",
            }}
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="pointer-events-auto mt-4 flex w-72 flex-col items-center rounded-xl border border-white/10 bg-black/90 p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] backdrop-blur-xl"
            >
              <div className="mb-3 flex items-center justify-center gap-2">
                <current.icon className="h-5 w-5 text-emerald-400" />
                <h3 className="font-mono text-lg font-bold text-white uppercase tracking-widest">
                  {current.label}
                </h3>
              </div>

              <p className="mb-6 text-center text-sm text-white/70 leading-relaxed">
                {current.description || "Discover this section."}
              </p>

              <div className="flex w-full items-center justify-between">
                <button
                  onClick={onComplete}
                  className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded px-1"
                >
                  Skip Tour
                </button>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-white/30">
                    {currentIndex + 1} / {items.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 rounded-md bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    {currentIndex === items.length - 1 ? "Finish" : "Next"}
                    {currentIndex === items.length - 1 ? (
                      <Sparkles className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
