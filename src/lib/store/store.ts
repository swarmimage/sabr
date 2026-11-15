import { get, set } from "idb-keyval";
import { initialState, type AppState } from "./types";

/**
 * Local-first хранилище: состояние живёт в памяти, каждое изменение
 * пишется в IndexedDB. Сервер (этап 7) будет только синхронизировать этот же объект.
 */
const KEY = "sabr.state.v1";
const SAVE_DELAY = 400;

let state: AppState = initialState;
let ready = false;
let hydrating: Promise<void> | null = null;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    set(KEY, state).catch(() => {
      /* приватный режим или переполнение: продолжаем работать в памяти */
    });
  }, SAVE_DELAY);
}

export function hydrate(): Promise<void> {
  hydrating ??= get<Partial<AppState>>(KEY)
    .then((saved) => {
      if (saved && typeof saved === "object")
        state = { ...initialState, ...saved };
    })
    .catch(() => {})
    .then(() => {
      ready = true;
      emit();
    });
  return hydrating;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  void hydrate();
  return () => {
    listeners.delete(listener);
  };
}

export const getState = () => state;
export const getServerState = () => initialState;
export const isReady = () => ready;

/** Заменить состояние целиком: версия с сервера оказалась новее локальной. */
export function replaceState(next: Partial<AppState>) {
  state = { ...initialState, ...next };
  emit();
  persist();
}

/** Стереть локальные данные (удаление аккаунта или «начать с чистого листа»). */
export function resetState() {
  state = initialState;
  emit();
  persist();
}

export function update(recipe: (prev: AppState) => Partial<AppState>) {
  state = { ...state, ...recipe(state), updatedAt: Date.now() };
  emit();
  persist();
}

/* ---------- Действия ---------- */

export function startStreak(at: number = Date.now()) {
  update(() => ({ start: at, celebrated: { start: at, days: [] } }));
}

export function relapse() {
  update((s) => {
    const now = Date.now();
    const length = s.start ? now - s.start : 0;
    return {
      best: Math.max(s.best, length),
      relapses: [...s.relapses, now].slice(-200),
      start: now,
      celebrated: { start: now, days: [] },
    };
  });
}

export function addReason(text: string) {
  const value = text.trim().slice(0, 160);
  if (!value) return;
  update((s) => ({ reasons: [...s.reasons, value].slice(0, 20) }));
}

export function removeReason(index: number) {
  update((s) => ({ reasons: s.reasons.filter((_, i) => i !== index) }));
}

/** Отметить рубеж (и все меньшие) как показанный для текущей серии. */
export function markCelebrated(day: number, all: number[]) {
  update((s) => ({
    celebrated: {
      start: s.start ?? 0,
      days: [
        ...new Set([...s.celebrated.days, ...all.filter((d) => d <= day)]),
      ],
    },
  }));
}

export function logSos(at: number) {
  update((s) => ({ sos: [...s.sos, at].slice(-500) }));
}

export function logWin() {
  update((s) => ({
    wins: [...s.wins, Date.now()].slice(-500),
    winsTotal: s.winsTotal + 1,
  }));
}

/* ---------- Чётки ---------- */

function tasbihFor(s: AppState, today: string) {
  return s.tasbih.date === today
    ? s.tasbih
    : { ...s.tasbih, date: today, counts: {} };
}

export function tasbihTap(id: string, today: string) {
  update((s) => {
    const t = tasbihFor(s, today);
    return {
      tasbih: { ...t, counts: { ...t.counts, [id]: (t.counts[id] ?? 0) + 1 } },
    };
  });
}

export function tasbihReset(id: string, today: string) {
  update((s) => {
    const t = tasbihFor(s, today);
    return { tasbih: { ...t, counts: { ...t.counts, [id]: 0 } } };
  });
}

export function tasbihSelect(id: string) {
  update((s) => ({ tasbih: { ...s.tasbih, selected: id } }));
}

/* ---------- Итог дня, план, опасное время ---------- */

export function saveJournal(day: string, entry: AppState["journal"][string]) {
  update((s) => {
    const journal = { ...s.journal, [day]: entry };
    // Храним не больше 120 последних дней.
    for (const key of Object.keys(journal).sort().slice(0, -120))
      delete journal[key];
    return { journal };
  });
}

export function addRule(condition: string, action: string) {
  const rule = {
    if: condition.trim().slice(0, 140),
    then: action.trim().slice(0, 140),
  };
  if (!rule.if || !rule.then) return false;
  update((s) => ({ rules: [...s.rules, rule].slice(0, 12) }));
  return true;
}

export function removeRule(index: number) {
  update((s) => ({ rules: s.rules.filter((_, i) => i !== index) }));
}

export function setLetter(text: string) {
  update(() => ({ letter: text.trim().slice(0, 800) }));
}

export function setDanger(patch: Partial<AppState["danger"]>) {
  update((s) => ({ danger: { ...s.danger, ...patch } }));
}

export function setAi(enabled: boolean) {
  update(() => ({ ai: enabled }));
}
