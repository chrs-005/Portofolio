/* ============================================================
   Site engine — hero entrance stagger, 3-layer mouse parallax,
   magnetic letters, scroll-linked exit, marquee, scroll reveals,
   custom cursor, card spotlights, parallax section numbers,
   timeline draw, stat count-ups.
   All content comes from js/content.js.
   ============================================================ */

(() => {
  const C = window.CONTENT;
  const $ = (s) => document.querySelector(s);

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  /* ----------------------------------------------------------
     1 · Populate the page from CONTENT
     ---------------------------------------------------------- */
  document.title = C.meta.title;

  // nav
  $("#navMonogram").textContent = C.nav.monogram;
  $("#navLinks").innerHTML = C.nav.links
    .map((l) => `<a href="${l.href}">${l.label}</a>`)
    .join("");
  const resumeBtn = $("#navResume");
  resumeBtn.textContent = C.nav.resume.label;
  resumeBtn.href = C.nav.resume.href;

  // hero copy
  $("#eyebrowText").textContent = C.hero.eyebrow;
  $("#ghostWord").textContent = C.hero.ghostWord;
  $("#tagline").innerHTML = C.hero.tagline;
  $("#scrollHintText").textContent = C.hero.scrollHint;

  // kinetic name — split each line into letter spans
  const nameEl = $("#name");
  nameEl.setAttribute("aria-label", C.hero.nameLines.join(" "));
  const letters = []; // { el: .letter, inner: .letter-inner, lineIdx, posInLine }
  C.hero.nameLines.forEach((line, lineIdx) => {
    const lineEl = document.createElement("span");
    lineEl.className = "name-line";
    lineEl.setAttribute("aria-hidden", "true");
    [...line].forEach((ch) => {
      if (ch === " ") {
        const sp = document.createElement("span");
        sp.className = "letter-space";
        lineEl.appendChild(sp);
        return;
      }
      const outer = document.createElement("span");
      outer.className = "letter";
      const inner = document.createElement("span");
      inner.className = "letter-inner";
      inner.textContent = ch;
      outer.appendChild(inner);
      lineEl.appendChild(outer);
      letters.push({ el: outer, inner, lineIdx, posInLine: 0, cx: 0, cy: 0, x: 0, y: 0, s: 1 });
    });
    nameEl.appendChild(lineEl);
  });

  // per-line spread indices (distance from the line's center)
  C.hero.nameLines.forEach((_, lineIdx) => {
    const inLine = letters.filter((l) => l.lineIdx === lineIdx);
    const mid = (inLine.length - 1) / 2;
    inLine.forEach((l, i) => (l.posInLine = i - mid));
  });

  // mirror reflection (plain text copy — flipped in CSS)
  $("#nameReflection").innerHTML = C.hero.nameLines
    .map((line) => `<span class="refl-line">${line}</span>`)
    .join("");

  // CTAs + socials
  $("#ctaRow").innerHTML = C.hero.ctas
    .map(
      (b) =>
        `<a class="btn ${b.primary ? "btn-primary" : "btn-ghost"}" href="${b.href}">${b.label}</a>`
    )
    .join("");

  const ICONS = {
    github:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  };
  const socialsHTML = C.hero.socials
    .map(
      (s) =>
        `<a class="social-link" href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">${ICONS[s.type] || ""}</a>`
    )
    .join("");
  $("#socialRow").innerHTML = socialsHTML;

  // marquee — two identical groups so the loop is seamless
  const marqueeGroup =
    '<div class="marquee-group">' +
    C.marquee
      .map(
        (item, i) =>
          `<span class="marquee-item${i % 2 ? " serif" : ""}">${item}</span><span class="marquee-sep">◆</span>`
      )
      .join("") +
    "</div>";
  $("#marqueeTrack").innerHTML = marqueeGroup + marqueeGroup;

  // about
  $("#aboutLabel").textContent = C.about.label;
  $("#aboutHeading").innerHTML = C.about.heading;
  $("#aboutLead").textContent = C.about.lead;
  $("#statGrid").innerHTML = C.about.stats
    .map(
      (s) =>
        `<div class="stat-card reveal"><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`
    )
    .join("");

  // projects
  $("#projectsLabel").textContent = C.projects.label;
  $("#projectsHeading").innerHTML = C.projects.heading;
  $("#projectList").innerHTML = C.projects.items
    .map(
      (p, i) => `
      <a class="project-row reveal" href="${p.href}">
        <span class="project-index">${String(i + 1).padStart(2, "0")}</span>
        <span class="project-main">
          <span class="project-title">${p.title}</span>
          <span class="project-desc" style="display:block">${p.desc}</span>
          <span class="project-tags">${p.tags
            .map((t) => `<span class="project-tag">${t}</span>`)
            .join("")}</span>
        </span>
        <span class="project-meta">
          <span class="project-year">${p.year}</span>
          <span class="project-arrow">↗</span>
        </span>
      </a>`
    )
    .join("");

  // experience + education
  $("#expLabel").textContent = C.experience.label;
  $("#expHeading").innerHTML = C.experience.heading;
  $("#expJobs").innerHTML = C.experience.jobs
    .map(
      (j) => `
      <div class="exp-item reveal">
        <div class="exp-dates">[ ${j.dates} ]</div>
        <div class="exp-role">${j.role}</div>
        <div class="exp-org">${j.org}</div>
        <div class="exp-note">${j.note}</div>
      </div>`
    )
    .join("");
  $("#eduLabel").textContent = C.experience.educationLabel;
  $("#eduList").innerHTML = C.experience.education
    .map(
      (e) => `
      <div class="edu-item reveal">
        <div class="edu-dates">[ ${e.dates} ]</div>
        <div class="edu-school">${e.school}</div>
        <div class="edu-detail">${e.detail}</div>
      </div>`
    )
    .join("");

  // contact + footer
  $("#contactLabel").textContent = C.contact.label;
  $("#contactHeading").innerHTML = C.contact.headingLines
    .map((l) => `<span class="contact-line">${l}</span>`)
    .join("");
  $("#contactSub").textContent = C.contact.sub;
  const emailEl = $("#contactEmail");
  emailEl.textContent = C.contact.email;
  emailEl.href = `mailto:${C.contact.email}`;
  $("#contactSocials").innerHTML = socialsHTML;
  $("#footerLeft").textContent = C.contact.footerLeft;
  $("#footerRight").textContent = C.contact.footerRight;

  // giant parallax numbers behind each section
  const ghostNums = [];
  [["about", "01"], ["projects", "02"], ["experience", "03"], ["contact", "04"]].forEach(
    ([id, num]) => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const g = document.createElement("span");
      g.className = "ghost-num";
      g.textContent = num;
      g.setAttribute("aria-hidden", "true");
      sec.prepend(g);
      ghostNums.push({ el: g, sec });
    }
  );

  // experience timeline fill line
  const expJobsEl = $("#expJobs");
  const expFill = document.createElement("span");
  expFill.className = "exp-line-fill";
  expFill.setAttribute("aria-hidden", "true");
  expJobsEl.appendChild(expFill);
  const expItems = [...document.querySelectorAll(".exp-item")];

  /* ----------------------------------------------------------
     2 · Word-split the section headings (staggered mask reveal)
     ---------------------------------------------------------- */
  function splitWords(rootSel) {
    const root = $(rootSel);
    if (!root) return;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
              return;
            }
            const mask = document.createElement("span");
            mask.className = "w-mask";
            const w = document.createElement("span");
            w.className = "word";
            w.textContent = part;
            mask.appendChild(w);
            frag.appendChild(mask);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(root);
    root.classList.add("split");
    [...root.querySelectorAll(".word")].forEach(
      (w, i) => (w.style.transitionDelay = `${120 + i * 70}ms`)
    );
  }
  ["#aboutHeading", "#projectsHeading", "#expHeading", "#contactHeading"].forEach(splitWords);

  /* ----------------------------------------------------------
     3 · Stat count-ups
     ---------------------------------------------------------- */
  const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const SUP_REV = Object.fromEntries(Object.entries(SUP).map(([k, v]) => [v, k]));
  function animateStat(el) {
    const target = el.textContent.trim();
    const DUR = 1400;
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const expMatch = target.match(/^10⁻(.+)$/);
    const numMatch = target.match(/^([\d.]+)(.*)$/);
    if (expMatch) {
      const targetExp = parseInt([...expMatch[1]].map((c) => SUP_REV[c] || "").join(""), 10);
      if (!targetExp) return;
      const tick = (now) => {
        const p = ease(clamp((now - t0) / DUR, 0, 1));
        const e = Math.max(1, Math.round(targetExp * p));
        el.textContent = "10⁻" + String(e).split("").map((d) => SUP[d]).join("");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } else if (numMatch) {
      const num = parseFloat(numMatch[1]);
      const suffix = numMatch[2] || "";
      const decimals = (numMatch[1].split(".")[1] || "").length;
      const tick = (now) => {
        const p = ease(clamp((now - t0) / DUR, 0, 1));
        el.textContent = (num * p).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ----------------------------------------------------------
     4 · Scroll reveals (works for reduced motion too)
     ---------------------------------------------------------- */
  const revealEls = [...document.querySelectorAll(".reveal")];
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("vis"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            e.target.style.transitionDelay = `${i * 90}ms`;
            e.target.classList.add("vis");
            const sv = e.target.querySelector(".stat-value");
            if (sv) animateStat(sv);
            io.unobserve(e.target);
          });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------
     5 · Entrance — staggered letter reveal
     ---------------------------------------------------------- */
  const BASE_DELAY = 250;   // ms before the first letter
  const STAGGER = 55;       // ms between letters
  const LETTER_DUR = 950;   // matches the CSS transition

  let entranceDone = false;

  letters.forEach((l, i) => {
    l.el.style.transitionDelay = `${BASE_DELAY + i * STAGGER}ms`;
  });

  function startEntrance() {
    document.body.classList.add("in");
    const total = BASE_DELAY + letters.length * STAGGER + LETTER_DUR;
    setTimeout(() => {
      entranceDone = true;
      nameEl.classList.add("done"); // unmask lines so magnetic motion isn't clipped
      letters.forEach((l) => (l.el.style.transitionDelay = "0ms"));
      measureLetters();
    }, reduceMotion ? 0 : total);
  }

  // wait for the display font so letters don't reveal in a fallback face
  let started = false;
  const kick = () => {
    if (started) return;
    started = true;
    startEntrance();
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(kick);
  setTimeout(kick, 1400); // fallback if the font hangs

  /* ----------------------------------------------------------
     6 · Static page for reduced-motion users — stop here
     ---------------------------------------------------------- */
  const layerBg = $("#layerBg");
  const layerGhost = $("#layerGhost");
  const stage = $("#heroStage");
  const scrollHint = $("#scrollHint");
  const heroWrap = $("#heroWrap");
  const scrlCounter = $("#scrlCounter");
  const marqueeEl = document.querySelector(".marquee");
  const marqueeTrackEl = $("#marqueeTrack");

  if (reduceMotion) return;

  /* ----------------------------------------------------------
     7 · Cursor-driven widgets
     ---------------------------------------------------------- */
  let tx = 0, ty = 0;     // target mouse position, normalized -0.5 .. 0.5
  let mx = 0, my = 0;     // lerped
  let rawX = 0, rawY = 0; // cursor in px

  // custom cursor + floating project chip (fine pointers only)
  let cursorDot = null, cursorRing = null, chip = null;
  let ringX = innerWidth / 2, ringY = innerHeight / 2;
  let chipX = innerWidth / 2, chipY = innerHeight / 2;

  if (finePointer) {
    addEventListener("mousemove", (e) => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
      rawX = e.clientX;
      rawY = e.clientY;
      document.body.classList.remove("cursor-off");
    });

    cursorDot = document.createElement("div");
    cursorDot.className = "cursor-dot";
    cursorRing = document.createElement("div");
    cursorRing.className = "cursor-ring";
    chip = document.createElement("div");
    chip.className = "row-chip";
    chip.textContent = "View ↗";
    chip.setAttribute("aria-hidden", "true");
    document.body.append(cursorDot, cursorRing, chip);
    document.body.classList.add("custom-cursor", "cursor-off");

    // ring grows over anything interactive
    document.addEventListener("mouseover", (e) => {
      const hot = e.target.closest("a, button, .project-row, .stat-card, .edu-item, .marquee");
      document.body.classList.toggle("cursor-hover", !!hot);
    });
    document.documentElement.addEventListener("mouseleave", () =>
      document.body.classList.add("cursor-off")
    );
    document.documentElement.addEventListener("mouseenter", () =>
      document.body.classList.remove("cursor-off")
    );

    // magnetic pull on buttons & icons
    document.querySelectorAll(".btn, .social-link, .nav-monogram").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transition = "transform 0.12s ease-out";
        el.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
      });
    });

    // project rows: spotlight + floating "View" label
    const projectList = $("#projectList");
    projectList.addEventListener("mousemove", (e) => {
      const row = e.target.closest(".project-row");
      if (!row) return;
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
    projectList.addEventListener("mouseover", (e) => {
      if (e.target.closest(".project-row")) chip.classList.add("on");
    });
    projectList.addEventListener("mouseleave", () => chip.classList.remove("on"));
    addEventListener("scroll", () => chip.classList.remove("on"), { passive: true });
  }

  /* ----------------------------------------------------------
     8 · Motion loop — hero parallax, magnetic letters, scroll FX
     ---------------------------------------------------------- */
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBar.setAttribute("aria-hidden", "true");
  document.body.appendChild(progressBar);

  function measureLetters() {
    letters.forEach((l) => {
      const r = l.inner.getBoundingClientRect();
      // remove our own current offset to get the resting center
      l.cx = r.left + r.width / 2 - l.x;
      l.cy = r.top + r.height / 2 - l.y;
    });
  }
  addEventListener("resize", () => entranceDone && measureLetters());

  const MAG_RADIUS = 120;   // px — how close the cursor must be
  const MAG_PULL = 0.32;    // fraction of the distance letters lean toward the cursor
  let lastScrl = "";
  let lastY = scrollY;
  let scrollVel = 0;
  let marqueeAnim; // undefined = not looked up yet, null = unsupported

  function frame() {
    mx = lerp(mx, tx, 0.07);
    my = lerp(my, ty, 0.07);

    // scroll progress through the sticky hero: 0 = top, 1 = fully exited
    const range = heroWrap.offsetHeight - innerHeight;
    const p = clamp(scrollY / Math.max(range, 1), 0, 1);

    // layer 1 — background drifts *against* the cursor
    layerBg.style.transform = `translate3d(${-mx * 26}px, ${-my * 18}px, 0)`;

    // layer 2 — ghost wordmark, mid rate + sinks during the exit
    layerGhost.style.transform = `translate3d(${mx * 46}px, ${my * 30 + p * 150}px, 0)`;
    layerGhost.style.opacity = Math.max(1 - p * 1.5, 0);

    // layer 3 — stage: fastest parallax + 3D tilt + scroll exit (scale/fade/rise)
    const scale = 1 - 0.24 * p;
    const rise = -70 * p;
    stage.style.transform =
      `translate3d(${mx * 72}px, ${my * 48 + rise}px, 0) ` +
      `scale(${scale}) rotateX(${-my * 5}deg) rotateY(${mx * 6}deg)`;
    stage.style.opacity = Math.max(1 - p * 1.25, 0);

    scrollHint.style.opacity = Math.max(1 - p * 5, 0);

    // scroll readout + top progress bar
    const docRange = document.body.scrollHeight - innerHeight;
    const dp = docRange > 0 ? scrollY / docRange : 0;
    const scrl = "SCRL " + dp.toFixed(2);
    if (scrl !== lastScrl) {
      scrlCounter.textContent = scrl;
      lastScrl = scrl;
    }
    progressBar.style.transform = `scaleX(${dp})`;

    // scroll velocity → marquee skews and speeds up
    const vel = scrollY - lastY;
    lastY = scrollY;
    scrollVel = lerp(scrollVel, vel, 0.12);
    marqueeEl.style.transform = `skewX(${clamp(-scrollVel * 0.5, -10, 10)}deg)`;
    if (marqueeAnim === undefined) {
      marqueeAnim = (marqueeTrackEl.getAnimations && marqueeTrackEl.getAnimations()[0]) || null;
    }
    if (marqueeAnim) marqueeAnim.playbackRate = 1 + Math.min(Math.abs(scrollVel) * 0.08, 3);

    // giant section numbers drift slower than the page (depth)
    for (const { el, sec } of ghostNums) {
      const r = sec.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) continue;
      const t = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = `translate3d(0, ${t * 150}px, 0)`;
    }

    // experience timeline draws in as it crosses the viewport
    const jr = expJobsEl.getBoundingClientRect();
    if (jr.bottom > -50 && jr.top < innerHeight + 50) {
      const prog = clamp((innerHeight * 0.72 - jr.top) / jr.height, 0, 1);
      expFill.style.transform = `scaleY(${prog})`;
      for (const it of expItems) {
        it.classList.toggle("lit", it.getBoundingClientRect().top + 30 < innerHeight * 0.72);
      }
    }

    // custom cursor: dot snaps, ring & chip trail
    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${rawX}px, ${rawY}px, 0)`;
      ringX = lerp(ringX, rawX, 0.2);
      ringY = lerp(ringY, rawY, 0.2);
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      chipX = lerp(chipX, rawX, 0.22);
      chipY = lerp(chipY, rawY, 0.22);
      chip.style.left = chipX + "px";
      chip.style.top = chipY + "px";
    }

    // hero letters — magnetic pull toward the cursor + spread apart on scroll
    if (entranceDone) {
      const spreadAmt = p * p * 26; // eases in; letters split from the line's center
      for (const l of letters) {
        let gx = 0, gy = 0, gs = 1;
        if (finePointer && p < 0.25) {
          const dx = rawX - l.cx;
          const dy = rawY - l.cy;
          const d = Math.hypot(dx, dy);
          if (d < MAG_RADIUS) {
            const f = 1 - d / MAG_RADIUS;
            gx = dx * f * MAG_PULL;
            gy = dy * f * MAG_PULL;
            gs = 1 + f * 0.1;
          }
        }
        gx += l.posInLine * spreadAmt;
        l.x = lerp(l.x, gx, 0.16);
        l.y = lerp(l.y, gy, 0.16);
        l.s = lerp(l.s, gs, 0.16);
        l.inner.style.transform = `translate3d(${l.x}px, ${l.y}px, 0) scale(${l.s})`;
      }
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
