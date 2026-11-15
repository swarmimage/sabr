"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import RelapseDialog from "@/components/RelapseDialog";
import type { Dict, Locale } from "@/i18n/config";
import { fill, formatDuration, pad } from "@/lib/format";
import { logWin, relapse } from "@/lib/store/store";
import { useAuth } from "@/lib/auth/authStore";
import { useStore } from "@/lib/store/useStore";
import { useNow } from "@/lib/useNow";
import ui from "@/styles/ui.module.scss";
import SosChat from "./SosChat";
import {
  beginSos,
  getServerSession,
  getSession,
  subscribe,
  toggleStep,
} from "./session";
import styles from "./SosScreen.module.scss";

const LENGTH = 600_000; // 10 минут
const BREATH = 14; // 4 вдох + 4 задержка + 6 выдох

export default function SosScreen({
  locale,
  steps,
  dict,
}: {
  locale: Locale;
  steps: string[];
  dict: Pick<Dict, "sos" | "relapse" | "common" | "days" | "brand" | "chat">;
}) {
  const t = dict.sos;
  const router = useRouter();
  const now = useNow();
  const session = useSyncExternalStore(subscribe, getSession, getServerSession);
  const start = useStore((s) => s.start);
  const winsTotal = useStore((s) => s.winsTotal);
  const reasons = useStore((s) => s.reasons);
  const rules = useStore((s) => s.rules);
  const letter = useStore((s) => s.letter);
  const aiAllowed = useStore((s) => s.ai);
  const auth = useAuth();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    beginSos();
  }, []);

  const active = session.start > 0 && now > 0;
  const left = active ? Math.max(0, LENGTH - (now - session.start)) : LENGTH;
  const seconds = Math.ceil(left / 1000);
  const phase = active ? ((now - session.start) / 1000) % BREATH : 0;
  const breath =
    left <= 0 ? t.done : t.breath[phase < 4 ? 0 : phase < 8 ? 1 : 2];

  // Свои правила «если — то» идут первыми, затем общие шаги.
  const items = [
    ...rules.map((r) => ({
      mine: true,
      text: `${t.ruleIf} ${r.if} → ${r.then}`,
    })),
    ...steps.map((text) => ({ mine: false, text })),
  ];
  const doneCount = session.done.filter((i) => i < items.length).length;

  const words = {
    days: dict.days,
    hours: dict.common.hours,
    minutes: dict.common.minutes,
  };

  return (
    <div className={`${ui.light} ${styles.screen}`}>
      <div className={styles.inner}>
        <header className={styles.top}>
          <span className={styles.logo} aria-hidden="true">
            {"//"}
          </span>
          <span className={styles.rule} />
          <span className={styles.name}>{t.button}</span>
          <Link
            className={styles.close}
            href={`/${locale}`}
            aria-label={dict.common.close}
          >
            <Icon name="close" size={20} />
          </Link>
        </header>

        <div className={ui.col} style={{ gap: 8 }}>
          <h1 className={styles.title}>
            {t.title[0]}
            <b>
              <span>{t.title[1]}</span>
            </b>
          </h1>
          <p className={ui.lead}>{t.lead}</p>
        </div>

        <section className={styles.clock}>
          <span className={styles.big} role="timer">
            {pad(Math.floor(seconds / 60))}:{pad(seconds % 60)}
          </span>
          <span className={styles.breath}>{breath}</span>
          <div className={styles.clockRule} />
          <div className={ui.ar} lang="ar">
            أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ
          </div>
          <span className={styles.translit}>{t.translit}</span>
        </section>

        {letter && (
          <section className={styles.letter}>
            <span className={ui.lab} style={{ fontWeight: 800 }}>
              {t.letterLabel}
            </span>
            <p>{letter}</p>
          </section>
        )}

        <section className={styles.lose}>
          <span className={ui.eyebrow}>{t.loseLabel}</span>
          <b>
            {start !== null && now > 0
              ? fill(t.loseRunning, { t: formatDuration(now - start, words) })
              : t.loseIdle}
          </b>
          <span className={ui.muted}>
            {winsTotal > 0 ? fill(t.winsSome, { n: winsTotal }) : t.winsNone}
          </span>
        </section>

        {auth.status === "user" && auth.ai && aiAllowed && (
          <SosChat
            locale={locale}
            dict={dict.chat}
            context={{
              timeLeft: `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`,
              streak:
                start !== null && now > 0
                  ? formatDuration(now - start, words)
                  : "",
              wins: winsTotal,
              reasons,
              left: items
                .filter((_, i) => !session.done.includes(i))
                .map((item) => item.text),
              done: items
                .filter((_, i) => session.done.includes(i))
                .map((item) => item.text),
            }}
          />
        )}

        <section className={ui.col}>
          <h2 className={ui.h2}>
            {t.checkTitle[0]} <b>{t.checkTitle[1]}</b>
          </h2>
          <ul className={styles.check}>
            {items.map((item, i) => {
              const done = session.done.includes(i);
              return (
                <li key={item.text}>
                  <label
                    className={`${item.mine ? styles.mine : ""} ${done ? styles.done : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleStep(i)}
                    />
                    <span>{item.text}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <span className={`${ui.small} ${ui.muted}`}>
            {fill(t.progress, { a: doneCount, b: items.length })}
          </span>
        </section>

        {reasons.length > 0 && (
          <section className={ui.col}>
            <h2 className={ui.h2}>
              {t.reasonsTitle[0]} <b>{t.reasonsTitle[1]}</b>
            </h2>
            <ul className={ui.list}>
              {reasons.map((reason, i) => (
                <li key={`${i}-${reason}`}>
                  <span className={ui.num}>{pad(i + 1)}</span>
                  <span className={ui.grow}>{reason}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className={ui.col}>
          <button
            className={`${ui.btn} ${ui.btnSolid} ${ui.btnBig}`}
            onClick={() => {
              logWin();
              router.push(`/${locale}/tasbih`);
            }}
          >
            {t.won}
          </button>
          <button className={ui.link} onClick={() => setConfirming(true)}>
            {t.fell}
          </button>
        </div>
      </div>

      {confirming && (
        <RelapseDialog
          dict={dict.relapse}
          cancel={dict.common.cancel}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            relapse();
            router.push(`/${locale}/dua`);
          }}
        />
      )}
    </div>
  );
}
