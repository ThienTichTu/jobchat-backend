var express = require('express');
var router = express.Router();
var auth = require("../firebase-config/auth")

const { getAuth, registerUser, loginUser, logoutUser } = require('../controller/auth');

/* GET users listing. */
router.get('/', auth, getAuth)

router.post('/login', loginUser)

router.post('/register', registerUser)

router.get('/logout', logoutUser)


module.exports = router;
