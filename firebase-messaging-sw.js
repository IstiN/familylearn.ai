// Import and configure the Firebase SDK
// These scripts are made available when the app is served or built on web
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCZLq5X9rN2d0ZtHNAR4wcrjQAi2UIco7g",
  authDomain: "ai-native-478811.firebaseapp.com",
  projectId: "ai-native-478811",
  storageBucket: "ai-native-478811.firebasestorage.app",
  messagingSenderId: "80693608388",
  appId: "1:80693608388:web:12a1176e79bc7025f26e91",
  measurementId: "G-7S1Q0MERFG"
});

const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/Icon-192.png',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
