/** Одна запись вечернего самоанализа. Ключ в журнале: YYYY-MM-DD по местному времени. */
export interface JournalEntry {
  clean: "yes" | "no" | null;
  urge: number | null;
  triggers: string[];
  prayers: string[];
  helped: string;
  thanks: string;
  tomorrow: string;
  at: number;
}

export interface Rule {
  if: string;
  then: string;
}

export interface DangerHours {
  on: boolean;
  /** "HH:MM" */
  from: string;
  to: string;
  /** 0 = понедельник … 6 = воскресенье */
  days: number[];
}

export interface AppState {
  /** Начало текущей серии, мс. null: отсчёт не запущен. */
  start: number | null;
  /** Лучшая завершённая серия, мс. */
  best: number;
  relapses: number[];
  wins: number[];
  winsTotal: number;
  /** Моменты нажатия SOS: из них строится карта триггеров. */
  sos: number[];
  reasons: string[];
  rules: Rule[];
  letter: string;
  danger: DangerHours;
  /** Какие рубежи текущей серии уже отмечены. */
  celebrated: { start: number; days: number[] };
  tasbih: { date: string; counts: Record<string, number>; selected: string };
  journal: Record<string, JournalEntry>;
  /** Разрешена ли помощь ИИ (разговор в SOS, разбор недели). */
  ai: boolean;
  updatedAt: number;
}

export const initialState: AppState = {
  start: null,
  best: 0,
  relapses: [],
  wins: [],
  winsTotal: 0,
  sos: [],
  reasons: [],
  rules: [],
  letter: "",
  danger: { on: false, from: "23:00", to: "01:00", days: [4, 5, 6] },
  celebrated: { start: 0, days: [] },
  tasbih: { date: "", counts: {}, selected: "subhan" },
  journal: {},
  ai: true,
  updatedAt: 0,
};
