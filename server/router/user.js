const express = require('express');
const {makeUser, loginUser} = require('../controller/user');

const router = express.Router();

router.post('/registeration', makeUser);
router.post('/login', loginUser);
module.exports = router;