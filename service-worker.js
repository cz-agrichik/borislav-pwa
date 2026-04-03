const CACHE_NAME = "app-v10";

const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",

  "/user.js",
  "/problems.js",
  "/stats.js",
  "/stats-ui.js",

  "/course.js",
  "/addition.js",

  "/chess-ui.js",
  "/chess-utils.js",
  "/moves_all.js",

  "/queen_capture.js",
  "/rook_capture.js",
  "/bishop_capture.js",
  "/knight_capture.js",
  "/king_capture.js",
  "/pawn_capture.js",

  "/rook_mate.js",
  "/queen_mate.js",
  "/linear_mate_rook.js",
  "/kq_squeeze_all.js",

  "/robux-48.png",

  // шахматы
  "/chesspieces/wP.png",
  "/chesspieces/wR.png",
  "/chesspieces/wN.png",
  "/chesspieces/wB.png",
  "/chesspieces/wQ.png",
  "/chesspieces/wK.png",

  "/chesspieces/bP.png",
  "/chesspieces/bR.png",
  "/chesspieces/bN.png",
  "/chesspieces/bB.png",
  "/chesspieces/bQ.png",
  "/chesspieces/bK.png",
];

// install
self.addEventListener("install", (e) => {
  self.skipWaiting(); // 🔥 сразу активируем новую версию

  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// activate
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );

  self.clients.claim(); // 🔥 сразу берём контроль
});

// fetch
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});