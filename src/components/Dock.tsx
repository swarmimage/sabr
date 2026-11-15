"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dict, Locale } from "@/i18n/config";
import styles from "./Dock.module.scss";

const tabs = [
  "today",
  "dua",
  "tasbih",
  "knowledge",
  "evening",
  "profile",
] as const;
type Tab = (typeof tabs)[number];

/** Экраны без своей вкладки подсвечивают родительскую. */
const parent: Record<string, Tab> = { map: "evening", plan: "today" };

export default function Dock({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Dict["nav"];
}) {
  const segment = usePathname().split("/")[2] ?? "";
  const current: Tab =
    segment === "" ? "today" : (parent[segment] ?? (segment as Tab));

  return (
    <nav className={styles.dock} aria-label={labels.label}>
      {tabs.map((tab) => (
        <Link
          key={tab}
          href={tab === "today" ? `/${locale}` : `/${locale}/${tab}`}
          aria-current={tab === current ? "page" : undefined}
        >
          {labels[tab]}
        </Link>
      ))}
    </nav>
  );
}
