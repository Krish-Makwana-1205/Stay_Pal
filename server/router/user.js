const express = require('express');
const {makeUser, loginUser, provideUser} = require('../controller/user');
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');

const router = express.Router();

router.post('/registeration', makeUser);
router.post('/login', loginUser);
router.get('/me', restrictToLoggedinUserOnly, provideUser)
module.exports = router;