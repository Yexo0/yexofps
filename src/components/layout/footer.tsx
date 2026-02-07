// src/components/layout/footer.tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="relative z-[2] w-full max-w-[860px] mx-auto mt-4 mb-7 pt-3.5 px-4 border-t border-white/[0.14] flex justify-between items-center text-white/55 text-sm">
      <div>{t("copyright")}</div>
      <Link href="/" className="text-white/55 hover:text-white transition-colors no-underline">
        {t("home")}
      </Link>
    </footer>
  );
}
