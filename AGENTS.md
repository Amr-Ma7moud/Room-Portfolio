# Agent Instructions

This file (`AGENTS.md`) provides project-specific rules, guidelines, and behavioral constraints for Antigravity agents working in this repository.

## Tech Stack Overview
- **Framework:** React 19 with TanStack Start
- **Routing:** `@tanstack/react-router`
- **Data Fetching & State:** `@tanstack/react-query`
- **Styling:** Tailwind CSS 4.x
- **UI Components:** Radix UI primitives (shadcn-like structure)
- **Forms & Validation:** `react-hook-form` + `zod`
- **Icons:** `lucide-react`
- **Animations:** `framer-motion`
- **Build Tool:** Vite (with `@lovable.dev/vite-tanstack-config`)
- **Language:** TypeScript

## General Guidelines
- **Use Existing Tools:** Prioritize existing dependencies (e.g., `lucide-react` for icons, `framer-motion` for animations, Radix UI for components) over installing new packages.
- **File Structure:** Maintain the established folder structure. Place new React components in `src/components` and use the `@/` path alias when importing from `src/`.
- **TypeScript:** Write strictly typed code. Avoid using `any` and leverage the `tsconfig.json` strictness.

## Coding Standards
- **Styling:** Build UI elements using Tailwind CSS utility classes. Combine classes conditionally using `clsx` and `tailwind-merge`.
- **Form Handling:** Always use `react-hook-form` integrated with `@hookform/resolvers/zod` for form state management and validation.
- **Routing & Data Loading:** Follow TanStack Start conventions for file-based routing and SSR data loading.

## Workflow & Commands
- **Development Server:** `npm run dev`
- **Production Build:** `npm run build`
- **Code Formatting:** `npm run format` (Prettier)
- **Linting:** `npm run lint` (ESLint)
