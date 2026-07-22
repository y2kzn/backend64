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
    "id": 13829,
    "headerText": "Zantares 即将到来",
    "contentText": "腐化正在各个活动中蔓延……准备加入战斗。立即查看",
    "language": "ZH-CN",
    "newsType": "1",
    "imagePath": "/file/get/zantares-teaser-news.png",
    "targetUrl": "https://bit.ly/zantaresteaser",
    "timestamp": "2026-03-25T16:15:49.1763524Z",
    "startsAt": "2026-03-25T10:00:00Z",
    "endsAt": "2026-03-31T10:00:00Z",
    "allowedPlatforms": [],
    "excludedPlatforms": [
      "XBOX",
      "PLAYSTATION",
      "SWITCH"
    ]
  },
  {
    "id": 13828,
    "headerText": "Zantares komt eraan",
    "contentText": "Corruptie verspreidt zich over de events… Maak je klaar om mee te vechten. Bekijk het nu",
    "language": "NL",
    "newsType": "1",
    "imagePath": "/file/get/zantares-teaser-news.png",
    "targetUrl": "https://bit.ly/zantaresteaser",
    "timestamp": "2026-03-25T16:15:49.1763524Z",
    "startsAt": "2026-03-25T10:00:00Z",
    "endsAt": "2026-03-31T10:00:00Z",
    "allowedPlatforms": [],
    "excludedPlatforms": [
      "XBOX",
      "PLAYSTATION",
      "SWITCH"
    ]
  },
  {
    "id": 13827,
    "headerText": "Zantares geliyor",
    "contentText": "Yozlaşma etkinliklere yayılıyor… Savaşa katılmaya hazır ol. Hemen göz at",
    "language": "TR",
    "newsType": "1",
    "imagePath": "/file/get/zantares-teaser-news.png",
    "targetUrl": "https://bit.ly/zantaresteaser",
    "timestamp": "2026-03-25T16:15:49.1763524Z",
    "startsAt": "2026-03-25T10:00:00Z",
    "endsAt": "2026-03-31T10:00:00Z",
    "allowedPlatforms": [],
    "excludedPlatforms": [
      "XBOX",
      "PLAYSTATION",
      "SWITCH"
    ]
  },
  {
    "id": 13826,
    "headerText": "Zantares is coming",
    "contentText": "Corruption is spreading across events… Get ready to fight. Check it out now",
    "language": "EN",
    "newsType": "1",
    "imagePath": "/file/get/zantares-teaser-news.png",
    "targetUrl": "https://bit.ly/zantaresteaser",
    "timestamp": "2026-03-25T16:15:49.1763524Z",
    "startsAt": "2026-03-25T10:00:00Z",
    "endsAt": "2026-03-31T10:00:00Z",
    "allowedPlatforms": [],
    "excludedPlatforms": [
      "XBOX",
      "PLAYSTATION",
      "SWITCH"
    ]
  },
  {
    "id": 13126,
    "headerText": "News",
    "contentText": ".gg/stumblefusion",
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