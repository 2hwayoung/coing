// Import the functions you need from the SDKs you need
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase.initializeApp({
  apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  messagingSenderId: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'NEXT_PUBLIC_FIREBASE_APP_ID',
  measurementId: 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
});

self.addEventListener('install', function (e) {
  self.skipWaiting();
});

// Initialize Firebase
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const timestamp = parseInt(payload.data.timestamp, 10);
  const now = Date.now();
  const ageInSeconds = (now - timestamp) / 1000;

  if (ageInSeconds > 5) {
    // 일정 시간 지난 메시지면 무시
    console.log('[SW] expired push skipped');
    return;
  }

  self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
    icon: '/logo.svg',
    data: {
      url: payload.data.url,
    },
  });
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = new URL(event.notification.data.url, self.location.origin);

  event.waitUntil(clients.openWindow ? clients.openWindow(urlToOpen.href) : Promise.resolve());
});
