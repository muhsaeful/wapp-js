const user = require('./authe_user');
const jwt = require('./authe_jwt');
const whatsapp = require('.//authe_whatsapp');

const authe = {}

authe.user = user;
authe.jwt = jwt;
authe.whatsapp = whatsapp;

module.exports = authe;