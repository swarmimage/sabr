"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Icon from "@/components/Icon";
import type { Dict, Locale } from "@/i18n/config";
import { api, ApiError } from "@/lib/api";
import ui from "@/styles/ui.module.scss";
import styles from "./SosChat.module.scss";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatContext {
  timeLeft: string;
  streak: string;
  wins: number;
  reasons: string[];
  left: string[];
  done: string[];
}

/** Разговор с ИИ внутри SOS. Переписка живёт только в памяти этой сессии. */
export default function SosChat({
  locale,
  dict,
  context,
}: {
  locale: Locale;
  dict: Dict["chat"];
  context: ChatContext;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [messages, busy, error]);

  async function send(text: string) {
    const content = text.trim().slice(0, 400);
    if (!content || busy) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setError("");
    setBusy(true);
    try {
      const { text: answer } = await api<{ text: string }>("/api/ai/chat", {
        method: "POST",
        body: { messages: next.slice(-12), context: { ...context, locale } },
      });
      setMessages([
        ...next,
        { role: "assistant", content: answer || dict.fallback },
      ]);
    } catch (e) {
      // Сообщение без ответа убираем из истории: следующий запрос должен заканчиваться репликой пользователя.
      setMessages(messages);
      setError(
        e instanceof ApiError && e.code === "rate_limited"
          ? dict.busy
          : dict.failed,
      );
    } finally {
      setBusy(false);
    }
  }

  if (!open)
    return (
      <button className={ui.btn} onClick={() => setOpen(true)}>
        {dict.open}
      </button>
    );

  return (
    <section className={styles.chat}>
      <div className={styles.messages} ref={list} aria-live="polite">
        <p className={styles.bubble}>{dict.hello}</p>
        {messages.map((m, i) => (
          <p
            key={i}
            className={`${styles.bubble} ${m.role === "user" ? styles.mine : ""}`}
          >
            {m.content}
          </p>
        ))}
        {busy && <p className={styles.bubble}>…</p>}
        {error && <p className={styles.bubble}>{error}</p>}
      </div>
      <div className={styles.quick}>
        {dict.quick.map((text, i) => (
          <button key={text} disabled={busy} onClick={() => send(text)}>
            {dict.quickLabels[i]}
          </button>
        ))}
      </div>
      <form
        className={styles.form}
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <label className={ui.srOnly} htmlFor="chat-input">
          {dict.label}
        </label>
        <input
          id="chat-input"
          maxLength={400}
          placeholder={dict.placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" aria-label={dict.send} disabled={busy}>
          <Icon name="up" size={20} />
        </button>
      </form>
      <span className={`${ui.small} ${ui.muted}`}>{dict.note}</span>
    </section>
  );
}
