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

module.exports = { createCourse, getCourses, enrollCourse };
