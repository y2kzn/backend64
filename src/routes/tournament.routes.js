const express = require("express");
const router = express.Router();
const TournamentXController = require("../controllers/tournamentx.controller");

router.get("/active", TournamentXController.Active);
router.get("/active/v2", TournamentXController.Active);
router.post("/:tournamentId/join/v2", TournamentXController.Join); // Corrigir!!!!
router.post("/:tournamentId/leave", TournamentXController.Leave);
router.post("/:tournamentId/finish", TournamentXController.Finish);

module.exports = router;