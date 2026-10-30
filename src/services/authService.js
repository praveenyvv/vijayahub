import { supabase, isSupabaseConfigured } from './supabaseClient';
import { sendFast2SMSOTP, isFast2SMSConfigured } from './fast2smsService';

export const AUTH_USER_STORAGE_KEY = 'vijayahub_user_v1';
export const AUTH_SESSION_STORAGE_KEY = 'vijayahub_session_v1';
const PENDING_OTP_STORAGE_KEY = 'vijayahub_pending_otp_v1';

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
 * Generate a cryptographically random 6-digit numeric OTP
 */
function generateRandomOTP() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return String(100000 + (array[0] % 900000));
  }
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Send real 6-digit SMS OTP via Fast2SMS official OTP route (₹0.25/SMS)
 */
export async function sendPhoneOtp(rawPhone, name = '') {
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

  const generatedOtp = generateRandomOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

  // Cache pending verification locally
  try {
    sessionStorage.setItem(
      PENDING_OTP_STORAGE_KEY,
      JSON.stringify({
        phone: cleanPhone,
        name: name?.trim() || '',
        otp: generatedOtp,
        expiresAt
      })
    );
  } catch (e) {
    // ignore
  }

  // 1. Dispatch real SMS via Fast2SMS OTP route (₹0.25/SMS)
  if (isFast2SMSConfigured) {
    const smsResult = await sendFast2SMSOTP(cleanPhone, generatedOtp);
    if (smsResult.success) {
      return {
        success: true,
        phone: cleanPhone,
        provider: 'fast2sms',
        message: `6-digit verification code sent to +91 ${cleanPhone}.`
      };
    } else {
      return {
        success: false,
        error: smsResult.error || 'Failed to dispatch SMS via Fast2SMS gateway.'
      };
    }
  }

  // 2. Supabase SMS fallback
  if (isSupabaseConfigured && supabase) {
    try {
      const e164 = formatE164Phone(cleanPhone);
      const { error } = await supabase.auth.signInWithOtp({
        phone: e164,
        options: { channel: 'sms' }
      });
      if (!error) {
        return {
          success: true,
          phone: cleanPhone,
          provider: 'supabase',
          message: `Verification code sent to +91 ${cleanPhone} via SMS gateway.`
        };
      }
    } catch (sbErr) {
      console.warn('Supabase SMS gateway note:', sbErr);
    }
  }

  return {
    success: false,
    error: 'SMS Gateway is not configured. Please add VITE_FAST2SMS_API_KEY to your environment.'
  };
}

/**
 * Verify 6-digit SMS OTP entered by the customer
 */
export async function verifyPhoneOtp(rawPhone, otpCode, name = '') {
  const cleanPhone = extract10DigitPhone(rawPhone);
  const cleanOtp = (otpCode || '').trim();

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

  // Verify against Fast2SMS pending session
  let pendingData = null;
  try {
    const raw = sessionStorage.getItem(PENDING_OTP_STORAGE_KEY);
    if (raw) pendingData = JSON.parse(raw);
  } catch (e) {
    // ignore
  }

  if (pendingData && pendingData.phone === cleanPhone) {
    if (Date.now() > pendingData.expiresAt) {
      return {
        success: false,
        error: 'The verification code has expired. Please click "Resend OTP Code".'
      };
    }

    if (pendingData.otp !== cleanOtp) {
      return {
        success: false,
        error: 'Incorrect verification code. Please check your SMS and try again.'
      };
    }

    // Success! Clear pending OTP
    sessionStorage.removeItem(PENDING_OTP_STORAGE_KEY);

    const generatedId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `usr-${cleanPhone}-${Date.now()}`;

    const finalName = name?.trim() || pendingData.name || `Customer ${cleanPhone.slice(-4)}`;

    const userObj = {
      id: generatedId,
      phone: cleanPhone,
      name: finalName,
      email: `${cleanPhone}@customer.vijayahub.com`,
      isPhoneVerified: true,
      authProvider: 'fast2sms-sms',
      joinedAt: new Date().toISOString()
    };

    const sessionObj = {
      access_token: `f2s-token-${cleanPhone}-${Date.now()}`,
      refresh_token: `f2s-refresh-${cleanPhone}-${Date.now()}`,
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

  return {
    success: false,
    error: 'Incorrect verification code or session expired. Please request a new code.'
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
    sessionStorage.removeItem(PENDING_OTP_STORAGE_KEY);

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.warn('Sign out error:', err);
  }
}
