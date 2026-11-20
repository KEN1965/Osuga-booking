// 駅前集会所 予約アプリ用
// アイコン類だけを手元に置き、画面（index.html）は常に新しいものを取りに行く。
// 古い画面が残ってしまう事故を防ぐため、ページ本体はキャッシュしない。
const CACHE = "osuga-v1";
const STATIC_FILES = ["icon-192.png", "icon-512.png", "icon-180.png", "manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const isStatic = STATIC_FILES.some((f) => url.pathname.endsWith("/" + f));
  if (isStatic) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
    return;
  }
  // それ以外はネットワーク優先（取れない時だけ手元のコピーを出す）
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
