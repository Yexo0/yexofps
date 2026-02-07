// src/components/layout/spotify-player.tsx — Floating Spotify mini player
"use client";

import { useState } from "react";
import { Music, X } from "lucide-react";

const PLAYLIST_ID = "5odglzHq1yCVeGJlCzwvK4";

export function SpotifyPlayer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`spotify-toggle ${open ? "active" : ""}`}
        aria-label="Toggle Spotify player"
      >
        {open ? <X className="w-5 h-5" /> : <Music className="w-5 h-5" />}
      </button>

      {/* Player iframe */}
      <div className={`spotify-player ${open ? "" : "collapsed"}`}>
        <iframe
          src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
          width="320"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ borderRadius: "14px", border: "none" }}
          title="Spotify playlist"
        />
      </div>
    </>
  );
}
