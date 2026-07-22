// Core
const express = require("express");
const app = express();
const path = require("path");

// Routes
const stumbleRoutes = require("./routes/index");

// Import Middlewares
const { shield } = require("./middlewares");

// Global Middlewares
app.use(shield);

// Database
require("./services/mongo.connection");

// Request Log
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

// API Routes
app.use("/", stumbleRoutes);
app.use("/file/get", express.static(path.join(__dirname, "shared", "images")));

module.exports = app;