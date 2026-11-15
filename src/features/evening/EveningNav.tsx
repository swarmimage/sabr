import Link from "next/link";
import type { Dict, Locale } from "@/i18n/config";
import form from "@/styles/form.module.scss";

export default function EveningNav({
  locale,
  labels,
  current,
}: {
  locale: Locale;
  labels: Pick<Dict["evening"], "navEvening" | "navMap">;
  current: "evening" | "map";
}) {
  return (
    <nav className={`${form.seg} ${form.segNav}`}>
      <Link
        href={`/${locale}/evening`}
        aria-current={current === "evening" ? "page" : undefined}
      >
        {labels.navEvening}
      </Link>
      <Link
        href={`/${locale}/map`}
        aria-current={current === "map" ? "page" : undefined}
      >
        {labels.navMap}
      </Link>
    </nav>
  );
}
