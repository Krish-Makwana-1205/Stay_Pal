const express = require('express');
const {makeUser, loginUser, provideUser, sendOtp, logOut, forgotPasswordOtp,forgotPassword} = require('../controller/user');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');

const router = express.Router();

const multer = require('multer');
const { storage } = require('../cloudinary'); 
const upload = multer({ storage });
const { uploadProperty } = require('../controller/propertyOwner.js');

router.post('/addproperty', upload.single('images'), uploadProperty); 

router.post('/registration', makeUser);
router.post('/login', loginUser);
router.post('/registration/otp', sendOtp);
router.get('/me', restrictToLoggedinUserOnly, provideUser);
router.post('/logout',restrictToLoggedinUserOnly, logOut);
router.post('/forgotPassword/otp', forgotPasswordOtp);
router.post('/forgotPassword', forgotPassword);
module.exports = router;