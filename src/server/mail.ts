import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Почта через SMTP (nodemailer). Настройки берутся из переменных окружения:
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM.
 * Без SMTP_HOST письма не отправляются: в разработке ссылка печатается в консоль сервера.
 */
export const mailConfigured = () => Boolean(process.env.SMTP_HOST);

let transporter: Transporter | undefined;

function getTransporter() {
  const port = Number(process.env.SMTP_PORT) || 587;
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465: TLS сразу; 587 и 25: STARTTLS
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" }
      : undefined,
  });
  return transporter;
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ]!,
  );

// Тема и текст нейтральные: по письму нельзя понять, о чём приложение.
const texts = {
  ru: {
    subject: "Смена пароля",
    intro: "Вы запросили смену пароля. Ссылка действует один час:",
    button: "Задать новый пароль",
    outro:
      "Если это были не вы, просто проигнорируйте письмо: пароль останется прежним.",
  },
  uz: {
    subject: "Parolni almashtirish",
    intro:
      "Siz parolni almashtirishni so‘radingiz. Havola bir soat amal qiladi:",
    button: "Yangi parol o‘rnatish",
    outro:
      "Agar bu siz bo‘lmasangiz, xatga e’tibor bermang: parol o‘zgarmaydi.",
  },
};

export async function sendResetEmail(
  to: string,
  link: string,
  locale: "ru" | "uz" = "ru",
) {
  if (!mailConfigured()) {
    if (process.env.NODE_ENV !== "production")
      console.info(`[mail] reset link for ${to}: ${link}`);
    else
      console.warn("[mail] SMTP is not configured: reset email was not sent");
    return;
  }
  const t = texts[locale];
  const href = escapeHtml(link);
  await getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: t.subject,
    text: `${t.intro}\n\n${link}\n\n${t.outro}`,
    html: `<div style="font-family:system-ui,Arial,sans-serif;font-size:16px;line-height:1.5;color:#0a3a2d;max-width:480px">
<p>${t.intro}</p>
<p><a href="${href}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#0f4d3c;color:#ffd23f;text-decoration:none;font-weight:700">${t.button}</a></p>
<p style="font-size:13px;color:#3f6b5e;word-break:break-all">${href}</p>
<p style="font-size:13px;color:#3f6b5e">${t.outro}</p>
</div>`,
  });
}
