import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  firebaseAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  isFirebaseConfigured
} from './firebaseClient';

export const AUTH_USER_STORAGE_KEY = 'vijayahub_user_v1';
export const AUTH_SESSION_STORAGE_KEY = 'vijayahub_session_v1';

let activeConfirmationResult = null;
let activeRecaptchaVerifier = null;

/**
 * Extract 10-digit standard Indian phone number
 */
export function extract10DigitPhone(rawPhone) {
  if (!rawPhone) return '';
  const digits = rawPhone.toString().replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/**
 * Format Indian 10-digit mobile number into international E.164 format (+91XXXXXXXXXX)
 */
export function formatE164Phone(rawPhone) {
  const clean = extract10DigitPhone(rawPhone);
  return clean ? `+91${clean}` : '';
}

/**
 * Verify whether number is a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)
 */
export function isValidIndianMobile(rawPhone) {
  const clean = extract10DigitPhone(rawPhone);
  return /^[6-9]\d{9}$/.test(clean);
}

/**
 * Safely get stored user object from localStorage
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Error reading stored user:', err);
    return null;
  }
}

/**
 * Safely get stored session object from localStorage or sessionStorage
 */
export function getStoredSession() {
  try {
    const raw =
      localStorage.getItem(AUTH_SESSION_STORAGE_KEY) ||
      sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Error reading stored session:', err);
    return null;
  }
}

/**
 * Persist user and session to both storage layers
 */
export function persistUserAndSession(userObj, sessionObj) {
  try {
    if (userObj) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(userObj));
    }
    if (sessionObj) {
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(sessionObj));
      sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(sessionObj));
    }
  } catch (err) {
    console.warn('Error persisting session to storage:', err);
  }
}

/**
 * Clean up active reCAPTCHA verifier instance and reset DOM container safely
 */
export function clearRecaptchaVerifier(containerId = 'recaptcha-container') {
  if (activeRecaptchaVerifier) {
    try {
      activeRecaptchaVerifier.clear();
    } catch (e) {
      // ignore cleanup errors
    }
    activeRecaptchaVerifier = null;
  }

  if (typeof window !== 'undefined' && window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      // ignore
    }
    window.recaptchaVerifier = null;
  }

  if (typeof document !== 'undefined') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
  }
}

/**
 * Send real 6-digit SMS OTP to phone number using Firebase Phone Auth.
 * Includes complete reCAPTCHA lifecycle management, E.164 format enforcement,
 * and comprehensive diagnostic error reporting.
 */
