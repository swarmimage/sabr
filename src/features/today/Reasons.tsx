"use client";

import { useState } from "react";
import type { Dict } from "@/i18n/config";
import { pad } from "@/lib/format";
import { addReason, removeReason } from "@/lib/store/store";
import { useStore } from "@/lib/store/useStore";
import ui from "@/styles/ui.module.scss";

export default function Reasons({
  dict,
}: {
  dict: Pick<Dict, "today" | "common">;
}) {
  const t = dict.today;
  const reasons = useStore((s) => s.reasons);
  const [draft, setDraft] = useState("");

  return (
    <section className={ui.col}>
      <h2 className={ui.h2}>
        {t.reasonsTitle[0]} <b>{t.reasonsTitle[1]}</b>
      </h2>
      <ul className={ui.list}>
        {reasons.length === 0 && (
          <li>
            <span className={ui.muted}>{t.reasonsEmpty}</span>
          </li>
        )}
        {reasons.map((reason, i) => (
          <li key={`${i}-${reason}`}>
            <span className={ui.num}>{pad(i + 1)}</span>
            <span className={ui.grow}>{reason}</span>
            <button
              className={ui.link}
              style={{ minHeight: 32 }}
              onClick={() => removeReason(i)}
            >
              {dict.common.remove}
            </button>
          </li>
        ))}
      </ul>
      <form
        className={ui.row}
        onSubmit={(e) => {
          e.preventDefault();
          addReason(draft);
          setDraft("");
        }}
      >
        <label className={ui.srOnly} htmlFor="reason-input">
          {t.reasonLabel}
        </label>
        <input
          id="reason-input"
          className={`${ui.input} ${ui.grow}`}
          style={{ minWidth: 160 }}
          maxLength={160}
          placeholder={t.reasonPlaceholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button className={ui.btn} type="submit">
          {dict.common.add}
        </button>
      </form>
    </section>
  );
}
