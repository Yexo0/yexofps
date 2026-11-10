// src/components/home/featured-edit.tsx — Montage à la une, avec réglage du son.
// Deux modes selon FEATURED_EDIT (src/config/site.ts) :
// - `video` renseigné : lecteur maison (lecture/pause, couper le son, curseur de volume, progression) ;
// - sinon : image + bouton, puis lecteur TikTok intégré chargé seulement au clic (vie privée, performance).
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { FEATURED_EDIT } from "@/config/site";
import { Reticle } from "@/components/ui/reticle";

export function FeaturedEdit() {
  if (!FEATURED_EDIT.video) return <TikTokPlayer />;
  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      <NativePlayer src={FEATURED_EDIT.video} />
      <TikTokLink />
    </div>
  );
}

function TikTokLink() {
  const t = useTranslations("home.edit");
  return (
    <a
      href={FEATURED_EDIT.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-accent"
    >
      {t("open")}
      <ExternalLink size={13} aria-hidden="true" />
    </a>
  );
}

/* ─── Lecteur TikTok, chargé au clic ─── */

function TikTokPlayer() {
  const t = useTranslations("home.edit");
  const [loaded, setLoaded] = useState(false);
  const params = new URLSearchParams({
    controls: "1",
    progress_bar: "1",
    play_button: "1",
    volume_control: "1",
    fullscreen_button: "1",
    timestamp: "0",
    loop: "1",
    autoplay: "1",
    music_info: "0",
    description: "0",
    rel: "0",
    native_context_menu: "0",
    closed_caption: "0",
  });

  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-2xl bg-black">
        {loaded ? (
          <iframe
            src={`https://www.tiktok.com/player/v1/${FEATURED_EDIT.tiktokId}?${params}`}
            title={t("frameTitle")}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group absolute inset-0 flex items-end justify-start p-4 text-left"
          >
            {/* Image horizontale : fond flouté plein cadre + image entière au centre (pas d'agrandissement flou) */}
            <Image src={FEATURED_EDIT.poster} alt="" fill sizes="340px" className="scale-125 object-cover opacity-60 blur-2xl" />
            <Image
              src={FEATURED_EDIT.poster}
              alt={t("posterAlt")}
              fill
              sizes="340px"
              className="zoom-media object-contain"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <Reticle size={14} inset={12} />
            <span className="relative flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-300 group-hover:scale-105">
                <Play size={20} fill="currentColor" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-white">{t("play")}</span>
            </span>
          </button>
        )}
      </div>
      <p className="text-xs leading-relaxed text-dim">{t("tiktokNote")}</p>
      <TikTokLink />
    </div>
  );
}

/* ─── Lecteur maison (fichier hébergé sur le site) ─── */

function NativePlayer({ src }: { src: string }) {
  const t = useTranslations("home.edit");
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.6);
  const [progress, setProgress] = useState(0);

  // Lecture automatique, sans le son, seulement si l'utilisateur n'a pas demandé moins d'animations
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {
      // lecture auto refusée par le navigateur : l'utilisateur lancera la vidéo lui-même
    });
  }, []);

  function togglePlay() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  }

  function toggleMute() {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) video.volume = 0.6;
  }

  function changeVolume(v: number) {
    const video = ref.current;
    if (!video) return;
    video.volume = v;
    video.muted = v === 0;
  }

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-2xl bg-black">
      <video
        ref={ref}
        src={src}
        poster={FEATURED_EDIT.poster}
        muted
        loop
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => {
          setMuted(e.currentTarget.muted);
          setVolume(e.currentTarget.volume);
        }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setProgress(v.duration ? v.currentTime / v.duration : 0);
        }}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
      />
      <Reticle size={14} inset={12} />

      {/* Commandes */}
      <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2 rounded-2xl bg-black/55 p-2.5 text-white backdrop-blur-md">
        <div className="h-1 overflow-hidden rounded-full bg-white/20" aria-hidden="true">
          <div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? t("controls.pause") : t("controls.play")}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/15 transition-colors hover:bg-white/25 active:scale-95"
          >
            {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? t("controls.unmute") : t("controls.mute")}
            aria-pressed={!muted}
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/15 active:scale-95"
          >
            <VolumeIcon size={17} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            aria-label={t("controls.volume")}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-[var(--accent)]"
          />
        </div>
      </div>
    </div>
  );
}
