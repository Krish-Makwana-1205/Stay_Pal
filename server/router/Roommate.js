const express = require('express');
const router = express.Router();
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const {roommateUpload, roommateSearch} = require('../controller/roommatesearch');

router.post('/add', restrictToLoggedinUserOnly, roommateUpload);
router.post('/search', restrictToLoggedinUserOnly, roommateSearch);

module.exports = router;
