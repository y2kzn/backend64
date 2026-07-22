const mongoose = require("mongoose");

const databases = {
    // Stumble Guys
    stumble: () => mongoose.connection.useDb("StumbleGuysPeak", { useCache: true }),
};

module.exports = databases;