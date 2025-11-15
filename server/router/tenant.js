const express = require('express');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const {makeProfile, addPreferences, tenantdetails, fullProfile, saveProperties, sendProperties} = require('../controller/tenant');
const router = express.Router();

router.post('/form1', restrictToLoggedinUserOnly,makeProfile);
router.post('/form2', restrictToLoggedinUserOnly, addPreferences);
router.post('/updateprofile', restrictToLoggedinUserOnly, fullProfile);
router.get('/profile', restrictToLoggedinUserOnly, tenantdetails);
router.post('/saveproperty',restrictToLoggedinUserOnly, saveProperties);
router.get('/getsaved', restrictToLoggedinUserOnly, sendProperties);

module.exports = router;