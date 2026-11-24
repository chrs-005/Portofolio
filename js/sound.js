/* ============================================================
   Sound design, synthesized live with the Web Audio API.
   No audio files. Off by default (browsers block autoplay);
   the "Sound" toggle in the nav turns it on.

   ambient : low drone (A and E, slightly detuned) + filtered
             wind noise, both slowly breathing through LFOs
   hover   : short soft tone picked from a minor pentatonic
   click   : falling blip
   ============================================================ */
window.SFX = (() => {
  let ctx = null, master = null, on = false, lastHover = 0;
  const KEY = "ce-sound";

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // ---- drone ----
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 380;
    lp.Q.value = 0.8;
    const bed = ctx.createGain();
    bed.gain.value = 0.12;
    lp.connect(bed).connect(master);

    [[55, "sine", 0.5, -4], [82.41, "triangle", 0.22, 3], [110, "sine", 0.28, 5], [164.81, "triangle", 0.07, -6]]
      .forEach(([f, type, g, det]) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = f;
        o.detune.value = det;
        const og = ctx.createGain();
        og.gain.value = g;
        o.connect(og).connect(lp);
        o.start();
      });

    // ---- wind ----
    const len = ctx.sampleRate * 3;
    const nb = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = nb.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = nb;
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 700;
    bp.Q.value = 0.5;
    const ng = ctx.createGain();
    ng.gain.value = 0.05;
    noise.connect(bp).connect(ng).connect(lp);
    noise.start();

    // ---- slow breathing ----
    const lfo = (rate, depth, target) => {
      const o = ctx.createOscillator();
      o.frequency.value = rate;
      const g = ctx.createGain();
      g.gain.value = depth;
      o.connect(g).connect(target);
      o.start();
    };
    lfo(0.045, 160, lp.frequency);
    lfo(0.07, 420, bp.frequency);
    lfo(0.03, 0.04, bed.gain);
  }

  function set(v) {
    if (!ctx) build();
    if (ctx.state === "suspended") ctx.resume();
    on = v;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setTargetAtTime(v ? 0.9 : 0, t, v ? 0.8 : 0.25);
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch (e) {}
    return on;
  }

  const SCALE = [0, 3, 5, 7, 10, 12, 15];
  function tone(kind) {
    if (!on || !ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    if (kind === "click") {
      o.frequency.setValueAtTime(660, t);
      o.frequency.exponentialRampToValueAtTime(180, t + 0.14);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.09, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    } else {
      const semis = SCALE[Math.floor(Math.random() * SCALE.length)];
      o.frequency.value = 440 * Math.pow(2, semis / 12);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.03, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    }
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.35);
  }

  return {
    toggle: () => set(!on),
    get on() { return on; },
    wasOn() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } },
    hover() {
      const now = performance.now();
      if (now - lastHover < 70) return;
      lastHover = now;
      tone("hover");
    },
    click: () => tone("click"),
  };
})();
