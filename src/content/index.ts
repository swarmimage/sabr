import type { Locale } from "@/i18n/config";
import * as ru from "./ru";
import * as uz from "./uz";

export type Content = typeof ru;
export type { Dhikr, Dua, Quote, Story } from "./ru";

const content: Record<Locale, Content> = { ru, uz };

/** Единая точка получения контента: позже здесь может появиться загрузка с бэкенда. */
export const getContent = (locale: Locale): Content => content[locale];
