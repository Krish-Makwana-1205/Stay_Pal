const express = require("express");
const router = express.Router();
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const { home, filterProperties, property } = require("../controller/home"); 

router.get("/", restrictToLoggedinUserOnly, home); 
router.get("/filter", restrictToLoggedinUserOnly,filterProperties);
router.get("/property",restrictToLoggedinUserOnly, property);

module.exports = router;
