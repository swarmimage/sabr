import { notFound } from "next/navigation";
import Profile from "@/features/profile/Profile";
import { getDictionary, hasLocale } from "@/i18n/config";
import form from "@/styles/form.module.scss";

export default async function ProfilePage({
  params,
}: PageProps<"/[locale]/profile">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <div className={form.column}>
      <Profile
        locale={locale}
        dict={{
          profile: dict.profile,
          auth: dict.auth,
          common: dict.common,
          days: dict.days,
          dow: dict.dow,
          today: dict.today,
        }}
      />
    </div>
  );
}
