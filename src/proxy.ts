// src/proxy.ts — Redirection vers la langue (/fr, /en). Exclut l'API, les fichiers et les assets.
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
