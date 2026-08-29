# Coding Room Escape

Act as an expert frontend React developer specializing in interactive, highly animated spatial user interfaces. 

I want to build a unique "escape room" style interactive portfolio. The user interface is completely driven by a background image of a dark, aesthetic coding room. The user clicks on specific items in the room to trigger a smooth zoom-in animation, followed by a glass-morphism modal displaying my portfolio information.

### 1. Image Assets & Responsive Layout
I have two images to act as the full-screen background:
- Desktop Background: "landscapeView.png" (Wide aspect ratio).
- Mobile Background: "mobileView.png" (Tall aspect ratio).

Implementation details:
- Use a wrapper div that takes up `100vw` and `100vh` with `overflow-hidden`.
- Set the background image dynamically based on screen size (use Tailwind's responsive breakpoints `bg-[url(...)] md:bg-[url(...)]`).
- The background must use `background-size: cover` and `background-position: center`.

### 2. The Core Mechanic: Hitboxes & Animations
- Overlay an absolute positioned container on top of the background.
- Inside this container, create invisible, clickable "hitbox" buttons (e.g., `<button className="absolute ...">`). 
- **Crucial:** Use percentage-based positioning (`top`, `left`, `width`, `height`) for the hitboxes so they scale perfectly with the background image. 
- **Debug Mode:** Add a hidden "debug mode" toggle (e.g., a keyboard shortcut or a small transparent button in the corner) that gives these hitboxes a semi-transparent red background (`bg-red-500/50`) so I can easily adjust the Tailwind percentage coordinates in the code later.
- **Animation:** Use `framer-motion`. When a hitbox is clicked:
  1. Calculate the center of the clicked hitbox.
  2. Scale/Zoom the entire background container towards that point (approximate a 1.5x to 2x zoom).
  3. Fade in a modal perfectly centered on the screen.
  4. Clicking outside the modal, clicking "esc" button from the keyboard or clicking an "X" button should reverse the animation (fade out modal, zoom out background back to scale 1).

### 3. Element Mapping & Placeholder Content
Create the following hitboxes with this exact mapped content. Use sleek, dark-themed, highly blurred glass-morphism (`backdrop-blur-md bg-black/40 border border-white/10 rounded-xl text-white`) for all modals.

1. **Left Poster ("Talk is cheap") -> Resume/CV**
   - Modal Content: A clean timeline. Mention "Computer Science Student at E-JUST" and "Android Development Trainee at DEPI". Add a "Download CV" button.

2. **Middle Pegboard (Keyboard & Headphones) -> Skills**
   - Modal Content: Display skills using badges or progress bars. Include: Node.js, NestJS, PostgreSQL, MariaDB, RabbitMQ, Docker, Arch Linux, C++, and Git.

3. **Top Right Poster (Coffee script) -> Projects**
   - Modal Content: A scrollable grid of project cards. Include:
     - "Syncly": A modular monolith architecture utilizing NestJS and RabbitMQ messaging queues.
     - "Green Rabbit": A financial market assistant application using Meyka AI API.

4. **Middle Right Poster (Arch Linux) -> Certificates**
   - Modal Content: Minimalist cards showing achievements, mentioning competitive programming (ECPC/ACPC/ICPC pipelines) and DEPI completion.

5. **Desk Keyboard & Mouse -> Contact**
   - Modal Content: A simple glass-morphism contact form (Name, Email, Message) and links to GitHub and LinkedIn.

6. **Desk Drawers -> Testimonials**
   - Modal Content: A carousel or list of quotes praising backend architecture and leadership skills.

7. **Penguin on the Shelf -> Neofetch**
   - Modal Content: A terminal-styled window displaying a classic Neofetch output:
     `OS: Arch Linux`
     `DE: KDE Plasma`
	 `IDE: NVIM`
     `Terminal: tmux / kitty`
     `Uptime: 42 days`

### 4. Interactive Terminals
There are two special hitboxes that shouldn't just open standard modals, but should open functional, interactive React terminal emulators (you can build a lightweight custom one or use a library like `react-terminal`) that act as a normal terminal with the normal functionality of any terminal:

8. **Bottom Right Glowing Sign ("Keep calm and sudo on") -> Full Feature Terminal**
   - Modal Content: A large terminal window. Users can type commands like `ls`, `cd`, `help`, `whoami`, `projects`, `skills`. Have it print out interactive text responses based on the data mentioned above.

9. **Top Glowing Sign ("root@localhost:~$") -> Easter Egg Terminal**
   - Modal Content: A smaller terminal window that starts a fun script (like a Matrix rain effect or a "hacking in progress" typing animation) before revealing a secret message or a link to a hidden project.

### Technical Constraints:
- Ensure all text is highly legible against the dark backgrounds.
- Add an "Escape" key event listener to close any open modal and reset the zoom.
- Include Lucide React icons for the modal headers and buttons.
- Build this as a single-page application structure with cleanly separated components for the Modals, Hitboxes, and Terminals.
- Make all the data configurable in a JSON file so adding new data is easy.
- Make sure all the elemnts aren't coded for just one dimension and it is both responsive & interactive

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6b4a3e81-0147-451a-8b58-b4ed55f294e8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
