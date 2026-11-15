"use client";

import { useState, type ReactNode } from "react";
import styles from "./Tabs.module.scss";

/** Переключатель панелей. Панели рендерятся на сервере, здесь только выбор активной. */
export default function Tabs({
  labels,
  children,
}: {
  labels: string[];
  children: ReactNode[];
}) {
  const [active, setActive] = useState(0);
  return (
    <>
      <div className={styles.seg} role="tablist">
        {labels.map((label, i) => (
          <button
            key={label}
            role="tab"
            id={`tab-${i}`}
            aria-selected={i === active}
            aria-controls={`panel-${i}`}
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {children.map((panel, i) => (
        <div
          key={labels[i]}
          role="tabpanel"
          id={`panel-${i}`}
          aria-labelledby={`tab-${i}`}
          className={styles.panel}
          hidden={i !== active}
        >
          {panel}
        </div>
      ))}
    </>
  );
}
