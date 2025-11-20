const express = require('express');
const router = express.Router();
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const {roommateUpload, roommateSearch, getlistings, updatelisting, deletelisting} = require('../controller/roommate');

router.post('/add', restrictToLoggedinUserOnly, roommateUpload);
router.post('/search', restrictToLoggedinUserOnly, roommateSearch);
router.get('/listings', restrictToLoggedinUserOnly, getlistings);
router.post('/update', restrictToLoggedinUserOnly, updatelisting);
router.post('/delete', restrictToLoggedinUserOnly, deletelisting);

module.exports = router;
