"use client";

import { useSyncExternalStore } from "react";
import { getServerState, getState, isReady, subscribe } from "./store";
import type { AppState } from "./types";

/** Подписка на часть состояния. Селектор должен возвращать стабильное значение. */
export function useStore<T>(selector: (state: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(getServerState()),
  );
}

/** true после того, как состояние прочитано из IndexedDB. */
export function useStoreReady(): boolean {
  return useSyncExternalStore(subscribe, isReady, () => false);
}
