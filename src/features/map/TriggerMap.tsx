"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dict, Locale } from "@/i18n/config";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth/authStore";
import { BANDS, slotOf } from "@/lib/danger";
import { DAY, dayKey, fill } from "@/lib/format";
import { addRule, setDanger } from "@/lib/store/store";
import type { AppState } from "@/lib/store/types";
import { useStore, useStoreReady } from "@/lib/store/useStore";
import { useNow } from "@/lib/useNow";
import ui from "@/styles/ui.module.scss";
import styles from "./TriggerMap.module.scss";

const PERIOD = 30 * DAY;

interface AiReview {
  text: string;
  action: string;
  if: string;
  then: string;
}
const average = (list: number[]) =>
  list.reduce((a, b) => a + b, 0) / list.length;

/** Сводка за 30 дней: сетка «полоса суток × день недели», частые триггеры, тяга и намазы. */
function summarize(
  state: Pick<AppState, "sos" | "relapses" | "journal">,
  now: number,
) {
  const since = now - PERIOD;
  const grid = BANDS.map(() => [0, 0, 0, 0, 0, 0, 0]);
  let events = 0;
  for (const ts of [...state.sos, ...state.relapses]) {
    if (ts < since) continue;
    const [band, day] = slotOf(ts);
    grid[band][day]++;
    events++;
  }
  const sinceKey = dayKey(since);
  const counts: Record<string, number> = {};
  const withAll: number[] = [];
  const withMissed: number[] = [];
  let days = 0;
  for (const [key, entry] of Object.entries(state.journal)) {
    if (key < sinceKey) continue;
    days++;
    for (const id of entry.triggers) counts[id] = (counts[id] ?? 0) + 1;
    if (entry.urge !== null)
      (entry.prayers.length === 5 ? withAll : withMissed).push(entry.urge);
  }
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  let max = 0;
  let band = -1;
  grid.forEach((row, b) =>
    row.forEach((v) => {
      if (v > max) {
        max = v;
        band = b;
      }
    }),
  );
  return { grid, events, days, top, withAll, withMissed, max, band };
}

