const express = require("express");
const router = express.Router();
const { restrictToLoggedinUserOnly } = require('../middleware/logincheck');

const { postMessage, getChat, getChatList } = require('../controller/message');

router.post("/post", restrictToLoggedinUserOnly, postMessage);
router.get("/", restrictToLoggedinUserOnly, getChat);
router.get("/list", restrictToLoggedinUserOnly, getChatList);

module.exports = router;
