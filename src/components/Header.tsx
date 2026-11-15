import Link from "next/link";
import type { Dict, Locale } from "@/i18n/config";
import Dock from "./Dock";
import Icon from "./Icon";
import styles from "./Header.module.scss";

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  return (
    <header className={styles.top}>
      <span className={styles.logo} aria-hidden="true">
        {"//"}
      </span>
      <span className={styles.name}>{dict.brand}</span>
      <span className={styles.rule} />
      <div className={styles.bar}>
        <Link className={styles.sos} href={`/${locale}/sos`}>
          {dict.sos.button}
          <small>{dict.sos.hint}</small>
        </Link>
        <Dock locale={locale} labels={dict.nav} />
      </div>
      <Link
        className={styles.avatar}
        href={`/${locale}/profile`}
        aria-label={dict.nav.profile}
      >
        <Icon name="user" size={20} />
      </Link>
    </header>
  );
}
