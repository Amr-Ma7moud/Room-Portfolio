import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import data from "@/data/portfolio.json";

const GLYPHS = "01アイウエオカキクケコサシスセソナニヌネノ$#%&<>/\\";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 14;
    let drops: number[] = [];
    const reset = () => {
      drops = Array.from({ length: Math.ceil(canvas.width / fontSize) }, () =>
        Math.floor((Math.random() * canvas.height) / fontSize),
      );
    };
    reset();

    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 55) return;
      last = t;
      if (drops.length !== Math.ceil(canvas.width / fontSize)) reset();
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > 0.97 ? "#d1fae5" : "#22c55e";
        ctx.fillText(
          GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "0",
          i * fontSize,
          y * fontSize,
        );
        drops[i] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />;
}

export function EasterEggTerminal() {
  const [typed, setTyped] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState(false);
  const lines = data.easterEgg.bootLines;

  useEffect(() => {
    let li = 0;
    let ci = 0;
    const timer = window.setInterval(() => {
      const line = lines[li];
      if (line === undefined) {
        window.clearInterval(timer);
        setDone(true);
        return;
      }
      ci += 1;
      setCurrent(line.slice(0, ci));
      if (ci >= line.length) {
        setTyped((t) => [...t, line]);
        setCurrent("");
        li += 1;
        ci = 0;
      }
    }, 28);
    return () => window.clearInterval(timer);
  }, [lines]);

  return (
    <div className="relative h-[46vh] overflow-hidden rounded-lg border border-white/10 bg-black/70 font-mono text-[13px]">
      <MatrixRain />
      <div className="relative z-10 h-full space-y-1 overflow-y-auto p-4">
        {typed.map((line, i) => (
          <p key={i} className="text-emerald-300 drop-shadow-[0_0_6px_rgba(0,0,0,0.9)]">
            {line}
          </p>
        ))}
        {!done ? (
          <p className="text-emerald-300 drop-shadow-[0_0_6px_rgba(0,0,0,0.9)]">
            {current}
            <span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-emerald-300 align-middle" />
          </p>
        ) : (
          <div className="mt-4 rounded-lg border border-emerald-400/30 bg-black/70 p-4 backdrop-blur-md">
            <p className="text-white">{data.easterEgg.secret}</p>
            <a
              href={data.easterEgg.secretUrl}
              className="mt-3 inline-flex items-center gap-2 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-emerald-200 transition hover:bg-emerald-400/20"
            >
              <ExternalLink className="h-3.5 w-3.5" /> open hidden project
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
