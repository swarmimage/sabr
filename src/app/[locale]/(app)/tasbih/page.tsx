import { notFound } from "next/navigation";
import { getContent } from "@/content";
import Tasbih from "@/features/tasbih/Tasbih";
import { getDictionary, hasLocale } from "@/i18n/config";
import styles from "./page.module.scss";

export default async function TasbihPage({
  params,
}: PageProps<"/[locale]/tasbih">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <div className={styles.column}>
      <Tasbih dhikrs={getContent(locale).DHIKR} dict={dict.tasbih} />
    </div>
  );
}
