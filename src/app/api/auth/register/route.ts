import {
  cleanName,
  createSession,
  hashPassword,
  publicUser,
  validEmail,
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
import { User, type UserDoc } from "@/server/models";
import { queueVerification } from "@/server/verify";

export async function POST(request: Request) {
  if (!isConfigured()) return fail("not_configured", 503);
  if (!sameOrigin(request)) return fail("forbidden", 403);
  if (!rateLimit(`register:${clientIp(request)}`, 10, 3_600_000))
    return fail("rate_limited", 429);

  const body = await readBody(request);
  const name = cleanName(body?.name);
  if (
    !body ||
    !name ||
    !validEmail(body.email) ||
    !validPassword(body.password)
  )
    return fail("invalid_input");

  await connect();
  const email = body.email.toLowerCase().trim();
  if (await User.exists({ email })) return fail("email_taken", 409);

  const user = await User.create({
    name,
    email,
    passwordHash: await hashPassword(body.password),
  });
  await createSession(user._id);
  // Вход сразу, без ожидания письма; подтверждение нужно для восстановления пароля.
  await queueVerification(user, body.locale).catch((error) =>
    console.error("[verify] queue failed", error),
  );
  return json({ user: publicUser(user.toObject() as UserDoc) }, 201);
}
