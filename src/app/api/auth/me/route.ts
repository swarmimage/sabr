import { cleanName, currentUser, publicUser } from "@/server/auth";
import { isConfigured } from "@/server/db";
import { fail, json, readBody, sameOrigin } from "@/server/http";
import { User } from "@/server/models";

export async function GET() {
  if (!isConfigured())
    return json({ user: null, configured: false, ai: false });
  const user = await currentUser();
  return json({
    user: user ? publicUser(user) : null,
    configured: true,
    ai: Boolean(process.env.ANTHROPIC_API_KEY),
  });
}

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return fail("forbidden", 403);
  const user = await currentUser();
  if (!user) return fail("unauthorized", 401);
  const name = cleanName((await readBody(request))?.name);
  if (!name) return fail("invalid_input");
  await User.updateOne({ _id: user._id }, { name });
  return json({ user: publicUser({ ...user, name }) });
}