export default function TriggerMap({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Pick<Dict, "map" | "dow" | "triggerNames" | "chat">;
}) {
  const t = dict.map;
  const router = useRouter();
  const ready = useStoreReady();
  const now = useNow();
  const sos = useStore((s) => s.sos);
  const relapses = useStore((s) => s.relapses);
  const journal = useStore((s) => s.journal);
  const rules = useStore((s) => s.rules);
  const aiAllowed = useStore((s) => s.ai);
  const auth = useAuth();
  const [ai, setAi] = useState<AiReview | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiNote, setAiNote] = useState("");

  if (!ready || !now)
    return <div className={styles.loading} aria-busy="true" />;

  const data = summarize({ sos, relapses, journal }, now);
  const name = (id: string) =>
    dict.triggerNames[id as keyof Dict["triggerNames"]] ?? id;
  const score = (list: number[]) =>
    list.length >= 2 ? `${average(list).toFixed(1)} / 5` : t.few;

  // Самая тяжёлая полоса и дни, где в ней хотя бы половина от максимума.
  const suggestion =
    data.max >= 2
      ? {
          ...BANDS[data.band],
          days: data.grid[data.band].flatMap((v, day) =>
            v >= data.max / 2 ? [day] : [],
          ),
        }
      : null;

  const review = [
    data.top.length > 0 &&
      fill(t.reviewTop, { t: name(data.top[0][0]), n: data.top[0][1] }),
    data.max >= 2 &&
      fill(t.reviewBand, { b: t.bands[data.band].toLowerCase() }),
  ].filter(Boolean);

  async function askAi() {
    const since = dayKey(now - 7 * DAY);
    const week = Object.fromEntries(
      Object.entries(journal)
        .filter(([key]) => key >= since)
        .map(([key, j]) => [
          key,
          {
            clean: j.clean,
            urge: j.urge,
            triggers: j.triggers.map(name),
            prayers: j.prayers.length,
            helped: j.helped,
            tomorrow: j.tomorrow,
          },
        ]),
    );
    if (!Object.keys(week).length) return setAiNote(dict.chat.reviewNoData);
    setAiBusy(true);
    setAiNote("");
    try {
      setAi(
        await api<AiReview>("/api/ai/review", {
          method: "POST",
          body: { week, grid: data.grid, rules, locale },
        }),
      );
    } catch {
      setAiNote(dict.chat.reviewFailed);
    } finally {
      setAiBusy(false);
    }
  }
  const canAskAi = auth.status === "user" && auth.ai && aiAllowed;

  return (
    <>
      {data.events + data.days === 0 && <p className={ui.lead}>{t.empty}</p>}

      <section className={ui.col}>
        <div
          className={`${ui.row} ${ui.spread}`}
          style={{ alignItems: "baseline" }}
        >
          <span className={ui.lab}>{t.when}</span>
          <span className={`${ui.small} ${ui.muted}`}>{t.period}</span>
        </div>
        <div className={styles.heat}>
          <span />
          {dict.dow.map((d) => (
            <span
              key={d}
              className={styles.axis}
              style={{ textAlign: "center" }}
            >
              {d}
            </span>
          ))}
          {data.grid.map((row, b) => [
            <span key={`band-${b}`} className={styles.axis}>
              {t.bands[b]}
            </span>,
            ...row.map((v, day) => {
              const level =
                v && data.max ? Math.max(1, Math.ceil((v / data.max) * 3)) : 0;
              return (
                <div
                  key={`${b}-${day}`}
                  className={styles.cell}
                  data-level={level}
                  title={`${t.bands[b]}, ${dict.dow[day]}: ${v}`}
                >
                  {v || ""}
                </div>
              );
            }),
          ])}
        </div>
        <div className={styles.legend}>
          <span>{t.less}</span>
          {[0, 1, 2, 3].map((level) => (
            <i key={level} data-level={level} />
          ))}
          <span>{t.more}</span>
        </div>
        {suggestion && (
          <button
            className={`${ui.btn} ${styles.suggest}`}
            onClick={() => {
              setDanger({
                on: true,
                from: suggestion.from,
                to: suggestion.to,
                days: suggestion.days,
              });
              router.push(`/${locale}/plan`);
            }}
          >
            {t.markDanger} {suggestion.days.map((d) => dict.dow[d]).join(", ")},{" "}
            {suggestion.from}–{suggestion.to}
          </button>
        )}
      </section>

      <section className={ui.col}>
        <span className={ui.lab}>{t.before}</span>
        {data.top.length === 0 && (
          <span className={`${ui.small} ${ui.muted}`}>{t.beforeEmpty}</span>
        )}
        {data.top.map(([id, count], i) => (
          <div key={id} className={styles.trigger}>
            <span>{name(id)}</span>
            <div className={ui.bar} style={{ height: 10 }}>
              <i
                style={{
                  width: `${(count / data.top[0][1]) * 100}%`,
                  background: i > 1 ? "var(--white)" : undefined,
                }}
              />
            </div>
            <b>{count}</b>
          </div>
        ))}
      </section>

      <dl className={styles.compare}>
        <div>
          <dt>{t.withAll}</dt>
          <dd>{score(data.withAll)}</dd>
        </div>
        <div>
          <dt>{t.withMissed}</dt>
          <dd className={styles.accent}>{score(data.withMissed)}</dd>
        </div>
      </dl>

      <section className={`${ui.card} ${ui.light}`}>
        <div className={`${ui.row} ${ui.spread}`}>
          <span className={ui.chip}>{t.reviewChip}</span>
          <span className={`${ui.small} ${ui.muted}`}>
            {ai ? dict.chat.reviewBy : t.reviewBy}
          </span>
        </div>
        <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>
          {ai ? ai.text : review.length ? review.join(" ") : t.reviewNone}
        </p>
        {ai ? (
          <p>{ai.action}</p>
        ) : (
          data.top.length > 0 && <p>{t.reviewAction}</p>
        )}
        <div className={ui.row}>
          {ai && ai.if && ai.then ? (
            <button
              className={`${ui.btn} ${ui.btnSolid}`}
              onClick={() => {
                addRule(ai.if, ai.then);
                router.push(`/${locale}/plan`);
              }}
            >
              {dict.chat.addRule}
            </button>
          ) : (
            data.top.length > 0 && (
              <button
                className={`${ui.btn} ${ui.btnSolid}`}
                onClick={() => router.push(`/${locale}/plan`)}
              >
                {t.toPlan}
              </button>
            )
          )}
          {canAskAi && (
            <button className={ui.btn} disabled={aiBusy} onClick={askAi}>
              {aiBusy ? dict.chat.reviewBusy : dict.chat.reviewButton}
            </button>
          )}
        </div>
        {aiNote && <p className={ui.small}>{aiNote}</p>}
        {canAskAi && (
          <span className={`${ui.small} ${ui.muted}`}>
            {dict.chat.reviewNote}
          </span>
        )}
      </section>
    </>
  );
}
