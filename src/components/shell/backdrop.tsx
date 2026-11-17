// src/components/shell/backdrop.tsx — Fond du site, fixe derrière tout le contenu, en trois couches :
// 1. dégradés teintés par l'espace (CSS, seule couche si WebGL est absent) ;
// 2. fumée lente en WebGL (shader maison), aux couleurs de l'espace ;
// 3. lignes "tactiques" (diagonales graduées, repères, crochets) en SVG, avec une légère parallaxe
//    au défilement et à la souris, et le numéro de l'espace en très grand, en contour.
// Coût maîtrisé : la fumée est calculée en basse résolution (elle est floue de toute façon), à 30 i/s,
// en pause quand l'onglet est caché ; une seule image fixe si les animations sont réduites ou si
// la machine est modeste. La parallaxe n'anime que des transform (compositeur).
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { SPACES, spaceFromPath } from "@/config/spaces";

/* ─── Fumée (WebGL 1, un seul triangle plein écran) ─── */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec3 bg;uniform vec4 c1;uniform vec4 c2;uniform vec2 m;uniform float s;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 k=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*n(p);p=k*p;a*=.5;}return v;}
void main(){
vec2 uv=gl_FragCoord.xy/r;
vec2 p=(gl_FragCoord.xy-.5*r)/r.y;
p+=m*.04;p.y-=s;
float tt=t*.03;
vec2 q=vec2(fbm(p*1.5+tt),fbm(p*1.5-tt+5.2));
vec2 w=vec2(fbm(p*1.3+2.*q+vec2(1.7,9.2)+tt*1.3),fbm(p*1.3+2.*q+vec2(8.3,2.8)-tt));
float f=fbm(p*1.1+2.4*w);
float band=1.-smoothstep(.0,.75,abs((uv.y-.5)-(uv.x-.5)*-.55+.08));
float corner=smoothstep(1.25,.1,length(uv-vec2(.92,.95)))+smoothstep(1.1,.1,length(uv-vec2(.05,.02)))*.7;
float mask=clamp(band*.55+corner*.75,0.,1.);
float d=smoothstep(.32,.95,f)*mask;
vec3 col=mix(bg,c1.rgb,d*c1.a);
col=mix(col,c2.rgb,smoothstep(.5,1.,w.x)*mask*c2.a);
col*=1.-.25*smoothstep(.55,1.2,length(uv-.5));
gl_FragColor=vec4(col,1.);
}`;

type RGBA = [number, number, number, number];

/** Couleur CSS calculée (n'importe quel format) → RGBA 0-1, via un canvas 2D de 1 px */
function makeColorReader() {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  return (css: string): RGBA => {
    if (!ctx) return [0, 0, 0, 0];
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = css.trim() || "transparent";
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return [r / 255, g / 255, b / 255, a / 255];
  };
}

function useSmoke(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, depth: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uR = u("r"), uT = u("t"), uBg = u("bg"), uC1 = u("c1"), uC2 = u("c2"), uM = u("m"), uS = u("s");

    canvas.dataset.ready = "";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & { deviceMemory?: number };
    const modest = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
    const read = makeColorReader();
    const root = document.documentElement;

    let bg: RGBA = [0, 0, 0, 1], c1: RGBA = [0, 0, 0, 0], c2: RGBA = [0, 0, 0, 0];
    // Couleurs relues pendant la transition d'espace / de thème (propriétés CSS animées), puis figées
    let colorsUntil = performance.now() + 1200;
    const readColors = () => {
      const cs = getComputedStyle(root);
      bg = read(cs.getPropertyValue("--bg"));
      c1 = read(cs.getPropertyValue("--haze"));
      c2 = read(cs.getPropertyValue("--haze-2"));
    };

    const scale = 0.34;
    const resize = () => {
      canvas.width = Math.max(2, Math.round(window.innerWidth * scale));
      canvas.height = Math.max(2, Math.round(window.innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const start = performance.now() - 20_000 * Math.random();
    let frame = 0;
    let last = 0;

    const draw = (now: number) => {
      if (now < colorsUntil) readColors();
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - start) / 1000);
      gl.uniform3f(uBg, bg[0], bg[1], bg[2]);
      gl.uniform4f(uC1, c1[0], c1[1], c1[2], c1[3]);
      gl.uniform4f(uC2, c2[0], c2[1], c2[2], c2[3]);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.uniform1f(uS, Math.min(window.scrollY, 4000) / window.innerHeight * 0.12);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const still = () => reduced.matches || modest;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30 images/s
      last = now;
      draw(now);
    };
    const play = () => {
      cancelAnimationFrame(frame);
      if (still()) {
        // Image fixe (redessinée après une transition de couleur)
        readColors();
        draw(start + 20_000);
        if (performance.now() < colorsUntil) frame = requestAnimationFrame(play);
        return;
      }
      if (!document.hidden) frame = requestAnimationFrame(loop);
    };
    play();

    const onVisibility = () => (document.hidden ? cancelAnimationFrame(frame) : play());
    const onResize = () => {
      resize();
      if (still()) play();
    };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = 0.5 - e.clientY / window.innerHeight;
    };
    const mo = new MutationObserver(() => {
      colorsUntil = performance.now() + 1200;
      if (still()) play();
    });
    mo.observe(root, { attributes: true, attributeFilter: ["data-space", "data-theme"] });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    reduced.addEventListener("change", play);

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      reduced.removeEventListener("change", play);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [canvasRef]);
}

/* ─── Parallaxe des lignes (défilement + souris), en transform uniquement ─── */

function useParallax(far: React.RefObject<HTMLElement | null>, near: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let mx = 0, my = 0, cx = 0, cy = 0;
    const apply = () => {
      frame = 0;
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      const y = Math.min(window.scrollY, 3000);
      if (far.current) far.current.style.transform = `translate3d(${cx * -6}px, ${-y * 0.025 + cy * -6}px, 0)`;
      if (near.current) near.current.style.transform = `translate3d(${cx * -14}px, ${-y * 0.06 + cy * -14}px, 0)`;
      if (Math.abs(mx - cx) > 0.002 || Math.abs(my - cy) > 0.002) frame = requestAnimationFrame(apply);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      request();
    };
    apply();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("pointermove", onMove);
    };
  }, [far, near]);
}

/* ─── Dessin des lignes (viewBox 1600 × 1000, recadré pour couvrir l'écran) ─── */

const DIAG = { x1: -100, y1: 880, x2: 1700, y2: 160 };
const slope = (DIAG.y2 - DIAG.y1) / (DIAG.x2 - DIAG.x1);
const onDiag = (x: number) => DIAG.y1 + (x - DIAG.x1) * slope;
// Graduations perpendiculaires le long de la diagonale
const TICKS = Array.from({ length: 44 }, (_, i) => {
  const x = -60 + i * 40;
  const y = onDiag(x);
  const len = i % 5 === 0 ? 14 : 6;
  const nx = -slope / Math.hypot(1, slope);
  const ny = 1 / Math.hypot(1, slope);
  return { x1: x, y1: y, x2: x + nx * len, y2: y + ny * len, major: i % 5 === 0 };
});
const DOTS = Array.from({ length: 24 }, (_, i) => ({ x: 120 + (i % 6) * 16, y: 132 + Math.floor(i / 6) * 16 }));

function FarLines() {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <g stroke="var(--line-strong)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke">
        <line {...DIAG} />
        <line x1={DIAG.x1} y1={DIAG.y1 + 16} x2={DIAG.x2} y2={DIAG.y2 + 16} strokeDasharray="2 6" />
        {TICKS.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? "var(--accent)" : undefined} />
        ))}
        {/* Grille fine de repérage, en bas à droite */}
        <path d="M1240 640H1600M1240 720H1600M1240 800H1600M1320 600V1000M1400 600V1000M1480 600V1000" strokeDasharray="1 7" />
      </g>
      <g fill="var(--accent)">
        <rect x={418} y={onDiag(420) - 3} width="6" height="6" />
        <rect x={1178} y={onDiag(1180) - 3} width="6" height="6" />
      </g>
      <g fill="var(--text-dim)">
        {DOTS.map((d, i) => (
          <rect key={i} x={d.x} y={d.y} width="2" height="2" />
        ))}
      </g>
    </svg>
  );
}

function NearLines() {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <g fill="none" strokeWidth="1.25" vectorEffect="non-scaling-stroke">
        {/* Cadre à pan coupé, en haut à droite */}
        <path d="M1150 74H1500L1546 120V340" stroke="var(--accent)" opacity="0.55" />
        <path d="M1546 360V392" stroke="var(--accent)" opacity="0.55" />
        {/* Crochet en bas à gauche */}
        <path d="M44 690V930L84 970H380" stroke="var(--line-strong)" />
        <path d="M400 970H430" stroke="var(--accent)" opacity="0.7" />
        {/* Repères en croix */}
        <path d="M290 230h16M298 222v16M1392 780h16M1400 772v16M760 96h10M765 91v10" stroke="var(--text-dim)" />
        {/* Chevrons */}
        <path d="M1460 470l14 14-14 14M1478 470l14 14-14 14" stroke="var(--accent)" opacity="0.5" />
      </g>
    </svg>
  );
}

export function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const n = SPACES.indexOf(spaceFromPath(pathname)) + 1;
  useSmoke(canvasRef);
  useParallax(farRef, nearRef);

  return (
    <div aria-hidden="true" className="backdrop">
      <div className="backdrop-base" />
      <canvas ref={canvasRef} className="backdrop-smoke" />
      <div ref={farRef} className="backdrop-lines">
        <FarLines />
      </div>
      <div ref={nearRef} className="backdrop-lines backdrop-lines-near">
        <NearLines />
      </div>
      <span key={n} className="backdrop-number">
        {String(n).padStart(2, "0")}
      </span>
    </div>
  );
}
