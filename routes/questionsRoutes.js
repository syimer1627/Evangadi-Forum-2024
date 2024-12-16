const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  postquestion,
  getAllQuestions,
  getQuestionById,
} = require("../controller/questionController");

// post question
router.post("/add-question", postquestion);

// get question

router.get("/all-questions", getAllQuestions);

// get question by id

router.get("/all-questions/:questionid", getQuestionById);

module.exports = router;