export async function sendPhoneOtp(rawPhone, containerId = 'recaptcha-container') {
  const cleanPhone = extract10DigitPhone(rawPhone);

  if (!cleanPhone || cleanPhone.length !== 10) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit Indian mobile number.'
    };
  }

  if (!isValidIndianMobile(cleanPhone)) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.'
    };
  }

  const e164 = formatE164Phone(cleanPhone);

  // 1. Check for real Firebase environment credentials
  if (!isFirebaseConfigured) {
    console.error(
      '❌ [Firebase Phone Auth Diagnostic] Missing Firebase Configuration Keys!\n' +
      'VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID are not set in environment.\n' +
      'Add them to your Vercel Project Settings -> Environment Variables or local .env file.'
    );

    // If Supabase SMS is configured, attempt fallback before failing
    if (isSupabaseConfigured && supabase) {
      try {
        console.log(`📡 Attempting Supabase SMS Gateway fallback for ${e164}...`);
        const { error } = await supabase.auth.signInWithOtp({
          phone: e164,
          options: { channel: 'sms' }
        });
        if (!error) {
          return {
            success: true,
            phone: cleanPhone,
            e164,
            provider: 'supabase',
            message: `Verification code sent to +91 ${cleanPhone} via SMS gateway.`
          };
        }
      } catch (sbErr) {
        console.warn('Supabase SMS fallback error:', sbErr);
      }
    }

    return {
      success: false,
      code: 'auth/missing-config',
      error:
        'Firebase configuration missing. Please add VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your Vercel Project Environment Variables.'
    };
  }

  // 2. Prepare reCAPTCHA container
  const container = typeof document !== 'undefined' ? document.getElementById(containerId) : null;
  if (!container) {
    console.error(`❌ [Firebase Auth] Container element #${containerId} not found in the DOM.`);
    return {
      success: false,
      code: 'auth/missing-container',
      error: 'Authentication reCAPTCHA container was not found in page. Please refresh the page.'
    };
  }

  // Always reset existing verifier and empty the container to prevent DOM collision crashes
  clearRecaptchaVerifier(containerId);

  try {
    console.log(`🛡️ [Firebase Auth] Initializing invisible RecaptchaVerifier for ${containerId}...`);
    const verifier = new RecaptchaVerifier(firebaseAuth, container, {
      size: 'invisible',
      callback: () => {
        console.log('✅ [reCAPTCHA] Solved token generated automatically.');
      },
      'expired-callback': () => {
        console.warn('⚠️ [reCAPTCHA] Token expired. Resetting verifier.');
        clearRecaptchaVerifier(containerId);
      }
    });

    activeRecaptchaVerifier = verifier;
    if (typeof window !== 'undefined') {
      window.recaptchaVerifier = verifier;
    }

    // Render the invisible widget
    await verifier.render();
  } catch (verifierError) {
    console.error('❌ [Firebase RecaptchaVerifier Render Error]:', verifierError);
    clearRecaptchaVerifier(containerId);
    return {
      success: false,
      code: verifierError?.code || 'auth/recaptcha-render-failed',
      error: `reCAPTCHA initialization failed: ${verifierError?.message || 'Check DOM state'}`
    };
  }

  // 3. Dispatch SMS OTP via Firebase Auth
  try {
    console.log(`📱 [Firebase Auth] Requesting real SMS OTP for ${e164}...`);
    const confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      e164,
      activeRecaptchaVerifier
    );
    activeConfirmationResult = confirmationResult;
    console.log(`✅ [Firebase Auth] SMS OTP dispatched successfully to ${e164}!`);

    return {
      success: true,
      phone: cleanPhone,
      e164,
      provider: 'firebase',
      message: `6-digit SMS verification code sent to +91 ${cleanPhone}.`
    };
  } catch (fbError) {
    console.error('❌ [Firebase Phone Auth Failure Diagnostic Breakdown]:');
    console.error('  → Error Code:', fbError.code);
    console.error('  → Error Message:', fbError.message);
    console.error('  → Attempted Phone Number:', e164);

    clearRecaptchaVerifier(containerId);

    // Precise, actionable human-readable error descriptions for production
    let humanMessage = fbError.message || 'Failed to send SMS OTP.';

    switch (fbError.code) {
      case 'auth/unauthorized-domain':
        humanMessage =
          `Domain not authorized in Firebase Console! Please add your current domain (${
            typeof window !== 'undefined' ? window.location.hostname : 'your-domain'
          }) under: Firebase Console → Authentication → Settings → Authorized domains.`;
        break;

      case 'auth/invalid-app-credential':
      case 'auth/missing-client-identifier':
        humanMessage =
          'Firebase App Credential validation failed. Please ensure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID are correct and authorized domains include this host.';
        break;

      case 'auth/invalid-api-key':
        humanMessage =
          'Invalid Firebase API Key. Please verify VITE_FIREBASE_API_KEY in your Vercel Environment Variables.';
        break;

      case 'auth/invalid-phone-number':
        humanMessage =
          `Invalid phone number format: "${e164}". Indian mobile numbers must be in E.164 format (+91XXXXXXXXXX).`;
        break;

      case 'auth/quota-exceeded':
        humanMessage =
          'Firebase SMS daily quota exceeded. Identity Platform requires billing activation in Google Cloud / Firebase Console to increase SMS limits.';
        break;

      case 'auth/too-many-requests':
        humanMessage =
          'Too many OTP requests have been sent to this number. Please wait a few minutes before trying again.';
        break;

      case 'auth/captcha-check-failed':
        humanMessage =
          'reCAPTCHA verification challenge failed. Please refresh your browser window and retry.';
        break;

      case 'auth/operation-not-allowed':
        humanMessage =
          'Phone Authentication is disabled! Enable the "Phone" sign-in provider in Firebase Console → Authentication → Sign-in method.';
        break;

      case 'auth/network-request-failed':
        humanMessage =
          'Network connection error connecting to Google Identity servers. Please check your internet connection.';
        break;

      default:
        humanMessage = fbError.message || 'Failed to send SMS OTP. Please check your network and configuration.';
    }

    return {
      success: false,
      code: fbError.code,
      error: humanMessage
    };
  }
}

