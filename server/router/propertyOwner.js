const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary'); 
const upload = multer({ storage });
const { uploadProperty,addTenantPreferences,yourProperties, deleteProperty} = require('../controller/propertyOwner.js');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');

// router.get('/nearest', findNearestProperty);

router.post('/addproperty', restrictToLoggedinUserOnly,upload.array('images', 10), uploadProperty); 
router.post('/preferences', restrictToLoggedinUserOnly,addTenantPreferences);
router.get('/properties', restrictToLoggedinUserOnly, yourProperties);
router.post('/delete-property', restrictToLoggedinUserOnly, deleteProperty);

module.exports = router;

