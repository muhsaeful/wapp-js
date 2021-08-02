const express = require("express");
const user = express.Router();

// authentication
const authe = require('../authentication/_index_authentication');

//1. login
//2. register

/**opsional
 * verify (endpoint untuk verifikasi login/forget/reset)
 * aktivasi (endpoint untuk aktivasi registrasi)
 * forget (endpoint untuk lupa password)
 * refresh (endpoint untuk resend verify code)
*/

user.post("/login",
    authe.input.loginInput,
    authe.user.login,
    authe.jwt.sign
);

module.exports = user;