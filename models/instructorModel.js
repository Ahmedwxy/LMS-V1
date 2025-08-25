const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");


//instructor 
const instructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a user name"],
    },
    email: {
        type: String,
        required: [true, "Please enter a user email"],
        unique: true,
    },
    subject: {
        type: String,
        required: [true, "Please enter the subject that you teach"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
    },
    role: {
        type: String,
        enum: ["instructor", "admin"],
        default: "instructor"
    },
    profilePicture: {
        type: String,
        default: null
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true
});


// Hash password before saving if modified
instructorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


module.exports = mongoose.model("instructor", instructorSchema);
