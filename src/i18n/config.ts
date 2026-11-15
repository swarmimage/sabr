import type { Dict } from "./dictionaries/ru";

export const locales = ["ru", "uz"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

const loaders: Record<Locale, () => Promise<Dict>> = {
  ru: () => import("./dictionaries/ru").then((m) => m.default),
  uz: () => import("./dictionaries/uz").then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dict> =>
  loaders[locale]();
export type { Dict };
