const express = require("express");
const router = express.Router();
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const { home, filterProperties, propertysend } = require("../controller/home"); 

router.get("/", restrictToLoggedinUserOnly, home); 
router.get("/filter", restrictToLoggedinUserOnly,filterProperties);
router.get("/property",restrictToLoggedinUserOnly, propertysend);

module.exports = router;
