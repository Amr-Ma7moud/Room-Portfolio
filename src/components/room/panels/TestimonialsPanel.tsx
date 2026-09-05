import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { card } from "./shared";
import data from "@/data/portfolio.json";

export function TestimonialsPanel() {
  const [i, setI] = useState(0);
  const items = data.testimonials;
  const item = items[i] ?? items[0];
  if (!item) return null;

  return (
    <div className="space-y-4">
      <blockquote className={`${card} min-h-[9rem]`}>
        <Quote className="h-5 w-5 text-emerald-300/70" />
        <p className="mt-3 text-base leading-relaxed text-white/85">{item.quote}</p>
        <footer className="mt-3 font-mono text-xs tracking-widest text-white/45 uppercase">
          — {item.author}
        </footer>
      </blockquote>

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <button
          type="button"
          onClick={() => setI((v) => (v - 1 + items.length) % items.length)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/15"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex justify-center gap-1.5">
          {items.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-emerald-300/80" : "w-1.5 bg-white/25"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setI((v) => (v + 1) % items.length)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/15"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
