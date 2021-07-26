const phone_format = require("./phone_format");
const moment = require("./moment");
const img_to_base64 = require("./img_to_base64");

const helpers = {}
helpers.phoneFormat = phone_format;
helpers.moment = moment;
helpers.imgToBase64 = img_to_base64;

module.exports = helpers;