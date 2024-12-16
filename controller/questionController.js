const dbconnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function getAllQuestions(req, res) {
    try {
        const [questions] = await dbconnection.query("SELECT * FROM questions");
        return res.status(StatusCodes.OK).json({ questions });
    } catch (error) {
        console.error(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to fetch questions" });
    }
}

async function getQuestionById(req, res) {
    const { id } = req.params;

    try {
        const [question] = await dbconnection.query("SELECT * FROM questions WHERE question_id = ?", [id]);
        if (question.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found" });
        }
        return res.status(StatusCodes.OK).json({ question: question[0] });
    } catch (error) {
        console.error(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to fetch the question" });
    }
}

async function createQuestion(req, res) {
    const { title, description } = req.body;
    const userId = req.user.userid;

    if (!title || !description) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide title and description" });
    }

    try {
        await dbconnection.query(
            "INSERT INTO questions (title, description, user_id) VALUES (?, ?, ?)",
            [title, description, userId]
        );
        return res.status(StatusCodes.CREATED).json({ msg: "Question created successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to create the question" });
    }
}

module.exports = { getAllQuestions, getQuestionById, createQuestion };
