# Agent Instructions

This file provides project-specific rules, guidelines, and behavioral constraints for agents working in this repository.

## Tech Stack Overview

| Layer | Tool |
|---|---|
| Framework | React 19 with TanStack Start |
| Routing | `@tanstack/react-router` (file-based) |
| Data Fetching & State | `@tanstack/react-query` |
| Styling | Tailwind CSS 4.x |
| UI Components | Radix UI primitives (shadcn-like structure) |
| Forms & Validation | `react-hook-form` + `@hookform/resolvers/zod` |
| Icons | `lucide-react` |
| Animations | `framer-motion` |
| Build Tool | Vite via `@lovable.dev/vite-tanstack-config` |
| Language | TypeScript (strict) |

---

## Data Layer

All portfolio content lives in **`src/data/portfolio.json`** — the single source of truth.

- **Never hardcode** profile info, project details, skills, or copy directly in components. Always read from `portfolio.json`.
- Projects have: `name`, `description`, `stack[]`, `github`, `demo`, `status`, `featured`, `role`, `year`, `highlights[]`, `imageDir`.
- `imageDir` is a slug (e.g. `"ejust-sis"`) that maps to `src/assets/projects/<imageDir>/`. **Do not use an `images[]` array** — images are auto-discovered at build time via `src/data/projectImages.ts`.

### Adding project images

Drop image files into `src/assets/projects/<imageDir>/`. No other changes needed — `getProjectImages(slug)` discovers them automatically via `import.meta.glob`.

---

## File & Component Structure

```
src/
  assets/
    projects/<slug>/     ← project screenshots (one dir per project)
  components/
    room/
      panels/
        index.ts         ← barrel — the only import consumers use
        shared.ts        ← card constant + statusConfig + StatusKey type
        ResumePanel.tsx
        SkillsPanel.tsx
        ProjectsPanel.tsx
        ProjectDetail.tsx
        ImageCarousel.tsx
        CertificatesPanel.tsx
        ContactPanel.tsx
        TestimonialsPanel.tsx
        NeofetchPanel.tsx
  data/
    portfolio.json       ← all content
    projectImages.ts     ← lazy image resolver
  routes/
    __root.tsx
    index.tsx            ← the room + all hitbox logic
```

- New React components go in `src/components/`. Always use the `@/` path alias for imports from `src/`.
- When adding a new panel, create `src/components/room/panels/YourPanel.tsx` and re-export it from `panels/index.ts`.
- Shared panel styling constants (e.g. `card`, `statusConfig`) live in `panels/shared.ts` — do not duplicate them.

---

## General Guidelines

- **Use existing dependencies** — `lucide-react` for icons, `framer-motion` for animations, Radix UI for components. Do not install new packages without a strong reason.
- **TypeScript strict** — avoid `any`. Use proper types; extend the `Project` type locally when the JSON schema has optional fields (`role`, `year`, `highlights`, `imageDir`).
- **No wildcard icon imports** — `import * as Icons from "lucide-react"` is banned. It defeats tree-shaking. Always import only the icons you need, or add them to the `iconMap` in `index.tsx`.

---

## Coding Standards

- **Styling** — Tailwind CSS utility classes only. Use `clsx` / `tailwind-merge` for conditional classes.
- **Forms** — always use `react-hook-form` + `@hookform/resolvers/zod`.
- **Routing & data loading** — follow TanStack Start file-based conventions for routes and SSR loaders.

---

## Performance Rules

These patterns are intentional — do not revert them.

1. **Background images are preloaded** via `<link rel="preload">` in the route `head()`. Do not remove these or move the images back to `public/`.

2. **All panels are lazy-loaded** with `React.lazy` in `index.tsx`. Do not convert them back to static imports. When adding a new panel, lazy-load it the same way:
   ```ts
   const MyPanel = lazy(() => import("@/components/room/panels/MyPanel").then(m => ({ default: m.MyPanel })));
   ```

3. **`usePrefetchPanels`** fires `requestIdleCallback` after the room loads to warm the module cache. Add any new lazy-loaded panel to its import list.

4. **Project images use `import.meta.glob` with `eager: false`** — they are fetched on demand when a project detail view opens, not on page load.

---

## Vite Config Warning

`vite.config.ts` is intentionally minimal. `@lovable.dev/vite-tanstack-config` already bundles the following — **do NOT add them manually or the build will break**:

- TanStack devtools, `tanstackStart`, `viteReact`, `tailwindcss`, `tsConfigPaths`
- Nitro (build-only, Cloudflare target), VITE_* env injection
- `@` path alias, React/TanStack dedupe, error logger, sandbox detection

Only pass additional config via the `defineConfig({ vite: { ... } })` option.

---

## Workflow & Commands

```bash
npm run dev      # development server
npm run build    # production build
npm run format   # Prettier
npm run lint     # ESLint
npx tsc --noEmit # type check without building
```
