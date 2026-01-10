
import { initializeApp, FirebaseApp } from 'firebase/app';

// Safely access environment variables using optional chaining
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | undefined;

export const getFirebaseApp = () => {
  if (!app) {
    if (!firebaseConfig.apiKey) {
      throw new Error("Firebase Configuration is missing! Check your .env file.");
    }
    app = initializeApp(firebaseConfig);
  }
  return app;
};
