"use client";

import { useState } from "react";
import IfThen from "@/components/IfThen";
import type { Dict } from "@/i18n/config";
import { pad } from "@/lib/format";
import { addRule, removeRule, setDanger, setLetter } from "@/lib/store/store";
import { useStore, useStoreReady } from "@/lib/store/useStore";
import form from "@/styles/form.module.scss";
import ui from "@/styles/ui.module.scss";

type PlanDict = Pick<Dict, "plan" | "common" | "dow" | "evening">;

function Letter({ initial, dict }: { initial: string; dict: PlanDict }) {
  const t = dict.plan;
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(false);
  return (
    <section className={`${ui.card} ${ui.light}`}>
      <h2 className={ui.h2}>
        {t.letterTitle[0]} <b>{t.letterTitle[1]}</b>
      </h2>
      <p className={`${ui.muted} ${ui.small}`}>{t.letterLead}</p>
      <label className={ui.srOnly} htmlFor="letter">
        {t.letterTitle.join(" ")}
      </label>
      <textarea
        id="letter"
        className={`${form.textarea} ${form.onLight}`}
        style={{ minHeight: 120 }}
        maxLength={800}
        placeholder={t.letterPlaceholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
      />
      <div className={ui.row}>
        <button
          className={`${ui.btn} ${ui.btnSolid}`}
          onClick={() => {
            setLetter(text);
            setSaved(true);
          }}
        >
          {t.letterSave}
        </button>
        <span className={`${ui.small} ${ui.muted}`} role="status">
          {saved ? dict.evening.saved : ""}
        </span>
      </div>
    </section>
  );
}

export default function Plan({ dict }: { dict: PlanDict }) {
  const t = dict.plan;
  const ready = useStoreReady();
  const rules = useStore((s) => s.rules);
  const letter = useStore((s) => s.letter);
  const danger = useStore((s) => s.danger);
  const [condition, setCondition] = useState("");
  const [action, setAction] = useState("");
  const labels = { if: t.if, then: t.then };

  return (
    <>
      <section className={ui.col} style={{ gap: 14 }}>
        {ready && rules.length === 0 && (
          <p className={ui.muted}>{t.rulesEmpty}</p>
        )}
        {rules.map((rule, i) => (
          <article key={`${i}-${rule.if}`} className={ui.card}>
            <div className={`${ui.row} ${ui.spread}`}>
              <span className={ui.tag}>
                {t.rule} {pad(i + 1)}
              </span>
              <button className={ui.link} onClick={() => removeRule(i)}>
                {dict.common.remove}
              </button>
            </div>
            <IfThen rule={rule} labels={labels} />
          </article>
        ))}
      </section>

      <form
        className={ui.card}
        onSubmit={(e) => {
          e.preventDefault();
          if (addRule(condition, action)) {
            setCondition("");
            setAction("");
          }
        }}
      >
        <span className={ui.tag}>{t.newRule}</span>
        <div className={form.field}>
          <label
            className={ui.lab}
            htmlFor="rule-if"
            style={{ fontWeight: 300 }}
          >
            {t.if}
          </label>
          <input
            id="rule-if"
            className={ui.input}
            maxLength={140}
            placeholder={t.ifPlaceholder}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
        </div>
        <div className={form.field}>
          <label
            className={ui.lab}
            htmlFor="rule-then"
            style={{ fontWeight: 800, color: "var(--yellow)" }}
          >
            {t.then}
          </label>
          <input
            id="rule-then"
            className={ui.input}
            maxLength={140}
            placeholder={t.thenPlaceholder}
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>
        <div className={ui.row}>
          <button className={`${ui.btn} ${ui.btnPrimary}`} type="submit">
            {t.addRule}
          </button>
        </div>
      </form>

      {/* Создаётся после чтения хранилища, чтобы поле стартовало с сохранённым текстом. */}
      {ready && <Letter initial={letter} dict={dict} />}

      <section className={ui.card}>
        <h2 className={ui.h2}>
          {t.dangerTitle[0]} <b>{t.dangerTitle[1]}</b>
        </h2>
        <p className={`${ui.muted} ${ui.small}`}>{t.dangerLead}</p>
        <div className={form.seg}>
          <button
            type="button"
            aria-pressed={danger.on}
            onClick={() => setDanger({ on: true })}
          >
            {t.on}
          </button>
          <button
            type="button"
            aria-pressed={!danger.on}
            onClick={() => setDanger({ on: false })}
          >
            {t.off}
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {(["from", "to"] as const).map((field) => (
            <div key={field} className={form.field}>
              <label className={ui.lab} htmlFor={`danger-${field}`}>
                {t[field]}
              </label>
              <input
                id={`danger-${field}`}
                className={ui.input}
                type="time"
                value={danger[field]}
                onChange={(e) =>
                  /^\d\d:\d\d$/.test(e.target.value) &&
                  setDanger({ [field]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <div className={form.field}>
          <span className={ui.lab}>{t.daysLabel}</span>
          <div className={form.pills}>
            {dict.dow.map((name, day) => (
              <button
                key={name}
                type="button"
                aria-pressed={danger.days.includes(day)}
                onClick={() =>
                  setDanger({
                    days: danger.days.includes(day)
                      ? danger.days.filter((d) => d !== day)
                      : [...danger.days, day],
                  })
                }
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
