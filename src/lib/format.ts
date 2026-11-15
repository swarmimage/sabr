export const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

/** Русское склонение по числу; для языков без форм передай три одинаковых слова. */
export function plural(n: number, forms: [string, string, string]) {
  const m = n % 100;
  const k = n % 10;
  if (m > 10 && m < 20) return forms[2];
  if (k === 1) return forms[0];
  if (k >= 2 && k <= 4) return forms[1];
  return forms[2];
}

export const DAY = 86_400_000;
export const MILESTONES = [1, 3, 7, 14, 21, 30, 40, 60, 90, 120, 180, 365];

export function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hms: `${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`,
  };
}

/** Следующий рубеж и доля пути к нему от предыдущего. */
export function milestoneProgress(ms: number) {
  const d = ms / DAY;
  let prev = 0;
  for (const next of MILESTONES) {
    if (d < next) return { next, percent: ((d - prev) / (next - prev)) * 100 };
    prev = next;
  }
  return { next: null, percent: 100 };
}

/** Ключ дня по местному времени: YYYY-MM-DD. */
export function dayKey(ms: number) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** «12 дней 7 ч» / «3 ч 20 мин» / «14 мин». */
export function formatDuration(
  ms: number,
  words: { days: [string, string, string]; hours: string; minutes: string },
) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d} ${plural(d, words.days)} ${h} ${words.hours}`;
  if (h > 0) return `${h} ${words.hours} ${m} ${words.minutes}`;
  return `${m} ${words.minutes}`;
}

/** Подстановка в строку словаря: fill("Сделано {a} из {b}", { a: 1, b: 9 }). */
export function fill(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? ""),
  );
}
