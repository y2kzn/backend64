const express = require("express");
const helmet = require('helmet');
const cors = require("./cors");
const auth = require("./auth.middleware");

const shield = [
    helmet(),
    helmet.hidePoweredBy(),
    helmet.noSniff(),
    cors,
    auth,
    express.json()
];

module.exports = {
    shield
};