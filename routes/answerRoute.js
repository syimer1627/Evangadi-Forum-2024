const express = require("express");
const router = express.Router();



const { postAnswer } = require("../controller/answerController");
const { getAnswersByQuestionId } = require("../controller/answerController");

router.get("/all-answers/:questionid", getAnswersByQuestionId);



router.post("/add-answers", postAnswer);

module.exports = router;
