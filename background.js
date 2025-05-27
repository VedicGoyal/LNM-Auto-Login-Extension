// background.js

// This service worker stays idle unless you add event listeners.
// For now, no background tasks needed, but MV3 requires this file if you declare it.

self.addEventListener('install', () => {
  console.log('Service worker installed');
});

self.addEventListener('activate', () => {
  console.log('Service worker activated');
});
