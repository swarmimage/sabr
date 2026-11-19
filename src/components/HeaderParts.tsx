"use client";

import Link from "next/link";
import type { Dict, Locale } from "@/i18n/config";
import { useAuth } from "@/lib/auth/authStore";
import { DAY, plural } from "@/lib/format";
import { useStore, useStoreReady } from "@/lib/store/useStore";
import { useNow } from "@/lib/useNow";
import Icon from "./Icon";
import styles from "./Header.module.scss";

/** Имя из аккаунта; гостю обращение из словаря. Пока не знаем, пусто, чтобы не мигало. */
function useName(guest: string) {
  const auth = useAuth();
  if (auth.status === "loading") return "";
  return auth.user?.name.trim() || guest;
}

export function Avatar({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const auth = useAuth();
  const initial = auth.user?.name.trim().charAt(0).toUpperCase();
  return (
    <Link
      className={`${styles.avatar} ${className ?? ""}`}
      href={`/${locale}/profile`}
      aria-label={label}
    >
      {initial || <Icon name="user" size={20} />}
    </Link>
  );
}

export function Greeting({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict["greet"];
}) {
  const name = useName(dict.guest);
  const now = useNow();
  const date = now
    ? new Date(now).toLocaleDateString(locale, {
        weekday: "short",
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <div className={styles.greet}>
      {/* Телефон: две строки, имя крупно */}
      <span className={styles.hello}>{dict.hello},</span>
      <span className={styles.name}>{name}</span>
      {/* Веб: одна строка с датой */}
      <span className={styles.line}>
        {date && `${date} · `}
        {dict.hello}
        {name && `, ${name}`}
      </span>
    </div>
  );
}

export function Streak({
  dict,
  days: forms,
}: {
  dict: Dict["greet"];
  days: Dict["days"];
}) {
  const ready = useStoreReady();
  const start = useStore((s) => s.start);
  const now = useNow();
  if (!ready || start === null || !now) return null;
  const days = Math.floor(Math.max(0, now - start) / DAY);
  return (
    <span className={styles.streak}>
      {dict.streak}{" "}
      <b>
        {days} {plural(days, forms)}
      </b>
    </span>
  );
}
