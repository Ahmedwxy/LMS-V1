const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

//@desc Register a new user
//@route POST /api/users/
//@access Public
const registerStudent = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const studentExists = await Student.findOne
        ({ email });
    if (studentExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create user
    const student = await Student.create({
        name,
        email,
        password,
    });
    if (student) {
        res.status(201).json({
            _id: student._id,
            name: student.name,
            email: student.email,
            token: generateToken(student._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

//@desc Authenticate a user
//@route POST /api/users/login
//@access Public
const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const student = await Student.findOne({ email });
    if (student && (await bcrypt.compare(password, student.password))) {
        res.json({
            _id: student._id,
            name: student.name,
            email: student.email,
            token: generateToken(student._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }
});

//@desc Get user data
//@route GET /api/users/profile
//@access Private
const getStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.student._id).select("-password");
    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

//@desc Update user profile
//@route PUT /api/users/profile
//@access Private
const updateStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.student._id);
        if (!student) {
            return res.status(404).json({ message: "User not found" });
        }

        //If name/email change is requested, handle it here
        if (req.body.name || req.body.email) {
            const match = await bcrypt.compare(req.body.oldPassword, student.password);
            if (!match) {
                return res.status(400).json({ message: "Old password is incorrect" });
            }
            student.name = req.body.name || student.name;
            student.email = req.body.email || student.email;
        }

        //Profile picture upload
        if (req.file) {
            student.profilePicture = `/uploads/${req.file.filename}`;
        }

        //If password change is requested, handle it here
        if (req.body.newPassword) {
            if (!req.body.oldPassword) {
                return res.status(400).json({ message: 'Old password is required to set a new one' });
            }

            const isMatch = await bcrypt.compare(req.body.oldPassword, student.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Old password is incorrect' });
            }

            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(req.body.newPassword, salt);
        }

        // Save updated user
        await student.save();
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//@desc Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}

module.exports = {
    registerStudent,
    loginStudent,
    getStudentProfile,
    updateStudentProfile
};