// src/app/[locale]/page.tsx — 01 Accueil (contenu ajouté à l'étape "Accueil")
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { House } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("nav");
  return (
    <div className="bento">
      <Card icon={House} title={t("spaces.home")} subtitle="~/" headingLevel={1} className="lg:col-span-12" />
    </div>
  );
}
