// src/app/[locale]/shop/page.tsx — Shop
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { BackButton } from "@/components/layout/back-button";
import { Footer } from "@/components/layout/footer";
import { GlassPanel } from "@/components/shared/glass-panel";
import { Link } from "@/i18n/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PRODUCTS, REVIEWS, TRUST_STATS, SOCIAL_LINKS, type TrustStat } from "@/lib/constants";
import { Star, Users, Clock } from "lucide-react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"] });

export default function ShopPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("shop") as any;
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll(".shop-section");
    sections.forEach((sec, i) => {
      (sec as HTMLElement).style.opacity = "0";
      (sec as HTMLElement).style.transform = "translateY(22px)";
      setTimeout(() => {
        (sec as HTMLElement).style.transition = "opacity 0.7s ease, transform 0.7s ease";
        (sec as HTMLElement).style.opacity = "1";
        (sec as HTMLElement).style.transform = "translateY(0)";
      }, 160 + i * 170);
    });
  }, []);

  return (
    <>
      <BackButton />
      <main className="relative z-[2] min-h-screen flex flex-col items-center gap-5 px-[18px] pt-[60px] pb-[100px] max-w-[1120px] mx-auto">
        {/* Hero */}
        <div className="w-full shop-section">
          <GlassPanel>
            <div className="mb-5">
              <h1 className={`${orbitron.className} hero-title text-[1.8rem] sm:text-[2.2rem] font-black tracking-[0.04em] mb-3`}>
                {t("title")}
              </h1>
              <p className="text-white/55 text-sm">
                {t("subtitlePart1")} <strong className="text-white">{t("subtitleContact")}</strong>{" "}
                {t("subtitleOr")} <strong className="text-white">{t("subtitleDiscord")}</strong>{" "}
                <span className="text-emerald-400 text-xs">{t("subtitleFastest")}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mb-5">
              <Link href="/liens" className="btn-premium !text-sm">
                {t("contactCta")}
              </Link>
              <a href={SOCIAL_LINKS.payhip} target="_blank" rel="noopener noreferrer"
                className="btn-ghost-premium">
                {t("payhipCta")}
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="shop-notice flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-white/55">
                <span className="notice-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <strong className="text-white">{t("noticeDiscord")}</strong>
              </div>
              <div className="shop-notice flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-white/55">
                <span className="notice-dot w-1.5 h-1.5 rounded-full bg-orange-400" style={{ animationDelay: "0.5s" }} />
                {t("noticePrices")}
              </div>
              <div className="shop-notice flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-white/55">
                <span className="notice-dot w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animationDelay: "1s" }} />
                {t("noticeDelivery")}
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Products */}
        <div className="w-full shop-section">
          <GlassPanel>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-wide text-white">{t("productsTitle")}</h2>
              <div className="mt-1.5 h-[2px] w-12 rounded-full animated-line-warm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCTS.map((product) => {
                const titleKey = `products.${product.id}.title` as const;
                const descKey = `products.${product.id}.desc` as const;
                return (
                  <article key={product.id} className={`shop-product product-card-premium ${product.badge ? "ring-1 ring-purple-500/20" : ""}`}>
                    <div className="relative overflow-hidden">
                      {product.badge && (
                        <span className={`shop-badge absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          product.badge === "bestValue" ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20" : "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                        }`}>
                          {t(product.badge)}
                        </span>
                      )}
                      <Image
                        src={product.image}
                        alt={t(titleKey)}
                        width={400}
                        height={220}
                        className="shop-product-img w-full h-[180px] object-cover"
                      />
                      {/* Vignette gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent opacity-60 pointer-events-none" />
                      {/* Hover tint overlay */}
                      <div className="product-tint absolute inset-0 pointer-events-none" />
                      <span className="shop-price absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-sm font-bold border border-white/10 z-[1]">
                        {product.price}
                      </span>
                    </div>
                    <div className="product-content p-4 relative overflow-hidden">
                      {/* Corner accents */}
                      <span className="product-corner product-corner-tl" />
                      <span className="product-corner product-corner-br" />
                      {/* Decorative bg circle */}
                      <span className="product-circle" />
                      <h3 className="product-title text-sm font-bold text-white mb-1">{t(titleKey)}</h3>
                      <p className="product-desc text-xs text-white/40 mb-3">{t(descKey)}</p>
                      <div className="product-actions flex gap-2">
                        <Link href="/liens" className="product-cta btn-premium !py-1.5 !px-3 !text-xs">
                          {t("buyContact")}
                        </Link>
                        {product.previewSrc && (
                          <button
                            onClick={() => setPreviewSrc(product.previewSrc!)}
                            className="btn-ghost-premium !py-1.5 !px-3 !text-xs"
                          >
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
          </GlassPanel>
        </div>

        {/* Trust: Stats + Reviews */}
        <div className="w-full shop-section">
          <GlassPanel>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-wide text-white">{t("trustTitle")}</h2>
              <div className="mt-1.5 h-[2px] w-12 rounded-full animated-line" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Stats */}
              <div>
                <h3 className="gradient-text text-sm font-bold mb-1">{t("statsTitle")}</h3>
                <p className="text-xs text-white/40 mb-4">{t("statsSub")}</p>
                <div className="flex flex-col gap-3">
                  {TRUST_STATS.map((stat, i) => (
                    <TrustStatCard key={i} stat={stat} />
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="gradient-text-warm text-sm font-bold mb-1">{t("reviewsTitle")}</h3>
                <p className="text-xs text-white/40 mb-4">{t("reviewsSub")}</p>
                <div className="flex flex-col gap-3">
                  {REVIEWS.map((review) => {
                    const platformClass = review.platform === "Discord" ? "review-discord" : "review-tiktok";
                    return (
                      <article key={review.key} className={`shop-review stat-card-premium !p-4 ${platformClass}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <Image src={review.avatar} alt={review.name} width={32} height={32} className="w-8 h-8 rounded-full" />
                          <div className="flex-1">
                            <strong className="text-xs text-white">{review.name}</strong>
                            <span className={`text-[10px] ml-2 ${review.platform === "Discord" ? "text-[#5865f2]/60" : "text-[#fe2c55]/60"}`}>
                              {review.platform}
                            </span>
                          </div>
                          <div className="review-stars flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="review-star text-yellow-400 text-xs" style={{ animationDelay: `${i * 0.12}s` }}>
                                &#9733;
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-white/55 italic">&ldquo;{t(`reviews.${review.key}`)}&rdquo;</p>
                      </article>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer"
                    className="social-btn social-discord !text-xs">
                    {t("reviewsDiscordCta")}
                  </a>
                  <a href={SOCIAL_LINKS.payhip} target="_blank" rel="noopener noreferrer"
                    className="btn-premium !text-xs">
                    {t("payhipBuyCta")}
                  </a>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Payhip */}
        <div className="w-full shop-section">
          <GlassPanel>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-wide text-white">{t("payhipTitle")}</h2>
              <div className="mt-1.5 h-[2px] w-12 rounded-full animated-line" />
            </div>
            <p className="text-white/50 text-sm mb-4">{t("payhipText")}</p>
            <div className="flex flex-wrap gap-3">
              <a href={SOCIAL_LINKS.payhip} target="_blank" rel="noopener noreferrer"
                className="btn-premium !text-sm">
                {t("payhipOpen")}
              </a>
              <Link href="/liens" className="btn-ghost-premium">
                {t("payhipOrContact")}
              </Link>
            </div>
          </GlassPanel>
        </div>

        {/* Contact */}
        <div className="w-full shop-section">
          <GlassPanel>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-wide text-white">{t("contactTitle")}</h2>
              <div className="mt-1.5 h-[2px] w-12 rounded-full animated-line-blue" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="contact-card contact-card-blue stat-card-premium" style={{ "--stat-accent": "rgba(96, 165, 250, 0.5)" } as React.CSSProperties}>
                <h3 className="text-sm font-bold text-white mb-1">{t("discordFastest")}</h3>
                <p className="text-xs text-white/40 mb-3">{t("discordText")}</p>
                <div className="flex gap-2">
                  <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer"
                    className="btn-premium !py-2 !px-4 !text-xs">
                    {t("joinDiscord")}
                  </a>
                  <a href={SOCIAL_LINKS.discordEdits} target="_blank" rel="noopener noreferrer"
                    className="btn-ghost-premium !py-2 !px-4 !text-xs">
                    {t("joinDiscordEdits")}
                  </a>
                </div>
              </div>
              <div className="contact-card contact-card-pink stat-card-premium" style={{ "--stat-accent": "rgba(244, 114, 182, 0.5)" } as React.CSSProperties}>
                <h3 className="text-sm font-bold text-white mb-1">{t("emailTitle")}</h3>
                <p className="text-xs text-white/40 mb-3">{t("emailText")}</p>
                <a href="mailto:yexobusiness@gmail.com"
                  className="btn-premium !py-2 !px-4 !text-xs">
                  yexobusiness@gmail.com
                </a>
              </div>
              <div className="contact-card contact-card-purple stat-card-premium" style={{ "--stat-accent": "rgba(167, 139, 250, 0.5)" } as React.CSSProperties}>
                <h3 className="text-sm font-bold text-white mb-1">{t("socialsTitle")}</h3>
                <p className="text-xs text-white/40 mb-3">{t("socialsText")}</p>
                <div className="flex gap-2">
                  <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer"
                    className="social-btn social-tiktok !py-1.5 !px-3 !text-xs">
                    TikTok
                  </a>
                  <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"
                    className="social-btn social-instagram !py-1.5 !px-3 !text-xs">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
            <p className="text-xs text-white/30 text-center">{t("contactTip")}</p>
          </GlassPanel>
        </div>

        <Footer />
      </main>

      {/* Preview Modal */}
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

// Animated counter stat card
function TrustStatCard({ stat }: { stat: TrustStat }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("shop") as any;
  const ref = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted) {
          setCounted(true);
          if (iconRef.current) iconRef.current.classList.add("stat-icon-counting");
          animateCount(ref.current!, stat.count, stat.decimals || 0, 1200, () => {
            if (iconRef.current) iconRef.current.classList.remove("stat-icon-counting");
          });
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [counted, stat.count, stat.decimals]);

  const icons = { blue: Users, orange: Clock, purple: Star };
  const Icon = icons[stat.color as keyof typeof icons];

  const colorMap: Record<string, { bg: string; text: string; accent: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", accent: "rgba(96, 165, 250, 0.5)" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", accent: "rgba(251, 146, 60, 0.5)" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", accent: "rgba(167, 139, 250, 0.5)" },
  };
  const colors = colorMap[stat.color] || colorMap.purple;

  return (
    <div className="trust-stat stat-card-premium flex items-center gap-4 !p-4" style={{ "--stat-accent": colors.accent } as React.CSSProperties}>
      <div ref={iconRef} className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.bg} ${colors.text} transition-all duration-300`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-white/50">{t(stat.labelKey)}</div>
        <div className="text-xl font-extrabold text-white">
          <span ref={ref}>0</span>{stat.suffix}
        </div>
        <div className="text-[10px] text-white/30">{t(stat.noteKey)}</div>
      </div>
    </div>
  );
}

function animateCount(el: HTMLSpanElement, target: number, decimals: number, duration: number, onDone?: () => void) {
  const start = performance.now();
  function frame(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString();
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      onDone?.();
    }
  }
  requestAnimationFrame(frame);
}
