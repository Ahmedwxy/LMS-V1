const express = require("express");
const router = express.Router();
const { createCourse, getCourses, enrollCourse, unenrollCourse, markAttendance, getStudentAttendance, getStudentAttendanceByCourse } = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/", getCourses);

// Private
router.post("/", protect, createCourse); // instructor/admin only
router.post("/:id/enroll", protect, enrollCourse); // students only
router.post("/:id/unenroll", protect, unenrollCourse); // students only
router.post("/:id/attendance", protect, markAttendance); // instructor only // { attendanceList: [{studentId, present}], date }
router.get("/attendance", protect, getStudentAttendance); // students only
router.get("/:id/attendance", protect, getStudentAttendanceByCourse); // students only
module.exports = router;