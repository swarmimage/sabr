"use client";

import { markSeen } from "@/lib/seen";

// Ставится при загрузке модуля, до гидрации и префетча ссылок: иначе роутер
// успел бы закэшировать главную до входа вместо экрана «Сегодня».
if (typeof document !== "undefined") markSeen();

/** Любой экран приложения отмечает, что человек уже внутри. */
export default function SeenMark() {
  return null;
}
