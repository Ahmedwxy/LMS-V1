const express = require("express");
const router = express.Router();
const { createCourse, getCourses, enrollCourse } = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/", getCourses);

// Private
router.post("/", protect, createCourse); // instructor/admin only
router.post("/:id/enroll", protect, enrollCourse); // students only

module.exports = router;