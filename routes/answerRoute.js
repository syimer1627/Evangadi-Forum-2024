const express = require("express");
const router = express.Router();

// Import controller functions
const {
  postAnswer,
  allAnswers,
  singleAnswer,
} = require("../controller/answerController");

// Route to post an answer (POST)
router.post("/post-answer", postAnswer);

// Route to get all answers for a specific question (GET)
router.get("/:questionid", allAnswers);

// Route to get a single answer by its ID (GET)
router.get("/single/:answerid", singleAnswer);

module.exports = router;
