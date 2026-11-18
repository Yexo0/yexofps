// src/proxy.ts — Redirection vers la langue (/fr, /en). Exclut l'API, les fichiers et les assets,
// ainsi que les icônes générées sans extension (/icon, /apple-icon) : redirigées vers /fr/icon, elles
// tombaient sur la page 404 et l'onglet n'avait pas de favicon.
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)"],
};
