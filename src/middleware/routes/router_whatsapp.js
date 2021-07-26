const express = require("express");
const whatsapp = express.Router();
const { auth } = require("../authentication/auth_whatsapp");

// controller
const controller = require("../../controllers/_index_controllers");

whatsapp.get('/qrcode/:name', controller.qrcode.qrcode)
whatsapp.post('/create', controller.whatsapp.build);
whatsapp.post('/sendtext', controller.send_message.sendtext);
whatsapp.post('/sendmedia', controller.send_message.sendmedia);

module.exports = whatsapp;