import "server-only";

export const aiConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY);

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Один запрос к Claude Messages API. Ключ живёт только на сервере. */
export async function askClaude(
  system: string,
  messages: ChatMessage[],
  maxTokens: number,
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
      max_tokens: maxTokens,
      system,
      messages,
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Claude API ${response.status}`);
  const data = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };
  return (data.content ?? [])
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("")
    .trim();
}

/** Обрезает пользовательские строки перед вставкой в промпт. */
export const clip = (value: unknown, max: number) =>
  typeof value === "string" ? value.slice(0, max) : "";
export const clipList = (
  value: unknown,
  maxItems: number,
  maxLength: number,
) =>
  Array.isArray(value)
    ? value
        .slice(0, maxItems)
        .map((v) => clip(v, maxLength))
        .filter(Boolean)
    : [];

export const languageName = (locale: unknown) =>
  locale === "uz" ? "узбекском (латиница)" : "русском";
