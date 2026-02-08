// src/components/layout/chatbot.tsx — Mini chatbot
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  from: "bot" | "user";
  text: string;
}

const KNOWLEDGE = [
  {
    keys: ["bonjour", "salut", "hey", "hello", "hi", "coucou", "yo"],
    reply: "Salut ! Je suis le bot de Yexo. Pose-moi une question sur ses services, ses rangs, son profil ou son setup !",
  },
  {
    keys: ["service", "shop", "montage", "edit", "commande", "commander", "prix", "tarif", "pack"],
    reply: "Yexo propose du montage vidéo : Color Grading AE (20€), Edit Basique (15€), Edit Avancé (25-30€), Pack Complet (40€), Color Vegas (20€), Patch Anti-Compression (20€). Contact via Discord pour le plus rapide !",
  },
  {
    keys: ["rang", "rank", "radiant", "faceit", "apex", "clash", "niveau", "level", "elo"],
    reply: "Rangs atteints : Valorant → Radiant (867 RR, top EU), Faceit CS:GO → Level 10, Apex Legends → Master, Clash Royale → Ultimate Champion.",
  },
  {
    keys: ["setup", "souris", "mouse", "clavier", "keyboard", "tapis", "mousepad"],
    reply: "Setup actuel : Souris ATK Dragonfly A9 Pro, Clavier Iqunix EV63, Tapis Artisan FX Hayate Otsu V2.",
  },
  {
    keys: ["contact", "mail", "email", "discord", "joindre", "contacter"],
    reply: "Pro : baptiste.dauvergne38@gmail.com | Business : yexobusiness@gmail.com | Discord (le plus rapide) : discord.gg/tjAkrNUFAR",
  },
  {
    keys: ["qui", "profil", "yexo", "toi", "présent", "about"],
    reply: "Yexo (Baptiste) — Créateur de contenu Valorant et monteur vidéo. Étudiant en BTS SIO option SISR. Passionné par les réseaux, la cybersécurité et le gaming compétitif.",
  },
  {
    keys: ["partenaire", "partner", "code", "promo", "réduction", "sponsor"],
    reply: "Partenaires : Max Esport (-5% avec le code YEXO) et Iqunix (-10% avec le code YEXOVLR).",
  },
  {
    keys: ["sensi", "sensibilité", "sensitivity", "dpi", "convert", "cm/360"],
    reply: "Yexo joue en 0.35 @ 800 DPI sur Valorant (~33 cm/360). Tu peux utiliser le convertisseur de sensibilité sur le site pour convertir entre jeux !",
  },
  {
    keys: ["tiktok", "instagram", "réseau", "social", "follow", "abonner"],
    reply: "TikTok : @yexofps | Instagram : @yexo0 et @yexofps | Discord : discord.gg/tjAkrNUFAR | Linktree : linktr.ee/yexo0",
  },
  {
    keys: ["bts", "sio", "sisr", "formation", "école", "étud", "pro", "professionnel"],
    reply: "Baptiste est en BTS SIO option SISR — spécialisé réseaux, systèmes et cybersécurité. Il maîtrise VMware, Active Directory, Windows Server, Linux, GLPI, IPFire et plus encore.",
  },
  {
    keys: ["tracker", "match", "stats", "stat", "valorant", "partie"],
    reply: "Le tracker affiche les 10 dernières parties Valorant de Yexo en temps réel : K/D, HS%, Winrate, agents joués. Rafraîchissement auto toutes les 90s !",
  },
  {
    keys: ["merci", "thanks", "thx", "cool", "super", "top", "parfait"],
    reply: "De rien ! N'hésite pas si tu as d'autres questions. 😄",
  },
];

const DEFAULT_REPLY = "Je ne suis pas sûr de comprendre. Essaie de me demander : ses services, ses rangs, son setup, comment le contacter, ou son profil !";
const GREETING: Message = { from: "bot", text: "Hey ! Je suis le bot de Yexo. Qu'est-ce que tu veux savoir ?" };

function findReply(input: string): string {
  const lower = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const entry of KNOWLEDGE) {
    if (entry.keys.some((k) => lower.includes(k))) return entry.reply;
  }
  return DEFAULT_REPLY;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg: Message = { from: "user", text };
    const botMsg: Message = { from: "bot", text: findReply(text) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  }

  return (
    <>
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="chatbot-toggle"
        aria-label="Chat"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-bold text-white">Yexo Bot</span>
            </div>
            <span className="text-[10px] text-white/40">En ligne</span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            className="chatbot-input"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pose ta question..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
            />
            <button type="submit" className="text-white/50 hover:text-white transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
