const express = require("express");
const router = express.Router();
const {
  postQuestions,
  allQuestions,
  singleQuestions,
} = require("../controller/questionController");

// Routes for questions
router.post("/", askQuestion);
router.get("/", getAllQuestions);
router.get("/:question_id", getSingleQuestion);

module.exports = router;