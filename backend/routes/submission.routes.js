// submissions
const express = require("express");
const {
  
  submitAnswer,
} = require("../controller/submission.controller");

const { isAuthenticated } = require("../middleware/Auth");
const router = express.Router();

router.route("/create").post(submitAnswer);

module.exports = router;
