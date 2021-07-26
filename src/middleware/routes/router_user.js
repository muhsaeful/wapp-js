const express = require("express")
const user = express.Router()
const auth = require("../authentication/auth_user");

//1. login
//2. register

/**opsional
 * verify (endpoint untuk verifikasi login/forget/reset)
 * aktivasi (endpoint untuk aktivasi registrasi)
 * forget (endpoint untuk lupa password)
 * refresh (endpoint untuk resend verify code)
*/

user.post("/login", auth.signJWT);

module.exports = user;