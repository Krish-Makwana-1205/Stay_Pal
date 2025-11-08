const express = require('express');
const {makeUser, loginUser, provideUser, sendOtp, logOut, forgotPasswordOtp,forgotPassword,uploadProfilePhoto} = require('../controller/user');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const router = express.Router();

const multer = require('multer');
const { storage } = require('../cloudinary'); 
const upload = multer({ storage });


router.post('/registration', makeUser);
router.post('/login', loginUser);
router.post('/registration/otp', sendOtp);
router.get('/me', restrictToLoggedinUserOnly, provideUser);
router.post('/logout',restrictToLoggedinUserOnly, logOut);
router.post('/forgotPassword/otp', forgotPasswordOtp);
router.post('/forgotPassword', forgotPassword);
router.post('/uploadPhoto', uploadProfilePhoto);
module.exports = router;