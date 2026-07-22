const express = require("express");
const router = express.Router();
const RoundController = require("../controllers/round.controller");

router.post("/finish/v3/:region/:appId/:sessionId", RoundController.FinishRoundV3);
router.post("/customroundfinish/:region/:appId/:sessionId", RoundController.CustomRoundFinish);
router.post("/tournament/finish/v2", RoundController.FinishRoundV2); // Corrigir!!!!

module.exports = router;