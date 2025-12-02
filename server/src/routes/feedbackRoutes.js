const express = require("express");
const router = express.Router();
const { createFeedback, getAllFeedback } = require("../controllers/feedbackController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/")
    .post(protect, createFeedback)
    .get(protect, admin, getAllFeedback);

module.exports = router;
