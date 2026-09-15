import data from "@/data/portfolio.json";

export const COMMANDS = [
  "help",
  "ls",
  "ll",
  "cd",
  "pwd",
  "cat",
  "whoami",
  "projects",
  "skills",
  "contact",
  "neofetch",
  "echo",
  "date",
  "sudo",
  "history",
  "uname",
  "uptime",
  "fortune",
  "banner",
  "tree",
  "open",
  "man",
  "clear",
  "exit",
  "grep",
  "git",
  "curl",
  "alias",
  "cmatrix",
  "snake"
];

export const BANNER = data.terminal.banner;
export const FORTUNES = data.terminal.fortunes;
export const UPTIMES = data.terminal.uptimes;

export function levenshtein(a: string, b: string): number {
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

// Basic markdown-to-React elements formatter for terminal output
export function formatMarkdownLine(text: string) {
  let formatted = text;
  
  if (formatted.startsWith("# ")) {
    return { type: 'h1', text: formatted.substring(2) };
  }
  if (formatted.startsWith("## ")) {
    return { type: 'h2', text: formatted.substring(3) };
  }
  if (formatted.startsWith("- ") || formatted.startsWith("* ")) {
    return { type: 'list', text: formatted.substring(2) };
  }
  
  // Return plain for inline processing later in renderLine
  return { type: 'p', text: formatted };
}
