import { sha256 } from "@/server/auth";
import { connect, isConfigured } from "@/server/db";
import {
  clientIp,
  fail,
  json,
  rateLimit,
  readBody,
  sameOrigin,
} from "@/server/http";
import { User, VerifyToken } from "@/server/models";

/** Подтверждение по ссылке из письма. POST, а не GET: почтовые сканеры ссылок не должны гасить токен. */
export async function POST(request: Request) {
  if (!isConfigured()) return fail("not_configured", 503);
  if (!sameOrigin(request)) return fail("forbidden", 403);
  if (!rateLimit(`verify:${clientIp(request)}`, 20, 3_600_000))
    return fail("rate_limited", 429);

  const body = await readBody(request);
  if (!body || typeof body.token !== "string") return fail("invalid_input");

  await connect();
  const record = await VerifyToken.findOneAndDelete({
    tokenHash: sha256(body.token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!record) return fail("invalid_verify");

  // Адрес в токене должен совпадать с текущим адресом аккаунта.
  const result = await User.updateOne(
    { _id: record.userId, email: record.email },
    { emailVerified: true },
  );
  if (!result.matchedCount) return fail("invalid_verify");
  return json({ ok: true });
}
