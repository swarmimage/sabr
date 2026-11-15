import { currentUser, destroySession, verifyPassword } from "@/server/auth";
import { fail, json, readBody, sameOrigin } from "@/server/http";
import { ResetToken, Session, User, UserState } from "@/server/models";

/** Удаляет аккаунт и всё, что с ним связано. Требует текущий пароль. */
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return fail("forbidden", 403);
  const user = await currentUser();
  if (!user) return fail("unauthorized", 401);
  const body = await readBody(request);
  if (
    typeof body?.password !== "string" ||
    !(await verifyPassword(body.password, user.passwordHash))
  )
    return fail("invalid_credentials", 401);

  await Promise.all([
    UserState.deleteOne({ userId: user._id }),
    Session.deleteMany({ userId: user._id }),
    ResetToken.deleteMany({ userId: user._id }),
  ]);
  await User.deleteOne({ _id: user._id });
  await destroySession();
  return json({ ok: true });
}
