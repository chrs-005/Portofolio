# Christophe El Chabab, portfolio

Plain HTML, CSS and JavaScript. No build step.

```
python -m http.server 4173
```

then open http://localhost:4173. Live at https://chrs-005.github.io/Portofolio/ (GitHub Pages, deploys from `main`).

## Editing

**All text and media live in [`js/content.js`](js/content.js).** Research, projects,
experience, about, contact. Each project has `body`, `figures`, `stack`, `role`, `links`
and `media`.

- `role` and any link whose `href` is `"#"` stay hidden until you fill them in.
- `media` items are either a real image
  `{ type: "image", src: "assets/projects/x.jpg", alt, caption }`
  or a live graphic `{ type: "visual", name: "latex", caption }`.
  Put screenshots in `assets/projects/` and swap them in.
- After editing CSS or JS, bump the `?v=` numbers in `index.html` if your browser shows
  an old version.

## Files

| File | What it does |
|---|---|
| `js/bg.js` | WebGL smoke background. Always moving, stirred by the cursor, dims on scroll. Falls back to `assets/hero-texture.png` without WebGL. |
| `js/sound.js` | Sound design made with the Web Audio API (no audio files): ambient drone, hover tones, click. Off until the visitor turns it on. |
| `js/visuals.js` | Live illustrations for projects without screenshots: `latex`, `rl`, `pinn`, `ble`, `market`, `voice`, `grader`. They only animate while on screen. |
| `js/main.js` | Renders content, kinetic name entrance, hero parallax and scroll exit, magnetic letters, glyph scramble, image wipe reveals, lightbox, Beirut clock. |
| `css/style.css` | Layout and type: Archivo, Newsreader, JetBrains Mono. |

ClubOps and the attendance research images come from Tatiana Nohra's portfolio, used with her permission.

Reduced-motion visitors get a still page with everything visible.
