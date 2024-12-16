const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function postAnswer(req, res) {
  const { questionid, answer } = req.body;
  const userid = req.user.userid; // Get user ID from the authenticated user

  // Check that all required information is provided
  if (!questionid || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Question ID and content are required!",
    });
  }

  try {
    // Check if the question exists
    const [existingQuestions] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (existingQuestions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Question not found!",
      });
    }

    // Check if the answer already exists
    const [existingAnswers] = await dbConnection.query(
      "SELECT * FROM answers WHERE questionid = ? AND answer = ?",
      [questionid, answer]
    );

    if (existingAnswers.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "This answer already exists for the given question.",
      });
    }

    // Insert answer into the database
    await dbConnection.query(
      "INSERT INTO answers (questionid, userid, answer,createdAt) VALUES (?,?, ?, ?)",
      [questionid, userid, answer, new Date()]
    );

    // Respond with a success message
    return res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully!",
    });
  } catch (error) {
    console.error("Error posting answer:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, try again later!",
    });
  }
}

// List of answers for single Question

async function getAnswersByQuestionId(req, res) {
  const { questionid } = req.params; // Extract questionid from URL parameters

  // Check that question ID is provided
  if (!questionid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Question ID is required!",
    });
  }

  try {
    // Query to get answers for the specified question
    const [answers] = await dbConnection.query(
      "SELECT answerid, userid, answer,createdAt FROM answers WHERE questionid = ? ORDER BY createdAt DESC",
      [questionid]
    );

    // Check if there are answers
    if (answers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "No answers found for this question.",
      });
    }

    // Respond with the answers
    return res.status(StatusCodes.OK).json({
      msg: "Answers retrieved successfully!",
      answers: answers,
    });
  } catch (error) {
    console.error("Error retrieving answers:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, try again later!",
    });
  }
}

module.exports = { postAnswer, getAnswersByQuestionId };
