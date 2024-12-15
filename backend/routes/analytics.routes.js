const express = require("express");
const { createQuiz, getAllQuiz } = require("../controller/quiz.controller");

const { isAuthenticated } = require("../middleware/Auth");

const router = express.Router();

router.route("/create").post(isAuthenticated, createQuiz);

router.route("/").get(getAllQuiz);

module.exports = router;
