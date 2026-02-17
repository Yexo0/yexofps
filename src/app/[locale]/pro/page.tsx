// src/app/[locale]/pro/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { BackButton } from "@/components/layout/back-button";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NetworkDiagram } from "@/components/pro/network-diagram";
import { SOCIAL_LINKS, EMAILS } from "@/lib/constants";
import {
  GraduationCap,
  User,
  Briefcase,
  Network,
  Eye,
  BookOpen,
  Mail,
  Home,
  Server,
  Shield,
  Headphones,
  MonitorSmartphone,
  Clipboard,
  MessageSquare,
  Wrench,
  Router,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Crosshair,
  Download,
  Code,
  Heart,
  Gamepad2,
  Terminal,
} from "lucide-react";
import { useState } from "react";

const TAB_KEYS = [
  "overview",
  "formation",
  "profile",
  "skills",
  "infra",
  "watch",
  "tutorials",
  "contact",
] as const;

const TAB_ICONS: Record<string, React.ElementType> = {
  overview: Home,
  formation: GraduationCap,
  profile: User,
  skills: Briefcase,
  infra: Network,
  watch: Eye,
  tutorials: BookOpen,
  contact: Mail,
};

export default function ProPage() {
  const t = useTranslations("pro");

  return (
    <>
      <BackButton />
      <div className="min-h-screen flex flex-col items-center px-[18px] pt-[72px] pb-[100px]">
        <div className="w-full max-w-[860px]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="gradient-text text-[1.8rem] font-extrabold tracking-tight">
              {t("name")}
            </h1>
            <p className="text-white/40 text-sm mt-1">{t("tagline")}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <div className="overflow-x-auto pb-2 -mx-[18px] px-[18px]">
              <TabsList className="pro-tabs-list bg-transparent w-full justify-start gap-1 flex-nowrap">
                {TAB_KEYS.map((key) => {
                  const Icon = TAB_ICONS[key];
                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="pro-tab-trigger"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t(`tabs.${key}`)}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="mt-6">
              <TabsContent value="overview">
                <OverviewTab />
              </TabsContent>
              <TabsContent value="formation">
                <FormationTab />
              </TabsContent>
              <TabsContent value="profile">
                <ProfileTab />
              </TabsContent>
              <TabsContent value="skills">
                <SkillsTab />
              </TabsContent>
              <TabsContent value="infra">
                <InfraTab />
              </TabsContent>
              <TabsContent value="watch">
                <WatchTab />
              </TabsContent>
              <TabsContent value="tutorials">
                <TutorialsTab />
              </TabsContent>
              <TabsContent value="contact">
                <ContactTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <Footer />
      </div>
    </>
  );
}

/* ===================== OVERVIEW TAB ===================== */
function OverviewTab() {
  const t = useTranslations("pro.overview");

  const cards = [
    { key: "formation", icon: GraduationCap, accent: "purple" },
    { key: "experience", icon: Briefcase, accent: "blue" },
    { key: "skills", icon: Server, accent: "cyan" },
    { key: "passions", icon: MonitorSmartphone, accent: "pink" },
  ];

  const ACCENT_COLORS: Record<string, string> = {
    purple: "rgba(167, 139, 250, 0.12)",
    blue: "rgba(96, 165, 250, 0.12)",
    cyan: "rgba(34, 211, 238, 0.12)",
    pink: "rgba(244, 114, 182, 0.12)",
  };

  const ACCENT_TEXT_COLORS: Record<string, string> = {
    purple: "text-purple-400",
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    pink: "text-pink-400",
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel !p-6">
        <h2 className="gradient-text text-xl font-bold mb-2">{t("title")}</h2>
        <p className="text-white/50 text-sm leading-relaxed">{t("intro")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map(({ key, icon: Icon, accent }) => (
          <div key={key} className="stat-card-premium flex items-start gap-4">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: ACCENT_COLORS[accent] }}
            >
              <Icon className={`w-[18px] h-[18px] ${ACCENT_TEXT_COLORS[accent]}`} />
            </span>
            <p className="text-white/60 text-sm leading-relaxed">
              {t(`cards.${key}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== FORMATION TAB ===================== */
function FormationTab() {
  const t = useTranslations("pro.formation");

  const modules = [
    { key: "sysadmin", icon: Server },
    { key: "network", icon: Network },
    { key: "support", icon: Headphones },
    { key: "security", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel !p-6">
        <h2 className="gradient-text text-xl font-bold mb-3">{t("title")}</h2>
        <p className="text-white/50 text-sm leading-relaxed">{t("whatIs")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {modules.map(({ key, icon: Icon }) => (
          <div key={key} className="stat-card-premium">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-4 h-4 text-purple-400" />
              <h3 className="text-white font-semibold text-sm">
                {t(`modules.${key}.title`)}
              </h3>
            </div>
            <p className="text-white/45 text-xs leading-relaxed">
              {t(`modules.${key}.desc`)}
            </p>
          </div>
        ))}
      </div>

      {/* Why SISR */}
      <div className="glass-panel !p-6">
        <h3 className="text-white font-bold text-base mb-2">{t("whySisr")}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{t("whySisrText")}</p>
      </div>

      {/* Education Path */}
      <div className="glass-panel !p-6">
        <h3 className="gradient-text font-bold text-base mb-4">{t("education.title")}</h3>
        <div className="space-y-3">
          {(["bts", "but", "bac"] as const).map((key, i) => (
            <div
              key={key}
              className="flex items-center gap-3 text-sm"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? "bg-purple-400" : i === 1 ? "bg-blue-400" : "bg-white/20"}`} />
              <span className={i === 0 ? "text-white font-medium" : "text-white/50"}>
                {t(`education.${key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================== PROFILE TAB ===================== */

const SKILL_CATEGORIES = [
  { key: "admin", icon: Server, accent: "blue" },
  { key: "support", icon: Headphones, accent: "pink" },
  { key: "dev", icon: Code, accent: "cyan" },
  { key: "soft", icon: Heart, accent: "green" },
] as const;

const SKILL_ACCENT_BG: Record<string, string> = {
  blue: "rgba(96, 165, 250, 0.10)",
  pink: "rgba(244, 114, 182, 0.10)",
  cyan: "rgba(34, 211, 238, 0.10)",
  green: "rgba(110, 227, 183, 0.10)",
};

const SKILL_ACCENT_TEXT: Record<string, string> = {
  blue: "text-blue-400",
  pink: "text-pink-400",
  cyan: "text-cyan-400",
  green: "text-emerald-400",
};

const SKILL_HOVER_BORDER: Record<string, string> = {
  blue: "hover:border-blue-400/25 hover:shadow-[0_0_25px_rgba(96,165,250,0.08)]",
  pink: "hover:border-pink-400/25 hover:shadow-[0_0_25px_rgba(244,114,182,0.08)]",
  cyan: "hover:border-cyan-400/25 hover:shadow-[0_0_25px_rgba(34,211,238,0.08)]",
  green: "hover:border-emerald-400/25 hover:shadow-[0_0_25px_rgba(110,227,183,0.08)]",
};

const INTEREST_CARDS = [
  { key: "content", icon: Gamepad2, accent: "pink" },
  { key: "watch", icon: Eye, accent: "cyan" },
  { key: "projects", icon: Terminal, accent: "purple" },
] as const;

const INTEREST_ACCENT_BG: Record<string, string> = {
  pink: "rgba(244, 114, 182, 0.10)",
  cyan: "rgba(34, 211, 238, 0.10)",
  purple: "rgba(167, 139, 250, 0.10)",
};

const INTEREST_ACCENT_TEXT: Record<string, string> = {
  pink: "text-pink-400",
  cyan: "text-cyan-400",
  purple: "text-purple-400",
};

function ProfileTab() {
  const t = useTranslations("pro.profileTab");

  return (
    <div className="space-y-8">
      {/* ── Section 1: À propos ── */}
      <div className="glass-panel !p-6 sm:!p-8">
        <h2 className="gradient-text text-xl font-bold mb-1">{t("about.title")}</h2>
        <div className="mt-1.5 h-[2px] w-12 bg-gradient-to-r from-purple-500/50 to-transparent rounded-full mb-5" />
        <p className="text-white/55 text-sm leading-relaxed mb-4">{t("about.p1")}</p>
        <p className="text-white/55 text-sm leading-relaxed">{t("about.p2")}</p>
      </div>

      {/* ── Section 2: Compétences ── */}
      <div>
        <h2 className="gradient-text text-xl font-bold mb-5">{t("competences.title")}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SKILL_CATEGORIES.map(({ key, icon: Icon, accent }) => {
            const itemCount = key === "soft" ? 5 : 4;
            return (
              <div
                key={key}
                className={`glass-panel !p-6 border border-transparent transition-all duration-300 hover:-translate-y-1 ${SKILL_HOVER_BORDER[accent]}`}
              >
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: SKILL_ACCENT_BG[accent] }}
                >
                  <Icon className={`w-6 h-6 ${SKILL_ACCENT_TEXT[accent]}`} />
                </span>
                <h3 className="text-white font-bold text-[0.95rem] mb-3">
                  {t(`competences.categories.${key}.title`)}
                </h3>
                <div className="space-y-2">
                  {Array.from({ length: itemCount }, (_, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${SKILL_ACCENT_TEXT[accent]}`} />
                      <span className="text-white/50 text-sm leading-relaxed">
                        {t(`competences.categories.${key}.items.${i}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-5 justify-center">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-white/60 bg-white/[0.04] border border-white/[0.08] transition-colors hover:border-white/[0.15] hover:text-white/75"
            >
              {t(`competences.badges.${i}`)}
            </span>
          ))}
        </div>
      </div>

      {/* ── Section 3: Formation & Parcours ── */}
      <div>
        <h2 className="gradient-text text-xl font-bold mb-5">{t("formation.title")}</h2>

        <div className="relative pl-6 border-l-2 border-white/10 space-y-8">
          {/* BTS */}
          <div className="relative">
            <span className="absolute -left-[calc(1.5rem+5px)] top-1 w-3 h-3 rounded-full bg-purple-400 ring-4 ring-[#0d0d12]" />
            <div className="glass-panel !p-5">
              <h3 className="text-white font-bold text-[0.95rem]">{t("formation.bts.title")}</h3>
              <p className="text-white/35 text-xs mt-0.5">{t("formation.bts.location")} — {t("formation.bts.period")}</p>
              <div className="space-y-2 mt-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-white/50">{t(`formation.bts.items.${i}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stage */}
          <div className="relative">
            <span className="absolute -left-[calc(1.5rem+5px)] top-1 w-3 h-3 rounded-full bg-blue-400 ring-4 ring-[#0d0d12]" />
            <div className="glass-panel !p-5">
              <h3 className="text-white font-bold text-[0.95rem]">{t("formation.stage.title")}</h3>
              <p className="text-white/35 text-xs mt-0.5">{t("formation.stage.location")} — {t("formation.stage.period")}</p>
              <div className="space-y-2 mt-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-white/50">{t(`formation.stage.items.${i}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 4: Centres d'intérêt ── */}
      <div>
        <h2 className="gradient-text text-xl font-bold mb-5">{t("interests.title")}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {INTEREST_CARDS.map(({ key, icon: Icon, accent }) => (
            <div key={key} className="stat-card-premium !p-5 transition-all duration-300 hover:-translate-y-1">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: INTEREST_ACCENT_BG[accent] }}
              >
                <Icon className={`w-5 h-5 ${INTEREST_ACCENT_TEXT[accent]}`} />
              </span>
              <h3 className="text-white font-semibold text-sm mb-1.5">
                {t(`interests.cards.${key}.title`)}
              </h3>
              <p className="text-white/45 text-xs leading-relaxed">
                {t(`interests.cards.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================== SKILLS TAB ===================== */
function SkillsTab() {
  const t = useTranslations("pro.skills");
  const tLabels = useTranslations("pro.skills.labels");
  const [openMission, setOpenMission] = useState<string | null>(null);

  const missions = [
    { key: "gestion", icon: Clipboard, accent: "blue" },
    { key: "communication", icon: MessageSquare, accent: "pink" },
    { key: "support", icon: Wrench, accent: "purple" },
    { key: "projet", icon: Router, accent: "cyan" },
    { key: "assistance", icon: HelpCircle, accent: "green" },
  ] as const;

  const ACCENT_BG: Record<string, string> = {
    blue: "rgba(96, 165, 250, 0.10)",
    pink: "rgba(244, 114, 182, 0.10)",
    purple: "rgba(167, 139, 250, 0.10)",
    cyan: "rgba(34, 211, 238, 0.10)",
    green: "rgba(110, 227, 183, 0.10)",
  };

  const ACCENT_TEXT: Record<string, string> = {
    blue: "text-blue-400",
    pink: "text-pink-400",
    purple: "text-purple-400",
    cyan: "text-cyan-400",
    green: "text-emerald-400",
  };

  const ACCENT_BORDER: Record<string, string> = {
    blue: "rgba(96, 165, 250, 0.15)",
    pink: "rgba(244, 114, 182, 0.15)",
    purple: "rgba(167, 139, 250, 0.15)",
    cyan: "rgba(34, 211, 238, 0.15)",
    green: "rgba(110, 227, 183, 0.15)",
  };

  return (
    <div className="space-y-5">
      <div className="glass-panel !p-6">
        <h2 className="gradient-text text-xl font-bold mb-1">{t("title")}</h2>
        <p className="text-white/40 text-sm">{t("subtitle")}</p>
      </div>

      {/* Navigation buttons — large visible pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {missions.map(({ key, icon: Icon, accent }) => {
          const isActive = openMission === key;
          return (
            <button
              key={key}
              onClick={() => setOpenMission(isActive ? null : key)}
              className={`skill-nav-btn flex items-center gap-3.5 px-5 py-4 rounded-2xl text-left font-semibold transition-all duration-300 border cursor-pointer ${
                isActive
                  ? `${ACCENT_TEXT[accent]} border-current bg-white/[0.06] shadow-lg`
                  : "text-white/50 border-white/[0.07] bg-white/[0.025] hover:text-white/75 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-md"
              }`}
              style={isActive ? { boxShadow: `0 0 25px ${ACCENT_BORDER[accent]}` } : undefined}
            >
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive ? "" : "opacity-60"
                }`}
                style={{ background: ACCENT_BG[accent] }}
              >
                <Icon className={`w-5 h-5 ${ACCENT_TEXT[accent]}`} />
              </span>
              <div className="min-w-0">
                <span className="block text-sm font-bold leading-tight truncate">
                  {t(`missions.${key}.subtitle`)}
                </span>
                <span className="block text-[0.65rem] text-white/25 mt-0.5 font-normal leading-tight truncate">
                  {t(`missions.${key}.title`)}
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ml-auto shrink-0 transition-transform duration-300 ${isActive ? "rotate-90" : ""} ${isActive ? ACCENT_TEXT[accent] : "text-white/20"}`} />
            </button>
          );
        })}
      </div>

      {/* Mission detail panels */}
      {missions.map(({ key, icon: Icon, accent }) => {
        const isOpen = openMission === key;
        if (!isOpen) return null;

        const actionCount = key === "assistance" ? 4 : 5;

        return (
          <div
            key={key}
            className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300"
          >
            {/* Header */}
            <div className="glass-panel !p-6" style={{ borderColor: ACCENT_BORDER[accent] }}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: ACCENT_BG[accent] }}
                >
                  <Icon className={`w-5 h-5 ${ACCENT_TEXT[accent]}`} />
                </span>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {t(`missions.${key}.title`)}
                  </h3>
                  <span className="text-white/30 text-xs uppercase tracking-widest font-medium">
                    {t(`missions.${key}.subtitle`)}
                  </span>
                </div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">
                {t(`missions.${key}.intro`)}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-1 rounded-full text-[0.7rem] font-medium border border-white/[0.06] ${ACCENT_TEXT[accent]}`}
                    style={{ background: ACCENT_BG[accent] }}
                  >
                    {t(`missions.${key}.tags.${i}`)}
                  </span>
                ))}
              </div>
            </div>

            {/* Mission */}
            <div className="stat-card-premium !p-5">
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-2 ${ACCENT_TEXT[accent]}`}>
                {t(`missions.${key}.missionLabel`)}
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                {t(`missions.${key}.mission`)}
              </p>
            </div>

            {/* Context / Objective / Role cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["context", "objective", "role"] as const).map((field) => {
                const icons: Record<string, React.ElementType> = {
                  context: Eye,
                  objective: Crosshair,
                  role: User,
                };
                const FieldIcon = icons[field];
                return (
                  <div key={field} className="stat-card-premium !p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FieldIcon className="w-3.5 h-3.5 text-white/30" />
                      <h5 className="text-white/50 text-[0.7rem] font-bold uppercase tracking-widest">
                        {tLabels(field)}
                      </h5>
                    </div>
                    <p className="text-white/55 text-xs leading-relaxed">
                      {t(`missions.${key}.${field}`)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Actions list */}
            <div className="glass-panel !p-5">
              <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Clipboard className="w-4 h-4 text-white/40" />
                {tLabels("actions")}
              </h4>
              <div className="space-y-2.5">
                {Array.from({ length: actionCount }, (_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[0.6rem] font-bold ${ACCENT_TEXT[accent]}`}
                      style={{ background: ACCENT_BG[accent] }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-white/55 text-sm leading-relaxed">
                      {t(`missions.${key}.actions.${i}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Proof section */}
            <div className="glass-panel !p-5" style={{ borderColor: ACCENT_BORDER[accent] }}>
              <h4 className={`font-bold text-sm mb-3 flex items-center gap-2 ${ACCENT_TEXT[accent]}`}>
                <Shield className="w-4 h-4" />
                {t(`missions.${key}.proofTitle`)}
              </h4>
              <p className="text-white/55 text-sm leading-relaxed mb-5">
                {t(`missions.${key}.proofText`)}
              </p>

              {/* Impact sub-sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([1, 2] as const).map((n) => (
                  <div key={n} className="stat-card-premium !p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronRight className={`w-3.5 h-3.5 ${ACCENT_TEXT[accent]}`} />
                      <h5 className="text-white font-semibold text-xs">
                        {t(`missions.${key}.impactTitle${n}`)}
                      </h5>
                    </div>
                    <p className="text-white/45 text-xs leading-relaxed">
                      {t(`missions.${key}.impactText${n}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===================== INFRA TAB ===================== */
function InfraTab() {
  const t = useTranslations("pro.infra");

  return (
    <div className="space-y-6">
      <div className="glass-panel !p-6">
        <h2 className="gradient-text text-xl font-bold mb-2">{t("title")}</h2>
        <p className="text-white/45 text-sm leading-relaxed">{t("subtitle")}</p>
      </div>

      <NetworkDiagram />
    </div>
  );
}

/* ===================== WATCH TAB ===================== */
function WatchTab() {
  const t = useTranslations("pro.watch");

  return (
    <div className="space-y-6">
      <div className="glass-panel !p-6">
        <h2 className="gradient-text text-xl font-bold mb-1">{t("title")}</h2>
        <p className="text-white/40 text-xs uppercase tracking-widest font-medium">{t("topic")}</p>
      </div>

      {/* Before */}
      <div className="stat-card-premium">
        <h3 className="text-white font-bold text-sm mb-2">{t("sections.before.title")}</h3>
        <p className="text-white/50 text-xs leading-relaxed">{t("sections.before.text")}</p>
      </div>

      {/* VMware */}
      <div className="glass-panel !p-6">
        <h3 className="text-white font-bold text-base mb-2">{t("sections.vmware.title")}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4">{t("sections.vmware.text")}</p>
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span className="text-white/55">{t(`sections.vmware.benefits.${i}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today */}
      <div className="glass-panel !p-6">
        <h3 className="text-white font-bold text-base mb-2">{t("sections.today.title")}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4">{t("sections.today.text")}</p>
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span className="text-white/55">{t(`sections.today.features.${i}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why */}
      <div className="glass-panel !p-6">
        <h3 className="text-white font-bold text-base mb-3">{t("sections.why.title")}</h3>
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-white/55">{t(`sections.why.points.${i}`)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-white/25 text-xs text-center italic">{t("sources")}</p>
    </div>
  );
}

/* ===================== TUTORIALS TAB ===================== */
function TutorialsTab() {
  const t = useTranslations("pro.tutorials");

  const tutorials = [
    { key: "zabbix", icon: Eye, cat: "monitoring", pdf: "/docs/tuto-zabbix.pdf" },
    { key: "vlan", icon: Network, cat: "virtualization", pdf: "/docs/tuto-vlan.pdf" },
    { key: "gpo", icon: Shield, cat: "system", pdf: "/docs/tuto-gpo.pdf" },
    { key: "ad", icon: Server, cat: "system", pdf: "/docs/tuto-ad.pdf" },
    { key: "wifi", icon: Router, cat: "network", pdf: "/docs/tuto-wifi.pdf" },
    { key: "glpi", icon: Clipboard, cat: "itsm", pdf: "/docs/tuto-glpi.pdf" },
    { key: "ipfire", icon: Shield, cat: "security", pdf: "/docs/tuto-ipfire.pdf" },
    { key: "proxmox", icon: Server, cat: "virtualization", pdf: "/docs/tuto-proxmox.pdf" },
    { key: "esxi", icon: User, cat: "virtualization", pdf: "/docs/tuto-esxi.pdf" },
    { key: "dhcpdns", icon: Server, cat: "network", pdf: "/docs/tuto-dhcpdns.pdf" },
  ];

  const CAT_COLORS: Record<string, string> = {
    monitoring: "text-amber-400 bg-amber-400/10",
    virtualization: "text-purple-400 bg-purple-400/10",
    system: "text-blue-400 bg-blue-400/10",
    network: "text-cyan-400 bg-cyan-400/10",
    itsm: "text-pink-400 bg-pink-400/10",
    security: "text-emerald-400 bg-emerald-400/10",
  };

  const CAT_HOVER: Record<string, string> = {
    monitoring: "hover:border-amber-400/30 hover:shadow-[0_0_20px_rgba(251,191,36,0.08)]",
    virtualization: "hover:border-purple-400/30 hover:shadow-[0_0_20px_rgba(167,139,250,0.08)]",
    system: "hover:border-blue-400/30 hover:shadow-[0_0_20px_rgba(96,165,250,0.08)]",
    network: "hover:border-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]",
    itsm: "hover:border-pink-400/30 hover:shadow-[0_0_20px_rgba(244,114,182,0.08)]",
    security: "hover:border-emerald-400/30 hover:shadow-[0_0_20px_rgba(110,227,183,0.08)]",
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel !p-6">
        <h2 className="gradient-text text-xl font-bold mb-1">{t("title")}</h2>
        <p className="text-white/45 text-sm">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tutorials.map(({ key, icon: Icon, cat, pdf }) => (
          <a
            key={key}
            href={pdf}
            download
            className={`stat-card-premium block no-underline cursor-pointer transition-all duration-300 hover:scale-[1.02] border border-transparent ${CAT_HOVER[cat]}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
                  {t(`items.${key}.desc`)}
                </p>
                <span
                  className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[0.65rem] font-medium ${CAT_COLORS[cat]}`}
                >
                  {t(`categories.${cat}`)}
                </span>
              </div>
              <Download className="w-4 h-4 text-white/20 shrink-0 mt-0.5 transition-colors duration-300 group-hover:text-white/50" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ===================== CONTACT TAB ===================== */
function ContactTab() {
  const t = useTranslations("pro.contactTab");
  const [copied, setCopied] = useState<string | null>(null);

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel !p-6">
        <h2 className="gradient-text text-xl font-bold mb-2">{t("title")}</h2>
        <p className="text-white/50 text-sm leading-relaxed">{t("intro")}</p>
      </div>

      <div className="space-y-3">
        {/* Email Pro */}
        <div className="stat-card-premium">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-4 h-4 text-purple-400" />
            <h3 className="text-white font-semibold text-sm">{t("emailPro")}</h3>
          </div>
          <p className="text-white/50 text-xs mb-3">{EMAILS.pro}</p>
          <div className="flex gap-2">
            <a
              href={`mailto:${EMAILS.pro}?subject=Contact%20Portfolio%20-%20Yexo`}
              className="btn-ghost-premium !text-xs !py-1.5 !px-4"
            >
              <Mail className="w-3 h-3" />
              {t("send")}
            </a>
            <button
              onClick={() => copyText(EMAILS.pro, "pro")}
              className="btn-ghost-premium !text-xs !py-1.5 !px-4"
            >
              {copied === "pro" ? (
                <><Check className="w-3 h-3" />{t("copied")}</>
              ) : (
                <><Copy className="w-3 h-3" />{t("copy")}</>
              )}
            </button>
          </div>
        </div>

        {/* Email Business */}
        <div className="stat-card-premium">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-semibold text-sm">{t("emailBusiness")}</h3>
          </div>
          <p className="text-white/50 text-xs mb-3">{EMAILS.business}</p>
          <div className="flex gap-2">
            <a
              href={`mailto:${EMAILS.business}?subject=Demande%20Business%20-%20Yexo`}
              className="btn-ghost-premium !text-xs !py-1.5 !px-4"
            >
              <Mail className="w-3 h-3" />
              {t("send")}
            </a>
            <button
              onClick={() => copyText(EMAILS.business, "biz")}
              className="btn-ghost-premium !text-xs !py-1.5 !px-4"
            >
              {copied === "biz" ? (
                <><Check className="w-3 h-3" />{t("copied")}</>
              ) : (
                <><Copy className="w-3 h-3" />{t("copy")}</>
              )}
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="stat-card-premium">
          <h3 className="text-white font-semibold text-sm mb-3">{t("links")}</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Discord", url: SOCIAL_LINKS.discord },
              { label: "Discord Edits", url: SOCIAL_LINKS.discordEdits },
              { label: "TikTok", url: SOCIAL_LINKS.tiktok },
              { label: "Instagram", url: SOCIAL_LINKS.instagram },
              { label: "Linktree", url: SOCIAL_LINKS.linktree },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-premium !text-xs !py-1.5 !px-4"
              >
                <ExternalLink className="w-3 h-3" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
