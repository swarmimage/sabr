import { logSos } from "@/lib/store/store";

/** Одна сессия SOS живёт в памяти: старт 10-минутного отсчёта и отмеченные шаги. */
interface Session {
  start: number;
  done: readonly number[];
}

const empty: Session = { start: 0, done: [] };
let session: Session = empty;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getSession = () => session;
export const getServerSession = () => empty;

/** Начать новую сессию. Повторный вызов в ту же секунду (StrictMode) игнорируется. */
export function beginSos() {
  const now = Date.now();
  if (now - session.start < 1000) return;
  session = { start: now, done: [] };
  logSos(now);
  emit();
}

export function toggleStep(index: number) {
  const done = session.done.includes(index)
    ? session.done.filter((i) => i !== index)
    : [...session.done, index];
  session = { ...session, done };
  emit();
}
