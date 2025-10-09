const otp = require('../model/otp'); // lowercase as per your request
const sendOtpEmail = require('./mailer');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

async function createAndSendOtp(email) {
  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  await otp.findOneAndUpdate(
    { email },
    { otp: otpCode, expiresAt },
    { upsert: true, new: true }
  );

  await sendOtpEmail(email, otpCode);
}

module.exports = { createAndSendOtp };
