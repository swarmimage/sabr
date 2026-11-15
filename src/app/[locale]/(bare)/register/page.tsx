import { notFound } from "next/navigation";
import AuthForm from "@/features/auth/AuthForm";
import { getDictionary, hasLocale } from "@/i18n/config";

export default async function Page({
  params,
}: PageProps<"/[locale]/register">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <AuthForm
      mode="register"
      locale={locale}
      dict={{ auth: dict.auth, titles: dict.titles, brand: dict.brand }}
    />
  );
}
