const express = require("express");
const {
  askQuestion,
  getAllQuestions,
  getSingleQuestion,
} = require("../controller/questionController");
// const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Post a new question
router.post("/", askQuestion);

// Get all questions
router.get("/", getAllQuestions);

// Get a single question by ID
router.get("/:question_id", getSingleQuestion);

module.exports = router;
