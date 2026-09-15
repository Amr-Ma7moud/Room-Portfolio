import data from "@/data/portfolio.json";

export type Dir = { [key: string]: Dir | string };

export const fs: Dir = {
  home: {
    amr: {
      "about.txt": `${data.profile.name} — ${data.profile.role}\n${data.resume.summary}`,
      "contact.txt": `email: ${data.profile.email}\ngithub: ${data.profile.github}\nlinkedin: ${data.profile.linkedin}`,
      projects: Object.fromEntries(
        data.projects.map((p) => [
          `${p.name.toLowerCase().replace(/\s+/g, "-")}.md`,
          `# ${p.name}\n\n${p.description}\n\n**Stack:** ${p.stack.join(", ")}\n**Role:** ${p.role}\n**Year:** ${p.year}`,
        ]),
      ),
      "skills.txt": data.skills.map((s) => s.name).join("\n"),
      ".git": {
        config: "[core]\n\trepositoryformatversion = 0\n\tfilemode = true\n\tbare = false\n\tlogallrefupdates = true\n[remote \"origin\"]\n\turl = https://github.com/amr-ma7moud/room-escape-portfolio.git\n\tfetch = +refs/heads/*:refs/remotes/origin/*",
        HEAD: "ref: refs/heads/main",
      }
    },
  },
  etc: { motd: data.terminal.motd },
};

export function resolvePath(path: string[]): Dir | string | undefined {
  let node: Dir | string | undefined = fs;
  for (const part of path) {
    if (typeof node !== "object" || node === null) return undefined;
    node = node[part];
  }
  return node;
}

export function computePath(p: string, currentCwd: string[]): string[] {
  const base = p.startsWith("/") ? [] : [...currentCwd];
  for (const part of p.split("/").filter(Boolean)) {
    if (part === ".") continue;
    if (part === "..") base.pop();
    else base.push(part);
  }
  return base;
}

export function printTree(node: Dir | string, prefix = ""): string {
  if (typeof node === "string") return "";
  const keys = Object.keys(node);
  return keys
    .map((k, i) => {
      const isLast = i === keys.length - 1;
      const pointer = isLast ? "└── " : "├── ";
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      let result = prefix + pointer + k + "\n";
      if (typeof node[k] === "object") {
        result += printTree(node[k] as Dir, nextPrefix);
      }
      return result;
    })
    .join("");
}
