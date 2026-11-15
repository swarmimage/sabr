"use client";

import { useSyncExternalStore } from "react";
import { api } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number | null;
}

export interface AuthState {
  /** loading: ещё не знаем; guest: не вошёл; user: вошёл. */
  status: "loading" | "guest" | "user";
  user: User | null;
  /** Настроен ли бэкенд (MongoDB). false: аккаунты недоступны, приложение локальное. */
  configured: boolean;
  /** Доступны ли ИИ-функции на сервере. */
  ai: boolean;
}

interface Me {
  user: User | null;
  configured: boolean;
  ai: boolean;
}

const initial: AuthState = {
  status: "loading",
  user: null,
  configured: false,
  ai: false,
};
let state = initial;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function set(next: AuthState) {
  state = next;
  listeners.forEach((l) => l());
}

const fromMe = (me: Me): AuthState => ({
  status: me.user ? "user" : "guest",
  user: me.user,
  configured: me.configured,
  ai: me.ai,
});

function load() {
  loading ??= api<Me>("/api/auth/me")
    .then((me) => set(fromMe(me)))
    // Нет сети: считаем гостем, приложение работает локально.
    .catch(() => set({ ...initial, status: "guest" }));
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  void load();
  return () => {
    listeners.delete(listener);
  };
}

export const getAuth = () => state;
export const onAuthChange = subscribe;
export const useAuth = () =>
  useSyncExternalStore(subscribe, getAuth, () => initial);

const signedIn = (user: User) =>
  set({ ...state, status: "user", user, configured: true });

export async function login(email: string, password: string) {
  signedIn(
    (
      await api<{ user: User }>("/api/auth/login", {
        method: "POST",
        body: { email, password },
      })
    ).user,
  );
}

export async function register(name: string, email: string, password: string) {
  signedIn(
    (
      await api<{ user: User }>("/api/auth/register", {
        method: "POST",
        body: { name, email, password },
      })
    ).user,
  );
}

export async function resetPassword(token: string, password: string) {
  signedIn(
    (
      await api<{ user: User }>("/api/auth/reset", {
        method: "POST",
        body: { token, password },
      })
    ).user,
  );
}

export async function rename(name: string) {
  signedIn(
    (
      await api<{ user: User }>("/api/auth/me", {
        method: "PATCH",
        body: { name },
      })
    ).user,
  );
}

export async function logout() {
  await api("/api/auth/logout", { method: "POST" }).catch(() => {});
  set({ ...state, status: "guest", user: null });
}

export async function deleteAccount(password: string) {
  await api("/api/account", { method: "DELETE", body: { password } });
  set({ ...state, status: "guest", user: null });
}
