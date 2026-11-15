import {
  createSession,
  hashPassword,
  publicUser,
  sha256,
  validPassword,
} from "@/server/auth";
import { connect, isConfigured } from "@/server/db";
import {
  clientIp,
  fail,
  json,
  rateLimit,
  readBody,
  sameOrigin,
} from "@/server/http";
import { ResetToken, Session, User, type UserDoc } from "@/server/models";

export async function POST(request: Request) {
  if (!isConfigured()) return fail("not_configured", 503);
  if (!sameOrigin(request)) return fail("forbidden", 403);
  if (!rateLimit(`reset:${clientIp(request)}`, 10, 3_600_000))
    return fail("rate_limited", 429);

  const body = await readBody(request);
  if (!body || typeof body.token !== "string" || !validPassword(body.password))
    return fail("invalid_input");

  await connect();
  const record = await ResetToken.findOneAndDelete({
    tokenHash: sha256(body.token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!record) return fail("invalid_token");

  const user = await User.findByIdAndUpdate(
    record.userId,
    { passwordHash: await hashPassword(body.password) },
    { new: true },
  ).lean<UserDoc>();
  if (!user) return fail("invalid_token");

  // Смена пароля завершает все старые сессии.
  await Session.deleteMany({ userId: user._id });
  await createSession(user._id);
  return json({ user: publicUser(user) });
}
