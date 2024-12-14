const express = require("express");
const router = express.Router();

// Get all questions
router.get('/', (req, res) => {
    res.send("Retrieve all questions");
});

// Get a specific question by ID
router.get('/:id', (req, res) => {
    res.send(`Retrieve question with ID: ${req.params.id}`);
});

// Create a new question
router.post('/', (req, res) => {
    res.send("New question created");
});

module.exports = router;