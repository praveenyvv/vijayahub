/**
 * Fast2SMS Gateway Client for VijayaHub
 * 
 * Route: 'otp' (Official Fast2SMS OTP Route at ₹0.25 per SMS)
 * Requirements: Fast2SMS Account with completed Aadhaar/Website KYC.
 * Speed: 2-5 seconds instant delivery, bypasses Indian DND filters.
 */

const FAST2SMS_API_KEY = import.meta.env.VITE_FAST2SMS_API_KEY || '';

export const isFast2SMSConfigured = Boolean(
  FAST2SMS_API_KEY &&
  !FAST2SMS_API_KEY.includes('YOUR_') &&
  FAST2SMS_API_KEY.length > 10
);

/**
 * Dispatches 6-digit OTP SMS via Fast2SMS official OTP route (₹0.25/SMS)
 * @param {string} phone 10-digit Indian mobile number
 * @param {string} otp 6-digit numeric OTP code
 */
export async function sendFast2SMSOTP(phone, otp) {
  const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);

  if (!isFast2SMSConfigured) {
    console.warn('⚠️ [Fast2SMS] VITE_FAST2SMS_API_KEY is missing.');
    return {
      success: false,
      error: 'Fast2SMS API Key is missing. Please add VITE_FAST2SMS_API_KEY in your environment.'
    };
  }

  try {
    console.log(`📱 [Fast2SMS] Dispatching 25-paise OTP SMS to +91 ${cleanPhone}...`);

    // Official Fast2SMS OTP Route (₹0.25 per SMS)
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: cleanPhone
      })
    });

    const data = await response.json();

    if (data && data.return === true) {
      console.log('✅ [Fast2SMS] OTP SMS sent successfully!', data);
      return {
        success: true,
        message: `6-digit verification code sent to +91 ${cleanPhone}.`,
        requestId: data.request_id
      };
    } else {
      console.error('❌ [Fast2SMS Error Response]:', data);
      const errMsg = Array.isArray(data?.message)
        ? data.message.join(', ')
        : (data?.message || 'Failed to send SMS OTP.');

      return {
        success: false,
        error: `Fast2SMS: ${errMsg}`
      };
    }
  } catch (err) {
    console.error('❌ [Fast2SMS Network Error]:', err);
    return {
      success: false,
      error: `Network error connecting to Fast2SMS: ${err.message}`
    };
  }
}
