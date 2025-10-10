const express = require('express');
const {makeUser, loginUser, provideUser, sendOtp} = require('../controller/user');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');

const router = express.Router();

router.post('/registration', makeUser);
router.post('/login', loginUser);
router.post('/registration/otp', sendOtp);
router.get('/me', restrictToLoggedinUserOnly, provideUser);
module.exports = router;