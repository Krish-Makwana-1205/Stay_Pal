const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary'); 
const upload = multer({ storage });
const { uploadProperty,addTenantPreferences } = require('../controller/propertyOwner.js');

router.post('/addproperty', upload.array('images', 10), uploadProperty); 
router.post("/preferences", addTenantPreferences);

module.exports = router;
