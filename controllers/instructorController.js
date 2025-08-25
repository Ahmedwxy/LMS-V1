const jwt = require("jsonwebtoken");
const Instructor = require("../models/instructorModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// Register Instructor
const registerInstructor = asyncHandler(async (req, res) => {
    const { name, email, subject, password } = req.body;

    const exists = await Instructor.findOne({ email });
    if (exists) {
        res.status(400);
        throw new Error("Instructor already exists");
    }

    const instructor = await Instructor.create({
        name,
        email,
        subject,
        password, 
    });

    if (instructor) {
        res.status(201).json({
            _id: instructor._id,
            name: instructor.name,
            email: instructor.email,
            subject: instructor.subject,
            token: generateToken(instructor._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid instructor data");
    }
});

// Login Instructor
const loginInstructor = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const instructor = await Instructor.findOne({ email });

    if (instructor && (await bcrypt.compare(password, instructor.password))) {
        res.json({
            _id: instructor._id,
            name: instructor.name,
            email: instructor.email,
            subject: instructor.subject,
            token: generateToken(instructor._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid credentials");
    }
});

// Get Instructor Profile
const getInstructorProfile = asyncHandler(async (req, res) => {
    const instructor = await Instructor.findById(req.user._id).select("-password");
    if (instructor) {
        res.json(instructor);
    } else {
        res.status(404);
        throw new Error("Instructor not found");
    }
});

// Update Instructor Profile
const updateInstructorProfile = asyncHandler(async (req, res) => {
    const instructor = await Instructor.findById(req.user._id);

    if (!instructor) {
        res.status(404);
        throw new Error("Instructor not found");
    }

    instructor.name = req.body.name || instructor.name;
    instructor.subject = req.body.subject || instructor.subject;
    instructor.email = req.body.email || instructor.email;

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        instructor.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedInstructor = await instructor.save();
    res.json(updatedInstructor);
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

module.exports = {
    registerInstructor,
    loginInstructor,
    getInstructorProfile,
    updateInstructorProfile,
};
