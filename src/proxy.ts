import { NextResponse, type NextRequest } from "next/server";
import { SEEN_COOKIE } from "@/lib/seen";

/** Первый визит на /ru или /uz: показываем главную до входа, адрес в строке не меняется. */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SEEN_COOKIE)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `${url.pathname}/welcome`;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/ru", "/uz"] };
