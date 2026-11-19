"use client";

import { useEffect } from "react";
import { hasSeen, markSeen } from "@/lib/seen";
import { getState, hydrate } from "@/lib/store/store";

const KNOWN_KEYS = ["sabr:user", "sabr:owner"];

function knownOnDevice() {
  try {
    return KNOWN_KEYS.some((key) => localStorage.getItem(key) !== null);
  } catch {
    return false;
  }
}

/**
 * Главная до входа открылась на /ru или /uz, а человек уже пользовался приложением
 * (данные появились раньше метки или роутер отдал старый кэш):
 * ставим метку и перезагружаем адрес, тогда proxy откроет «Сегодня».
 */
export default function ReturnGuard({ home }: { home: string }) {
  useEffect(() => {
    if (window.location.pathname !== home) return;
    let cancelled = false;
    const go = () => {
      if (cancelled) return;
      markSeen();
      window.location.replace(home);
    };
    if (hasSeen() || knownOnDevice()) {
      go();
      return;
    }
    void hydrate().then(() => {
      const s = getState();
      if (s.start !== null || s.updatedAt > 0) go();
    });
    return () => {
      cancelled = true;
    };
  }, [home]);
  return null;
}
