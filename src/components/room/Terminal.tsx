import { useEffect, useRef, useState } from "react";
import data from "@/data/portfolio.json";
import { Volume2, VolumeX } from "lucide-react";
import { initAudio, playKeystroke, toggleMute, getIsMuted } from "./terminal/audio";
import { fs, resolvePath, computePath, printTree, Dir } from "./terminal/fs";
import { COMMANDS, BANNER, FORTUNES, UPTIMES, levenshtein, formatMarkdownLine } from "./terminal/commands";
import { SnakeGame } from "./terminal/SnakeGame";
import { CMatrix } from "./terminal/CMatrix";

type Line = { kind: "in" | "out" | "json" | "password"; text: string };

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

function renderLine(text: string) {
  // basic inline markdown parsing for bold text
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  const parsedText = parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={i} className="font-bold text-emerald-300">{part.slice(2, -2)}</span>;
    }
    
    // Check URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(part)) {
      const urlParts = part.split(urlRegex);
      return (
        <span key={i}>
          {urlParts.map((uPart, j) =>
            urlRegex.test(uPart) ? (
              <a key={j} href={uPart} target="_blank" rel="noreferrer" className="text-sky-400 underline hover:text-sky-300">
                {uPart}
              </a>
            ) : (
              <span key={j}>{uPart}</span>
            )
          )}
        </span>
      );
    }
    
    return <span key={i}>{part}</span>;
  });

  if (text.startsWith("# ")) {
    return <span className="text-cyan-400 font-bold text-lg">{parsedText.slice(1)}</span>;
  }
  if (text.startsWith("## ")) {
    return <span className="text-cyan-400 font-bold">{parsedText.slice(1)}</span>;
  }
  if (text.startsWith("[ OK ]")) {
    return (
      <span>
        <span className="text-emerald-400">[ OK ]</span>
        {text.slice(6)}
      </span>
    );
  }
  if (text.startsWith("• ") || text.startsWith("├── ") || text.startsWith("└── ") || text.startsWith("│   ")) {
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
  
  if (text === "__HELP__") {
    const categories = {
      "Navigation": ["cd", "ls", "ll", "pwd", "tree"],
      "File & Utils": ["cat", "grep", "echo", "alias", "open"],
      "Portfolio": ["projects", "skills", "contact", "neofetch", "whoami", "banner"],
      "System": ["clear", "history", "date", "uptime", "uname", "sudo", "exit"],
      "Network": ["curl", "git"],
      "Fun": ["cmatrix", "snake", "fortune"],
      "Help": ["help", "man"]
    };

    return (
      <div className="mt-3 mb-2 space-y-4">
        <div className="text-white/80 border-b border-white/10 pb-1">Available commands:</div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
          {Object.entries(categories).map(([category, cmds]) => (
            <div key={category}>
              <div className="text-emerald-300/60 text-[10px] tracking-widest uppercase mb-1">{category}</div>
              <div className="flex flex-col space-y-0.5">
                {cmds.map(c => (
                  <div key={c} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-2 border-t border-white/10 text-white/50 text-[11px]">
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
  return <span>{parsedText}</span>;
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
  const [mode, setMode] = useState<"normal" | "password" | "snake" | "cmatrix">("normal");
  const [aliases, setAliases] = useState<Record<string, string>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const WELCOME_MSG = `${data.profile.name}'s shell — type 'help' to get started.`;
  const { displayedText, isTyping } = useTypewriter(WELCOME_MSG, 15);

  useEffect(() => {
    inputRef.current?.focus();
    const saved = localStorage.getItem("terminal-history");
    const savedAliases = localStorage.getItem("terminal-aliases");
    setIsMuted(getIsMuted());
    if (saved) {
      try { setPast(JSON.parse(saved)); } catch (e) {}
    }
    if (savedAliases) {
      try { setAliases(JSON.parse(savedAliases)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, displayedText, mode]);

  // Handle autosuggestion
  useEffect(() => {
    if (!value || mode !== "normal") {
      setSuggestion("");
      return;
    }
    
    // Fish-like suggestion from past commands
    const matchingPast = past.find(p => p.startsWith(value));
    if (matchingPast && matchingPast !== value) {
      setSuggestion(matchingPast);
      return;
    }

    // Command auto-completion suggestion
    const tokens = value.split(" ");
    if (tokens.length === 1) {
      const match = COMMANDS.find(c => c.startsWith(value.toLowerCase()));
      if (match) {
        // preserve original case for display but suggest lowercase
        setSuggestion(value + match.slice(value.length));
        return;
      }
    }
    
    setSuggestion("");
  }, [value, past, mode]);

  const prompt = `${data.profile.handle}:/${cwd.join("/")}$`;

  const handleTab = (currentValue: string) => {
    if (suggestion && suggestion.startsWith(currentValue)) {
       setValue(suggestion);
       return;
    }
    
    const tokens = currentValue.split(" ");
    const lastToken = tokens[tokens.length - 1] || "";
    const isCmd = tokens.length === 1;
    const lowerLast = lastToken.toLowerCase();

    let candidates: string[] = [];
    if (isCmd) {
      candidates = COMMANDS.filter((c) => c.startsWith(lowerLast));
    } else {
      const slashIdx = lastToken.lastIndexOf("/");
      const pathBefore = slashIdx >= 0 ? lastToken.substring(0, slashIdx + 1) : "";
      const partial = slashIdx >= 0 ? lastToken.substring(slashIdx + 1) : lastToken;

      const base = pathBefore ? computePath(pathBefore, cwd) : cwd;
      const node = resolvePath(base);
      if (node && typeof node === "object") {
        // Case-insensitive file path matching
        candidates = Object.keys(node).filter((k) => k.toLowerCase().startsWith(partial.toLowerCase()));
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

        const node = resolvePath(computePath(completedToken, cwd));
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    initAudio();
    if (e.target.value.length > value.length) {
      playKeystroke();
    }
    setValue(e.target.value);
  };

  const runCmd = async (raw: string) => {
    let input = raw.trim();
    if (!input) return;

    if (mode === "password") {
      setHistory((h) => [...h, { kind: "in", text: "Password: " + "*".repeat(input.length) }]);
      setHistory((h) => [...h, { kind: "out", text: "We trust you have received the usual lecture from the local System Administrator.\n\nkeep calm and sudo on." }]);
      setMode("normal");
      setValue("");
      return;
    }

    const next: Line[] = [{ kind: "in", text: `${prompt} ${raw}` }];
    const out = (text: string) => next.push({ kind: "out", text });
    const outJson = (text: string) => next.push({ kind: "json", text });

    // Handle aliases
    const [firstTerm, ...rest] = input.split(/\s+/);
    if (firstTerm && aliases[firstTerm]) {
       input = aliases[firstTerm] + (rest.length > 0 ? " " + rest.join(" ") : "");
    }

    const [cmdCaseSens = "", ...args] = input.split(/\s+/);
    const cmd = cmdCaseSens.toLowerCase(); // Case-insensitive commands
    const arg = args.join(" ");

    switch (cmd) {
      case "help":
        out("__HELP__");
        break;
      case "ll":
      case "ls": {
        const isLong = cmd === "ll" || args.includes("-l");
        const targetArg = cmd === "ll" ? args[0] : args.includes("-l") ? args.filter((a) => a !== "-l")[0] : arg;
        const target = targetArg ? computePath(targetArg, cwd) : cwd;
        const node = resolvePath(target);
        if (node === undefined) out(`ls: cannot access '${targetArg || ""}': No such file or directory`);
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
        const target = computePath(arg, cwd);
        const node = resolvePath(target);
        if (node === undefined || typeof node === "string") out(`cd: ${arg}: No such directory`);
        else setCwd(target);
        break;
      }
      case "pwd":
        out(`/${cwd.join("/")}`);
        break;
      case "cat": {
        if (!arg) {
          out(` ___________________________________________
/ this isn't a cat, this is a command       \\
\\ to view file contents. Try: cat about.txt /
 -------------------------------------------
⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠋⢀⠄⠀⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⡿⠿⠿⠿⢿⣿⡿⡿⠃⠅⠃⢠⡘⢦⠋⠀⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢠⢀⡀⠘⠛⠻⣿⠿⠻⠘⠘⣀⠀⠀⠀⡀⢠⡘⠄⠀⠀⡀⠃⠠⠘⠀⠃⠛⠘⠣⠀⣿⣿⣿⣿⣿⣿⣿⣿
⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠗⠀⠓⢀⠀⠀⠀⠀⠴⡐⡁⠀⠰⢁⣠⣊⢀⠀⡄⠀⡀⠄⠈⠁⠀⠀⣀⠀⠀⠐⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿
⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡐⠄⠀⠀⢀⠀⠀⣀⠀⠀⢣⠱⡀⣸⣿⣷⢊⢠⡇⠰⣁⠆⣈⠃⠤⠠⠀⡀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿
⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠖⢀⠠⡀⢎⢔⡪⢔⣠⢸⡛⡀⣿⣿⣿⣧⡿⡀⠃⠀⡐⠀⠀⢀⠀⠀⠀⠩⠉⠒⡠⠘⣿⣿⣿⣿⣿⣿⣿
⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠠⣃⠵⠊⠁⠉⠉⠈⠣⢏⣿⣿⣿⣿⣿⣏⡽⡀⠔⠀⠀⠊⠀⠀⠀⠀⢸⡰⡀⠀⠡⠸⢿⣿⣿⣿⣿⣿
⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠰⢎⡓⠂⠀⠀⠀⡶⠀⠀⠘⢾⣿⣿⣿⣿⣿⣜⢭⣲⠀⠀⠀⠀⠀⢀⡔⠃⠄⢀⠀⠀⠁⢺⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠈⠀⡸⣁⠀⠀⠀⠀⠈⠀⠀⣾⣿⣿⣿⣿⢻⡯⢎⣳⢶⣮⠳⢎⡙⠤⢘⠐⢁⡔⡁⢂⠤⡘⣿⣿⣿⣿⣿
⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠊⠅⠓⠢⠄⠤⠄⣤⡲⡾⣿⣿⡿⡽⣎⡷⠍⠊⡕⢮⣋⡗⡮⣌⡡⣤⠪⠄⢁⠠⠅⠒⡆⣿⣿⣿⣿⣿
⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⢀⡘⠤⣈⠂⠉⢄⠣⢄⡼⣱⣿⣿⠛⠁⢠⠐⡠⠃⢀⡴⡋⢞⡱⣎⠳⠇⡤⢀⢀⡈⠀⠶⡄⣿⣿⣿⣿⣿
⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢐⣬⠘⠈⠃⣨⣶⣖⣻⣿⣾⡿⣿⣻⣷⣶⣄⠈⠐⠀⣯⢺⡍⣏⠶⠥⠛⠮⡭⠭⢉⣉⠒⣪⢆⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣠⣴⢲⠭⣝⣦⡿⣿⣧⡽⢷⣛⣿⢾⡋⠾⠑⠀⠈⠈⠁⣭⡖⣘⣿⣿⠿⠦⢦⣄⠀⢍⡒⢸⣿⣿⣿⣿⣿
⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡘⢬⣫⣽⢛⡶⢽⣿⢿⢿⡻⠩⣠⣵⣶⣿⡹⢷⣦⡀⡾⡟⠘⠻⠿⠡⣾⣿⣿⣿⣿⣦⡀⢊⢽⣿⣿⣿⣿
⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡹⠱⡾⣫⣵⢟⢕⣕⢃⣵⡿⣟⣛⡻⡿⠇⠈⠀⠁⠁⠀⠀⠀⠀⠀⡉⠿⡿⣿⣿⣿⣿⢦⠢⢻⣿⣿⣿
⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⢚⣵⠻⡔⡝⡳⢠⣽⣿⣿⣿⣿⡯⠀⠀⠠⢀⡰⢠⣋⠵⠀⢀⠀⢀⡡⠇⣽⣿⠿⣻⠜⣷⠥⠹⣿⣿
⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢘⢨⢎⠶⣹⢡⣿⣿⣿⣿⢿⠿⡍⢳⢦⣀⠀⠑⠣⠊⠀⣠⢆⠭⡠⣂⠸⢜⡿⡿⡲⠁⣩⠟⣥⠹⣿
⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⣼⣿⣭⢻⠁⣾⣿⣿⣿⡟⠖⠗⡀⣃⠏⣴⡲⠖⣀⠐⠮⠁⠁⠂⠁⠁⠠⢉⠘⡁⢐⠰⣀⠹⢧⡃⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣽⣿⡇⠃⣼⣿⣿⣿⡏⣮⣭⠐⣣⡥⠙⠂⠑⠀⠀⠀⠀⠀⠀⡄⢠⠀⠀⠀⠐⡌⢢⠁⡆⠂⣯⢳⢸
⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣾⣟⠞⢠⣿⣿⣿⡿⣟⢳⣂⣁⠥⠁⠀⠀⢀⠠⠀⠤⠐⢂⠡⡐⠂⡌⠄⠀⡀⠰⣈⠒⢌⢂⢹⢮⢸
⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⣾⣻⣀⣾⣿⣿⣟⣻⣥⣳⣋⣨⣀⣀⣀⣁⣂⣂⣉⣀⣃⣂⣁⣀⣃⣘⣨⣀⣀⣀⣀⣊⣐⣈⣂⣯⣊
`);
          break;
        }
        const node = resolvePath(computePath(arg, cwd));
        if (typeof node === "string") out(node);
        else if (node === undefined) out(`cat: ${arg}: No such file or directory`);
        else out(`cat: ${arg}: Is a directory`);
        break;
      }
      case "whoami":
        out(`${data.profile.name} — ${data.profile.role}\n${data.resume.summary}`);
        break;
      case "projects":
        out(data.projects.map((p) => `• ${p.name}\n  ${p.description}\n  [${p.stack.join(", ")}]`).join("\n\n"));
        break;
      case "skills":
        out(data.skills.map((s) => `• ${s.name}`).join("\n"));
        break;
      case "contact":
        out(`email:    ${data.profile.email}\ngithub:   ${data.profile.github}\nlinkedin: ${data.profile.linkedin}`);
        break;
      case "neofetch": {
        const bannerLines = BANNER.trim().split("\n");
        const infoLines = data.neofetch.lines.map(([k, v]) => `${String(k).padEnd(10)} ${v}`);
        const maxLines = Math.max(bannerLines.length, infoLines.length);
        const outLines = [];
        for (let i = 0; i < maxLines; i++) {
          const b = (bannerLines[i] || "").padEnd(25, " ");
          const info = infoLines[i] || "";
          outLines.push(`${b}   ${info}`);
        }
        out(outLines.join("\n"));
        break;
      }
      case "echo":
        out(arg);
        break;
      case "date":
        out(new Date().toString());
        break;
      case "sudo":
        setMode("password");
        setHistory((h) => [...h, ...next, { kind: "out", text: "[sudo] password for visitor: " }]);
        setValue("");
        return; // wait for password input
      case "history":
        out(past.slice().reverse().map((p, i) => `${(i + 1).toString().padStart(4)}  ${p}`).join("\n"));
        break;
      case "uname":
        out(args.includes("-a") ? "Linux archlinux 6.9.6-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux" : "Linux");
        break;
      case "uptime":
        out(UPTIMES[Math.floor(Math.random() * UPTIMES.length)] || "");
        break;
      case "fortune":
        try {
          const res = await fetch("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,political,racist,sexist,explicit&format=txts");
          if (!res.ok) throw new Error();
          const text = await res.text();
          out(text);
        } catch (e) {
          out(FORTUNES[Math.floor(Math.random() * FORTUNES.length)] || "");
        }
        break;
      case "banner":
        out(BANNER.substring(1));
        break;
      case "tree": {
        const target = arg ? computePath(arg, cwd) : cwd;
        const node = resolvePath(target);
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
        const panels = ["resume", "skills", "projects", "certificates", "contact", "testimonials", "neofetch"]
          .filter(p => (data.panelMeta as any)[p]?.enabled !== false);
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
          out(`NAME\n       ${arg} - execute ${arg}\n\nDESCRIPTION\n       This is a simulated command for the portfolio terminal.`);
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
      case "alias": {
        if (!arg) {
           out(Object.entries(aliases).map(([k,v]) => `alias ${k}='${v}'`).join('\n') || "No aliases defined.");
           break;
        }
        const match = arg.match(/^([^=]+)="(.*)"$/) || arg.match(/^([^=]+)='(.*)'$/) || arg.match(/^([^=]+)=(.*)$/);
        if (match) {
           const key = match[1]!;
           const val = match[2]!;
           const newAliases = { ...aliases, [key]: val };
           setAliases(newAliases);
           localStorage.setItem("terminal-aliases", JSON.stringify(newAliases));
        } else {
           out(`alias: invalid format. Try: alias name="command"`);
        }
        break;
      }
      case "grep": {
        const grepMatch = arg.match(/^(?:['"]?([^'"]+)['"]?\s+)?(.+)$/);
        if (!grepMatch) {
           out("Usage: grep <pattern> <file>");
           break;
        }
        const pattern = grepMatch[1] || "";
        const file = grepMatch[2] || "";
        const node = resolvePath(computePath(file, cwd));
        if (typeof node === "string") {
           const lines = node.split('\n');
           const matched = lines.filter(l => l.includes(pattern));
           out(matched.join('\n') || "");
        } else {
           out(`grep: ${file}: No such file or Is a directory`);
        }
        break;
      }
      case "git":
        if (arg === "status") {
           out("On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean");
        } else if (arg === "log") {
           out("commit 3a5f98c (HEAD -> main, origin/main)\nAuthor: Amr Mahmoud <amr.mahmoud.dev05@gmail.com>\nDate:   Sun Sep 15 12:00:00 2026 +0300\n\n    Initial commit: Room escape portfolio");
        } else {
           out("git: simulated command only supports 'status' and 'log'.");
        }
        break;
      case "curl":
        if (!arg) {
           out("curl: try 'curl --help' or 'curl <url>'");
           break;
        }
        setHistory((h) => [...h, ...next, { kind: "out", text: `Fetching ${arg}...` }]);
        setValue("");
        try {
           const res = await fetch(arg);
           const contentType = res.headers.get("content-type");
           if (contentType && contentType.includes("application/json")) {
              const data = await res.json();
              setHistory(h => [...h, { kind: "json", text: JSON.stringify(data, null, 2) }]);
           } else {
              const text = await res.text();
              setHistory(h => [...h, { kind: "out", text: text.substring(0, 1000) + (text.length > 1000 ? "\n...[truncated]" : "") }]);
           }
        } catch (e: any) {
           setHistory(h => [...h, { kind: "out", text: `curl: (6) Could not resolve host: ${arg}\n${e.message}` }]);
        }
        return; // async update
      case "snake":
        setMode("snake");
        setValue("");
        return;
      case "cmatrix":
        setMode("cmatrix");
        setValue("");
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

  if (mode === "snake") {
    return <SnakeGame onExit={() => setMode("normal")} />;
  }

  if (mode === "cmatrix") {
    return <CMatrix onExit={() => setMode("normal")} />;
  }

  const handleMuteToggle = () => {
    const muted = toggleMute();
    setIsMuted(muted);
  };

  // Syntax highlighting for the command input
  const tokens = value.split(" ");
  const isKnownCommand = COMMANDS.includes((tokens[0] || "").toLowerCase());
  
  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`rounded-lg border border-white/10 bg-black/60 font-mono text-[13px] leading-relaxed text-emerald-200/90 ${
        compact ? "h-[45vh]" : "h-[60vh]"
      } flex flex-col relative`}
    >
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.5); border-radius: 4px; }
      `}</style>
      
      <button 
        onClick={handleMuteToggle}
        className="absolute top-3 right-4 z-10 text-white/40 hover:text-white transition-colors"
        title={isMuted ? "Unmute typing sounds" : "Mute typing sounds"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      <div ref={scrollRef} className="flex-1 space-y-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="text-emerald-200/90 whitespace-pre-wrap break-words pr-6">
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
            className={`whitespace-pre-wrap break-words ${line.kind === "in" ? "text-white/60" : line.kind === "json" ? "text-sky-300" : "text-emerald-200/90"}`}
          >
            {line.kind === "password" ? line.text : line.text.split("\n").map((l, j) => (
              <div key={j}>{line.kind === "out" ? renderLine(l) : l}</div>
            ))}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runCmd(value);
        }}
        className="flex items-center gap-2 border-t border-white/10 px-4 py-3 relative"
      >
        <span className="shrink-0 text-emerald-400">{prompt}</span>
        
        {/* Fish shell autosuggestion behind input */}
        <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none flex items-center gap-2 px-4 py-3 overflow-hidden whitespace-pre">
           <span className="shrink-0 text-transparent">{prompt}</span>
           <span className="text-white/30">{suggestion}</span>
        </div>

        {/* Syntax highlighting beneath transparent input */}
        <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none flex items-center gap-2 px-4 py-3 overflow-hidden whitespace-pre">
           <span className="shrink-0 text-transparent">{prompt}</span>
           {mode === "password" ? (
             <span className="text-white/50">{"*".repeat(value.length)}</span>
           ) : (
             <>
               <span className={isKnownCommand ? "text-emerald-400" : "text-red-400/90"}>{tokens[0]}</span>
               {tokens.length > 1 && <span className="text-white/90"> {tokens.slice(1).join(" ")}</span>}
             </>
           )}
        </div>

        <input
          ref={inputRef}
          value={value}
          onChange={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              handleTab(value);
            } else if (e.key === "l" && e.ctrlKey) {
              e.preventDefault();
              runCmd("clear");
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
          type="text"
          className="min-w-0 flex-1 bg-transparent caret-emerald-400 outline-none z-10 text-transparent"
        />
      </form>
    </div>
  );
}
