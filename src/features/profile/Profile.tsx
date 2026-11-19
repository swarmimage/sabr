"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { locales, type Dict, type Locale } from "@/i18n/config";
import { ApiError } from "@/lib/api";
import {
  deleteAccount,
  logout,
  rename,
  resendVerification,
  useAuth,
} from "@/lib/auth/authStore";
import { DAY, plural } from "@/lib/format";
import { getState, resetState, setAi } from "@/lib/store/store";
import { useStore, useStoreReady } from "@/lib/store/useStore";
import { useNow } from "@/lib/useNow";
import form from "@/styles/form.module.scss";
import ui from "@/styles/ui.module.scss";
import styles from "./Profile.module.scss";

type ProfileDict = Pick<
  Dict,
  "profile" | "auth" | "common" | "days" | "dow" | "today"
>;

const LANGUAGE_NAMES: Record<Locale, string> = {
  ru: "Русский",
  uz: "O‘zbekcha",
};
const MILESTONES = [7, 30, 40, 90];

function exportData() {
  const blob = new Blob([JSON.stringify(getState(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sabr-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

export default function Profile({
  locale,
  dict,
}: {
  locale: Locale;
  dict: ProfileDict;
}) {
  const t = dict.profile;
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const ready = useStoreReady();
  const now = useNow();
  const start = useStore((s) => s.start);
  const best = useStore((s) => s.best);
  const winsTotal = useStore((s) => s.winsTotal);
  const journalCount = useStore((s) => Object.keys(s.journal).length);
  const rules = useStore((s) => s.rules.length);
  const hasLetter = useStore((s) => s.letter !== "");
  const danger = useStore((s) => s.danger);
  const ai = useStore((s) => s.ai);

  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [wiping, setWiping] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verifyNote, setVerifyNote] = useState("");

  async function resend() {
    setVerifyNote("");
    try {
      await resendVerification(locale);
      setVerifyNote(dict.auth.verifySent);
    } catch (e) {
      const code = e instanceof ApiError ? e.code : "unknown";
      setVerifyNote(
        dict.auth.errors[code as keyof typeof dict.auth.errors] ??
          dict.auth.errors.unknown,
      );
    }
  }

  const user = auth.user;
  const days =
    ready && start !== null && now ? Math.floor((now - start) / DAY) : 0;
  const bestDays = Math.max(days, Math.floor(best / DAY));
  const stats: [string, string][] = [
    [`${days} ${dict.today.dayShort}`, t.statCurrent],
    [`${bestDays} ${dict.today.dayShort}`, t.statBest],
    [String(winsTotal), t.statWins],
    [String(journalCount), t.statJournal],
  ];
  const errorText = (e: unknown) => {
    const code = e instanceof ApiError ? e.code : "unknown";
    return (
      dict.auth.errors[code as keyof typeof dict.auth.errors] ??
      dict.auth.errors.unknown
    );
  };

  async function saveName(event: FormEvent) {
    event.preventDefault();
    if (nameDraft === null) return;
    try {
      await rename(nameDraft);
      setNameDraft(null);
      setError("");
    } catch (e) {
      setError(errorText(e));
    }
  }

  async function removeAccount(event: FormEvent) {
    event.preventDefault();
    try {
      await deleteAccount(password);
      resetState();
      router.replace(`/${locale}/register`);
    } catch (e) {
      setError(errorText(e));
    }
  }

  return (
    <>
      <header className={styles.identity}>
        <div className={styles.avatar}>
          {user ? (
            user.name.slice(0, 1).toUpperCase()
          ) : (
            <Icon name="user" size={30} />
          )}
        </div>
        <div className={styles.who}>
          <span className={styles.greeting}>{t.greeting}</span>
          <span className={styles.name}>{user ? user.name : t.guestName}</span>
          {user?.createdAt && (
            <span className={`${ui.small} ${ui.muted}`}>
              {t.since}{" "}
              {new Date(user.createdAt).toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
              })}
            </span>
          )}
        </div>
      </header>

      {auth.status === "guest" && (
        <section className={`${ui.card} ${ui.light}`}>
          <p>{auth.configured ? t.guestLead : dict.auth.notConfigured}</p>
          {auth.configured && (
            <div className={ui.row}>
              <Link
                className={`${ui.btn} ${ui.btnSolid}`}
                href={`/${locale}/register`}
              >
                {dict.auth.create}
              </Link>
              <Link className={ui.btn} href={`/${locale}/login`}>
                {dict.auth.signIn}
              </Link>
            </div>
          )}
        </section>
      )}

      <dl className={styles.stats}>
        {stats.map(([value, label], i) => (
          <div key={label} className={i === 0 ? styles.primary : undefined}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <section className={form.field}>
        <span className={ui.lab}>{t.milestones}</span>
        <div className={styles.milestones}>
          {MILESTONES.map((m) => (
            <span
              key={m}
              data-done={bestDays >= m}
              title={`${m} ${plural(m, dict.days)}`}
            >
              {m}
            </span>
          ))}
        </div>
      </section>

      <section className={form.field}>
        <span className={ui.lab}>{t.language}</span>
        <nav className={styles.languages} aria-label={t.language}>
          {locales.map((l) => (
            <Link
              key={l}
              href={pathname.replace(/^\/[^/]+/, `/${l}`)}
              aria-current={l === locale ? "page" : undefined}
              hrefLang={l}
            >
              {LANGUAGE_NAMES[l]}
            </Link>
          ))}
        </nav>
      </section>

      {user && (
        <section className={styles.group}>
          <span className={ui.lab}>{t.account}</span>
          {nameDraft === null ? (
            <button
              className={styles.line}
              onClick={() => setNameDraft(user.name)}
            >
              <span>{t.rename}</span>
              <span className={ui.muted}>
                {user.name} <Icon name="go" size={16} />
              </span>
            </button>
          ) : (
            <form
              className={`${styles.line} ${styles.edit}`}
              onSubmit={saveName}
            >
              <label className={ui.srOnly} htmlFor="profile-name">
                {t.rename}
              </label>
              <input
                id="profile-name"
                className={ui.input}
                maxLength={40}
                required
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
              />
              <button className={`${ui.btn} ${ui.btnPrimary}`} type="submit">
                {t.save}
              </button>
            </form>
          )}
          <div className={styles.line}>
            <span>{dict.auth.email}</span>
            <span className={ui.muted}>
              {user.email.replace(/^(.).*(@.*)$/, "$1•••$2")}
            </span>
          </div>
          {!user.emailVerified && (
            <div className={styles.line}>
              <span className={ui.muted}>{dict.auth.unverified}</span>
              <button type="button" className={ui.link} onClick={resend}>
                {dict.auth.verifyResend}
              </button>
            </div>
          )}
          {verifyNote && (
            <span className={ui.src} role="status">
              {verifyNote}
            </span>
          )}
        </section>
      )}

      <section className={styles.group}>
        <span className={ui.lab}>{t.plan}</span>
        <Link className={styles.line} href={`/${locale}/plan`}>
          <span>{t.rules}</span>
          <span className={styles.accent}>
            {rules} <Icon name="go" size={16} />
          </span>
        </Link>
        <Link className={styles.line} href={`/${locale}/plan`}>
          <span>{t.letter}</span>
          <span className={ui.muted}>
            {hasLetter ? t.letterSet : t.letterEmpty}{" "}
            <Icon name="go" size={16} />
          </span>
        </Link>
        <Link className={styles.line} href={`/${locale}/plan`}>
          <span>{t.dangerTime}</span>
          <span className={ui.muted}>
            {danger.on
              ? `${danger.days.map((d) => dict.dow[d]).join(", ")} · ${danger.from}–${danger.to}`
              : t.off}{" "}
            <Icon name="go" size={16} />
          </span>
        </Link>
        <label className={styles.line}>
          <span>{t.ai}</span>
          <input
            type="checkbox"
            checked={ai}
            onChange={(e) => setAi(e.target.checked)}
          />
        </label>
      </section>

      <section className={styles.group}>
        <span className={ui.lab}>{t.data}</span>
        <button className={styles.line} onClick={exportData}>
          <span>{t.export}</span>
          <Icon name="go" size={16} />
        </button>
        {!wiping ? (
          <button className={styles.line} onClick={() => setWiping(true)}>
            <span>{t.wipe}</span>
            <Icon name="go" size={16} />
          </button>
        ) : (
          <div className={`${styles.line} ${styles.confirm}`}>
            <p>{t.wipeConfirm}</p>
            <div className={ui.row}>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={() => {
                  resetState();
                  setWiping(false);
                }}
              >
                {t.yes}
              </button>
              <button className={ui.btn} onClick={() => setWiping(false)}>
                {dict.common.cancel}
              </button>
            </div>
          </div>
        )}
        {user &&
          (!deleting ? (
            <button className={styles.line} onClick={() => setDeleting(true)}>
              <span>{t.deleteAccount}</span>
              <Icon name="go" size={16} />
            </button>
          ) : (
            <form
              className={`${styles.line} ${styles.confirm}`}
              onSubmit={removeAccount}
            >
              <p>{t.deleteLead}</p>
              <label className={ui.srOnly} htmlFor="delete-password">
                {dict.auth.password}
              </label>
              <input
                id="delete-password"
                className={ui.input}
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className={ui.row}>
                <button className={`${ui.btn} ${ui.btnPrimary}`} type="submit">
                  {t.deleteConfirm}
                </button>
                <button
                  className={ui.btn}
                  type="button"
                  onClick={() => setDeleting(false)}
                >
                  {dict.common.cancel}
                </button>
              </div>
            </form>
          ))}
      </section>

      <p className={styles.error} role="alert">
        {error}
      </p>

      {user && (
        <button
          className={`${ui.btn} ${ui.btnBig}`}
          onClick={() =>
            logout().then(() => router.replace(`/${locale}/login`))
          }
        >
          {t.logout}
        </button>
      )}
    </>
  );
}
