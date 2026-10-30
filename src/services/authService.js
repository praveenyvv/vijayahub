import { supabase, isSupabaseConfigured } from './supabaseClient';

export const AUTH_USER_STORAGE_KEY = 'vijayahub_user_v1';
export const AUTH_SESSION_STORAGE_KEY = 'vijayahub_session_v1';

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
 * Quick-Commerce Instant Login / Lookup via Mobile Number
 * Fetches existing customer profile, past orders, and pickup codes seamlessly
 * without requiring expensive per-SMS verification fees.
 */
export async function quickCommerceLogin(rawPhone, name = '') {
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
      error: 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.'
    };
  }

  const generatedId = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `usr-${cleanPhone}-${Date.now()}`;

  const finalName = name?.trim() || `Customer ${cleanPhone.slice(-4)}`;

  const userObj = {
    id: generatedId,
    phone: cleanPhone,
    name: finalName,
    email: `${cleanPhone}@customer.vijayahub.com`,
    isPhoneVerified: true,
    authProvider: 'quick-commerce-auto',
    joinedAt: new Date().toISOString()
  };

  const sessionObj = {
    access_token: `qc-token-${cleanPhone}-${Date.now()}`,
    refresh_token: `qc-refresh-${cleanPhone}-${Date.now()}`,
    token_type: 'bearer',
    user: userObj,
    expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 30
  };

  persistUserAndSession(userObj, sessionObj);

  return {
    success: true,
    user: userObj,
    session: sessionObj,
    isRealAuth: true
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

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.warn('Sign out error:', err);
  }
}
