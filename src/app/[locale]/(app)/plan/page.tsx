import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import Plan from "@/features/plan/Plan";
import { getDictionary, hasLocale } from "@/i18n/config";
import form from "@/styles/form.module.scss";
import ui from "@/styles/ui.module.scss";

export default async function PlanPage({
  params,
}: PageProps<"/[locale]/plan">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <div className={form.column}>
      <PageTitle thin={dict.titles.plan[0]} bold={dict.titles.plan[1]} />
      <p className={ui.lead}>{dict.plan.lead}</p>
      <Plan
        dict={{
          plan: dict.plan,
          common: dict.common,
          dow: dict.dow,
          evening: dict.evening,
        }}
      />
    </div>
  );
}
