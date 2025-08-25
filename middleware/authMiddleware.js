const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel");
const Instructor = require("../models/instructorModel");

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Look for Student first, then Instructor
            let user = await Student.findById(decoded.id).select("-password");
            if (!user) {
                user = await Instructor.findById(decoded.id).select("-password");
            }

            if (!user) {
                res.status(401);
                throw new Error("Not authorized, user not found");
            }

            req.user = user; // generic "user"
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

// Middleware to check admin role
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized as admin");
    }
};

module.exports = { protect, admin };
