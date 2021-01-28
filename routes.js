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

// setup a User POST route
router.post('/api/users', async (req,res) => {
    if (!req.body.password) return res.status(400).json({ error: 'Please provide a value for password'});
    try {
        const userDetails = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            confirmedPassword: req.body.password,
            password: req.body.password
        };

        await User.create(userDetails);
        res.location('/').status(201).end();
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
        course.user = await User.findByPk(course.userId);

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
    }

    res.json(processedCourses);

});

// setup a course GET route that returns corresponding course with a 200 HTTP status code
router.get('/api/courses/:id', async (req,res) => {
    res.locals.course = await Course.findByPk(req.params.id);
    const course = res.locals.course;
    course.user = await User.findByPk(course.userId);
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
router.post('/api/courses', authenticateUser, async (req, res) => {
    try {
        res.locals.course = await Course.create(req.body);
        const newCourse = res.locals.course;
        res.location(`/api/courses/${newCourse.id}`);
        res.status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({errors});
        } else {
            throw error;
        }
    }
});

// setup a course PUT route that will update course + 204 HTTP status code
router.put('/api/courses/:id', authenticateUser, async (req,res) => {
    const errors = [];

    if (!req.body.title) errors.push('Please provide a value for the title');

    if (!req.body.description) errors.push('Please provide a value for the description');

    if (errors.length > 0) res.status(400).json({errors});

    const course = await Course.findByPk(req.params.id);
    try {
        await course.update(req.body);
        res.status(204).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
});

// setup a course DELETE route that will delete course + 204 HTTP status code
router.delete('/api/courses/:id', authenticateUser, async (req,res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy();
        res.status(204).end();
    } else {
        res.status(404);
    }
});

// send 404 if no other route matched
router.use((req, res) => {
    res.status(404).json({
        message: 'Route Not Found',
    });
});

module.exports = router;