'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "2efbb41d7877d10aac9d091f58ccd7b9",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/NOTICES": "f9ff7b8ac21348440bcf9212bc6cce4c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.ico": "96ccd25cc851a5940caa90b04b7c10f5",
"icons/android-icon-144x144.png": "efe8c8c339e6441984b5f6fe42247fdb",
"icons/android-icon-192x192.png": "eba1abb85392de3956c9e65e9912fed5",
"icons/android-icon-36x36.png": "cc3678a650233fce3a89312d8f41f009",
"icons/android-icon-48x48.png": "727ef76459e09c7abf9c30c732e0f83b",
"icons/android-icon-72x72.png": "63da95263cf600b2a51cfaa9aaee896b",
"icons/android-icon-96x96.png": "cb9110a526dbd7e5d5628092e115740b",
"icons/apple-icon-114x114.png": "f6548584c43ce39c6503aee24befd06f",
"icons/apple-icon-120x120.png": "ae14cfd8aeb1e1dc2b67723f43cc798e",
"icons/apple-icon-144x144.png": "efe8c8c339e6441984b5f6fe42247fdb",
"icons/apple-icon-152x152.png": "8a0ab9101671042263a79e750ff56361",
"icons/apple-icon-180x180.png": "86f498f8189c647a67c411ddacb05a3b",
"icons/apple-icon-57x57.png": "ea7354b0c03ac56fa8b37032c57567b5",
"icons/apple-icon-60x60.png": "e80d1647a258395306bbc0736e596fc2",
"icons/apple-icon-72x72.png": "63da95263cf600b2a51cfaa9aaee896b",
"icons/apple-icon-76x76.png": "bf1501a3367069f9c6c8c10cb5b9b307",
"icons/apple-icon-precomposed.png": "18aca4393afb9fb9a344cf82937a0fea",
"icons/apple-icon.png": "18aca4393afb9fb9a344cf82937a0fea",
"icons/favicon-16x16.png": "fb80495d790e7b10698dc6b3ba57d02b",
"icons/favicon-32x32.png": "ffa48be5627a49525d1f8495628804bf",
"icons/favicon-96x96.png": "f1236fafba97766ee80d175c816e484f",
"icons/favicon.ico": "b217478250f11aeded1211e6b0d26b09",
"icons/ms-icon-144x144.png": "87b4489a057924f1226dff39e7ad90b5",
"icons/ms-icon-150x150.png": "d6ed286ac15f5f3dc76bd2a5f8f5a71a",
"icons/ms-icon-310x310.png": "5dec8ee089f5741f3d90330b45c2fb1b",
"icons/ms-icon-70x70.png": "bcf20e7ea09839024b1619205721c178",
"index.html": "28729b9725f1b50f8efa07f0fe88f9ed",
"/": "28729b9725f1b50f8efa07f0fe88f9ed",
"main.dart.js": "6fe34aee2fde3d5c458faa533a219da9",
"manifest.json": "90317c10a264667b5d40b56133061551",
"version.json": "5ea200483650304ce23d5cfee7213744"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
