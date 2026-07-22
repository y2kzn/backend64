const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.post("/login", UserController.Login);
router.get("/config", UserController.GetShared);
router.post("/update", UserController.UpdateUsername);
router.post("/inventory/selection", UserController.UserInventory);

module.exports = router;