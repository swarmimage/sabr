import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import LangSwitch from "@/components/LangSwitch";
import ReturnGuard from "@/features/landing/ReturnGuard";
import StartLink from "@/features/landing/StartLink";
import { getDictionary, hasLocale } from "@/i18n/config";
import styles from "./page.module.scss";

const FEATURE_ICONS: IconName[] = [
  "alert",
  "timer",
  "book",
  "beads",
  "grid",
  "list",
  "moon",
  "chat",
];
const ANCHORS = ["how", "features", "privacy"];

/** Главная до входа. На /ru и /uz её подставляет proxy, пока нет метки «уже заходил». */
export default async function WelcomePage({
  params,
}: PageProps<"/[locale]/welcome">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.landing;
  const home = `/${locale}`;

  const logo = (
    <span className={styles.logo}>
      <i aria-hidden="true">{"//"}</i> {dict.brand}
    </span>
  );

  return (
    <div className={styles.page}>
      <ReturnGuard home={home} />

      <header className={styles.header}>
        {logo}
        <nav className={styles.nav} aria-label={dict.nav.label}>
          {t.nav.map((label, i) => (
            <a key={ANCHORS[i]} href={`#${ANCHORS[i]}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <LangSwitch label={dict.greet.lang} />
          <Link className={styles.login} href={`/${locale}/login`}>
            {t.login}
          </Link>
          <StartLink className={styles.startSmall} href={home}>
            {t.start}
          </StartLink>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true">+</span>
            {t.eyebrow}
          </p>
          <h1 className={styles.h1}>
            {t.title[0]}
            <b>{t.title[1]}</b>
          </h1>
          <p className={styles.lead}>{t.lead}</p>
          <div className={styles.ctas}>
            <StartLink className={styles.cta} href={home}>
              {t.cta}
              <Icon name="go" size={16} />
            </StartLink>
            <Link className={styles.ghost} href={`/${locale}/login`}>
              {t.haveAccount}
            </Link>
          </div>
        </div>

        <div className={styles.mock} aria-hidden="true">
          <div className={styles.mockCard}>
            <div className={styles.mockTop}>
              <i>{"//"}</i>
              <span />
              <b>{dict.brand}</b>
            </div>
            <span className={styles.mockLabel}>{t.mock.label}</span>
            <div className={styles.mockCount}>
              <span>{t.mock.thin}</span>
              <b>{t.mock.bold}</b>
            </div>
            <span className={styles.mockHms}>07:42:15</span>
            <div className={styles.mockBar}>
              <div>
                <span>{t.mock.milestone}</span>
                <span>86%</span>
              </div>
              <span>
                <span />
              </span>
            </div>
          </div>
          <div className={styles.mockSos}>
            <b>SOS</b>
            <span>10:00</span>
          </div>
          <div className={styles.mockTasbih}>
            <b>33</b> {t.mock.tasbih}
          </div>
        </div>
      </section>

      <section className={styles.ayah}>
        <span className={styles.chip}>{t.ayahChip}</span>
        <div>
          <p>{t.ayah}</p>
          <span>{t.ayahSrc}</span>
        </div>
      </section>

      <section id="how" className={styles.section}>
        <h2 className={styles.h2}>
          {t.howTitle[0]}
          <b>{t.howTitle[1]}</b>
        </h2>
        <ol className={styles.steps}>
          {t.steps.map((step, i) => (
            <li key={step.title}>
              <span className={styles.num}>{`0${i + 1}`}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="features" className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>
            {t.featuresTitle[0]}
            <b>{t.featuresTitle[1]}</b>
          </h2>
          <p className={styles.muted}>{t.featuresLead}</p>
        </div>
        <ul className={styles.features}>
          {t.features.map((f, i) => (
            <li
              key={f.title}
              className={i === 0 ? styles.featureLight : undefined}
            >
              <span className={styles.featureIcon}>
                <Icon name={FEATURE_ICONS[i]} size={22} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="privacy" className={styles.privacy}>
        <div className={styles.privacyHead}>
          <span className={styles.lock}>
            <Icon name="lock" size={26} />
          </span>
          <h2 className={styles.h2}>
            {t.privacyTitle[0]}
            <b>{t.privacyTitle[1]}</b>
          </h2>
          <p>{t.privacyLead}</p>
        </div>
        <ul className={styles.checks}>
          {t.privacy.map((item) => (
            <li key={item}>
              <span>
                <Icon name="check" size={14} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.final}>
        <div className={styles.finalText}>
          <h2 className={styles.h2}>
            {t.finalTitle[0]}
            <b>{t.finalTitle[1]}</b>
          </h2>
          <p>{t.finalQuote}</p>
        </div>
        <div className={styles.finalCtas}>
          <StartLink className={styles.ctaDark} href={home}>
            {t.cta}
            <Icon name="go" size={16} />
          </StartLink>
          <Link className={styles.underline} href={`/${locale}/register`}>
            {t.register}
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        {logo}
        <nav className={styles.footerLinks}>
          <Link href={`/${locale}/login`}>{t.footerLogin}</Link>
          <Link href={`/${locale}/register`}>{t.footerRegister}</Link>
          <Link className={styles.footerSos} href={`/${locale}/sos`}>
            {t.footerSos}
          </Link>
        </nav>
        <LangSwitch label={dict.greet.lang} />
        <p className={styles.disclaimer}>{t.disclaimer}</p>
      </footer>
    </div>
  );
}
