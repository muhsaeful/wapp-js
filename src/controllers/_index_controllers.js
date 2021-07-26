const send_message = require("./whatsapp/send_message");
const whatsapp = require("./whatsapp/whatsapp");
const qrcode = require("./whatsapp/qrcode");

const controller = {};

controller.whatsapp = whatsapp;
controller.send_message = send_message;
controller.qrcode = qrcode;
module.exports = controller;