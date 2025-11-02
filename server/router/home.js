const express = require("express");
const router = express.Router();
const { home, filterProperties  } = require("../controller/home"); 

router.get("/", home); 
router.get("/filter-properties", filterProperties);

module.exports = router;
