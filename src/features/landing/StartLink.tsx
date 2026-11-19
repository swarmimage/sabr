"use client";

import type { ReactNode } from "react";
import { markSeen } from "@/lib/seen";

/**
 * Вход в приложение с главной. Обычная ссылка, не next/link: нужен полный переход,
 * чтобы proxy уже увидел метку и отдал «Сегодня», а не закэшированную главную.
 */
export default function StartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={markSeen}>
      {children}
    </a>
  );
}
