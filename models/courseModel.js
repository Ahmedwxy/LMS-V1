const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a course title"],
    },
    description: {
        type: String,
        required: [true, "Please enter a course description"],
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "instructor",
        required: true,
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model("Course", courseSchema);
