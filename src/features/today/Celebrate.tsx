"use client";

import type { Dict } from "@/i18n/config";
import { DAY, plural } from "@/lib/format";
import { markCelebrated } from "@/lib/store/store";
import { useStore, useStoreReady } from "@/lib/store/useStore";
import { useNow } from "@/lib/useNow";
import ui from "@/styles/ui.module.scss";

/** Карточка рубежа: появляется один раз на 7, 30, 40 и 90 дней серии. */
export default function Celebrate({
  dict,
  ayahs,
  days,
}: {
  dict: Pick<Dict, "celebrate" | "days">;
  ayahs: Record<number, [string, string]>;
  days: number[];
}) {
  const ready = useStoreReady();
  const now = useNow();
  const start = useStore((s) => s.start);
  const celebrated = useStore((s) => s.celebrated);
  const wins = useStore((s) => s.wins);

  if (!ready || !now || start === null) return null;
  const passed = Math.floor((now - start) / DAY);
  const seen = celebrated.start === start ? celebrated.days : [];
  const milestone = days.find((d) => passed >= d && !seen.includes(d));
  if (milestone === undefined) return null;

  const [ayah, source] = ayahs[milestone];
  const c = dict.celebrate;

  return (
    <section className={`${ui.card} ${ui.light}`}>
      <div className={`${ui.row} ${ui.spread}`}>
        <span className={ui.chip}>{c.chip}</span>
        <span className={`${ui.small} ${ui.muted}`}>
          {c.wins} {wins.filter((t) => t >= start).length}
        </span>
      </div>
      <h2 className={ui.h2} style={{ fontSize: 26, lineHeight: 1.1 }}>
        {c.thin}{" "}
        <b>
          {milestone} {plural(milestone, dict.days)}
        </b>
      </h2>
      <p style={{ fontSize: 18, fontWeight: 600 }}>«{ayah}»</p>
      <span className={ui.src}>{source}</span>
      <p>{c.text}</p>
      <div className={ui.row}>
        <button
          className={`${ui.btn} ${ui.btnSolid}`}
          onClick={() => markCelebrated(milestone, days)}
        >
          {c.ok}
        </button>
      </div>
    </section>
  );
}
