    const express = require("express");
    const router = express.Router();

    const { registerStudent, loginStudent, getStudentProfile, updateStudentProfile } = require("../controllers/studentController");
    const { protect } = require("../middleware/authMiddleware");
    const upload = require("../middleware/uploadMiddleware");
    const { updateMany } = require("../models/studentModel");


    // @desc Register a new student
    // @route POST /api/students/
    // @access Public
    router.post("/", registerStudent);

    // @desc Login a student
    // @route POST /api/students/login
    // @access Public
    router.post("/login", loginStudent);

    // @desc Get student profile
    // @route GET /api/students/profile
    // @access Private
    router.get("/profile",protect, getStudentProfile);

    // @desc Update student profile
    // @route PUT /api/students/profile
    // @access Private
    router.put("/profile", protect, upload.single('profilePicture'), updateStudentProfile);

    module.exports = router;