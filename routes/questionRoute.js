const express = require("express");
const router = express.Router();
const {
  postQuestions,
  allQuestions,
  singleQuestion,
} = require("../controller/questionController");

//post question route
router.post("/post-questions", postQuestions)

//all questions route
router.get("/", allQuestions);

//single question route
router.get("/single-question/:questionid", singleQuestion);
module.exports = router;
