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
    ],
    attendance: [
        {
            student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
            records: [
                {
                    date: { type: Date, required: true },
                    present: { type: Boolean, required: true }
                }
            ]
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model("Course", courseSchema);
