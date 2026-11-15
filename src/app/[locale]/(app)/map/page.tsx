import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import EveningNav from "@/features/evening/EveningNav";
import TriggerMap from "@/features/map/TriggerMap";
import { getDictionary, hasLocale } from "@/i18n/config";
import form from "@/styles/form.module.scss";

export default async function MapPage({ params }: PageProps<"/[locale]/map">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <div className={form.column}>
      <PageTitle thin={dict.titles.map[0]} bold={dict.titles.map[1]} />
      <EveningNav locale={locale} labels={dict.evening} current="map" />
      <TriggerMap
        locale={locale}
        dict={{
          map: dict.map,
          dow: dict.dow,
          triggerNames: dict.triggerNames,
          chat: dict.chat,
        }}
      />
    </div>
  );
}
