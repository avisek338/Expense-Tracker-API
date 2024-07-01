const express = require('express')
const router = express.Router()
const {register,login} = require('../controllers/auth');
const { route } = require('express/lib/router');

router.route('/register').post(register);
router.route('/login').post(login);

module.exports = router