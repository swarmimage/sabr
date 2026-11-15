"use client";

import { useEffect } from "react";
import { startSync } from "@/lib/sync";

/** Фоновые службы страницы: синхронизация с аккаунтом и сервис-воркер (только в production). */
export default function ServiceWorker() {
  useEffect(() => {
    startSync();
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      /* без сервис-воркера приложение работает как обычный сайт */
    });
  }, []);
  return null;
}
