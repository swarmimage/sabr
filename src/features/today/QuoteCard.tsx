"use client";

import { useState } from "react";
import type { Quote } from "@/content";
import { pad } from "@/lib/format";
import { useNow } from "@/lib/useNow";
import ui from "@/styles/ui.module.scss";
import styles from "./QuoteCard.module.scss";

const SLOT = 300_000; // новая цитата каждые 5 минут

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export default function QuoteCard({
  quotes,
  labels,
}: {
  quotes: Quote[];
  labels: { quoteIn: string; quoteNext: string };
}) {
  const now = useNow();
  const [skip, setSkip] = useState(0);

  // Шаг, взаимно простой с длиной списка: категории чередуются, повторов нет до полного круга.
  const step =
    [11, 13, 17, 7, 5, 3, 1].find((k) => gcd(k, quotes.length) === 1) ?? 1;
  const slot = Math.floor(now / SLOT);
  const quote = quotes[((slot + skip) * step) % quotes.length];
  const left = now ? SLOT - (now % SLOT) : SLOT;
  const seconds = Math.ceil(left / 1000);

  return (
    <article
      className={`${ui.card} ${ui.light} ${styles.quote}`}
      aria-live="polite"
    >
      <div className={`${ui.row} ${ui.spread}`}>
        <span className={ui.chip}>{quote.c}</span>
        <span className={`${ui.small} ${ui.muted}`}>
          {labels.quoteIn} {Math.floor(seconds / 60)}:{pad(seconds % 60)}
        </span>
      </div>
      <p>{quote.t}</p>
      {quote.s && <span className={ui.src}>{quote.s}</span>}
      <div className={`${ui.bar} ${ui.barThin}`}>
        <i style={{ width: `${((1 - left / SLOT) * 100).toFixed(1)}%` }} />
      </div>
      <div className={ui.row}>
        <button className={ui.btn} onClick={() => setSkip((n) => n + 1)}>
          {labels.quoteNext}
        </button>
      </div>
    </article>
  );
}
