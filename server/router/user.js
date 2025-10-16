const express = require('express');
const {makeUser, loginUser, provideUser, sendOtp, logOut, forgotPasswordOtp,forgotPassword} = require('../controller/user');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');

const router = express.Router();

router.post('/registration', makeUser);
router.post('/login', loginUser);
router.post('/registration/otp', sendOtp);
router.get('/me', restrictToLoggedinUserOnly, provideUser);
router.post('/logout',logOut);
router.post('/forgotPassword/otp', forgotPasswordOtp);
router.post('/forgotPassword', forgotPassword);
module.exports = router;