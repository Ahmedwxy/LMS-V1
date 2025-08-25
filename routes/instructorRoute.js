const express = require("express");
const router = express.Router();
const {
    registerInstructor,
    loginInstructor,
    getInstructorProfile,
    updateInstructorProfile,
} = require("../controllers/instructorController");

const { protect } = require("../middleware/authMiddleware");

// Routes
router.post("/", registerInstructor);
router.post("/login", loginInstructor);
router.get("/profile", protect, getInstructorProfile);
router.put("/profile", protect, updateInstructorProfile);

module.exports = router;
