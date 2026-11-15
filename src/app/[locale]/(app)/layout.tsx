import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { getDictionary, hasLocale } from "@/i18n/config";
import styles from "./layout.module.scss";

export default async function AppLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <div className={styles.app}>
      <Header locale={locale} dict={dict} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
