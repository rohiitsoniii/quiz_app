const express = require('express');
const {  Login,Register } = require('../controller/user.controller');

const router = express.Router();

router.route("/login").post(Login);
router.route("/register").post(Register);

module.exports = router;
