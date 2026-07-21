# Christophe El Chabab — Portfolio

Dark mirror-glass portfolio. Kinetic hero (staggered letter entrance, three-layer mouse
parallax over a Higgsfield-generated liquid-chrome texture, magnetic letters,
scroll-linked exit), skills marquee, and numbered sections: About · Projects ·
Experience · Contact.

Type pairing (from breedlove.xyz): **Archivo** (sans display) + **Newsreader italic**
(serif accents — anything wrapped in `<em>`).

## Run it

No build step — plain HTML/CSS/JS. Either open `index.html` directly, or serve it:

```
python -m http.server 4173
```

then visit http://localhost:4173.

## Edit the text

**All copy lives in [`js/content.js`](js/content.js).** Change a value, save, refresh.
Fields marked `(HTML ok)` accept `<em>…</em>` for the italic serif accent.

- `hero.nameLines` — the big animated name (each array entry is one line)
- `hero.ghostWord` — the giant translucent word floating behind it
- `marquee` — the looping skills ticker (every other item renders in italic serif)
- `projects.items` — title, desc, tags, year, href per row
- `experience.jobs` / `experience.education` — timeline + education cards
- `contact` — big closing headline, email, footer lines
- `nav.resume.href` — point this at your résumé PDF when you add it to the folder

## Structure

| Piece | Where |
|---|---|
| Staggered letter entrance | `.letter` transitions in `css/style.css`, delays set in `js/main.js` |
| 3-layer mouse parallax | `frame()` in `js/main.js` — texture/bg moves against the cursor, ghost mid-rate, name fastest + 3D tilt |
| Hero background texture | `assets/hero-texture.png` (Higgsfield-generated), styled by `.bg-texture` |
| Magnetic letters | `MAG_RADIUS` / `MAG_PULL` in `js/main.js` |
| Scroll-linked exit | Hero is `position: sticky` inside `.hero-wrap` (175vh); progress drives scale/fade/letter-spread |
| Skills marquee | `.marquee` CSS animation; content duplicated in `js/main.js` for a seamless loop; skews & speeds up with scroll velocity |
| Scroll reveals | `.reveal` + IntersectionObserver in `js/main.js` |
| Scroll readout | `.scrl-counter`, updated in the frame loop |
| Custom cursor | dot + trailing ring (`.cursor-dot` / `.cursor-ring`); ring grows over interactive elements |
| Word-split headings | `splitWords()` in `js/main.js` — staggered mask reveal per word |
| Giant section numbers | `.ghost-num`, parallaxed in the frame loop |
| Card spotlight + tilt | `--mx`/`--my` radial highlight + 3D tilt on stat/education cards |
| Floating "View" chip | `.row-chip` follows the cursor over project rows |
| Timeline draw | `.exp-line-fill` scales with scroll; dots light up as they pass |
| Stat count-ups | `animateStat()` — numbers count up when revealed (incl. the 10⁻⁶ exponent) |
| Progress bar | `.progress-bar`, thin accent line at the top of the viewport |

Reduced-motion users get a static page with all content visible; touch devices skip
cursor effects but keep the entrance, reveals, and scroll exit.

## Adding a section

Duplicate one of the `<section class="section …">` blocks in `index.html`, give it an
`id`, add its text to `content.js`, and populate it in the top block of `js/main.js`.
Add `class="reveal"` to anything that should fade in on scroll.
