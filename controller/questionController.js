const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");
const { v4: uuidv4 } = require("uuid");


// POST function to create a new question
async function postQuestions(req, res) {
  const { title, description } = req.body;
  const userid = req.user.userid; // Assuming authMiddleware adds user data

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Title and description are required." });
  }

  try {
    const questionid = uuidv4();
    const query =
      "INSERT INTO questions (userid, title, description,questionid) VALUES (?, ?, ?,?)";
    await dbConnection.query(query, [userid, title, description, questionid]);
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question created successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred" });
  }
}

// GET function to fetch all questions
async function allQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query("SELECT * FROM questions");
    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found." });
    }
    return res.status(StatusCodes.OK).json(questions);
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}

// GET function to fetch a single question by ID
async function singleQuestion(req, res) {
  const { questionid } = req.params;
  try {
    const [question] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [questionid]
    ); 
    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found." });
    }
    return res.status(StatusCodes.OK).json(question[0]);
  } catch (error) { 
    
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}
module.exports = {
  postQuestions,
  allQuestions,
  singleQuestion,
};
