import { updateCacheDynamic } from "./js/sw-utils.js";
const STATIC__CACHE = "static-v1";
const DYNAMIC__CACHE = "dynamic-v1";
const IMMUTABLE__CACHE = "immutable-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./js/app.js",
  "./css/style.css",
  "./img/avatars/hulk.jpg",
  "./img/avatars/ironman.jpg",
  "./img/avatars/spiderman.jpg",
  "./img/avatars/thor.jpg",
  "./img/avatars/wolverine.jpg",
  "./img/favicon.ico",
];
const APP_SHELL_IMMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "./css/animate.css",
  "./js/libs/jquery.js",
];

const limpiarCache = (cacheName, itemNum) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > itemNum) {
        cache.delete(keys[0]).then(() => limpiarCache(cacheName, itemNum));
      }
    });
  });
};

self.addEventListener("install", (e) => {
  const cacheStatic = caches.open(STATIC__CACHE).then((cacheOp) => {
    return cacheOp.addAll(APP_SHELL);
  });
  const cacheImmutable = caches.open(IMMUTABLE__CACHE).then((cacheOp) => {
    return cacheOp.addAll(APP_SHELL_IMMUTABLE);
  });
  e.waitUntil(Promise.all([cacheStatic, cacheImmutable]));
});

self.addEventListener("activate", (e) => {
  const response = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC__CACHE && key.includes("static")) {
        caches.delete(key);
      }
    });
  });
  e.waitUntil(response);
});
self.addEventListener("fetch", (e) => {
  const request = caches.match(e.request.url).then(async (cache) => {
    if (cache) {
      return cache;
    } else {
      const response = await fetch(e.request.url);
    return updateCacheDynamic(DYNAMIC__CACHE,e.request.url,response)
    }
  });
  e.respondWith(request)
});
