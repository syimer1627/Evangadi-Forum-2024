const express = require("express");
const router = express.Router();
const {
  askQuestion,
  getAllQuestions,
  getSingleQuestions,
} = require("../controller/questionController");

// Routes for questions
router.post("/", askQuestion);
router.get("/", getAllQuestions);
router.get("/:question_id", getSingleQuestions);

module.exports = router;

