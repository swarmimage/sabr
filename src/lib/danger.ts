import type { DangerHours } from "./store/types";

const minutes = (hm: string) => {
  const [h, m] = hm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

/** День недели: 0 = понедельник … 6 = воскресенье. */
export const weekday = (date: Date) => (date.getDay() + 6) % 7;

/**
 * Попадает ли момент в опасное окно. Окно может переходить через полночь
 * (23:00–01:00): тогда часы после полуночи относятся к предыдущему дню.
 */
export function isDangerTime(now: number, zone: DangerHours): boolean {
  if (!zone.on || !zone.days.length || !now) return false;
  const date = new Date(now);
  const m = date.getHours() * 60 + date.getMinutes();
  const from = minutes(zone.from);
  const to = minutes(zone.to);
  let day = weekday(date);
  if (from === to) return false;
  if (from < to) {
    if (m < from || m >= to) return false;
  } else if (m >= from) {
    // вечерняя часть окна, день тот же
  } else if (m < to) {
    day = (day + 6) % 7;
  } else {
    return false;
  }
  return zone.days.includes(day);
}

/** Полосы суток для карты триггеров: [начало, конец) в часах и окно для «опасного времени». */
export const BANDS = [
  { from: "06:00", to: "12:00" },
  { from: "12:00", to: "18:00" },
  { from: "18:00", to: "23:00" },
  { from: "23:00", to: "02:00" },
] as const;

/** Ячейка карты для момента времени: [полоса, день недели]. Ночь до 06:00 относится к предыдущему дню. */
export function slotOf(ts: number): [number, number] {
  const date = new Date(ts);
  const h = date.getHours();
  const band =
    h >= 6 && h < 12 ? 0 : h >= 12 && h < 18 ? 1 : h >= 18 && h < 23 ? 2 : 3;
  const day = weekday(date);
  return [band, band === 3 && h < 6 ? (day + 6) % 7 : day];
}
