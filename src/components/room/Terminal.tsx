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
      "skills.txt": data.skills.map((s) => s.name).join("\n"),
    },
  },
  etc: { motd: data.terminal.motd },
};

function resolve(path: string[]): Dir | string | undefined {
  let node: Dir | string | undefined = fs;
  for (const part of path) {
    if (typeof node !== "object" || node === null) return undefined;
    node = node[part];
  }
  return node;
}

const COMMANDS = data.terminal.commands;
const HELP = "__HELP__";
const BANNER = data.terminal.banner;
const FORTUNES = data.terminal.fortunes;
const UPTIMES = data.terminal.uptimes;

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0]![j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!;
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1,
          matrix[i]![j - 1]! + 1,
          matrix[i - 1]![j]! + 1,
        );
      }
    }
  }
  return matrix[a.length]![b.length]!;
}

function useTypewriter(text: string, speed: number = 20) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isTyping };
}

function printTree(node: Dir | string, prefix = ""): string {
  if (typeof node === "string") return "";
  const keys = Object.keys(node);
  return keys
    .map((k, i) => {
      const isLast = i === keys.length - 1;
      const pointer = isLast ? "└── " : "├── ";
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      let result = prefix + pointer + k + "\n";
      if (typeof node[k] === "object") {
        result += printTree(node[k], nextPrefix);
      }
      return result;
    })
    .join("");
}

