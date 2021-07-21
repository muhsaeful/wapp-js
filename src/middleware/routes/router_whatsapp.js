const express = require("express");
const whatsapp = express.Router();
const { auth } = require("../authentication/auth_whatsapp");

// controller
const {
    build,
    sendtext,
    sendmedia
} = require("../../controllers/whatsapp");

whatsapp.post('/create', build);
whatsapp.post('/sendtext', sendtext);
whatsapp.post('/sendmedia', sendmedia);

module.exports = whatsapp;