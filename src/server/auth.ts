import "server-only";
import {
  createHash,
  randomBytes,
  scrypt as scryptCb,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { connect, isConfigured } from "./db";
import { Session, User, type UserDoc } from "./models";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const COOKIE = "sabr_session";
// Сессия скользящая: каждый заход продлевает её, так что активного пользователя не выкидывает.
const SESSION_DAYS = 365;
const DAY_MS = 86_400_000;

export const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export const newToken = () => randomBytes(32).toString("base64url");

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await scrypt(
    password,
    Buffer.from(salt, "base64"),
    expected.length,
  );
  return timingSafeEqual(expected, actual);
}

export const validEmail = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const validPassword = (value: unknown): value is string =>
  typeof value === "string" && value.length >= 8 && value.length <= 200;
export const cleanName = (value: unknown) =>
  typeof value === "string" ? value.trim().slice(0, 40) : "";

export async function createSession(userId: UserDoc["_id"]) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY_MS);
  await Session.create({ tokenHash: sha256(token), userId, expiresAt });
  await setCookie(token, expiresAt);
}

async function setCookie(token: string, expires: Date) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token && isConfigured()) {
    await connect();
    await Session.deleteOne({ tokenHash: sha256(token) });
  }
  store.delete(COOKIE);
}

/** Текущий пользователь по cookie сессии или null. */
export async function currentUser(): Promise<UserDoc | null> {
  if (!isConfigured()) return null;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  await connect();
  const session = await Session.findOne({
    tokenHash: sha256(token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;
  // Продлеваем не чаще раза в сутки, чтобы не писать в базу на каждый запрос.
  if (session.expiresAt.getTime() - Date.now() < (SESSION_DAYS - 1) * DAY_MS) {
    const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY_MS);
    await Session.updateOne({ _id: session._id }, { expiresAt });
    await setCookie(token, expiresAt).catch(() => {});
  }
  return User.findById(session.userId).lean<UserDoc>();
}

export const publicUser = (user: UserDoc) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified === true,
  createdAt:
    (user as UserDoc & { createdAt?: Date }).createdAt?.getTime() ?? null,
});
