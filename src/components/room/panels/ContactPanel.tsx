import { useState } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import data from "@/data/portfolio.json";

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
