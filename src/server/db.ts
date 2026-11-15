import "server-only";
import dns from "node:dns";
import mongoose from "mongoose";

// Только dev: DNS некоторых роутеров/мобильных сетей не отвечает на SRV-запросы (mongodb+srv://).
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

/** Настроен ли бэкенд. Без MONGODB_URI приложение остаётся полностью локальным. */
export const isConfigured = () => Boolean(process.env.MONGODB_URI);

// Одно соединение на процесс: в dev модуль перезагружается, поэтому кэш лежит в globalThis.
const cache = globalThis as unknown as { __sabrDb?: Promise<typeof mongoose> };

export function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  cache.__sabrDb ??= mongoose
    .connect(uri, { serverSelectionTimeoutMS: 5000 })
    .catch((error) => {
      cache.__sabrDb = undefined;
      throw error;
    });
  return cache.__sabrDb;
}
