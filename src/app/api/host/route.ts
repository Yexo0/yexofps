// src/app/api/host/route.ts — Chiffres en direct du serveur pour la page /lab/site (voir lib/host).
// Appelé toutes les 10 s par la page ouverte : sert aussi à mesurer le temps de réponse.
import { NextResponse, type NextRequest } from "next/server";
import { hostInfo } from "@/lib/host";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return NextResponse.json(await hostInfo(request.headers), { headers: { "Cache-Control": "no-store" } });
}
