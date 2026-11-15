import { destroySession } from "@/server/auth";
import { fail, json, sameOrigin } from "@/server/http";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail("forbidden", 403);
  await destroySession();
  return json({ ok: true });
}
