const express = require("express");
const router = express.Router();
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const { home, filterProperties, propertysend, applyForProperty, getOwnerApplications} = require("../controller/home"); 

router.get("/", restrictToLoggedinUserOnly, home); 
router.get("/filter", restrictToLoggedinUserOnly,filterProperties);
router.get("/property",restrictToLoggedinUserOnly, propertysend);
router.post("/apply",restrictToLoggedinUserOnly , applyForProperty);
router.get("/owner/applications",restrictToLoggedinUserOnly,getOwnerApplications);

module.exports = router;
