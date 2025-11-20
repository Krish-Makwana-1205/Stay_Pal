const otp = require('../model/otp');
const {sendOtpEmail} = require('./mailer');

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
async function verifyOtp(email, otpcode) {
  let veri
  try {
    veri = await otp.findOne({ email: email, otp: otpcode });
  }catch(error){
    return error;
  }
  const cur = new Date();
  if(veri === null){
    return 2;
  }
  else if(veri.expiresAt < cur){
    return 3;
  }
  else{
    return 1;
  }
}
async function deleteOtp(emailcode){
  try {
    await otp.deleteMany({email:emailcode});
  }catch(e){
    return false;
  }
  return true;
}
module.exports = { createAndSendOtp , verifyOtp,deleteOtp};
