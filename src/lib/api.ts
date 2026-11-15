/** Ошибка API: code — машинный код из ответа сервера ({ error: "…" }) или "network". */
export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
  }
}

export async function api<T>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: init?.method ?? "GET",
      headers:
        init?.body === undefined
          ? undefined
          : { "content-type": "application/json" },
      body: init?.body === undefined ? undefined : JSON.stringify(init.body),
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError("network", 0);
  }
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok)
    throw new ApiError(data.error ?? "unknown", response.status);
  return data as T;
}
