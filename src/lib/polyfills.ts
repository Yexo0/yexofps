// src/lib/polyfills.ts — Remplace le module de polyfills de Next (alias dans next.config.ts).
// Les navigateurs visés ont tout en natif, sauf URL.canParse (Chrome 120, Safari 17), utilisé par Next
// seulement avec un assetPrefix : gardé quand même, au cas où, pour une poignée d'octets.
if (typeof URL !== "undefined" && !("canParse" in URL)) {
  (URL as unknown as { canParse: (url: string, base?: string) => boolean }).canParse = (url, base) => {
    try {
      return Boolean(new URL(url, base));
    } catch {
      return false;
    }
  };
}

export {};
