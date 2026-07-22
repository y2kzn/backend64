const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const tournamentRoutes = require("./tournament.routes");
const roundRoutes = require("./round.routes");
const newsRoutes = require("./news.routes");
const highscoreRoutes = require("./highscore.routes");

// Import Controllers (example for shared config)
const UserController = require("../controllers/user.controller");
router.get("/shared/:version/:type", UserController.GetShared);
// end



// Here you can add more routes for other controllers as needed
router.use("/user", userRoutes);
router.use("/tournamentx", tournamentRoutes);
router.use("/round", roundRoutes);
router.use("/news", newsRoutes);
router.use("/highscore", highscoreRoutes);

module.exports = router;