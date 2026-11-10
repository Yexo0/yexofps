// src/app/not-found.tsx — 404 hors langue (ex. fichier introuvable). Le layout racine ne rend pas <html>,
// cette page le fait elle-même. Les URL sous /fr et /en utilisent src/app/[locale]/not-found.tsx.
import Link from "next/link";
import { themeCss } from "@/lib/theme";
import "./globals.css";

export default function RootNotFound() {
  return (
    <html lang="fr" data-theme="dark">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="grid min-h-dvh place-items-center p-6 font-sans">
        <main className="card max-w-md gap-4 text-center">
          <p className="font-mono text-[56px] font-semibold leading-none text-accent">404</p>
          <h1 className="text-lg font-bold">Page introuvable · Page not found</h1>
          <p className="flex justify-center gap-2">
            <Link href="/fr" className="btn btn-primary">
              Accueil
            </Link>
            <Link href="/en" className="btn btn-tonal">
              Home
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
