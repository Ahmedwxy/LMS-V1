const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
const app = express()
const studentRoute = require('./routes/studentRoute')
const Student = require('./models/studentModel')
const instructorRoute = require('./routes/instructorRoute')
const courseRoute = require('./routes/courseRoute')
require('dotenv').config();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Allow all origins (for dev)
app.use(cors());

//routes

app.use("/api/students", studentRoute);
app.use("/api/instructors", instructorRoute);
app.use("/api/courses", courseRoute);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
  console.log('Connected to MongoDB')
  app.listen(3000, () => {
    console.log('Server is running on port 3000')
  })
}).catch(err => {
  console.error('Error connecting to MongoDB:', err)
});