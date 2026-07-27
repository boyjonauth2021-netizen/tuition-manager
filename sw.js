/* Network-first for app shell so Install always gets latest index.html */
var CACHE = "tuition-manager-v2";
var PRECACHE = [
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(PRECACHE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) {
        return caches.delete(k);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

function isAppShell(req) {
  if (req.mode === "navigate") return true;
  var url = new URL(req.url);
  var path = url.pathname;
  return path.endsWith("/") || path.endsWith("/index.html") || /\/index\.html$/i.test(path);
}

self.addEventListener("fetch", function(event) {
  var req = event.request;
  if (req.method !== "GET") return;

  // Always try network first for HTML / navigation so updates show in installed app
  if (isAppShell(req)) {
    event.respondWith(
      fetch(req).then(function(res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put("./index.html", copy);
          });
        }
        return res;
      }).catch(function() {
        return caches.match("./index.html").then(function(cached) {
          return cached || caches.match(req);
        });
      })
    );
    return;
  }

  // Static assets: cache-first, then network
  event.respondWith(
    caches.match(req).then(function(cached) {
      if (cached) return cached;
      return fetch(req).then(function(res) {
        if (res && res.ok && req.url.indexOf(self.location.origin) === 0) {
          var copy = res.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(req, copy);
          });
        }
        return res;
      });
    })
  );
});
