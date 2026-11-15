import { notFound } from "next/navigation";
import { getContent } from "@/content";
import SosScreen from "@/features/sos/SosScreen";
import { getDictionary, hasLocale } from "@/i18n/config";

export default async function SosPage({ params }: PageProps<"/[locale]/sos">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <SosScreen
      locale={locale}
      steps={getContent(locale).SOS_STEPS}
      dict={{
        sos: dict.sos,
        relapse: dict.relapse,
        common: dict.common,
        days: dict.days,
        brand: dict.brand,
        chat: dict.chat,
      }}
    />
  );
}
