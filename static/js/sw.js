self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("news-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/static/css/style.css",
                "/static/js/app.js",
            ]).catch((error) => {
                console.error("Cache addAll failed:", error);
            });
        })
    );
});
