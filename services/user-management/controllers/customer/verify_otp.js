const { redis } = require('@common/database/redis');
const { decrypt } = require('@common/utils/crypto');
const { getConfig } = require('@common/utils/config');
const { NOT_FOUND, INVALID_PAYLOAD } = require('@common/constants/codes');

async function verifyOTP (phone, otp, action) {
  if (!phone || !otp || !action) {
    const error = {
      status: INVALID_PAYLOAD,
      message: 'Phone or otp or action invalid'
    };
    return error;
  }

  const otpKey = `${getConfig('common.redis.otp')}${phone}`;
  const otpToken = await redis.get(otpKey);
  if (!otpToken) {
    const error = {
      status: NOT_FOUND,
      message: 'OTP not found or expired'
    };
    return error;
  }

  const otpDataStr = decrypt(otpToken, getConfig('common.secret.otp'));
  if (!otpDataStr) {
    const error = {
      status: NOT_FOUND,
      message: 'OTP not found or expired'
    };
    return error;
  }

  const otpData = JSON.parse(otpDataStr);
  if (!otpData) {
    const error = {
      status: NOT_FOUND,
      message: 'OTP not found or expired'
    };
    return error;
  } else if (otpData.action !== action) {
    const error = {
      status: INVALID_PAYLOAD,
      message: 'OTP action invalid'
    };
    return error;
  }

  if (otp !== otpData.otp) {
    const error = {
      status: INVALID_PAYLOAD,
      message: 'OTP invalid'
    };
    return error;
  }

  const deleted = await redis.del(otpKey);
  if (deleted !== 1) {
    const error = {
      status: NOT_FOUND,
      message: 'OTP not found or expired'
    };
    return error;
  }

  return null;
}

module.exports.verifyOTP = verifyOTP;
