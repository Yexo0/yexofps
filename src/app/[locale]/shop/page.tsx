// src/app/[locale]/shop/page.tsx — Shop
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { BackButton } from "@/components/layout/back-button";
import { GlassPanel } from "@/components/shared/glass-panel";
import { Link } from "@/i18n/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PRODUCTS, REVIEWS, TRUST_STATS, SOCIAL_LINKS, type TrustStat } from "@/lib/constants";
import { Star, Users, Clock, MessageSquare, Mail, ExternalLink, Zap } from "lucide-react";
import { DiscordIcon } from "@/components/icons/discord";
import { Orbitron } from "next/font/google";
import type { CSSProperties } from "react";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"] });
type DelayStyle = CSSProperties & { "--pr-delay": string };
const d = (ms: number): DelayStyle => ({ "--pr-delay": `${ms}ms` });

export default function ShopPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("shop") as any;
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  return (
    <>
      <BackButton />
      <main className="relative z-[2] flex flex-col items-center gap-8 px-[18px] pt-[52px] pb-10 max-w-[1120px] mx-auto">

        {/* ══════════ HERO ══════════ */}
        <section className="shop-hero w-full text-center flex flex-col items-center gap-5 pt-8 pb-6 relative">
          {/* Ambient glows */}
          <div className="shop-hero-glow" />
          <div className="shop-hero-glow shop-hero-glow--2" />

          {/* Live badge */}
          <div className="pr-item" style={d(0)}>
            <span className="shop-live-badge">
              <span className="shop-live-dot" />
              {t("liveBadge")}
            </span>
          </div>

          {/* Title */}
          <div className="pr-item flex flex-col items-center gap-3" style={d(100)}>
            <h1 className={`${orbitron.className} hero-title text-[2.4rem] sm:text-[3.2rem] font-black tracking-[0.06em] leading-none`}>
              Y-SERVICES
            </h1>
            <p className="text-white/45 text-sm max-w-[480px] leading-relaxed">
              {t("subtitlePart1")}{" "}
              <span className="text-white font-semibold">{t("subtitleContact")}</span>{" "}
              {t("subtitleOr")}{" "}
              <span className="text-white font-semibold">{t("subtitleDiscord")}</span>
            </p>
          </div>

          {/* Service tags */}
          <div className="pr-item flex flex-wrap gap-2 justify-center" style={d(200)}>
            <span className="profile-tag profile-tag--pink">{t("tagAe")}</span>
            <span className="profile-tag profile-tag--blue">{t("tagVegas")}</span>
            <span className="profile-tag profile-tag--purple">{t("tagDelivery")}</span>
          </div>

          {/* CTA buttons */}
          <div className="pr-item flex flex-wrap gap-3 justify-center" style={d(300)}>
            <Link href="/liens" className="shop-cta-primary">
              <MessageSquare className="w-4 h-4" />
              {t("contactCta")}
            </Link>
            <a href={SOCIAL_LINKS.payhip} target="_blank" rel="noopener noreferrer"
              className="shop-cta-secondary">
              <Zap className="w-4 h-4" />
              {t("payhipCta")}
            </a>
          </div>

          {/* Status bar */}
          <div className="pr-item flex flex-wrap items-center justify-center gap-0" style={d(400)}>
            <div className="shop-status-item">
              <span className="shop-status-dot bg-emerald-400" />
              <strong className="text-white/70 text-[0.72rem]">{t("noticeDiscord")}</strong>
            </div>
            <div className="shop-status-sep" />
            <div className="shop-status-item">
              <span className="shop-status-dot bg-orange-400" />
              <span className="text-white/45 text-[0.72rem]">{t("noticePrices")}</span>
            </div>
            <div className="shop-status-sep" />
            <div className="shop-status-item">
              <span className="shop-status-dot bg-purple-400" />
              <span className="text-white/45 text-[0.72rem]">{t("noticeDelivery")}</span>
            </div>
          </div>

          {/* Hero bottom divider */}
          <div className="pr-item w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mt-2" style={d(480)} />
        </section>

        {/* ══════════ PRODUCTS ══════════ */}
        <section className="pr-item w-full" style={d(200)}>
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="shop-section-num font-mono text-xs">01</span>
                <h2 className="gradient-text-warm text-xl font-bold">{t("productsTitle")}</h2>
              </div>
              <div className="mt-1.5 h-[3px] w-20 rounded-full animated-line-warm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map((product, idx) => {
              const titleKey = `products.${product.id}.title` as const;
              const descKey  = `products.${product.id}.desc`  as const;
              return (
                <article
                  key={product.id}
                  className={`shop-product product-card-premium shop-product--${idx} ${product.badge === "bestValue" ? "shop-product--featured" : ""}`}
                  style={{ "--card-idx": idx } as CSSProperties}
                >
                  {/* Image area */}
                  <div className="relative overflow-hidden rounded-t-[inherit]">
                    {product.badge && (
                      <span className={`shop-badge absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        product.badge === "bestValue"
                          ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/25"
                          : "bg-purple-500/15 text-purple-300 border border-purple-500/25"
                      }`}>
                        {t(product.badge)}
                      </span>
                    )}
                    <Image
                      src={product.image}
                      alt={t(titleKey)}
                      width={400}
                      height={220}
                      className={`shop-product-img w-full object-cover ${product.badge === "bestValue" ? "h-[230px]" : "h-[200px]"}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/20 to-transparent pointer-events-none" />
                    <div className="product-tint absolute inset-0 pointer-events-none" />
                  </div>

                  {/* Content */}
                  <div className="product-content p-4 relative overflow-hidden">
                    <span className="product-corner product-corner-tl" />
                    <span className="product-corner product-corner-br" />
                    <span className="product-circle" />

                    {/* Title + price row */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="product-title text-sm font-bold text-white leading-snug flex-1">{t(titleKey)}</h3>
                      <span className="shop-price-inline gradient-text font-black text-base shrink-0">{product.price}</span>
                    </div>

                    <p className="product-desc text-xs text-white/40 mb-3">{t(descKey)}</p>

                    <div className="product-actions flex gap-2">
                      <Link href="/liens" className="product-cta btn-premium !py-1.5 !px-3 !text-xs">
                        {t("buyContact")}
                      </Link>
                      {product.previewSrc && (
                        <button onClick={() => setPreviewSrc(product.previewSrc!)}
                          className="btn-ghost-premium !py-1.5 !px-3 !text-xs">
                          {t("preview")}
                        </button>
                      )}
                      {product.exampleHref && (
                        <a href={product.exampleHref} target="_blank" rel="noopener noreferrer"
                          className="btn-ghost-premium !py-1.5 !px-3 !text-xs">
                          {t("viewExamples")}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ══════════ TRUST : STATS + REVIEWS ══════════ */}
        <section className="pr-item w-full grid grid-cols-1 lg:grid-cols-2 gap-4" style={d(300)}>

          {/* Stats panel */}
          <GlassPanel className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="shop-section-num font-mono text-xs">02</span>
              <h2 className="gradient-text text-xl font-bold">{t("statsTitle")}</h2>
            </div>
            <div className="mt-1 mb-4 h-[3px] w-20 rounded-full animated-line" />
            <p className="text-xs text-white/35 mb-5">{t("statsSub")}</p>
            <div className="flex flex-col gap-3">
              {TRUST_STATS.map((stat, i) => (
                <TrustStatCard key={i} stat={stat} />
              ))}
            </div>
          </GlassPanel>

          {/* Reviews panel */}
          <GlassPanel className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="shop-section-num font-mono text-xs">03</span>
              <h2 className="gradient-text-warm text-xl font-bold">{t("reviewsTitle")}</h2>
            </div>
            <div className="mt-1 mb-4 h-[3px] w-20 rounded-full animated-line-warm" />
            <p className="text-xs text-white/35 mb-4">{t("reviewsSub")}</p>
            <div className="flex flex-col gap-3">
              {REVIEWS.map((review) => {
                const isDiscord = review.platform === "Discord";
                return (
                  <article key={review.key}
                    className={`shop-review-card ${isDiscord ? "review-discord" : "review-tiktok"}`}>
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className={`shrink-0 rounded-full p-0.5 ${isDiscord ? "bg-gradient-to-br from-[#5865f2]/40 to-[#5865f2]/10" : "bg-gradient-to-br from-[#fe2c55]/40 to-[#fe2c55]/10"}`}>
                        <Image src={review.avatar} alt={review.name} width={36} height={36}
                          className="w-9 h-9 rounded-full object-cover block" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong className="text-sm text-white block">{review.name}</strong>
                        <span className={`text-[10px] font-medium ${isDiscord ? "text-[#5865f2]/70" : "text-[#fe2c55]/70"}`}>
                          via {review.platform}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400 review-star"
                            style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-white/55 italic leading-relaxed pl-1 border-l border-white/10">
                      &ldquo;{t(`reviews.${review.key}`)}&rdquo;
                    </p>
                  </article>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.06]">
              <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer"
                className="btn-ghost-premium !text-xs">
                {t("reviewsDiscordCta")}
              </a>
              <a href={SOCIAL_LINKS.payhip} target="_blank" rel="noopener noreferrer"
                className="btn-premium !text-xs">
                {t("payhipBuyCta")}
              </a>
            </div>
          </GlassPanel>
        </section>

        {/* ══════════ CONTACT ══════════ */}
        <section className="pr-item w-full" style={d(400)}>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="shop-section-num font-mono text-xs">04</span>
            <div>
              <h2 className="gradient-text text-xl font-bold">{t("contactTitle")}</h2>
              <div className="mt-1.5 h-[3px] w-20 rounded-full animated-line-blue" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Discord */}
            <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer"
              className="shop-contact-card shop-contact-card--discord group">
              <ExternalLink className="absolute top-4 right-4 w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
              <div className="shop-contact-icon bg-[#5865f2]/10">
                <DiscordIcon className="w-5 h-5 text-[#7289da]" />
              </div>
              <h3 className="text-sm font-bold text-white mt-3 mb-1">{t("discordFastest")}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{t("discordText")}</p>
              <span className="shop-contact-cta">{t("joinDiscord")} →</span>
            </a>

            {/* Email */}
            <a href="mailto:yexobusiness@gmail.com"
              className="shop-contact-card shop-contact-card--pink group">
              <ExternalLink className="absolute top-4 right-4 w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
              <div className="shop-contact-icon bg-pink-500/10">
                <Mail className="w-5 h-5 text-pink-400" />
              </div>
              <h3 className="text-sm font-bold text-white mt-3 mb-1">{t("emailTitle")}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{t("emailText")}</p>
              <span className="shop-contact-cta">yexobusiness@gmail.com →</span>
            </a>

            {/* Payhip */}
            <a href={SOCIAL_LINKS.payhip} target="_blank" rel="noopener noreferrer"
              className="shop-contact-card shop-contact-card--purple group">
              <ExternalLink className="absolute top-4 right-4 w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
              <div className="shop-contact-icon bg-purple-500/10">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-white mt-3 mb-1">{t("payhipTitle")}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{t("payhipText")}</p>
              <span className="shop-contact-cta">{t("payhipOpen")} →</span>
            </a>
          </div>

          <p className="text-xs text-white/35 text-center mt-5 max-w-sm mx-auto">{t("contactTip")}</p>
        </section>

      </main>

      {/* Preview modal */}
      <Dialog open={!!previewSrc} onOpenChange={(open) => { if (!open) setPreviewSrc(null); }}>
        <DialogContent className="bg-[#0d0d12] border-white/10 p-2 max-w-lg">
          {previewSrc && (
            <Image src={previewSrc} alt="Preview" width={600} height={400} className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Animated counter stat card ── */
function TrustStatCard({ stat }: { stat: TrustStat }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("shop") as any;
  const ref     = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted) {
        setCounted(true);
        if (iconRef.current) iconRef.current.classList.add("stat-icon-counting");
        animateCount(ref.current!, stat.count, stat.decimals || 0, 1200, () => {
          if (iconRef.current) iconRef.current.classList.remove("stat-icon-counting");
        });
      }
    }, { threshold: 0.5 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [counted, stat.count, stat.decimals]);

  const icons = { blue: Users, orange: Clock, purple: Star };
  const Icon = icons[stat.color as keyof typeof icons];

  const colorMap: Record<string, { bg: string; text: string; accent: string; glow: string }> = {
    blue:   { bg: "bg-blue-500/10",   text: "text-blue-400",   accent: "rgba(96, 165, 250, 0.5)",  glow: "rgba(96, 165, 250, 0.25)"  },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", accent: "rgba(251, 146, 60, 0.5)",  glow: "rgba(251, 146, 60, 0.25)"  },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", accent: "rgba(167, 139, 250, 0.5)", glow: "rgba(167, 139, 250, 0.25)" },
  };
  const colors = colorMap[stat.color] || colorMap.purple;

  return (
    <div className="trust-stat stat-card-premium flex items-center gap-4 !p-4"
      style={{ "--stat-accent": colors.accent } as CSSProperties}>
      <div ref={iconRef}
        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${colors.bg} ${colors.text} transition-all duration-300`}
        style={{ boxShadow: `0 0 18px ${colors.glow}` }}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-[11px] text-white/45 mb-0.5">{t(stat.labelKey)}</div>
        <div className="text-2xl font-extrabold text-white leading-none">
          <span ref={ref}>0</span>{stat.suffix}
        </div>
        <div className="text-[10px] text-white/25 mt-0.5">{t(stat.noteKey)}</div>
      </div>
    </div>
  );
}

function animateCount(el: HTMLSpanElement, target: number, decimals: number, duration: number, onDone?: () => void) {
  const start = performance.now();
  function frame(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = decimals > 0 ? (eased * target).toFixed(decimals) : Math.floor(eased * target).toString();
    if (progress < 1) requestAnimationFrame(frame);
    else onDone?.();
  }
  requestAnimationFrame(frame);
}
