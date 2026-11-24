// src/app/not-found.tsx — 404 outside a language (e.g. a missing file). The root layout doesn't render
// <html>, so this page does it itself. URLs under /en and /fr use src/app/[locale]/not-found.tsx.
import Link from "next/link";
import { themeCss } from "@/lib/theme";
import "./globals.css";

export default function RootNotFound() {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="grid min-h-dvh place-items-center p-6 font-sans">
        <main className="flex max-w-md flex-col items-center gap-6 text-center">
          <p className="display text-[120px] leading-none text-fg">404</p>
          <h1 className="text-lg font-medium text-muted">Page not found · Page introuvable</h1>
          <p className="flex justify-center gap-2">
            <Link href="/en" className="btn btn-primary">
              Home
            </Link>
            <Link href="/fr" className="btn btn-tonal">
              Accueil
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
