"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n/config";
import styles from "./LangSwitch.module.scss";

/** Переключатель RU / UZ: тот же экран на другом языке. */
export default function LangSwitch({ label }: { label: string }) {
  const pathname = usePathname();
  const current = pathname.split("/")[1];
  return (
    <nav className={styles.lang} aria-label={label}>
      {locales.map((l) => (
        <Link
          key={l}
          href={pathname.replace(/^\/[^/]+/, `/${l}`)}
          hrefLang={l}
          aria-current={l === current ? "true" : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
