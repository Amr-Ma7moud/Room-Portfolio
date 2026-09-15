import { useEffect, useRef } from "react";

export function CMatrix({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "q" || (e.key === "c" && e.ctrlKey)) {
        e.preventDefault();
        onExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to match parent
    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+{}|:<>?~";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1) as number[];

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#10B981"; // emerald-500
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]!;
        const drop = drops[i] as number;
        ctx.fillText(text, i * fontSize, drop * fontSize);

        if (drop * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] = (drops[i] as number) + 1;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="flex-1 relative bg-black overflow-hidden flex flex-col">
      <div className="absolute top-2 right-4 z-10 text-white/50 text-xs bg-black/50 px-2 py-1 rounded">
        Exit: 'q' or 'Ctrl+C'
      </div>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
