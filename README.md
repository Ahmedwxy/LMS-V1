# Learning Management System.

This is my ongoing backend learning project built with **Node.js**, **Express**, and **MongoDB**.  
I have added students, instructors, and courses. Students can login to check for available courses, enroll and unenroll from the courses. Instructors can login and create new courses for students to enroll in.

New:
Instructors can mark/update attendance of enrolled students. students can view their attendance.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ahmedwxy/LMS-V1.git
cd LMS-V1
```
2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the project root:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Usage
Start the server in development mode:
```bash
npm run server
```
Start the server in production mode:
```bash
npm start
```

## API Endpoints
Student Routes
```http
POST /api/students              # Register a new student
POST /api/students/login        # Login and get token
GET  /api/students/profile      # Get logged-in student (requires token)
PUT  /api/students/profile      # Update student profile (name, password, profile picture)
```

Instructor Routes
```http
POST    /api/instructors/          # Register instructor
POST    /api/instructors/login     # Login and get token
GET     /api/instructors/profile   # Get logged-in instrustor (requires token)
PUT     /api/instructors/profile   # Update instructor profile (name, password, profile picture)
```

Course Routes
```http
GET     /api/courses/                # Get all courses (PUBLIC)
POST    /api/courses/                # Create Courses (Only admin or instructor could do so)
POST    /api/courses/:id/enroll      # Enroll in a course as a student
POST    /api/courses/:id/unenroll    # Unenroll from a course as a student
POST    /api/courses/:id/attendance  # Mark attendance as instructor 
GET     /api/courses/attendance      # Check attendance of all courses as student
GET     /api/courses/:id/attendance  # Check attendance of a course as student
```

## Modules Used
express — Web framework for API
mongoose — MongoDB object modeling
bcrypt / bcryptjs — Password hashing
jsonwebtoken — JWT authentication
dotenv — Load environment variables
express-async-handler — Error handling
multer — File upload middleware (for profile pictures)
nodemon (dev) — Auto-reload server

## Future Changes
1. Adding a functionality where a instructor could not login without a special admin token, basically protecting the instructor registration route
2. Adding attendance functionality, grading system, assignments and some more ideas.
3. Adding reset password functionality for students.

## Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change.
