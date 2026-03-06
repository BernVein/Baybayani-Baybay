const CACHE_NAME = "baybayani-v2";
const ASSETS_TO_CACHE = [
	"/",
	"/index.html",
	"/manifest.json",
	"/baybayani.svg",
	"/login_image.jpg",
	"/cover.jpg",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(ASSETS_TO_CACHE);
		}),
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				}),
			);
		}),
	);
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	if (event.request.mode === "navigate") {
		// Network-first for navigation (HTML) requests
		event.respondWith(
			fetch(event.request).catch(() => caches.match(event.request)),
		);
		return;
	}

	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		}),
	);
});
