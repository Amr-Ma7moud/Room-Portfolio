import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Maximize2,
  Quote,
  Send,
  Terminal as TerminalIcon,
} from "lucide-react";
import data from "@/data/portfolio.json";

const card = "rounded-lg border border-white/10 bg-white/5 p-4";

export function ResumePanel() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-white/70 max-w-xl leading-relaxed">
          {data.resume.summary}
        </p>
        <div className="flex gap-2 shrink-0">
          <a
            href={data.profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20 text-white/80"
          >
            <Maximize2 className="h-3.5 w-3.5" /> Full Screen
          </a>
          <a
            href={data.profile.cvUrl}
            download
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium transition hover:bg-emerald-500/20 text-emerald-300"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-inner">
        <iframe 
          src={`${data.profile.cvUrl}#view=FitH&toolbar=0`}
          className="w-full h-[60vh] min-h-[400px] border-none bg-white/5"
          title="Resume PDF"
        />
      </div>
    </div>
  );
}

export function SkillsPanel() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {data.skills.map((s) => (
        <div
          key={s.name}
          className="group relative flex cursor-default items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
        >
          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="truncate font-mono text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-emerald-50">
            {s.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProjectsPanel() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.projects.map((p) => (
        <article key={p.name} className={card}>
          <h3 className="text-base font-semibold">{p.name}</h3>
          <p className="mt-2 text-sm text-white/60">{p.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[11px] text-emerald-200/80"
              >
                {s}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function CertificatesPanel() {
  return (
    <div className="space-y-3">
      {data.certificates.map((c) => (
        <div key={c.title} className={`${card} grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4`}>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{c.title}</h3>
            <p className="text-xs text-white/55">{c.issuer}</p>
            <p className="mt-1 text-sm text-white/50">{c.detail}</p>
          </div>
          <span className="shrink-0 font-mono text-xs text-emerald-300/80">{c.year}</span>
        </div>
      ))}
    </div>
  );
}

export function ContactPanel() {
  const [sent, setSent] = useState(false);
  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="space-y-3"
      >
        {(["Name", "Email"] as const).map((label) => (
          <input
            key={label}
            required
            type={label === "Email" ? "email" : "text"}
            placeholder={label}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/50 focus:bg-white/10"
          />
        ))}
        <textarea
          required
          rows={4}
          placeholder="Message"
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/50 focus:bg-white/10"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
        >
          <Send className="h-4 w-4" /> {sent ? "Message sent" : "Send message"}
        </button>
      </form>
      <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
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
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <Icon className="h-4 w-4" /> {label}
          </a>
        ))}
      </div>
    </div>
  );
}

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
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-emerald-300/80" : "w-1.5 bg-white/25"}`}
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

export function NeofetchPanel() {
  return (
    <div className="rounded-lg border border-white/10 bg-black/60 p-4 font-mono text-[13px]">
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-white/50">
        <TerminalIcon className="h-3.5 w-3.5" /> {data.profile.handle}
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <pre className="hidden text-emerald-400/80 sm:block">{`      /\\
     /  \\
    /\\   \\
   /      \\
  /   ,,   \\
 /   |  |   \\
/_-''    ''-_\\`}</pre>
        <div className="min-w-0 space-y-0.5">
          <p className="text-emerald-300">{data.profile.handle}</p>
          <p className="text-white/30">-----------------</p>
          {data.neofetch.lines.map(([k, v]) => (
            <p key={String(k)} className="break-words">
              <span className="text-emerald-300">{k}: </span>
              <span className="text-white/80">{v}</span>
            </p>
          ))}
          <div className="mt-3 flex gap-1">
            {["bg-red-400", "bg-amber-300", "bg-emerald-400", "bg-sky-400", "bg-violet-400", "bg-white/70"].map(
              (c) => (
                <span key={c} className={`h-3 w-6 rounded-sm ${c}`} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
