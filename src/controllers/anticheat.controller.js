const path = require("path");
const crypto = require("../modules/crypto.modules");
const geoip = require('geoip-lite');

const { UserSchema } = require("../models/index");
const databases = require("../services/mongo.databases");

class controller {
    static async Report(req, res) {
        try {
            return res.json({ success: true });
        } catch (err) {
            console.error("❌ Erro ao atualizar inventário:", err);
            return res.status(500).json({ success: false });
        }
    }

}

module.exports = controller;