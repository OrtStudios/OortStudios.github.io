'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "3eda8ee02876840649cb7dc26c51a215",
"assets/assets/fonts/AIRBORNE%2520GP.ttf": "d5246e676959a62acce565905a37bed7",
"assets/assets/fonts/pdark.ttf": "aba7dc7621049bfb8be0ad39954b58f5",
"assets/assets/images/Logo-1080.png": "799ba5efb2b538449a71c93fa7228dad",
"assets/FontManifest.json": "6dfb9bcd5735c7c30c9d5c9bd90c9321",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "bf4d8d6be1dadddf1d2e9d16d370f3a0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.ico": "42fc17fd43b1c98a1d5d70b03e92fe5d",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"icons/android-icon-144x144.png": "c5c26c4268c17ea6e23a66afc9532d6c",
"icons/android-icon-192x192.png": "657913b151ca6b7b835c4934361626e5",
"icons/android-icon-36x36.png": "8c3e0de9cc8f7ec25d470bcf2bf1a8e8",
"icons/android-icon-48x48.png": "f611418198850db4f48a3af54a531eed",
"icons/android-icon-72x72.png": "c683dcbf2507bc25584a80eb84e657c8",
"icons/android-icon-96x96.png": "3d8607d85bc2a3072daf06f8ba338572",
"icons/apple-icon-114x114.png": "e2c4d7304758c38eba4c7f94cdce61b5",
"icons/apple-icon-120x120.png": "bdbcd404f22bcd6f732126d3c0d20cf7",
"icons/apple-icon-144x144.png": "c5c26c4268c17ea6e23a66afc9532d6c",
"icons/apple-icon-152x152.png": "9634b2e9771c0d0d69b593f3e9cbc912",
"icons/apple-icon-180x180.png": "2cdf1c83c204afb1bb4a5afbcc319d87",
"icons/apple-icon-57x57.png": "3f53176b9803b8047c9b95c37b339b7d",
"icons/apple-icon-60x60.png": "28798073bd85e3494b01a305e8a343be",
"icons/apple-icon-72x72.png": "c683dcbf2507bc25584a80eb84e657c8",
"icons/apple-icon-76x76.png": "7eaaae797de8ff679682ea3711648a46",
"icons/apple-icon-precomposed.png": "c4e865d05862be97713c6528bb34d96a",
"icons/apple-icon.png": "c4e865d05862be97713c6528bb34d96a",
"icons/favicon-16x16.png": "2515e84e79d72eb41c4e4b4938ec7842",
"icons/favicon-32x32.png": "c30863fe0282da9b7c7046c58ca3abac",
"icons/favicon-96x96.png": "3d8607d85bc2a3072daf06f8ba338572",
"icons/favicon.ico": "35054abcd7d2ab67018c0c698cc2d212",
"icons/ms-icon-144x144.png": "c5c26c4268c17ea6e23a66afc9532d6c",
"icons/ms-icon-150x150.png": "6dd819e130b392eb30e32b8aa3960d70",
"icons/ms-icon-310x310.png": "1410e2c6db185ee3db22cdd0fa92f71d",
"icons/ms-icon-70x70.png": "170c4a1c7c26a127d94654107cb4f103",
"index.html": "f21a6e419fe99d0db8c8640810c8b7aa",
"/": "f21a6e419fe99d0db8c8640810c8b7aa",
"main.dart.js": "992df2c2de0053d18996b49929553941",
"manifest.json": "90317c10a264667b5d40b56133061551",
"version.json": "5ea200483650304ce23d5cfee7213744"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
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
