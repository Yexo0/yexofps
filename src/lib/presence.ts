// src/lib/presence.ts — Statut Discord en direct (Lanyard) : réduction de la réponse brute aux seules
// infos affichées, puis fusion avec le planning. Les activités non listées dans PRESENCE_ACTIVITIES
// ne quittent jamais le serveur.
import { PRESENCE_ACTIVITIES, type ActivityId } from "@/config/now";
import type { NowStatus } from "./now";

/** "Ne pas déranger" s'affiche "en ligne" : il coupe juste les notifs, je lis quand même mes messages */
export type DiscordStatus = "online" | "idle" | "offline";

export interface Presence {
  discord: DiscordStatus;
  /** Avatar et décoration de profil, en images statiques (pas d'animation, cohérent avec la DA) */
  avatar?: { url: string; decoration?: string };
  /** Jeu ou appli reconnu en cours (le premier trouvé) */
  game?: { name: string; activity: ActivityId; since?: number };
  /** Morceau en écoute sur Spotify (horodatages en ms) */
  spotify?: { song: string; artist: string; album: string; art?: string; url?: string; start: number; end: number };
}

const STATUSES: Record<string, DiscordStatus> = { online: "online", dnd: "online", idle: "idle", offline: "offline" };
const SNOWFLAKE = /^\d{17,20}$/;
const IMAGE_HASH = /^(a_)?[a-f0-9]{32}$/;
const KNOWN = new Map(Object.entries(PRESENCE_ACTIVITIES).map(([name, id]) => [name.toLowerCase(), { name, id }]));

type Raw = Record<string, unknown>;
const isObject = (v: unknown): v is Raw => typeof v === "object" && v !== null;
const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

/** Réponse Lanyard (champ data) → Presence. Tolérant : un champ manquant est simplement ignoré. */
export function reducePresence(data: unknown): Presence {
  const d = isObject(data) ? data : {};
  const presence: Presence = { discord: STATUSES[str(d.discord_status) ?? ""] ?? "offline" };

  // Avatar Discord (CDN officiel, identifiants vérifiés). Version statique, même si l'avatar est animé.
  const user = isObject(d.discord_user) ? d.discord_user : {};
  const id = str(user.id);
  const hash = str(user.avatar);
  if (id && SNOWFLAKE.test(id) && hash && IMAGE_HASH.test(hash)) {
    const decoration = isObject(user.avatar_decoration_data) ? str(user.avatar_decoration_data.asset) : undefined;
    presence.avatar = {
      url: `https://cdn.discordapp.com/avatars/${id}/${hash}.png?size=128`,
      decoration:
        decoration && IMAGE_HASH.test(decoration)
          ? `https://cdn.discordapp.com/avatar-decoration-presets/${decoration}.png?size=160&passthrough=false`
          : undefined,
    };
  }

  // Activités "Joue à" (type 0) reconnues uniquement
  const activities = Array.isArray(d.activities) ? d.activities.filter(isObject) : [];
  for (const activity of activities) {
    const known = activity.type === 0 ? KNOWN.get(str(activity.name)?.toLowerCase() ?? "") : undefined;
    if (!known) continue;
    const since = isObject(activity.timestamps) ? num(activity.timestamps.start) : undefined;
    presence.game = { name: known.name, activity: known.id, since };
    break;
  }

  const spotify = isObject(d.spotify) ? d.spotify : undefined;
  const times = spotify && isObject(spotify.timestamps) ? spotify.timestamps : undefined;
  const start = num(times?.start);
  const end = num(times?.end);
  if (d.listening_to_spotify === true && spotify && str(spotify.song) && start && end && end > start) {
    const art = str(spotify.album_art_url);
    const track = str(spotify.track_id);
    presence.spotify = {
      song: str(spotify.song)!,
      artist: (str(spotify.artist) ?? "").replaceAll(";", ","),
      album: str(spotify.album) ?? "",
      // Seules les pochettes Spotify sont acceptées (domaine autorisé pour next/image)
      art: art?.startsWith("https://i.scdn.co/") ? art : undefined,
      url: track && /^[A-Za-z0-9]+$/.test(track) ? `https://open.spotify.com/track/${track}` : undefined,
      start,
      end,
    };
  }
  return presence;
}

export interface LiveActivity {
  id: ActivityId;
  /** discord = vu en direct ; schedule = d'après le planning */
  source: "discord" | "schedule";
  /** Nom du jeu (activité "game") */
  name?: string;
  /** Début de l'activité en direct (ms) */
  since?: number;
}

/**
 * Activité affichée : un jeu ou une appli reconnus sur Discord l'emportent sur le planning.
 * Spotify en écoute confirme le créneau musique, ou remplace "hors ligne" (je ne dors pas).
 */
export function liveActivity(now: NowStatus, presence: Presence | null): LiveActivity {
  if (presence?.game) {
    return { id: presence.game.activity, source: "discord", name: presence.game.name, since: presence.game.since };
  }
  // Pas de "depuis" : seul le début du morceau en cours est connu, pas celui de l'écoute
  if (presence?.spotify && (now.current.id === "music" || now.current.id === "offline")) {
    return { id: "music", source: "discord" };
  }
  return { id: now.current.id, source: "schedule" };
}
