/**
 * Fast2SMS Gateway Client for VijayaHub
 * 
 * Route: Quick transactional SMS ('q' route - unlocked with account balance, bypasses DND in India).
 * Delivery Speed: ~2-5s to Airtel, Jio, Vi.
 */

const FAST2SMS_API_KEY = import.meta.env.VITE_FAST2SMS_API_KEY || '';

export const isFast2SMSConfigured = Boolean(
  FAST2SMS_API_KEY &&
  !FAST2SMS_API_KEY.includes('YOUR_') &&
  FAST2SMS_API_KEY.length > 10
);

/**
 * Dispatches 6-digit OTP SMS to an Indian 10-digit mobile number via Fast2SMS
 * @param {string} phone 10-digit Indian mobile number
 * @param {string} otp 6-digit OTP
 */
export async function sendFast2SMSOTP(phone, otp) {
  const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);

  if (!isFast2SMSConfigured) {
    console.warn(
      '⚠️ [Fast2SMS] VITE_FAST2SMS_API_KEY is not configured in .env / Vercel.'
    );
    return {
      success: false,
      error: 'Fast2SMS API Key is missing. Please add VITE_FAST2SMS_API_KEY to your .env file or Vercel Environment Variables.'
    };
  }

  try {
    console.log(`📱 [Fast2SMS] Dispatching OTP SMS to +91 ${cleanPhone}...`);

    // Fast2SMS Quick Route API (Active and working immediately)
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: `Your VijayaHub verification code is ${otp}. Valid for 10 minutes.`,
        language: 'english',
        numbers: cleanPhone
      })
    });

    const data = await response.json();

    if (data && data.return === true) {
      console.log('✅ [Fast2SMS] SMS dispatched successfully!', data);
      return {
        success: true,
        message: `6-digit verification code sent to +91 ${cleanPhone}.`,
        requestId: data.request_id
      };
    } else {
      console.error('❌ [Fast2SMS Error Response]:', data);
      const errMsg = Array.isArray(data?.message) ? data.message.join(', ') : (data?.message || 'Failed to send SMS.');
      return {
        success: false,
        error: `Fast2SMS Gateway Error: ${errMsg}`
      };
    }
  } catch (err) {
    console.error('❌ [Fast2SMS Network Error]:', err);
    return {
      success: false,
      error: `Network error connecting to Fast2SMS gateway: ${err.message}`
    };
  }
}
