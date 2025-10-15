const otp = require('../model/otp');
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
async function verifyOtp(email, otpcode) {
  let veri
  try {
    veri = await otp.findOne({ email: email, otp: otpcode });
  }catch(error){
    return error;
  }
  console.log("verify")
  console.log(veri);
  if(veri === null){
    return 2;
  }
  else{
    return 1;
  }
}
async function deleteDB(otpcode){
  try {
    await otp.deleteMany({otp:otpcode});
  }catch(e){
    return false;
  }
  return true;
}
module.exports = { createAndSendOtp , verifyOtp,deleteDB};
