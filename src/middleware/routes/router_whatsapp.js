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
    authe.jwt.verify,
    authe.input.createInput,
    authe.whatsapp.createLimit,
    autho.whatsapp.accessDevice,
    controller.whatsapp.build
);

whatsapp.post('/sendtext',
    authe.jwt.verify,
    authe.input.sendtextInput,
    autho.whatsapp.accessDevice,
    controller.send_message.sendtext
);

whatsapp.post('/sendmedia',
    authe.jwt.verify,
    authe.input.sendmediaInput,
    autho.whatsapp.accessDevice,
    controller.send_message.sendmedia);

module.exports = whatsapp;