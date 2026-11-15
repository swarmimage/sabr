"use client";

import type { Dhikr } from "@/content";
import type { Dict } from "@/i18n/config";
import { dayKey } from "@/lib/format";
import { tasbihReset, tasbihSelect, tasbihTap } from "@/lib/store/store";
import { useStore } from "@/lib/store/useStore";
import { useNow } from "@/lib/useNow";
import ui from "@/styles/ui.module.scss";
import styles from "./Tasbih.module.scss";

export default function Tasbih({
  dhikrs,
  dict,
}: {
  dhikrs: Dhikr[];
  dict: Dict["tasbih"];
}) {
  const now = useNow();
  const tasbih = useStore((s) => s.tasbih);
  const today = now ? dayKey(now) : "";
  const counts = tasbih.date === today ? tasbih.counts : {};

  const current = dhikrs.find((d) => d.id === tasbih.selected) ?? dhikrs[0];
  const n = counts[current.id] ?? 0;
  const inCycle = n > 0 && n % current.g === 0 ? current.g : n % current.g;
  const round = Math.max(1, Math.ceil(n / current.g));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const tap = () => {
    if (!today) return;
    tasbihTap(current.id, today);
    try {
      navigator.vibrate?.((n + 1) % current.g === 0 ? [60, 40, 60] : 12);
    } catch {
      /* вибрация недоступна */
    }
  };

  return (
    <>
      <div
        className={`${ui.row} ${ui.spread}`}
        style={{ alignItems: "baseline" }}
      >
        <h1 className={styles.title}>{dict.title}</h1>
        <span className={`${ui.lab} ${styles.total}`}>
          {dict.today} {total}
        </span>
      </div>

      <div className={styles.dhikrs}>
        {dhikrs.map((d) => (
          <button
            key={d.id}
            className={styles.pill}
            aria-pressed={d.id === current.id}
            onClick={() => tasbihSelect(d.id)}
          >
            {d.n}
          </button>
        ))}
      </div>

      <div className={styles.text}>
        <div className={styles.ar} lang="ar">
          {current.ar}
        </div>
        <span className={ui.translit}>{current.n}</span>
        <span className={`${ui.small} ${ui.muted}`}>{current.m}</span>
      </div>

      <button className={styles.bead} onClick={tap} aria-label={dict.tap}>
        <b>{inCycle}</b>
        <span>
          {dict.of} {current.g} · {dict.round} {round}
        </span>
      </button>

      <div className={ui.bar}>
        <i style={{ width: `${(inCycle / current.g) * 100}%` }} />
      </div>
      <div className={`${ui.row} ${ui.spread}`}>
        <span className={`${ui.small} ${ui.muted}`}>{dict.resetNote}</span>
        <button
          className={ui.link}
          onClick={() => today && tasbihReset(current.id, today)}
        >
          {dict.reset}
        </button>
      </div>
    </>
  );
}
