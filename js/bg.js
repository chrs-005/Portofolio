/* ============================================================
   Background: a slow smoke field that never stops moving.
   Domain-warped fractal noise in a fragment shader. The cursor
   stirs it (a local swirl) and the whole field drifts opposite
   the cursor for parallax. It dims as you scroll down.
   Falls back to the static Higgsfield texture without WebGL.
   ============================================================ */
(() => {
  const canvas = document.getElementById("bg");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
  if (!gl) { canvas.classList.add("fallback"); return; }

  const VS = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
  const FS = `
    precision highp float;
    uniform vec2 uRes;
    uniform float uTime;
    uniform vec2 uMouse;   // cursor in uv space
    uniform float uScroll; // 0 at top, 1 further down

    float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5;
      mat2 R = mat2(0.8, 0.6, -0.6, 0.8);
      for (int i = 0; i < 5; i++) { v += a * noise(p); p = R * p * 2.03; a *= 0.5; }
      return v;
    }

    void main(){
      vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
      float t = uTime * 0.05;

      // cursor swirl + opposite drift
      vec2 dv = uv - uMouse;
      float k = exp(-dot(dv, dv) * 4.0);
      vec2 q = uv * 1.5 - uMouse * 0.18 + vec2(-dv.y, dv.x) * k * 0.9;

      vec2 a = vec2(fbm(q + vec2(0.0, t)), fbm(q + vec2(5.2, 1.3) - t));
      vec2 b = vec2(fbm(q + 3.0 * a + vec2(1.7, 9.2) + 1.3 * t),
                    fbm(q + 3.0 * a + vec2(8.3, 2.8) - 1.1 * t));
      float f = fbm(q + 3.2 * b);

      vec3 teal   = vec3(0.03, 0.20, 0.22);
      vec3 violet = vec3(0.17, 0.07, 0.30);
      vec3 green  = vec3(0.06, 0.30, 0.17);
      vec3 col = mix(violet, teal, clamp(length(a) * 0.9, 0.0, 1.0));
      col = mix(col, green, clamp(b.x * b.x * 1.3, 0.0, 1.0));
      col *= smoothstep(0.28, 0.95, f) * 1.7;
      col += vec3(0.55, 0.75, 0.9) * 0.05 * smoothstep(0.62, 1.0, f);
      col += vec3(0.6, 0.9, 0.8) * 0.035 * k;              // faint light under the cursor

      col *= 1.0 - 0.6 * dot(uv * 0.8, uv * 0.8);           // vignette
      col *= mix(1.0, 0.5, uScroll);
      gl_FragColor = vec4(col + vec3(0.016, 0.018, 0.022), 1.0);
    }`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) {
    console.warn("Background shader failed, using texture.", e);
    canvas.classList.add("fallback");
    return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");
  const uMouse = gl.getUniformLocation(prog, "uMouse");
  const uScroll = gl.getUniformLocation(prog, "uScroll");

  // render at reduced resolution: the field is soft anyway, and it keeps the GPU cool
  const SCALE = 0.5;
  function resize() {
    canvas.width = Math.max(1, Math.round(innerWidth * SCALE));
    canvas.height = Math.max(1, Math.round(innerHeight * SCALE));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  addEventListener("resize", resize);

  let tx = 0, ty = 0, mx = 0, my = 0;
  addEventListener("mousemove", (e) => {
    tx = (e.clientX - innerWidth / 2) / innerHeight;
    ty = -(e.clientY - innerHeight / 2) / innerHeight;
  });

  const t0 = performance.now();
  function frame(now) {
    mx += (tx - mx) * 0.04;
    my += (ty - my) * 0.04;
    const s = Math.min(scrollY / (innerHeight * 1.5), 1);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - t0) / 1000 + 20);
    gl.uniform2f(uMouse, mx, my);
    gl.uniform1f(uScroll, s);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduce) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
