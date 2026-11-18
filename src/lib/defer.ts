// src/lib/defer.ts — Outils partagés par les effets coûteux (fumée WebGL du fond, scènes 3D) :
// démarrage différé après le chargement de la page, et détection d'un WebGL sans vrai GPU.

/**
 * Lance `run` une fois la page chargée (événement load) puis le navigateur au repos
 * (requestIdleCallback, ou un court délai là où il n'existe pas, comme Safari).
 * Le premier affichage, l'hydratation et les ressources critiques passent avant.
 * Renvoie une fonction d'annulation (à appeler au démontage).
 */
export function afterLoadIdle(run: () => void, timeout = 2000): () => void {
  let idle = 0;
  let timer = 0;
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(run, { timeout });
    else timer = window.setTimeout(run, 200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idle) window.cancelIdleCallback(idle);
    window.clearTimeout(timer);
  };
}

/**
 * WebGL rendu par le processeur (SwiftShader, llvmpipe… : pas de GPU, pilote absent ou bloqué).
 * Chaque image y coûte des centaines de millisecondes sur le fil principal.
 */
export function isSoftwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch {
    return false;
  }
}

/** Téléphone : écran tactile étroit (< 768 px, comme le breakpoint md de Tailwind) */
export function isPhone(): boolean {
  return window.matchMedia("(pointer: coarse) and (max-width: 767px)").matches;
}

/**
 * Garde-fou de cadence, appelé à chaque image dessinée : mesure la cadence par fenêtres de 2 s et
 * répond vrai quand deux fenêtres d'affilée passent sous `minFps` (l'effet doit alors se figer).
 * Une interruption de plus de 5 s (onglet en arrière-plan, page gelée) remet la mesure à zéro :
 * c'est une pause, pas une lenteur ; une image de 1 ou 2 s, elle, compte comme de la lenteur.
 */
export function cadenceWatch(minFps: number) {
  let start = 0, frames = 0, slowWindows = 0, prev = 0;
  return {
    reset() {
      start = 0;
    },
    tick(now: number): boolean {
      if (!start || now - prev > 5000) {
        start = now;
        frames = 0;
      } else {
        frames++;
      }
      prev = now;
      if (now - start < 2000) return false;
      const fps = (frames * 1000) / (now - start);
      slowWindows = fps < minFps ? slowWindows + 1 : 0;
      start = now;
      frames = 0;
      return slowWindows >= 2;
    },
  };
}
