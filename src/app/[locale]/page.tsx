// src/app/[locale]/page.tsx — Dashboard
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { User, Gamepad2, Store, Link as LinkIcon, Crosshair, ArrowLeftRight } from "lucide-react";
import { DashboardReveal } from "@/components/dashboard/dashboard-reveal";

const NAV_ITEMS = [
  { key: "profile", href: "/profil", icon: User, accent: "purple" },
  { key: "ranks", href: "/ranks", icon: Gamepad2, accent: "blue" },
  { key: "shop", href: "/shop", icon: Store, accent: "pink" },
  { key: "tracker", href: "/tracker", icon: Crosshair, accent: "cyan" },
  { key: "convert", href: "/convert", icon: ArrowLeftRight, accent: "green" },
  { key: "links", href: "/liens", icon: LinkIcon, accent: "purple" },
] as const;

const ACCENT_COLORS: Record<string, string> = {
  purple: "rgba(167, 139, 250, 0.12)",
  blue: "rgba(96, 165, 250, 0.12)",
  pink: "rgba(244, 114, 182, 0.12)",
  cyan: "rgba(34, 211, 238, 0.12)",
  green: "rgba(110, 227, 183, 0.12)",
};

const ACCENT_ICON_COLORS: Record<string, string> = {
  purple: "text-purple-400",
  blue: "text-blue-400",
  pink: "text-pink-400",
  cyan: "text-cyan-400",
  green: "text-emerald-400",
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <DashboardReveal>
      <div className="min-h-screen flex flex-col items-center gap-5 px-[18px] pt-[60px] pb-[80px]">
        {/* Avatar */}
        <div className="dashboard-avatar flex flex-col items-center gap-3 mb-2">
          <div className="avatar-ring-animated w-[120px] h-[120px] rounded-full">
            <Image
              src="/images/IMG_4549.png"
              alt="Yexo avatar"
              width={120}
              height={120}
              className="w-full h-full rounded-full object-cover bg-[#111] relative z-[1]"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="gradient-text text-2xl font-extrabold tracking-tight">YEXO</h1>
            <p className="text-white/40 text-xs mt-1">Content Creator &bull; Valorant</p>
          </div>
        </div>

        {/* Nav Cards */}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href as "/profil" | "/ranks" | "/shop" | "/tracker" | "/convert" | "/liens"}
              className="dashboard-card w-[92%] max-w-[560px] no-underline group"
            >
              <div className="glass-panel gradient-border text-center cursor-pointer hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: ACCENT_COLORS[item.accent] }}
                  >
                    <Icon className={`w-4 h-4 ${ACCENT_ICON_COLORS[item.accent]}`} />
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-4 tracking-tight">
                  {t(`${item.key}.title`)}
                </h2>
                <div className="btn-premium h-[44px] w-[min(280px,84%)] mx-auto text-[0.95rem]">
                  {t(`${item.key}.button`)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </DashboardReveal>
  );
}
