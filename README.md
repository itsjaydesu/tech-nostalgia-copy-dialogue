# copy-dialogue

A 3D recreation of the classic Windows file copy dialog — complete with flying papers, a chunky progress bar, and a teal desktop.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-0.183-black?logo=three.js)
![React Three Fiber](https://img.shields.io/badge/R3F-9-black)
![License](https://img.shields.io/badge/License-MIT-blue)

## What it does

Copy Dialogue renders the iconic Windows 95 "Copying..." dialog as an interactive 3D scene. Papers tumble between folders, the progress bar fills block by block, and familiar filenames like `winamp.exe` and `quake.exe` scroll past. A faithful Windows taskbar sits at the bottom — Start button, quick launch, and a live clock.

**Features:**

- Animated 3D papers flying between source and destination folders
- Segmented progress bar cycling through nostalgic filenames
- Windows 95 taskbar with Start button and system tray clock
- 9 camera angles — front, orbit, dolly, sweeping arc, and more
- Auto-cycling camera mode with smooth lerp transitions
- Click the Start button to manually cycle views
- Orbit controls for free camera exploration

## Getting started

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/itsjaydesu/copy-dialogue.git
cd copy-dialogue
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech stack

- **[Next.js](https://nextjs.org/)** — React framework
- **[Three.js](https://threejs.org/) / [React Three Fiber](https://r3f.docs.pmnd.rs/)** — 3D rendering
- **[Drei](https://drei.docs.pmnd.rs/)** — R3F helpers (OrbitControls, Text, Environment)
- **[Tailwind CSS](https://tailwindcss.com/)** — Styling
- **[Lucide](https://lucide.dev/)** — Icons

## Project structure

```
app/
  layout.tsx          Root layout
  page.tsx            Main scene — dialog, taskbar, camera controller
  globals.css         Global styles
hooks/
  use-mobile.ts       Mobile viewport detection
lib/
  utils.ts            Tailwind class merge utility
```

## Scripts

| Command         | Description            |
| --------------- | ---------------------- |
| `npm run dev`   | Start dev server       |
| `npm run build` | Production build       |
| `npm start`     | Serve production build |
| `npm run lint`  | Run ESLint             |
| `npm run clean` | Clear `.next` cache    |

## License

[MIT](LICENSE)

## Author

**itsjaydesu** — [GitHub](https://github.com/itsjaydesu) · [X](https://x.com/itsjaydesu) · [Website](https://itsjaydesu.com)
