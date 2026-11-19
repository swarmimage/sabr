import Link from "next/link";
import type { Dict, Locale } from "@/i18n/config";
import Dock from "./Dock";
import { Avatar, Greeting, Streak } from "./HeaderParts";
import LangSwitch from "./LangSwitch";
import SeenMark from "./SeenMark";
import styles from "./Header.module.scss";

/**
 * Шапка «Приветствие».
 * Телефон: аватар, «Ас-саляму алейкум, ИМЯ», язык; SOS и меню закреплены снизу.
 * Веб: две строки, сверху дата, приветствие, серия и язык, снизу знак, меню, SOS и аватар.
 */
export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  return (
    <header className={styles.top}>
      <SeenMark />
      <div className={styles.greetRow}>
        <Avatar
          locale={locale}
          label={dict.nav.profile}
          className={styles.mobileOnly}
        />
        <Greeting locale={locale} dict={dict.greet} />
        <Streak dict={dict.greet} days={dict.days} />
        <LangSwitch label={dict.greet.lang} />
      </div>

      <div className={styles.mainRow}>
        <Link className={styles.logo} href={`/${locale}`}>
          <i aria-hidden="true">{"//"}</i>
          {dict.brand}
        </Link>
        <div className={styles.bar}>
          <Link className={styles.sos} href={`/${locale}/sos`}>
            {dict.sos.button}
            <small>{dict.sos.hint}</small>
          </Link>
          <Dock locale={locale} labels={dict.nav} />
        </div>
        <Avatar
          locale={locale}
          label={dict.nav.profile}
          className={styles.desktopOnly}
        />
      </div>
    </header>
  );
}
