"use client";

import { api } from "@/lib/api";
import { getAuth, onAuthChange } from "@/lib/auth/authStore";
import { getState, hydrate, replaceState, subscribe } from "@/lib/store/store";
import type { AppState } from "@/lib/store/types";

/**
 * Синхронизация local-first: локальное состояние главное для интерфейса,
 * сервер хранит его копию. Побеждает версия с более поздним updatedAt.
 */
const PUSH_DELAY = 2500;
let started = false;
let syncedFor: string | null = null;
let pushedAt = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
let busy = false;

interface Remote {
  state: Partial<AppState> | null;
  updatedAt: number;
}

async function push() {
  if (busy || getAuth().status !== "user") return;
  const local = getState();
  if (!local.updatedAt || local.updatedAt === pushedAt) return;
  busy = true;
  try {
    const result = await api<{ saved: boolean } & Remote>("/api/state", {
      method: "PUT",
      body: { state: local },
    });
    if (result.saved) pushedAt = local.updatedAt;
    else if (result.state) {
      pushedAt = result.updatedAt;
      replaceState(result.state);
    }
  } catch {
    // нет сети или сервер недоступен: попробуем при следующем изменении
  } finally {
    busy = false;
  }
  if (getState().updatedAt !== pushedAt) schedule();
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(push, PUSH_DELAY);
}

async function pull() {
  const { user } = getAuth();
  if (!user || syncedFor === user.id) return;
  syncedFor = user.id;
  await hydrate();
  try {
    const remote = await api<Remote>("/api/state");
    if (remote.state && remote.updatedAt > getState().updatedAt) {
      pushedAt = remote.updatedAt;
      replaceState(remote.state);
    } else {
      await push();
    }
  } catch {
    syncedFor = null;
  }
}

/** Запускается один раз на странице. */
export function startSync() {
  if (started) return;
  started = true;
  onAuthChange(() => {
    if (getAuth().status === "user") void pull();
    else syncedFor = null;
  });
  subscribe(() => {
    if (getAuth().status === "user" && syncedFor) schedule();
  });
  // Вернулись в приложение на этом устройстве: забираем изменения с других.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && getAuth().status === "user") {
      syncedFor = null;
      void pull();
    }
  });
}
