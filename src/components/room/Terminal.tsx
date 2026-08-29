import { useEffect, useRef, useState } from "react";
import data from "@/data/portfolio.json";

type Line = { kind: "in" | "out"; text: string };

type Dir = { [key: string]: Dir | string };

const fs: Dir = {
  home: {
    amr: {
      "about.txt": `${data.profile.name} — ${data.profile.role}\n${data.resume.summary}`,
      "contact.txt": `email: ${data.profile.email}\ngithub: ${data.profile.github}\nlinkedin: ${data.profile.linkedin}`,
      projects: Object.fromEntries(
        data.projects.map((p) => [
          `${p.name.toLowerCase().replace(/\s+/g, "-")}.md`,
          `# ${p.name}\n${p.description}\nstack: ${p.stack.join(", ")}`,
        ]),
      ),
      "skills.txt": data.skills.map((s) => `${s.name.padEnd(14)} ${s.level}%`).join("\n"),
    },
  },
  etc: { "motd": "Keep calm and sudo on." },
};

function resolve(path: string[]): Dir | string | undefined {
  let node: Dir | string | undefined = fs;
  for (const part of path) {
    if (typeof node !== "object" || node === null) return undefined;
    node = node[part];
  }
  return node;
}

const HELP = [
  "Available commands:",
  "  help              show this message",
  "  ls [path]         list directory contents",
  "  cd <path>         change directory (.. supported)",
  "  pwd               print working directory",
  "  cat <file>        print a file",
  "  whoami            who is this guy",
  "  projects          list projects",
  "  skills            list skills",
  "  contact           show contact links",
  "  neofetch          system info",
  "  echo <text>       print text",
  "  date              current date",
  "  clear             clear the screen",
  "  exit              close the terminal",
].join("\n");

export function Terminal({ onClose, compact = false }: { onClose: () => void; compact?: boolean }) {
  const [cwd, setCwd] = useState<string[]>(["home", "amr"]);
  const [history, setHistory] = useState<Line[]>([
    { kind: "out", text: `${data.profile.name}'s shell — type 'help' to get started.` },
  ]);
  const [value, setValue] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [pastIdx, setPastIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const prompt = `${data.profile.handle}:/${cwd.join("/")}$`;

  const run = (raw: string) => {
    const input = raw.trim();
    const next: Line[] = [{ kind: "in", text: `${prompt} ${raw}` }];
    const [cmd = "", ...args] = input.split(/\s+/);
    const arg = args.join(" ");

    const pathOf = (p: string): string[] => {
      const base = p.startsWith("/") ? [] : [...cwd];
      for (const part of p.split("/").filter(Boolean)) {
        if (part === ".") continue;
        if (part === "..") base.pop();
        else base.push(part);
      }
      return base;
    };

    const out = (text: string) => next.push({ kind: "out", text });

    switch (cmd) {
      case "":
        break;
      case "help":
        out(HELP);
        break;
      case "ls": {
        const target = arg ? pathOf(arg) : cwd;
        const node = resolve(target);
        if (node === undefined) out(`ls: cannot access '${arg}': No such file or directory`);
        else if (typeof node === "string") out(arg);
        else out(Object.keys(node).join("   ") || "(empty)");
        break;
      }
      case "cd": {
        if (!arg || arg === "~") {
          setCwd(["home", "amr"]);
          break;
        }
        const target = pathOf(arg);
        const node = resolve(target);
        if (node === undefined || typeof node === "string") out(`cd: ${arg}: No such directory`);
        else setCwd(target);
        break;
      }
      case "pwd":
        out(`/${cwd.join("/")}`);
        break;
      case "cat": {
        if (!arg) {
          out("cat: missing operand");
          break;
        }
        const node = resolve(pathOf(arg));
        if (typeof node === "string") out(node);
        else if (node === undefined) out(`cat: ${arg}: No such file or directory`);
        else out(`cat: ${arg}: Is a directory`);
        break;
      }
      case "whoami":
        out(`${data.profile.name} — ${data.profile.role}\n${data.resume.summary}`);
        break;
      case "projects":
        out(
          data.projects
            .map((p) => `• ${p.name}\n  ${p.description}\n  [${p.stack.join(", ")}]`)
            .join("\n\n"),
        );
        break;
      case "skills":
        out(
          data.skills
            .map((s) => `${s.name.padEnd(13)} ${"█".repeat(Math.round(s.level / 5)).padEnd(20, "░")} ${s.level}%`)
            .join("\n"),
        );
        break;
      case "contact":
        out(
          `email    ${data.profile.email}\ngithub   ${data.profile.github}\nlinkedin ${data.profile.linkedin}`,
        );
        break;
      case "neofetch":
        out(data.neofetch.lines.map(([k, v]) => `${String(k).padEnd(10)} ${v}`).join("\n"));
        break;
      case "echo":
        out(arg);
        break;
      case "date":
        out(new Date().toString());
        break;
      case "sudo":
        out("We trust you have received the usual lecture. Keep calm and sudo on.");
        break;
      case "clear":
        setHistory([]);
        setValue("");
        setPast((p) => [input, ...p]);
        setPastIdx(-1);
        return;
      case "exit":
        onClose();
        return;
      default:
        out(`${cmd}: command not found. Try 'help'.`);
    }

    setHistory((h) => [...h, ...next]);
    if (input) setPast((p) => [input, ...p]);
    setPastIdx(-1);
    setValue("");
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`rounded-lg border border-white/10 bg-black/60 font-mono text-[13px] leading-relaxed text-emerald-200/90 ${
        compact ? "h-[45vh]" : "h-[60vh]"
      } flex flex-col`}
    >
      <div ref={scrollRef} className="flex-1 space-y-1 overflow-y-auto p-4">
        {history.map((line, i) => (
          <pre
            key={i}
            className={`whitespace-pre-wrap break-words ${line.kind === "in" ? "text-white/60" : "text-emerald-200/90"}`}
          >
            {line.text}
          </pre>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
        }}
        className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
      >
        <span className="shrink-0 text-emerald-400">{prompt}</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const i = Math.min(pastIdx + 1, past.length - 1);
              if (i >= 0) {
                setPastIdx(i);
                setValue(past[i] ?? "");
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const i = pastIdx - 1;
              setPastIdx(i);
              setValue(i >= 0 ? (past[i] ?? "") : "");
            }
          }}
          spellCheck={false}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-white caret-emerald-400 outline-none"
        />
      </form>
    </div>
  );
}
