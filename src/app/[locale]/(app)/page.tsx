import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { getContent } from "@/content";
import Celebrate from "@/features/today/Celebrate";
import DangerMode from "@/features/today/DangerMode";
import QuoteCard from "@/features/today/QuoteCard";
import Reasons from "@/features/today/Reasons";
import Timer from "@/features/today/Timer";
import { getDictionary, hasLocale } from "@/i18n/config";
import styles from "./page.module.scss";

export default async function TodayPage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const content = getContent(locale);

  return (
    <DangerMode
      locale={locale}
      quotes={content.QUOTES.filter(
        (q) => content.CALM.includes(q.c),
      )}
      dict={{
        danger: dict.danger,
        plan: dict.plan,
        nav: dict.nav,
        days: dict.days,
        common: dict.common,
      }}
    >
      <Celebrate
        dict={{ celebrate: dict.celebrate, days: dict.days }}
        ayahs={content.CELEBRATE}
        days={content.CELEBRATE_DAYS}
      />
      <div className={styles.grid}>
        <Timer
          locale={locale}
          dict={{
            today: dict.today,
            days: dict.days,
            relapse: dict.relapse,
            common: dict.common,
          }}
        />
        <div className={styles.side}>
          <QuoteCard
            quotes={content.QUOTES}
            labels={{
              quoteIn: dict.today.quoteIn,
              quoteNext: dict.today.quoteNext,
            }}
          />
          <Reasons dict={{ today: dict.today, common: dict.common }} />
          <Link className={styles.plan} href={`/${locale}/plan`}>
            <span>{dict.today.planLink}</span>
            <Icon name="go" size={16} />
          </Link>
        </div>
      </div>
    </DangerMode>
  );
}
