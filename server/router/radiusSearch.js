const express = require("express");
const router = express.Router();
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const {findNearestProperty} = require('../controller/radiusSearch');

router.get('/', restrictToLoggedinUserOnly, findNearestProperty);

module.exports = router;