import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

/**
 * Firebase Client Configuration for VijayaHub Production Phone Auth.
 * Credentials are read from Vite environment variables (Vercel Production / Local .env).
 */
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '';
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '';
const appId = import.meta.env.VITE_FIREBASE_APP_ID || '';

/**
 * Validates whether real, production Firebase credentials are provided.
 */
export const isFirebaseConfigured = Boolean(
  apiKey &&
  projectId &&
  !apiKey.includes('Demo') &&
  !apiKey.includes('Placeholder') &&
  apiKey.length > 20
);

const firebaseConfig = {
  apiKey: apiKey || 'AIzaSyPlaceholderKeyForViteBuildCheck2026',
  authDomain: authDomain || (projectId ? `${projectId}.firebaseapp.com` : 'vijayahub-auth.firebaseapp.com'),
  projectId: projectId || 'vijayahub-auth',
  storageBucket: storageBucket || (projectId ? `${projectId}.appspot.com` : 'vijayahub-auth.appspot.com'),
  messagingSenderId: messagingSenderId || '100000000000',
  appId: appId || '1:100000000000:web:0000000000000000000000'
};

// Print diagnostic alert in console if credentials are not yet configured in production
if (!isFirebaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '%c🔥 [VijayaHub Diagnostic] Real Firebase environment keys missing!\n' +
    'Real SMS OTP delivery requires VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your Vercel / .env settings.\n' +
    'See Firebase Console -> Project Settings -> General -> Your apps.',
    'color: #d97706; font-weight: bold;'
  );
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(app);

try {
  firebaseAuth.useDeviceLanguage();
} catch (e) {
  // Non-browser or SSR guard
}

export { RecaptchaVerifier, signInWithPhoneNumber };
