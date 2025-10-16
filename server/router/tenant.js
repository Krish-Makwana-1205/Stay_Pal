const express = require('express');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const {makeProfile, addPreferences} = require('../controller/tenant');
const router = express.Router();

router.post('/form1', restrictToLoggedinUserOnly,makeProfile);
router.post('/form2', restrictToLoggedinUserOnly, addPreferences);

module.exports = router;