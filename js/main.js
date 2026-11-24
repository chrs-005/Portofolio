/* ============================================================
   Page engine. Renders js/content.js, then runs:
   kinetic name entrance, hero parallax + scroll exit, magnetic
   letters, glyph-scramble headings, media wipe reveals with
   parallax, lightbox, sound hooks, live Beirut clock.
   ============================================================ */
(() => {
  const C = window.CONTENT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const live = (l) => l && l.href && l.href !== "#";
  const ext = (href) => /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "";
  const pad2 = (n) => String(n).padStart(2, "0");

  /* ----------------------------------------------------------
     1 · Render
     ---------------------------------------------------------- */
  document.title = C.meta.title;
  $("#navLinks").innerHTML = C.nav.map((l) => `<a href="${l.href}" data-text="${esc(l.label)}">${esc(l.label)}</a>`).join("");

  // kinetic name
  const nameEl = $("#name");
  nameEl.setAttribute("aria-label", C.nameLines.join(" "));
  const letters = [];
  C.nameLines.forEach((line, li) => {
    const row = document.createElement("span");
    row.className = "name-line";
    row.setAttribute("aria-hidden", "true");
    [...line].forEach((ch) => {
      if (ch === " ") {
        const sp = document.createElement("span");
        sp.className = "letter-space";
        row.appendChild(sp);
        return;
      }
      const o = document.createElement("span");
      o.className = "letter";
      const i = document.createElement("span");
      i.className = "letter-inner";
      i.textContent = ch;
      o.appendChild(i);
      row.appendChild(o);
      letters.push({ el: o, inner: i, li, pos: 0, cx: 0, cy: 0, x: 0, y: 0, s: 1 });
    });
    nameEl.appendChild(row);
  });
  C.nameLines.forEach((_, li) => {
    const inLine = letters.filter((l) => l.li === li);
    const mid = (inLine.length - 1) / 2;
    inLine.forEach((l, i) => (l.pos = i - mid));
  });

  $("#ghostWord").textContent = C.ghostWord;
  $("#intro").textContent = C.intro;
  const linksHTML = C.links.filter(live)
    .map((l) => `<a class="tlink" href="${l.href}"${ext(l.href)}>${esc(l.label)}<span>↗</span></a>`).join("");
  $("#heroLinks").innerHTML = linksHTML;
  $("#cornerL").innerHTML = `${esc(C.location.place)}<br>${esc(C.location.coords)}`;

  // media figure
  const mediaHTML = (m) => {
    const cap = m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : "";
    if (m.type === "image") {
      return `<figure class="media"><div class="media-frame"><img src="${esc(m.src)}" alt="${esc(m.alt)}" loading="lazy" data-caption="${esc(m.caption)}" /></div>${cap}</figure>`;
    }
    return `<figure class="media"><div class="media-frame"><canvas data-visual="${esc(m.name)}" role="img" aria-label="${esc(m.caption)}"></canvas></div>${cap}</figure>`;
  };

  const headHTML = (title, count) =>
    `<div class="section-head"><h2 class="section-title" data-scramble data-text="${esc(title)}">${esc(title)}</h2>` +
    (count ? `<span class="section-count mono">(${count})</span>` : "") + `</div>`;

  // research + projects
  function renderCases(id, data) {
    const cases = data.items.map((p, i) => {
      const meta = [`<span>${pad2(i + 1)}</span>`, `<span>${esc(p.context)}</span>`, `<span>${esc(p.dates)}</span>`];
      if (p.status) meta.push(`<span class="status">${esc(p.status)}</span>`);
      const figs = (p.figures || []).map((f) =>
        `<div><div class="figure-num" data-scramble data-text="${esc(f.value)}">${esc(f.value)}</div><div class="figure-label">${esc(f.label)}</div></div>`).join("");
      const links = (p.links || []).filter(live)
        .map((l) => `<a class="tlink" href="${l.href}"${ext(l.href)}>${esc(l.label)} ↗</a>`).join("");
      return `
        <article class="case">
          <div class="case-text reveal">
            <p class="case-meta mono">${meta.join("")}</p>
            <h3 class="case-title">${esc(p.title)}</h3>
            <div class="case-body">${p.body.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
            ${p.role ? `<p class="case-role">${esc(p.role)}</p>` : ""}
            ${figs ? `<div class="figures">${figs}</div>` : ""}
            ${p.stack ? `<p class="case-stack mono"><b>Built with</b><br>${esc(p.stack)}</p>` : ""}
            ${links ? `<p class="case-links mono">${links}</p>` : ""}
          </div>
          <div class="case-media">${p.media.map(mediaHTML).join("")}</div>
        </article>`;
    }).join("");
    $("#" + id).innerHTML = headHTML(data.title, data.items.length) + cases;
  }
  renderCases("research", C.research);
  renderCases("projects", C.projects);

  // experience
  $("#experience").innerHTML = headHTML(C.experience.title, C.experience.items.length) +
    C.experience.items.map((j) => `
      <article class="job">
        <p class="job-when mono"><b>${esc(j.org)}</b>${esc(j.dates)}</p>
        <div class="reveal">
          <h3 class="job-role">${esc(j.role)}</h3>
          <p class="job-text">${esc(j.text)}</p>
          <p class="job-stack mono">${esc(j.stack)}</p>
        </div>
        ${j.visual ? `<figure class="media job-visual"><div class="media-frame"><canvas data-visual="${esc(j.visual)}" role="img" aria-label="Illustration for ${esc(j.org)}"></canvas></div></figure>` : ""}
      </article>`).join("");

  // about
  $("#about").innerHTML = headHTML(C.about.title) + `
    <div class="about-grid">
      <div class="about-text reveal">${C.about.text.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      <div>${C.about.lists.map((l) => `
        <div class="about-list reveal">
          <h3 class="mono">${esc(l.heading)}</h3>
          ${l.rows.map((r) => `<div class="about-row"><span class="mono">${esc(r.left)}</span><p>${esc(r.right)}</p></div>`).join("")}
        </div>`).join("")}
      </div>
    </div>`;

  // contact
  $("#contactLabel").textContent = C.contact.label;
  const mail = $("#contactEmail");
  mail.textContent = C.contact.email;
  mail.href = `mailto:${C.contact.email}`;
  $("#contactNote").textContent = C.contact.note;
  $("#contactLinks").innerHTML = linksHTML;
  $("#footerLeft").textContent = C.contact.footer;

  // live graphics
  $$("canvas[data-visual]").forEach((c) => window.Visuals && window.Visuals.mount(c, c.dataset.visual));

  /* ----------------------------------------------------------
     2 · Live Beirut clock
     ---------------------------------------------------------- */
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: C.location.timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const tick = () => {
    const t = fmt.format(new Date());
    $("#cornerR").innerHTML = `Local time<br>${t}`;
    $("#footerRight").textContent = `Beirut ${t.slice(0, 5)}`;
  };
  tick();
  setInterval(tick, 1000);

  /* ----------------------------------------------------------
     3 · Glyph scramble
     ---------------------------------------------------------- */
  const GLYPHS = "!<>-_\\/[]{}=+*^?#ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  function scramble(el, dur = 850) {
    const final = el.dataset.text || el.textContent;
    el.dataset.text = final;
    if (reduce) { el.textContent = final; return; }
    const th = [...final].map((_, i) => (i / final.length) * 0.6 + Math.random() * 0.4);
    const t0 = performance.now();
    cancelAnimationFrame(el._raf);
    const step = (now) => {
      const p = clamp((now - t0) / dur, 0, 1);
      let out = "";
      for (let i = 0; i < final.length; i++) {
        const ch = final[i];
        out += ch === " " || p >= th[i] ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
      if (p < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }
  $$("#navLinks a").forEach((a) => a.addEventListener("mouseenter", () => scramble(a, 420)));

  /* ----------------------------------------------------------
     4 · Reveals (text fade-up, media wipe, scramble)
     ---------------------------------------------------------- */
  const revealables = $$(".reveal, .media, [data-scramble]");
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("vis"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        const el = e.target;
        if (el.hasAttribute("data-scramble")) scramble(el, el.classList.contains("section-title") ? 1000 : 700);
        else {
          el.style.transitionDelay = `${i * 80}ms`;
          el.classList.add("vis");
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealables.forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------
     5 · Lightbox
     ---------------------------------------------------------- */
  const lb = $("#lightbox"), lbImg = $("#lightboxImg"), lbCap = $("#lightboxCap");
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; };
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".media-frame img");
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.dataset.caption || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  });
  lb.addEventListener("click", closeLb);
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) closeLb(); });

  /* ----------------------------------------------------------
     6 · Sound hooks
     ---------------------------------------------------------- */
  const sBtn = $("#soundToggle"), sState = $("#soundState");
  const paintSound = (on) => { sState.textContent = on ? "on" : "off"; sBtn.setAttribute("aria-pressed", String(on)); };
  sBtn.addEventListener("click", () => {
    const on = window.SFX.toggle();
    paintSound(on);
    if (on) window.SFX.click();
  });
  // a returning visitor who left sound on gets it back on their first interaction
  if (window.SFX.wasOn()) {
    const resume = () => { if (!window.SFX.on) paintSound(window.SFX.toggle()); };
    addEventListener("pointerdown", resume, { once: true });
  }
  let lastHot = null;
  document.addEventListener("mouseover", (e) => {
    const hot = e.target.closest("a, button, .media-frame");
    if (hot && hot !== lastHot) window.SFX.hover();
    lastHot = hot;
  });
  document.addEventListener("click", (e) => { if (e.target.closest("a") || e.target.closest(".media-frame img")) window.SFX.click(); });

  /* ----------------------------------------------------------
     7 · Entrance
     ---------------------------------------------------------- */
  const BASE = 250, STAGGER = 55, DUR = 950;
  let ready = false;
  letters.forEach((l, i) => (l.el.style.transitionDelay = `${BASE + i * STAGGER}ms`));
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    document.body.classList.add("in");
    setTimeout(() => {
      ready = true;
      nameEl.classList.add("done");
      letters.forEach((l) => (l.el.style.transitionDelay = "0ms"));
      measure();
    }, reduce ? 0 : BASE + letters.length * STAGGER + DUR);
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  setTimeout(start, 1400);

  if (reduce) return;

  /* ----------------------------------------------------------
     8 · Motion loop: hero parallax, scroll exit, magnetic
         letters, media parallax
     ---------------------------------------------------------- */
  const ghost = $("#layerGhost"), stage = $("#heroStage"), wrap = $("#heroWrap");
  const corners = $$(".hero-corner");
  const frames = $$(".media-frame");
  let tx = 0, ty = 0, mx = 0, my = 0, rx = -9999, ry = -9999;
  if (fine) {
    addEventListener("mousemove", (e) => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
      rx = e.clientX;
      ry = e.clientY;
    });
  }
  function measure() {
    letters.forEach((l) => {
      const r = l.inner.getBoundingClientRect();
      l.cx = r.left + r.width / 2 - l.x;
      l.cy = r.top + r.height / 2 - l.y;
    });
  }
  addEventListener("resize", () => ready && measure());

  const RAD = 120, PULL = 0.3;
  function frame() {
    mx = lerp(mx, tx, 0.07);
    my = lerp(my, ty, 0.07);
    const range = wrap.offsetHeight - innerHeight;
    const p = clamp(scrollY / Math.max(range, 1), 0, 1);

    if (p < 1) {
      ghost.style.transform = `translate3d(${mx * 46}px, ${my * 30 + p * 160}px, 0)`;
      ghost.style.opacity = Math.max(1 - p * 1.5, 0);
      stage.style.transform =
        `translate3d(${mx * 70}px, ${my * 46 - 70 * p}px, 0) scale(${1 - 0.24 * p}) ` +
        `rotateX(${-my * 5}deg) rotateY(${mx * 6}deg)`;
      stage.style.opacity = Math.max(1 - p * 1.25, 0);
      corners.forEach((c) => (c.style.opacity = Math.max(1 - p * 3, 0)));

      if (ready) {
        const spread = p * p * 26;
        for (const l of letters) {
          let gx = 0, gy = 0, gs = 1;
          if (fine && p < 0.25) {
            const dx = rx - l.cx, dy = ry - l.cy, d = Math.hypot(dx, dy);
            if (d < RAD) {
              const f = 1 - d / RAD;
              gx = dx * f * PULL;
              gy = dy * f * PULL;
              gs = 1 + f * 0.1;
            }
          }
          gx += l.pos * spread;
          l.x = lerp(l.x, gx, 0.16);
          l.y = lerp(l.y, gy, 0.16);
          l.s = lerp(l.s, gs, 0.16);
          l.inner.style.transform = `translate3d(${l.x}px, ${l.y}px, 0) scale(${l.s})`;
        }
      }
    }

    // media drift inside its frame (uses `translate`, separate from the reveal `transform`)
    for (const f of frames) {
      const r = f.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      f.firstElementChild.style.translate = `0 ${(-k * 26).toFixed(1)}px`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
