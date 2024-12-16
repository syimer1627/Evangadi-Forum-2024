const express = require("express");
const router = express.Router();
// import user controller 
const {register,login,checkUser}= require("../controller/userController")


// Register route
router.post("/register",register);

// Login route

router.post("/login",login);

// check user

router.get("/check", checkUser);

module.exports = router;
