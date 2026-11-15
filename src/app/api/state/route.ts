import { currentUser } from "@/server/auth";
import { fail, json, readBody, sameOrigin } from "@/server/http";
import { UserState } from "@/server/models";

const MAX_BYTES = 512_000;

export async function GET() {
  const user = await currentUser();
  if (!user) return fail("unauthorized", 401);
  const doc = await UserState.findOne({ userId: user._id }).lean();
  return json({ state: doc?.state ?? null, updatedAt: doc?.updatedAt ?? 0 });
}

/**
 * Сохраняет состояние, если оно новее серверного (last-write-wins по updatedAt).
 * Если на сервере версия новее, возвращает её: клиент заменит свою.
 */
export async function PUT(request: Request) {
  if (!sameOrigin(request)) return fail("forbidden", 403);
  const user = await currentUser();
  if (!user) return fail("unauthorized", 401);

  const body = await readBody(request, MAX_BYTES);
  const state = body?.state;
  if (!state || typeof state !== "object" || Array.isArray(state))
    return fail("invalid_input");
  const updatedAt = Number((state as { updatedAt?: unknown }).updatedAt);
  if (!Number.isFinite(updatedAt) || updatedAt <= 0)
    return fail("invalid_input");

  const existing = await UserState.findOne({ userId: user._id }).lean();
  if (existing && existing.updatedAt > updatedAt)
    return json({
      saved: false,
      state: existing.state,
      updatedAt: existing.updatedAt,
    });

  await UserState.updateOne(
    { userId: user._id },
    { state, updatedAt },
    { upsert: true },
  );
  return json({ saved: true, updatedAt });
}
