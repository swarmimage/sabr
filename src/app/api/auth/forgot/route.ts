import { after } from "next/server";
import { newToken, sha256, validEmail } from "@/server/auth";
import { connect, isConfigured } from "@/server/db";
import {
  clientIp,
  fail,
  json,
  rateLimit,
  readBody,
  sameOrigin,
} from "@/server/http";
import { sendResetEmail } from "@/server/mail";
import { ResetToken, User } from "@/server/models";

export async function POST(request: Request) {
  if (!isConfigured()) return fail("not_configured", 503);
  if (!sameOrigin(request)) return fail("forbidden", 403);
  if (!rateLimit(`forgot:${clientIp(request)}`, 5, 3_600_000))
    return fail("rate_limited", 429);

  const body = await readBody(request);
  if (body && validEmail(body.email)) {
    await connect();
    const user = await User.findOne({
      email: body.email.toLowerCase().trim(),
    }).lean();
    if (user) {
      const token = newToken();
      await ResetToken.deleteMany({ userId: user._id });
      await ResetToken.create({
        tokenHash: sha256(token),
        userId: user._id,
        expiresAt: new Date(Date.now() + 3_600_000),
      });
      const locale = body.locale === "uz" ? "uz" : "ru";
      const link = `${process.env.APP_URL ?? ""}/${locale}/login?reset=${token}`;
      // Письмо уходит после ответа: SMTP медленный, а ожидание его по времени выдало бы,
      // что такая почта зарегистрирована. Сбой почты тоже не меняет ответ.
      after(() =>
        sendResetEmail(user.email, link, locale).catch((error) =>
          console.error("[mail] send failed", error),
        ),
      );
    }
  }
  // Ответ одинаковый, есть такая почта или нет: по нему нельзя проверить, кто зарегистрирован.
  return json({ ok: true });
}
