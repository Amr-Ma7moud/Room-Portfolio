# Amr Mahmoud — Escape Room Portfolio

An interactive, "escape room" style portfolio built with React and Framer Motion. Instead of a traditional scrolling website, the user interface is completely driven by a background image of a dark, aesthetic coding room.

Users can explore the room by clicking on specific items to trigger smooth zoom-in animations, followed by sleek glass-morphism modals displaying portfolio information, skills, projects, and even functional interactive terminals.

## ✨ Features

- **Spatial User Interface:** A fully responsive, interactive background (adapts to both mobile and desktop screens).
- **Smooth Animations:** Powered by `framer-motion`, clicking a hitbox calculates its center and zooms the entire room into focus before fading in the content.
- **Glass-morphism UI:** Sleek, dark-themed, blurred modals for a modern look (`backdrop-blur-md`, `bg-black/40`).
- **Interactive Terminals:** Functional React terminal emulators that allow users to type commands like `ls`, `cd`, `whoami`, `projects`, and `skills` to interact with the portfolio data.
- **Easter Eggs:** Hidden terminals and scripts waiting to be discovered.
- **Data-Driven:** All portfolio content (resume, skills, projects, certificates, testimonials) is easily configurable via a single `src/data/portfolio.json` file.
- **Debug Mode:** A built-in debug toggle to easily view and adjust invisible hitboxes overlaid on the room elements.

## 🛠️ Tech Stack

- **Framework:** React + TypeScript (Vite/TanStack Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Package Manager:** Bun (or npm/yarn/pnpm)

## 📁 Project Structure

- `src/assets/`: Contains the high-resolution background images for desktop and mobile layouts.
- `src/components/room/`: Core components driving the interactive room experience (Hitboxes, Modals, Panels, Terminals).
- `src/data/portfolio.json`: The central data file for configuring all content, hitboxes, and terminal responses.
- `src/routes/`: TanStack Router file-based routing configuration.

## ⚙️ Customizing Hitboxes

To adjust the clickable areas (hitboxes) over the background image:

1. Open `src/data/portfolio.json`.
2. Locate the `hitboxes` array.
3. Turn on Debug Mode in the UI (or press `Shift + D`) to make the hitboxes visible as red squares.
4. Adjust the percentage-based `left`, `top`, `width`, and `height` values for both `desktop` and `mobile` views until they perfectly align with the visual elements in the background image.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
