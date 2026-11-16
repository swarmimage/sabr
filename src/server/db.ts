import "server-only";
import { Resolver } from "node:dns/promises";
import mongoose from "mongoose";

/** Настроен ли бэкенд. Без MONGODB_URI приложение остаётся полностью локальным. */
export const isConfigured = () => Boolean(process.env.MONGODB_URI);

/**
 * Только dev: DNS некоторых роутеров/мобильных сетей не отвечает на SRV-запросы (mongodb+srv://).
 * Глобальный dns.setServers внутри Next не срабатывает, поэтому SRV и TXT резолвим отдельным
 * Resolver через публичные DNS и собираем обычный mongodb://-адрес.
 */
async function expandSrv(uri: string) {
  if (process.env.NODE_ENV === "production" || !uri.startsWith("mongodb+srv://"))
    return uri;
  const url = new URL(uri);
  const resolver = new Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);
  const [srv, txt] = await Promise.all([
    resolver.resolveSrv(`_mongodb._tcp.${url.hostname}`),
    resolver.resolveTxt(url.hostname).catch(() => [] as string[][]),
  ]);
  const hosts = srv.map((r) => `${r.name}:${r.port}`).join(",");
  const params = new URLSearchParams(txt.flat().join("&"));
  params.set("tls", "true");
  for (const [key, value] of url.searchParams) params.set(key, value);
  const auth = url.username
    ? `${url.username}${url.password ? `:${url.password}` : ""}@`
    : "";
  return `mongodb://${auth}${hosts}${url.pathname}?${params}`;
}

// Одно соединение на процесс: в dev модуль перезагружается, поэтому кэш лежит в globalThis.
const cache = globalThis as unknown as { __sabrDb?: Promise<typeof mongoose> };

export function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  cache.__sabrDb ??= expandSrv(uri)
    .then((resolved) =>
      mongoose.connect(resolved, { serverSelectionTimeoutMS: 5000 }),
    )
    .catch((error) => {
      cache.__sabrDb = undefined;
      throw error;
    });
  return cache.__sabrDb;
}
