// src/components/shell/backdrop.tsx — Fond de tout le site : courbes de niveau (lignes topographiques)
// fines et discrètes qui dérivent et se déforment très lentement, une ligne sur quatre en rouge,
// sur un fond noir avec une lueur rouge fixe en haut à droite (CSS). Les cartes en verre le laissent voir.
// Coût : un shader WebGL (bruit + lignes antialiasées), 30 images/s, rien quand l'onglet est caché.
// Une seule image figée en mouvement réduit ou sans GPU (rendu logiciel, à demi-résolution).
// Démarré après le chargement de la page ; sans WebGL, il reste le fond CSS (noir + lueur).
"use client";

import { useEffect, useRef } from "react";
import { afterLoadIdle, isSoftwareRenderer } from "@/lib/defer";

const FRAME_MS = 1000 / 30;

/** Couleurs par thème : lignes, lignes majeures (rouge), opacités */
const LOOK = {
  dark: { line: [1, 1, 1], major: [1, 0.275, 0.333], lineA: 0.07, majorA: 0.26 },
  light: { line: [0, 0, 0], major: [0.77, 0.16, 0.23], lineA: 0.07, majorA: 0.26 },
} as const;

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Bruit simplex 2D (Ashima Arts / Stefan Gustavson, licence MIT), trois octaves qui dérivent chacune
// dans sa direction : le relief se déforme sans jamais se répéter. Une ligne tous les 1/LEVELS de hauteur,
// épaisseur constante en pixels grâce à fwidth (OES_standard_derivatives).
const FRAG = `#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;uniform float uTime;uniform float uPx;
uniform vec3 uLine;uniform vec3 uMajor;uniform float uLineA;uniform float uMajorA;
vec3 perm(vec3 x){return mod(((x*34.)+1.)*x,289.);}
float snoise(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);
vec3 p=perm(perm(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;
vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;
m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes.y*1.15;float t=uTime;
  float f=snoise(uv*.8+vec2(t*.012,-t*.008))*.68+snoise(uv*1.7+vec2(-t*.01,t*.014))*.24+snoise(uv*3.4+vec2(t*.007,t*.006))*.08;
  f*=5.;
  float d=abs(fract(f-.5)-.5)/max(fwidth(f),1e-4);
  float line=1.-smoothstep(.35*uPx,.35*uPx+1.,d);
  float major=1.-step(.5,abs(mod(floor(f+.5),4.)));
  float a=line*mix(uLineA,uMajorA,major);
  gl_FragColor=vec4(mix(uLine,uMajor,major)*a,a);
}`;

function setup(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  if (!gl || !gl.getExtension("OES_standard_derivatives")) return null;
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = shader(gl.VERTEX_SHADER, VERT);
  const fs = shader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  // Un triangle qui couvre tout l'écran
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (name: string) => gl.getUniformLocation(prog, name);
  return {
    gl,
    software: isSoftwareRenderer(gl),
    res: u("uRes"),
    time: u("uTime"),
    px: u("uPx"),
    line: u("uLine"),
    major: u("uMajor"),
    lineA: u("uLineA"),
    majorA: u("uMajorA"),
  };
}

export function Backdrop() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ctx: ReturnType<typeof setup> = null;
    let raf = 0;
    let last = 0;
    // Départ à un instant différent à chaque visite : jamais deux fois le même relief
    let time = Math.random() * 600;
    let running = false;

    const still = () => !ctx || ctx.software || reduced.matches;

    const resize = () => {
      if (!ctx) return;
      // Sans GPU : demi-résolution (une seule image) ; sinon jusqu'à 1,5 pixel réel par pixel CSS
      const scale = ctx.software ? 0.5 : Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(window.innerWidth * scale);
      const h = Math.round(window.innerHeight * scale);
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
        ctx.gl.viewport(0, 0, w, h);
      }
      ctx.gl.uniform2f(ctx.res, w, h);
      ctx.gl.uniform1f(ctx.px, scale);
      if (!running) draw();
    };

    const colors = () => {
      if (!ctx) return;
      const look = LOOK[root.getAttribute("data-theme") === "light" ? "light" : "dark"];
      ctx.gl.uniform3fv(ctx.line, look.line);
      ctx.gl.uniform3fv(ctx.major, look.major);
      ctx.gl.uniform1f(ctx.lineA, look.lineA);
      ctx.gl.uniform1f(ctx.majorA, look.majorA);
    };

    const draw = () => {
      if (!ctx) return;
      ctx.gl.uniform1f(ctx.time, time);
      ctx.gl.drawArrays(ctx.gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      time += last ? Math.min(100, now - last) / 1000 : 0;
      last = now;
      draw();
    };
    const start = () => {
      if (running || document.hidden || still()) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotion = () => {
      if (!reduced.matches) return start();
      stop();
      draw();
    };
    const themeWatch = new MutationObserver(() => {
      colors();
      if (!running) draw();
    });
    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
      el.removeAttribute("data-on");
    };

    const cancel = afterLoadIdle(() => {
      ctx = setup(el);
      if (!ctx) return;
      colors();
      resize();
      draw();
      el.setAttribute("data-on", "");
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVisibility);
      reduced.addEventListener("change", onMotion);
      themeWatch.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
      el.addEventListener("webglcontextlost", onLost);
      start();
    });

    return () => {
      cancel();
      stop();
      themeWatch.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotion);
      el.removeEventListener("webglcontextlost", onLost);
      ctx?.gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div aria-hidden="true" className="backdrop">
      <div className="backdrop-base" />
      <canvas ref={canvas} className="backdrop-canvas" />
    </div>
  );
}
