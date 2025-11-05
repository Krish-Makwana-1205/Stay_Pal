const express = require('express');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const {makeProfile, addPreferences, tenantdetails} = require('../controller/tenant');
const router = express.Router();

router.post('/form1', restrictToLoggedinUserOnly,makeProfile);
router.post('/form2', restrictToLoggedinUserOnly, addPreferences);
router.get('/profile', restrictToLoggedinUserOnly, tenantdetails);

module.exports = router;