const CACHE_NAME = "static-assets"

async function fetchAndCacheAsset(asset) {
  const assetUrl = new URL(`/static/${asset}`, self.location).toString()

  try {
    const cache = await caches.open(CACHE_NAME)
    const existingResponse = await cache.match(assetUrl)

    if (existingResponse) {
      return existingResponse
    }

    const response = await fetch(assetUrl)

    try {
      await cache.put(assetUrl, response)
    } catch (error) {
      console.error(`Error caching asset: ${asset}`, error.message)
    }
    return response
  } catch (error) {
    return null
  }
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(async () => {
        try {
          const response = await fetch("/static/manifest.json")
          if (response.ok) {
            const manifest = await response.json()
            const fetchAndCachePromises =
              manifest.assets.map(fetchAndCacheAsset)
            await Promise.all(fetchAndCachePromises)
            console.log("New assets cached successfully.")
          }
        } catch (error) {
          console.error("Error fetching or caching manifest:", error)
        }
      }),
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (
                cacheName.startsWith(CACHE_NAME) &&
                cacheName !== CACHE_NAME
              ) {
                return caches.delete(cacheName)
              }
            })
          )
        })
        .then(() => {
          console.log("Old caches cleared successfully.")
        }),
    ])
  )
})
