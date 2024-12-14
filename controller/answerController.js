const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

async function postAnswer(req, res) {
  const { questionid, answer } = req.body;
  const userid = req.user.userid;

  if (!questionid || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide answer" });
  }

  try {
    const answerid = crypto.randomUUID();
    await dbConnection.query(
      "INSERT INTO answers (answerid, userid, questionid, answer) VALUES (?, ?, ?, ?)",
      [answerid, userid, questionid, answer]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Answer posted successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: "Internal Server Error",
        message: "An unexpected error occurred.",
      });
  }
}

async function getAnswersForQuestion(req, res) {
  const questionid = req.params.question_id;

  try {
    const [answers] = await dbConnection.query(
      "SELECT * FROM answers WHERE questionid = ?",
      [questionid]
    );

    if (answers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({
          error: "Not Found",
          message: "No answers found for this question.",
        });
    }

    return res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: "Internal Server Error",
        message: "An unexpected error occurred.",
      });
  }
}

module.exports = { postAnswer, getAnswersForQuestion };