/**
 * Verify 6-digit SMS OTP using Firebase Auth Confirmation Result.
 * Automatically saves verified customer into Supabase Auth & LocalStorage session.
 */
export async function verifyPhoneOtp(rawPhone, otpCode, name = '') {
  const cleanPhone = extract10DigitPhone(rawPhone);
  const cleanOtp = (otpCode || '').trim();
  const e164 = formatE164Phone(cleanPhone);

  if (!cleanOtp) {
    return {
      success: false,
      error: 'Please enter the 6-digit verification code sent to your phone.'
    };
  }

  if (cleanOtp.length !== 6) {
    return {
      success: false,
      error: 'Verification code must be exactly 6 digits.'
    };
  }

  // 1. Verify with Firebase Confirmation Result
  if (activeConfirmationResult) {
    try {
      console.log(`🔐 [Firebase Auth] Confirming OTP ${cleanOtp} with Google Identity...`);
      const userCredential = await activeConfirmationResult.confirm(cleanOtp);
      const fbUser = userCredential.user;
      console.log('✅ [Firebase Auth] User verified successfully! UID:', fbUser.uid);

      const userObj = {
        id: fbUser.uid,
        phone: cleanPhone,
        name: name?.trim() || `Customer ${cleanPhone.slice(-4)}`,
        email: fbUser.email || `${cleanPhone}@customer.vijayahub.com`,
        isPhoneVerified: true,
        authProvider: 'firebase',
        joinedAt: new Date().toISOString()
      };

      const sessionObj = {
        access_token: await fbUser.getIdToken(),
        refresh_token: fbUser.refreshToken || `rt-${cleanPhone}-${Date.now()}`,
        user: userObj,
        expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 30
      };

      persistUserAndSession(userObj, sessionObj);
      activeConfirmationResult = null;
      clearRecaptchaVerifier();

      return { success: true, user: userObj, session: sessionObj, isRealAuth: true };
    } catch (fbConfirmErr) {
      console.error('❌ [Firebase OTP Verification Error]:', fbConfirmErr);
      let errMsg = fbConfirmErr.message || 'Failed to verify code.';

      if (fbConfirmErr.code === 'auth/invalid-verification-code') {
        errMsg = 'Incorrect 6-digit verification code. Please check your SMS and try again.';
      } else if (fbConfirmErr.code === 'auth/code-expired') {
        errMsg = 'The verification code has expired. Please click "Resend OTP Code".';
      } else if (fbConfirmErr.code === 'auth/session-expired') {
        errMsg = 'The SMS verification session has expired. Please request a new code.';
      }

      return {
        success: false,
        code: fbConfirmErr.code,
        error: errMsg
      };
    }
  }

  // 2. Supabase SMS verification fallback
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: e164,
        token: cleanOtp,
        type: 'sms'
      });

      if (!error && data?.user) {
        if (name && name.trim()) {
          try {
            await supabase.auth.updateUser({
              data: { full_name: name.trim(), display_name: name.trim() }
            });
          } catch {
            // ignore metadata failure
          }
        }

        const userObj = {
          id: data.user.id,
          phone: cleanPhone,
          name: name?.trim() || data.user.user_metadata?.full_name || `Customer ${cleanPhone.slice(-4)}`,
          email: data.user.email || `${cleanPhone}@customer.vijayahub.com`,
          isPhoneVerified: true,
          authProvider: 'supabase',
          joinedAt: data.user.created_at || new Date().toISOString()
        };

        persistUserAndSession(userObj, data.session);
        return { success: true, user: userObj, session: data.session, isRealAuth: true };
      }
    } catch (err) {
      console.warn('Supabase OTP verification notice:', err);
    }
  }

  return {
    success: false,
    error: 'No active SMS verification session found. Please click "Change" to re-send the code.'
  };
}

/**
 * Sign out user, purge storage, and terminate sessions
 */
export async function signOutAuthUser() {
  try {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);

    clearRecaptchaVerifier();
    activeConfirmationResult = null;

    if (firebaseAuth) {
      try {
        await firebaseAuth.signOut();
      } catch (e) {
        // ignore
      }
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.warn('Sign out error:', err);
  }
}
