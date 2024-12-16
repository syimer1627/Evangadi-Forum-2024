const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
 const { username, firstname, lastname, email, password } = req.body;
 if (!email || !password || !firstname || !lastname || !username) {
   return res
     .status(StatusCodes.BAD_REQUEST)
     .json({ msg: "please provide all required fields!" });
 }
 try {
   const [user] = await dbConnection.query(
     "SELECT username,userid from users where username =? or email =?",
     [username, email]
   );
  // res.json({user: user})
   console.log(user);
   if (user.length > 0) {
     return res
       .status(StatusCodes.BAD_REQUEST)
       .json({ msg: "user already existed" });
   }
   if (password.length < 8) {
     return res
       .status(StatusCodes.BAD_REQUEST)
       .json({ msg: "password must be at least 8 character" });
   }
  //  //encrypt the password
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);

   await dbConnection.query(
     "INSERT INTO users(username, firstname, lastname,email,password) VALUES(? ,?, ?, ?, ?)",
     [username, firstname, lastname, email, hashedPassword]
   );
   return res.status(StatusCodes.CREATED).json({ msg: "user registered" });
 } catch (error) {
   console.log(error.message);
   return res
     .status(StatusCodes.INTERNAL_SERVER_ERROR)
     .json({ msg: "something went wrong, try again later!" });
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
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
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
