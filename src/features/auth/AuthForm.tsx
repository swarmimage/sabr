"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import type { Dict, Locale } from "@/i18n/config";
import { api, ApiError } from "@/lib/api";
import {
  login,
  register,
  resetPassword,
  useAuth,
  verifyEmail,
} from "@/lib/auth/authStore";
import form from "@/styles/form.module.scss";
import ui from "@/styles/ui.module.scss";
import styles from "./AuthForm.module.scss";

type Mode = "login" | "register";
type AuthDict = Pick<Dict, "auth" | "titles" | "brand">;

const noop = () => () => {};
/** Токен из ссылки в письме (?reset=… или ?verify=…). Читается только в браузере. */
const useQueryToken = (key: string) =>
  useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get(key) ?? "",
    () => "",
  );

export default function AuthForm({
  mode,
  locale,
  dict,
}: {
  mode: Mode;
  locale: Locale;
  dict: AuthDict;
}) {
  const t = dict.auth;
  const router = useRouter();
  const auth = useAuth();
  const resetToken = useQueryToken("reset");
  const verifyToken = useQueryToken("verify");
  const resetting = mode === "login" && resetToken !== "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const message = (e: unknown) => {
    const code = e instanceof ApiError ? e.code : "unknown";
    return t.errors[code as keyof typeof t.errors] ?? t.errors.unknown;
  };

  // Ссылка из письма подтверждения: гасим токен один раз и убираем его из адреса.
  const verifying = useRef(false);
  useEffect(() => {
    if (mode !== "login" || !verifyToken || verifying.current) return;
    verifying.current = true;
    verifyEmail(verifyToken)
      .then(() => setNotice(t.verifyDone))
      .catch((e) => setError(message(e)))
      .finally(() => window.history.replaceState(null, "", `/${locale}/login`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, verifyToken]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (resetting) await resetPassword(resetToken, password);
      else if (mode === "register") await register(name, email, password, locale);
      else await login(email, password);
      router.replace(`/${locale}`);
    } catch (e) {
      setError(message(e));
      setBusy(false);
    }
  }

  async function forgot() {
    setError("");
    if (!email.trim()) return setNotice(t.forgotNeedEmail);
    try {
      await api("/api/auth/forgot", {
        method: "POST",
        body: { email, locale },
      });
      setNotice(t.forgotSent);
    } catch (e) {
      setError(message(e));
    }
  }

  const title = resetting ? [t.resetTitle, ""] : dict.titles[mode];
  const unavailable = auth.status !== "loading" && !auth.configured;

  return (
    <>
      <header className={styles.top}>
        <span className={styles.logo} aria-hidden="true">
          {"//"}
        </span>
        <span className={styles.rule} />
        <span className={styles.name}>{dict.brand}</span>
      </header>

      <div className={ui.col} style={{ gap: 8, paddingTop: 12 }}>
        <PageTitle thin={title[0]} bold={title[1]} />
        {!resetting && (
          <p className={ui.lead}>
            {mode === "register" ? t.registerLead : t.loginLead}
          </p>
        )}
      </div>

      {!resetting && (
        <nav className={`${form.seg} ${form.segNav}`}>
          <Link
            href={`/${locale}/register`}
            aria-current={mode === "register" ? "page" : undefined}
          >
            {t.tabRegister}
          </Link>
          <Link
            href={`/${locale}/login`}
            aria-current={mode === "login" ? "page" : undefined}
          >
            {t.tabLogin}
          </Link>
        </nav>
      )}

      {unavailable && <p className={styles.notice}>{t.notConfigured}</p>}

      <form className={ui.col} style={{ gap: 14 }} onSubmit={submit}>
        {mode === "register" && (
          <div className={form.field}>
            <label className={ui.lab} htmlFor="auth-name">
              {t.name}
            </label>
            <input
              id="auth-name"
              className={ui.input}
              autoComplete="nickname"
              maxLength={40}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        {!resetting && (
          <div className={form.field}>
            <label className={ui.lab} htmlFor="auth-email">
              {t.email}
            </label>
            <input
              id="auth-email"
              className={ui.input}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {mode === "register" && (
              <span className={ui.src}>{t.emailHint}</span>
            )}
          </div>
        )}
        <div className={form.field}>
          <label className={ui.lab} htmlFor="auth-password">
            {resetting ? t.newPassword : t.password}
          </label>
          <div className={styles.password}>
            <input
              id="auth-password"
              className={ui.input}
              type={visible ? "text" : "password"}
              autoComplete={
                mode === "login" && !resetting
                  ? "current-password"
                  : "new-password"
              }
              minLength={mode === "login" && !resetting ? undefined : 8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setVisible((v) => !v)}
            >
              {visible ? t.hide : t.show}
            </button>
          </div>
          {(mode === "register" || resetting) && (
            <span className={ui.src}>{t.passwordHint}</span>
          )}
          {mode === "login" && !resetting && (
            <button
              type="button"
              className={ui.link}
              style={{ alignSelf: "flex-start" }}
              onClick={forgot}
            >
              {t.forgot}
            </button>
          )}
        </div>

        {mode === "register" && <p className={ui.src}>{t.privacy}</p>}

        <p className={styles.error} role="alert">
          {error}
        </p>
        {notice && (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        )}

        <button
          className={`${ui.btn} ${ui.btnPrimary} ${styles.submit}`}
          type="submit"
          disabled={busy || unavailable}
        >
          {resetting ? t.resetSave : mode === "register" ? t.create : t.signIn}
        </button>
      </form>

      <div className={styles.foot}>
        {mode === "login" ? (
          <Link className={styles.sos} href={`/${locale}/sos`}>
            {t.sosLink}
          </Link>
        ) : (
          <>
            <Link href={`/${locale}`}>{t.guest}</Link>
            <span className={ui.src}>{t.guestNote}</span>
          </>
        )}
      </div>
    </>
  );
}
