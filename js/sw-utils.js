export { updateCacheDynamic };
const updateCacheDynamic = (dynamicCache, req, res) => {
  if (res.ok) {
    caches.open(dynamicCache).then((cache) => {
      cache.put(req, res);
      //   limpiarCache(DYNAMIC__CACHE, 7);
    });
    return res.clone();
  }
};
