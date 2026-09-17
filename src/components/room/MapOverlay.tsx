import { motion } from "framer-motion";
import { X, Map as MapIcon, Keyboard } from "lucide-react";
import type { NavItem } from "./NavDock";

type Props = {
  items: NavItem[];
  onSelect: (kind: string) => void;
  onClose: () => void;
};

export function MapOverlay({ items, onSelect, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-white/10 bg-black/90 p-6 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-white">
            <MapIcon className="h-5 w-5 text-emerald-400" />
            <h2 className="font-mono text-lg font-bold tracking-widest uppercase">Directory</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          {items.map((item) => (
            <button
              key={item.kind}
              onClick={() => {
                onSelect(item.kind);
                onClose();
              }}
              className="group flex w-full items-center gap-4 rounded-xl border border-transparent p-3 text-left transition-all hover:border-white/10 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/50 border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                <item.icon className="h-5 w-5 text-white/60 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-sm font-semibold text-white/90 group-hover:text-white truncate">
                  {item.label}
                </div>
                <div className="text-xs text-white/40 line-clamp-1 group-hover:text-white/60">
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
            <Keyboard className="h-4 w-4" />
            <span>Shortcuts</span>
          </div>
          <div className="mt-3 space-y-2 text-[10px] text-white/30 font-mono">
            <div className="flex justify-between items-center">
              <span>Close panels/map</span>
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">ESC</kbd>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
