import "server-only";
import { after } from "next/server";
import type { Types } from "mongoose";
import { newToken, sha256 } from "./auth";
import { sendVerifyEmail } from "./mail";
import { VerifyToken } from "./models";

/** Создаёт токен подтверждения и отправляет письмо после ответа клиенту. */
export async function queueVerification(
  user: { _id: Types.ObjectId; email: string },
  locale: unknown,
) {
  const lang = locale === "uz" ? "uz" : "ru";
  const token = newToken();
  await VerifyToken.deleteMany({ userId: user._id });
  await VerifyToken.create({
    tokenHash: sha256(token),
    userId: user._id,
    email: user.email,
    expiresAt: new Date(Date.now() + 86_400_000),
  });
  const link = `${process.env.APP_URL ?? ""}/${lang}/login?verify=${token}`;
  // Сбой почты не ломает регистрацию: аккаунт уже создан, письмо можно запросить заново.
  after(() =>
    sendVerifyEmail(user.email, link, lang).catch((error) =>
      console.error("[mail] send failed", error),
    ),
  );
}
