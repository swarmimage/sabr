"use client";

import { useState, type CSSProperties } from "react";
import type { Dict, Locale } from "@/i18n/config";
import { dayKey } from "@/lib/format";
import { saveJournal } from "@/lib/store/store";
import type { JournalEntry } from "@/lib/store/types";
import { useStore, useStoreReady } from "@/lib/store/useStore";
import { useNow } from "@/lib/useNow";
import form from "@/styles/form.module.scss";
import ui from "@/styles/ui.module.scss";
import styles from "./Evening.module.scss";

type EveningDict = Pick<Dict, "evening" | "triggerNames" | "prayerNames">;

const blank: JournalEntry = {
  clean: null,
  urge: null,
  triggers: [],
  prayers: [],
  helped: "",
  thanks: "",
  tomorrow: "",
  at: 0,
};

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

const keyDate = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

function Form({
  day,
  initial,
  dict,
}: {
  day: string;
  initial: JournalEntry;
  dict: EveningDict;
}) {
  const t = dict.evening;
  const [entry, setEntry] = useState(initial);
  const [saved, setSaved] = useState(false);
  const patch = (p: Partial<JournalEntry>) => {
    setEntry((e) => ({ ...e, ...p }));
    setSaved(false);
  };
  const triggerIds = Object.keys(
    dict.triggerNames,
  ) as (keyof Dict["triggerNames"])[];
  const prayerIds = Object.keys(
    dict.prayerNames,
  ) as (keyof Dict["prayerNames"])[];

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        saveJournal(day, { ...entry, at: Date.now() });
        setSaved(true);
      }}
    >
      <div className={form.field}>
        <span className={ui.lab}>01 · {t.clean}</span>
        <div className={form.seg}>
          {(["yes", "no"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={entry.clean === v}
              onClick={() => patch({ clean: v })}
            >
              {v === "yes" ? t.cleanYes : t.cleanNo}
            </button>
          ))}
        </div>
        {entry.clean === "no" && (
          <span className={`${ui.small} ${ui.muted}`}>{t.cleanHint}</span>
        )}
      </div>

      <div className={form.field}>
        <span className={ui.lab}>02 · {t.urge}</span>
        <div
          className={`${form.seg} ${form.segNum}`}
          style={{ "--cols": 6 } as CSSProperties}
        >
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={entry.urge === n}
              onClick={() => patch({ urge: n })}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={form.field}>
        <span className={ui.lab}>03 · {t.triggers}</span>
        <div className={form.pills}>
          {triggerIds.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={entry.triggers.includes(id)}
              onClick={() => patch({ triggers: toggle(entry.triggers, id) })}
            >
              {dict.triggerNames[id]}
            </button>
          ))}
        </div>
      </div>

      <div className={form.field}>
        <span className={ui.lab}>
          04 · {t.prayers}{" "}
          <span className={styles.count}>{entry.prayers.length}/5</span>
        </span>
        <div className={form.seg} style={{ "--cols": 5 } as CSSProperties}>
          {prayerIds.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={entry.prayers.includes(id)}
              onClick={() => patch({ prayers: toggle(entry.prayers, id) })}
            >
              {dict.prayerNames[id]}
            </button>
          ))}
        </div>
      </div>

      {(
        [
          ["helped", "05", t.helped, ""],
          ["thanks", "06", t.thanks, ""],
          ["tomorrow", "07", t.tomorrow, t.tomorrowPlaceholder],
        ] as const
      ).map(([field, n, label, placeholder]) => (
        <div key={field} className={form.field}>
          <label className={ui.lab} htmlFor={`ev-${field}`}>
            {n} · {label}
          </label>
          <textarea
            id={`ev-${field}`}
            className={form.textarea}
            maxLength={1000}
            placeholder={placeholder}
            value={entry[field]}
            onChange={(e) => patch({ [field]: e.target.value })}
          />
        </div>
      ))}

      <button className={`${ui.btn} ${ui.btnBig} ${styles.save}`} type="submit">
        {t.save}
      </button>
      <span className={styles.saved} role="status">
        {saved ? t.saved : ""}
      </span>
    </form>
  );
}

export default function Evening({
  locale,
  dict,
}: {
  locale: Locale;
  dict: EveningDict;
}) {
  const t = dict.evening;
  const ready = useStoreReady();
  const now = useNow();
  const journal = useStore((s) => s.journal);
  const today = now ? dayKey(now) : "";
  const history = Object.keys(journal).sort().reverse().slice(0, 14);

  return (
    <>
      {/* Форма создаётся после чтения хранилища: так она стартует с уже сохранённой записью дня. */}
      {ready && today ? (
        <Form
          key={today}
          day={today}
          initial={journal[today] ?? blank}
          dict={dict}
        />
      ) : (
        <div className={styles.form} aria-busy="true" />
      )}

      <section className={ui.col}>
        <h2 className={ui.h2}>
          {t.historyTitle[0]} <b>{t.historyTitle[1]}</b>
        </h2>
        <ul className={`${ui.list} ${styles.history}`}>
          {history.length === 0 && (
            <li>
              <span className={ui.muted}>{t.historyEmpty}</span>
            </li>
          )}
          {history.map((key) => {
            const j = journal[key];
            const bits = [
              j.urge !== null && `${t.urgeShort} ${j.urge}/5`,
              `${t.prayersShort} ${j.prayers.length}/5`,
              j.triggers
                .map(
                  (id) =>
                    dict.triggerNames[id as keyof Dict["triggerNames"]] ?? id,
                )
                .join(", "),
            ].filter(Boolean);
            return (
              <li key={key}>
                <div className={styles.head}>
                  <span>
                    {keyDate(key).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "long",
                      weekday: "short",
                    })}
                  </span>
                  {j.clean && (
                    <span
                      className={`${styles.badge} ${j.clean === "yes" ? styles.ok : ""}`}
                    >
                      {j.clean === "yes" ? t.badgeClean : t.badgeRelapse}
                    </span>
                  )}
                </div>
                <span className={`${ui.small} ${ui.muted}`}>
                  {bits.join(" · ")}
                </span>
                {j.tomorrow && (
                  <span className={ui.small}>
                    {t.tomorrowShort} {j.tomorrow}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
