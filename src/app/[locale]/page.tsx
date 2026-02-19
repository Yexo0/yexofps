// src/app/[locale]/page.tsx — Dashboard
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { User, Gamepad2, Store, Link as LinkIcon, Crosshair, ArrowLeftRight, Briefcase } from "lucide-react";
import { DashboardReveal } from "@/components/dashboard/dashboard-reveal";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"] });

const NAV_ITEMS = [
  { key: "profile", href: "/profil", icon: User, accent: "purple" },
  { key: "ranks", href: "/ranks", icon: Gamepad2, accent: "blue" },
  { key: "shop", href: "/shop", icon: Store, accent: "pink" },
  { key: "tracker", href: "/tracker", icon: Crosshair, accent: "cyan" },
  { key: "convert", href: "/convert", icon: ArrowLeftRight, accent: "green" },
  { key: "links", href: "/liens", icon: LinkIcon, accent: "purple" },
] as const;

const PRO_ITEM = { key: "pro", href: "/pro", icon: Briefcase, accent: "amber" } as const;

const ACCENT_BG: Record<string, string> = {
  purple: "rgba(167, 139, 250, 0.10)",
  blue: "rgba(96, 165, 250, 0.10)",
  pink: "rgba(244, 114, 182, 0.10)",
  cyan: "rgba(34, 211, 238, 0.10)",
  green: "rgba(110, 227, 183, 0.10)",
  amber: "rgba(251, 191, 36, 0.10)",
};

const ACCENT_GLOW: Record<string, string> = {
  purple: "0 0 25px rgba(167, 139, 250, 0.12), 0 0 60px rgba(167, 139, 250, 0.05)",
  blue: "0 0 25px rgba(96, 165, 250, 0.12), 0 0 60px rgba(96, 165, 250, 0.05)",
  pink: "0 0 25px rgba(244, 114, 182, 0.12), 0 0 60px rgba(244, 114, 182, 0.05)",
  cyan: "0 0 25px rgba(34, 211, 238, 0.12), 0 0 60px rgba(34, 211, 238, 0.05)",
  green: "0 0 25px rgba(110, 227, 183, 0.12), 0 0 60px rgba(110, 227, 183, 0.05)",
  amber: "0 0 25px rgba(251, 191, 36, 0.12), 0 0 60px rgba(251, 191, 36, 0.05)",
};

const ACCENT_BORDER: Record<string, string> = {
  purple: "rgba(167, 139, 250, 0.25)",
  blue: "rgba(96, 165, 250, 0.25)",
  pink: "rgba(244, 114, 182, 0.25)",
  cyan: "rgba(34, 211, 238, 0.25)",
  green: "rgba(110, 227, 183, 0.25)",
  amber: "rgba(251, 191, 36, 0.25)",
};

const ACCENT_TEXT: Record<string, string> = {
  purple: "text-purple-400",
  blue: "text-blue-400",
  pink: "text-pink-400",
  cyan: "text-cyan-400",
  green: "text-emerald-400",
  amber: "text-amber-400",
};

function DashCard({
  href,
  accent,
  icon: Icon,
  title,
  label,
}: {
  href: string;
  accent: string;
  icon: React.ElementType;
  title: string;
  label: string;
}) {
  return (
    <Link
      href={href as "/profil"}
      className="dashboard-card no-underline group"
    >
      <div
        className="glass-panel gradient-border !p-7 sm:!p-8 cursor-pointer hover:scale-[1.025] transition-all duration-300 flex flex-col items-center text-center gap-4"
        style={{
          "--card-glow": ACCENT_GLOW[accent],
          "--card-border": ACCENT_BORDER[accent],
        } as React.CSSProperties}
      >
        <span
          className="dash-icon w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300"
          style={{ background: ACCENT_BG[accent] }}
        >
          <Icon className={`w-6 h-6 ${ACCENT_TEXT[accent]}`} />
        </span>
        <h2 className="text-[1.2rem] sm:text-[1.3rem] font-bold text-white leading-tight">
          {title}
        </h2>
        <span className="text-[0.75rem] text-white/30 font-medium uppercase tracking-widest">
          {label}
        </span>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <DashboardReveal>
      <div className="min-h-screen flex flex-col items-center px-5 sm:px-6 pt-[56px] pb-[100px]">
        {/* Avatar + Identity */}
        <div className="dashboard-avatar flex flex-col items-center gap-3 mb-10">
          <div className="avatar-wrapper w-[120px] h-[120px]">
            <Image
              src="/images/IMG_4549.png"
              alt="Yexo avatar"
              width={120}
              height={120}
              className="w-full h-full object-cover bg-[#111]"
              priority
            />
          </div>
          <div className="text-center">
            <h1
              className={`${orbitron.className} hero-title text-[2rem] sm:text-[2.3rem] font-black tracking-[0.08em]`}
            >
              YEXO
            </h1>
            <p className="text-white/40 text-[0.7rem] sm:text-xs mt-1.5 font-medium uppercase tracking-[0.25em]">
              Content Creator &bull; Valorant
            </p>
          </div>
        </div>

        {/* Nav Grid — larger cards */}
        <div className="w-full max-w-[780px] grid grid-cols-2 gap-4 sm:gap-5">
          {NAV_ITEMS.map((item) => (
            <DashCard
              key={item.key}
              href={item.href}
              accent={item.accent}
              icon={item.icon}
              title={t(`${item.key}.title`)}
              label={t(`${item.key}.button`)}
            />
          ))}
        </div>

        {/* Pro Card — centered below */}
        <div className="w-full max-w-[780px] flex justify-center mt-4 sm:mt-5">
          <div className="w-full max-w-[calc(50%-10px)]">
            <DashCard
              href={PRO_ITEM.href}
              accent={PRO_ITEM.accent}
              icon={PRO_ITEM.icon}
              title={t(`${PRO_ITEM.key}.title`)}
              label={t(`${PRO_ITEM.key}.button`)}
            />
          </div>
        </div>
      </div>
    </DashboardReveal>
  );
}
