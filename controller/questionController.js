const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

async function postquestion(req, res) {
  const { title, description, tag } = req.body;
  const userid = req.user.userid;

  // Check that all required information is provided
  if (!title || !description || !tag) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Title, description, and tag should be provided!",
    });
  }

  const [questionexist] = await dbConnection.query(
    "SELECT title, description, tag FROM questions WHERE title = ? AND description = ? AND tag = ?",
    [title, description, tag]
  );
  // return res.json({user: user})
  if (questionexist.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "This Question already Created by another user" });
  }

  try {
    const questionid = uuidv4(); // Generate a unique question ID
    await dbConnection.query(
      "INSERT INTO questions (title, questionid, userid, description, tag, createdAt) VALUES (?, ?, ?, ?,?, ?)",
      [title, questionid, userid, description, tag, new Date()]
    );

    // Respond with a success message
    return res.status(StatusCodes.CREATED).json({
      msg: "Question posted successfully!",
      questionId: questionid,
      title: title,
      question: description,
      tag: tag,
      created_at: createdAt,
    });
  } catch (error) {
    console.error("Error posting question:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, try again later!",
    });
  }
}

async function getAllQuestions(req, res) {
  try {
    // Query to get all questions
    const [questions] = await dbConnection.query(
      "SELECT questionid, title, description, tag,createdAt FROM questions ORDER BY createdAt DESC"
    );

    // Check if there are questions
    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "No questions found.",
      });
    }

    // Respond with the questions
    return res.status(StatusCodes.OK).json({
      msg: "Questions retrieved successfully!",
      questions: questions,
    });
  } catch (error) {
    console.error("Error retrieving questions:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, try again later!",
    });
  }
}

// get questions by id

async function getQuestionById(req, res) {
  const { questionid } = req.params; // Extract questionid from URL parameters

  // Check that question ID is provided
  if (!questionid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Question ID is required!",
    });
  }

  try {
    // Query to get the question with the specified questionid
    const [questions] = await dbConnection.query(
      "SELECT questionid, title, description, tag FROM questions WHERE questionid = ?",
      [questionid]
    );

    // Check if any questions were found
    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "No questions matching the given ID.",
      });
    }

    // Respond with the question
    return res.status(StatusCodes.OK).json({
      msg: "The question retrieved successfully!",
      question: questions[0], // Return the first question object
    });
  } catch (error) {
    console.error("Error retrieving question:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, try again later!",
    });
  }
}

module.exports = { postquestion, getAllQuestions, getQuestionById };
