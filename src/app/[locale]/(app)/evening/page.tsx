import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import Evening from "@/features/evening/Evening";
import EveningNav from "@/features/evening/EveningNav";
import { getDictionary, hasLocale } from "@/i18n/config";
import form from "@/styles/form.module.scss";
import ui from "@/styles/ui.module.scss";

export default async function EveningPage({
  params,
}: PageProps<"/[locale]/evening">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <div className={form.column}>
      <PageTitle thin={dict.titles.evening[0]} bold={dict.titles.evening[1]} />
      <p className={ui.lead}>{dict.evening.lead}</p>
      <EveningNav locale={locale} labels={dict.evening} current="evening" />
      <Evening
        locale={locale}
        dict={{
          evening: dict.evening,
          triggerNames: dict.triggerNames,
          prayerNames: dict.prayerNames,
        }}
      />
    </div>
  );
}
