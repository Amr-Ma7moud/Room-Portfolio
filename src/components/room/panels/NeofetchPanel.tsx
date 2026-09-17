import { useEffect } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import data from "@/data/portfolio.json";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest));

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: "tween",
      duration: text.length * 0.02,
      delay: delay,
      ease: "linear",
    });
    return controls.stop;
  }, [count, text, delay]);

  return <motion.span>{displayText}</motion.span>;
}

export function NeofetchPanel() {
  let currentDelay = 0.3;
  
  const handleDelay = currentDelay;
  currentDelay += data.profile.handle.length * 0.02;

  const separatorDelay = currentDelay;
  currentDelay += 17 * 0.02; // length of "-----------------"

  const linesWithDelays = data.neofetch.lines.map(([k, v]) => {
    const key = k || "";
    const val = v || "";
    
    const keyDelay = currentDelay;
    currentDelay += (key.length + 2) * 0.02;
    
    const valDelay = currentDelay;
    currentDelay += val.length * 0.02;

    return { key, val, keyDelay, valDelay };
  });

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/80 p-4 font-mono text-[13px] shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
      {/* Subtle CRT scanline effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:100%_4px] opacity-20" />

      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-white/50">
        <TerminalIcon className="h-3.5 w-3.5" />
        <span className="flex items-center gap-1.5">
          <span className="text-white/90">{data.profile.handle}</span>$<span className="text-emerald-400">neofetch</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="inline-block h-3.5 w-1.5 bg-emerald-400/80"
          />
        </span>
      </div>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.04 } },
        }}
        initial="hidden"
        animate="show"
        className="mt-4 grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]"
      >
        <motion.pre
          variants={{
            hidden: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
            show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.4 } },
          }}
          className="hidden text-emerald-400/80 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] sm:block font-bold"
        >
          {`  ___  ___  _________ \n / _ \\ |  \\/  || ___ \\\n/ /_\\ \\| .  . || |_/ /\n|  _  || |\\/| ||    / \n| | | || |  | || |\\ \\ \n\\_| |_/\\_|  |_/\\_| \\_|`}
        </motion.pre>
        <div className="min-w-0 space-y-0.5">
          <p className="text-emerald-300 font-bold">
            <TypewriterText text={data.profile.handle} delay={handleDelay} />
          </p>
          <p className="text-white/30">
            <TypewriterText text="-----------------" delay={separatorDelay} />
          </p>
          {linesWithDelays.map(({ key, val, keyDelay, valDelay }) => (
            <p key={key} className="break-words">
              <span className="text-emerald-300 font-semibold">
                <TypewriterText text={`${key}: `} delay={keyDelay} />
              </span>
              <span className="text-white/90">
                <TypewriterText text={val} delay={valDelay} />
              </span>
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
