'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');
const { Course } = require('./models');

// Construct a router instance.
const router = express.Router();

// setup a friendly greeting for the root route
router.get('/',   (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

// USERS ROUTES
// setup a user GET route
router.get('/api/users', authenticateUser, asyncHandler( async (req,res) => {
    const user = req.currentUser;

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

// setup a user POST route
router.post('/api/users', async (req,res) => {
    try {
        console.log("req.body", req.body)
        await User.create(req.body);
        res.status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
});

// COURSES ROUTES
// setup a course GET route that returns all courses including the User that owns each course and a 200 HTTP status code
router.get('/api/courses', async (req, res) => {
    res.locals.courses = await Course.findAll();
    const courses = res.locals.courses;

    const processedCourses = [];

    for (const course of courses) {
        course.user = await User.findByPk(course.id);

        processedCourses.push({
            id: course.id,
            title: course.title,
            description: course.description,
            estimatedTime: course.estimatedTime,
            userId: course.userId,
            user: {
                id: course.user.id,
                firstName: course.user.firstName,
                lastName: course.user.lastName,
               email: course.user.emailAddress,
            }
        });
    };

    res.json(processedCourses);

});

// setup a course GET route that returns corresponding course with a 200 HTTP status code
router.get('/api/courses/:id', async (req,res) => {
    res.locals.course = await Course.findByPk(req.params.id);
    const course = res.locals.course;
    course.user = await User.findByPk(course.id);
    res.json({
        id: course.id,
        title: course.title,
        description: course.description,
        estimatedTime: course.estimatedTime,
        userId: course.userId,
        user: {
        id: course.user.id,
            firstName: course.user.firstName,
            lastName: course.user.lastName,
            email: course.user.emailAddress,
    }});
});

// setup a course POST route that will create a new course
// set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content
router.post('/api/courses', async (req, res) => {
    try {
        console.log("req.body", req.body)
        await Course.create(req.body);
        res.status(201).json({ "message": "Course successfully created!" });
        // res.location('/api/courses/' + req.body.id);
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
});

// setup a course PUT route that will update course + 204 HTTP status code
router.put('/api/courses/:id', (req,res) => {

});

// setup a course DELETE route that will delete course + 204 HTTP status code
router.delete('/api/courses/:id', (req,res) => {

});

// send 404 if no other route matched
router.use((req, res) => {
    res.status(404).json({
        message: 'Route Not Found',
    });
});

module.exports = router;