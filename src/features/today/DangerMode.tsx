"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import IfThen from "@/components/IfThen";
import type { Quote } from "@/content";
import type { Dict, Locale } from "@/i18n/config";
import { isDangerTime } from "@/lib/danger";
import { formatDuration, pad } from "@/lib/format";
import { useStore, useStoreReady } from "@/lib/store/useStore";
import { useNow } from "@/lib/useNow";
import ui from "@/styles/ui.module.scss";
import styles from "./DangerMode.module.scss";

/**
 * В опасные часы заменяет обычный экран «Сегодня» жёлтой панелью:
 * одна установка, первое правило «если — то» и три действия.
 */
export default function DangerMode({
  locale,
  quotes,
  dict,
  children,
}: {
  locale: Locale;
  quotes: Quote[];
  dict: Pick<Dict, "danger" | "plan" | "nav" | "days" | "common">;
  children: ReactNode;
}) {
  const t = dict.danger;
  const ready = useStoreReady();
  const now = useNow();
  const danger = useStore((s) => s.danger);
  const start = useStore((s) => s.start);
  const rules = useStore((s) => s.rules);
  const [dismissed, setDismissed] = useState(false);

  if (!ready || dismissed || !isDangerTime(now, danger)) return children;

  const date = new Date(now);
  // Одна установка на час: без мелькания при каждом тике.
  const quote = quotes[Math.floor(now / 3_600_000) % quotes.length];
  const words = {
    days: dict.days,
    hours: dict.common.hours,
    minutes: dict.common.minutes,
  };

  return (
    <section className={styles.panel}>
      <span className={ui.lab} style={{ fontWeight: 800 }}>
        {pad(date.getHours())}:{pad(date.getMinutes())} · {t.label} {danger.to}
      </span>
      <h1 className={styles.title}>
        {t.title[0]}
        <b>{t.title[1]}</b>
      </h1>
      <p>{t.why}</p>

      <div className={styles.inner}>
        <span className={ui.chip}>{t.chip}</span>
        <p>{quote.t}</p>
        <div className={styles.rule} />
        <div className={`${ui.row} ${ui.spread}`}>
          <span className={`${ui.small} ${ui.muted}`}>{t.streak}</span>
          <b className={styles.streak}>
            {start !== null ? formatDuration(now - start, words) : t.idle}
          </b>
        </div>
      </div>

      {rules.length > 0 && (
        <div className={ui.col}>
          <span className={ui.lab} style={{ fontWeight: 800 }}>
            {t.ruleLabel}
          </span>
          <div
            className={styles.ruleBox}
            style={{ "--accent": "var(--deep)" } as CSSProperties}
          >
            <IfThen
              rule={rules[0]}
              labels={{ if: dict.plan.if, then: dict.plan.then }}
            />
          </div>
        </div>
      )}

      <div className={ui.col} style={{ gap: 8 }}>
        <Link
          className={`${styles.btn} ${styles.solid}`}
          href={`/${locale}/dua`}
        >
          {t.sleep}
        </Link>
        <Link className={styles.btn} href={`/${locale}/tasbih`}>
          {dict.nav.tasbih}
        </Link>
      </div>
      <button className={styles.dismiss} onClick={() => setDismissed(true)}>
        {t.dismiss}
      </button>
    </section>
  );
}
