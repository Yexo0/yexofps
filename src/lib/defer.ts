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
