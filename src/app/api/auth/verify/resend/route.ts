import { currentUser } from "@/server/auth";
import { connect, isConfigured } from "@/server/db";
import { fail, json, rateLimit, readBody, sameOrigin } from "@/server/http";
import { queueVerification } from "@/server/verify";

export async function POST(request: Request) {
  if (!isConfigured()) return fail("not_configured", 503);
  if (!sameOrigin(request)) return fail("forbidden", 403);
  const user = await currentUser();
  if (!user) return fail("unauthorized", 401);
  if (user.emailVerified === true) return json({ ok: true });
  if (!rateLimit(`verify-resend:${String(user._id)}`, 3, 3_600_000))
    return fail("rate_limited", 429);

  await connect();
  await queueVerification(user, (await readBody(request))?.locale);
  return json({ ok: true });
}
