const express = require('express');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const {makeRoommateProfile, addRoommatePreferences} = require('../controller/roommate');
const router = express.Router();

router.post('/form1', restrictToLoggedinUserOnly,makeRoommateProfile);
router.post('/form2', restrictToLoggedinUserOnly, addRoommatePreferences);

module.exports = router;