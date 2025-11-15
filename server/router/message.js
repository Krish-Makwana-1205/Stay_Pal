const express = require("express");
const router = express.Router();
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const {postMessage, getChat} = require('../controller/message');

router.post("/post",restrictToLoggedinUserOnly, postMessage);
router.get("/",restrictToLoggedinUserOnly, getChat);


module.exports = router;