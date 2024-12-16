const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, password, firstname, lastname, email } = req.body;
  if (!username || !password || !firstname || !lastname || !email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }
  try {
    const [user] = await dbConnection.query(
      "select username,email from users where username=? or email=?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Conflict", message: "User already existed" });
    }
    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Password must be at least 8 characters",
      });
    }
    // encrypting pass word

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    await dbconnection.query(
      "INSERT INTO users (username,firstname,lastname,password,email) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, hashedpassword, email]
    );
    return res.status(StatusCodes.CREATED).json({ msg: "user created" });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }
  try {
    const [user] = await dbConnection.query(
      "select username,userid,password from users where email=?",
      [email]
    );
    // return res.json({user: user})
    if (user.length == 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }
    // //compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }

    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid },"secret", {
      expiresIn: "1d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "User login successful", token: token });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function checkUser(req, res) {
  const { userid, username } = req.user;

  res.status(200).json({
    message: "Valid user",
    username: username,
    userid: userid,
  });
}

module.exports = { register, login, checkUser };
