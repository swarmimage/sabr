import "server-only";

export const json = (data: unknown, status = 200) =>
  Response.json(data, { status });
export const fail = (code: string, status = 400) =>
  Response.json({ error: code }, { status });

/** Изменяющие запросы принимаем только со своего сайта (защита от CSRF поверх SameSite-cookie). */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // не браузерный клиент: cookie сессии он не получит
  try {
    return (
      new URL(origin).host ===
      (request.headers.get("x-forwarded-host") ?? request.headers.get("host"))
    );
  } catch {
    return false;
  }
}

/** Читает JSON-тело с ограничением размера. null: тело не JSON, не объект или слишком большое. */
export async function readBody(
  request: Request,
  maxBytes = 16_000,
): Promise<Record<string, unknown> | null> {
  try {
    const text = await request.text();
    if (text.length > maxBytes) return null;
    const data: unknown = JSON.parse(text);
    return data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";

/* Ограничение частоты в памяти процесса. Для нескольких инстансов нужен общий стор (Redis). */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000)
    for (const [k, v] of hits)
      if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}
