const express = require("express");
const router = express.Router();
const NewsController = require("../controllers/news.controller");

router.get("/getall", NewsController.GetAllNews);

module.exports = router;