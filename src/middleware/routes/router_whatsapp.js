const express = require("express");
const whatsapp = express.Router();

// controller
const controller = require("../../controllers/_index_controllers");

// authentication
const authe = require('../authentication/_index_authentication');

// authorization
const autho = require('../authorization/_index_authorization');


// router
whatsapp.get('/qrcode/:name', controller.qrcode.qrcode);
whatsapp.post('/create',
    authe.whatsapp.createInput,
    authe.jwt.verify,
    autho.whatsapp.createLimit,
    controller.whatsapp.build
);

whatsapp.post('/sendtext', controller.send_message.sendtext);
whatsapp.post('/sendmedia', controller.send_message.sendmedia);

module.exports = whatsapp;