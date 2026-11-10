// src/app/[locale]/[...rest]/page.tsx — Toute URL inconnue sous /fr ou /en affiche la 404 localisée.
import { notFound } from "next/navigation";

export default function CatchAll() {
  notFound();
}
