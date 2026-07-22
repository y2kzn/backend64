const express = require("express");
const router = express.Router();
const HighscoreController = require("../controllers/highscore.controller");

router.get("/rank/list", HighscoreController.GetTrophyRanking);
router.get("/crowns/list", HighscoreController.GetCrownsRanking);

module.exports = router;