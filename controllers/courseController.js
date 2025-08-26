const Course = require("../models/courseModel");
const asyncHandler = require("express-async-handler");

// Instructor creates course
const createCourse = asyncHandler(async (req, res) => {
    if (req.user.role !== "instructor" && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Only instructors or admins can create courses");
    }

    const { title, description } = req.body;

    const course = await Course.create({
        title,
        description,
        instructor: req.user._id,
    });

    res.status(201).json(course);
});

// Get all courses
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
});

// Student enrolls in course
const enrollCourse = asyncHandler(async (req, res) => {
    if (!req.user || req.user.role) {
        // If user has role field, it's instructor/admin
        if (req.user.role === "instructor" || req.user.role === "admin") {
            res.status(403);
            throw new Error("Only students can enroll");
        }
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    if (course.studentsEnrolled.includes(req.user._id)) {
        res.status(400);
        throw new Error("Already enrolled");
    }

    course.studentsEnrolled.push(req.user._id);
    await course.save();

    res.json({ message: "Enrolled successfully", course });
});

// Student unenrolls from course
const unenrollCourse = asyncHandler(async (req, res) => {
    if (!req.user || req.user.role) {
        // If user has role field, it's instructor/admin
        if (req.user.role === "instructor" || req.user.role === "admin") {
            res.status(403);
            throw new Error("Only students can unenroll");
        }
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    const studentIndex = course.studentsEnrolled.indexOf(req.user._id);
    if (studentIndex === -1) {
        res.status(400);
        throw new Error("You are not enrolled in this course");
    }

    course.studentsEnrolled.splice(studentIndex, 1);
    await course.save();

    res.json({ message: "Unenrolled successfully", course });
});

// Instructor marks attendance for students
const markAttendance = asyncHandler(async (req, res) => {
    if (req.user.role !== "instructor" && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Only instructors or admins can mark attendance");
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    const { attendanceList, date } = req.body; // [{ studentId, present }, ...]
    if (!attendanceList || !Array.isArray(attendanceList)) {
        res.status(400);
        throw new Error("Attendance list is required");
    }

    attendanceList.forEach(({ studentId, present }) => {
        if (!course.studentsEnrolled.includes(studentId)) return; // Only enrolled students

        let studentAttendance = course.attendance.find(a => a.student.toString() === studentId);
        if (!studentAttendance) {
            studentAttendance = { student: studentId, records: [] };
            course.attendance.push(studentAttendance);
        }
        studentAttendance.records.push({ date: date ? new Date(date) : new Date(), present });
    });

    await course.save();
    res.json({ message: "Attendance marked" });
});

// Student checks attendance for all courses
const getStudentAttendance = asyncHandler(async (req, res) => {
    const courses = await Course.find({ studentsEnrolled: req.user._id });
    const attendance = courses.map(course => {
        const att = course.attendance.find(a => a.student.toString() === req.user._id.toString());
        return {
            courseId: course._id,
            title: course.title,    
            attendance: att ? att.records : []
        };
    });
    res.json(attendance);
});

// Student checks attendance for a specific course
const getStudentAttendanceByCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error("Not enrolled in this course");
    }
    const att = course.attendance.find(a => a.student.toString() === req.user._id.toString());
    res.json({
        courseId: course._id,
        title: course.title,
        attendance: att ? att.records : []
    });
});

module.exports = { createCourse, getCourses, enrollCourse, unenrollCourse, markAttendance, getStudentAttendance, getStudentAttendanceByCourse };
