const express = require("express");

const router = express.Router();

// Get answers for a specific question
router.get("/:questionId", (req, res) => {
    res.send(`Retrieve answers for question ID: ${req.params.questionId}`);
});

// Post an answer to a question
router.post("/:questionId", (req, res) => {
    res.send(`Answer posted for question ID: ${req.params.questionId}`);
});

module.exports = router;