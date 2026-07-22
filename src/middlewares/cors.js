const cors = require("cors");

const allowedOrigins = [
    process.env.SITE_URL
];

module.exports = cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        return callback(new Error("Not permitted by CORS."));
    },
    credentials: true
});