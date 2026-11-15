"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RelapseDialog from "@/components/RelapseDialog";
import type { Dict, Locale } from "@/i18n/config";
import { milestoneProgress, plural, splitDuration, DAY } from "@/lib/format";
import { relapse, startStreak } from "@/lib/store/store";
import { useStore, useStoreReady } from "@/lib/store/useStore";
import { useNow } from "@/lib/useNow";
import styles from "./Timer.module.scss";

export default function Timer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Pick<Dict, "today" | "days" | "relapse" | "common">;
}) {
  const t = dict.today;
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const ready = useStoreReady();
  const now = useNow();
  const start = useStore((s) => s.start);
  const best = useStore((s) => s.best);
  const winsTotal = useStore((s) => s.winsTotal);
  const relapses = useStore((s) => s.relapses.length);

  const running = ready && start !== null && now > 0;
  const elapsed = running ? Math.max(0, now - start) : 0;
  const { days, hms } = splitDuration(elapsed);
  const { next, percent } = milestoneProgress(elapsed);
  const bestDays = Math.floor(Math.max(best, elapsed) / DAY);

  const since =
    running && start !== null
      ? `${t.eyebrowSince} ${new Date(start).toLocaleString(locale, {
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : t.eyebrowIdle;

  return (
    <section className={styles.hero} aria-busy={!ready}>
      <div className={styles.count}>
        <span className={styles.eyebrow}>{since}</span>
        <span className={styles.thin}>
          {running ? t.thinRunning : t.thinIdle}
        </span>
        <span className={styles.bold}>
          {running ? `${days} ${plural(days, dict.days)}` : t.boldIdle}
        </span>
        <span className={styles.hms}>{hms}</span>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressHead}>
          <span>
            {next === null
              ? t.yearDone
              : `${t.nextMilestone} ${next} ${plural(next, dict.days)}`}
          </span>
          <span>{Math.floor(percent)}%</span>
        </div>
        <div className={styles.bar}>
          <i style={{ width: `${percent.toFixed(1)}%` }} />
        </div>
      </div>

      <div className={styles.actions}>
        {running ? (
          <button className={styles.btn} onClick={() => setConfirming(true)}>
            {t.relapse}
          </button>
        ) : (
          <button
            className={`${styles.btn} ${styles.primary}`}
            disabled={!ready}
            onClick={() => startStreak()}
          >
            {t.start}
          </button>
        )}
      </div>

      <dl className={styles.stats}>
        <div>
          <dt>{t.best}</dt>
          <dd>
            {bestDays} {t.dayShort}
          </dd>
        </div>
        <div>
          <dt>{t.wins}</dt>
          <dd>{winsTotal}</dd>
        </div>
        <div>
          <dt>{t.relapses}</dt>
          <dd>{relapses}</dd>
        </div>
      </dl>

      {confirming && (
        <RelapseDialog
          dict={dict.relapse}
          cancel={dict.common.cancel}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            relapse();
            setConfirming(false);
            router.push(`/${locale}/dua`);
          }}
        />
      )}
    </section>
  );
}
