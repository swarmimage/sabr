import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../fonts";
import "@/styles/globals.scss";
import ServiceWorker from "@/components/ServiceWorker";
import { getDictionary, hasLocale, locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    appleWebApp: {
      capable: true,
      title: dict.meta.title,
      statusBarStyle: "black-translucent",
    },
    icons: { apple: "/icons/apple-touch-icon.png" },
  };
}

export const viewport: Viewport = { themeColor: "#0a3a2d" };

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return (
    <html lang={locale}>
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
