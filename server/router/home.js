const express = require("express");
const router = express.Router();
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const { home, filterProperties, propertysend, applyForProperty, getApplicationsForOwner} = require("../controller/home"); 

router.get("/", restrictToLoggedinUserOnly, home); 
router.get("/filter", restrictToLoggedinUserOnly,filterProperties);
router.get("/property",restrictToLoggedinUserOnly, propertysend);
router.post("/apply",restrictToLoggedinUserOnly , applyForProperty);
router.get("/owner/applications",restrictToLoggedinUserOnly,getApplicationsForOwner);

module.exports = router;
