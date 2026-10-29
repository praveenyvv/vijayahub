import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

/**
 * Firebase Client Configuration for VijayaHub Production Phone Auth.
 * Reads credentials from Vite environment variables with graceful fallbacks.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoVijayaHubKeyProductionAuth2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vijayahub-auth.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vijayahub-auth',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vijayahub-auth.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '939262432600',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:939262432600:web:8899aabbccddeeff'
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID
);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(app);
firebaseAuth.useDeviceLanguage();

export { RecaptchaVerifier, signInWithPhoneNumber };
