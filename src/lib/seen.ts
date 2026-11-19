/**
 * Метка «уже заходил». Без неё proxy показывает на /ru и /uz главную до входа.
 * Cookie, а не IndexedDB: proxy должен решить до рендера, без мигания.
 */
export const SEEN_COOKIE = "sabr_seen";

export function markSeen() {
  try {
    document.cookie = `${SEEN_COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // cookie недоступны: человек снова увидит главную, не страшно
  }
}

export const hasSeen = () => {
  try {
    return document.cookie.split("; ").some((c) => c.startsWith(`${SEEN_COOKIE}=`));
  } catch {
    return false;
  }
};
