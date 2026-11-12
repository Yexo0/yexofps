// src/lib/host.ts — Ce que le serveur peut dire de lui-même, lu en direct (page /lab/site) :
// système, ressources, durées de fonctionnement, gestionnaire de process, chaîne devant l'appli
// (déduite des en-têtes reçus) et certificat HTTPS présenté aux visiteurs.
// Rien d'identifiant n'est renvoyé : ni nom de machine, ni adresse IP, ni version précise du noyau.
// Côté serveur uniquement (node:os, node:fs, node:tls).
import { existsSync, readFileSync } from "node:fs";
import os from "node:os";
import tls from "node:tls";
import { SITE } from "@/config/site";

export interface HostInfo {
  /** Ex : "Ubuntu 24.04" (null si inconnu) */
  os: string | null;
  /** Version majeure de Node.js, ex : "22" */
  node: string;
  cpus: number;
  memory: { total: number; used: number };
  /** Charge moyenne sur 1 min */
  load: number;
  /** Secondes depuis le démarrage du serveur / de l'appli (dernier redémarrage ou déploiement) */
  uptime: { system: number; app: number };
  /** Gestionnaire qui fait tourner l'appli, détecté par l'environnement */
  manager: "pm2" | "systemd" | "docker" | null;
  /** Chaîne devant l'appli, déduite des en-têtes de la requête */
  edge: { cloudflare: boolean; https: boolean; proxy: boolean };
  /** Certificat HTTPS de yexofps.org (null si la vérification échoue) */
  certificate: { issuer: string; daysLeft: number } | null;
}

function readOs(): string | null {
  try {
    const release = readFileSync("/etc/os-release", "utf8");
    const field = (key: string) => release.match(new RegExp(`^${key}="?([^"\\n]*)"?`, "m"))?.[1];
    const name = field("NAME");
    const version = field("VERSION_ID");
    return name ? [name, version].filter(Boolean).join(" ") : null;
  } catch {
    return null;
  }
}

/** Mémoire utilisée hors cache (MemAvailable), plus juste que os.freemem() sous Linux */
function readMemory() {
  const total = os.totalmem();
  try {
    const kb = Number(readFileSync("/proc/meminfo", "utf8").match(/^MemAvailable:\s+(\d+)/m)?.[1]);
    if (kb > 0) return { total, used: total - kb * 1024 };
  } catch {
    // pas de /proc (hors Linux)
  }
  return { total, used: total - os.freemem() };
}

function detectManager(): HostInfo["manager"] {
  if (process.env.pm_id !== undefined || process.env.PM2_HOME) return "pm2";
  if (process.env.INVOCATION_ID) return "systemd";
  if (existsSync("/.dockerenv")) return "docker";
  return null;
}

/* ─── Certificat HTTPS (vérifié au plus toutes les 6 h, 10 min après un échec) ─── */

const CERT_TTL_MS = 6 * 60 * 60 * 1000;
/** Échec (réseau, délai) : nouvel essai plus tôt */
const CERT_RETRY_MS = 10 * 60 * 1000;
let certCache: { at: number; value: HostInfo["certificate"] } | null = null;

function checkCertificate(): Promise<HostInfo["certificate"]> {
  const host = new URL(SITE.url).hostname;
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port: 443, servername: host, timeout: 4_000 }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert?.valid_to) return resolve(null);
      const issuer = [cert.issuer?.O, cert.issuer?.CN].filter(Boolean).join(" · ");
      const daysLeft = Math.floor((new Date(cert.valid_to).getTime() - Date.now()) / 86_400_000);
      resolve({ issuer, daysLeft });
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(null);
    });
    socket.on("error", () => resolve(null));
  });
}

async function certificate(): Promise<HostInfo["certificate"]> {
  if (certCache && Date.now() - certCache.at < (certCache.value ? CERT_TTL_MS : CERT_RETRY_MS)) return certCache.value;
  const value = await checkCertificate();
  certCache = { at: Date.now(), value };
  return value;
}

/* ─── Instantané ─── */

const OS_NAME = readOs();

export async function hostInfo(headers: Headers): Promise<HostInfo> {
  // L'appli écoute en HTTP : si la requête est arrivée en HTTPS, quelque chose a terminé le TLS devant
  const proto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const cloudflare = headers.has("cf-ray");
  return {
    os: OS_NAME,
    node: process.versions.node.split(".")[0],
    cpus: os.cpus().length,
    memory: readMemory(),
    load: Math.round(os.loadavg()[0] * 100) / 100,
    uptime: { system: Math.floor(os.uptime()), app: Math.floor(process.uptime()) },
    manager: detectManager(),
    edge: { cloudflare, https: proto === "https", proxy: proto === "https" || headers.has("x-real-ip") },
    certificate: await certificate(),
  };
}
