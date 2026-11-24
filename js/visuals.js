/* ============================================================
   Live project graphics, drawn on <canvas> in the browser.
   Each one is an illustration of what the project does, not
   real output. Swap any of them for a real screenshot in
   js/content.js when you have one.

   latex  : formula image cut into ViT patches, LaTeX tokens decoded
   rl     : value table filling in, greedy path following it
   pinn   : logistic curve fit converging on noisy samples + loss
   ble    : classroom of phones linking to their nearest neighbours
   market : price candles, moving average, an oscillator below
   voice  : voice-note waveform turning into structured order rows
   grader : submissions x tests matrix filling in, AST flags
   ============================================================ */
window.Visuals = (() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = {
    frame: "#0c0d10",
    ink: (a) => `rgba(236,235,230,${a})`,
    hi: (a) => `rgba(184,245,214,${a})`,
    teal: (a) => `rgba(95,211,196,${a})`,
    violet: (a) => `rgba(139,108,240,${a})`,
    amber: (a) => `rgba(242,180,90,${a})`,
    red: (a) => `rgba(224,104,106,${a})`,
  };
  const MONO = "JetBrains Mono, Consolas, monospace";
  const SERIF = "Newsreader, Georgia, serif";
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const hash = (i, j = 0) => {
    const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  const label = (ctx, txt, x, y, a = 0.42, align = "left") => {
    ctx.font = `400 10px ${MONO}`;
    ctx.textAlign = align;
    ctx.fillStyle = C.ink(a);
    ctx.fillText(txt.toUpperCase(), x, y);
    ctx.textAlign = "left";
  };

  /* ---------------------------------------------------------- */
  const SCENES = {
    latex(ctx) {
      const F = [
        { seg: [["e"], ["iπ", "sup"], [" + 1 = 0"]],
          tok: ["e", "^", "{", "i", "\\pi", "}", "+", "1", "=", "0"] },
        { seg: [["Σ"], ["n=1", "sub"], ["∞", "sup"], [" 1/n"], ["2", "sup"], [" = π"], ["2", "sup"], ["/6"]],
          tok: ["\\sum", "_", "{", "n", "=", "1", "}", "^", "{", "\\infty", "}", "\\frac", "{", "1", "}", "{", "n", "^", "2", "}", "=", "\\frac", "{", "\\pi", "^", "2", "}", "{", "6", "}"] },
        { seg: [["∫"], ["0", "sub"], ["∞", "sup"], [" e"], ["−x²", "sup"], [" dx = √π / 2"]],
          tok: ["\\int", "_", "0", "^", "\\infty", "e", "^", "{", "-", "x", "^", "2", "}", "\\,", "dx", "=", "\\frac", "{", "\\sqrt", "{", "\\pi", "}", "}", "{", "2", "}"] },
      ];
      const PERIOD = 7.5;
      return (t, w, h) => {
        const f = F[Math.floor(t / PERIOD) % F.length];
        const lt = t % PERIOD;
        ctx.globalAlpha = Math.min(1, lt / 0.4, (PERIOD - lt) / 0.5);

        // lay out the formula
        const fs = Math.min(w * 0.1, h * 0.2);
        let x = 0, subStart = null;
        const parts = [];
        for (const [txt, kind] of f.seg) {
          const size = kind ? fs * 0.52 : fs;
          ctx.font = `400 ${size}px ${SERIF}`;
          const wd = ctx.measureText(txt).width;
          if (kind === "sup" && subStart !== null) {
            parts.push({ txt, kind, size, px: subStart });
            x = Math.max(x, subStart + wd);
            subStart = null;
          } else {
            parts.push({ txt, kind, size, px: x });
            if (kind === "sub") subStart = x; else subStart = null;
            x += wd;
          }
        }
        const ox = (w - x) / 2, by = h * 0.4;

        // ViT patch grid over the formula, scanned left to right
        const pad = fs * 0.35, ps = fs * 0.42;
        const bx = ox - pad, bw = x + pad * 2, top = by - fs * 1.0, bh = fs * 1.45;
        const cols = Math.ceil(bw / ps), rows = Math.ceil(bh / ps);
        const scan = clamp(lt / (PERIOD * 0.55), 0, 1) * cols;
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const a = c < Math.floor(scan) ? 0.05 : c === Math.floor(scan) ? 0.14 : 0;
            if (a) { ctx.fillStyle = C.hi(a); ctx.fillRect(bx + c * ps, top + r * ps, ps, ps); }
          }
        }
        ctx.strokeStyle = C.ink(0.1);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) { ctx.moveTo(bx + c * ps + 0.5, top); ctx.lineTo(bx + c * ps + 0.5, top + rows * ps); }
        for (let r = 0; r <= rows; r++) { ctx.moveTo(bx, top + r * ps + 0.5); ctx.lineTo(bx + cols * ps, top + r * ps + 0.5); }
        ctx.stroke();

        for (const p of parts) {
          ctx.font = `400 ${p.size}px ${SERIF}`;
          const dy = p.kind === "sup" ? -fs * 0.42 : p.kind === "sub" ? fs * 0.22 : 0;
          ctx.fillStyle = C.ink(0.94);
          ctx.fillText(p.txt, ox + p.px, by + dy);
        }
        label(ctx, "image in", bx, top - 10);

        // decoded tokens
        const n = Math.floor(clamp((lt - 0.8) / (PERIOD * 0.62), 0, 1) * f.tok.length);
        const tf = clamp(w * 0.036, 12, 21);
        ctx.font = `400 ${tf}px ${MONO}`;
        const lx = w * 0.08, maxX = w * 0.92;
        let tx = lx, ty = h * 0.72;
        label(ctx, "latex out", lx, ty - tf * 1.6);
        for (let i = 0; i < n; i++) {
          const s = f.tok[i];
          const tw = ctx.measureText(s).width;
          if (tx + tw > maxX) { tx = lx; ty += tf * 1.5; }
          ctx.fillStyle = i === n - 1 ? C.hi(1) : C.ink(0.72);
          ctx.fillText(s, tx, ty);
          tx += tw + tf * 0.45;
        }
        if (Math.floor(t * 2.2) % 2 === 0) {
          ctx.fillStyle = C.hi(0.9);
          ctx.fillRect(tx, ty - tf * 0.8, tf * 0.5, tf);
        }
        ctx.globalAlpha = 1;
      };
    },

    /* ---------------------------------------------------------- */
    rl(ctx) {
      const COLS = 18, ROWS = 11, PERIOD = 15;
      const V = new Float32Array(COLS * ROWS);
      const goal = [COLS - 3, 2], start = [1, ROWS - 2];
      const walls = new Set();
      for (let i = 0; i < 26; i++) {
        const c = 2 + Math.floor(hash(i, 1) * (COLS - 4)), r = Math.floor(hash(i, 2) * ROWS);
        if (!(c === goal[0] && r === goal[1])) walls.add(r * COLS + c);
      }
      let epoch = -1;
      const id = (c, r) => r * COLS + c;
      const nb = (c, r) => [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]]
        .filter(([a, b]) => a >= 0 && b >= 0 && a < COLS && b < ROWS && !walls.has(id(a, b)));

      return (t, w, h) => {
        const e = Math.floor(t / PERIOD);
        if (e !== epoch) { epoch = e; V.fill(0); }
        V[id(goal[0], goal[1])] = 1;
        for (let k = 0; k < 60; k++) {
          const c = Math.floor(Math.random() * COLS), r = Math.floor(Math.random() * ROWS);
          if (walls.has(id(c, r)) || (c === goal[0] && r === goal[1])) continue;
          let m = 0;
          for (const [a, b] of nb(c, r)) m = Math.max(m, V[id(a, b)]);
          V[id(c, r)] += (0.93 * m - V[id(c, r)]) * 0.5;
        }

        const cell = Math.min((w * 0.9) / COLS, (h * 0.86) / ROWS);
        const ox = (w - cell * COLS) / 2, oy = (h - cell * ROWS) / 2;
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const x = ox + c * cell, y = oy + r * cell;
            if (walls.has(id(c, r))) {
              ctx.strokeStyle = C.ink(0.12);
              ctx.strokeRect(x + 2.5, y + 2.5, cell - 5, cell - 5);
              continue;
            }
            const v = V[id(c, r)];
            ctx.fillStyle = v > 0.6 ? C.amber(0.15 + v * 0.6) : v > 0.25 ? C.teal(0.1 + v * 0.7) : C.violet(0.06 + v * 0.8);
            ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
          }
        }

        // greedy path from the start, following the values
        let [c, r] = start;
        const path = [[c, r]];
        for (let s = 0; s < 80; s++) {
          let best = null, bv = V[id(c, r)];
          for (const [a, b] of nb(c, r)) if (V[id(a, b)] > bv) { bv = V[id(a, b)]; best = [a, b]; }
          if (!best) break;
          [c, r] = best;
          path.push(best);
          if (c === goal[0] && r === goal[1]) break;
        }
        if (path.length > 1) {
          ctx.strokeStyle = C.hi(0.9);
          ctx.lineWidth = 2;
          ctx.shadowColor = C.hi(0.8);
          ctx.shadowBlur = 10;
          ctx.beginPath();
          path.forEach(([a, b], i) => {
            const x = ox + (a + 0.5) * cell, y = oy + (b + 0.5) * cell;
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          });
          ctx.stroke();
          ctx.shadowBlur = 0;
          const hp = path[Math.floor((t * 6) % path.length)];
          ctx.fillStyle = C.hi(1);
          ctx.fillRect(ox + (hp[0] + 0.3) * cell, oy + (hp[1] + 0.3) * cell, cell * 0.4, cell * 0.4);
        }
        ctx.strokeStyle = C.ink(0.85);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ox + goal[0] * cell + 1, oy + goal[1] * cell + 1, cell - 2, cell - 2);
        label(ctx, "start", ox + start[0] * cell, oy + (start[1] + 1) * cell + 14);
        label(ctx, "win", ox + goal[0] * cell, oy + goal[1] * cell - 8);
      };
    },

    /* ---------------------------------------------------------- */
    pinn(ctx) {
      const TRUE = { K: 1, r: 1.15, t0: 5 }, INIT = { K: 0.55, r: 0.35, t0: 7.6 };
      const N = 42, PERIOD = 8;
      const pts = Array.from({ length: N }, (_, i) => {
        const tt = (i / (N - 1)) * 10;
        return [tt, TRUE.K / (1 + Math.exp(-TRUE.r * (tt - TRUE.t0))) + (hash(i, 7) - 0.5) * 0.12];
      });
      const at = (k) => {
        const e = Math.exp(-5 * k);
        return { K: TRUE.K + (INIT.K - TRUE.K) * e, r: TRUE.r + (INIT.r - TRUE.r) * e, t0: TRUE.t0 + (INIT.t0 - TRUE.t0) * e };
      };
      return (t, w, h) => {
        const k = clamp((t % PERIOD) / (PERIOD * 0.8), 0, 1);
        const L = w * 0.08, R = w * 0.64, T = h * 0.14, B = h * 0.84;
        const X = (v) => L + (v / 10) * (R - L), Y = (v) => B - (v / 1.15) * (B - T);

        ctx.strokeStyle = C.ink(0.16);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B);
        ctx.stroke();
        label(ctx, "t", R - 6, B + 16);
        label(ctx, "N(t)", L, T - 8);

        ctx.fillStyle = C.ink(0.55);
        for (const [a, b] of pts) ctx.fillRect(X(a) - 2, Y(b) - 2, 4, 4);

        const curve = (p, alpha, glow) => {
          ctx.strokeStyle = C.hi(alpha);
          ctx.lineWidth = glow ? 2 : 1;
          ctx.shadowColor = C.hi(0.7);
          ctx.shadowBlur = glow ? 10 : 0;
          ctx.beginPath();
          for (let i = 0; i <= 80; i++) {
            const tt = (i / 80) * 10, v = p.K / (1 + Math.exp(-p.r * (tt - p.t0)));
            i ? ctx.lineTo(X(tt), Y(v)) : ctx.moveTo(X(tt), Y(v));
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        };
        for (let g = 4; g >= 1; g--) curve(at(Math.max(0, k - g * 0.06)), 0.07 * (5 - g), false);
        curve(at(k), 0.95, true);

        // loss, log scale, falling
        const l = w * 0.72, r2 = w * 0.94, lt = h * 0.2, lb = h * 0.7;
        label(ctx, "loss", l, lt - 10);
        ctx.strokeStyle = C.ink(0.16);
        ctx.beginPath(); ctx.moveTo(l, lt); ctx.lineTo(l, lb); ctx.lineTo(r2, lb); ctx.stroke();
        ctx.strokeStyle = C.amber(0.9);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const steps = Math.max(2, Math.floor(k * 60));
        for (let i = 0; i <= steps; i++) {
          const s = i / 60;
          const v = Math.exp(-5 * s) + 0.02 * hash(i, 3);
          const x = l + s * (r2 - l), y = lt + (1 - v) * (lb - lt);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      };
    },

    /* ---------------------------------------------------------- */
    ble(ctx) {
      const COLS = 8, ROWS = 5;
      const empty = new Set([3, 9, 17, 22, 30, 36]);
      const phones = [];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        if (!empty.has(i)) phones.push({ c: c + (hash(i, 4) - 0.5) * 0.3, r: r + (hash(i, 5) - 0.5) * 0.3 });
      }
      // each phone's 3 "estimated" nearest: true distance plus a little noise
      phones.forEach((p, i) => {
        p.links = phones
          .map((q, j) => ({ j, d: Math.hypot(p.c - q.c, p.r - q.r) * (0.85 + hash(i, j) * 0.4) }))
          .filter((o) => o.j !== i)
          .sort((a, b) => a.d - b.d)
          .slice(0, 3)
          .map((o) => o.j);
      });
      return (t, w, h) => {
        const gx = (w * 0.84) / (COLS - 1), gy = (h * 0.62) / (ROWS - 1);
        const ox = w * 0.08, oy = h * 0.24;
        const P = (p) => [ox + p.c * gx, oy + p.r * gy];

        ctx.strokeStyle = C.ink(0.25);
        ctx.beginPath(); ctx.moveTo(w * 0.3, h * 0.1); ctx.lineTo(w * 0.7, h * 0.1); ctx.stroke();
        label(ctx, "front of the room", w / 2, h * 0.1 - 8, 0.42, "center");

        ctx.lineWidth = 1;
        ctx.strokeStyle = C.ink(0.07);
        ctx.beginPath();
        phones.forEach((p) => p.links.forEach((j) => {
          const [a, b] = P(p), [c, d] = P(phones[j]);
          ctx.moveTo(a, b); ctx.lineTo(c, d);
        }));
        ctx.stroke();

        const cur = Math.floor(t / 1.3) % phones.length;
        const ph = (t % 1.3) / 1.3;
        const [cx, cy] = P(phones[cur]);
        for (let k = 0; k < 2; k++) {
          const rr = ((ph + k * 0.5) % 1) * gx * 1.6;
          ctx.strokeStyle = C.teal(0.5 * (1 - ((ph + k * 0.5) % 1)));
          ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.strokeStyle = C.hi(0.9);
        ctx.lineWidth = 1.5;
        phones[cur].links.forEach((j) => {
          const [x2, y2] = P(phones[j]);
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.fillStyle = C.hi(1);
          ctx.fillRect(cx + (x2 - cx) * ph - 2, cy + (y2 - cy) * ph - 2, 4, 4);
        });

        phones.forEach((p, i) => {
          const [x, y] = P(p);
          const on = i === cur || phones[cur].links.includes(i);
          ctx.fillStyle = on ? C.hi(1) : C.ink(0.6);
          ctx.fillRect(x - 3.5, y - 5, 7, 10);
        });
      };
    },

    /* ---------------------------------------------------------- */
    market(ctx) {
      const price = (i) => 0.5 + 0.18 * Math.sin(i * 0.11) + 0.1 * Math.sin(i * 0.037 + 1) + 0.05 * Math.sin(i * 0.31) + (hash(i, 11) - 0.5) * 0.05;
      return (t, w, h) => {
        const N = 46, cw = (w * 0.9) / N, shift = t * 2.2, base = Math.floor(shift), frac = shift - base;
        const L = w * 0.05, T = h * 0.1, B = h * 0.64, Y = (v) => B - v * (B - T);

        ctx.strokeStyle = C.ink(0.06);
        ctx.beginPath();
        for (let g = 0; g <= 4; g++) { const y = T + (g / 4) * (B - T); ctx.moveTo(L, y); ctx.lineTo(w - L, y); }
        ctx.stroke();

        for (let k = 0; k < N; k++) {
          const i = base + k, o = price(i), c = price(i + 1);
          const hi = Math.max(o, c) + hash(i, 12) * 0.04, lo = Math.min(o, c) - hash(i, 13) * 0.04;
          const x = L + (k - frac) * cw;
          if (x < L - cw) continue;
          const up = c >= o;
          ctx.strokeStyle = up ? C.ink(0.7) : C.ink(0.3);
          ctx.beginPath(); ctx.moveTo(x + cw / 2, Y(hi)); ctx.lineTo(x + cw / 2, Y(lo)); ctx.stroke();
          ctx.fillStyle = up ? C.ink(0.75) : C.frame;
          const y1 = Y(Math.max(o, c)), hh = Math.max(1, Math.abs(Y(o) - Y(c)));
          ctx.fillRect(x + cw * 0.2, y1, cw * 0.6, hh);
          if (!up) ctx.strokeRect(x + cw * 0.2 + 0.5, y1 + 0.5, cw * 0.6 - 1, hh - 1);
        }

        const ma = (i) => { let s = 0; for (let j = 0; j < 9; j++) s += price(i - j); return s / 9; };
        ctx.strokeStyle = C.amber(0.9);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let k = 0; k <= N; k++) {
          const x = L + (k - frac) * cw + cw / 2, y = Y(ma(base + k));
          k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        label(ctx, "moving average", w - L, T - 6, 0.42, "right");

        const T2 = h * 0.74, B2 = h * 0.92;
        ctx.strokeStyle = C.ink(0.08);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, (T2 + B2) / 2); ctx.lineTo(w - L, (T2 + B2) / 2); ctx.stroke();
        ctx.strokeStyle = C.teal(0.85);
        ctx.beginPath();
        for (let k = 0; k <= N; k++) {
          const i = base + k, v = clamp(0.5 + (price(i + 1) - ma(i)) * 4, 0, 1);
          const x = L + (k - frac) * cw + cw / 2, y = B2 - v * (B2 - T2);
          k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        label(ctx, "oscillator", L, T2 - 6);
      };
    },

    /* ---------------------------------------------------------- */
    voice(ctx) {
      const PERIOD = 6.5;
      const keys = ["item", "qty", "unit", "item", "qty", "unit"];
      return (t, w, h) => {
        const lt = t % PERIOD;
        const L = w * 0.06, Wv = w * 0.36, mid = h * 0.5;

        // waveform
        const bars = 44, bw = Wv / bars;
        for (let i = 0; i < bars; i++) {
          const x = L + i * bw;
          const env = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.23 + t * 1.7) * Math.sin(i * 0.071 + t * 0.6));
          const a = (0.15 + 0.85 * hash(i, Math.floor(t * 9))) * env * h * 0.28;
          ctx.fillStyle = C.teal(0.35 + env * 0.55);
          ctx.fillRect(x, mid - a, Math.max(1, bw * 0.55), a * 2);
        }
        label(ctx, "voice note", L, mid - h * 0.34);

        // particles flowing from the waveform to the rows
        const R = w * 0.58;
        for (let p = 0; p < 26; p++) {
          const s = (t * 0.35 + hash(p, 21)) % 1;
          const y0 = mid + (hash(p, 22) - 0.5) * h * 0.4;
          const row = Math.floor(hash(p, 23) * keys.length);
          const y1 = h * 0.27 + row * h * 0.095;
          const e = s * s * (3 - 2 * s);
          const x = L + Wv + (R - L - Wv) * s;
          const y = y0 + (y1 - y0) * e;
          ctx.fillStyle = C.hi(0.2 + 0.6 * Math.sin(s * Math.PI));
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }

        // structured rows
        const shown = Math.floor(clamp((lt - 0.5) / (PERIOD * 0.7), 0, 1) * keys.length + 0.0001);
        const fs = clamp(w * 0.022, 10, 14);
        ctx.font = `400 ${fs}px ${MONO}`;
        ctx.fillStyle = C.ink(0.55);
        ctx.fillText("{", R, h * 0.2);
        for (let i = 0; i < shown; i++) {
          const y = h * 0.27 + i * h * 0.095;
          ctx.fillStyle = C.ink(0.5);
          ctx.fillText(`"${keys[i]}":`, R + fs, y + fs * 0.35);
          const vw = (w * 0.94 - (R + fs * 7)) * (0.35 + hash(i, 31) * 0.6);
          ctx.fillStyle = i === shown - 1 ? C.hi(0.95) : C.hi(0.45);
          ctx.fillRect(R + fs * 7, y - fs * 0.35, vw, fs * 0.7);
        }
        if (shown === keys.length) { ctx.fillStyle = C.ink(0.55); ctx.fillText("}", R, h * 0.27 + keys.length * h * 0.095); }
        label(ctx, "erp order", R, h * 0.12);
      };
    },

    /* ---------------------------------------------------------- */
    grader(ctx) {
      const ROWS = 12, TESTS = 10, STEP = 0.045;
      const total = ROWS * (TESTS + 1), PERIOD = total * STEP + 2.5;
      return (t, w, h) => {
        const lt = t % PERIOD;
        const done = Math.floor(lt / STEP);
        const cols = TESTS + 1;
        const cell = Math.min((w * 0.78) / (cols + 1.5), (h * 0.76) / ROWS);
        const ox = (w - cell * (cols + 1.5)) / 2 + cell * 1.5, oy = (h - cell * ROWS) / 2 + 8;

        label(ctx, "tests", ox, oy - 10);
        label(ctx, "ast", ox + TESTS * cell + cell * 0.5, oy - 10);
        for (let r = 0; r < ROWS; r++) {
          ctx.fillStyle = C.ink(0.22);
          ctx.fillRect(ox - cell * 1.4, oy + r * cell + cell * 0.38, cell * (0.6 + hash(r, 41) * 0.5), cell * 0.24);
          for (let c = 0; c < cols; c++) {
            const k = r * cols + c;
            const x = ox + c * cell + (c === TESTS ? cell * 0.5 : 0), y = oy + r * cell;
            if (k > done) {
              ctx.strokeStyle = C.ink(0.08);
              ctx.strokeRect(x + 2.5, y + 2.5, cell - 5, cell - 5);
              continue;
            }
            if (c === TESTS) {
              const flagged = hash(r, 43) > 0.82;
              ctx.fillStyle = flagged ? C.amber(0.75) : C.ink(0.14);
            } else {
              ctx.fillStyle = hash(r, c) > 0.18 ? C.hi(0.55) : C.red(0.6);
            }
            ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
            if (k === done) {
              ctx.strokeStyle = C.ink(0.95);
              ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
            }
          }
        }
      };
    },
  };

  /* ---------------------------------------------------------- */
  const items = new Map();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { const it = items.get(e.target); if (it) it.visible = e.isIntersecting; });
  }, { rootMargin: "100px" });

  function size(it) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = it.canvas.clientWidth, h = it.canvas.clientHeight;
    if (!w || !h) return;
    it.canvas.width = Math.round(w * dpr);
    it.canvas.height = Math.round(h * dpr);
    it.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    it.w = w;
    it.h = h;
    if (reduce) render(it, 4);
  }
  function render(it, t) {
    if (!it.w) return;
    it.ctx.fillStyle = C.frame;
    it.ctx.fillRect(0, 0, it.w, it.h);
    it.ctx.lineWidth = 1;
    it.draw(t, it.w, it.h);
  }

  function mount(canvas, name) {
    const scene = SCENES[name];
    if (!scene) return;
    const ctx = canvas.getContext("2d");
    const it = { canvas, ctx, draw: scene(ctx), visible: false, w: 0, h: 0, t0: performance.now() - Math.random() * 3000 };
    items.set(canvas, it);
    new ResizeObserver(() => size(it)).observe(canvas);
    io.observe(canvas);
    size(it);
  }

  function loop(now) {
    items.forEach((it) => { if (it.visible) render(it, (now - it.t0) / 1000); });
    requestAnimationFrame(loop);
  }
  if (!reduce) requestAnimationFrame(loop);
  else if (document.fonts) document.fonts.ready.then(() => items.forEach((it) => render(it, 4)));

  return { mount };
})();
