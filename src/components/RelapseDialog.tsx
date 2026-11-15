"use client";

import type { Dict } from "@/i18n/config";
import ui from "@/styles/ui.module.scss";
import styles from "./RelapseDialog.module.scss";

export default function RelapseDialog({
  dict,
  cancel,
  onConfirm,
  onCancel,
}: {
  dict: Dict["relapse"];
  cancel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="relapse-title"
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
    >
      <div className={`${ui.card} ${ui.light} ${styles.box}`}>
        <h2 className={ui.h2} id="relapse-title" style={{ fontSize: 20 }}>
          {dict.title[0]} <b>{dict.title[1]}</b>
        </h2>
        <p>{dict.text}</p>
        <p className={`${ui.muted} ${ui.small}`}>{dict.hint}</p>
        <div className={ui.row}>
          <button
            className={`${ui.btn} ${ui.btnSolid}`}
            onClick={onConfirm}
            autoFocus
          >
            {dict.yes}
          </button>
          <button className={ui.btn} onClick={onCancel}>
            {cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
