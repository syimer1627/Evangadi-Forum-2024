const express = require('express');
const router = express.Router();
// Authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

router.get("/all-questions",authMiddleware,(res,req) =>{
    res.setEncoding("all questions")
})
module.exports=router