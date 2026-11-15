/* Сервис-воркер «Сабр»: приложение открывается и работает без сети.
   При изменении стратегии кэша увеличь VERSION: старые кэши удалятся при активации. */
const VERSION = "v1";
const SHELL = `sabr-shell-${VERSION}`;
const ASSETS = `sabr-assets-${VERSION}`;

const LOCALES = ["ru", "uz"];
const SCREENS = ["", "/dua", "/tasbih", "/knowledge", "/evening", "/map", "/plan", "/sos", "/profile"];
const PAGES = LOCALES.flatMap((l) => SCREENS.map((s) => `/${l}${s}`));

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      // allSettled: одна недоступная страница не срывает установку
      .then((cache) => Promise.allSettled(PAGES.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const isAsset = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/icons/") ||
  /\.(?:woff2?|png|ico|svg|css|js)$/.test(url.pathname);

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(ASSETS)).put(request, response.clone());
  return response;
}

async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(SHELL)).put(request, response.clone());
    return response;
  } catch (error) {
    const cached = (await caches.match(request)) ?? (fallbackUrl && (await caches.match(fallbackUrl)));
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // API всегда идёт в сеть: личные данные и ответы ИИ не кэшируются.
  if (url.pathname.startsWith("/api/")) return;

  if (isAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (request.mode === "navigate") {
    const locale = LOCALES.find((l) => url.pathname === `/${l}` || url.pathname.startsWith(`/${l}/`)) ?? "ru";
    event.respondWith(networkFirst(request, `/${locale}`));
    return;
  }
  // Данные переходов между экранами (RSC): свежие из сети, из кэша без неё.
  event.respondWith(networkFirst(request));
});
