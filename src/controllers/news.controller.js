const path = require("path");
const crypto = require("../modules/crypto.modules");
const geoip = require('geoip-lite');

const { UserSchema } = require("../models/index");
const databases = require("../services/mongo.databases");

class controller {
    static async GetAllNews(req, res) {
        try {
            const filePath = path.resolve(__dirname, "../shared/config.json");
            
            return res.json([
  {
    "id": 13126,
    "headerText": "News",
    "contentText": ".gg/stumbleboxer",
    "language": "EN",
    "newsType": "1",
    "imagePath": "/file/get/menuBG.png",
    "targetUrl": "https://bit.ly/zantaresteaser2",
    "timestamp": "2026-03-25T16:15:49.1763524Z",
    "startsAt": "2026-04-05T10:00:00Z",
    "endsAt": "2026-05-31T10:00:00Z",
    "allowedPlatforms": [],
    "excludedPlatforms": [
      "XBOX",
      "PLAYSTATION",
      "SWITCH"
    ]
  }
]);
        } catch {
            res.sendStatus(500);
        }
    }
}

module.exports = controller;
