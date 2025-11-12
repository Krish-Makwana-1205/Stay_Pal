const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary'); 
const upload = multer({ storage });
const { uploadProperty,addTenantPreferences,yourProperties} = require('../controller/propertyOwner.js');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');

// router.get('/nearest', findNearestProperty);

router.post('/addproperty', restrictToLoggedinUserOnly,upload.array('images', 10), uploadProperty); 
router.post('/preferences', restrictToLoggedinUserOnly,addTenantPreferences);
router.get('/properties', restrictToLoggedinUserOnly, yourProperties);

module.exports = router;