function renderLine(text: string) {
  if (text.startsWith("# ")) {
    return <span className="text-cyan-400 font-bold">{text}</span>;
  }
  if (text.startsWith("[ OK ]")) {
    return (
      <span>
        <span className="text-emerald-400">[ OK ]</span>
        {text.slice(6)}
      </span>
    );
  }
  if (
    text.startsWith("• ") ||
    text.startsWith("├── ") ||
    text.startsWith("└── ") ||
    text.startsWith("│   ")
  ) {
    const colorMatch = text.match(/^(• |├── |└── |│ {3})+/);
    if (colorMatch) {
      return (
        <span>
          <span className="text-amber-400/80">{colorMatch[0]}</span>
          {text.slice(colorMatch[0].length)}
        </span>
      );
    }
  }
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if (urlRegex.test(text)) {
    const parts = text.split(urlRegex);
    return (
      <span>
        {parts.map((part, i) =>
          urlRegex.test(part) ? (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 underline hover:text-sky-300"
            >
              {part}
            </a>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </span>
    );
  }
  if (text === "__HELP__") {
    return (
      <div className="mt-2 mb-2">
        <div className="mb-2 text-white/80">Available commands:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-1">
          {[...COMMANDS].sort().map((c) => (
            <div key={c} className="text-emerald-400 hover:text-emerald-300 transition-colors">
              {c}
            </div>
          ))}
        </div>
        <div className="mt-2 text-white/50 text-[11px]">
          Type 'man &lt;command&gt;' for more information.
        </div>
      </div>
    );
  }

  const kvMatch = text.match(/^([a-zA-Z0-9_-]+)(:\s+|\s{2,})(.*)$/);
  if (kvMatch && !text.startsWith(" ")) {
    return (
      <span>
        <span className="text-emerald-400">
          {kvMatch[1]}
          {kvMatch[2]}
        </span>
        <span className="text-white/90">{kvMatch[3]}</span>
      </span>
    );
  }
  return <span>{text}</span>;
}

export function Terminal({
  onClose,
  compact = false,
  onOpenPanel,
}: {
  onClose: () => void;
  compact?: boolean;
  onOpenPanel?: (kind: string) => void;
}) {
  const [cwd, setCwd] = useState<string[]>(["home", "amr"]);
  const [history, setHistory] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [pastIdx, setPastIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const WELCOME_MSG = `${data.profile.name}'s shell — type 'help' to get started.`;
  const { displayedText, isTyping } = useTypewriter(WELCOME_MSG, 15);

  useEffect(() => {
    inputRef.current?.focus();
    const saved = localStorage.getItem("terminal-history");
    if (saved) {
      try {
        setPast(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, displayedText]);

  const prompt = `${data.profile.handle}:/${cwd.join("/")}$`;

  const pathOf = (p: string, currentCwd: string[]): string[] => {
    const base = p.startsWith("/") ? [] : [...currentCwd];
    for (const part of p.split("/").filter(Boolean)) {
      if (part === ".") continue;
      if (part === "..") base.pop();
      else base.push(part);
    }
    return base;
  };

  const handleTab = (currentValue: string) => {
    const tokens = currentValue.split(" ");
    const lastToken = tokens[tokens.length - 1] || "";
    const isCmd = tokens.length === 1;

    let candidates: string[] = [];
    if (isCmd) {
      candidates = COMMANDS.filter((c) => c.startsWith(lastToken));
    } else {
      const slashIdx = lastToken.lastIndexOf("/");
      const pathBefore = slashIdx >= 0 ? lastToken.substring(0, slashIdx + 1) : "";
      const partial = slashIdx >= 0 ? lastToken.substring(slashIdx + 1) : lastToken;

      const base = pathBefore ? pathOf(pathBefore, cwd) : cwd;
      const node = resolve(base);
      if (node && typeof node === "object") {
        candidates = Object.keys(node).filter((k) => k.startsWith(partial));
      }
    }

    if (candidates.length === 1) {
      if (isCmd) {
        setValue(candidates[0] + " ");
      } else {
        const slashIdx = lastToken.lastIndexOf("/");
        const pathBefore = slashIdx >= 0 ? lastToken.substring(0, slashIdx + 1) : "";
        const completedToken = pathBefore + candidates[0];
        tokens[tokens.length - 1] = completedToken;

        const node = resolve(pathOf(completedToken, cwd));
        const suffix = node && typeof node === "object" ? "/" : " ";
        setValue(tokens.join(" ") + suffix);
      }
    } else if (candidates.length > 1) {
      setHistory((h) => [
        ...h,
        { kind: "in", text: `${prompt} ${currentValue}` },
        { kind: "out", text: candidates.join("   ") },
      ]);
    }
  };

  const run = (raw: string) => {
    const input = raw.trim();
    const next: Line[] = [{ kind: "in", text: `${prompt} ${raw}` }];
    const [cmd = "", ...args] = input.split(/\s+/);
    const arg = args.join(" ");

    const out = (text: string) => next.push({ kind: "out", text });

    switch (cmd) {
      case "":
        break;
      case "help":
        out("__HELP__");
        break;
      case "ll":
      case "ls": {
        const isLong = cmd === "ll" || args.includes("-l");
        const targetArg =
          cmd === "ll" ? args[0] : args.includes("-l") ? args.filter((a) => a !== "-l")[0] : arg;
        const target = targetArg ? pathOf(targetArg, cwd) : cwd;
        const node = resolve(target);
        if (node === undefined)
          out(`ls: cannot access '${targetArg || ""}': No such file or directory`);
        else if (typeof node === "string") {
          out(isLong ? `-rw-r--r-- 1 amr amr ${node.length} ${targetArg}` : targetArg || "");
        } else {
          if (isLong) {
            out(
              Object.entries(node)
                .map(([k, v]) => {
                  const isDir = typeof v === "object";
                  const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
                  const size = isDir ? 4096 : (v as string).length;
                  return `${perms} 1 amr amr ${size.toString().padStart(5)} ${k}`;
                })
                .join("\n") || "(empty)",
            );
          } else {
            out(Object.keys(node).join("   ") || "(empty)");
          }
        }
        break;
      }
      case "cd": {
        if (!arg || arg === "~") {
          setCwd(["home", "amr"]);
          break;
        }
        const target = pathOf(arg, cwd);
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
        const node = resolve(pathOf(arg, cwd));
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
        out(data.skills.map((s) => `• ${s.name}`).join("\n"));
        break;
      case "contact":
        out(
          `email:    ${data.profile.email}\ngithub:   ${data.profile.github}\nlinkedin: ${data.profile.linkedin}`,
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
      case "history":
        out(
          past
            .slice()
            .reverse()
            .map((p, i) => `${(i + 1).toString().padStart(4)}  ${p}`)
            .join("\n"),
        );
        break;
      case "uname":
        out(
          args.includes("-a")
            ? "Linux archlinux 6.9.6-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"
            : "Linux",
        );
        break;
      case "uptime":
        out(UPTIMES[Math.floor(Math.random() * UPTIMES.length)] || "");
        break;
      case "fortune":
        out(FORTUNES[Math.floor(Math.random() * FORTUNES.length)] || "");
        break;
      case "banner":
        out(BANNER.substring(1));
        break;
      case "tree": {
        const target = arg ? pathOf(arg, cwd) : cwd;
        const node = resolve(target);
        if (node === undefined) out(`tree: ${arg}: No such directory`);
        else if (typeof node === "string") out(arg);
        else out(".\n" + printTree(node).trimEnd());
        break;
      }
      case "open": {
        if (!arg) {
          out("open: missing operand. Try 'open projects'");
          break;
        }
        const normalizedArg = arg.toLowerCase().trim();
        const panels = [
          "resume",
          "skills",
          "projects",
          "certificates",
          "contact",
          "testimonials",
          "neofetch",
        ];
        let bestPanel = "";
        let bestDistPanel = 999;
        panels.forEach((p) => {
          if (p.includes(normalizedArg) || normalizedArg.includes(p)) {
            bestDistPanel = 0;
            bestPanel = p;
          } else {
            const dist = levenshtein(normalizedArg, p);
            if (dist < bestDistPanel) {
              bestDistPanel = dist;
              bestPanel = p;
            }
          }
        });

        let bestProj = "";
        let bestDistProj = 999;
        data.projects.forEach((p) => {
          const pName = p.name.toLowerCase();
          if (pName.includes(normalizedArg) || normalizedArg.includes(pName)) {
            bestDistProj = 0;
            bestProj = p.name;
          } else {
            const dist = levenshtein(normalizedArg, pName);
            if (dist < bestDistProj) {
              bestDistProj = dist;
              bestProj = p.name;
            }
          }
        });

        if (bestDistProj <= 2 && bestDistProj < bestDistPanel) {
          out(`Opening project: ${bestProj}...`);
          if (onOpenPanel) {
            sessionStorage.setItem("portfolio-initial-project", bestProj);
            setTimeout(() => onOpenPanel("projects"), 500);
          }
        } else if (bestDistPanel <= 3) {
          out(`Opening panel: ${bestPanel}...`);
          if (onOpenPanel) setTimeout(() => onOpenPanel(bestPanel), 500);
        } else {
          out(`open: could not find anything matching '${arg}'`);
        }
        break;
      }
      case "man":
        if (!arg) out("What manual page do you want?");
        else if (COMMANDS.includes(arg))
          out(
            `NAME\n       ${arg} - execute ${arg}\n\nDESCRIPTION\n       This is a simulated command for the portfolio terminal.`,
          );
        else out(`No manual entry for ${arg}`);
        break;
      case "clear":
        setHistory([]);
        setValue("");
        if (input) {
          setPast((p) => {
            const n = [input, ...p].slice(0, 200);
            localStorage.setItem("terminal-history", JSON.stringify(n));
            return n;
          });
        }
        setPastIdx(-1);
        return;
      case "exit":
        onClose();
        return;
      default: {
        let best = "";
        let minDist = 999;
        COMMANDS.forEach((c) => {
          const dist = levenshtein(cmd, c);
          if (dist < minDist) {
            minDist = dist;
            best = c;
          }
        });
        let msg = `${cmd}: command not found. Try 'help'.`;
        if (minDist <= 2) {
          msg += `\n\nDid you mean '${best}'?`;
        }
        out(msg);
      }
    }

    setHistory((h) => [...h, ...next]);
    if (input) {
      setPast((p) => {
        const n = [input, ...p].slice(0, 200);
        localStorage.setItem("terminal-history", JSON.stringify(n));
        return n;
      });
    }
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
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.5); border-radius: 4px; }
      `}</style>
      <div ref={scrollRef} className="flex-1 space-y-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="text-emerald-200/90 whitespace-pre-wrap break-words">
          {isTyping ? (
            <>
              {displayedText}
              <span className="animate-blink">▌</span>
            </>
          ) : (
            WELCOME_MSG
          )}
        </div>
        {history.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap break-words ${line.kind === "in" ? "text-white/60" : "text-emerald-200/90"}`}
          >
            {line.text.split("\\n").map((l, j) => (
              <div key={j}>{line.kind === "out" ? renderLine(l) : l}</div>
            ))}
          </div>
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
            if (e.key === "Tab") {
              e.preventDefault();
              handleTab(value);
            } else if (e.key === "l" && e.ctrlKey) {
              e.preventDefault();
              run("clear");
            } else if (e.key === "c" && e.ctrlKey) {
              e.preventDefault();
              setHistory((h) => [...h, { kind: "in", text: `${prompt} ${value}^C` }]);
              setValue("");
            } else if (e.key === "ArrowUp") {
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
