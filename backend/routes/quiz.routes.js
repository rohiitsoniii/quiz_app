const express = require("express");
const {
  createQuiz,
  getAllQuiz,
  getQuizById,
  deleteQuiz,
  addImpression,
  dashboard,
} = require("../controller/quiz.controller");

const { isAuthenticated } = require("../middleware/Auth");
const router = express.Router();

router.route("/create").post(isAuthenticated, createQuiz);

router.route("/").get(isAuthenticated, getAllQuiz);

router.route("/dashboard").get(isAuthenticated, dashboard);


router
  .route("/:id")
  .patch( addImpression)
  .get(getQuizById)
  .delete(deleteQuiz);

module.exports = router;
