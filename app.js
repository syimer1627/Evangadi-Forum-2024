require("dotenv").config();

const express = require("express");
const app = express();
const port = 5550;

// db connection
const dbConnection = require("./db/dbConfig.js");

// authorization middleware
const authMiddleware = require("./middleware/authMiddleware");

// user route middleware file
const UserRoutes = require("./routes/userRoute");

//questions middleware file
const questionsRoutes = require("./routes/questionRoute");
// answers middleware file
const answersRoutes = require("./routes/answerRoute");
//json middleware to extract json data
app.use(express.json());

// user route middleware
app.use("/api/users", UserRoutes);
//questions routes middleware
app.use("/api/questions", authMiddleware, questionsRoutes);

//answer routes middleware

app.use("/api/answers", authMiddleware, answersRoutes);

async function start() {
  try {
    const result = await dbConnection.execute("select'test' ");
    app.listen(port);
    console.log("database connection established");
    console.log(`listening on port ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
