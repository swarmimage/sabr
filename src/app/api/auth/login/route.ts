import {
  createSession,
  publicUser,
  validEmail,
  verifyPassword,
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
import { User, type UserDoc } from "@/server/models";

export async function POST(request: Request) {
  if (!isConfigured()) return fail("not_configured", 503);
  if (!sameOrigin(request)) return fail("forbidden", 403);

  const body = await readBody(request);
  if (!body || !validEmail(body.email) || typeof body.password !== "string")
    return fail("invalid_credentials", 401);
  const email = body.email.toLowerCase().trim();
  // Лимит и по адресу, и по почте: перебор пароля одного аккаунта с разных IP тоже упирается в него.
  if (
    !rateLimit(`login:${clientIp(request)}`, 20, 900_000) ||
    !rateLimit(`login:${email}`, 8, 900_000)
  )
    return fail("rate_limited", 429);

  await connect();
  const user = await User.findOne({ email }).lean<UserDoc>();
  // Одинаковый ответ для «нет такой почты» и «неверный пароль».
  if (!user || !(await verifyPassword(body.password, user.passwordHash)))
    return fail("invalid_credentials", 401);

  await createSession(user._id);
  return json({ user: publicUser(user) });
}
